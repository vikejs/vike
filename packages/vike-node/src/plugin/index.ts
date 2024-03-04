export { vikeNode, vikeNode as default }

import { setPluginLoaded } from '../runtime/env.js'
import { commonConfig } from './plugins/commonConfig.js'
import { devServerPlugin } from './plugins/devServer/devServerPlugin.js'
import { serverEntryPlugin } from './plugins/serverEntryPlugin.js'
import { standalonePlugin } from './plugins/standalonePlugin.js'

setPluginLoaded()

function vikeNode() {
  return [commonConfig(), serverEntryPlugin(), devServerPlugin(), standalonePlugin()]
}
