import { FreshContext } from "$fresh/server.ts";
import { api_tokens } from "../../utils/db.ts";

export const handler = async (_req: Request, _ctx: FreshContext) => {
  const api_tokens_count = await api_tokens.countDocuments({});

  return new Response(`${api_tokens_count}`);
};
