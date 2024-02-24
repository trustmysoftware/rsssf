import { add } from "date-fns";
import * as semver from "semver";
import { api_tokens, TokenData } from "./db.ts";
import { ReleaseItem } from "./feed.ts";
import {
  filterReleases,
  GH_Release,
  SemverSelect,
  transformToFeed,
} from "./releases.ts";

export const get_release_items = async (
  url: string,
  api_token_data: TokenData,
  semver_select: SemverSelect,
): Promise<ReleaseItem[]> => {
  const version = Deno.env.get("DENO_DEPLOYMENT_ID") || "?";
  const code_url = "https://github.com/trustmysoftware/rsssf";

  const urlObj = new URL(url);
  const github_api_url =
    `https://api.github.com/repos${urlObj.pathname}/releases?per_page=100`;
  const dataJson = await fetch(github_api_url, {
    headers: {
      Accept: "application/vnd.github+json",
      ["X-GitHub-Api-Version"]: "2022-11-28",
      ["User-Agent"]: `RSSSF/${version} ${code_url}`,
    },
  });

  if (!dataJson.ok) {
    return [];
  }

  const data = await dataJson.json() as GH_Release[];

  const lastSeen: semver.SemVer = semver.coerce(
    api_token_data?.lastSeen || "0.0.0",
  )!;

  const filtered = filterReleases(data, lastSeen, semver_select);

  const greatest = filtered.at(0);
  if (greatest) {
    await api_tokens.findOneAndUpdate({ token: api_token_data.token }, {
      $set: {
        lastSeen: semver.coerce(greatest.name)?.toString(),
        repo: urlObj.pathname,
        expireAt: add(new Date(), { weeks: 2 }),
      },
    });
  }

  const feed_items = transformToFeed(filtered, semver_select);

  return feed_items;
};
