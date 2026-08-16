import { describe, expect, it } from 'vitest'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { addAiSkill, skillFileContent, skillPathInsideSkillsDir } from './autoAddAiSkill.js'
const execFileA = promisify(execFile)

describe('addAiSkill()', () => {
  it('creates and Git-commits the skill file in a discovered skills directory', async ({ onTestFinished }) => {
    const repoDir = await createGitRepo(onTestFinished)
    await createUserSkill(repoDir, '.claude/skills')

    const res = await addAiSkill(repoDir, { skillsDirs: undefined })
    expect(res).toBeTruthy()
    expect(res!.files.map((f) => f.filePathRelative)).toEqual(['.claude/skills/vike/SKILL.md'])
    expect(res!.files[0]!.isUpdate).toBe(false)
    expect(res!.isCommitted).toBe(true)
    expect(await fs.readFile(res!.files[0]!.filePathAbsolute, 'utf8')).toBe(skillFileContent)
    expect(await runGit(['log', '-1', '--format=%s'], repoDir)).toBe('Add Vike skill (see https://vike.dev/ai#skill)')
    // The user's own skill isn't committed
    expect(await runGit(['log', '-1', '--name-only', '--format='], repoDir)).toBe('.claude/skills/vike/SKILL.md')
  })

  it('discovers all skills directories (`**/skills/*/SKILL.md`)', async ({ onTestFinished }) => {
    const repoDir = await createGitRepo(onTestFinished)
    await createUserSkill(repoDir, '.claude/skills')
    await createUserSkill(repoDir, '.agents/skills')
    await createUserSkill(repoDir, 'packages/web/.claude/skills')

    const res = await addAiSkill(repoDir, { skillsDirs: undefined })
    expect(res!.files.map((f) => f.filePathRelative)).toEqual([
      '.agents/skills/vike/SKILL.md',
      '.claude/skills/vike/SKILL.md',
      'packages/web/.claude/skills/vike/SKILL.md',
    ])
    expect(res!.isCommitted).toBe(true)
    // All three skill files are committed together (and nothing else)
    expect((await runGit(['log', '-1', '--name-only', '--format='], repoDir)).split('\n').sort()).toEqual([
      '.agents/skills/vike/SKILL.md',
      '.claude/skills/vike/SKILL.md',
      'packages/web/.claude/skills/vike/SKILL.md',
    ])
    expect(await runGit(['rev-list', '--count', 'HEAD'], repoDir)).toBe('1')
  })

  it("skips when there isn't any skills directory", async ({ onTestFinished }) => {
    const repoDir = await createGitRepo(onTestFinished)

    expect(await addAiSkill(repoDir, { skillsDirs: undefined })).toBe(null)
    await expect(fs.stat(path.join(repoDir, '.claude'))).rejects.toThrow()
  })

  it('skips when the skill file is up-to-date', async ({ onTestFinished }) => {
    const repoDir = await createGitRepo(onTestFinished)
    await createUserSkill(repoDir, '.claude/skills')

    expect(await addAiSkill(repoDir, { skillsDirs: undefined })).toBeTruthy()
    expect(await addAiSkill(repoDir, { skillsDirs: undefined })).toBe(null)
    expect(await runGit(['rev-list', '--count', 'HEAD'], repoDir)).toBe('1')
  })

  it("overwrites and Git-commits when the skill file doesn't match", async ({ onTestFinished }) => {
    const repoDir = await createGitRepo(onTestFinished)

    // Simulate an outdated skill file committed by an older Vike version
    const skillFilePath = path.join(repoDir, '.claude', 'skills', 'vike', 'SKILL.md')
    await fs.mkdir(path.dirname(skillFilePath), { recursive: true })
    await fs.writeFile(skillFilePath, 'outdated content', 'utf8')
    await runGit(['add', '--', '.claude/skills/vike/SKILL.md'], repoDir)
    await runGit(['commit', '-m', 'Add Vike skill (see https://vike.dev/ai#skill)'], repoDir)

    const res = await addAiSkill(repoDir, { skillsDirs: undefined })
    expect(res!.files[0]!.isUpdate).toBe(true)
    expect(res!.isCommitted).toBe(true)
    expect(await fs.readFile(res!.files[0]!.filePathAbsolute, 'utf8')).toBe(skillFileContent)
    expect(await runGit(['log', '-1', '--format=%s'], repoDir)).toBe(
      'Update Vike skill (see https://vike.dev/ai#skill)',
    )
    expect(await runGit(['rev-list', '--count', 'HEAD'], repoDir)).toBe('2')
  })

  it('restores local uncommitted modifications (nothing to Git-commit then)', async ({ onTestFinished }) => {
    const repoDir = await createGitRepo(onTestFinished)

    const res1 = await addAiSkill(repoDir, { skillsDirs: ['.claude/skills'] })
    // The user (or their AI agent) modified the skill file without committing the modification
    await fs.writeFile(res1!.files[0]!.filePathAbsolute, 'modified content', 'utf8')

    // The skill file we previously added makes .claude/skills/ discoverable
    const res2 = await addAiSkill(repoDir, { skillsDirs: undefined })
    expect(res2!.files[0]!.isUpdate).toBe(true)
    // The restored content is equal to the already committed content => there isn't anything to commit
    expect(res2!.isCommitted).toBe(false)
    expect(await fs.readFile(res2!.files[0]!.filePathAbsolute, 'utf8')).toBe(skillFileContent)
    expect(await runGit(['rev-list', '--count', 'HEAD'], repoDir)).toBe('1')
    expect(await runGit(['status', '--porcelain'], repoDir)).toBe('')
  })

  it('adds the skill file to the directories listed by the user (creating them)', async ({ onTestFinished }) => {
    const repoDir = await createGitRepo(onTestFinished)

    const res = await addAiSkill(repoDir, { skillsDirs: ['.claude/skills', '.agents/skills'] })
    expect(res!.files.map((f) => f.filePathRelative)).toEqual([
      '.claude/skills/vike/SKILL.md',
      '.agents/skills/vike/SKILL.md',
    ])
    expect(res!.isCommitted).toBe(true)
    expect(await runGit(['rev-list', '--count', 'HEAD'], repoDir)).toBe('1')
  })

  it("skips when the app isn't inside a Git repository", async ({ onTestFinished }) => {
    const dir = await createTmpDir(onTestFinished)

    expect(await addAiSkill(dir, { skillsDirs: ['.claude/skills'] })).toBe(null)
    await expect(fs.stat(path.join(dir, '.claude'))).rejects.toThrow()
  })

  it("doesn't Git-commit when the skill file is .gitignore'd", async ({ onTestFinished }) => {
    const repoDir = await createGitRepo(onTestFinished)
    await fs.writeFile(path.join(repoDir, '.gitignore'), '.claude/\n', 'utf8')

    const res = await addAiSkill(repoDir, { skillsDirs: ['.claude/skills'] })
    expect(res).toBeTruthy()
    expect(res!.isCommitted).toBe(false)
    expect(await fs.readFile(res!.files[0]!.filePathAbsolute, 'utf8')).toBe(skillFileContent)
    expect(await runGit(['status', '--porcelain'], repoDir)).not.toContain('.claude')
  })

  it('never commits files staged by the user', async ({ onTestFinished }) => {
    const repoDir = await createGitRepo(onTestFinished)
    await fs.writeFile(path.join(repoDir, 'user-file.txt'), 'hello', 'utf8')
    await runGit(['add', 'user-file.txt'], repoDir)

    const res = await addAiSkill(repoDir, { skillsDirs: ['.claude/skills'] })
    expect(res!.isCommitted).toBe(true)
    expect(await runGit(['log', '-1', '--name-only', '--format='], repoDir)).toBe(
      `.claude/skills/${skillPathInsideSkillsDir}`,
    )
    // The user's staged file is still staged
    expect(await runGit(['diff', '--cached', '--name-only'], repoDir)).toBe('user-file.txt')
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

// Simulate a skill the user already has — making the skills directory discoverable
async function createUserSkill(repoDir: string, skillsDir: string): Promise<void> {
  const skillFilePath = path.join(repoDir, ...skillsDir.split('/'), 'some-user-skill', 'SKILL.md')
  await fs.mkdir(path.dirname(skillFilePath), { recursive: true })
  await fs.writeFile(skillFilePath, '---\nname: some-user-skill\ndescription: test\n---\n', 'utf8')
}
