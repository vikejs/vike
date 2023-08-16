import { assert } from './assert.js'
import { isObject } from './isObject.js'

export { viteIsSSR }
export { viteIsSSR_options }

function viteIsSSR(config: { build?: { ssr?: boolean | string } }): boolean {
  return !!config?.build?.ssr
}

type Options = undefined | boolean | { ssr?: boolean }
// https://github.com/vitejs/vite/discussions/5109#discussioncomment-1450726
function viteIsSSR_options(options: Options): boolean {
  if (options === undefined) {
    return false
  }
  if (typeof options === 'boolean') {
    return options
  }
  if (isObject(options)) {
    return !!options.ssr
  }
  assert(false)
}
