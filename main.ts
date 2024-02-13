import { Application, Router } from "https://deno.land/x/oak/mod.ts";
// import { CSS } from "https://deno.land/x/gfm/mod.ts"; // TODO styles for the md
import { getQuery } from "https://deno.land/x/oak@v13.1.0/helpers.ts";

import { generate_feed } from "./feed.ts";
import { SemverSelect, get_release_items } from "./releases.ts";
import { validate } from "./validation.ts";

const router = new Router();

const process_feed = async (
  api_token: string,
  repo_url: string,
  semver_select: SemverSelect
) => {
  const repo_name = repo_url.split("/").pop()!;
  const releases = await get_release_items(repo_url, api_token, semver_select);
  const feeds = await generate_feed(repo_url, repo_name, releases);
  return feeds;
};

router.get("/major", validate, async (ctx) => {
  const query = getQuery(ctx, { mergeParams: true });
  ctx.response.body = await process_feed(query.key, query.q, "major");
});
router.get("/minor", validate, async (ctx) => {
  const query = getQuery(ctx, { mergeParams: true });
  ctx.response.body = await process_feed(query.key, query.q, "minor");
});
router.get("/patch", validate, async (ctx) => {
  const query = getQuery(ctx, { mergeParams: true });
  ctx.response.body = await process_feed(query.key, query.q, "patch");
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
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
