export { renderAsset }

import { viteMiddlewareProxyPort } from '../plugin/plugins/devServer/constants.js';
import { getViteDevServer } from './globalContext.js'
import { assert } from './utils.js'

type HeadersProvided = Record<string, string | string[] | undefined> | Headers

async function renderAsset({ url, headers }: { url: string; headers: HeadersProvided }) {
  const devServer = getViteDevServer()
  assert(devServer)
  const response = await fetch(`http://127.0.0.1:${viteMiddlewareProxyPort}${url}`, {
    headers: parseHeaders(headers)
  })

  const ok = 'status' in response && ((200 <= response.status && response.status <= 299) || response.status === 304)
  if (!ok) {
    return null
  }
  const body = await response.text()
  return {
    statusCode: response.status,
    headers: parseHeaders(response.headers),
    body
  }
}

export const parseHeaders = (headers: HeadersProvided): [string, string][] => {
  const result: [string, string][] = []
  if (typeof headers.forEach === 'function') {
    headers.forEach((value, key) => {
      if (Array.isArray(value)) {
        value.forEach((value_) => {
          result.push([key, value_])
        })
      } else {
        result.push([key, value])
      }
    })
  } else {
    for (const [key, value] of Object.entries(headers)) {
      if (Array.isArray(value)) {
        value.forEach((value_) => {
          result.push([key, value_])
        })
      } else {
        result.push([key, value])
      }
    }
  }

  return result
}
