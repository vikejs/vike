import { escapeInject } from 'vike/server'
import type { PageContextServer } from 'vike/types'

export function onRenderHtml(pageContext: PageContextServer) {
  const Page = pageContext.Page as () => string
  // The user and the locale the +middleware add to the context
  const { user, locale } = pageContext as { user?: string; locale?: string }
  // The server's runtime, and none of its fields copied onto pageContext
  const { runtime, adapter } = pageContext as { runtime?: { adapter: string }; adapter?: string }
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>${Page()}${user ? ` for ${user}` : ''}${runtime ? ` with the ${runtime.adapter} runtime` : ''}${adapter ? ` (adapter ${adapter})` : ''}${locale ? ` in ${locale}` : ''}</body>
    </html>`
}
