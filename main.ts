import { Application, Router } from "https://deno.land/x/oak/mod.ts";
// import { CSS } from "https://deno.land/x/gfm/mod.ts"; // TODO styles for the md
import { getQuery } from "https://deno.land/x/oak@v13.1.0/helpers.ts";

import { generate_feed } from "./feed.ts";
import { get_release_items } from "./releases.ts";

const router = new Router();

router.get("/major", async (ctx) => {
  const query = getQuery(ctx, { mergeParams: true });
  const repo_name = query.q.split("/").pop()!;
  const releases = await get_release_items(query.q);
  const feeds = await generate_feed(query.q, repo_name, releases);
  ctx.response.body = feeds;
});
router.get("/minor", async (ctx) => {
  const query = getQuery(ctx, { mergeParams: true });
  const repo_name = query.q.split("/").pop()!;
  const releases = await get_release_items(query.q);
  const feeds = await generate_feed(query.q, repo_name, releases);
  ctx.response.body = feeds;
});
router.get("/patch", async (ctx) => {
  const query = getQuery(ctx, { mergeParams: true });
  const repo_name = query.q.split("/").pop()!;
  const releases = await get_release_items(query.q);
  const feeds = await generate_feed(query.q, repo_name, releases);
  ctx.response.body = feeds;
});

// TODO: rewrite in fresh
router.get("/", async (ctx) => {
  await ctx.send({
    root: `${Deno.cwd()}/static`,
    index: "index.html",
  });
});

const app = new Application();

app.use(router.routes());

await app.listen({ port: 8000 });
