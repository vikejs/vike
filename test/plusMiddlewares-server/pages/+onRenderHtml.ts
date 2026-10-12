import { escapeInject } from 'vike/server'
import type { PageContextServer } from 'vike/types'

export function onRenderHtml(pageContext: PageContextServer) {
  const Page = pageContext.Page as () => string
  // The user a +middleware adds to the context
  const { user } = pageContext as { user?: string }
  // The server's runtime, or the one `vike.fetch(request)` creates
  const { runtime } = pageContext as { runtime?: { adapter: string } }
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>${Page()}${user ? ` for ${user}` : ''}${runtime ? ` with the ${runtime.adapter} runtime` : ''}</body>
    </html>`
}
