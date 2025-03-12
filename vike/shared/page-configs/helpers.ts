export { getPageConfig }
export { getConfigValueFilePathToShowToUser }
export { getHookFilePathToShowToUser }

import { assert, isArray } from '../utils.js'
import type { PageConfigRuntime, DefinedAtData } from './PageConfig.js'

function getPageConfig(pageId: string, pageConfigs: PageConfigRuntime[]): PageConfigRuntime {
  const pageConfig = pageConfigs.find((p) => p.pageId === pageId)
  assert(pageConfigs.length > 0)
  assert(pageConfig)
  return pageConfig
}

function getConfigValueFilePathToShowToUser(definedAtData: DefinedAtData): null | string {
  // A unique file path only exists if the config value isn't cumulative nor computed:
  //  - cumulative config values have multiple file paths
  //  - computed values don't have any file path
  if (!definedAtData || isArray(definedAtData) || definedAtData.definedBy) return null
  const { filePathToShowToUser } = definedAtData
  assert(filePathToShowToUser)
  return filePathToShowToUser
}

function getHookFilePathToShowToUser(definedAtData: DefinedAtData): string {
  const filePathToShowToUser = getConfigValueFilePathToShowToUser(definedAtData)
  assert(filePathToShowToUser)
  return filePathToShowToUser
}
