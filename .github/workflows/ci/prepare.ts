import assert from 'node:assert'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

const args = process.argv
const root = cmd('git rev-parse --show-toplevel')
const globalConfigFileName = 'test-e2e.config.mjs'
const jobConfigFileName = '.test-e2e.json'
const projectFiles = getProjectFiles()
let DEBUG = false

// [ENTRY] CI
if (args.includes('--ci')) logMatrix()
// [ENTRY] Vitest
export { prepare }
// [ENTRY] Local inspection
if (args.includes('--debug')) {
  DEBUG = true
  logMatrix()
}

type MatrixEntry = { jobName: string; TEST_FILES: string; jobCmd: string; TEST_INSPECT: string } & Setup
type Job = { jobName: string; jobTestFiles?: string[]; jobSetups: Setup[]; jobCmd: string }
type Setup = { os: string; node_version: string }

function getProjectFiles(): string[] {
  const projectFiles1 = cmd(`git ls-files`, { cwd: root }).split(' ')
  // Also include untracked files.
  //  - In other words, we remove git ignored files. (Staged files are tracked and listed by `$ git ls-files`.)
  //  - `git ls-files --others --exclude-standard` from https://stackoverflow.com/questions/3801321/git-list-only-untracked-files-also-custom-commands/3801554#3801554
  const projectFiles2 = cmd(`git ls-files --others --exclude-standard`, { cwd: root }).split(' ')
  return [...projectFiles1, ...projectFiles2]
}

async function prepare(): Promise<Job[]> {
  const specFiles = projectFiles.filter((file) => file.includes('.spec.'))
  const testFiles = projectFiles.filter((file) => file.includes('.test.'))

  const linux_nodeOld = {
    os: 'ubuntu-latest',
    node_version: '18',
  }
  const windows_nodeOld = {
    os: 'windows-latest',
    node_version: '18',
  }

  let jobs: Job[] = [
    {
      jobName: 'Vitest (unit tests)',
      jobCmd: 'pnpm exec vitest run --project unit',
      jobTestFiles: specFiles,
      jobSetups: [linux_nodeOld],
    },
    {
      jobName: 'Vitest (E2E tests)',
      jobCmd: 'pnpm exec vitest run --project e2e',
      jobTestFiles: specFiles,
      jobSetups: [linux_nodeOld, windows_nodeOld],
    },
    // Check TypeScript types
    {
      jobName: 'TypeScript',
      jobCmd: 'pnpm exec test-types',
      jobSetups: [linux_nodeOld],
    },
    // E2e tests
    ...(await crawlE2eJobs(testFiles)),
  ]

  assertTestFilesCoverage(testFiles, jobs)

  return jobs
}

