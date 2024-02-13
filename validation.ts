import { getQuery } from "https://deno.land/x/oak@v13.1.0/helpers.ts";
import { Context, Next } from "https://deno.land/x/oak@v13.1.0/mod.ts";

export const validate = async (ctx: Context, next: Next) => {
  const api_token = getQuery(ctx, { mergeParams: true }).key;

  if (!api_token) {
    ctx.response.status = 401;
    ctx.response.body =
      "Missing `key` query parameter (should hold an api_token)";
    return;
  }

  // TODO: refreshable tokens in redis or something (something easy)
  if (api_token !== "abc_123_secret_key") {
    ctx.response.status = 401;
    ctx.response.body =
      "Bad `key` query parameter (api_token is invalid, maybe it expired?)";
    return;
  }

  ctx.state = {
    api_token,
  };

  await next();
};