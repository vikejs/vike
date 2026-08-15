export { autoAddAiSkill }
// For testing
export { addAiSkill }
export { skillFileContent }
export { skillFilePathRelative }

import fs from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import pc from '@brillout/picocolors'
import { assertInfo, assertUsage } from '../../../../utils/assert.js'
import { assertKeys } from '../../../../utils/assertKeys.js'
import { createDebug } from '../../../../utils/debug.js'
import { getGlobalObject } from '../../../../utils/getGlobalObject.js'
import { getVikeConfigError } from '../../../../shared-server-node/getVikeConfigError.js'
import { hasProp } from '../../../../utils/hasProp.js'
import { isObject } from '../../../../utils/isObject.js'
import type { VikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import '../../assertEnvVite.js'
const execFileA = promisify(execFile)
const debug = createDebug('vike:skill')
const importMetaUrl = import.meta.url

const globalObject = getGlobalObject('vite/plugins/pluginDev/autoAddAiSkill.ts', {
  alreadyDone: false,
})

const skillFilePathRelative = '.claude/skills/vike/SKILL.md'
const skillFileContent = `---
name: "vike"
description: "Vike documentation — consider reading it, e.g. when using uncommon Vike APIs or when stuck on a Vike problem"
---

See https://vike.dev/llms.txt
`

// Automatically add the Vike skill file to the user's Git repository (and Git-commit it) — so that AI agents (e.g. Claude Code) automatically pick it up.
// https://vike.dev/ai#skill
function autoAddAiSkill(userRootDir: string, vikeConfig: VikeConfigInternal): void {
  if (globalObject.alreadyDone) return
  // Maybe the user disabled the feature in a config file that currently has an error => retry later (Vite restarts upon config changes).
  if (getVikeConfigError()) return
  if (!isEnabled(vikeConfig)) return
  globalObject.alreadyDone = true

  // Skip CI environments: the skill file is meant to be added from the machine of an app developer.
  if (process.env.CI) return
  // Skip if Vike isn't inside node_modules/ (e.g. when Vike is linked, such as when running an example of the Vike monorepo).
  if (!importMetaUrl.includes('node_modules/')) return

  // Fire-and-forget: don't block the dev server startup, and never let this feature break the dev server.
  addAiSkill(userRootDir)
    .then((res) => {
      if (!res) return
      assertInfo(
        false,
        `${res.isUpdate ? 'Updated' : 'Created'}${res.isCommitted ? ' and Git-committed' : ''} ${pc.cyan(
          skillFilePathRelative,
        )} (see https://vike.dev/ai#skill)`,
        { onlyOnce: false },
      )
    })
    .catch((err) => {
      debug('error', err)
    })
}

// https://vike.dev/ai#skill
function isEnabled(vikeConfig: VikeConfigInternal): boolean {
  const configAi = vikeConfig.config.ai
  if (configAi === undefined) return true
  assertUsage(isObject(configAi), `Setting ${pc.cyan('ai')} should be an object`)
  assertKeys(configAi, ['skill'] as const, `Setting ${pc.cyan('ai')}:`)
  assertUsage(
    hasProp(configAi, 'skill', 'boolean') || hasProp(configAi, 'skill', 'undefined'),
    `Setting ${pc.cyan('ai.skill')} should be a boolean`,
  )
  return configAi.skill !== false
}

async function addAiSkill(
  userRootDir: string,
): Promise<null | { skillFilePath: string; isUpdate: boolean; isCommitted: boolean }> {
  // Skip if Git isn't installed
  if (!(await runGitCommand(['--version'], userRootDir))) return null

  // Skip if the app isn't inside a Git repository
  const resGitRootDir = await runGitCommand(['rev-parse', '--show-toplevel'], userRootDir)
  if (!resGitRootDir) return null
  const gitRootDir = resGitRootDir.stdout.trim()
  if (!gitRootDir) return null

  const skillFilePath = path.join(gitRootDir, ...skillFilePathRelative.split('/'))

  // Skip if the skill file is already up-to-date
  const contentCurrent = await fs.readFile(skillFilePath, 'utf8').catch(() => null)
  if (contentCurrent === skillFileContent) return null
  const isUpdate = contentCurrent !== null

  await fs.mkdir(path.dirname(skillFilePath), { recursive: true })
  await fs.writeFile(skillFilePath, skillFileContent, 'utf8')
  debug(`${isUpdate ? 'updated' : 'created'}:`, skillFilePath)

  const isCommitted = await gitCommit(gitRootDir, isUpdate)
  return { skillFilePath, isUpdate, isCommitted }
}

async function gitCommit(gitRootDir: string, isUpdate: boolean): Promise<boolean> {
  // Don't Git-commit if the user chose to .gitignore the skill file
  if (await runGitCommand(['check-ignore', '-q', '--', skillFilePathRelative], gitRootDir)) return false

  if (!(await runGitCommand(['add', '--', skillFilePathRelative], gitRootDir))) return false

  const commitMessage = `${isUpdate ? 'Update' : 'Add'} Vike skill (see https://vike.dev/ai#skill)`
  const resCommit = await runGitCommand(
    [
      'commit',
      // Skip Git hooks (e.g. slow or failing pre-commit hooks)
      '--no-verify',
      '-m',
      commitMessage,
      // Only commit the skill file — never commit files staged by the user
      '--',
      skillFilePathRelative,
    ],
    gitRootDir,
  )
  return !!resCommit
}

async function runGitCommand(args: string[], cwd: string): Promise<null | { stdout: string }> {
  let stdout: string
  try {
    const res = await execFileA('git', args, { cwd })
    stdout = res.stdout.toString()
  } catch (err) {
    debug(`$ git ${args.join(' ')} — failed:`, err)
    return null
  }
  return { stdout }
}
