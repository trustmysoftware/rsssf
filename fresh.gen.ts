// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $_middleware from "./routes/_middleware.ts";
import * as $api_document_count from "./routes/api/document-count.ts";
import * as $api_generate_token from "./routes/api/generate-token.ts";
import * as $index from "./routes/index.tsx";
import * as $major from "./routes/major.tsx";
import * as $DocumentCounter from "./islands/DocumentCounter.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/_middleware.ts": $_middleware,
    "./routes/api/document-count.ts": $api_document_count,
    "./routes/api/generate-token.ts": $api_generate_token,
    "./routes/index.tsx": $index,
    "./routes/major.tsx": $major,
  },
  islands: {
    "./islands/DocumentCounter.tsx": $DocumentCounter,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;