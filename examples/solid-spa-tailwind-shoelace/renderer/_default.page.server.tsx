import { escapeInject } from "vite-plugin-ssr";
import { PageContext } from "./types";

// Running in SPA. Hence, the server just responds with HTML that
// contains the <div id="root"> that is used by ./_default.page.client.tsx
// to render the app.
export function render(pageContext: PageContext) {
  return escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <title>Solid App</title>
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root"></div>
      </body>
    </html>
  `;
}
