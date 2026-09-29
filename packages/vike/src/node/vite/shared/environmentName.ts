export { getVikeEnvironmentName }
export { isVikeEnvironmentBuiltIn }

import '../assertEnvVite.js'

// - A Vite environment named by a `meta.env` key (e.g. `rsc`) is a Vike environment of its own
// - Any other Vite environment (`ssr`, `client`, a Cloudflare worker, ...) is Vike's `server` or `client` environment
function getVikeEnvironmentName(
  viteEnvironmentName: string,
  isServerSide: boolean,
  runtimeEnvironmentNames: string[],
): string {
  if (!isVikeEnvironmentBuiltIn(viteEnvironmentName) && runtimeEnvironmentNames.includes(viteEnvironmentName)) {
    return viteEnvironmentName
  }
  return isServerSide ? 'server' : 'client'
}

// - Vike's `server` and `client` environments don't need to be declared in Vite's `config.environments`
function isVikeEnvironmentBuiltIn(environmentName: string): boolean {
  return environmentName === 'server' || environmentName === 'client'
}
