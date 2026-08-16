import { describe, expect, it } from 'vitest'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { addAiSkill, skillFileContent, skillFilePathRelative, skillsDirPathRelative } from './autoAddAiSkill.js'
const execFileA = promisify(execFile)

describe('addAiSkill()', () => {
  it('creates and Git-commits the skill file', async ({ onTestFinished }) => {
    const repoDir = await createGitRepo(onTestFinished)

    const res = await addAiSkill(repoDir, { onlyIfSkillsDirectoryExists: false })
    expect(res).toBeTruthy()
    expect(res!.isUpdate).toBe(false)
    expect(res!.isCommitted).toBe(true)
    expect(await fs.readFile(res!.skillFilePath, 'utf8')).toBe(skillFileContent)
    expect(await runGit(['log', '-1', '--format=%s'], repoDir)).toBe('Add Vike skill (see https://vike.dev/ai#skill)')
    // Nothing left uncommitted
    expect(await runGit(['status', '--porcelain'], repoDir)).toBe('')
  })

  it('skips when the skill file is up-to-date', async ({ onTestFinished }) => {
    const repoDir = await createGitRepo(onTestFinished)

    expect(await addAiSkill(repoDir, { onlyIfSkillsDirectoryExists: false })).toBeTruthy()
    expect(await addAiSkill(repoDir, { onlyIfSkillsDirectoryExists: false })).toBe(null)
    expect(await runGit(['rev-list', '--count', 'HEAD'], repoDir)).toBe('1')
  })

  it("overwrites and Git-commits when the skill file doesn't match", async ({ onTestFinished }) => {
    const repoDir = await createGitRepo(onTestFinished)

    // Simulate an outdated skill file committed by an older Vike version
    const skillFilePath = path.join(repoDir, ...skillFilePathRelative.split('/'))
    await fs.mkdir(path.dirname(skillFilePath), { recursive: true })
    await fs.writeFile(skillFilePath, 'outdated content', 'utf8')
    await runGit(['add', '--', skillFilePathRelative], repoDir)
    await runGit(['commit', '-m', 'Add Vike skill (see https://vike.dev/ai#skill)'], repoDir)

    const res = await addAiSkill(repoDir, { onlyIfSkillsDirectoryExists: false })
    expect(res!.isUpdate).toBe(true)
    expect(res!.isCommitted).toBe(true)
    expect(await fs.readFile(res!.skillFilePath, 'utf8')).toBe(skillFileContent)
    expect(await runGit(['log', '-1', '--format=%s'], repoDir)).toBe(
      'Update Vike skill (see https://vike.dev/ai#skill)',
    )
    expect(await runGit(['rev-list', '--count', 'HEAD'], repoDir)).toBe('2')
  })

  it('restores local uncommitted modifications (nothing to Git-commit then)', async ({ onTestFinished }) => {
    const repoDir = await createGitRepo(onTestFinished)

    const res1 = await addAiSkill(repoDir, { onlyIfSkillsDirectoryExists: false })
    // The user (or their AI agent) modified the skill file without committing the modification
    await fs.writeFile(res1!.skillFilePath, 'modified content', 'utf8')

    const res2 = await addAiSkill(repoDir, { onlyIfSkillsDirectoryExists: false })
    expect(res2!.isUpdate).toBe(true)
    // The restored content is equal to the already committed content => there isn't anything to commit
    expect(res2!.isCommitted).toBe(false)
    expect(await fs.readFile(res2!.skillFilePath, 'utf8')).toBe(skillFileContent)
    expect(await runGit(['rev-list', '--count', 'HEAD'], repoDir)).toBe('1')
    expect(await runGit(['status', '--porcelain'], repoDir)).toBe('')
  })

  it("skips when the app isn't inside a Git repository", async ({ onTestFinished }) => {
    const dir = await createTmpDir(onTestFinished)

    expect(await addAiSkill(dir, { onlyIfSkillsDirectoryExists: false })).toBe(null)
    await expect(fs.stat(path.join(dir, '.claude'))).rejects.toThrow()
  })

  it("doesn't Git-commit when the skill file is .gitignore'd", async ({ onTestFinished }) => {
    const repoDir = await createGitRepo(onTestFinished)
    await fs.writeFile(path.join(repoDir, '.gitignore'), '.claude/\n', 'utf8')

    const res = await addAiSkill(repoDir, { onlyIfSkillsDirectoryExists: false })
    expect(res).toBeTruthy()
    expect(res!.isCommitted).toBe(false)
    expect(await fs.readFile(res!.skillFilePath, 'utf8')).toBe(skillFileContent)
    expect(await runGit(['status', '--porcelain'], repoDir)).not.toContain('.claude')
  })

  it('never commits files staged by the user', async ({ onTestFinished }) => {
    const repoDir = await createGitRepo(onTestFinished)
    await fs.writeFile(path.join(repoDir, 'user-file.txt'), 'hello', 'utf8')
    await runGit(['add', 'user-file.txt'], repoDir)

    const res = await addAiSkill(repoDir, { onlyIfSkillsDirectoryExists: false })
    expect(res!.isCommitted).toBe(true)
    expect(await runGit(['log', '-1', '--name-only', '--format='], repoDir)).toBe(skillFilePathRelative)
    // The user's staged file is still staged
    expect(await runGit(['diff', '--cached', '--name-only'], repoDir)).toBe('user-file.txt')
  })

  it("skips when the skills directory doesn't exist", async ({ onTestFinished }) => {
    const repoDir = await createGitRepo(onTestFinished)

    expect(await addAiSkill(repoDir, { onlyIfSkillsDirectoryExists: true })).toBe(null)
    await expect(fs.stat(path.join(repoDir, '.claude'))).rejects.toThrow()
  })

  it('applies when the skills directory exists', async ({ onTestFinished }) => {
    const repoDir = await createGitRepo(onTestFinished)
    await fs.mkdir(path.join(repoDir, ...skillsDirPathRelative.split('/')), { recursive: true })

    const res = await addAiSkill(repoDir, { onlyIfSkillsDirectoryExists: true })
    expect(res).toBeTruthy()
    expect(res!.isCommitted).toBe(true)
    expect(await fs.readFile(res!.skillFilePath, 'utf8')).toBe(skillFileContent)
  })
})

async function runGit(args: string[], cwd: string): Promise<string> {
  const { stdout } = await execFileA('git', args, { cwd })
  return stdout.toString().trim()
}

async function createTmpDir(onTestFinished: (fn: () => Promise<void>) => void): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'vike-test-skill-'))
  onTestFinished(() => fs.rm(dir, { recursive: true, force: true }))
  return dir
}

async function createGitRepo(onTestFinished: (fn: () => Promise<void>) => void): Promise<string> {
  const repoDir = await createTmpDir(onTestFinished)
  await runGit(['init'], repoDir)
  await runGit(['config', 'user.email', 'test@example.com'], repoDir)
  await runGit(['config', 'user.name', 'test'], repoDir)
  return repoDir
}
