export { writeHttpResponse }

import type { ServerResponse } from 'http'
import { assert } from '../../utils/assert.js'
import type { VikeHttpResponse } from '../types.js'
import { groupHeaders } from './header-utils.js'

async function writeHttpResponse(httpResponse: VikeHttpResponse, res: ServerResponse) {
  assert(httpResponse)
  const { statusCode, headers } = httpResponse
  const groupedHeaders = groupHeaders(headers)
  groupedHeaders.forEach(([name, value]) => res.setHeader(name, value))
  res.statusCode = statusCode
  httpResponse.pipe(res)
  await new Promise<void>((resolve) => {
    res.once('close', resolve)
  })
}
