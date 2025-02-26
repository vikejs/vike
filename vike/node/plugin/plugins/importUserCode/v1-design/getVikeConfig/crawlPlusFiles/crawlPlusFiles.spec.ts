import { expect, describe, it, assert } from 'vitest'
import path from 'path'
import fs from 'fs'
// process.env.DEBUG = 'vike:crawl'
const { crawlPlusFiles } = await import('../crawlPlusFiles')
import { fileURLToPath } from 'url'
const __dirname_ = path.dirname(fileURLToPath(import.meta.url))
const userRootDir = path.join(__dirname_, './test-file-structure')

describe('crawlPlusFiles()', () => {
  it('works', async ({ onTestFinished }) => {
    const { clean } = createFiles([
      'pages/about/+bla.mdx',
      'pages/git-ignored/+bla.mdx',
      'pages/about/+ignored.telefunc.ts',
      'pages/about/+ignored.generated.js',
      'pages/ejected/+ignored.js',
      'pages/node_modules/+ignored.js'
    ])
    onTestFinished(() => clean())

    const filesWithGit = await crawl()
    expect(filesWithGit).toMatchInlineSnapshot(`
      [
        "/+config.js",
        "/pages/+config.js",
        "/pages/about/+bla.mdx",
      ]
    `)
    assert(!JSON.stringify(filesWithGit).includes('ignored'))

    process.env.VIKE_CRAWL = '{git:false}'
    const filesWithGlob = await crawl()
    expect(filesWithGlob).toMatchInlineSnapshot(`
      [
        "/+config.js",
        "/pages/+config.js",
        "/pages/about/+bla.mdx",
        "/pages/git-ignored/+bla.mdx",
      ]
    `)
  })
})

async function crawl() {
  const res = await crawlPlusFiles(userRootDir)
  const files = res.map((f) => f.filePathAbsoluteUserRootDir).sort()
  return files
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
    }
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
