import { enhance, type UniversalMiddleware } from "@universal-middleware/core";

const dummyUniversalMiddleware: UniversalMiddleware = async () => {
  return new Response("OK");
};

const middlewareDummy = enhance(dummyUniversalMiddleware, {
  name: "dummy",
  method: "GET",
  path: "/dummy",
});

export default middlewareDummy;