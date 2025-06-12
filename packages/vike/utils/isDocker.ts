export { isDocker }

import fs from 'node:fs'
import { assertIsNotProductionRuntime } from './assertSetup.js'
assertIsNotProductionRuntime()

function isDocker() {
  return hasContainerEnv() || isDockerContainer()
}

// Podman detection
// https://github.com/sindresorhus/is-inside-container/blob/7f0dc884bda6b368d89ec90e77f2bef3b87e6f09/index.js
function hasContainerEnv() {
  try {
    fs.statSync('/run/.containerenv')
    return true
  } catch {
    return false
  }
}

// Docker detection
// https://github.com/sindresorhus/is-docker/blob/1cfd2b5bfa9fbd87d2b22e6f514e7d5cc60a794b/index.js
function isDockerContainer() {
  return hasDockerEnv() || hasDockerCGroup()
}
function hasDockerEnv() {
  try {
    fs.statSync('/.dockerenv')
    return true
  } catch {
    return false
  }
}
function hasDockerCGroup() {
  try {
    return fs.readFileSync('/proc/self/cgroup', 'utf8').includes('docker')
  } catch {
    return false
  }
}
