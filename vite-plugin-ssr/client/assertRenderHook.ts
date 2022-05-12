import { assertUsage, hasProp } from './utils'
import type { PageFile, PageContextExports } from '../shared/getPageFiles'
import { assertHook } from '../shared/getHook'
import { getRelevantPageFiles } from '../shared/getPageFiles/getRelevantPageFiles'

export { assertRenderHook }

function assertRenderHook<
  PC extends {
    _pageFilesAll: PageFile[]
    url?: string
    _pageId: string
  } & PageContextExports,
>(pageContext: PC): asserts pageContext is PC & { exports: { render: Function } } {
  if (hasProp(pageContext.exports, 'render')) {
    assertHook(pageContext, 'render')
  } else {
    const { pageFilesClientSide } = getRelevantPageFiles(pageContext._pageFilesAll, pageContext._pageId)
    const pageFilesClientSideOnly = pageFilesClientSide.filter((p) => p.fileType === '.page.client')
    let errMsg: string
    if (pageFilesClientSideOnly.length === 0) {
      const url = pageContext.url ?? window.location.href
      errMsg = 'No file `*.page.client.*` found for URL ' + url
    } else {
      errMsg =
        'One of the following files should export a `render()` hook: ' +
        pageFilesClientSideOnly.map((p) => p.filePath).join(' ')
    }
    assertUsage(false, errMsg)
  }
}
