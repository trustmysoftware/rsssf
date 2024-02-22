// @deno-types="npm:@types/semver@7.5.7"
import * as semver from "semver";

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
