// Note that the scripts `package.json#scripts` use `ts-node` which means that
// node directly executes this file; Vite doesn't process this file. We use
// the npm module `module-alias` to add path alias support for files that are
// not processed by Vite such as this one. The path aliases for `module-alias`
// are defined at `package.json#_moduleAliases`.
import "module-alias/register";
import { msg } from "~/server/msg";

import express from "express";
import { createPageRenderer } from "vite-plugin-ssr";

console.log(msg);

const isProduction = process.env.NODE_ENV === "production";
const root = `${__dirname}/..`;

startServer();

async function startServer() {
  const app = express();

  let viteDevServer;
  if (isProduction) {
    app.use(express.static(`${root}/dist/client`));
  } else {
    const vite = require("vite");
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
      url
    }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    if (!httpResponse) return next()
    const { statusCode, body } = httpResponse
    res.status(statusCode).send(body)
  });

  const port = process.env.PORT || 3000;
  app.listen(port);
  console.log(`Server running at http://localhost:${port}`);
}
