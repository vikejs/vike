import { toPosixPath } from '../utils'
import { resolveGlobConfig } from './glob'

export { resolveConfig }
export type { Config }

type Config = { pageFiles?: { include: string[] } }

function resolveConfig(configs: Config | Config[] | undefined) {
  const includePageFiles: string[] = []
  const configList = !configs ? [] : Array.isArray(configs) ? configs : [configs]
  configList.forEach((config) => {
    if (config.pageFiles) {
      includePageFiles.push(...config.pageFiles.include.map(sanitize))
    }
  })
  const getGlobRoots = resolveGlobConfig(includePageFiles)
  return { getGlobRoots }
}

function sanitize(includePath: string): string {
  includePath = toPosixPath(includePath)
  if (includePath.endsWith('/')) {
    includePath = includePath.slice(0, -1)
  }
  return includePath
}
