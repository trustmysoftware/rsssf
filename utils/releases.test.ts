// @deno-types="npm:@types/semver@7.5.7"
import * as semver from "semver";
import { assertEquals } from "$std/assert/mod.ts";
import { filterReleases, GH_Release, SemverSelect } from "./releases.ts";

const generate_release = (overrides?: Partial<GH_Release>): GH_Release => {
  const release = {
    author: {
      avatar_url: "avatar_url",
      html_url: "html_url",
    },
    body: "changelog",
    draft: false,
    prerelease: false,
    html_url: "html_url",
    name: "0.0.0",
    published_at: new Date("2024-01-01T00:00:00.000"),
  };
  return { ...release, ...overrides };
};

Deno.test("filters out drafts and prereleases", () => {
  const releases = [
    generate_release({ name: "0.0.1", draft: true }),
    generate_release({ name: "0.0.2", prerelease: true }),
    generate_release({ name: "0.0.3" }),
  ];

  const lastSeen: semver.SemVer = semver.coerce("0.0.0")!;
  const semver_select: SemverSelect = "patch";

  const filtered = filterReleases(releases, lastSeen, semver_select);

  const names = filtered.map((r) => r.name);

  assertEquals(names, ["0.0.3"]);
});

Deno.test("returns in the right order", () => {
  const releases = [
    generate_release({ name: "2.0.0" }),
    generate_release({ name: "2.0.1" }),
    generate_release({ name: "2.1.0" }),
    generate_release({ name: "2.1.1" }),
    generate_release({ name: "0.2.2" }),
    generate_release({ name: "4.3.2" }),
    generate_release({ name: "2.3.4" }),
  ];

  const lastSeen: semver.SemVer = semver.coerce("0.0.0")!;
  const semver_select: SemverSelect = "patch";

  const filtered = filterReleases(releases, lastSeen, semver_select);

  const names = filtered.map((r) => r.name);

  assertEquals(names, [
    "4.3.2",
    "2.3.4",
    "2.1.1",
    "2.1.0",
    "2.0.1",
    "2.0.0",
    "0.2.2",
  ]);
});

Deno.test("returns greater semvers for patch", () => {
  const releases = [
    generate_release({ name: "99.0.0" }),
    generate_release({ name: "2.1.1" }),
    generate_release({ name: "1.2.1" }),
    generate_release({ name: "1.1.2" }),
    generate_release({ name: "1.1.1" }),
    generate_release({ name: "0.99.9" }),
    generate_release({ name: "0.0.99" }),
    generate_release({ name: "0.0.0" }),
  ];

  const lastSeen: semver.SemVer = semver.coerce("1.1.1")!;
  const semver_select: SemverSelect = "patch";

  const filtered = filterReleases(releases, lastSeen, semver_select);

  const names = filtered.map((r) => r.name);

  assertEquals(names, [
    "99.0.0",
    "2.1.1",
    "1.2.1",
    "1.1.2",
    "1.1.1",
  ]);
});

Deno.test("returns greater semvers for minor", () => {
  const releases = [
    generate_release({ name: "99.0.0" }),
    generate_release({ name: "2.1.1" }),
    generate_release({ name: "1.2.1" }),
    generate_release({ name: "1.1.2" }),
    generate_release({ name: "1.1.1" }),
    generate_release({ name: "0.99.9" }),
    generate_release({ name: "0.0.99" }),
    generate_release({ name: "0.0.0" }),
  ];

  const lastSeen: semver.SemVer = semver.coerce("1.1.1")!;
  const semver_select: SemverSelect = "patch";

  const filtered = filterReleases(releases, lastSeen, semver_select);

  const names = filtered.map((r) => r.name);

  assertEquals(names, [
    "99.0.0",
    "2.1.1",
    "1.2.1",
    "1.1.1",
  ]);
});

Deno.test("returns greater semvers for major", () => {
  const releases = [
    generate_release({ name: "99.0.0" }),
    generate_release({ name: "2.1.1" }),
    generate_release({ name: "1.2.1" }),
    generate_release({ name: "1.1.2" }),
    generate_release({ name: "1.1.1" }),
    generate_release({ name: "0.99.9" }),
    generate_release({ name: "0.0.99" }),
    generate_release({ name: "0.0.0" }),
  ];

  const lastSeen: semver.SemVer = semver.coerce("1.1.1")!;
  const semver_select: SemverSelect = "patch";

  const filtered = filterReleases(releases, lastSeen, semver_select);

  const names = filtered.map((r) => r.name);

  assertEquals(names, [
    "99.0.0",
    "2.1.1",
    "1.1.1",
  ]);
});
