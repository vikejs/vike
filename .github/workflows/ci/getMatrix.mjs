import { cmd } from './utils.mjs'
import assert from 'assert'
import path from 'path'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const testRE = /(\.|\/)(test|spec)\./
const testCmdE2e = 'pnpm run test:e2e'

/** @typedef { ({ name: string, TEST_FILES: string, testCmd: string } & Setup)[] } MatrixEntry */

const root = cmd('git rev-parse --show-toplevel')
const projectFiles = cmd(`git ls-files`, { cwd: root }).split(' ')

/** @type string[] */
const testFiles = projectFiles.filter((file) => testRE.test(file))
/** @typedef {{os: string, node_version: string}} Setup */
/** @type Setup[] */
const setupExamples = [
  {
    os: 'ubuntu-latest',
    node_version: '16',
  },
  {
    os: 'windows-latest',
    node_version: '14',
  },
]
/** @type Record<string, { testFiles: null | string[], setups: Setup[], testCmd: string }> */
const testJobs = {
  // Unit tests
  'Unit Tests': {
    testFiles: [],
    setups: [{
      os: 'windows-latest',
      node_version: '14',
    }],
    testCmd: 'pnpm run test:units',
  },

  // Check all types
  TypeScript: {
    testFiles: null,
    setups: [{
  os: 'ubuntu-latest',
  node_version: '18',
    }],
    testCmd: 'pnpm run test:types',
  },

  // E2e tests
  'Examples React': {
    testFiles: [],
    setups: setupExamples,
    testCmd: testCmdE2e,
  },
  'Examples Vue/Others': {
    testFiles: [],
    setups: setupExamples,
    testCmd: testCmdE2e,
  },
  Boilerplates: {
    testFiles: [],
    setups: [{
      os: 'macos-latest',
      node_version: '17',
    }],
    testCmd: testCmdE2e,
  },
  'Cloudflare + esbuild': {
    testFiles: [],
    setups: [{
      os: 'ubuntu-latest',
      node_version: '16',
    }],
    testCmd: testCmdE2e,
  },
  'Cloudflare + webpack': {
    testFiles: [],
    setups: [{
      os: 'ubuntu-latest',
      node_version: '16',
    }],
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
    if (isReactExample(testFile)) {
      return 'Examples React'
    } else {
      return 'Examples Vue/Others'
    }
  }
  assert(false, 'Cannot find category for test file: ' + testFile)
}

/** @type { (testFile: string) => boolean } */
function isReactExample(testFile) {
  const pkgJsonFile = path.join(root, path.dirname(testFile), './package.json')
  // await import(pkgJsonFile, { assert: { type: 'json'}})
  const pkgJson = require(pkgJsonFile)
  return !!pkgJson.dependencies['react']
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
