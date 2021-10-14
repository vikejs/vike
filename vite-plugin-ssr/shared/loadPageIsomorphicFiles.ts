import { AllPageFiles, findDefaultFile, findPageFile } from './getPageFiles'
import { getOnBeforeRenderHook, OnBeforeRenderHook } from './onBeforeRenderHook'
import { assertUsage, hasProp } from './utils'

export { loadPageIsomorphicFiles }
export type { PageIsomorphicFile }
export type { PageIsomorphicFileDefault }

type PageIsomorphicFile = null | {
  filePath: string
  onBeforeRenderHook: null | OnBeforeRenderHook
  fileExports: {
    skipDefaultOnBeforeRenderHook?: boolean
  }
}
type PageIsomorphicFileDefault = null | {
  filePath: string
  onBeforeRenderHook: OnBeforeRenderHook
}

async function loadPageIsomorphicFiles(pageContext: {
  _pageId: string
  _allPageFiles: Pick<AllPageFiles, '.page'>
}): Promise<{
  pageIsomorphicFile: PageIsomorphicFile
  pageIsomorphicFileDefault: PageIsomorphicFileDefault
  Page: unknown
  pageExports: Record<string, unknown>
}> {
  let Page: unknown = null
  let pageExports: Record<string, unknown> = {} // `{}` is slightly more convenient than `null` for the user
  const [pageIsomorphicFile, pageIsomorphicFileDefault] = await Promise.all([
    (async () => {
      const pageFile = findPageFile(pageContext._allPageFiles['.page'], pageContext._pageId)
      if (pageFile === null) {
        return null
      }
      const { filePath, loadFile } = pageFile
      const fileExports = await loadFile()
      const fileExportsTyped: {
        skipDefaultOnBeforeRenderHook?: boolean
      } = {}

      assertUsage(
        hasProp(fileExports, 'Page') || hasProp(fileExports, 'default'),
        `${filePath} should have a \`export { Page }\` or \`export default\`.`
      )
      pageExports = fileExports
      Page = pageExports['Page'] || pageExports['default']

      const onBeforeRenderHook = getOnBeforeRenderHook(fileExports, filePath)

      if (hasProp(fileExports, 'skipDefaultOnBeforeRenderHook')) {
        assertUsage(
          hasProp(fileExports, 'skipDefaultOnBeforeRenderHook', 'boolean'),
          `${filePath} has \`export { skipDefaultOnBeforeRenderHook }\` but \`skipDefaultOnBeforeRenderHook\` should be a boolean.`
        )
        fileExportsTyped.skipDefaultOnBeforeRenderHook = fileExports.skipDefaultOnBeforeRenderHook
      }

      const pageIsomorphicFile: PageIsomorphicFile = {
        filePath,
        onBeforeRenderHook,
        fileExports: fileExportsTyped
      }
      return pageIsomorphicFile
    })(),
    (async () => {
      const pageFile = findDefaultFile(pageContext._allPageFiles['.page'], pageContext._pageId)
      if (pageFile === null) {
        return null
      }
      const { filePath, loadFile } = pageFile
      const fileExports = await loadFile()
      const onBeforeRenderHook = getOnBeforeRenderHook(fileExports, filePath, true)

      const pageIsomorphicFileDefault: PageIsomorphicFileDefault = {
        filePath,
        onBeforeRenderHook
      }
      return pageIsomorphicFileDefault
    })()
  ])

  return { Page, pageExports, pageIsomorphicFile, pageIsomorphicFileDefault }
}
