// @deno-types="npm:@types/semver@7.5.7"
import * as semver from "semver";
import { ReleaseItem } from "./feed.ts";

export type SemverSelect = "major" | "minor" | "patch";

export type GH_Release = {
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

const greaterThanOrExactlyEqual =
  (old_semver: semver.SemVer, semver_select: SemverSelect) =>
  (check_element: GH_Release) => {
    const curr_semver = semver.coerce(check_element.name);

    if (!curr_semver) {
      return false;
    }

    if (semver.eq(curr_semver, old_semver)) {
      return true;
    }

    switch (semver_select) {
      case "patch":
        if (curr_semver.patch > old_semver.patch) {
          return true;
        }
        /* falls through */
      case "minor":
        if (curr_semver.minor > old_semver.minor) {
          return true;
        }
        /* falls through */
      case "major":
        if (curr_semver.major > old_semver.major) {
          return true;
        }
        /* falls through */
      default:
        return false;
    }
  };

export const filterReleases = (
  releases: GH_Release[],
  lastSeen: semver.SemVer,
  semver_select: SemverSelect,
) => {
  const only_actual = releases
    .filter((release) => !(release.draft || release.prerelease));

  const greater = only_actual
    .filter((r) => semver.gte(semver.coerce(r.name)!, lastSeen))
    .filter(
      greaterThanOrExactlyEqual(lastSeen, semver_select),
    );

  const greater_sorted = greater.toSorted((e1, e2) =>
    semver.rcompare(semver.coerce(e1.name)!, semver.coerce(e2.name)!)
  );

  return greater_sorted;
};

export const transformToFeed = (
  releases: GH_Release[],
  semver_select: SemverSelect,
) => {
  const items = releases
    .map((release) => {
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
