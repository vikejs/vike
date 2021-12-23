import { isAbsolute, resolve } from 'path'
import { setPageFilesAsync } from '../../shared/getPageFiles'
import { assert } from '../../shared/utils/assert'
import { getSsrEnv } from '../ssrEnv'
import { hasProp, projectInfo } from '../../shared/utils'
import { moduleExists } from '../../shared/utils/moduleExists'
import { loadViteEntry } from './loadViteEntry'

setPageFilesAsync(setPageFiles)

async function setPageFiles(): Promise<unknown> {
  const ssrEnv = getSsrEnv()

  const viteEntryFile = 'pageFiles.js'
  assertEntry(viteEntryFile)
  const userDist = `${ssrEnv.root}/${ssrEnv.outDir}`
  // Current directory: vite-plugin-ssr/dist/cjs/node/page-files/
  const pluginDist = `../../../../dist`
  const prodPath = `${userDist}/server/${viteEntryFile}`
  const devPath = `${pluginDist}/esm/node/page-files/${viteEntryFile}`

  const errorMessage =
    'Make sure to run `vite build && vite build --ssr` before running your Node.js server with `createPageRenderer({ isProduction: true })`'

  const moduleExports = await loadViteEntry({
    devPath,
    prodPath,
    errorMessage,
    viteDevServer: ssrEnv.viteDevServer,
    isProduction: ssrEnv.isProduction,
  })

  const pageFiles: unknown = (moduleExports as any).pageFiles || (moduleExports as any).default.pageFiles
  assert(pageFiles)
  assert(hasProp(pageFiles, '.page'))
  return pageFiles
}

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
