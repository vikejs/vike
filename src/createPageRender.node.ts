import { SsrEnv, setSsrEnv } from './ssrEnv.node'
import { renderPage } from './renderPage.node'
import { hasProp } from './utils'
import { assertUsage } from './utils/assert'
import { normalize as pathNormalize } from 'path'
import { ViteDevServer } from 'vite'

export { createPageRender }

let alreadyCalled = false

type RenderPage = typeof renderPage

function createPageRender({
  viteDevServer,
  root,
  isProduction
}: {
  viteDevServer?: ViteDevServer
  root: string
  isProduction?: boolean
}): RenderPage {
  assertUsage(
    !alreadyCalled,
    '`createPageRender()` should be called only once.'
  )
  alreadyCalled = true

  const ssrEnv = { viteDevServer, root, isProduction }
  assertArguments(ssrEnv)

  setSsrEnv(ssrEnv)

  return renderPage
}

function assertArguments(ssrEnv: {
  viteDevServer?: unknown
  root?: unknown
  isProduction?: unknown
}): asserts ssrEnv is SsrEnv {
  const { viteDevServer, root, isProduction } = ssrEnv
  assertUsage(
    root,
    '`createPageRender({ viteDevServer, root, isProduction })`: argument `root` is missing.'
  )
  assertUsage(
    typeof root === 'string',
    '`createPageRender({ viteDevServer, root, isProduction })`: argument `root` should be a string.'
  )
  assertUsage(
    isProduction === true ||
      isProduction === false ||
      isProduction === undefined,
    '`createPageRender({ viteDevServer, root, isProduction })`: argument `isProduction` should be `true`, `false`, or `undefined`.'
  )
  if (isProduction === true) {
    assertUsage(
      viteDevServer === undefined,
      '`createPageRender({ viteDevServer, root, isProduction })`: if `isProduction` is `true`, then `viteDevServer` should be `undefined`.'
    )
  } else {
    assertUsage(
      !!viteDevServer,
      '`createPageRender({ viteDevServer, root, isProduction })`: if `isProduction` is not `true`, then `viteDevServer` cannot be `undefined`.'
    )
    assertUsage(
      hasProp(viteDevServer, 'config') &&
        hasProp(viteDevServer.config, 'root') &&
        typeof viteDevServer.config.root === 'string',
      '`createPageRender({ viteDevServer, root, isProduction })`: if `isProduction` is not `true`, then `viteDevServer` should be `viteDevServer = await vite.createServer(/*...*/)`.'
    )
    assertUsage(
      pathNormalize(viteDevServer.config.root) === pathNormalize(root),
      '`createPageRender({ viteDevServer, root, isProduction })`: wrong `root` value, make sure that `path.normalize(root) === path.normalize(viteDevServer.root)`.'
    )
  }
}
