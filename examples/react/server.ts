import * as vite from "vite";
import express from "express";

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
    res.send(`heyo`);
  });

  const port = 3000;
  app.listen(port);
  console.log(`Server running at http://localhost:${port}`);
}
