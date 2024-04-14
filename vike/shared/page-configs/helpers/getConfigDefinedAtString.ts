export { getConfigDefinedAtString }
export { getDefinedAtString }

import { assert, isArray } from '../../utils.js'
import type { DefinedAtData, DefinedAtFile } from '../PageConfig.js'
import pc from '@brillout/picocolors'
import { getExportPath } from '../getExportPath.js'

function getConfigDefinedAtString<ConfigName extends string, SentenceBegin extends 'Config' | 'config' /*| 'Hook'*/>(
  sentenceBegin: SentenceBegin,
  configName: ConfigName,
  definedAtData: DefinedAtData
): `${SentenceBegin} ${ConfigName}${string} defined ${'internally' | `at ${string}`}` {
  const definedAtString = getDefinedAtString(definedAtData, configName)
  const definedAtStr = definedAtString === 'internally' ? definedAtString : (`at ${definedAtString}` as const)
  let configNameStr: `${ConfigName}${string}` = `${configName}${/*sentenceBegin === 'Hook' ? '()' :*/ ''}`
  const configDefinedAtString = `${sentenceBegin} ${pc.cyan(configNameStr)} defined ${definedAtStr}` as const
  return configDefinedAtString
}
function getDefinedAtString(definedAtData: DefinedAtData, configName: string): string {
  if (!definedAtData) return 'internally'

  let files: DefinedAtFile[]
  if (isArray(definedAtData)) {
    files = definedAtData
  } else {
    files = [definedAtData]
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
