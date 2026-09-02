export { logSkillHint }

import fs from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import type { ViteDevServer } from 'vite'
import pc from '@brillout/picocolors'
import { assert, assertInfo, assertUsage } from '../../../../utils/assert.js'
import { assertKeys } from '../../../../utils/assertKeys.js'
import { crawlFiles } from '../../../../utils/crawlFiles.js'
import { getGlobalObject } from '../../../../utils/getGlobalObject.js'
import { getVikeConfigError } from '../../../../shared-server-node/getVikeConfigError.js'
import { setTimeoutUnref } from '../../../../utils/setTimeoutUnref.js'
import { isObject } from '../../../../utils/isObject.js'
import { toPosixPath } from '../../../../utils/path.js'
import { unique } from '../../../../utils/unique.js'
import { getVikeConfigInternal, type VikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import { getCacheValue, setCacheValue } from '../../shared/cache.js'
import '../../assertEnvVite.js'
const execFileA = promisify(execFile)
const importMetaUrl = import.meta.url
const globalObject = getGlobalObject('logSkillHint.ts', {
  alreadyChecked: false,
})

const docsUrl = 'https://vike.dev/ai#skill'
const tellAgent = `by telling your agent "${pc.cyan(`Install skill ${docsUrl}`)}"`
const suppressHint = `set ${pc.cyan('+ai.skill')} to ${pc.cyan('false')} to suppress this log`
const logMissing = `Add Vike's skill for AI agents (Claude Code, Codex, Cursor, ...) ${tellAgent}, or ${suppressHint}`
const logDiffers = (skillFilePaths: string[]) => {
  const isPlural = skillFilePaths.length > 1
  const files = skillFilePaths.map((f) => pc.cyan(f)).join(', ')
  return `Your Vike skill${isPlural ? 's' : ''} ${files} ${isPlural ? "don't" : "doesn't"} match the official ${pc.cyan('vike/SKILL.md')}, update ${isPlural ? 'them' : 'it'} ${tellAgent}, or, if you maintain your own version, ${suppressHint}`
}
const skillName = 'vike'
// The skill file shipped by the vike npm package: node_modules/vike/skills/vike/SKILL.md (see packages/vike/scripts/copySkill.mjs)
const skillFilePathInsidePackage = 'skills/vike/SKILL.md'
// Cache entry at node_modules/.vike/cache.json, see cache.ts
// - `false` => the check didn't log anything last time => skip the check (forever, until node_modules/ is removed)
// - Nothing is written as long as the hint is logged => the check is re-run upon every dev start
const cacheKey = 'logSkillHint'

// Log a hint if the user didn't install Vike's skill for AI agents (vike/SKILL.md), or if it differs from the official one — https://vike.dev/ai#skill
// - Vike never modifies the user's repository (https://github.com/vikejs/vike/issues/3493): installing the skill is up to the user (or their AI agent).
function logSkillHint(server: ViteDevServer, userRootDir: string): void {
  applyLate(server, () => checkSkill(userRootDir))
}

// Apply late — 5 seconds after the first request, or at most 10 seconds after the dev server started — so that it never slows down dev start nor the first page requests.
function applyLate(server: ViteDevServer, callback: () => void): void {
  let isDone = false
  const runAfter = (milliseconds: number) => {
    setTimeoutUnref(() => {
      if (isDone) return
      isDone = true
      callback()
    }, milliseconds)
  }
  if (server.httpServer) {
    server.httpServer.once('listening', () => runAfter(10 * 1000))
  } else {
    // Middleware mode: the HTTP server is owned by the user
    runAfter(10 * 1000)
  }
  let isFirstRequest = true
  server.middlewares.use((_req, _res, next) => {
    if (isFirstRequest) {
      isFirstRequest = false
      runAfter(5 * 1000)
    }
    next()
  })
}

async function checkSkill(userRootDir: string): Promise<void> {
  try {
    await checkSkillUnsafe(userRootDir)
  } catch (err) {
    // The check runs in a timer (see applyLate()): a thrown error would be an unhandled rejection that kills the dev server => log it instead.
    // - Environmental failures (Git missing, unreadable files, ...) are handled gracefully and don't throw.
    // - What can throw: usage errors (e.g. an invalid +ai.skill value) and bugs.
    console.error(err)
  }
}

async function checkSkillUnsafe(userRootDir: string): Promise<void> {
  if (globalObject.alreadyChecked) return
  // Skip CI environments: the hint is meant for the machine of an app developer.
  if (process.env.CI) return

  const vikeConfig = await getVikeConfigInternal()
  // Maybe the user disabled the check in a config file that currently has an error => retry later (Vite restarts upon config changes).
  if (getVikeConfigError()) return
  if (!getConfigValueAiSkill(vikeConfig)) return
  globalObject.alreadyChecked = true

  // The check is skipped forever once it didn't log anything (until node_modules/ is removed) — see cacheKey
  if ((await getCacheValue(userRootDir, cacheKey)) === false) return

  const rootDir = await getRootDir(userRootDir)
  const skillsDirs = await findSkillsDirs(rootDir)

  // Skip apps that don't seem to use AI agents.
  const isUsingAiAgents = skillsDirs.length > 0 || (await hasAgentFile(userRootDir, rootDir))
  if (!isUsingAiAgents) {
    await setCacheValue(userRootDir, cacheKey, false)
    return
  }

  const skillContentExpected = await getSkillContentExpected()
  // Skip if Vike isn't installed from npm (e.g. when running an example of the Vike monorepo).
  if (skillContentExpected === null) return

  const skillFiles = await findSkillFiles(rootDir, skillsDirs, skillContentExpected)
  const skillFilesOutdated = skillFiles.filter((f) => f.isOutdated)
  if (skillFiles.length === 0) {
    assertInfo(false, logMissing, { onlyOnce: true })
  } else if (skillFilesOutdated.length > 0) {
    const skillFilePaths = skillFilesOutdated.map((f) => toPosixPath(path.relative(userRootDir, f.filePathAbsolute)))
    assertInfo(false, logDiffers(skillFilePaths), { onlyOnce: true })
  } else {
    await setCacheValue(userRootDir, cacheKey, false)
  }
}

// https://vike.dev/ai#settings
function getConfigValueAiSkill(vikeConfig: VikeConfigInternal): boolean {
  const configAi = vikeConfig.config.ai
  if (configAi === undefined) return true
  assertUsage(isObject(configAi), `Setting ${pc.cyan('ai')} should be an object`)
  assertKeys(configAi, ['skill'] as const, `Setting ${pc.cyan('ai')}:`)
  const skill: unknown = configAi.skill
  if (skill === undefined) return true
  assertUsage(
    typeof skill === 'boolean',
    `${pc.cyan('+ai.skill')} should be a boolean, see ${pc.underline('https://vike.dev/ai#skill')}`,
  )
  return skill
}

// The root directory of the user's Git repository — skills directories usually live at the repository root (e.g. monorepos).
async function getRootDir(userRootDir: string): Promise<string> {
  try {
    const { stdout } = await execFileA('git', ['rev-parse', '--show-toplevel'], { cwd: userRootDir })
    const gitRootDir = stdout.toString().trim()
    if (gitRootDir) return gitRootDir
  } catch {
    // Git isn't installed, or the app isn't inside a Git repository
  }
  return userRootDir
}

// Discover the skills directories of the user's repository, following the Agent Skills convention `**/skills/*/SKILL.md` (https://agentskills.io) — e.g. .claude/skills/ (Claude Code) and .agents/skills/ (Codex, Gemini CLI, Cursor, ...).
async function findSkillsDirs(rootDir: string): Promise<string[]> {
  const files = await crawlFiles({
    filePattern: '**/skills/*/SKILL',
    fileExtension: ['md'],
    cwd: rootDir,
    // Skills directories usually live inside dot directories (e.g. .claude/ and .agents/)
    dot: true,
    // Skills installed by skills-npm are gitignored symlinks (`**/skills/npm-*`) => `$ git ls-files` doesn't see them => fallback to globbing (which follows symlinks)
    globFallback: true,
  })
  const skillsDirs = unique(files.map((filePath) => path.posix.dirname(path.posix.dirname(filePath)))).sort()
  return skillsDirs
}

// Whether the app seems to use AI agents, even without any skills directory.
async function hasAgentFile(userRootDir: string, rootDir: string): Promise<boolean> {
  for (const dir of unique([userRootDir, rootDir])) {
    for (const fileName of ['AGENTS.md', 'CLAUDE.md']) {
      if (await isReadable(path.join(dir, fileName))) return true
    }
  }
  return false
}

// Find the installed copies of Vike's skill: `vike/SKILL.md` (manual and skills.sh installs) as well as `npm-vike-vike/SKILL.md` (skills-npm installs).
async function findSkillFiles(
  rootDir: string,
  skillsDirs: string[],
  skillContentExpected: string,
): Promise<{ filePathAbsolute: string; isOutdated: boolean }[]> {
  const skillFiles: { filePathAbsolute: string; isOutdated: boolean }[] = []
  for (const skillsDir of skillsDirs) {
    const skillsDirAbsolute = path.join(rootDir, ...skillsDir.split('/'))
    const entries = await fs.readdir(skillsDirAbsolute).catch(() => [])
    for (const entry of entries) {
      if (!entry.toLowerCase().includes(skillName)) continue
      const filePathAbsolute = path.join(skillsDirAbsolute, entry, 'SKILL.md')
      // fs.readFile() follows symlinks — a dangling symlink (e.g. after removing node_modules/) is treated as missing
      const content = await fs.readFile(filePathAbsolute, 'utf8').catch(() => null)
      if (content === null) continue
      // Skip other skills, e.g. `vike-react/SKILL.md`
      if (getSkillName(content) !== skillName) continue
      const isOutdated = normalizeContent(content) !== normalizeContent(skillContentExpected)
      skillFiles.push({ filePathAbsolute, isOutdated })
    }
  }
  return skillFiles
}

// The `name` field of the YAML frontmatter
function getSkillName(skillFileContent: string): string | null {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(skillFileContent)?.[1]
  if (!frontmatter) return null
  const name = /^name:[ \t]*["']?([^"'\s]+)["']?[ \t]*$/m.exec(frontmatter)?.[1]
  return name ?? null
}

// Ignore line endings (e.g. Git's autocrlf on Windows) and trailing whitespace
function normalizeContent(content: string): string {
  return content
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .join('\n')
    .trim()
}

async function getSkillContentExpected(): Promise<string | null> {
  // [RELATIVE_PATH_FROM_DIST] Current file: node_modules/vike/dist/node/vite/plugins/pluginDev/logSkillHint.js
  assert(importMetaUrl.includes('/dist/node/vite/plugins/pluginDev/'))
  const filePath = fileURLToPath(new URL(`../../../../../${skillFilePathInsidePackage}`, importMetaUrl))
  let fileContent: string
  try {
    fileContent = await fs.readFile(filePath, 'utf8')
  } catch {
    // The file is added upon publishing (`$ pnpm publish` => `prepack` script) => it's missing when Vike is linked (e.g. when running an example of the Vike monorepo)
    return null
  }
  return fileContent
}

async function isReadable(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}
