import fs from 'fs/promises'
import path from 'path'
const sourceDir = 'dist/cjs'

main()

async function main() {
  await generatePackageJson()
  await shimImportMetaUrl()
  await slim()
}

async function generatePackageJson() {
  await fs.writeFile(sourceDir + '/package.json', '{ "type": "commonjs" }\n', 'utf8')
  console.log('✅ dist/cjs/package.json generated')
}

async function shimImportMetaUrl() {
  await processFiles(sourceDir)
  console.log('✅ dist/cjs/ shimmed import.meta.url')
}

async function slim() {
  await removeDirectory(sourceDir + '/client')
  console.log('✅ dist/cjs/ slimmed: removed dist/cjs/client/')
}

async function replaceImportMetaWithFilename(filePath) {
  const fileContent = await fs.readFile(filePath, 'utf8')
  const modifiedContent = fileContent.replace(/import\.meta\.url/g, '`file://${__filename}`')
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

async function removeDirectory(dirPath) {
  const files = await fs.readdir(dirPath)

  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const stats = await fs.lstat(filePath)

    if (stats.isDirectory()) {
      await removeDirectory(filePath)
    } else {
      await fs.unlink(filePath)
    }
  }

  await fs.rmdir(dirPath)
}
