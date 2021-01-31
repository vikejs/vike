import { getPage } from "vite-plugin-ssr";
import express from "express";
import * as vite from "vite";

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
    console.log("p", page);
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
