import * as semver from "semver";
import { ReleaseItem } from "./feed.ts";

export type SemverSelect = "major" | "minor" | "patch";

export const get_release_items = async (
  url: string,
  api_token: string,
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

  const data = await dataJson.json();

  type GH_Release = any;

  let lastSeen: semver.SemVer = semver.parse("0.0.0");
  //   lastSeen = get_lastSeen(url, api_token);

  const items = data
    .filter((release: GH_Release) => !(release.draft || release.prerelease))
    .filter((release: GH_Release) => {
      switch (semver_select) {
        case "major":
          return semver.parse(release.name).major > lastSeen.major;
        case "minor":
          return semver.parse(release.name).minor > lastSeen.minor;
        case "patch":
          return semver.parse(release.name).patch > lastSeen.patch;
        default:
          return false;
      }
    })
    .map((release: GH_Release) => {
      return {
        title: release.name,
        date: new Date(release.published_at),
        url: release.html_url,
        content: release.body, // <![CDATA[ ' .nl2br($desc_data). ' ]]>
        description: `new major version ${release.name}`,
        image: release.author.gravatar_url,
      } as ReleaseItem;
    });

  return items;
};
