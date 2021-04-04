import { setAllUserFilesGetter } from './infra.shared'
import { assert, assertUsage } from '../utils/assert'
import { sep as pathSep, resolve as pathResolve } from 'path'
import { getSsrEnv } from '../ssrEnv.node'
const viteEntryFileBase = 'infra.node.vite-entry'
require.resolve(`./${viteEntryFileBase}`)
assert(__dirname.endsWith(['dist', 'user-files'].join(pathSep)))
const viteEntry = require.resolve(`../../user-files/${viteEntryFileBase}.ts`)

setAllUserFilesGetter(async () => {
  const viteEntryExports = await loadViteEntry(viteEntry)
  const __getAllUserFiles = viteEntryExports.__getAllUserFiles || viteEntryExports.default.__getAllUserFiles
  return __getAllUserFiles()
})

async function loadViteEntry(modulePath: string): Promise<any> {
  const ssrEnv = getSsrEnv()

  if (ssrEnv.isProduction) {
    const modulePath = pathResolve(`${ssrEnv.root}/dist/server/${viteEntryFileBase}.js`)
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
      moduleExports = await ssrEnv.viteDevServer.ssrLoadModule(modulePath)
    } catch (err) {
      ssrEnv.viteDevServer.ssrFixStacktrace(err)
      throw err
    }
    return moduleExports
  }
}
