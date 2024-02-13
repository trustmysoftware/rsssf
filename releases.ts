import { ReleaseItem } from "./feed.ts";

export const get_release_items = async (
  url: string
): Promise<ReleaseItem[]> => {
  const urlObj = new URL(url);
  const github_api_url = `https://api.github.com/repos${urlObj.pathname}/releases`;
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

  console.log({ data });

  const items = data
    .filter((release: GH_Release) => !(release.draft || release.prerelease))
    .map((release: GH_Release) => {
      return {
        title: release.name,
        date: new Date(release.published_at),
        url: release.url,
        content: release.body, // <![CDATA[ ' .nl2br($desc_data). ' ]]>
        description: `new major version ${release.name}`,
        image: release.author.gravatar_url,
      } as ReleaseItem;
    });

  return items;
};
