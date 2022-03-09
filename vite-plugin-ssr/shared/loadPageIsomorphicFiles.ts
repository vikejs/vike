/* TODO: remove this file
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
    skipOnBeforeRenderDefaultHook?: boolean
    onBeforeRender?: Function
  }
}
type PageIsomorphicFileDefault = null | {
  filePath: string
  fileExports: Record<string, unknown>
  onBeforeRenderHook: null | OnBeforeRenderHook
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
        skipOnBeforeRenderDefaultHook?: boolean
      } = {}

      assertUsage(
        hasProp(fileExports, 'Page') || hasProp(fileExports, 'default'),
        `${filePath} should have a \`export { Page }\` or \`export default\`.`,
      )
      pageExports = fileExports
      Page = pageExports['Page'] || pageExports['default']

      const onBeforeRenderHook = getOnBeforeRenderHook(fileExports, filePath)

      if (hasProp(fileExports, 'skipOnBeforeRenderDefaultHook')) {
        assertUsage(
          hasProp(fileExports, 'skipOnBeforeRenderDefaultHook', 'boolean'),
          `${filePath} has \`export { skipOnBeforeRenderDefaultHook }\` but \`skipOnBeforeRenderDefaultHook\` should be a boolean.`,
        )
        fileExportsTyped.skipOnBeforeRenderDefaultHook = fileExports.skipOnBeforeRenderDefaultHook
      }

      const pageIsomorphicFile: PageIsomorphicFile = {
        filePath,
        onBeforeRenderHook,
        fileExports: fileExports as typeof fileExportsTyped, // TODO
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
      const onBeforeRenderHook = getOnBeforeRenderHook(fileExports, filePath)

      const pageIsomorphicFileDefault: PageIsomorphicFileDefault = {
        filePath,
        fileExports,
        onBeforeRenderHook,
      }
      return pageIsomorphicFileDefault
    })(),
  ])

  return { Page, pageExports, pageIsomorphicFile, pageIsomorphicFileDefault }
}
//*/
