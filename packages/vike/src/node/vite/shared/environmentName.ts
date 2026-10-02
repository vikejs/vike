export { isVikeEnvironmentBuiltIn }

import '../assertEnvVite.js'

// - Vike's `server` and `client` environments don't need to be declared in Vite's `config.environments`
function isVikeEnvironmentBuiltIn(environmentName: string): boolean {
  return environmentName === 'server' || environmentName === 'client'
}
