import React from "react";
import { renderToString } from "react-dom/server";
import { dangerouslySkipEscape, injectAssets } from "vite-plugin-ssr";

export { render };

async function render(pageContext) {
  const { Page } = pageContext;
  const pageHtml = renderToString(<Page />);

  // This is a plain string: we don't use the `escapeInjections` template tag
  const htmlString = `<!DOCTYPE html>
    <html>
      <body>
        <div id="react-root">${pageHtml}</div>
      </body>
    </html>`;

  return dangerouslySkipEscape(await injectAssets(htmlString, pageContext));
}
