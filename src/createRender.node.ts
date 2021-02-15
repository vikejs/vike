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
}): (url: string, initialProps: Record<string, any>) => Promise<string | null> {
  assertUsage(!alreadyCalled, '`createRender` should be called only once.')
  alreadyCalled = true
  setGlobal({
    isProduction,
    viteDevServer,
    root
  })
  return async (
    url: string,
    initialProps: Record<string, any>
  ): Promise<string | null> => {
    const html = await render(url, initialProps)
    if (!html) {
      return null
    }
    return html
  }
}
