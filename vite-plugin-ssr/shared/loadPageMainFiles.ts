import { AllPageFiles, findDefaultFile, findPageFile } from './getPageFiles'
import { assertUsage, hasProp, isCallable } from './utils'

export { loadPageMainFiles }
export type { PageMainFile }
export type { PageMainFileDefault }

type PageMainFile = null | {
  filePath: string
  onBeforeRenderHook: null | Function
}
type PageMainFileDefault = null | {
  filePath: string
  onBeforeRenderHook: Function
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

      assertUsage(
        hasProp(fileExports, 'Page') || hasProp(fileExports, 'default'),
        `${filePath} should have a \`export { Page }\` or \`export default\`.`
      )
      pageExports = fileExports
      Page = pageExports['Page'] || pageExports['default']

      const onBeforeRenderHook = getOnBeforeRenderHook(fileExports, filePath)

      const pageMainFile: PageMainFile = {
        filePath,
        onBeforeRenderHook
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

function getOnBeforeRenderHook(fileExports: Record<string, unknown>, filePath: string, required: true): Function
function getOnBeforeRenderHook(fileExports: Record<string, unknown>, filePath: string): null | Function
function getOnBeforeRenderHook(
  fileExports: Record<string, unknown>,
  filePath: string,
  required?: true
): null | Function {
  if (required) {
    assertUsage(hasProp(fileExports, 'onBeforeRender'), `${filePath} should \`export { onBeforeRender }\`.`)
  } else {
    if (!hasProp(fileExports, 'onBeforeRender')) {
      return null
    }
  }
  assertUsage(
    isCallable(fileExports['onBeforeRender']),
    `The \`onBeforeRender()\` hook defined in ${filePath} should be a function.`
  )
  return fileExports.onBeforeRender
}
