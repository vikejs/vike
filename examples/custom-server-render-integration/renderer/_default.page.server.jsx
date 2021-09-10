import React from "react";
import { renderToString } from "react-dom/server";
import { escapeInjections } from "vite-plugin-ssr";

export { render };

async function render(pageContext) {
  const { Page } = pageContext;
  const pageHtml = renderToString(<Page />);

  // This is a plain string: we don't use the `html` string template tag
  // nor `escapeInjections.dangerouslySkipEscape()`.
  const htmlString = `<!DOCTYPE html>
    <html>
      <body>
        <div id="react-root">${pageHtml}</div>
      </body>
    </html>`;

  return escapeInjections.dangerouslySkipEscape(await html._injectAssets(htmlString, pageContext));
}
