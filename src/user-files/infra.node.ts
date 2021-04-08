import { getterAlreadySet, setGetterLoader } from './infra.shared'
import { assert, assertUsage } from '../utils/assert'
import { sep as pathSep, resolve as pathResolve } from 'path'
import { getSsrEnv } from '../ssrEnv.node'

setGetterLoader(loadGetter)

async function loadGetter(): Promise<void> {
  if (getterAlreadySet()) {
    return
  }
  const ssrEnv = getSsrEnv()
  const viteEntryFileBase = 'infra.node.vite-entry'
  require.resolve(`./${viteEntryFileBase}`)
  if (ssrEnv.isProduction) {
    const modulePath = pathResolve(`${ssrEnv.root}/dist/server/${viteEntryFileBase}.js`)
    try {
      require(modulePath)
    } catch (err) {
      if (err.code !== 'MODULE_NOT_FOUND' || !err.message.includes(`Cannot find module '${modulePath}'`)) {
        throw err
      } else {
        assertUsage(
          false,
          `Build file ${modulePath} is missing. Make sure to run \`vite build && vite build --ssr\` before running the server with \`isProduction: true\`.`
        )
      }
    }
  } else {
    assert(__dirname.endsWith(['dist', 'user-files'].join(pathSep)))
    const viteEntry = require.resolve(`../../user-files/${viteEntryFileBase}.ts`)
    try {
      await ssrEnv.viteDevServer.ssrLoadModule(viteEntry)
    } catch (err) {
      ssrEnv.viteDevServer.ssrFixStacktrace(err)
      throw err
    }
  }
  assert(getterAlreadySet())
}
