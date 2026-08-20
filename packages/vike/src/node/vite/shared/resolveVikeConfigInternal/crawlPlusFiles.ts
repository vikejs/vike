export { crawlPlusFiles }
export { isPlusFile }
export { getPlusFileValueConfigName }

import { assert, assertUsage } from '../../../../utils/assert.js'
import { assertFilePathAbsoluteFilesystem } from '../../../../utils/isFilePathAbsoluteFilesystem.js'
import { assertPosixPath } from '../../../../utils/path.js'
import path from 'node:path'
import { isTemporaryBuildFile } from './transpileAndExecuteFile.js'
import '../../assertEnvVite.js'
import { crawlFiles } from '../../../../utils/crawlFiles.js'
import { scriptFileExtensionPattern } from '../../../../utils/isScriptFile.js'
import { assertIsNotProductionRuntime } from '../../../../utils/assertSetup.js'
assertIsNotProductionRuntime()

const plusFilesPattern = `**/+*.${scriptFileExtensionPattern}`

async function crawlPlusFiles(userRootDir: string): Promise<{ filePathAbsoluteUserRootDir: string }[]> {
  assertPosixPath(userRootDir)
  assertFilePathAbsoluteFilesystem(userRootDir)

  let files = await crawlFiles(plusFilesPattern, {
    cwd: userRootDir,
    // Every app has `+` files: if Git doesn't find any then it's likely because the user dynamically generates them (and `.gitignore`s them).
    globFallback: true,
  })

  // Filter build files
  files = files.filter((filePath) => !isTemporaryBuildFile(filePath))

  // Normalize
  const plusFiles = files.map((filePath) => {
    // Both `$ git-ls files` and tinyglobby return posix paths
    assertPosixPath(filePath)
    assert(!filePath.startsWith(userRootDir))
    const filePathAbsoluteUserRootDir = path.posix.join('/', filePath)
    assert(isPlusFile(filePathAbsoluteUserRootDir))
    return { filePathAbsoluteUserRootDir }
  })

  return plusFiles
}

function isPlusFile(filePath: string): boolean {
  assertPosixPath(filePath)
  if (isTemporaryBuildFile(filePath)) return false
  const fileName = filePath.split('/').pop()!
  return fileName.startsWith('+')
}

function getPlusFileValueConfigName(filePath: string): string | null {
  if (!isPlusFile(filePath)) return null
  const fileName = path.posix.basename(filePath)
  // assertNoUnexpectedPlusSign(filePath, fileName)
  const basename = fileName.split('.')[0]!
  assert(basename.startsWith('+'))
  const configName = basename.slice(1)
  assertUsage(configName !== '', `${filePath} Invalid filename ${fileName}`)
  return configName
}

/* https://github.com/vikejs/vike/issues/1407
function assertNoUnexpectedPlusSign(filePath: string, fileName: string) {
  const dirs = path.posix.dirname(filePath).split('/')
  dirs.forEach((dir, i) => {
    const dirPath = dirs.slice(0, i + 1).join('/')
    assertUsage(
      !dir.includes('+'),
      `Character '+' is a reserved character: remove '+' from the directory name ${dirPath}/`
    )
  })
  assertUsage(
    !fileName.slice(1).includes('+'),
    `Character '+' is only allowed at the beginning of filenames: make sure ${filePath} doesn't contain any '+' in its filename other than its first letter`
  )
}
*/
