export { normalizeHeaders }

import { isObject } from './isObject.js'

function normalizeHeaders(
  /* This type is too strict which is annoying: cannot pass `string[][]` because it doesn't match the more precise type `[string,string][]`.
  headersOriginal ConstructorParameters<typeof Headers>[0]
  */
  headersOriginal: unknown,
): Record<string, string> {
  let headersCleaned = headersOriginal
  // Copied from https://github.com/hattipjs/hattip/blob/69237d181300b200a14114df2c3c115c44e0f3eb/packages/adapter/adapter-node/src/request.ts#L78-L83
  if (isObject(headersCleaned) && headersCleaned[':method'])
    headersCleaned = Object.fromEntries(Object.entries(headersCleaned).filter(([key]) => !key.startsWith(':')))
  const headersStandard = new Headers(headersCleaned as any)
  const headers = Object.fromEntries(headersStandard.entries())
  return headers
}
