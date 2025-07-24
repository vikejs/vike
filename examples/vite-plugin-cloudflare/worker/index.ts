import { handleSsr } from './ssr'

export default {
  async fetch(request) {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/api/')) {
      return Response.json({
        name: 'Cloudflare',
      })
    }

    if (!isAssetUrl(url)) {
      return await handleSsr(url)
    }

    return new Response(null, { status: 404 })
  },
} satisfies ExportedHandler<Env>

function isAssetUrl(url: URL) {
  const { pathname } = new URL(url)
  return pathname.startsWith('/assets/')
}
