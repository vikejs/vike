import * as vite from "vite";
import express from "express";
import { getPage } from "vite-plugin-ssr";

startServer();

async function startServer() {
  const app = express();

  const viteServer = await vite.createServer({
    server: {
      middlewareMode: true,
    },
  });
  app.use(viteServer.middlewares);

  app.use("*", async (req, res, next) => {
    const page = await getPage(req.url);
    if (!page) {
      next();
      return;
    }
    let html = await page.renderPageHtml();
    res.send(html);
  });

  const port = 3000;
  app.listen(port);
  console.log(`Server running at http://localhost:${port}`);
}
