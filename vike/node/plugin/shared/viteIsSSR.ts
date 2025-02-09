import type { ResolvedConfig, UserConfig } from 'vite'
import { assert } from '../../../utils/assert.js'
import { isObject } from '../../../utils/isObject.js'

export { viteIsSSR }
export { viteIsSSR_options }

function viteIsSSR(config: ResolvedConfig | UserConfig): boolean {
  if (!!config?.build?.ssr) return true
  if (config.vike!.config.viteEnvironmentAPI) {
    assert(config._isVite6Builder)
    return config._isVite6Builder!.isSSR
  }
  return false
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
