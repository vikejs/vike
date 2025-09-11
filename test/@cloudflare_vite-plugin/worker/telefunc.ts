export { handleTelefunc }

import { telefunc } from 'telefunc'

async function handleTelefunc(request: Request) {
  const { pathname } = new URL(request.url)
  if (!pathname.startsWith('/_telefunc')) return null
  const { method } = request
  const body = await request.text()
  const httpResponse = await telefunc({ url: pathname, method, body })
  return new Response(httpResponse.body, {
    headers: { 'content-type': httpResponse.contentType },
    status: httpResponse.statusCode,
  })
}
