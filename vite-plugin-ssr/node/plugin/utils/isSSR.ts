import { assert, isObject } from '../../utils'

export { isSSR_config }
export { isSSR_options }

function isSSR_config(config: { build?: { ssr?: boolean | string } }): boolean {
  return !!config?.build?.ssr
}

type Options = undefined | boolean | { ssr?: boolean }
// https://github.com/vitejs/vite/discussions/5109#discussioncomment-1450726
function isSSR_options(options: Options): boolean {
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
