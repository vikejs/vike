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
/** @typedef { { name: string, testFiles?: string[], setups: Setup[], testCmd: string } } TestJob */
/** @typedef {{os: string, node_version: string}} Setup */

function getTestFiles() {
  const testRE = /\.(test|spec)\./
  /** @type string[] */
  const testFiles = projectFiles.filter((file) => testRE.test(file))
  return testFiles
}

/** @type { (testFiles: string[]) => TestJob[] } */
function getTestJobs(testFiles) {
  /** @type { TestJob[] } */
  const testJobs = [
    // Unit tests
    {
      name: 'Unit Tests',
      testCmd: 'pnpm run test:units',
      testFiles: testFiles.filter((f) => f.includes('.spec.')),
      setups: [{ os: 'windows-latest', node_version: '14' }],
    },
    {
      name: 'TypeScript',
      testCmd: 'pnpm run test:types',
      setups: [{ os: 'ubuntu-latest', node_version: '18' }],
    },
    {
      name: 'Examples React',
      testCmd: 'pnpm run test:e2e',
      testFiles: findExamples(testFiles, { react: true }),
      setups: [
        {
          os: 'ubuntu-latest',
          node_version: '16',
        },
        {
          os: 'windows-latest',
          node_version: '14',
        },
      ],
    },
    {
      name: 'Examples Vue/Others',
      testFiles: findExamples(testFiles, { react: false }),
      setups: [
        {
          os: 'ubuntu-latest',
          node_version: '16',
        },
        {
          os: 'windows-latest',
          node_version: '14',
        },
      ],
      testCmd: 'pnpm run test:e2e',
    },
    {
      name: 'Boilerplates',
      testCmd: 'pnpm run test:e2e',
      testFiles: testFiles.filter((f) => f.startsWith('boilerplates/')),
      setups: [
        {
          os: 'macos-latest',
          node_version: '17',
        },
      ],
    },
    {
      name: 'Cloudflare + esbuild',
      testFiles: findExamples(testFiles, { cloudflare: 'esbuild' }),
      setups: [
        {
          os: 'ubuntu-latest',
          node_version: '16',
        },
      ],
      testCmd: 'pnpm run test:e2e',
    },
    {
      name: 'Cloudflare + webpack',
      testCmd: 'pnpm run test:e2e',
      testFiles: findExamples(testFiles, { cloudflare: 'webpack' }),
      setups: [
        {
          os: 'ubuntu-latest',
          node_version: '16',
        },
      ],
    },
    {
      name: 'https://vite-plugin-ssr.com',
      testCmd: 'pnpm run test:e2e',
      testFiles: testFiles.filter((f) => f.startsWith('docs/')),
      setups: [
        {
          os: 'ubuntu-latest',
          node_version: '17',
        },
      ],
    },
  ]
  return testJobs
}

/** @type { (testFiles: string[], opts: {react?: boolean, cloudflare?: 'webpack' | 'esbuild'}) => string[] } */
function findExamples(testFiles, { react, cloudflare }) {
  return testFiles.filter((testFile) => {
    if (!testFile.startsWith('examples/')) {
      return false
    }

    if (testFile.includes('cloudflare')) {
      if (!cloudflare) {
        return false
      }
      if (testFile.includes('webpack')) {
        return cloudflare === 'webpack'
      } else {
        return cloudflare === 'esbuild'
      }
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

  let testJobs = getTestJobs(testFiles)
  if (focus) {
    testJobs = testJobs.filter((job) => job.testFiles && job.testFiles.length >= 1)
  }

  assertJobs(testFiles, testJobs)

  /** @type MatrixEntry[] */
  const matrix = []
  testJobs.forEach(({ name, testFiles, setups, testCmd }) => {
    setups.forEach((setup) => {
      matrix.push({
        testCmd,
        name: name + getJobName(setup),
        TEST_FILES: (testFiles ?? []).join(' '),
        ...setup,
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

/** @type { (testFiles: string[], testJobs: TestJob[]) => void } */
function assertJobs(testFiles, testJobs) {
  testFiles.forEach((testFile) => {
    const jobs = testJobs.filter((job) => job.testFiles?.includes(testFile))
    assert(jobs.length > 0, `Test ${testFile} is missing in categories.`)
    assert(
      jobs.length <= 1,
      `Test ${testFile} is multiple categories: ${jobs.map((j) => '`' + j.name + '`').join(' ')}.`,
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
