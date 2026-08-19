import { expect, describe, it, assert } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
// process.env.DEBUG = 'vike:crawl'
const { crawlFiles } = await import('./crawlFiles.js')
import { fileURLToPath } from 'node:url'
const __dirname_ = path.dirname(fileURLToPath(import.meta.url))
const userRootDir = path.join(__dirname_, './crawlFiles-test-file-structure')

const pattern = '**/skills/*/SKILL.md'

describe('crawlFiles()', () => {
  it('works', async ({ onTestFinished }) => {
    const { clean } = createFiles([
      '.claude/skills/vike/SKILL.md',
      '.agents/skills/vike/SKILL.md',
      'packages/app/skills/deploy/SKILL.md',
      'skills/root/SKILL.md',
      'gitignored/skills/hidden/SKILL.md',
      // Ignored: built-in ignore pattern **/node_modules/**
      'node_modules/skills/dep/SKILL.md',
      // No match: `*` doesn't span directories
      'packages/app/skills/nested/deep/SKILL.md',
      // No match: `skills` is matched literally
      'packages/app/skillsX/foo/SKILL.md',
      '.gitignore',
    ])
    onTestFinished(() => clean())
    fs.writeFileSync(path.join(userRootDir, '.gitignore'), 'gitignored/\n')

    // Git — skips .gitignore'd files
    process.env.VIKE_CRAWL = '{}'
    expect(await crawl({ dot: true })).toEqual([
      '.agents/skills/vike/SKILL.md',
      '.claude/skills/vike/SKILL.md',
      'packages/app/skills/deploy/SKILL.md',
      'skills/root/SKILL.md',
    ])

    // Glob — doesn't know about .gitignore
    process.env.VIKE_CRAWL = '{git:false}'
    expect(await crawl({ dot: true })).toEqual([
      '.agents/skills/vike/SKILL.md',
      '.claude/skills/vike/SKILL.md',
      'gitignored/skills/hidden/SKILL.md',
      'packages/app/skills/deploy/SKILL.md',
      'skills/root/SKILL.md',
    ])

    // dot: false — hidden directories aren't crawled
    process.env.VIKE_CRAWL = '{}'
    expect(await crawl({})).toEqual(['packages/app/skills/deploy/SKILL.md', 'skills/root/SKILL.md'])
    process.env.VIKE_CRAWL = '{git:false}'
    expect(await crawl({})).toEqual([
      'gitignored/skills/hidden/SKILL.md',
      'packages/app/skills/deploy/SKILL.md',
      'skills/root/SKILL.md',
    ])

    // A zero-match Git result is trusted — no tinyglobby fallback...
    process.env.VIKE_CRAWL = '{}'
    expect(await crawl({ dot: true }, '**/gitignored/skills/*/SKILL.md')).toEqual([])
    // ...unless globFallback is set
    expect(await crawl({ dot: true, globFallback: true }, '**/gitignored/skills/*/SKILL.md')).toEqual([
      'gitignored/skills/hidden/SKILL.md',
    ])
  })
})

async function crawl(options: { dot?: boolean; globFallback?: boolean }, pattern_ = pattern) {
  const files = await crawlFiles(userRootDir, pattern_, options)
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
