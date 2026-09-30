export { onRenderHtml }

import type { PageContextServer } from 'vike/types'

let prerenderCount = 0

function onRenderHtml(pageContext: PageContextServer) {
  if (pageContext.isPrerendering) prerenderCount++
  pageContext.content = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Café</title>
  <!-- prerenderCount: ${prerenderCount} -->
</feed>
`
}
