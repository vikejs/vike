import { setFileFinder, UserFiles } from './findUserFiles'
import { getGlobal } from './global'

const viteEntryFileBase = 'findUserFiles.vite'

setFileFinder(async () => {
  const viteEntry = require.resolve(`../${viteEntryFileBase}.ts`)
  const viteEntryExports = await loadViteEntry(viteEntry)
  const { fileFinder } = viteEntryExports
  const filesByType = fileFinder() as UserFiles
  return filesByType
})

async function loadViteEntry(modulePath: string): Promise<any> {
  const { viteDevServer, isProduction, root } = getGlobal()

  if (isProduction) {
    const moduleExports = require(`${root}/dist/server/${viteEntryFileBase}.js`)
    return moduleExports
  } else {
    let moduleExports
    try {
      moduleExports = await viteDevServer.ssrLoadModule(modulePath)
    } catch (err) {
      viteDevServer.ssrFixStacktrace(err)
      throw err
    }
    return moduleExports
  }
}
