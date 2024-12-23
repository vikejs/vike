import docpressConfig from '@brillout/docpress/vite-config'
import svgr from 'vite-plugin-svgr'
import type { UserConfig } from 'vite'

export default {
  ...docpressConfig,
  plugins: [
    //
    ...docpressConfig.plugins!,
    svgr(),
    pluginIconSvgInjectColor()
  ]
} satisfies UserConfig

function pluginIconSvgInjectColor() {
  return {
    name: 'vike/docs:pluginIconSvgInjectColor',
    // enforce: 'pre',
    transform: {
      // order: 'pre',
      async handler(code: string, id: string) {
        if (!id.endsWith('.svg')) return
        // console.log('id', id)
        if (!(id.endsWith('.svg') && id.includes('pages/index/icons/'))) {
          return
        }
        console.log('-id', id)
        console.log('-code', code)
        return code.replace('currentColor', 'red')
      }
    }
  } as const
}
