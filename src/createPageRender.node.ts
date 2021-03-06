import { setGlobal } from './global.node'
import { renderPage } from './renderPage.node'
import { hasProp } from './utils'
import { assertUsage } from './utils/assert'
import { normalize as pathNormalize } from 'path'

export { createPageRender }

let alreadyCalled = false

type Args = {
  viteDevServer?: any
  root: string
  isProduction?: boolean
}
type RenderPage = typeof renderPage

function createPageRender({
  viteDevServer,
  root,
  isProduction
}: Args): RenderPage {
  assertUsage(
    !alreadyCalled,
    '`createPageRender()` should be called only once.'
  )
  alreadyCalled = true

  assertArguments({ viteDevServer, root, isProduction })

  setGlobal({
    isProduction,
    viteDevServer,
    root
  })

  return renderPage
}

function assertArguments({ viteDevServer, root, isProduction }: Args) {
  assertUsage(
    root,
    '`createPageRender({ viteDevServer, root, isProduction })`: argument `root` is missing.'
  )
  assertUsage(
    typeof root === 'string',
    '`createPageRender({ viteDevServer, root, isProduction })`: argument `root` should be a string.'
  )
  assertUsage(
    [true, false, undefined].includes(isProduction),
    '`createPageRender({ viteDevServer, root, isProduction })`: argument `isProduction` should be `true`, `false`, or `undefined`.'
  )
  assertUsage(
    isProduction !== true || viteDevServer === undefined,
    '`createPageRender({ viteDevServer, root, isProduction })`: if `isProduction` is `true`, then `viteDevServer` should be `undefined`.'
  )
  assertUsage(
    isProduction === true || !!viteDevServer,
    '`createPageRender({ viteDevServer, root, isProduction })`: if `isProduction` is not `true`, then `viteDevServer` cannot be `undefined`.'
  )
  assertUsage(
    hasProp(viteDevServer, 'config') &&
      hasProp(viteDevServer.config, 'root') &&
      typeof viteDevServer.config.root === 'string',
    '`createPageRender({ viteDevServer, root, isProduction })`: argument `viteDevServer` should be `viteDevServer = await vite.createServer()`.'
  )
  assertUsage(
    pathNormalize(viteDevServer.config.root) === pathNormalize(root),
    '`createPageRender({ viteDevServer, root, isProduction })`: wrong `root` value, make sure that `path.normalize(root) === path.normalize(viteDevServer.root)`.'
  )
}
