import "../dist/server/importBuild";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { createPageRenderer } from "vite-plugin-ssr";
import { inspect } from "util";

const renderPage = createPageRenderer({ isProduction: true });

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  let url = event.rawPath;

  if (event.rawQueryString) {
    url += "?" + event.rawQueryString;
  }

  const pageContextInit = { url };
  console.log("rendering...");
  const pageContext = await renderPage(pageContextInit);
  console.log("pageContext =", inspect(pageContext, { depth: null }));
  const { httpResponse } = pageContext;
  if (!httpResponse) return { statusCode: 200, body: "??" };
  const { body, statusCode, contentType } = httpResponse;

  return {
    statusCode,
    headers: { "Content-Type": contentType },
    body,
  };
};
