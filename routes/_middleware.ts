import { FreshContext } from "$fresh/server.ts";
import { api_tokens, TokenData } from "../utils/db.ts";

export type ContextState = {
  token_data: TokenData;
};

const validation = async (req: Request, ctx: FreshContext<ContextState>) => {
  // only apply validation to specific routes within this directory
  // TODO: best practices for middleware here?
  if (!["/major", "/minor", "/patch"].includes(ctx.url.pathname)) {
    return ctx.next();
  }
  const api_token = ctx.url.searchParams.get("key") || "";

  if (!api_token) {
    return new Response(
      "Missing `key` query parameter (should hold an api_token)",
      {
        status: 401,
      },
    );
  }

  const token_data = await api_tokens.findOne<TokenData>({
    token: api_token,
  });

  if (token_data === null) {
    return new Response(
      "Bad `key` query parameter (api_token is invalid, maybe it expired?)",
      { status: 401 },
    );
  }

  const { token, expireAt, lastSeen, ..._rest } = token_data;
  ctx.state.token_data = {
    token,
    expireAt,
    lastSeen,
  };

  return ctx.next();
};

export const handler = [validation];
