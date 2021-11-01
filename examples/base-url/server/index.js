const express = require("express");
const { createPageRenderer } = require("vite-plugin-ssr");
const vite = require("vite");

const isProduction = process.env.NODE_ENV === "production";
const root = `${__dirname}/..`;
const base = isProduction ? "/dist/client/" : "/";

startServer();

async function startServer() {
  const app = express();

  let viteDevServer;
  if (isProduction) {
    app.use(base, express.static(`${root}/dist/client`));
  } else {
    viteDevServer = await vite.createServer({
      root,
      server: { middlewareMode: true },
    });
    app.use(viteDevServer.middlewares);
  }

  const renderPage = createPageRenderer({
    viteDevServer,
    isProduction,
    root,
    base,
  });
  app.get("*", async (req, res, next) => {
    const url = req.originalUrl;
    const pageContextInit = {
      url,
    };
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;
    if (!httpResponse) return next();
    const { body, statusCode, contentType } = httpResponse;
    res.status(statusCode).type(contentType).send(body);
  });

  const port = 3000;
  app.listen(port);
  console.log(`Server running at http://localhost:${port}${base}`);
}
