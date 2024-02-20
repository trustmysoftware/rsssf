import { FreshContext } from "$fresh/server.ts";
import { add } from "date-fns";
import { api_tokens } from "../../utils/db.ts";

export const API_MAX_TOKENS = 100;

export const handler = async (_req: Request, _ctx: FreshContext) => {
  const api_tokens_count = await api_tokens.countDocuments({});

  if (api_tokens_count >= API_MAX_TOKENS) {
    new Response(
      `
    Maximum number of free keys in circulation, check again
    later to see if some of them expire or host your own RSSSF server
    RSS_FEED_TO_CHECK_IF_FREE_KEYS_ARE_AVAILABLE
    `,
      { status: 503 },
    );
  }

  const uuid = crypto.randomUUID();

  const insert_result = await api_tokens.insertOne({
    expireAt: add(new Date(), { seconds: 60 }),
    token: uuid,
  });

  if (!insert_result?.acknowledged) {
    return new Response("Error while generating new key", { status: 500 });
  }

  return new Response(`${uuid}`);
};
