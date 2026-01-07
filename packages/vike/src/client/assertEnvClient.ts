// TODO/ai use this (see how assertEnvServer.ts is used)

import { assertIsBrowser } from '../utils/assertIsBrowser.js'

assertEnv()

function assertEnv() {
  assertIsBrowser()
}
