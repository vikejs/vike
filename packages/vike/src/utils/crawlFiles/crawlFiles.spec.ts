import { expect, describe, it, assert } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
// process.env.DEBUG = 'vike:crawl'
const { crawlFiles } = await import('../crawlFiles.js')
import { scriptFileExtensionPattern } from '../isScriptFile.js'
import { fileURLToPath } from 'node:url'
const __dirname_ = path.dirname(fileURLToPath(import.meta.url))
const userRootDir = path.join(__dirname_, './test-file-structure')

// Same pattern as crawlPlusFiles()
const plusFilesPattern = `**/+*.${scriptFileExtensionPattern}`
// Any other pattern, e.g. the skills directories of AI agents
const skillFilesPattern = '**/skills/*/SKILL.{md,txt}'

describe('crawlFiles()', () => {
  it('works', async ({ onTestFinished }) => {
    const { clean } = createFiles([
      'pages/about/+bla.mdx',
      'pages/git-ignored/+bla.mdx',
      'pages/about/+ignored.telefunc.ts',
      'pages/about/+ignored.generated.js',
      'pages/about/+ignored.spec.ts',
      'pages/about/+ignored.test.ts',
      'pages/ejected/+ignored.js',
      'pages/node_modules/+ignored.js',
      'pages/manually/+ignored.js',
      'pages/manually-2/+ignored.js',
    ])
    onTestFinished(() => clean())

    process.env.VIKE_CRAWL = "{ignore:['**/manually/**','**/manually-2/**']}"
    const filesWithGit = await crawl(plusFilesPattern, { globFallback: true })
    expect(filesWithGit).toMatchInlineSnapshot(`
      [
        "+config.js",
        "pages/+config.js",
        "pages/about/+bla.mdx",
      ]
    `)
    assert(!JSON.stringify(filesWithGit).includes('ignored'))

    process.env.VIKE_CRAWL = "{git:false,ignore:'**/manually/**'}"
    const filesWithGlob = await crawl(plusFilesPattern, { globFallback: true })
    expect(filesWithGlob).toMatchInlineSnapshot(`
      [
        "+config.js",
        "pages/+config.js",
        "pages/about/+bla.mdx",
        "pages/git-ignored/+bla.mdx",
        "pages/manually-2/+ignored.js",
      ]
    `)
  })

  // The pattern is applied to the results of `$ git ls-files` as well, thus both crawling methods return the same files
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
    onTestFinished(() => clean())

    delete process.env.VIKE_CRAWL
    const filesWithGit = await crawl(skillFilesPattern, { dot: true })
    expect(filesWithGit).toMatchInlineSnapshot(`
      [
        ".dot-dir/skills/some-skill/SKILL.md",
        "skills/other-skill/SKILL.txt",
        "skills/some-skill/SKILL.md",
        "some-dir/.other-dot-dir/skills/some-skill/SKILL.md",
      ]
    `)

    process.env.VIKE_CRAWL = '{git:false}'
    const filesWithGlob = await crawl(skillFilesPattern, { dot: true })
    expect(filesWithGlob).toEqual(filesWithGit)
  })

  it('skips dotfiles and dot directories by default', async ({ onTestFinished }) => {
    const { clean } = createFiles(['skills/some-skill/SKILL.md', '.dot-dir/skills/some-skill/SKILL.md'])
    onTestFinished(() => clean())

    delete process.env.VIKE_CRAWL
    const filesWithGit = await crawl(skillFilesPattern)
    expect(filesWithGit).toMatchInlineSnapshot(`
      [
        "skills/some-skill/SKILL.md",
      ]
    `)

    process.env.VIKE_CRAWL = '{git:false}'
    const filesWithGlob = await crawl(skillFilesPattern)
    expect(filesWithGlob).toEqual(filesWithGit)
  })
})

async function crawl(pattern: string, options: { dot?: boolean; globFallback?: boolean } = {}) {
  const files = await crawlFiles(pattern, { cwd: userRootDir, ...options })
  return files.slice().sort()
}

function createFiles(files: string[]) {
  const filePaths = files.map((file) => path.join(userRootDir, file))

  // Create empty files
  filePaths.forEach((filePath) => {
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, '')
  })

  return {
    clean: () => {
      filePaths.forEach((filePath) => {
        assert(fs.existsSync(filePath))
        fs.unlinkSync(filePath) // Remove filePath
      })
      removeEmptyDirectories(userRootDir)
    },
  }
}

function removeEmptyDirectories(dirPath: string): void {
  // Read the directory contents
  const files = fs.readdirSync(dirPath)

  // Iterate through the files and subdirectories
  for (const file of files) {
    const fullPath = path.join(dirPath, file)

    // Check if it's a directory
    if (fs.statSync(fullPath).isDirectory()) {
      // Recursively clean up the subdirectory
      removeEmptyDirectories(fullPath)
    }
  }

  // Re-check the directory; remove it if it's now empty
  if (fs.readdirSync(dirPath).length === 0) {
    fs.rmdirSync(dirPath)
  }
}
