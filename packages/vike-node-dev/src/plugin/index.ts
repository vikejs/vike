export { vikeNodeDev, vikeNodeDev as default }

import { globalObject } from '../__internal.js'
import { ConfigVikeNodeDev } from '../types.js'
import { devServerPlugin } from './plugins/devServerPlugin.js'

globalObject.isPluginLoaded = true

function vikeNodeDev(config: ConfigVikeNodeDev) {
  return [devServerPlugin(config)]
}
