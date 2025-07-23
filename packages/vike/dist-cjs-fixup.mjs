import fs from 'node:fs/promises'
import path from 'node:path'
const distCjs = 'dist/cjs'

main()

async function main() {
  await generatePackageJson()
  await shimImportMeta()
}

async function generatePackageJson() {
  await fs.writeFile(distCjs + '/package.json', '{ "type": "commonjs" }\n', 'utf8')
  console.log(`✅ ${distCjs}/package.json generated`)
}

async function shimImportMeta() {
  const files = await getFiles(distCjs)
  files.forEach(replaceImportMeta)
  console.log(`✅ ${distCjs}/ shimmed import.meta.url`)
}

async function replaceImportMeta(filePath) {
  let fileContent = await fs.readFile(filePath, 'utf8')
  fileContent = fileContent.replaceAll('import.meta.url', "`file:///${__filename.split('\\\\').join('/')}`")
  // fileContent = fileContent.replaceAll('import.meta.env', '({})')
  // fileContent = fileContent.replaceAll('import.meta.hot', '(undefined)')
  await fs.writeFile(filePath, fileContent, 'utf8')
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
