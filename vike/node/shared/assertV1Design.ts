export { assertV1Design }

import { PageFile } from '../../shared/getPageFiles.js'
import type { PageConfigBuildTime } from '../../shared/page-configs/PageConfig.js'
import { assert, assertUsage, assertWarning, isNotNullish, unique } from './utils.js'

function assertV1Design(isOldDesign: boolean, pageConfigs: PageConfigBuildTime[], pageFilesAll?: PageFile[]): void {
  const isV1Design = pageConfigs.length > 0
  if (isV1Design && isOldDesign) {
    const lines = ['Mixing the new V1 design with the old V0.4 design is forbidden.']
    if (pageFilesAll) {
      assert(pageFilesAll.length > 0)
      const indent = '- '
      const filesV1: string[] = unique(
        pageConfigs
          .map((p) =>
            Object.values(p.configValueSources).map((sources) =>
              sources
                .map((c) => c.definedAtFilePath.filePathAbsoluteUserRootDir)
                .filter(isNotNullish)
                .map((filePathToShowToUser) => indent + filePathToShowToUser)
            )
          )
          .flat(2)
      )
      const filesOld = pageFilesAll.map((p) => indent + p.filePath)
      lines.push(...['V1 design files:', ...filesV1, 'Old design files:', ...filesOld])
    }
    assertUsage(false, lines.join('\n'))
  }
  assertWarning(
    !isOldDesign,
    "You are using Vike's deprecated design. Update to the new V1 design, see https://vike.dev/migration/v1-design for how to migrate.",
    { onlyOnce: true }
  )
}
