export { getConfigVikeNode }

import { ResolvedConfig } from 'vite'
import { ConfigVikeNodeResolved } from '../../types.js'
import { assert } from '../../utils/assert.js'

function getConfigVikeNode(config: ResolvedConfig): ConfigVikeNodeResolved {
  const { configVikeNode } = config as any
  assert(configVikeNode)
  return configVikeNode
}
