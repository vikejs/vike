export { groupHeaders, writeHttpResponse }

import type { ServerResponse } from 'http'
import { assert } from '../utils/assert.js'
import type { VikeHttpResponse } from './types.js'

async function writeHttpResponse(httpResponse: VikeHttpResponse, res: ServerResponse) {
  assert(httpResponse)
  const { statusCode, headers } = httpResponse
  const groupedHeaders = groupHeaders(headers)
  groupedHeaders.forEach(([name, value]) => res.setHeader(name, value))
  res.statusCode = statusCode
  httpResponse.pipe(res)
  await new Promise<void>((resolve) => {
    res.once('finish', resolve)
  })
}

function groupHeaders(headers: [string, string][]) {
  const grouped: { [key: string]: string | string[] } = {}

  headers.forEach(([key, value]) => {
    if (grouped[key]) {
      // If the key already exists, append the new value
      if (Array.isArray(grouped[key])) {
        ;(grouped[key] as string[]).push(value)
      } else {
        grouped[key] = [grouped[key] as string, value]
      }
    } else {
      // If the key doesn't exist, add it to the object
      grouped[key] = value
    }
  })

  // Convert the object back to an array
  return Object.entries(grouped)
}
