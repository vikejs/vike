import { assert, assertUsage } from '../../shared/utils/assert'
import { moduleExists } from '../../shared/utils/moduleExists'
import { resolve, join } from 'path'
import { setPageFilesAsync } from '../../shared/getPageFiles'
import { getSsrEnv } from '../ssrEnv'
import { hasProp, isBrowser } from '../../shared/utils'
/*
import { isAbsolute } from 'path'
import { projectInfo } from '../../shared/utils'
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

  const viteEntryFile = 'pageFiles.js'
  // assertEntry(viteEntryFile)
  const userDist = `${ssrEnv.root}/${ssrEnv.outDir}`
  // Current directory: vite-plugin-ssr/dist/cjs/node/page-files/
  const pluginDist = join(__dirname, `../../../../dist`)
  const viteEntryPathProd = `${userDist}/server/${viteEntryFile}`
  const viteEntryPathDev = `${pluginDist}/esm/node/page-files/${viteEntryFile}`

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

/*
function assertEntry(viteEntryFile: string) {
  let dir: string | undefined
  let viteEntryPath: string | undefined
  let viteEntryResolved: string | undefined
  let requireTypeof: string | undefined
  let requireConstructor: string | undefined
  let requireResolveTypeof: string | undefined
  let requireResolveConstructor: string | undefined
  try {
    dir = __dirname
    assert(dir)
    assert(isAbsolute(dir))
    viteEntryPath = resolve(dir, viteEntryFile)
    assert(isAbsolute(viteEntryPath))
    requireTypeof = typeof require
    requireConstructor = String(require.constructor)
    requireResolveTypeof = typeof require.resolve
    requireResolveConstructor = String(require.resolve.constructor)
    const req = require
    const res = req.resolve
    viteEntryResolved = res(viteEntryPath)
    assert(viteEntryResolved)
    assert(isAbsolute(viteEntryResolved))
    assert(moduleExists(`./${viteEntryFile}`, dir))
  } catch (err) {
    throw new Error(
      `You stumbled upon a known bug. Please reach out at ${projectInfo.githubRepository}/issues/new or ${
        projectInfo.discordInvite
      } and include this message. Debug info (vite-plugin-ssr maintainer will use this to fix the bug): ${JSON.stringify(
        {
          dir,
          viteEntryFile,
          viteEntryPath,
          viteEntryResolved,
          requireTypeof,
          requireConstructor,
          requireResolveTypeof,
          requireResolveConstructor,
        },
      )}`,
    )
  }
}
*/

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
    return __filename === require.resolve(__filename)
  } catch (_) {
    return false
  }
}
