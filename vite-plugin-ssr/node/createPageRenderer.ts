import { SsrEnv, setSsrEnv } from './ssrEnv'
import { renderPage, renderPageWithoutThrowing } from './renderPage'
import { hasProp } from '../shared/utils'
import { assert, assertUsage } from '../shared/utils/assert'
import { normalize as pathNormalize } from 'path'
import { assertBaseUrl } from './baseUrlHandling'
import { importBuildWasCalled } from './importBuild'
import type { ViteDevServer } from 'vite'

export { createPageRenderer }
export { createPageRendererWasCalled }

let wasCalled = false

function createPageRendererWasCalled() {
  return wasCalled
}

type RenderPage = typeof renderPage

function createPageRenderer({
  viteDevServer,
  root,
  outDir = 'dist',
  isProduction,
  base = '/'
}: {
  viteDevServer?: unknown
  /* Conflicting `ViteDevServer` type definitions upon different Vite versions installed
  viteDevServer?: ViteDevServer
  */
  root?: string
  outDir?: string
  isProduction?: boolean
  base?: string
}): RenderPage {
  assertUsage(
    !wasCalled,
    'You are trying to call `createPageRenderer()` a second time, but it should be called only once.'
  )
  wasCalled = true

  const ssrEnv = { viteDevServer, root, outDir, isProduction, baseUrl: base }
  assertArguments(ssrEnv, Array.from(arguments))
  setSsrEnv(ssrEnv)

  return renderPageWithoutThrowing as RenderPage
}

function assertArguments(
  ssrEnv: {
    viteDevServer?: unknown
    root?: unknown
    outDir?: unknown
    isProduction?: unknown
    baseUrl?: unknown
  },
  args: unknown[]
): asserts ssrEnv is SsrEnv {
  const { viteDevServer, root, outDir, isProduction, baseUrl } = ssrEnv
  assertUsage(
    root === undefined || typeof root === 'string',
    '`createPageRenderer({ root })`: argument `root` should be a string.'
  )
  assertUsage(typeof outDir === 'string', '`createPageRenderer({ outDir })`: argument `outDir` should be a string.')
  assertUsage(
    typeof baseUrl === 'string',
    '`createPageRenderer({ base })`: argument `base` should be a string or `undefined`.'
  )
  assertBaseUrl(baseUrl, '`createPageRenderer({ base })`: ')
  assertUsage(
    isProduction === true || isProduction === false || isProduction === undefined,
    '`createPageRenderer({ isProduction })`: argument `isProduction` should be `true`, `false`, or `undefined`.'
  )
  if (importBuildWasCalled()) {
    assertUsage(
      isProduction,
      '`createPageRenderer({ isProduction })`: argument `isProduction` should be `true` if `dist/server/importBuild.js` is loaded. (You should load `dist/server/importBuild.js` only in production.)'
    )
    assertUsage(
      root === undefined,
      '`createPageRenderer({ root })`: argument `root` has no effect if `dist/server/importBuild.js` is loaded. Remove the `root` argument.'
    )
  }
  if (isProduction === true) {
    assertUsage(
      viteDevServer === undefined,
      '`createPageRenderer({ viteDevServer, isProduction })`: if `isProduction` is `true`, then `viteDevServer` should be `undefined`.'
    )
    assertUsage(
      root || importBuildWasCalled(),
      "`createPageRenderer({ root })`: argument `root` is missing. (Alternatively, if `root` doesn't exist because you are bundling your server code into a single file, then load `dist/server/importBuild.js`.)"
    )
  } else {
    assertUsage(root, '`createPageRenderer({ root })`: argument `root` is missing.')

    assertUsage(
      !!viteDevServer,
      '`createPageRenderer({ viteDevServer, isProduction })`: if `isProduction` is not `true`, then `viteDevServer` cannot be `undefined`.'
    )

    const wrongViteDevServerValueError =
      '`createPageRenderer({ viteDevServer, isProduction })`: if `isProduction` is not `true`, then `viteDevServer` should be `viteDevServer = await vite.createServer(/*...*/)`.'
    assertUsage(
      hasProp(viteDevServer, 'config') &&
        hasProp(viteDevServer.config, 'root') &&
        typeof viteDevServer.config.root === 'string',
      wrongViteDevServerValueError
    )
    assertUsage(
      pathNormalize(viteDevServer.config.root) === pathNormalize(root),
      '`createPageRenderer({ viteDevServer, root })`: wrong `root` value, make sure that `path.normalize(root) === path.normalize(viteDevServer.root)`.'
    )

    assertUsage(
      hasProp(viteDevServer, 'config', 'object') && hasProp(viteDevServer.config, 'plugins', 'array'),
      wrongViteDevServerValueError
    )
    assertUsage(
      (viteDevServer as any as ViteDevServer).config.plugins.find((plugin) => plugin.name.startsWith('vite-pugin-ssr')),
      "`vite-pugin-ssr`'s Vite plugin is not installed. Make sure to add it to your `vite.config.js`."
    )
  }
  assertUsage(args.length === 1, '`createPageRenderer()`: all arguments should be passed as a single argument object.')
  assert(typeof args[0] === 'object' && args[0] !== null)
  Object.keys(args[0]).forEach((argName) => {
    assertUsage(
      ['viteDevServer', 'root', 'outDir', 'isProduction', 'base'].includes(argName),
      '`createPageRenderer()`: Unknown argument `' + argName + '`.'
    )
  })
}
