import { createPageRenderer } from "vite-plugin-ssr";
// We load `importBuild.js` so that the worker code can be bundled into a single file
import "../dist/server/importBuild.js";

export { handleSsr };

const renderPage = createPageRenderer({ isProduction: true });

async function handleSsr(url) {
  const pageContextInit = { url }
  const pageContext = await renderPage(pageContextInit)
  const { httpResponse } = pageContext
  if (!httpResponse) {
    return null;
  } else {
    const { statusCode, body } = httpResponse
    res.status(statusCode).send(body)
    return new Response(body, {
      headers: { "content-type": "text/html" },
      status: statusCode,
    });
  }
}
