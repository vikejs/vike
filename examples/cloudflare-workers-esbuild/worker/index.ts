import { handleSsr } from './ssr'
import { handleStaticAssets } from './static-assets'

addEventListener('fetch', (event: FetchEvent) => {
  try {
    event.respondWith(handleFetchEvent(event))
  } catch (err: any) {
    console.error(err.stack)
    event.respondWith(new Response('Internal Error', { status: 500 }))
  }
})

async function handleFetchEvent(event: FetchEvent) {
  if (!isAssetUrl(event.request.url)) {
    const response = await handleSsr(event.request.url)
    if (response !== null) return response
  }
  return handleStaticAssets(event)
}

function isAssetUrl(url: string) {
  const { pathname } = new URL(url)
  return pathname.startsWith('/assets/')
}
