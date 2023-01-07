export { loadPagesConfig }

import glob from 'fast-glob'
import path from 'path'
import {
  isValidPageConfigFile,
  type PageConfigFile,
  type PageConfigValues
} from '../../shared/getPageFiles/getPageConfigsFromGlob'
import { assertWarning, toPosixPath, scriptFileExtensions, assertPosixPath, assert } from '../utils'
import { loadScript } from './loadScript'

async function loadPagesConfig(userRootDir: string): Promise<PageConfigFile[]> {
  const pageConfigFilePaths = await findPagesConfigFiles(userRootDir)

  const pageConfigFiles: PageConfigFile[] = []
  // TODO: make esbuild build everyting at once
  await Promise.all(
    pageConfigFilePaths.map(async (pageConfigFilePath) => {
      const pageConfigFilePathAbsolute = path.posix.join(userRootDir, pageConfigFilePath)
      const pageConfigFileExports = await loadScript(pageConfigFilePathAbsolute)
      // TODO: don't assert here
      assert(isValidPageConfigFile(pageConfigFileExports))
      const pageConfigValues: PageConfigValues = pageConfigFileExports.default
      pageConfigFiles.push({
        pageConfigFilePath,
        pageConfigValues
      })
    })
  )

  return pageConfigFiles
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
