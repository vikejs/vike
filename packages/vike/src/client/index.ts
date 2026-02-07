import { isBrowser } from '../utils/isBrowser.js'
import { assert } from '../utils/assert.js'
import './assertEnvClient.js'
assert(isBrowser())

export {
  getGlobalContext,
  getGlobalContext as getGlobalContextAsync,
  getGlobalContextSync,
} from './shared/getGlobalContextClientInternalShared.js'
