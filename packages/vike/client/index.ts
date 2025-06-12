import { isBrowser } from '../utils/isBrowser.js'
import { assert } from '../utils/assert.js'
assert(isBrowser())

export {
  getGlobalContext,
  getGlobalContext as getGlobalContextAsync,
  getGlobalContextSync,
} from './shared/createGetGlobalContextClient.js'
