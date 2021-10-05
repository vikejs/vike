import { getAllPageFiles } from '../../shared/getPageFiles'
import { getAllPageIds, loadPageRoutes } from '../../shared/route'
import { assert, hasProp, objectAssign, PromiseType } from '../../shared/utils'

export { getGlobalContext }
export type { ServerFiles }

let globalContext: PromiseType<ReturnType<typeof retrieveGlobalContext>>

async function getGlobalContext() {
  if (!globalContext) {
    globalContext = await retrieveGlobalContext()
  }
  return globalContext
}

type ServerFiles = { filePath: string; fileExports: { exportsOnBeforeRender: boolean } }[]
async function retrieveGlobalContext() {
  const globalContext = {}
  const allPageFiles = await getAllPageFiles()
  objectAssign(globalContext, { _allPageFiles: allPageFiles })

  const allPageIds = await getAllPageIds(allPageFiles)
  objectAssign(globalContext, { _allPageIds: allPageIds })

  const { pageRoutes, onBeforeRouteHook } = await loadPageRoutes(globalContext)
  objectAssign(globalContext, { _pageRoutes: pageRoutes, _onBeforeRouteHook: onBeforeRouteHook })

  const serverFiles: ServerFiles = []
  await Promise.all(
    allPageFiles['.page.server'].map(async ({ filePath, loadFile }) => {
      const fileExports = await loadFile()
      assert(hasProp(fileExports, 'exportsOnBeforeRender', 'boolean'))
      assert(Object.keys(fileExports).length === 1)
      serverFiles.push({ filePath, fileExports })
    })
  )

  objectAssign(globalContext, { _serverFiles: serverFiles })

  return globalContext
}
