import * as vite from "vite";
import * as express from "express";
import { s } from "vite-plugin-ssr";

startServer();

async function startServer() {
  const app = express();

  const viteServer = await vite.createServer({
    server: {
      middlewareMode: true,
    },
  });
  app.use(viteServer.middlewares);

  app.use("*", (_, res) => {
    res.send(s);
  });

  const port = 3000;
  app.listen(port);
  console.log(`Server running at http://localhost:${port}`);
}
