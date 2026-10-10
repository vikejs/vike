import { escapeInject } from 'vike/server'
import type { PageContextServer } from 'vike/types'

export function onRenderHtml(pageContext: PageContextServer) {
  const Page = pageContext.Page as () => string
  // The user a +middleware adds to the context
  const { user } = pageContext as { user?: string }
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>${Page()}${user ? ` for ${user}` : ''}</body>
    </html>`
}
