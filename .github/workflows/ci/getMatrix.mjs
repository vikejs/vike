import { cmd } from './utils.mjs'
import assert from 'assert'
const testRE = /(\.|\/)(test|spec)\./
const testCmdE2e = 'pnpm run test:e2e'

/** @typedef { ({ name: string, TEST_FILES: string, testCmd: string } & Setup)[] } MatrixEntry */

const root = cmd('git rev-parse --show-toplevel')
const projectFiles = cmd(`git ls-files`, { cwd: root }).split(' ')
/** @type string[] */
const testFiles = projectFiles.filter((file) => testRE.test(file))
/** @typedef {{os: string, node_version: string}} Setup */
/** @type Setup[] */
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
const setupWorst = {
  os: 'windows-latest',
  node_version: '14',
}
const setupCloudflareWebpack = {
  os: 'ubuntu-latest',
  node_version: '16',
}

/** @type Record<string, { testFiles: null | string[], setups: Setup[], testCmd: string }> */
const testJobs = {
  // Unit tests
  'Unit Tests': {
    testFiles: [],
    setups: [setupWorst],
    testCmd: 'pnpm run test:units',
  },

  // Check all types
  TypeScript: {
    testFiles: null,
    setups: [setupFast],
    testCmd: 'pnpm run test:types',
  },

  // E2e tests
  Examples: {
    testFiles: [],
    setups,
    testCmd: testCmdE2e,
  },
  Boilerplates: {
    testFiles: [],
    setups: [setupFast],
    testCmd: testCmdE2e,
  },
  'Cloudflare + esbuild': {
    testFiles: [],
    setups: [setupFast],
    testCmd: testCmdE2e,
  },
  'Cloudflare + webpack': {
    testFiles: [],
    setups: [setupCloudflareWebpack],
    testCmd: testCmdE2e,
  },
}

testFiles.forEach((testFile) => {
  const category = getCategory(testFile)
  assert(category in testJobs, "Following category doesn't exist: " + category)
  const job = testJobs[category]
  assert(job.testFiles)
  job.testFiles.push(testFile)
})

/** @type { (testFile: string) => string } */
function getCategory(testFile) {
  if (testFile.includes('.spec.')) {
    return 'Unit Tests'
  }
  if (testFile.startsWith('boilerplates/')) {
    return 'Boilerplates'
  }
  if (testFile.startsWith('examples/')) {
    if (testFile.includes('cloudflare')) {
      if (testFile.includes('webpack')) {
        return 'Cloudflare + webpack'
      } else {
        return 'Cloudflare + esbuild'
      }
    }
    return 'Examples'
  }
  assert(false, 'Cannot find category for test file: ' + testFile)
}

/** @type MatrixEntry */
const matrix = []
Object.entries(testJobs).map(([name, { testFiles, setups, testCmd }]) => {
  setups.forEach((setup) => {
    matrix.push({
      testCmd,
      name: name + getJobName(setup),
      TEST_FILES: (testFiles ?? []).join(' '),
      ...setup,
    })
  })
})

/*
console.log(JSON.stringify(matrix, null, 2))
console.log(matrix.length)
/*/
console.log(`{"include":${JSON.stringify(matrix)}}`)
//*/

/** @type { (setup: Setup) => string } */
function getJobName(setup) {
  const { os, node_version } = setup
  let osName
  if (os === 'ubuntu-latest') {
    osName = 'Ubuntu'
  }
  if (os === 'macos-latest') {
    osName = 'Mac'
  }
  if (os === 'windows-latest') {
    osName = 'Win'
  }
  const setupName = ` - ${osName} - Node.js ${node_version}`
  return setupName
}
