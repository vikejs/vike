import { assertUsage, hasProp } from './utils'
import { assertHook } from '../shared/getHook'
import type { PageFile, PageContextExports } from '../shared/getPageFiles'

export { assertRenderHook }

function assertRenderHook<
  PC extends {
    _pageFilesLoaded: PageFile[]
    urlOriginal?: string
    _pageId: string
  } & PageContextExports
>(pageContext: PC, bla: boolean): asserts pageContext is PC & { exports: { render: Function } } {
  if (hasProp(pageContext.exports, 'render')) {
    assertHook(pageContext, 'render')
  } else {
    const pageClientsFilesLoaded = pageContext._pageFilesLoaded.filter((p) => p.fileType === '.page.client')
    let errMsg: string
    if (pageClientsFilesLoaded.length === 0) {
      let url: string | undefined
      try {
        url = pageContext.urlOriginal
      } catch {}
      url = url ?? window.location.href
      errMsg = 'No file `*.page.client.*` found for URL ' + url // TODO
    } else {
      errMsg =
        'One of the following files should export a `render()` hook: ' + // TODO
        pageClientsFilesLoaded.map((p) => p.filePath).join(' ')
    }
    assertUsage(false, errMsg)
  }
}
