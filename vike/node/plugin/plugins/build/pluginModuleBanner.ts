export { pluginModuleBanner }

import type { ResolvedConfig, Plugin } from 'vite'
import MagicString from 'magic-string'
import { assert } from '../../utils.js'
import { removeVirtualIdTag } from '../../../shared/virtual-files.js'
import { isViteServerBuild, isViteServerBuild_safe } from '../../shared/isViteServerBuild.js'

// Rollup's banner feature doesn't work with Vite: https://github.com/vitejs/vite/issues/8412
// But, anyways, we want to prepend the banner at the beginning of each module, not at the beginning of each file (I believe that's what Rollup's banner feature does).

const vikeModuleBannerPlaceholder = 'vikeModuleBannerPlaceholder'

function pluginModuleBanner(): Plugin {
  let config: ResolvedConfig

  return {
    name: 'vike:pluginModuleBanner',
    enforce: 'post',
    apply: 'build',
    configResolved(config_) {
      config = config_
    },
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        for (const module of Object.values(bundle)) {
          if (module.type === 'chunk') {
            if (isViteServerBuild(config)) {
              const codeOld = module.code
              const codeNew = codeOld.replace(
                /vikeModuleBannerPlaceholder\("([^"]*)"\);/g,
                '/* $1 [vike:pluginModuleBanner] */'
              )
              assert(!codeNew.includes(vikeModuleBannerPlaceholder))
              module.code = codeNew
            } else {
              assert(!module.code.includes(vikeModuleBannerPlaceholder))
            }
          }
        }
      }
    },
    transform: {
      order: 'post',
      handler(code, id, options) {
        if (!isViteServerBuild_safe(config, options)) return
        if (id.startsWith('\0')) id = id
        id = removeVirtualIdTag(id)
        if (id.startsWith(config.root)) id = id.slice(config.root.length + 1)
        const s = new MagicString(code)
        // No need to insert a new line; Rollup formats the code and will insert a new line.
        s.prepend(`${vikeModuleBannerPlaceholder}(${JSON.stringify(id)}); `)
        return {
          code: s.toString(),
          map: s.generateMap({ hires: true, source: id })
        }
      }
    }
  }
}
