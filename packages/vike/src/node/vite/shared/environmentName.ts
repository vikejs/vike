export { isVikeEnvironmentBuiltIn }

import '../assertEnvVite.js'

function isVikeEnvironmentBuiltIn(environmentName: string): boolean {
  return environmentName === 'server' || environmentName === 'client'
}
