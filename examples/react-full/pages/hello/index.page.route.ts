import type { PageContextBuiltIn } from "vite-plugin-ssr/types";

// Route Functions give us full flexibility
// This is a route similar to `/hello/:name` but with details impossible to achieve with a route string.
export default (pageContext: PageContextBuiltIn) => {
  const { url } = pageContext;
  if (!url.startsWith("/hello")) {
    return { match: false };
  }
  const name = url.split("/")[2] || "anonymous";
  return { match: true, routeParams: { name } };
};
