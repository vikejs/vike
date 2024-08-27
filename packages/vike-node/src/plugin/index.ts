export { vikeNode, vikeNode as default }

import { ConfigVikeNodePlugin, ConfigVikeNodeResolved } from '../types.js'
import { commonConfig } from './plugins/commonConfig.js'
import { serverEntryPlugin } from './plugins/serverEntryPlugin.js'
import { standalonePlugin } from './plugins/standalonePlugin.js'
import { resolveConfig } from './utils/resolveConfig.js'
import { vikeNodeDev } from 'vike-node-dev/plugin'

function vikeNode(config: ConfigVikeNodePlugin) {
  const resolvedConfig: ConfigVikeNodeResolved = resolveConfig({ server: config })

  return [
    commonConfig(resolvedConfig),
    serverEntryPlugin(),
    vikeNodeDev(resolvedConfig.server.entry.index),
    standalonePlugin()
  ]
}
