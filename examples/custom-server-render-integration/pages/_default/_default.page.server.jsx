import React from "react";
import { renderToString } from "react-dom/server";
import { html } from "vite-plugin-ssr";

export { render };

async function render(pageContext) {
  const { Page } = pageContext;
  const pageHtml = renderToString(<Page />);

  // This is a plain string: we don't use the `html` string template tag
  // nor `html.dangerouslySkipEscape()`.
  const htmlString = `<!DOCTYPE html>
    <html>
      <body>
        <div id="react-root">${pageHtml}</div>
      </body>
    </html>`;

  return html.dangerouslySkipEscape(await html._injectAssets(htmlString, pageContext));
}
