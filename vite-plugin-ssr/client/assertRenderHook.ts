import { assertUsage, hasProp } from './utils'
import type { PageFile, PageContextExports } from '../shared/getPageFiles'
import { assertHook } from '../shared/getHook'

export { assertRenderHook }

function assertRenderHook<
  PC extends {
    _pageFilesAll: PageFile[]
    url?: string
    _pageId: string
  } & PageContextExports,
>(pageContext: PC): asserts pageContext is PC & { exports: { render: Function } } {
  if (!hasProp(pageContext.exports, 'render')) {
    const pageFilesClient = pageContext._pageFilesAll.filter(
      (p) => p.fileType === '.page.client' && (p.isDefaultPageFile || p.pageId === pageContext._pageId),
    )
    let errMsg: string
    if (pageFilesClient.length === 0) {
      const url = pageContext.url ?? window.location.href
      errMsg = 'No file `*.page.client.*` found for URL ' + url
    } else {
      errMsg =
        'One of the following files should export a `render()` hook: ' +
        pageFilesClient.map((p) => p.filePath).join(' ')
    }
    assertUsage(false, errMsg)
  }
  assertHook(pageContext, 'render')
}
