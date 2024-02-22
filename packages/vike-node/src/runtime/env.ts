export { getIsDevEnv, getIsWorkerEnv, setIsWorkerEnv, setPluginLoaded }
//TODO: global object
declare global {
  var isWorkerEnv: boolean
  var isPluginLoaded: boolean
}

globalThis.isWorkerEnv ??= false
function setIsWorkerEnv() {
  globalThis.isWorkerEnv = true
}

function getIsWorkerEnv() {
  return globalThis.isWorkerEnv
}

function setPluginLoaded() {
  globalThis.isPluginLoaded = true
}

function getPluginLoaded() {
  return globalThis.isPluginLoaded
}

function getIsDevEnv() {
  return getIsWorkerEnv() || getPluginLoaded() || process.env.NODE_ENV === 'development'
}
