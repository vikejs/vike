import netlifyGlue from '@universal-deploy/netlify/vite'
import type { Plugin } from 'vite'
import { enablePluginIf } from '../../shared/enablePluginIf.js'
import { asyncFlatten } from '../../../../utils/asyncFlatten.js'
import '../../assertEnvVite.js'

/**
 * Enable `@universal-deploy/netlify` only if `@netlify/vite-plugin` was found
 */
export function pluginNetlifyGlue(): Plugin[] {
  return netlifyGlue().map((p) => enablePluginIf(isNetlifyPluginInUse, p))
}

const isNetlifyPluginInUse: Parameters<typeof enablePluginIf>[0] = async (userConfig) => {
  const flatPlugins = (await asyncFlatten(userConfig.plugins ?? [])).filter((p): p is Plugin => Boolean(p))
  const foundNetlifyPlugin = flatPlugins.find((p) => p.name.startsWith('vite-plugin-netlify:'))

  return !!foundNetlifyPlugin
}
