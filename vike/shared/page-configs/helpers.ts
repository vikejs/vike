export { getPageConfig }
export { getConfigValueFilePathToShowToUser }
export { getHookFilePathToShowToUser }
export { getConfigDefinedAtString, getDefinedAtString } from './helpers/getConfigDefinedAtString.js'
export { getConfigValue } from './helpers/getConfigValue.js'

import { assert } from '../utils.js'
import type { PageConfigRuntime, DefinedAt } from './PageConfig.js'

function getPageConfig(pageId: string, pageConfigs: PageConfigRuntime[]): PageConfigRuntime {
  const pageConfig = pageConfigs.find((p) => p.pageId === pageId)
  assert(pageConfigs.length > 0)
  assert(pageConfig)
  return pageConfig
}

function getConfigValueFilePathToShowToUser({ definedAt }: { definedAt: DefinedAt }): null | string {
  // A unique file path only exists if the config value isn't cumulative nor computed:
  //  - cumulative config values have multiple file paths
  //  - computed values don't have any file path
  if ('isComputed' in definedAt || 'files' in definedAt) return null
  const { filePathToShowToUser } = definedAt
  assert(filePathToShowToUser)
  return filePathToShowToUser
}

function getHookFilePathToShowToUser({ definedAt }: { definedAt: DefinedAt }): string {
  const filePathToShowToUser = getConfigValueFilePathToShowToUser({ definedAt })
  assert(filePathToShowToUser)
  return filePathToShowToUser
}
