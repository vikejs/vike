export { getVikeEnvironmentName }
export { isVikeEnvironmentBuiltIn }
export { isEnvironmentNamed }

import '../assertEnvVite.js'

// - Any Vite environment that isn't named (`ssr`, `client`, a Cloudflare worker, ...) is Vike's `server` or `client` environment
function getVikeEnvironmentName(
  viteEnvironmentName: string,
  isServerSide: boolean,
  runtimeEnvironmentNames: string[],
): string {
  if (isEnvironmentNamed(viteEnvironmentName, runtimeEnvironmentNames)) return viteEnvironmentName
  return isServerSide ? 'server' : 'client'
}

// - A Vite environment named by a `meta.env` key (e.g. `rsc`) is a Vike environment of its own
function isEnvironmentNamed(viteEnvironmentName: string, runtimeEnvironmentNames: string[]): boolean {
  return !isVikeEnvironmentBuiltIn(viteEnvironmentName) && runtimeEnvironmentNames.includes(viteEnvironmentName)
}

// - Vike's `server` and `client` environments don't need to be declared in Vite's `config.environments`
function isVikeEnvironmentBuiltIn(environmentName: string): boolean {
  return environmentName === 'server' || environmentName === 'client'
}
