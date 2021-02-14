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
}): (url: string) => Promise<string | null> {
  assertUsage(!alreadyCalled, '`createRender` can be called only once.')
  alreadyCalled = true
  setGlobal({
    isProduction,
    viteDevServer,
    root
  })
  return async (url: string) => {
    const html = await render(url)
    if (!html) {
      return null
    }
    return html
  }
}
