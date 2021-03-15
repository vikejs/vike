import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'

const PATCH_FILE = 'dist/node/chunks/dep-e0f09032.js'
const PATCH_LINE = 22786
const PATCH_CONDITION = "importer.includes('node_modules')"
const PATCH_NEW_CONDITION = "!source.includes('import.meta.glob')"

workaroundViteIssue2390()
//export { workaroundViteIssue2390 }

function workaroundViteIssue2390() {
  if (!__dirname.includes('node_modules')) return

  const vitePackageJson = require.resolve('vite/package.json')
  const viteRoot = dirname(vitePackageJson)

  let targetFile
  try {
    targetFile = require.resolve(join(viteRoot, PATCH_FILE))
  } catch (err) {
    throw patchError()
  }

  const source = readFileSync(targetFile, 'utf8')

  // Already patched
  if (source.includes(PATCH_NEW_CONDITION)) {
    return
  }

  const lines = source.split(/\r?\n/)
  let line = lines[PATCH_LINE - 1]
  if (!line.includes(PATCH_CONDITION)) {
    throw patchError()
  }
  const parts = line.split(PATCH_CONDITION)
  if (parts.length !== 2) {
    throw patchError()
  }
  const linePatched =
    parts[0] + `(${PATCH_CONDITION} && ${PATCH_NEW_CONDITION})` + parts[1]
  lines[PATCH_LINE - 1] = linePatched
  const sourcePatched = lines.join('\n')

  writeFileSync(targetFile, sourcePatched, 'utf8')

  console.log(require.cache[targetFile])
  delete require.cache[targetFile]
}

function patchError() {
  return new Error(
    'Could not patch vite. Contact @brillout on Discord or by opening a new GitHub issue.'
  )
}
