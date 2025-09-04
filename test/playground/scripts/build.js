import { build } from 'vike/api'
await build()

import { assert, assertGlobalContext } from './common.js'
const globalContext = await assertGlobalContext()

const { prerenderContext } = globalContext
assert(prerenderContext.output.find((o) => o.filePath.endsWith('client/about-us.html')))
const pageContextMarkdown = prerenderContext.pageContexts.find((pageContext) => {
  const { pathname } = pageContext.urlParsed
  return pathname === '/markdown'
})
assert(pageContextMarkdown.pageId === '/pages/markdown')
