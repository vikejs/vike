export { isEnvironmentBuiltIn }

import '../assertEnvVite.js'

function isEnvironmentBuiltIn(environmentName: string): boolean {
  return environmentName === 'server' || environmentName === 'client'
}
