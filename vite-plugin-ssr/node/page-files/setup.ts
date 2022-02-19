import { assert, assertUsage } from '../utils/assert'
import { moduleExists } from '../utils/moduleExists'
import { resolve, join } from 'path'
import { setPageFilesAsync } from '../../shared/getPageFiles'
import { getSsrEnv } from '../ssrEnv'
import { hasProp, isBrowser } from '../utils'
/*
import { isAbsolute } from 'path'
import { projectInfo } from '../utils'
*/

setPageFilesAsync(setPageFiles)

async function setPageFiles(): Promise<unknown> {
  const ssrEnv = getSsrEnv()

  assert(!isBrowser()) // Catched earlier by an `assertUsage()` call in `node/index.ts`
  assertUsage(
    isNodejs(),
    ssrEnv.isProduction
      ? "You production environment doesn't seem to be a Node.js server; you need to load `importBuild.js`, see https://vite-plugin-ssr.com/importBuild.js"
      : "Your development environment doesn't seem to be Node.js. If this is a production environment then make sure that `isProduction: true`.",
  )

  const userDist = `${ssrEnv.root}/${ssrEnv.outDir}`
  const viteEntryPathProd = `${userDist}/server/pageFiles.js`
  // Current directory: vite-plugin-ssr/dist/cjs/node/page-files/
  const pluginRoot = join(__dirname, `../../../..`)
  const viteEntryPathDev = `${pluginRoot}/node/page-files/pageFiles.ts`

  let moduleExports: unknown
  if (ssrEnv.isProduction) {
    const viteEntryResolved = resolve(viteEntryPathProd)
    assertUsage(
      moduleExists(viteEntryResolved),
      'Make sure to run `vite build && vite build --ssr` before running your Node.js server with `createPageRenderer({ isProduction: true })`' +
        `. (Build file ${viteEntryResolved} is missing.)`,
    )
    moduleExports = require_(viteEntryResolved)
  } else {
    assert(ssrEnv.viteDevServer)
    const viteEntryResolved = resolve(viteEntryPathDev)
    // const viteEntryResolved = requireResolve(viteEntryPathDev)
    moduleExports = await ssrEnv.viteDevServer.ssrLoadModule(viteEntryResolved)
  }

  const pageFiles: unknown = (moduleExports as any).pageFiles || (moduleExports as any).default.pageFiles
  assert(pageFiles)
  assert(hasProp(pageFiles, '.page'))
  return pageFiles
}

// `req` instead of `require` so that Webpack doesn't do dynamic dependency analysis
const req = require
function require_(modulePath: string): unknown {
  return req(modulePath)
}
/*
function requireResolve(modulePath: string): string {
  return req.resolve(modulePath)
}
*/
function isNodejs(): boolean {
  try {
    return typeof process !== 'undefined' && process.release.name === 'node'
  } catch (_) {
    return false
  }
}
