import { setFileFinder } from './findUserFiles'

setFileFinder(async () => {
  const viteEntry = require.resolve('../findUserFiles.vite.ts')
  const viteEntryExports = await loadViteEntry(viteEntry)
  const { fileFinder } = viteEntryExports
  const filesByType = fileFinder()
  return filesByType
})

async function loadViteEntry(modulePath: string): Promise<any> {
  // @ts-ignore
  const { viteServer } = global
  let moduleExports
  try {
    moduleExports = await viteServer.ssrLoadModule(modulePath)
  } catch (err) {
    // TODO re-enable this
    // if (!isProduction()) viteServer.ssrFixStacktrace(err);
    throw err
  }
  return moduleExports
}
