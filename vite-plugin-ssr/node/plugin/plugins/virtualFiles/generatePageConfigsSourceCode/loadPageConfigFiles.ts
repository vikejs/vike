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
  const pageConfigFilePaths = await findPagesConfigFiles(userRootDir)

  const pageConfigFiles: PageConfigFile[] = []
  // TODO: make esbuild build everyting at once
  const results = await Promise.all(
    pageConfigFilePaths.map(async (pageConfigFilePath) => {
      const pageConfigFilePathAbsolute = path.posix.join(userRootDir, pageConfigFilePath)
      const result = await transpileAndLoadScriptFile(pageConfigFilePathAbsolute)
      if ('err' in result) {
        return { err: result.err }
      }
      const pageConfigFileExports = result.exports
      return { pageConfigFilePath, pageConfigFileExports }
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

async function findPagesConfigFiles(userRootDir: string): Promise<string[]> {
  assertPosixPath(userRootDir)
  const timeBase = new Date().getTime()
  let configFiles = await glob(`**/+config.${scriptFileExtensions}`, {
    ignore: ['**/node_modules/**'],
    cwd: userRootDir,
    dot: false
  })
  const time = new Date().getTime() - timeBase
  assertWarning(
    time < 2 * 1000,
    `Finding your +config.js files took an unexpected long time (${time}ms). Reach out to the vite-plugin-ssr maintainer.`,
    {
      showStackTrace: false,
      onlyOnce: 'slow-page-files-search'
    }
  )
  configFiles = configFiles.map((p) => path.posix.join('/', toPosixPath(p)))
  return configFiles
}
