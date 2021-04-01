const { fetchHtml, run } = require("../../tests/setup");

run("npm run start");

test("page content is rendered to HTML", async () => {
  const html = await fetchHtml("/");
  expect(html).toContain("<h1>Welcome to <code>vite-plugin-ssr</code></h1>");
  expect(html).toContain("<li>Angola</li><li>Antarctica</li><li>Argentina</li><li>American Samoa</li>");
  expect(html).toContain("pageProps: (function(a){return {initialApolloState:{ROOT_QUERY:");
});
