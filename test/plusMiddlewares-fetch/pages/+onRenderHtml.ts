import { escapeInject } from 'vike/server'
import type { PageContextServer } from 'vike/types'

export function onRenderHtml(pageContext: PageContextServer) {
  const Page = pageContext.Page as () => string
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>${Page()}</body>
    </html>`
}