async function crawlE2eJobs(testFiles: string[]): Promise<Job[]> {
  const jobs: Job[] = []

  const globalConfigFile = getGlobalConfigFile(projectFiles)
  const jobConfigFiles = getJobConfigFiles(projectFiles)
  if (globalConfigFile && jobConfigFiles.length === 0) throw new Error('No file `.test-e2e.json` found')

  if (jobConfigFiles.length >= 1) {
    if (!globalConfigFile) throw new Error(`Config file \`${globalConfigFileName}\` not found`)
    const { default: config }: { default: unknown } = await import(globalConfigFile)
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

      const jobSetups: { os: string; node_version: string }[] = []
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
          node_version,
        })
      })

      jobs.push({
        jobName,
        jobTestFiles: [],
        jobSetups,
        jobCmd: 'pnpm exec test-e2e',
      })
    })
  }

  jobConfigFiles.forEach((jobConfigFile) => {
    assert(globalConfigFile)

    const jobConfig: Record<string, unknown> = require(path.join(root, jobConfigFile))

    const jobName = (jobConfig as any).ci.job
    assert(jobName)
    assert(typeof jobName === 'string')

    const dir =
      path.dirname(jobConfigFile) +
      // `$ git ls-files` returns posix paths
      path.posix.sep
    const jobTestFiles = testFiles.filter((f) => f.startsWith(dir))
    assert(
      jobTestFiles.length > 0,
      `No test files found in \`${dir}\` (for \`${jobConfigFile}\`). Test files: \n${JSON.stringify(testFiles, null, 2)}`,
    )

    const job = jobs.find((job) => job.jobName == jobName)
    if (job === undefined) {
      throw new Error(`Make sure ${jobName} is defined in ${globalConfigFile}`)
    }
    assert(job.jobTestFiles)
    job.jobTestFiles.push(...jobTestFiles)
  })

  {
    let job: Job | null = null
    testFiles.forEach((testFile) => {
      const isMissing = !jobs.some((job) => {
        assert(job.jobTestFiles)
        return job.jobTestFiles.includes(testFile)
      })
      if (isMissing) {
        if (!job) {
          job = {
            jobName: 'E2E Tests',
            jobCmd: 'pnpm exec test-e2e',
            jobTestFiles: [],
            jobSetups: [{ os: 'ubuntu-latest', node_version: '20' }],
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

type GlobalConfigFilePath = `${string}${typeof globalConfigFileName}`
function getGlobalConfigFile(projectFiles: string[]) {
  const matches = projectFiles.filter((file) => file.endsWith(globalConfigFileName)) as GlobalConfigFilePath[]
  if (matches.length > 1) throw new Error(`Only one file \`${globalConfigFileName}\` is allowed`)
  if (matches.length === 0) return null
  const globalConfigFile = path.join(root, matches[0]) as GlobalConfigFilePath
  return globalConfigFile
}

type JobConfigFilePath = `${string}${typeof jobConfigFileName}`
function getJobConfigFiles(projectFiles: string[]) {
  const jobConfigFiles = projectFiles.filter((file) => file.endsWith(jobConfigFileName)) as JobConfigFilePath[]
  return jobConfigFiles
}

async function getMatrix(): Promise<MatrixEntry[]> {
  let jobs = await prepare()

  const inspectFile = getInspectFile()
  let TEST_INSPECT = ''
  if (inspectFile) {
    const inspectDir = path.dirname(inspectFile)
    TEST_INSPECT = inspectDir
    jobs = jobs.filter((job) => job.jobTestFiles?.some((testFile) => testFile.startsWith(inspectDir)))
  }

  const matrix: MatrixEntry[] = []
  jobs.forEach(({ jobName, jobTestFiles, jobSetups, jobCmd }) => {
    jobSetups.forEach((setup) => {
      matrix.push({
        jobCmd,
        jobName: jobName + getSetupName(setup),
        TEST_FILES: (jobTestFiles ?? []).join(' '),
        TEST_INSPECT,
        ...setup,
      })
    })
  })

  return matrix
}

function assertTestFilesCoverage(testFiles: string[], jobs: Job[]): void {
  testFiles.forEach((testFile) => {
    const jobsFound = jobs.filter((job) => job.jobTestFiles?.includes(testFile))
    assert(
      jobsFound.length > 0,
      `Test file ${testFile} isn't included in any job. Jobs: \n${JSON.stringify(jobs, null, 2)}`,
    )
    assert(
      jobsFound.length <= 1,
      `Test ${testFile} is multiple categories: ${jobsFound.map((j) => '`' + j.jobName + '`').join(' ')}.`,
    )
  })
}

async function logMatrix(): Promise<void> {
  const matrix = await getMatrix()
  if (DEBUG) {
    console.log(JSON.stringify(matrix, null, 2))
    console.log()
    console.log('Number of jobs: ' + matrix.length)
  } else {
    console.log(`{"include":${JSON.stringify(matrix)}}`)
  }
}

function getSetupName(setup: Setup): string {
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

// To debug `getInspectFile()` run `$ bun ./prepare.ts --debug`
function getInspectFile(): string | null {
  // File was previously named FOCUS
  const inspectFiles = projectFiles.filter((file) => file.endsWith('/INSPECT'))
  if (inspectFiles.length === 0) {
    return null
  }
  assert(
    inspectFiles.length === 1,
    'There cannot be only one INSPECT file but found multiple: ' + inspectFiles.join(' '),
  )
  return inspectFiles[0]
}

function cmd(command: string, { cwd }: { cwd?: string } = { cwd: undefined }): string {
  let stdout = execSync(command, { encoding: 'utf8', cwd })
  stdout = stdout.split(/\s/).filter(Boolean).join(' ')
  return stdout
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
