export { handleTelefunc }

import { serve } from 'telefunc'

async function handleTelefunc(request: Request) {
  const { pathname, search } = new URL(request.url)
  if (!pathname.startsWith('/_telefunc')) return null
  const { method } = request
  const body = await request.text()
  const httpResponse = await serve({ url: pathname + search, method, body, headers: Object.fromEntries(request.headers) })
  return new Response(httpResponse.body, {
    headers: httpResponse.headers,
    status: httpResponse.statusCode,
  })
}
