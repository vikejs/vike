import { cmd } from './utils.mjs'

// https://jestjs.io/docs/configuration#testregex-string--arraystring
const testRE = /\/__tests__\/.*|(\.|\/)(test|spec)\.[jt]sx?$/

const root = cmd('git rev-parse --show-toplevel', { result: 'single' })
const projectFiles = cmd(`git ls-files`, { cwd: root, result: 'many' })
const testFiles = projectFiles.filter((file) => testRE.test(file))

const setups = [
  {
    os: 'ubuntu-latest',
    node_version: '16',
  },
  {
    os: 'macos-latest',
    node_version: '17',
  },
  {
    os: 'windows-latest',
    node_version: '14',
  },
]
const setupFast = {
  os: 'ubuntu-latest',
  node_version: '18',
}

const matrix = [
  {
    setupName: 'TypeScript Types',
    SINGLE_TEST: 'TYPESCRIPT',
    ...setupFast,
  },
]

testFiles.forEach((testFile) => {
  setups.forEach((setup) => {
    const { os, node_version } = setup
    const setupName = getSetupName(setup)
    const name = testFile + ' ' + setupName
    matrix.push({
      name,
      SINGLE_TEST: testFile,
      os,
      node_version,
    })
  })
})

/*
console.log(JSON.stringify(matrix, null, 2))
console.log(matrix.length)
/*/
console.log(`{"include":${JSON.stringify(matrix)}}`)
//*/

function getSetupName(setup) {
  const { os, node_version } = setup
  let osName
  if (os === 'ubuntu-latest') {
    osName = 'Unix'
  }
  if (os === 'macos-latest') {
    osName = 'Mac'
  }
  if (os === 'windows-latest') {
    osName = 'Win'
  }
  const nodeName = 'Node ' + node_version
  const setupName = `${osName} ${nodeName}`
  return setupName
}
