import fs from 'fs/promises'
import path from 'path'
const sourceDir = 'dist'

main()

async function replaceImportMetaWithFilename(filePath) {
  const fileContent = await fs.readFile(filePath, 'utf8')
  const modifiedContent = fileContent.replace(/import\.meta\.url/g, '__filename')
  await fs.writeFile(filePath, modifiedContent, 'utf8')
}

async function processFiles(directoryPath) {
  const files = await fs.readdir(directoryPath)

  for (const file of files) {
    const filePath = path.join(directoryPath, file)
    const stats = await fs.stat(filePath)

    if (stats.isDirectory()) {
      await processFiles(filePath)
    } else if (stats.isFile() && filePath.endsWith('.js')) {
      await replaceImportMetaWithFilename(filePath)
    }
  }
}

async function main() {
  await processFiles(sourceDir)
  console.log('Import.meta.url replaced with __filename successfully.')
}
