import { setAllUserFilesGetter } from './infra.shared'
import { assert, assertUsage } from '../utils/assert'
import { sep as pathSep, resolve as pathResolve } from 'path'
import { getGlobal } from '../global.node'
const viteEntryFileBase = 'infra.node.vite-entry'
require.resolve(`./${viteEntryFileBase}`)
assert(__dirname.endsWith(['dist', 'user-files'].join(pathSep)))
const viteEntry = require.resolve(`../../user-files/${viteEntryFileBase}.ts`)

setAllUserFilesGetter(async () => {
  const viteEntryExports = await loadViteEntry(viteEntry)
  const { __getAllUserFiles } = viteEntryExports
  return __getAllUserFiles()
})

async function loadViteEntry(modulePath: string): Promise<any> {
  const { viteDevServer, isProduction, root } = getGlobal()

  if (isProduction) {
    const modulePath = pathResolve(
      `${root}/dist/server/${viteEntryFileBase}.js`
    )
    let moduleExports
    try {
      moduleExports = require(modulePath)
    } catch (err) {
      assertUsage(
        false,
        `Build file ${modulePath} is missing. Make sure to run \`vite build && vite build --ssr\` before running the server with \`isProduction: true\`.`
      )
    }
    return moduleExports
  } else {
    let moduleExports: any
    try {
      moduleExports = await viteDevServer.ssrLoadModule(modulePath)
    } catch (err) {
      viteDevServer.ssrFixStacktrace(err)
      throw err
    }
    return moduleExports
  }
}
