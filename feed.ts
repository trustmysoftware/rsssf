import { Feed } from "npm:feed";

export type ReleaseItem = {
  title: string;
  url: string;
  description?: string;
  content?: string;
  date: Date;
  image?: string;
};

export const generate_feed = (
  url: string,
  repo_name: string,
  releases: ReleaseItem[]
) => {
  const release = {
    name: "v1.34.2",
    author: {
      login: "github-actions[bot]",
      html_url: "https://github.com/apps/github-actions",
    },
  };

  const feed = new Feed({
    title: `${repo_name}`,
    description: "software releases",
    id: url,
    link: url,
    language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    image: "https://github.com/fluidicon.png", // TODO: make all the image stuff work with URLs other than github
    favicon: "https://github.githubassets.com/favicons/favicon-dark.svg", // TODO: make all the image stuff work with URLs other than github
    copyright: "MIT",
    updated: new Date(),
    generator: "Feed for Node.js",
    feedLinks: {
      json: "https://example.com/json",
      atom: "https://example.com/atom",
    },
    author: {
      name: release.author.login,
      //   email: "johndoe@example.com",
      link: release.author.html_url,
    },
  });

  releases.forEach((release) => {
    feed.addItem({
      title: release.title,
      id: release.url,
      link: release.url,
      description: release.description,
      content: release.content,
      // TODO: contributors, authors for releases?
      date: release.date,
      image: release.image,
    });
  });

  feed.addCategory("Software");

  return feed.atom1();
  // feed.rss2()
  // feed.json1()
};
