import { createPageRender } from "vite-plugin-ssr";
// We include `importer.js` so that the worker code can be bundled into one file
import "../dist/server/importer.js";

export { handleSsr };

const renderPage = createPageRender({ isProduction: true });

async function handleSsr(url) {
  const pageContext = { url };
  const result = await renderPage(pageContext);
  if (result.nothingRendered) {
    return null;
  } else {
    return new Response(result.renderResult, {
      headers: { "content-type": "text/html" },
      status: result.statusCode,
    });
  }
}
