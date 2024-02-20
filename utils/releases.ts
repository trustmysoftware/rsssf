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

  const greater = data
    .filter((release) => !(release.draft || release.prerelease))
    .filter(greaterThan(lastSeen, semver_select));

  const latest_new = greater.toSorted((e) =>
    semver.compare(semver.coerce(e.name)!, lastSeen)
  ).at(0);

  if (latest_new) {
    await api_tokens.findOneAndUpdate({ token: api_token_data.token }, {
      $set: {
        lastSeen: latest_new.name,
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
        description: `new major version ${release.name}`,
        author: {
          avatar_url: release.author.avatar_url,
          html_url: release.author.html_url,
        },
      } as ReleaseItem;
    });

  return items;
};

const greaterThan =
  (semver_compare: semver.SemVer, semver_select: SemverSelect) =>
  (check_element: GH_Release) => {
    const curr_semver = semver.coerce(check_element.name);

    if (!curr_semver) {
      return false;
    }

    switch (semver_select) {
      case "major":
        if (curr_semver.major >= semver_compare.major) {
          return true;
        }
        /* falls through */
      case "minor":
        if (curr_semver.minor >= semver_compare.minor) {
          return true;
        }
        /* falls through */
      case "patch":
        if (curr_semver.patch >= semver_compare.patch) {
          return true;
        }
        /* falls through */
      default:
        return false;
    }
  };
