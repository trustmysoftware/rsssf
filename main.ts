import { Application, Router } from "https://deno.land/x/oak/mod.ts";
// import { CSS } from "https://deno.land/x/gfm/mod.ts"; // TODO styles for the md
import { getQuery } from "https://deno.land/x/oak@v13.1.0/helpers.ts";
import { add } from "npm:date-fns@3.3.1";

import { get_mongo_collection } from "./db.ts";
import { generate_feed } from "./feed.ts";
import { SemverSelect, get_release_items } from "./releases.ts";
import { validate } from "./validation.ts";

export const api_tokens = await get_mongo_collection();

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

router.get("/generate-token", async (ctx) => {
  const api_tokens_count = await api_tokens.countDocuments({});

  console.log({ api_tokens_count });

  if (api_tokens_count >= 100) {
    ctx.response.status = 503;
    ctx.response.body = `
    Maximum number of free keys in circulation, check again
    later to see if some of them expire or host your own RSSSF server
    RSS_FEED_TO_CHECK_IF_FREE_KEYS_ARE_AVAILABLE
    `;
    return;
  }

  const uuid = crypto.randomUUID();

  const insert_result = await api_tokens.insertOne({
    expireAt: add(new Date(), { seconds: 60 }),
    token: uuid,
  });

  if (!insert_result?.acknowledged) {
    ctx.response.status = 500;
    ctx.response.body = "Error while generating new key";
    return;
  }

  ctx.response.body = uuid;
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
