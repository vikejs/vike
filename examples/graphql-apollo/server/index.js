const express = require("express");
const { createPageRender } = require("vite-plugin-ssr");
const vite = require("vite");
const {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} = require("@apollo/client");
const fetch = require("cross-fetch");

const isProduction = process.env.NODE_ENV === "production";
const root = `${__dirname}/..`;

startServer();

async function startServer() {
  const app = express();

  let viteDevServer;
  if (isProduction) {
    app.use(express.static(`${root}/dist/client`, { index: false }));
  } else {
    viteDevServer = await vite.createServer({
      root,
      server: { middlewareMode: true },
    });
    app.use(viteDevServer.middlewares);
  }

  const renderPage = createPageRender({ viteDevServer, isProduction, root });
  app.get("*", async (req, res, next) => {
    const url = req.originalUrl;
    // It's important to create an entirely new instance of Apollo Client for each request.
    // Otherwise, our response to a request might include sensitive cached query results
    // from a previous request. Source: https://www.apollographql.com/docs/react/performance/server-side-rendering/#example
    const apolloClient = makeApolloClient();
    const pageContext = { url, apolloClient };
    const result = await renderPage(pageContext);
    if (result.nothingRendered) return next();
    res.status(result.statusCode).send(result.renderResult);
  });

  const port = 3000;
  app.listen(port);
  console.log(`Server running at http://localhost:${port}`);
}

function makeApolloClient() {
  const apolloClient = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: "https://countries.trevorblades.com",
      fetch,
    }),
    cache: new InMemoryCache(),
  });
  return apolloClient;
}
