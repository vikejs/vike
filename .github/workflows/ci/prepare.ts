import assert from 'node:assert'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { createRequire } from 'node:module'
import type { TolerateError } from '@brillout/test-e2e'
const require = createRequire(import.meta.url)

const args = process.argv
const root = cmd('git rev-parse --show-toplevel')
const globalConfigFileName = 'test-e2e.config.mjs'
const localConfigFileName = '.test-e2e.json'
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
type Job = { jobName: string; jobTests: { testFilePath: string }[] | null; jobSetups: Setup[]; jobCmd: string }
type Setup = { os: string; node_version: string }
type LocalConfig = { ci: { job: string } }
type GlobalConfig = { ci?: { jobs: { name: string; setups: Setup[] }[] }; tolerateError?: TolerateError }

function getProjectFiles(): string[] {
  const projectFiles1 = cmd('git ls-files', { cwd: root }).split(' ')
  // Also include untracked files.
  //  - In other words, we remove git ignored files. (Staged files are tracked and listed by `$ git ls-files`.)
  //  - `git ls-files --others --exclude-standard` from https://stackoverflow.com/questions/3801321/git-list-only-untracked-files-also-custom-commands/3801554#3801554
  const projectFiles2 = cmd('git ls-files --others --exclude-standard', { cwd: root }).split(' ')
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
      jobTests: specFiles.map((file) => ({ testFilePath: file })),
      jobSetups: [linux_nodeOld],
    },
    {
      jobName: 'Vitest (E2E tests)',
      jobCmd: 'pnpm exec vitest run --project e2e',
      jobTests: specFiles.map((file) => ({ testFilePath: file })),
      jobSetups: [linux_nodeOld, windows_nodeOld],
    },
    // Check TypeScript types
    {
      jobName: 'TypeScript',
      jobCmd: 'pnpm exec test-types',
      jobSetups: [linux_nodeOld],
      jobTests: null,
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
  const localConfigFiles = getLocalConfigFiles(projectFiles)
  if (globalConfigFile && localConfigFiles.length === 0) throw new Error('No file `.test-e2e.json` found')

  if (localConfigFiles.length >= 1) {
    if (!globalConfigFile) throw new Error(`Config file \`${globalConfigFileName}\` not found`)
    const { default: config } = (await import(globalConfigFile)) as { default: GlobalConfig }
    const { ci } = config
    assert(ci)
    const jobSpecs = ci.jobs
    jobSpecs.forEach((jobSpec) => {
      const jobName = jobSpec.name
      assert(typeof jobName === 'string')

      const jobSetups = jobSpec.setups.map((setup) => {
        const { os, node_version } = setup
        assert(typeof os === 'string')
        assert(typeof node_version === 'string')
        return {
          os,
          node_version,
        }
      })

      jobs.push({
        jobName,
        jobTests: [],
        jobSetups,
        jobCmd: 'pnpm exec test-e2e',
      })
    })
  }

  localConfigFiles.forEach((localConfigFile) => {
    const localConfig: LocalConfig = require(path.join(root, localConfigFile))

    const jobName = localConfig.ci.job
    assert(jobName)
    assert(typeof jobName === 'string')

    const dir =
      path.dirname(localConfigFile) +
      // `$ git ls-files` returns posix paths
      path.posix.sep
    const jobTests = testFiles.filter((f) => f.startsWith(dir)).map((file) => ({ testFilePath: file }))
    assert(
      jobTests.length > 0,
      `No test files found in \`${dir}\` (for \`${localConfigFile}\`). Test files: \n${JSON.stringify(testFiles, null, 2)}`,
    )

    const job = jobs.find((job) => job.jobName == jobName)
    if (job === undefined) {
      assert(globalConfigFile)
      throw new Error(`Make sure ${jobName} is defined in ${globalConfigFile}`)
    }
    assert(job.jobTests)
    job.jobTests.push(...jobTests)
  })

  {
    let job: Job | null = null
    testFiles.forEach((testFile) => {
      const isMissing = !jobs.some((job) => {
        assert(job.jobTests)
        return job.jobTests.some((jobTest) => jobTest.testFilePath === testFile)
      })
      if (isMissing) {
        if (!job) {
          job = {
            jobName: 'E2E Tests',
            jobCmd: 'pnpm exec test-e2e',
            jobTests: [],
            jobSetups: [{ os: 'ubuntu-latest', node_version: '20' }],
          }
          jobs.push(job)
        }
        assert(job.jobTests)
        job.jobTests.push({ testFilePath: testFile })
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

type LocalConfigFilePath = `${string}${typeof localConfigFileName}`
function getLocalConfigFiles(projectFiles: string[]) {
  const localConfigFiles = projectFiles.filter((file) => file.endsWith(localConfigFileName)) as LocalConfigFilePath[]
  return localConfigFiles
}

async function getMatrix(): Promise<MatrixEntry[]> {
  let jobs = await prepare()

  const inspectFile = getInspectFile()
  let TEST_INSPECT = ''
  if (inspectFile) {
    const inspectDir = path.dirname(inspectFile)
    TEST_INSPECT = inspectDir
    jobs = jobs.filter((job) => job.jobTests?.some((testFile) => testFile.startsWith(inspectDir)))
  }

  const matrix: MatrixEntry[] = []
  jobs.forEach(({ jobName, jobTests, jobSetups, jobCmd }) => {
    jobSetups.forEach((setup) => {
      matrix.push({
        jobCmd,
        jobName: jobName + getSetupName(setup),
        TEST_FILES: (jobTests ?? []).join(' '),
        TEST_INSPECT,
        ...setup,
      })
    })
  })

  return matrix
}

function assertTestFilesCoverage(testFiles: string[], jobs: Job[]): void {
  testFiles.forEach((testFile) => {
    const jobsFound = jobs.filter((job) => job.jobTests?.some((jobTest) => jobTest.testFilePath === testFile))
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
