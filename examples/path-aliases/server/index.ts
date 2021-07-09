// Note that the scripts `package.json#scripts` use `ts-node` which means that
// node directly executes this file; Vite doesn't process this file. We use
// the npm module `module-alias` to add path alias support for files that are
// not processed by Vite such as this one. The path aliases for `module-alias`
// are defined at `package.json#_moduleAliases`.
import "module-alias/register";
import { msg } from "~/server/msg";

import express from "express";
import { createPageRender } from "vite-plugin-ssr";

console.log(msg);

const isProduction = process.env.NODE_ENV === "production";
const root = `${__dirname}/..`;

startServer();

async function startServer() {
  const app = express();

  let viteDevServer;
  if (isProduction) {
    app.use(express.static(`${root}/dist/client`, { index: false }));
  } else {
    const vite = require("vite");
    viteDevServer = await vite.createServer({
      root,
      server: { middlewareMode: true },
    });
    app.use(viteDevServer.middlewares);
  }

  const renderPage = createPageRender({ viteDevServer, isProduction, root });
  app.get("*", async (req, res, next) => {
    const url = req.originalUrl;
    const pageContext = {
      url,
    };
    const result = await renderPage(pageContext);
    if (result.nothingRendered) return next();
    res.status(result.statusCode).send(result.renderResult);
  });

  const port = process.env.PORT || 3000;
  app.listen(port);
  console.log(`Server running at http://localhost:${port}`);
}
