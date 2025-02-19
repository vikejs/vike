import fs from 'fs/promises'
import path from 'path'
const distCjs = 'dist/cjs'

main()

async function main() {
  await generatePackageJson()
  await shimImportMetaUrl()
}

async function generatePackageJson() {
  await fs.writeFile(distCjs + '/package.json', '{ "type": "commonjs" }\n', 'utf8')
  console.log(`✅ ${distCjs}/package.json generated`)
}

async function shimImportMetaUrl() {
  const files = await getFiles(distCjs)
  files.forEach(replaceImportMetaWithFilename)
  console.log(`✅ ${distCjs}/ shimmed import.meta.url`)
}

async function replaceImportMetaWithFilename(filePath) {
  const fileContent = await fs.readFile(filePath, 'utf8')
  const fileContentMod = fileContent.replaceAll('import.meta.url', '`file://${__filename}`')
  await fs.writeFile(filePath, fileContentMod, 'utf8')
}

async function getFiles(directoryPath) {
  const files = []
  for (const file of await fs.readdir(directoryPath)) {
    const filePath = path.join(directoryPath, file)
    const stats = await fs.stat(filePath)
    if (stats.isDirectory()) {
      files.push(...(await getFiles(filePath)))
    } else if (stats.isFile() && filePath.endsWith('.js')) {
      files.push(filePath)
    }
  }
  return files
}
