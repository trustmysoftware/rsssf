import { defineRoute } from "$fresh/server.ts";
import { process_feed } from "../utils/feed.ts";
import { ContextState } from "./_middleware.ts";

export const handler = defineRoute<ContextState>(
  async (req, ctx) => {
    const api_token_data = ctx.state.token_data;
    const repo_url = ctx.url.searchParams.get("q");

    if (!repo_url) {
      return new Response("Bad repository url, (query parameter `q`)");
    }

    return new Response(
      await process_feed(api_token_data, repo_url, "patch"),
      {
        headers: {
          "content-type": "application/atom+xml; charset=utf-8",
        },
      },
    );
  },
);
