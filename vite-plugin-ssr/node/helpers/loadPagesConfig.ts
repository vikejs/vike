export { loadPageConfigFiles }

import glob from 'fast-glob'
import path from 'path'
import type { PageConfigFile } from '../../shared/page-configs/PageConfig'
import { isValidPageConfigFile } from '../plugin/plugins/generateImportGlobs/getPageConfigs'
import { assertWarning, toPosixPath, scriptFileExtensions, assertPosixPath, assert } from '../utils'
import { loadScript } from './loadScript'

// type Result = { pageConfigFilePath: string; pageConfigFileExports: Record<string, unknown> }
type Result = PageConfigFile

async function loadPageConfigFiles(userRootDir: string): Promise<{ hasError: true } | { pageConfigFiles: Result[] }> {
  const pageConfigFilePaths = await findPagesConfigFiles(userRootDir)

  const pageConfigFiles: Result[] = []
  // TODO: make esbuild build everyting at once
  const results = await Promise.all(
    pageConfigFilePaths.map(async (pageConfigFilePath) => {
      const pageConfigFilePathAbsolute = path.posix.join(userRootDir, pageConfigFilePath)
      const result = await loadScript(pageConfigFilePathAbsolute)
      if ('err' in result) {
        return { hasError: true }
      }
      const pageConfigFileExports = result.exports
      if (!isValidPageConfigFile(pageConfigFileExports)) {
        return { hasError: true }
      }
      const pageConfigValues = pageConfigFileExports.default
      return { pageConfigFilePath, pageConfigValues }
    })
  )
  if (results.some(({ hasError }) => hasError)) {
    return { hasError: true }
  }
  results.forEach((result) => {
    assert(!('hasError' in result))
    const { pageConfigFilePath, pageConfigValues } = result
    pageConfigFiles.push({
      pageConfigFilePath,
      pageConfigValues
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
