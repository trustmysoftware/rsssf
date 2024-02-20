import { Feed } from "feed";
import { get_release_items, SemverSelect } from "./releases.ts";
import { TokenData } from "./db.ts";

export type ReleaseItem = {
  title: string;
  url: string;
  description?: string;
  content?: string;
  date: Date;
  author: {
    html_url: string;
    avatar_url: string;
  };
};

const generate_feed = (
  url: string,
  repo_name: string,
  releases: ReleaseItem[],
) => {
  const feed = new Feed({
    title: `${repo_name}`,
    description: "software releases",
    id: url,
    link: url,
    language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    image: "https://github.com/fluidicon.png",
    favicon: "https://github.githubassets.com/favicons/favicon-dark.svg",
    copyright: "MIT",
    generator: "Feed for Node.js",
  });

  releases.forEach((release) => {
    feed.addItem({
      title: release.title,
      id: release.url,
      link: release.url,
      description: release.description,
      content: release.content,
      date: release.date,
      image: release.author?.avatar_url || "",
      author: [{
        link: release.author?.html_url || "",
      }],
    });
  });

  feed.addCategory("Software");

  return feed.atom1();
  // feed.rss2()
  // feed.json1()
};

export const process_feed = async (
  api_token_data: TokenData,
  repo_url: string,
  semver_select: SemverSelect,
) => {
  const repo_name = repo_url.split("/").pop()!;
  const releases = await get_release_items(
    repo_url,
    api_token_data,
    semver_select,
  );
  const feed = await generate_feed(repo_url, repo_name, releases);
  return feed;
};
