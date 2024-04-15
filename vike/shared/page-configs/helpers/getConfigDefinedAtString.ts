export { getConfigDefinedAtStringOptional }
export { getConfigDefinedAtString }
export { getDefinedAtString }
export type { ConfigDefinedAtStringOptional }
export type { ConfigDefinedAtString }

import { assert, isArray } from '../../utils.js'
import type { DefinedAtData, DefinedAtFile } from '../PageConfig.js'
import pc from '@brillout/picocolors'
import { getExportPath } from '../getExportPath.js'

type ConfigDefinedAtStringOptional = ConfigDefinedAtString | `Config ${string} defined internally`
type ConfigDefinedAtString = `Config ${string} defined at ${string}`

function getConfigDefinedAtString(
  sentenceBegin: 'Config',
  configName: string,
  definedAtData: DefinedAtFile | DefinedAtFile[]
): ConfigDefinedAtString {
  return `${begin(sentenceBegin, configName)} at ${getDefinedAtString(definedAtData, configName)}`
}
function getConfigDefinedAtStringOptional<
  ConfigName extends string,
  SentenceBegin extends 'Config' | 'config' /*| 'Hook'*/
>(
  sentenceBegin: SentenceBegin,
  configName: ConfigName,
  definedAtData: DefinedAtData
): `${SentenceBegin} ${ConfigName} defined ${'internally' | `at ${string}`}` {
  if (!definedAtData) {
    return `${begin(sentenceBegin, configName)} internally`
  } else {
    return `${begin(sentenceBegin, configName)} at ${getDefinedAtString(definedAtData, configName)}`
  }
}
function begin<ConfigName extends string, SentenceBegin extends string>(
  sentenceBegin: SentenceBegin,
  configName: ConfigName
) {
  return `${sentenceBegin} ${pc.cyan(configName)} defined` as const
}

function getDefinedAtString(definedAtData: DefinedAtFile | DefinedAtFile[], configName: string): string {
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
