import fg from 'fast-glob'
import { mkdir, rm, writeFile } from 'fs/promises'
import { dirname, join } from 'path'
import { afterEach, describe, expect, it } from 'vitest'
import { parseGitignore } from '../index.js'

const userRootDir = join(__dirname, 'userRootDir')

async function writeFileCreateDir(file: string) {
  file = join(userRootDir, file)
  try {
    await mkdir(dirname(file), { recursive: true })
  } catch (error) {}
  await writeFile(file, '')
}

async function writeFiles(files: string[]) {
  await Promise.all(files.map((file) => writeFileCreateDir(file)))
}

async function expectFiles(gitignore: string, expected: string[], ignored?: string[]) {
  const result = parseGitignore(gitignore)
  const globResult = await fg(['**/**.(ts|tsx)'], { cwd: userRootDir, ignore: result.globs.exclude })
  // console.log({ gitignore, expected, ignore: result.globs.exclude, globResult })
  ignored
    ? expect(expected.every((file) => globResult.includes(file)) && ignored.every((file) => !globResult.includes(file)))
    : expect(globResult.sort()).toEqual(expected.sort())
}

describe('parseGitignore()', () => {
  afterEach(async () => {
    await rm(userRootDir, { recursive: true, force: true })
  })

  it('works', async () => {
    const files = [
      'index.ts',
      'pages/index.page.tsx',
      'pages/hello/index.page.tsx',
      'pages.ts',
      'pages.tsx/index.ts',
      'generated/pages/generated.page.tsx',
      'generated/index.ts',
      'generated/package.json',
      'generated/readme'
    ]

    await writeFiles(files)

    let gitignore: string

    gitignore = `
        pages
        generated
        pages.tsx
        index.ts
        pages.ts
    `
    await expectFiles(gitignore, [])

    gitignore = `
        *.tsx
        *.ts
    `
    await expectFiles(gitignore, [])

    gitignore = `
        pages
        generated
        pages.tsx
        index
        pages
    `
    await expectFiles(gitignore, ['index.ts', 'pages.ts'])

    gitignore = `
        pages
        generated
        pages.tsx
    `
    await expectFiles(gitignore, ['index.ts', 'pages.ts'])

    gitignore = `
        pages
        generated
    `
    await expectFiles(gitignore, ['index.ts', 'pages.tsx/index.ts', 'pages.ts'])

    gitignore = `
        pages
    `
    await expectFiles(gitignore, ['index.ts', 'pages.tsx/index.ts', 'generated/index.ts', 'pages.ts'])

    gitignore = `
        pages.ts
    `
    await expectFiles(gitignore, [
      'index.ts',
      'pages/index.page.tsx',
      'pages/hello/index.page.tsx',
      'pages.tsx/index.ts',
      'generated/pages/generated.page.tsx',
      'generated/index.ts'
    ])

    gitignore = `
        page.ts
    `
    await expectFiles(gitignore, [
      'index.ts',
      'pages/index.page.tsx',
      'pages/hello/index.page.tsx',
      'pages.ts',
      'pages.tsx/index.ts',
      'generated/pages/generated.page.tsx',
      'generated/index.ts'
    ])

    gitignore = `
        *page.tsx
    `
    await expectFiles(gitignore, ['index.ts', 'pages.ts', 'pages.tsx/index.ts', 'generated/index.ts'])

    gitignore = `
        *pages.tsx
    `
    await expectFiles(gitignore, [
      'index.ts',
      'pages/index.page.tsx',
      'pages/hello/index.page.tsx',
      'pages.ts',
      'generated/pages/generated.page.tsx',
      'generated/index.ts'
    ])

    gitignore = `
        *.page.ts*
    `
    await expectFiles(gitignore, ['index.ts', 'pages.ts', 'generated/index.ts', 'pages.tsx/index.ts'])

    gitignore = `
        *.page.ts**
    `
    await expectFiles(gitignore, ['index.ts', 'pages.ts', 'generated/index.ts', 'pages.tsx/index.ts'])

    gitignore = `
        /pages
    `
    await expectFiles(gitignore, [
      'index.ts',
      'generated/index.ts',
      'generated/pages/generated.page.tsx',
      'pages.tsx/index.ts',
      'pages.ts'
    ])

    gitignore = `
        pages*
    `
    await expectFiles(gitignore, ['index.ts', 'generated/index.ts'])

    gitignore = `
        pages/hello
    `
    await expectFiles(gitignore, [
      'index.ts',
      'pages.ts',
      'pages/index.page.tsx',
      'generated/index.ts',
      'generated/pages/generated.page.tsx',
      'pages.tsx/index.ts'
    ])

    gitignore = `
        pages/**/hello
    `
    await expectFiles(gitignore, [
      'index.ts',
      'pages.ts',
      'pages/index.page.tsx',
      'generated/index.ts',
      'generated/pages/generated.page.tsx',
      'pages.tsx/index.ts'
    ])

    gitignore = `
        pages/**
    `
    await expectFiles(gitignore, [
      'index.ts',
      'pages.ts',
      'generated/pages/generated.page.tsx',
      'generated/index.ts',
      'pages.tsx/index.ts'
    ])

    gitignore = `
        pages/*
    `
    await expectFiles(
      gitignore,
      ['index.ts', 'pages.ts', 'generated/pages/generated.page.tsx', 'generated/index.ts', 'pages.tsx/index.ts'],
      // this only ignores "pages/index.page.tsx", this is different from the git behavior, but won't cause a build error
      // can't map 'pages/*' to 'pages/**' because it would ignore too much
      ['pages/index.page.tsx']
    )

    gitignore = `
        pages/*
        !pages/hello
    `
    await expectFiles(gitignore, [
      'index.ts',
      'pages.ts',
      'generated/pages/generated.page.tsx',
      'pages/hello/index.page.tsx',
      'generated/index.ts',
      'pages.tsx/index.ts'
    ])

    //-----------------------------
    /**
     * It is not possible to re-include a file if a parent directory of that file is excluded.
     * Git doesn’t list excluded directories for performance reasons, so any patterns on contained files have no effect, no matter where they are defined.
     */

    gitignore = `
      /generated
      !/generated/pages/    
    `
    await expectFiles(gitignore, [
      'index.ts',
      'pages.ts',
      'pages/index.page.tsx',
      'pages/hello/index.page.tsx',
      'pages.tsx/index.ts'
    ])

    gitignore = `
      pages/**
      !pages/hello
    `
    await expectFiles(gitignore, [
      'index.ts',
      'pages.ts',
      'generated/pages/generated.page.tsx',
      'generated/index.ts',
      'pages.tsx/index.ts'
    ])

    //-----------------------------

    gitignore = `
        generated
    `
    await expectFiles(gitignore, [
      'index.ts',
      'pages.ts',
      'pages/index.page.tsx',
      'pages/hello/index.page.tsx',
      'pages.tsx/index.ts'
    ])

    gitignore = `
        /generated
    `
    await expectFiles(gitignore, [
      'index.ts',
      'pages.ts',
      'pages/index.page.tsx',
      'pages/hello/index.page.tsx',
      'pages.tsx/index.ts'
    ])

    gitignore = `
        /generated/
    `
    await expectFiles(gitignore, [
      'index.ts',
      'pages.ts',
      'pages/index.page.tsx',
      'pages/hello/index.page.tsx',
      'pages.tsx/index.ts'
    ])

    gitignore = `
        generated/
    `
    await expectFiles(gitignore, [
      'index.ts',
      'pages.ts',
      'pages/index.page.tsx',
      'pages/hello/index.page.tsx',
      'pages.tsx/index.ts'
    ])

    gitignore = `
      generated/pages
    `
    await expectFiles(gitignore, [
      'index.ts',
      'pages.ts',
      'pages/index.page.tsx',
      'pages/hello/index.page.tsx',
      'generated/index.ts',
      'pages.tsx/index.ts'
    ])

    gitignore = `
        /generated/*
        !/generated/pages/
    `
    await expectFiles(gitignore, [
      'index.ts',
      'pages.ts',
      'pages/index.page.tsx',
      'pages/hello/index.page.tsx',
      'generated/pages/generated.page.tsx',
      'pages.tsx/index.ts'
    ])

    gitignore = `
        generated/*
        !/generated/pages/
    `
    await expectFiles(gitignore, [
      'index.ts',
      'pages.ts',
      'pages/index.page.tsx',
      'pages/hello/index.page.tsx',
      'generated/pages/generated.page.tsx',
      'pages.tsx/index.ts'
    ])

    gitignore = `
        /generated/*
        !generated/pages/
    `
    await expectFiles(gitignore, [
      'index.ts',
      'pages.ts',
      'pages/index.page.tsx',
      'pages/hello/index.page.tsx',
      'generated/pages/generated.page.tsx',
      'pages.tsx/index.ts'
    ])

    gitignore = `
        generated/*
        !generated/pages/
    `
    await expectFiles(gitignore, [
      'index.ts',
      'pages.ts',
      'pages/index.page.tsx',
      'pages/hello/index.page.tsx',
      'generated/pages/generated.page.tsx',
      'pages.tsx/index.ts'
    ])

    gitignore = `
        /generated/*
        !/generated/pages
    `
    await expectFiles(gitignore, [
      'index.ts',
      'pages.ts',
      'pages/index.page.tsx',
      'pages/hello/index.page.tsx',
      'generated/pages/generated.page.tsx',
      'pages.tsx/index.ts'
    ])

    gitignore = `
        generated/*
        !/generated/pages
    `
    await expectFiles(gitignore, [
      'index.ts',
      'pages.ts',
      'pages/index.page.tsx',
      'pages/hello/index.page.tsx',
      'generated/pages/generated.page.tsx',
      'pages.tsx/index.ts'
    ])

    gitignore = `
        /generated/*
        !generated/pages
    `
    await expectFiles(gitignore, [
      'index.ts',
      'pages.ts',
      'pages/index.page.tsx',
      'pages/hello/index.page.tsx',
      'generated/pages/generated.page.tsx',
      'pages.tsx/index.ts'
    ])

    gitignore = `
        generated/*
        !generated/pages
    `
    await expectFiles(gitignore, [
      'index.ts',
      'pages.ts',
      'pages/index.page.tsx',
      'pages/hello/index.page.tsx',
      'generated/pages/generated.page.tsx',
      'pages.tsx/index.ts'
    ])
  })
})
