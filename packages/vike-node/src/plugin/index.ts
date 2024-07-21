export { vikeNode, vikeNode as default }

import { store } from '../runtime/env.js'
import { ConfigVikeNode } from '../types.js'
import { commonConfig } from './plugins/commonConfig.js'
import { devServerPlugin } from './plugins/devServer/devServerPlugin.js'
import { serverEntryPlugin } from './plugins/serverEntryPlugin.js'
import { standalonePlugin } from './plugins/standalonePlugin.js'

store.isPluginLoaded = true

function vikeNode(config: ConfigVikeNode) {
  return [commonConfig(config), serverEntryPlugin(), devServerPlugin(), standalonePlugin()]
}
