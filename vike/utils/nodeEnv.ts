export { getNodeEnv }
export { setNodeEnvToProduction }
export { isNodeEnvDev }
export { getNodeEnvDesc }

import pc from '@brillout/picocolors'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
assertIsNotBrowser()

function getNodeEnv(): null | undefined | string {
  if (typeof process === 'undefined') return null
  return process.env.NODE_ENV
}

function setNodeEnvToProduction(): void | undefined {
  // The statement `process.env['NODE_ENV'] = 'production'` chokes webpack v4
  const proc = process
  const { env } = proc
  env.NODE_ENV = 'production'
}

function isNodeEnvDev(): boolean {
  const nodeEnv = getNodeEnv()
  if (!nodeEnv) return true
  if (['development', 'dev'].includes(nodeEnv)) return true
  // That's quite aggressive, let's see if some user complains
  return false
}

function getNodeEnvDesc(): `environment is set to be a ${string} environment by process.env.NODE_ENV === ${string}` {
  const nodeEnv = getNodeEnv()
  const isDev = isNodeEnvDev()
  const nodeEnvDesc = `environment is set to be a ${
    (isDev ? 'development' : 'production') as string
  } environment by ${pc.cyan(`process.env.NODE_ENV === ${JSON.stringify(nodeEnv)}`)}` as const
  return nodeEnvDesc
}
