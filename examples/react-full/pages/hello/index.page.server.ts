import type { PageContextBuiltIn } from "vite-plugin-ssr/types";

export { addPageContext };
export { prerender };

async function addPageContext(pageContext: PageContextBuiltIn) {
  const { name } = pageContext.routeParams;
  const pageProps = { name };
  return {
    pageProps,
  };
}

function prerender() {
  const names = ["evan", "rom", "alice", "jon", "eli"];
  const urls = names.map((name) => `/hello/${name}`);
  return urls;
}
