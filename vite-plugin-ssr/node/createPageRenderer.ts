import { SsrEnv, setSsrEnv } from './ssrEnv'
import { renderPage } from './renderPage'
import { hasProp } from '../shared/utils'
import { assert, assertUsage } from '../shared/utils/assert'
import { normalize as pathNormalize } from 'path'
import { assertBaseUrl } from './baseUrlHandling'
import { importBuildWasCalled } from './importBuild'

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
  isProduction,
  base = '/'
}: {
  viteDevServer?: unknown
  /* Conflicting `ViteDevServer` type definitions upon different Vite versions installed
  viteDevServer?: ViteDevServer
  */
  root?: string
  isProduction?: boolean
  base?: string
}): RenderPage {
  assertUsage(
    !wasCalled,
    'You are trying to call `createPageRenderer()` a second time, but it should be called only once.'
  )
  wasCalled = true

  const ssrEnv = { viteDevServer, root, isProduction, baseUrl: base }
  assertArguments(ssrEnv, Array.from(arguments))
  setSsrEnv(ssrEnv)

  return renderPage
}

function assertArguments(
  ssrEnv: {
    viteDevServer?: unknown
    root?: unknown
    isProduction?: unknown
    baseUrl?: unknown
  },
  args: unknown[]
): asserts ssrEnv is SsrEnv {
  const { viteDevServer, root, isProduction, baseUrl } = ssrEnv
  assertUsage(
    root === undefined || typeof root === 'string',
    '`createPageRenderer({ root })`: argument `root` should be a string.'
  )
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
    assertUsage(
      hasProp(viteDevServer, 'config') &&
        hasProp(viteDevServer.config, 'root') &&
        typeof viteDevServer.config.root === 'string',
      '`createPageRenderer({ viteDevServer, isProduction })`: if `isProduction` is not `true`, then `viteDevServer` should be `viteDevServer = await vite.createServer(/*...*/)`.'
    )
    assertUsage(
      pathNormalize(viteDevServer.config.root) === pathNormalize(root),
      '`createPageRenderer({ viteDevServer, root })`: wrong `root` value, make sure that `path.normalize(root) === path.normalize(viteDevServer.root)`.'
    )
  }
  assertUsage(args.length === 1, '`createPageRenderer()`: all arguments should be passed as a single argument object.')
  assert(typeof args[0] === 'object' && args[0] !== null)
  Object.keys(args[0]).forEach((argName) => {
    assertUsage(
      ['viteDevServer', 'root', 'isProduction', 'base'].includes(argName),
      '`createPageRenderer()`: Unknown argument `' + argName + '`.'
    )
  })
}
