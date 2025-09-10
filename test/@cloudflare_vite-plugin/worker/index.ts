import { handleSsr } from './ssr'
import { telefunc, config } from 'telefunc'
config.disableNamingConvention = true

export default {
  async fetch(request) {
    const url = new URL(request.url)

    // Serve Telefunc
    if (url.pathname.startsWith('/_telefunc')) {
      const body = await request.text()
      const { method } = request
      const response = await handleTelefunc({ url: url.pathname, method, body })
      return response
    }

    return await handleSsr(url)
  },
} satisfies ExportedHandler<Env>

async function handleTelefunc({ url, method, body }: any) {
  const httpResponse = await telefunc({ url, method, body })
  return new Response(httpResponse.body, {
    headers: { 'content-type': httpResponse.contentType },
    status: httpResponse.statusCode,
  })
}
