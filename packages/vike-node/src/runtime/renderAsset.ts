export { renderAsset }
export type { RenderAssetHttpResponse }

import pc from '@brillout/picocolors'
import { request } from 'http'
import type { Writable } from 'stream'
import { viteMiddlewareProxyPort } from '../plugin/plugins/devServer/constants.js'
import { assertUsage } from '../utils/assert.js'
import { getIsWorkerEnv } from './env.js'
import type { HeadersProvided } from './types.js'

type RenderAssetHttpResponse = {
  statusCode: number
  headers: [string, string][]
  pipe(writable: Writable): void
} | null

function renderAsset(url: string, headers: HeadersProvided): Promise<RenderAssetHttpResponse> {
  assertUsage(getIsWorkerEnv(), `${pc.cyan('renderAsset')} should only be called in development mode`)
  const parsedHeaders = parseHeaders(headers)
  const isUpgradeRequest = parsedHeaders.some(([key]) => key.toLowerCase() === 'upgrade')
  if (isUpgradeRequest) {
    return Promise.resolve(null)
  }

  const assetRequest = request({
    host: '127.0.0.1',
    port: viteMiddlewareProxyPort,
    headers: convertToHttpHeaders(parsedHeaders),
    path: url
  })

  assetRequest.end()

  return new Promise<RenderAssetHttpResponse>((resolve) => {
    assetRequest.once('error', () => {
      resolve(null)
    })

    assetRequest.once('response', (fromVite) => {
      const ok =
        'statusCode' in fromVite &&
        fromVite.statusCode &&
        ((200 <= fromVite.statusCode && fromVite.statusCode <= 299) || fromVite.statusCode === 304)

      if (!ok) {
        resolve(null)
        return
      }

      resolve({
        headers: parseHeaders(fromVite.headers),
        statusCode: fromVite.statusCode!,
        pipe: fromVite.pipe.bind(fromVite)
      })
    })
  })
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

function convertToHttpHeaders(headers: [string, string | string[]][]): Record<string, string | string[]> {
  const result: Record<string, string | string[]> = {}
  for (const [key, value] of headers) {
    if (result[key]) {
      result[key] = [result[key], value].flat() as string[]
    } else {
      result[key] = value
    }
  }
  return result
}
