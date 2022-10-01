import { cmd } from './utils.mjs'
import assert from 'assert'
import path from 'path'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const args = process.argv

const root = cmd('git rev-parse --show-toplevel')
const projectFiles = cmd(`git ls-files`, { cwd: root }).split(' ')

export { getMatrix }
if (args.includes('--ci')) cli()

/** @typedef { ({ name: string, TEST_FILES: string, testCmd: string } & Setup) } MatrixEntry */
/** @typedef { { name: string, testFiles?: string[], setups: Setup[], testCmd: string } } Job */
/** @typedef {{os: string, node_version: string}} Setup */

function getTestFiles() {
  const testRE = /\.(test|spec)\./
  /** @type string[] */
  const testFiles = projectFiles.filter((file) => testRE.test(file))
  return testFiles
}

/** @type { (testFiles: string[]) => Job[] } */
function getJobs(testFiles) {
  /** @type { Job[] } */
  const jobs = [
    // Unit tests
    {
      name: 'Unit Tests',
      testCmd: 'pnpm run test:units',
      testFiles: testFiles.filter((f) => f.includes('.spec.')),
      setups: [{ os: 'windows-latest', node_version: '14' }]
    },
    {
      name: 'TypeScript',
      testCmd: 'pnpm run test:types',
      setups: [{ os: 'ubuntu-latest', node_version: '18' }]
    },
    {
      name: 'Examples React',
      testCmd: 'pnpm run test:e2e',
      testFiles: findExamples(testFiles, { react: true }),
      setups: [
        {
          os: 'ubuntu-latest',
          node_version: '16'
        },
        {
          os: 'windows-latest',
          node_version: '14'
        }
      ]
    },
    {
      name: 'Examples Vue/Others',
      testFiles: findExamples(testFiles, { react: false }),
      setups: [
        {
          os: 'ubuntu-latest',
          node_version: '16'
        },
        {
          os: 'windows-latest',
          node_version: '14'
        }
      ],
      testCmd: 'pnpm run test:e2e'
    },
    {
      name: 'Boilerplates',
      testCmd: 'pnpm run test:e2e',
      testFiles: testFiles.filter((f) => f.startsWith('boilerplates/')),
      setups: [
        {
          os: 'macos-latest',
          node_version: '17'
        }
      ]
    },
    {
      name: 'Cloudflare',
      testFiles: findExamples(testFiles, { cloudflare: true }),
      setups: [
        {
          os: 'ubuntu-latest',
          node_version: '16'
        }
      ],
      testCmd: 'pnpm run test:e2e'
    },
    {
      name: 'https://vite-plugin-ssr.com',
      testCmd: 'pnpm run test:e2e',
      testFiles: testFiles.filter((f) => f.startsWith('docs/')),
      setups: [
        {
          os: 'ubuntu-latest',
          node_version: '17'
        }
      ]
    }
  ]
  return jobs
}

/** @type { (testFiles: string[], opts: {react?: boolean, cloudflare?: true}) => string[] } */
function findExamples(testFiles, { react, cloudflare }) {
  return testFiles.filter((testFile) => {
    if (!testFile.startsWith('examples/')) {
      return false
    }

    if (testFile.includes('cloudflare')) {
      return cloudflare === true
    }

    if (isReactExample(testFile)) {
      return react === true
    } else {
      return react === false
    }
  })
}

/** @type { (testFile: string) => boolean } */
function isReactExample(testFile) {
  const pkgJsonFile = path.join(root, path.dirname(testFile), './package.json')
  // await import(pkgJsonFile, { assert: { type: 'json'}})
  const pkgJson = require(pkgJsonFile)
  return !!pkgJson.dependencies['react']
}

/** @type { (args: {isMatrixTest?: true }) => MatrixEntry[] } */
function getMatrix({ isMatrixTest } = {}) {
  let testFiles = getTestFiles()

  const focus = !isMatrixTest && getFocus()
  if (focus) {
    testFiles = focusFilter(testFiles, focus)
  }

  let jobs = getJobs(testFiles)
  if (focus) {
    jobs = jobs.filter((job) => job.testFiles && job.testFiles.length >= 1)
  }

  assertTestFileCoverage(testFiles, jobs)

  /** @type MatrixEntry[] */
  const matrix = []
  jobs.forEach(({ name, testFiles, setups, testCmd }) => {
    setups.forEach((setup) => {
      matrix.push({
        testCmd,
        name: name + getJobName(setup),
        TEST_FILES: (testFiles ?? []).join(' '),
        ...setup
      })
    })
  })

  return matrix
}

/** @type { (testFiles: string[], focus: string) => string[] } */
function focusFilter(testFiles, focus) {
  const focusDir = path.dirname(focus)
  testFiles = testFiles.filter((f) => f.startsWith(focusDir))
  return testFiles
}
function getFocus() {
  const focusFiles = projectFiles.filter((file) => file.endsWith('/focus'))
  if (focusFiles.length === 0) {
    return false
  }
  assert(focusFiles.length === 1, 'There cannot be only one `focus` file but found multiple: ' + focusFiles.join(' '))
  return focusFiles[0]
}

/** @type { (testFiles: string[], jobs: Job[]) => void } */
function assertTestFileCoverage(testFiles, jobs) {
  testFiles.forEach((testFile) => {
    const testFileJobs = jobs.filter((job) => job.testFiles?.includes(testFile))
    assert(testFileJobs.length > 0, `Test ${testFile} is missing in categories.`)
    assert(
      testFileJobs.length <= 1,
      `Test ${testFile} is multiple categories: ${testFileJobs.map((j) => '`' + j.name + '`').join(' ')}.`
    )
  })
}

function cli() {
  const matrix = getMatrix()
  if (args.includes('--debug')) {
    console.log(JSON.stringify(matrix, null, 2))
    console.log(matrix.length)
  } else {
    console.log(`{"include":${JSON.stringify(matrix)}}`)
  }
}

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
