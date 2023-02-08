export { loadPageConfigFiles }
export type { PageConfigFile }

import glob from 'fast-glob'
import path from 'path'
import {
  assertWarning,
  toPosixPath,
  scriptFileExtensions,
  assertPosixPath,
  assert,
  transpileAndLoadScriptFile
} from '../../../utils'

type PageConfigFile = {
  pageConfigFilePath: string
  pageConfigFileExports: Record<string, unknown>
}

async function loadPageConfigFiles(
  userRootDir: string
): Promise<{ err: unknown } | { pageConfigFiles: PageConfigFile[] }> {
  const pageConfigFilePaths = await findUserFiles(`**/+config.${scriptFileExtensions}`, userRootDir)

  const pageConfigFiles: PageConfigFile[] = []
  // TODO: make esbuild build everyting at once
  const results = await Promise.all(
    pageConfigFilePaths.map(async ({ filePathAbsolute, filePathRelativeToUserRootDir }) => {
      const result = await transpileAndLoadScriptFile(filePathAbsolute)
      if ('err' in result) {
        return { err: result.err }
      }
      return { pageConfigFilePath: filePathRelativeToUserRootDir, pageConfigFileExports: result.exports }
    })
  )
  for (const result of results) {
    if ('err' in result) {
      assert(result.err)
      return {
        err: result.err
      }
    }
  }
  results.forEach((result) => {
    assert(!('err' in result))
    const { pageConfigFilePath, pageConfigFileExports } = result
    pageConfigFiles.push({
      pageConfigFilePath,
      pageConfigFileExports
    })
  })

  return { pageConfigFiles }
}

async function findUserFiles(pattern: string, userRootDir: string) {
  assertPosixPath(userRootDir)
  const timeBase = new Date().getTime()
  const result = await glob(pattern, {
    ignore: ['**/node_modules/**'],
    cwd: userRootDir,
    dot: false
  })
  const time = new Date().getTime() - timeBase
  assertWarning(
    time < 2 * 1000,
    `Crawling your user files took an unexpected long time (${time}ms). Create a new issue on vite-plugin-ssr's GitHub.`,
    {
      showStackTrace: false,
      onlyOnce: 'slow-page-files-search'
    }
  )
  const userFiles = result.map((p) => {
    p = toPosixPath(p)
    const filePathRelativeToUserRootDir = path.posix.join('/', p)
    const filePathAbsolute = path.posix.join(userRootDir, p)
    return { filePathRelativeToUserRootDir, filePathAbsolute }
  })
  return userFiles
}
