const express = require("express");
const { createPageRenderer } = require("vite-plugin-ssr");
const vite = require("vite");
const assert = require("assert");
const { partRegex } = require("../utils/partRegex");

const isProduction = process.env.NODE_ENV === "production";
const root = `${__dirname}/..`;

startServer();

async function startServer() {
  const app = express();

  let viteDevServer;
  if (isProduction) {
    app.use(express.static(`${root}/dist/client`));
  } else {
    viteDevServer = await vite.createServer({
      root,
      server: { middlewareMode: true },
    });
    app.use(viteDevServer.middlewares);
  }

  const renderPage = createPageRenderer({ viteDevServer, isProduction, root });
  app.get("*", async (req, res, next) => {
    const url = req.originalUrl;
    const pageContextInit = {
      url,
    };
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;
    if (!httpResponse) return next();

    // We can use `pageContext._getPageAssets()` to HTTP/2 Server Push or `103` Early Hint
    // our page assets.
    const pageAssets = await pageContext._getPageAssets();
    console.log("Page Assets:", pageAssets);
    assert_pageAssets(pageAssets);

    const { body, statusCode, contentType } = httpResponse;
    res.status(statusCode).type(contentType).send(body);
  });

  const port = 3000;
  app.listen(port);
  console.log(`Server running at http://localhost:${port}`);
}

function assert_pageAssets(pageAssets) {
  if (!isProduction) {
    const a1 = pageAssets[0];
    assert(a1.src === "/pages/index.css");
    assert(a1.assetType === "style");
    assert(a1.mediaType === "text/css");
    assert(a1.preloadType === "style");
    const a2 = pageAssets[1];
    assert(a2.src === "/renderer/_default.page.client.jsx");
    assert(a2.assetType === "script");
    assert(a2.mediaType === "text/javascript");
    assert(a2.preloadType === null);
    assert(pageAssets[2] === undefined);
  } else {
    const a1 = pageAssets[0];
    assert(partRegex`/assets/index.page.${/[a-z0-9]+/}.css`.test(a1.src));
    assert(a1.assetType === "style");
    assert(a1.mediaType === "text/css");
    assert(a1.preloadType === "style");
    const a2 = pageAssets[1];
    assert(partRegex`/assets/vendor.${/[a-z0-9]+/}.js`.test(a2.src));
    assert(a2.assetType === "preload");
    assert(a2.mediaType === "text/javascript");
    assert(a2.preloadType === "script");
    const isClientAsset = (src) => partRegex`/assets/renderer/_default.page.client.jsx.${/[a-z0-9]+/}.js`.test(src);
    const a3 = pageAssets[2];
    assert(isClientAsset(a3.src));
    assert(a3.assetType === "preload");
    assert(a3.mediaType === "text/javascript");
    assert(a3.preloadType === "script");
    const a4 = pageAssets[3];
    assert(isClientAsset(a4.src));
    assert(a4.assetType === "script");
    assert(a4.mediaType === "text/javascript");
    assert(a4.preloadType === null);
    assert(pageAssets[4] === undefined);
  }
}
