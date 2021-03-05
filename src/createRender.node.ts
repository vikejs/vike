import { setGlobal } from './global.node'
import { render } from './render.node'
import { hasProp } from './utils'
import { assertUsage } from './utils/assert'
import { normalize as pathNormalize } from 'path'

export { createRender }

let alreadyCalled = false

type Args = {
  viteDevServer?: any
  root: string
  isProduction?: boolean
}
type Render = typeof render

function createRender({ viteDevServer, root, isProduction }: Args): Render {
  assertUsage(!alreadyCalled, '`createRender()` should be called only once.')
  alreadyCalled = true

  assertArguments({ viteDevServer, root, isProduction })

  setGlobal({
    isProduction,
    viteDevServer,
    root
  })

  return render
}

function assertArguments({ viteDevServer, root, isProduction }: Args) {
  assertUsage(
    root,
    '`createRender({ viteDevServer, root, isProduction })`: argument `root` is missing.'
  )
  assertUsage(
    typeof root === 'string',
    '`createRender({ viteDevServer, root, isProduction })`: argument `root` should be a string.'
  )
  assertUsage(
    [true, false, undefined].includes(isProduction),
    '`createRender({ viteDevServer, root, isProduction })`: argument `isProduction` should be `true`, `false`, or `undefined`.'
  )
  assertUsage(
    isProduction !== true || viteDevServer === undefined,
    '`createRender({ viteDevServer, root, isProduction })`: if `isProduction` is `true`, then `viteDevServer` should be `undefined`.'
  )
  assertUsage(
    isProduction === true || !!viteDevServer,
    '`createRender({ viteDevServer, root, isProduction })`: if `isProduction` is not `true`, then `viteDevServer` cannot be `undefined`.'
  )
  assertUsage(
    hasProp(viteDevServer, 'config') &&
      hasProp(viteDevServer.config, 'root') &&
      typeof viteDevServer.config.root === 'string',
    '`createRender({ viteDevServer, root, isProduction })`: argument `viteDevServer` should be `viteDevServer = await vite.createServer()`.'
  )
  assertUsage(
    pathNormalize(viteDevServer.config.root) === pathNormalize(root),
    '`createRender({ viteDevServer, root, isProduction })`: wrong `root` value, make sure that `path.normalize(root) === path.normalize(viteDevServer.root)`.'
  )
}
