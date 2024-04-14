export { getConfigDefinedAtString }
export { getDefinedAtString }

import { assert, isArray } from '../../utils.js'
import type { DefinedAtData, DefinedAtDataFile } from '../PageConfig.js'
import pc from '@brillout/picocolors'
import { getExportPath } from '../getExportPath.js'

function getConfigDefinedAtString<ConfigName extends string, SentenceBegin extends 'Config' | 'config' /*| 'Hook'*/>(
  sentenceBegin: SentenceBegin,
  configName: ConfigName,
  { definedAt }: { definedAt: DefinedAtData }
): `${SentenceBegin} ${ConfigName}${string} defined ${'internally' | `at ${string}`}` {
  const definedAtString = getDefinedAtString(definedAt, configName)
  const definedAtStr = definedAtString === 'internally' ? definedAtString : (`at ${definedAtString}` as const)
  let configNameStr: `${ConfigName}${string}` = `${configName}${/*sentenceBegin === 'Hook' ? '()' :*/ ''}`
  const configDefinedAt = `${sentenceBegin} ${pc.cyan(configNameStr)} defined ${definedAtStr}` as const
  return configDefinedAt
}
function getDefinedAtString(definedAt: DefinedAtData, configName: string): string {
  if (!definedAt) return 'internally'

  let files: DefinedAtDataFile[]
  if (isArray(definedAt)) {
    files = definedAt
  } else {
    files = [definedAt]
  }

  assert(files.length >= 1)
  const definedAtString = files
    .map((source) => {
      const { filePathToShowToUser, fileExportPathToShowToUser } = source
      let s = filePathToShowToUser
      const exportPath = getExportPath(fileExportPathToShowToUser, configName)
      if (exportPath) {
        s = `${s} > ${pc.cyan(exportPath)}`
      }
      return s
    })
    .join(' / ')
  return definedAtString
}
