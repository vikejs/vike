export { viteIsSSR }
export { viteIsSSR_options }
export { viteIsSSR_transform }

import type { ResolvedConfig, UserConfig } from 'vite'
import { assert } from '../../../utils/assert.js'

function viteIsSSR(config: ResolvedConfig | UserConfig): boolean {
  return !!config?.build?.ssr
}

function viteIsSSR_options(options: undefined | { ssr?: boolean }): boolean {
  if (options === undefined) return false
  assert(typeof options?.ssr === 'boolean')
  return options.ssr
}

function viteIsSSR_transform(config: ResolvedConfig, options: { ssr?: boolean } | undefined): boolean {
  const isBuild = config.command === 'build'
  if (isBuild) {
    assert(typeof config.build.ssr === 'boolean')
    const val = viteIsSSR(config)
    if (options !== undefined) assert(val === viteIsSSR_options(options))
    return val
  } else {
    return viteIsSSR_options(options)
  }
}
