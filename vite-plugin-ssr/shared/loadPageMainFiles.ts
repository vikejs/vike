import { AllPageFiles, findDefaultFile, findPageFile } from './getPageFiles'
import { getOnBeforeRenderHook, OnBeforeRenderHook } from './onBeforeRenderHook'
import { assertUsage, hasProp } from './utils'

export { loadPageMainFiles }
export type { PageMainFile }
export type { PageMainFileDefault }

type PageMainFile = null | {
  filePath: string
  onBeforeRenderHook: null | OnBeforeRenderHook
  fileExports: {
    skipDefaultOnBeforeRenderHook?: boolean
  }
}
type PageMainFileDefault = null | {
  filePath: string
  onBeforeRenderHook: OnBeforeRenderHook
}

async function loadPageMainFiles(pageContext: {
  _pageId: string
  _allPageFiles: Pick<AllPageFiles, '.page'>
}): Promise<{
  pageMainFile: PageMainFile
  pageMainFileDefault: PageMainFileDefault
  Page: unknown
  pageExports: Record<string, unknown>
}> {
  let Page: unknown = null
  let pageExports: Record<string, unknown> = {} // `{}` is slightly more convenient than `null` for the user
  const [pageMainFile, pageMainFileDefault] = await Promise.all([
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

      const pageMainFile: PageMainFile = {
        filePath,
        onBeforeRenderHook,
        fileExports: fileExportsTyped
      }
      return pageMainFile
    })(),
    (async () => {
      const pageFile = findDefaultFile(pageContext._allPageFiles['.page'], pageContext._pageId)
      if (pageFile === null) {
        return null
      }
      const { filePath, loadFile } = pageFile
      const fileExports = await loadFile()
      const onBeforeRenderHook = getOnBeforeRenderHook(fileExports, filePath, true)

      const pageMainFileDefault: PageMainFileDefault = {
        filePath,
        onBeforeRenderHook
      }
      return pageMainFileDefault
    })()
  ])

  return { Page, pageExports, pageMainFile, pageMainFileDefault }
}
