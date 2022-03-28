import { resolvePageFiles } from './resolveConfig/resolvePageFiles'

export { resolveConfig }
export type { Config }

type Config = { pageFiles?: { include: string[] } }

function resolveConfig(config: Config | undefined) {
  const getGlobRoots = resolvePageFiles(config?.pageFiles)
  return { getGlobRoots }
}
