import { cmd } from './utils.mjs'
import assert from 'assert'
const testRE = /\/__tests__\/.*|(\.|\/)(test|spec)\.[jt]sx?$/ // https://jestjs.io/docs/configuration#testregex-string--arraystring

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
const setupCloudflareWebpack = {
  os: 'ubuntu-latest',
  node_version: '17',
}

/** @type Record<string, { testFiles: string[], setups: Setup[] }> */
const testJobs = {
  TypeScript: {
    testFiles: ['TYPESCRIPT'],
    setups: [setupFast],
  },
  Examples: {
    testFiles: [],
    setups,
  },
  Boilerplates: {
    testFiles: [],
    setups: [setupFast],
  },
  'Cloudflare + esbuild': {
    testFiles: [],
    setups: [setupFast],
  },
  'Cloudflare + webpack': {
    testFiles: [],
    setups: [setupCloudflareWebpack],
  },
  'Unit Tests': {
    testFiles: [],
    setups,
  },
}

testFiles.forEach((testFile) => {
  /** @type string */
  let category
  if (testFile.startsWith('boilerplates/')) {
    category = 'Boilerplates'
  } else if (testFile.startsWith('examples/')) {
    if (!testFile.includes('cloudflare')) {
      category = 'Examples'
    } else {
      if (testFile.includes('webpack')) {
        category = 'Cloudflare + esbuild'
      } else {
        category = 'Cloudflare + webpack'
      }
    }
  } else {
    assert(testFile.startsWith('vite-plugin-ssr/'))
    category = 'Unit Tests'
  }
  assert(category in testJobs, category)
  testJobs[category].testFiles.push(testFile)
})

/** @typedef { ({ name: string, TEST_FILES: string } & Setup)[] } MatrixEntry */
/** @type MatrixEntry */
const matrix = []
Object.entries(testJobs).map(([name, { testFiles, setups }]) => {
  setups.forEach((setup) => {
    matrix.push({
      name: name + getSetupName(setup),
      TEST_FILES: testFiles.join(' '),
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
function getSetupName(setup) {
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
  const setupName = `, ${osName}, Node.js ${node_version}`
  return setupName
}
