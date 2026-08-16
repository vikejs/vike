export { autoAddAiSkill }
// For testing
export { addAiSkill }
export { skillFileContent }
export { skillFilePathRelative }

import fs from 'node:fs/promises'
import path from 'node:path'
import pc from '@brillout/picocolors'
import { assertInfo, assertUsage } from '../../../../utils/assert.js'
import { assertKeys } from '../../../../utils/assertKeys.js'
import { createDebug } from '../../../../utils/debug.js'
import { getGlobalObject } from '../../../../utils/getGlobalObject.js'
import { isGitNotUsable, runGitCommand } from '../../../../utils/git.js'
import { getVikeConfigError } from '../../../../shared-server-node/getVikeConfigError.js'
import { hasProp } from '../../../../utils/hasProp.js'
import { isObject } from '../../../../utils/isObject.js'
import { getVikeConfigInternal, type VikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import { logErrorServerDev } from '../../shared/loggerDev.js'
import '../../assertEnvVite.js'
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
// Called late (after the dev server started) — the feature never slows down dev start.
function autoAddAiSkill(userRootDir: string): void {
  // Fire-and-forget: never let this feature break the dev server.
  autoAddAiSkillAsync(userRootDir).catch((err) => {
    debug('error', err)
  })
}

async function autoAddAiSkillAsync(userRootDir: string): Promise<void> {
  if (globalObject.alreadyDone) return
  // Skip CI environments: the skill file is meant to be added from the machine of an app developer.
  if (process.env.CI) return
  // Skip if Vike isn't inside node_modules/ (e.g. when Vike is linked, such as when running an example of the Vike monorepo).
  if (!importMetaUrl.includes('node_modules/')) return

  // The dev server is already up and running => the Vike config is already resolved => the await resolves instantly.
  const vikeConfig = await getVikeConfigInternal()
  // Maybe the user disabled the feature in a config file that currently has an error => retry later (Vite restarts upon config changes).
  if (getVikeConfigError()) return
  let enabled: boolean
  try {
    enabled = isEnabled(vikeConfig)
  } catch (err) {
    // Invalid +ai config value: show the usage error without crashing the already-running dev server.
    logErrorServerDev(err, null)
    return
  }
  if (!enabled) return
  globalObject.alreadyDone = true

  const res = await addAiSkill(userRootDir)
  if (!res) return
  assertInfo(
    false,
    `${res.isUpdate ? 'Updated' : 'Created'}${res.isCommitted ? ' and Git-committed' : ''} ${pc.cyan(
      skillFilePathRelative,
    )} (see https://vike.dev/ai#skill)`,
    { onlyOnce: false },
  )
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
  // Skip if Git isn't installed, or if the app isn't inside a Git repository
  if (await isGitNotUsable(userRootDir)) return null

  const resGitRootDir = await runGitCommand(['rev-parse', '--show-toplevel'], userRootDir)
  if ('err' in resGitRootDir) return null
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
  // Don't Git-commit if the user chose to .gitignore the skill file — `$ git check-ignore` succeeds if the file is ignored
  const resCheckIgnore = await runGitCommand(['check-ignore', '-q', '--', skillFilePathRelative], gitRootDir)
  if (!('err' in resCheckIgnore)) return false

  const resAdd = await runGitCommand(['add', '--', skillFilePathRelative], gitRootDir)
  if ('err' in resAdd) return false

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
  return !('err' in resCommit)
}
