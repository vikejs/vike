export { getPageConfig }
export { getConfigValueFilePathToShowToUser }
export { getHookFilePathToShowToUser }
export { getConfigDefinedAtDataString, getDefinedAtDataString } from './helpers/getConfigDefinedAtDataString.js'
export { getConfigValue } from './helpers/getConfigValue.js'

import { assert, isArray } from '../utils.js'
import type { PageConfigRuntime, DefinedAtData } from './PageConfig.js'

function getPageConfig(pageId: string, pageConfigs: PageConfigRuntime[]): PageConfigRuntime {
  const pageConfig = pageConfigs.find((p) => p.pageId === pageId)
  assert(pageConfigs.length > 0)
  assert(pageConfig)
  return pageConfig
}

function getConfigValueFilePathToShowToUser({ definedAt }: { definedAt: DefinedAtData }): null | string {
  // A unique file path only exists if the config value isn't cumulative nor computed:
  //  - cumulative config values have multiple file paths
  //  - computed values don't have any file path
  if (!definedAt || isArray(definedAt)) return null
  const { filePathToShowToUser } = definedAt
  assert(filePathToShowToUser)
  return filePathToShowToUser
}

function getHookFilePathToShowToUser({ definedAt }: { definedAt: DefinedAtData }): string {
  const filePathToShowToUser = getConfigValueFilePathToShowToUser({ definedAt })
  assert(filePathToShowToUser)
  return filePathToShowToUser
}
