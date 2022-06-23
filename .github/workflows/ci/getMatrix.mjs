import { cmd } from './utils.mjs'
import assert from 'assert'
import path from 'path'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const args = process.argv

const root = cmd('git rev-parse --show-toplevel')
const projectFiles = cmd(`git ls-files`, { cwd: root }).split(' ')
const testRE = /\.(test|spec)\./
/** @type string[] */
const testFiles = projectFiles.filter((file) => testRE.test(file))

export { getMatrix }
if (args.includes('--ci')) cli()

/** @typedef { ({ name: string, TEST_FILES: string, testCmd: string } & Setup) } MatrixEntry */
/** @typedef { { name: string, testFiles?: string[], setups: Setup[], testCmd: string } } TestJob */
/** @typedef {{os: string, node_version: string}} Setup */

function getTestJobs() {
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
      testFiles: findExamples({ react: true }),
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
      testFiles: findExamples({ react: false }),
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
      testFiles: findExamples({ cloudflare: 'esbuild' }),
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
      testFiles: findExamples({ cloudflare: 'webpack' }),
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

/** @type { (args: {react?: boolean, cloudflare?: 'webpack' | 'esbuild'}) => string[] } */
function findExamples({ react, cloudflare }) {
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

/** @type { () => MatrixEntry[] } */
function getMatrix() {
  const testJobs = getTestJobs()

  assertCategories(testJobs)

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

/** @type { (matrix: TestJob[]) => void } */
function assertCategories(testJobs) {
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
