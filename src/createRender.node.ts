import { setGlobal } from './global.node'
import { render } from './render.node'
import { assertUsage } from './utils/assert'

export { createRender }

let alreadyCalled = false

function createRender({
  isProduction,
  viteDevServer,
  root
}: {
  isProduction?: boolean
  viteDevServer?: any
  root: string
}): typeof render {
  assertUsage(!alreadyCalled, '`createRender` should be called only once.')
  alreadyCalled = true
  setGlobal({
    isProduction,
    viteDevServer,
    root
  })
  return render
}
