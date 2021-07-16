import { createPageRender } from "vite-plugin-ssr";
// We load `importBuild.js` so that the worker code can be bundled into a single file
import "../dist/server/importBuild.js";

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
