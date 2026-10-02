export { isEnvironmentBuiltIn }
export { isEnvironmentNameValid }

// Vike's built-in environments; every other environment name is an additional environment (e.g. `rsc`)
function isEnvironmentBuiltIn(environmentName: string): boolean {
  return environmentName === 'server' || environmentName === 'client'
}

// `:` separates the environment name from the page ID in virtual file IDs
function isEnvironmentNameValid(environmentName: string): boolean {
  return environmentName !== '' && !environmentName.includes(':')
}
