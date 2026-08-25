export { autoAddVikeSkill }

import fs from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import pc from '@brillout/picocolors'
import { assertInfo, assertUsage } from '../../../../utils/assert.js'
import { assertKeys } from '../../../../utils/assertKeys.js'
import { crawlFiles } from '../../../../utils/crawlFiles.js'
import { getGlobalObject } from '../../../../utils/getGlobalObject.js'
import { getVikeConfigError } from '../../../../shared-server-node/getVikeConfigError.js'
import { isArrayOfStrings } from '../../../../utils/isArrayOfStrings.js'
import { isFilePathAbsoluteFilesystem } from '../../../../utils/isFilePathAbsoluteFilesystem.js'
import { isObject } from '../../../../utils/isObject.js'
import { unique } from '../../../../utils/unique.js'
import { getVikeConfigInternal, type VikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import '../../assertEnvVite.js'
const execFileA = promisify(execFile)
const importMetaUrl = import.meta.url
const globalObject = getGlobalObject('autoAddVikeSkill.ts', {
  alreadyDone: false,
})

const skillPathInsideSkillsDir = 'vike/SKILL.md'
const skillFileContent = `---
name: "vike"
description: "Vike documentation index — a compact overview of Vike's docs. Consider consulting it, e.g. when using uncommon Vike APIs or when stuck on a Vike problem."
---

See https://vike.dev/llms.txt
`
const commitMessage = (isUpdate: boolean) =>
  `${isUpdate ? 'Update' : 'Add'} Vike skill — ${pc.underline('https://vike.dev/ai#skill')}`

// Automatically add vike/SKILL.md to skills/ directories (e.g. .claude/skills/ and .agents/skills/) of the user's Git repository (and Git-commit it) — so that AI agents (Claude Code, Codex, Cursor, Gemini CLI, ...) automatically pick it up.
// https://vike.dev/ai#skill
async function autoAddVikeSkill(userRootDir: string): Promise<void> {
  try {
    await autoAddVikeSkillUnsafe(userRootDir)
  } catch (err) {
    // Show the error without breaking the dev server. (Expected situations don't throw — e.g. Git missing is handled gracefully.)
    console.error(err)
  }
}

async function autoAddVikeSkillUnsafe(userRootDir: string): Promise<void> {
  if (globalObject.alreadyDone) return
  // Skip CI environments: the skill file is meant to be added from the machine of an app developer.
  if (process.env.CI) return
  // Skip if Vike isn't inside node_modules/ (e.g. when Vike is linked, such as when running an example of the Vike monorepo).
  if (!importMetaUrl.includes('node_modules/')) return

  const vikeConfig = await getVikeConfigInternal()
  // Maybe the user disabled the feature in a config file that currently has an error => retry later (Vite restarts upon config changes).
  if (getVikeConfigError()) return
  const configValue = getConfigValueAiSkill(vikeConfig)
  if (configValue === false) return
  globalObject.alreadyDone = true

  const res = await addAiSkill(userRootDir, {
    // true (default) => add the skill file to every existing skills directory (`**/skills/*/SKILL.md`)
    skillsDirs: configValue === true ? undefined : configValue,
  })
  if (!res) return
  assertInfo(
    false,
    `${res.isUpdate ? 'Updated' : 'Created'}${res.isCommitted ? ' and Git-committed' : ''} ${res.files
      .map((f) => pc.cyan(f.filePathRelative))
      .join(', ')} — ${pc.underline('https://vike.dev/ai#skill')}`,
    { onlyOnce: false },
  )
}

// https://vike.dev/ai#skill
function getConfigValueAiSkill(vikeConfig: VikeConfigInternal): boolean | string[] {
  const configAi = vikeConfig.config.ai
  if (configAi === undefined) return true
  assertUsage(isObject(configAi), `Setting ${pc.cyan('ai')} should be an object`)
  assertKeys(configAi, ['skill'] as const, `Setting ${pc.cyan('ai')}:`)
  const skill: unknown = configAi.skill
  if (skill === undefined || skill === true) return true
  if (skill === false) return false
  assertUsage(
    isArrayOfStrings(skill),
    `Setting ${pc.cyan('ai.skill')} should be a boolean or a list of skills directories (e.g. ${pc.cyan(
      "['.claude/skills', '.agents/skills']",
    )})`,
  )
  return skill.map((skillsDir) => {
    assertUsage(
      skillsDir !== '' && !isFilePathAbsoluteFilesystem(skillsDir),
      `Setting ${pc.cyan('ai.skill')} entries should be paths relative to the root directory of your app's Git repository (e.g. ${pc.cyan(
        "'.claude/skills'",
      )})`,
    )
    // Normalize: remove trailing slashes
    return skillsDir.replace(/\/+$/, '')
  })
}

async function addAiSkill(
  userRootDir: string,
  { skillsDirs }: { skillsDirs: undefined | string[] },
): Promise<null | {
  files: { filePathAbsolute: string; filePathRelative: string; isUpdate: boolean }[]
  isUpdate: boolean
  isCommitted: boolean
}> {
  // Skip if Git isn't installed
  if ('err' in (await runGitCommand(['--version'], userRootDir))) return null

  // Skip if the app isn't inside a Git repository
  const resGitRootDir = await runGitCommand(['rev-parse', '--show-toplevel'], userRootDir)
  if ('err' in resGitRootDir) return null
  const gitRootDir = resGitRootDir.stdout.trim()
  if (!gitRootDir) return null

  // By default, the skill file is only added to the skills directories that already exist — we don't want to add files to the repositories of users who don't use skills.
  skillsDirs ??= await discoverSkillsDirs(gitRootDir)
  if (skillsDirs.length === 0) return null

  const files: { filePathAbsolute: string; filePathRelative: string; isUpdate: boolean }[] = []
  for (const skillsDir of skillsDirs) {
    const filePathRelative = `${skillsDir}/${skillPathInsideSkillsDir}`
    const filePathAbsolute = path.join(gitRootDir, ...filePathRelative.split('/'))

    // Skip if the skill file is already up-to-date
    const contentCurrent = await fs.readFile(filePathAbsolute, 'utf8').catch(() => null)
    if (contentCurrent === skillFileContent) continue
    const isUpdate = contentCurrent !== null

    await fs.mkdir(path.dirname(filePathAbsolute), { recursive: true })
    await fs.writeFile(filePathAbsolute, skillFileContent, 'utf8')

    files.push({ filePathAbsolute, filePathRelative, isUpdate })
  }
  if (files.length === 0) return null

  const isCommitted = await gitCommit(gitRootDir, files)
  return { files, isUpdate: files.some((f) => f.isUpdate), isCommitted }
}

// Discover the skills directories of the user's Git repository, following the Agent Skills convention `**/skills/*/SKILL.md` (https://agentskills.io) — e.g. .claude/skills/ (Claude Code) and .agents/skills/ (Codex, Gemini CLI, Cursor, ...).
async function discoverSkillsDirs(gitRootDir: string): Promise<string[]> {
  const files = await crawlFiles({
    filePattern: '**/skills/*/SKILL',
    fileExtension: ['md'],
    cwd: gitRootDir,
    // Skills directories usually live inside dot directories (e.g. .claude/ and .agents/)
    dot: true,
    // Most apps don't contain any skills directory — when Git doesn't know about any skill file, we don't want to crawl the app's entire directory tree upon every dev start.
    globFallback: false,
  })
  const skillsDirs = unique(files.map((filePath) => path.posix.dirname(path.posix.dirname(filePath)))).sort()
  return skillsDirs
}

async function gitCommit(
  gitRootDir: string,
  files: { filePathRelative: string; isUpdate: boolean }[],
): Promise<boolean> {
  // Don't Git-commit the skill files that the user chose to .gitignore — `$ git check-ignore` succeeds if the file is ignored
  const filesToCommit: typeof files = []
  for (const file of files) {
    const resCheckIgnore = await runGitCommand(['check-ignore', '--quiet', '--', file.filePathRelative], gitRootDir)
    if ('err' in resCheckIgnore) filesToCommit.push(file)
  }
  if (filesToCommit.length === 0) return false

  const filePaths = filesToCommit.map((f) => f.filePathRelative)
  const resAdd = await runGitCommand(['add', '--', ...filePaths], gitRootDir)
  if ('err' in resAdd) return false

  const isUpdate = filesToCommit.some((f) => f.isUpdate)
  const resCommit = await runGitCommand(
    [
      '-c',
      'user.name=Vike',
      '-c',
      'user.email=no-reply@vike.dev',
      'commit',
      // Skip Git hooks (e.g. slow or failing pre-commit hooks)
      '--no-verify',
      '--message',
      commitMessage(isUpdate),
      // Only commit the skill files — never commit files staged by the user
      '--',
      ...filePaths,
    ],
    gitRootDir,
  )
  return !('err' in resCommit)
}

// Run a Git command — doesn't throw: it returns `{ err }` upon failure.
async function runGitCommand(args: string[], cwd: string): Promise<{ err: unknown } | { stdout: string }> {
  let stdout: string
  try {
    const res = await execFileA('git', args, { cwd })
    stdout = res.stdout.toString()
  } catch (err) {
    return { err }
  }
  return { stdout }
}
