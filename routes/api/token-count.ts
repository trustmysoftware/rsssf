import { FreshContext } from "$fresh/server.ts";
import { api_tokens } from "../../utils/db.ts";
import { MAX_API_TOKENS } from "./generate-token.ts";

export const handler = async (_req: Request, _ctx: FreshContext) => {
  const api_tokens_count = await api_tokens.countDocuments({});

  return new Response(
    JSON.stringify({ api_tokens_count, max_api_tokens: MAX_API_TOKENS }),
  );
};
