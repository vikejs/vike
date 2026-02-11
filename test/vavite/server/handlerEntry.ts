import { IncomingMessage, ServerResponse } from 'http'
import { renderPage } from 'vike/server'

export default async function handler(request: IncomingMessage, res: ServerResponse) {
  const pageContext = await renderPage({ urlOriginal: request.url! })
  const { httpResponse } = pageContext

  if (!httpResponse) {
    return res.writeHead(404).end('Not Found')
  }

  const { statusCode, headers, body } = httpResponse
  headers.forEach(([name, value]: [string, string]) => res.setHeader(name, value))
  res.statusCode = statusCode
  res.end(body)
}
