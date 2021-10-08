import { AllPageFiles, findDefaultFile, findPageFile } from './getPageFiles'
import { assert, assertUsage, hasProp, isCallable } from './utils'

export { loadPageMainFiles }
export { getOnBeforeRenderHook }
export type { PageMainFile }
export type { PageMainFileDefault }
export type { OnBeforeRenderHook }

type OnBeforeRenderHook = {
  callHook: Function
  hookWasCalled: boolean
}
type PageMainFile = null | {
  filePath: string
  onBeforeRenderHook: null | OnBeforeRenderHook
  skipDefaultOnBeforeRender: boolean
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

      assertUsage(
        hasProp(fileExports, 'Page') || hasProp(fileExports, 'default'),
        `${filePath} should have a \`export { Page }\` or \`export default\`.`
      )
      pageExports = fileExports
      Page = pageExports['Page'] || pageExports['default']

      const onBeforeRenderHook = getOnBeforeRenderHook(fileExports, filePath)

      let skipDefaultOnBeforeRender = false
      if( hasProp(fileExports, 'skipDefaultOnBeforeRender') ) {
      assertUsage(
        hasProp(fileExports, 'skipDefaultOnBeforeRender', 'boolean'),
        `${filePath} has \`export { skipDefaultOnBeforeRender }\` but \`skipDefaultOnBeforeRender\` should be a boolean.`)
        skipDefaultOnBeforeRender = fileExports.skipDefaultOnBeforeRender
      }

      const pageMainFile: PageMainFile = {
        filePath,
        onBeforeRenderHook,
        skipDefaultOnBeforeRender,
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

function getOnBeforeRenderHook(
  fileExports: Record<string, unknown>,
  filePath: string,
  required: true
): OnBeforeRenderHook
function getOnBeforeRenderHook(fileExports: Record<string, unknown>, filePath: string): null | OnBeforeRenderHook
function getOnBeforeRenderHook(
  fileExports: Record<string, unknown>,
  filePath: string,
  required?: true
): null | OnBeforeRenderHook {
  if (required) {
    assertUsage(hasProp(fileExports, 'onBeforeRender'), `${filePath} should \`export { onBeforeRender }\`.`)
  } else {
    if (!hasProp(fileExports, 'onBeforeRender')) {
      return null
    }
  }
  assertUsage(
    isCallable(fileExports.onBeforeRender),
    `The \`onBeforeRender()\` hook defined in ${filePath} should be a function.`
  )
  const onBeforeRenderHook = {
    async callHook(pageContext: Record<string, unknown>) {
      assert(onBeforeRenderHook.hookWasCalled===false)
      onBeforeRenderHook.hookWasCalled = true
      assert(isCallable(fileExports.onBeforeRender))
      const hookReturn = await fileExports.onBeforeRender()
      assertUsage(
        hasProp(hookReturn, 'pageContext'),
        `The \`onBeforeRender()\` hook exported by ${filePath} should return \`{ pageContext: { /*...*/ }}\` (a plain JavaScript object with a single key \`pageContext\`).`
      )
      const pageContextAddendum = hookReturn.pageContext
      Object.assign(pageContext, pageContextAddendum)
    },
    hookWasCalled: false
  }
  return onBeforeRenderHook
}
