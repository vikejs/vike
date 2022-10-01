import { cmd } from './utils.mjs'
import assert from 'assert'
import path from 'path'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const args = process.argv

const root = cmd('git rev-parse --show-toplevel')
const projectFiles = cmd(`git ls-files`, { cwd: root }).split(' ')
const testFiles = projectFiles.filter((file) => /\.(test|spec)\./.test(file))

export { getMatrix }
if (args.includes('--ci')) logMatrix()

/** @typedef { { testName: string, TEST_FILES: string, testCmd: string } & Setup } MatrixEntry */
/** @typedef { { testName: string, testFiles?: string[], setups: Setup[], testCmd: string } } Job */
/** @typedef { { os: string, node_version: string } } Setup */

/** @type { () => Job[] } */
function getJobs() {
  /** @type { Job[] } */
  const jobs = [
    // Unit tests
    {
      testName: 'Unit Tests',
      testCmd: 'pnpm run test:units',
      testFiles: testFiles.filter((f) => f.includes('.spec.')),
      setups: [{ os: 'windows-latest', node_version: '14' }]
    },
    {
      testName: 'TypeScript',
      testCmd: 'pnpm run test:types',
      setups: [{ os: 'ubuntu-latest', node_version: '18' }]
    },
    {
      testName: 'Examples React',
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
      testName: 'Examples Vue/Others',
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
      testName: 'Boilerplates',
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
      testName: 'Cloudflare',
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
      testName: 'https://vite-plugin-ssr.com',
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

function getMatrix() {
  const jobs = getJobs()

  assertTestFilesCoverage(testFiles, jobs)

  /** @type MatrixEntry[] */
  const matrix = []
  jobs.forEach(({ testName, testFiles, setups, testCmd }) => {
    setups.forEach((setup) => {
      matrix.push({
        testCmd,
        testName: testName + getJobName(setup),
        TEST_FILES: (testFiles ?? []).join(' '),
        ...setup
      })
    })
  })

  return matrix
}

/** @type { (testFiles: string[], jobs: Job[]) => void } */
function assertTestFilesCoverage(testFiles, jobs) {
  testFiles.forEach((testFile) => {
    const testFileJobs = jobs.filter((job) => job.testFiles?.includes(testFile))
    assert(testFileJobs.length > 0, `Test ${testFile} is missing in categories.`)
    assert(
      testFileJobs.length <= 1,
      `Test ${testFile} is multiple categories: ${testFileJobs.map((j) => '`' + j.testName + '`').join(' ')}.`
    )
  })
}

function logMatrix() {
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
