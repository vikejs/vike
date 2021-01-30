import { createError } from "@brillout/libassert";

export { assert };
export { assertUsage };

const repoName = "vite-plugin-ssr";
const libName = repoName;
const requestForContact = `Please open a new issue at https://github.com/brillout/${repoName}/issues/new and include this error stack.`;
const internalErroPrefix = `[${libName}][Internal Error] Something unexpected happened. ${requestForContact}`;
const usageErrorPrefix = `[${libName}][Wrong Usage]`;

function assert(condition: unknown): asserts condition {
  if (condition) {
    return;
  }
  const prefix = internalErroPrefix;
  const internalError = createError({ prefix });
  throw internalError;
}

function assertUsage(
  condition: unknown,
  errorMessage: string
): asserts condition {
  if (condition) {
    return;
  }
  const prefix = usageErrorPrefix;
  const usageError = createError({ prefix, errorMessage });
  throw usageError;
}
