// TODO/ai: rename file to isEnvironmentBuiltIn + look at this PR for other places where this convention is nice
export { isEnvironmentBuiltIn }

import '../assertEnvVite.js'

function isEnvironmentBuiltIn(environmentName: string): boolean {
  return environmentName === 'server' || environmentName === 'client'
}
