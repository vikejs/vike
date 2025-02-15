export { viteIsSSR }
export { viteIsSSR_options }
export { viteIsSSR_transform }

import type { ResolvedConfig, UserConfig } from 'vite'
import { assert } from '../../../utils/assert.js'
import { isObject } from '../../../utils/isObject.js'

function viteIsSSR(config: ResolvedConfig | UserConfig): boolean {
  return !!config?.build?.ssr
}

// https://github.com/vitejs/vite/discussions/5109#discussioncomment-1450726
function viteIsSSR_options(options: undefined | boolean | { ssr?: boolean }): boolean {
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

function viteIsSSR_transform(config: ResolvedConfig, options: { ssr?: boolean } | undefined): boolean {
  const isBuild = config.command === 'build'
  if (isBuild) {
    assert(typeof config.build.ssr === 'boolean')
    const isServerSide: boolean = config.build.ssr
    if (options !== undefined) {
      assert(options.ssr === isServerSide)
    }
    return isServerSide
  } else {
    assert(typeof options?.ssr === 'boolean')
    const isServerSide: boolean = options.ssr
    return isServerSide
  }
}
