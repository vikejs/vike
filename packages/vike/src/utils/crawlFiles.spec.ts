import { expect, describe, it, assert } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
// process.env.DEBUG = 'vike:crawl'
const { crawlFiles } = await import('./crawlFiles.js')
const __dirname_ = path.dirname(fileURLToPath(import.meta.url))
const cwd = path.join(__dirname_, './test-file-structure')

// The pattern is applied to the results of `$ git ls-files` as well, thus both crawling methods return the same files.
const pattern = '**/skills/*/SKILL.{md,txt}'

describe('crawlFiles()', () => {
  it('crawls any pattern, with Git as well as with tinyglobby', async ({ onTestFinished }) => {
    const { clean } = createFiles([
      'skills/some-skill/SKILL.md',
      'skills/other-skill/SKILL.txt',
      '.dot-dir/skills/some-skill/SKILL.md',
      'some-dir/.other-dot-dir/skills/some-skill/SKILL.md',
      // Doesn't match the pattern (but does match the loosened pathspec we pass to `$ git ls-files`)
      'not-skills/some-skill/SKILL.md',
      'skills/some-skill/nested/SKILL.md',
      'skills/some-skill/SKILL.json',
    ])
    onTestFinished(() => {
      clean()
      delete process.env.VIKE_CRAWL
    })

    delete process.env.VIKE_CRAWL
    const filesWithGit = await crawl()
    expect(filesWithGit).toMatchInlineSnapshot(`
      [
        ".dot-dir/skills/some-skill/SKILL.md",
        "skills/other-skill/SKILL.txt",
        "skills/some-skill/SKILL.md",
        "some-dir/.other-dot-dir/skills/some-skill/SKILL.md",
      ]
    `)

    process.env.VIKE_CRAWL = '{git:false}'
    const filesWithGlob = await crawl()
    expect(filesWithGlob).toEqual(filesWithGit)
  })

  it('skips dotfiles and dot directories by default', async ({ onTestFinished }) => {
    const { clean } = createFiles(['skills/some-skill/SKILL.md', '.dot-dir/skills/some-skill/SKILL.md'])
    onTestFinished(() => {
      clean()
      delete process.env.VIKE_CRAWL
    })

    delete process.env.VIKE_CRAWL
    const filesWithGit = await crawl({ dot: false })
    expect(filesWithGit).toMatchInlineSnapshot(`
      [
        "skills/some-skill/SKILL.md",
      ]
    `)

    process.env.VIKE_CRAWL = '{git:false}'
    const filesWithGlob = await crawl({ dot: false })
    expect(filesWithGlob).toEqual(filesWithGit)
  })
})

async function crawl({ dot = true }: { dot?: boolean } = {}) {
  const files = await crawlFiles(pattern, { cwd, dot })
  return files.slice().sort()
}

function createFiles(files: string[]) {
  const filePaths = files.map((file) => path.join(cwd, file))

  // Create empty files
  filePaths.forEach((filePath) => {
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, '')
  })

  return {
    clean: () => {
      filePaths.forEach((filePath) => {
        assert(fs.existsSync(filePath))
        fs.unlinkSync(filePath)
      })
      removeEmptyDirectories(cwd)
    },
  }
}

function removeEmptyDirectories(dirPath: string): void {
  for (const file of fs.readdirSync(dirPath)) {
    const fullPath = path.join(dirPath, file)
    if (fs.statSync(fullPath).isDirectory()) removeEmptyDirectories(fullPath)
  }
  // Re-check the directory; remove it if it's now empty
  if (fs.readdirSync(dirPath).length === 0) fs.rmdirSync(dirPath)
}
