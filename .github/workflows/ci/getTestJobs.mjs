import { cmd, isObject } from './utils.mjs'
import assert from 'assert'
import path from 'path'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const args = process.argv

const root = cmd('git rev-parse --show-toplevel')

export { getTestJobs }
if (args.includes('--ci')) logMatrix()

/** @typedef { { jobName: string, TEST_FILES: string, jobCmd: string } & Setup } MatrixEntry */
/** @typedef { { jobName: string, jobTestFiles?: string[], jobSetups: Setup[], jobCmd: string } } Job */
/** @typedef { { os: string, node_version: string } } Setup */

function getProjectFiles() {
  const projectFiles1 = cmd(`git ls-files`, { cwd: root }).split(' ')
  // Also include untracked files.
  //  - In other words, we remove git ignored files. (Staged files are tracked and listed by `$ git ls-files`.)
  //  - `git ls-files --others --exclude-standard` from https://stackoverflow.com/questions/3801321/git-list-only-untracked-files-also-custom-commands/3801554#3801554
  const projectFiles2 = cmd(`git ls-files --others --exclude-standard`, { cwd: root }).split(' ')
  return [...projectFiles1, ...projectFiles2]
}

/** @type { () => Job[] } */
function getTestJobs() {
  const projectFiles = getProjectFiles()
  const specFiles = projectFiles.filter((file) => file.includes('.spec.'))
  const testFiles = projectFiles.filter((file) => file.includes('.test.'))

  /** @type { Job[] } */
  const jobs = [
    // Unit tests
    {
      jobName: 'Unit Tests',
      jobCmd: 'pnpm run test:units',
      jobTestFiles: specFiles,
      jobSetups: [{ os: 'windows-latest', node_version: '14' }]
    },
    // Typecheck `.ts` files
    {
      jobName: 'TypeScript',
      jobCmd: 'pnpm run test:types',
      jobSetups: [{ os: 'ubuntu-latest', node_version: '18' }]
    },
    // E2e tests
    ...crawlE2eJobs(testFiles)
  ]

  assertTestFilesCoverage(testFiles, jobs)

  return jobs
}

/** @type { (testFiles: string[]) => Job[] } */
function crawlE2eJobs(testFiles) {
  const projectFiles = getProjectFiles()

  /** @type { Job[] } */
  const jobs = []

  const testJobFiles = getTestJobFiles(projectFiles)
  const configFile = getConfigFile(projectFiles)
  if (testJobFiles.length >= 1 && !configFile) throw new Error('File `test-e2e.config.json` missing')
  if (configFile && testJobFiles.length === 0) throw new Error('No file `.testJob.json` found')

  if (testJobFiles.length >= 1) {
    assert(configFile)
    if (!configFile) throw new Error('File `test-e2e.config.json` missing')
    /** @type { unknown } */
    const config = require(configFile)
    assert(isObject(config))
    const { ci } = config
    assert(isObject(ci))
    const jobSpecs = ci.jobs
    assert(Array.isArray(jobSpecs))
    jobSpecs.forEach((jobSpec) => {
      assert(isObject(jobSpec))
      const jobName = jobSpec.name
      assert(jobName)
      assert(typeof jobName === 'string')

      /** @type { { os: string, node_version: string }[] }  */
      const jobSetups = []
      const { setups } = jobSpec
      assert(Array.isArray(setups))
      setups.forEach((setup) => {
        const { os, node_version } = setup
        assert(os)
        assert(typeof os === 'string')
        assert(node_version)
        assert(typeof node_version === 'string')
        jobSetups.push({
          os,
          node_version
        })
      })

      jobs.push({
        jobName,
        jobTestFiles: [],
        jobSetups,
        jobCmd: 'pnpm run test:e2e'
      })
    })
  }

  testJobFiles.forEach((testJobFile) => {
    assert(configFile)

    /** @type { Record<string, unknown> } */
    const jobJson = require(path.join(root, testJobFile))

    const jobName = jobJson.name
    assert(jobName)
    assert(typeof jobName === 'string')

    const dir =
      path.dirname(testJobFile) +
      // `$ git ls-files` returns posix paths
      path.posix.sep
    const jobTestFiles = testFiles.filter((f) => f.startsWith(dir))
    assert(
      jobTestFiles.length > 0,
      `No test files found in \`${dir}\` (for \`${testJobFile}\`). Test files: \n${JSON.stringify(testFiles, null, 2)}`
    )

    const job = jobs.find((job) => job.jobName == jobName)
    if (job === undefined) {
      throw new Error(`Make sure ${jobName} is defined in ${configFile}`)
    }
    assert(job.jobTestFiles)
    job.jobTestFiles.push(...jobTestFiles)
  })

  {
    /** @type { null | Job } */
    let job = null
    testFiles.forEach((testFile) => {
      const isMissing = !jobs.some((job) => {
        assert(job.jobTestFiles)
        return job.jobTestFiles.includes(testFile)
      })
      if (isMissing) {
        if (!job) {
          job = {
            jobName: 'E2E Tests',
            jobCmd: 'pnpm run test:e2e',
            jobTestFiles: [],
            jobSetups: [{ os: 'ubuntu-latest', node_version: '18' }]
          }
          jobs.push(job)
        }
        assert(job.jobTestFiles)
        job.jobTestFiles.push(testFile)
      }
    })
  }

  return jobs
}

/** @type { (projectFiles: string[]) => string | null } */
function getConfigFile(projectFiles) {
  const matches = projectFiles.filter((file) => file.endsWith('test-e2e.config.json'))
  if (matches.length > 1) throw new Error('Only one file `test-e2e.config.json` is allowed')
  if (matches.length === 0) return null
  const configFile = path.join(root, matches[0])
  return configFile
}

/** @type { (projectFiles: string[]) => string[] } */
function getTestJobFiles(projectFiles) {
  const testJobFiles = projectFiles.filter((file) => file.endsWith('.testJob.json'))
  return testJobFiles
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
    const jobsFound = jobs.filter((job) => job.jobTestFiles?.includes(testFile))
    assert(
      jobsFound.length > 0,
      `Test file ${testFile} isn't included in any job. Jobs: \n${JSON.stringify(jobs, null, 2)}`
    )
    assert(
      jobsFound.length <= 1,
      `Test ${testFile} is multiple categories: ${jobsFound.map((j) => '`' + j.jobName + '`').join(' ')}.`
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
  let osName = undefined
  if (os === 'ubuntu-latest') {
    osName = 'Ubuntu'
  }
  if (os === 'macos-latest') {
    osName = 'Mac'
  }
  if (os === 'windows-latest') {
    osName = 'Win'
  }
  assert(osName, `Unknown Operating System ${os}`)
  assert(node_version)
  const setupName = ` - ${osName} - Node.js ${node_version}`
  return setupName
}
