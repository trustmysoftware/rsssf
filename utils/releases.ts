import { add } from "date-fns";
// @deno-types="npm:@types/semver@7.5.7"
import * as semver from "semver";
import { api_tokens, TokenData } from "./db.ts";
import { ReleaseItem } from "./feed.ts";

export type SemverSelect = "major" | "minor" | "patch";

type GH_Release = {
  name: string;
  draft: boolean;
  prerelease: boolean;
  published_at: Date;
  html_url: string;
  body: string;
  author: {
    avatar_url: string;
    html_url: string;
  };
};

export const get_release_items = async (
  url: string,
  api_token_data: TokenData,
  semver_select: SemverSelect,
): Promise<ReleaseItem[]> => {
  const urlObj = new URL(url);
  const github_api_url =
    `https://api.github.com/repos${urlObj.pathname}/releases?per_page=100`;
  const dataJson = await fetch(github_api_url, {
    headers: {
      Accept: "application/vnd.github+json",
      ["X-GitHub-Api-Version"]: "2022-11-28",
    },
  });

  if (!dataJson.ok) {
    return [];
  }

  const data = await dataJson.json() as GH_Release[];

  const lastSeen: semver.SemVer = semver.coerce(
    api_token_data?.lastSeen || "0.0.0",
  )!;

  const only_actual = data
    .filter((release) => !(release.draft || release.prerelease));

  const greater = only_actual.filter((r) =>
    semver.gte(semver.coerce(r.name)!, lastSeen)
  );

  const greater_sorted = greater.toSorted((e1, e2) =>
    semver.rcompare(semver.coerce(e1.name)!, semver.coerce(e2.name)!)
  );
  const greatest = greater_sorted.at(0);

  console.log({
    lastSeen: lastSeen.toString(),
    only_actual: only_actual.map((e) => semver.coerce(e.name)?.toString()),
    greater: greater.map((e) => semver.coerce(e.name)?.toString()),
    greater_sorted: greater_sorted.map((e) =>
      semver.coerce(e.name)?.toString()
    ),
    greatest: greatest?.name,
  });

  if (greatest) {
    await api_tokens.findOneAndUpdate({ token: api_token_data.token }, {
      $set: {
        lastSeen: semver.coerce(greatest.name)?.toString(),
        repo: urlObj.pathname,
        expireAt: add(new Date(), { weeks: 2 }),
      },
    });
  }

  const items = greater
    .map((release: GH_Release) => {
      return {
        title: release.name,
        date: new Date(release.published_at),
        url: release.html_url,
        content: release.body,
        description:
          `new ${semver_select} version (or greater) ${release.name}`,
        author: {
          avatar_url: release.author.avatar_url,
          html_url: release.author.html_url,
        },
      } as ReleaseItem;
    });

  return items;
};

const greaterThan =
  (old_semver: semver.SemVer, semver_select: SemverSelect) =>
  (check_element: GH_Release) => {
    const curr_semver = semver.coerce(check_element.name);

    if (!curr_semver) {
      return false;
    }

    switch (semver_select) {
      case "patch":
        if (curr_semver.patch >= old_semver.patch) {
          return true;
        }
        /* falls through */
      case "minor":
        if (curr_semver.minor >= old_semver.minor) {
          return true;
        }
        /* falls through */
      case "major":
        if (curr_semver.major >= old_semver.major) {
          return true;
        }
        /* falls through */
      default:
        return false;
    }
  };
