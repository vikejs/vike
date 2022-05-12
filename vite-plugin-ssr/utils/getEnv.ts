export { getEnv }

function getEnv(envName: string): undefined | string {
  if (typeof process === 'undefined' || typeof process.env === 'undefined') {
    return undefined
  }
  return process.env[envName]
}
