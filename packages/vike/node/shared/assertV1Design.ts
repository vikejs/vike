export { assertV1Design }

// TO-DO/next-major-release remove

import { PageFile } from '../../shared/getPageFiles.js'
import type { PageConfigBuildTime } from '../../types/PageConfig.js'
import { assert, assertUsage, assertWarning, isNotNullish, unique } from './utils.js'

function assertV1Design(pageConfigs: PageConfigBuildTime[] | boolean, pageFilesAll: PageFile[] | boolean): void {
  const isOldDesign = pageFilesAll === true || (pageFilesAll !== false && pageFilesAll.length > 0)
  const isV1Design = pageConfigs === true || (pageConfigs !== false && pageConfigs.length > 0)
  if (isV1Design && isOldDesign) {
    const lines = ['Mixing the new V1 design with the old V0.4 design is forbidden.']
    const indent = '- '
    if (typeof pageConfigs !== 'boolean') {
      assert(pageConfigs.length > 0)
      const filesV1: string[] = unique(
        pageConfigs
          .map((p) =>
            Object.values(p.configValueSources).map((sources) =>
              sources
                .map((c) => c.definedAt)
                .map((definedAt) => (definedAt.definedBy ? null : definedAt.filePathAbsoluteUserRootDir))
                .filter(isNotNullish)
                .map((filePathToShowToUser) => indent + filePathToShowToUser),
            ),
          )
          .flat(2),
      )
      lines.push(...['V1 design files:', ...filesV1])
    }
    if (typeof pageFilesAll !== 'boolean') {
      assert(pageFilesAll.length > 0)
      const filesOld = pageFilesAll.map((p) => indent + p.filePath)
      lines.push(...['Old design files:', ...filesOld])
    }
    assertUsage(false, lines.join('\n'))
  }
  assertWarning(
    !isOldDesign,
    "You are using Vike's deprecated design. Update to the new V1 design, see https://vike.dev/migration/v1-design for how to migrate.",
    { onlyOnce: true },
  )
}
