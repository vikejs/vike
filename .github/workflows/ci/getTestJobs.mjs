import { cmd } from './utils.mjs'
import assert from 'assert'
import path from 'path'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const args = process.argv

const root = cmd('git rev-parse --show-toplevel')
const projectFiles = cmd(`git ls-files`, { cwd: root }).split(' ')
const testFiles = projectFiles.filter((file) => /\.(test|spec)\./.test(file))

export { getTestJobs }
if (args.includes('--ci')) logMatrix()

/** @typedef { { jobName: string, TEST_FILES: string, jobCmd: string } & Setup } MatrixEntry */
/** @typedef { { jobName: string, jobTestFiles?: string[], jobSetups: Setup[], jobCmd: string } } Job */
/** @typedef { { os: string, node_version: string } } Setup */

/** @type { () => Job[] } */
function getTestJobs() {
  /** @type { Job[] } */
  const jobs = [
    // Unit tests
    {
      jobName: 'Unit Tests',
      jobCmd: 'pnpm run test:units',
      jobTestFiles: testFiles.filter((f) => f.includes('.spec.')),
      jobSetups: [{ os: 'windows-latest', node_version: '14' }]
    },
    {
      jobName: 'TypeScript',
      jobCmd: 'pnpm run test:types',
      jobSetups: [{ os: 'ubuntu-latest', node_version: '18' }]
    },
    {
      jobName: 'Examples React',
      jobCmd: 'pnpm run test:e2e',
      jobTestFiles: findExamples(testFiles, { react: true }),
      jobSetups: [
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
      jobName: 'Examples Vue/Others',
      jobTestFiles: findExamples(testFiles, { react: false }),
      jobSetups: [
        {
          os: 'ubuntu-latest',
          node_version: '16'
        },
        {
          os: 'windows-latest',
          node_version: '14'
        }
      ],
      jobCmd: 'pnpm run test:e2e'
    },
    {
      jobName: 'Boilerplates',
      jobCmd: 'pnpm run test:e2e',
      jobTestFiles: testFiles.filter((f) => f.startsWith('boilerplates/')),
      jobSetups: [
        {
          os: 'macos-latest',
          node_version: '17'
        }
      ]
    },
    {
      jobName: 'Cloudflare',
      jobTestFiles: findExamples(testFiles, { cloudflare: true }),
      jobSetups: [
        {
          os: 'ubuntu-latest',
          node_version: '16'
        }
      ],
      jobCmd: 'pnpm run test:e2e'
    },
    {
      jobName: 'https://vite-plugin-ssr.com',
      jobCmd: 'pnpm run test:e2e',
      jobTestFiles: testFiles.filter((f) => f.startsWith('docs/')),
      jobSetups: [
        {
          os: 'ubuntu-latest',
          node_version: '17'
        }
      ]
    }
  ]

  assertTestFilesCoverage(testFiles, jobs)

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
  const jobs = getTestJobs()

  /** @type MatrixEntry[] */
  const matrix = []
  jobs.forEach(({ jobName, jobTestFiles, jobSetups, jobCmd }) => {
    jobSetups.forEach((setup) => {
      matrix.push({
        jobCmd,
        jobName: jobName + getSetupName(setup),
        TEST_FILES: (jobTestFiles ?? []).join(' '),
        ...setup
      })
    })
  })

  return matrix
}

/** @type { (testFiles: string[], jobs: Job[]) => void } */
function assertTestFilesCoverage(testFiles, jobs) {
  testFiles.forEach((testFile) => {
    const testFileJobs = jobs.filter((job) => job.jobTestFiles?.includes(testFile))
    assert(testFileJobs.length > 0, `Test ${testFile} is missing in categories.`)
    assert(
      testFileJobs.length <= 1,
      `Test ${testFile} is multiple categories: ${testFileJobs.map((j) => '`' + j.jobName + '`').join(' ')}.`
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
  const setupName = ` - ${osName} - Node.js ${node_version}`
  return setupName
}
