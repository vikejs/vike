export { loadPagesConfig }

import glob from 'fast-glob'
import path from 'path'
import { assertWarning, toPosixPath, scriptFileExtensions, assertPosixPath } from '../utils'
import { loadScript } from './loadScript'

async function loadPagesConfig(userRootDir: string) {
  const pageConfigFiles = await findPagesConfigFiles(userRootDir)
  const pageConfigs = await Promise.all(pageConfigFiles.map((configFilePath) => loadScript(configFilePath))) // TODO: make esbuild everyting at once
  console.log(pageConfigs)
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
  configFiles = configFiles.map((p) => path.posix.join(userRootDir, toPosixPath(p)))
  return configFiles
}
