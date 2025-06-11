export { getConfigDefinedAt }
export { getConfigDefinedAtOptional }
export { getDefinedAtString }
export { getDefinedByString }
export type { ConfigDefinedAt }
export type { ConfigDefinedAtOptional }

import { assert, checkType, isArray } from '../utils.js'
import type { DefinedAt, DefinedAtData, DefinedBy } from '../../types/PageConfig.js'
import pc from '@brillout/picocolors'
import { getExportPath } from './getExportPath.js'

type ConfigDefinedAtOptional = ConfigDefinedAt | `Config ${string} defined internally`
type ConfigDefinedAt = `Config ${string} defined at ${string}`

function getConfigDefinedAt<SentenceBegin extends 'Config' | 'config' /*| 'Hook'*/, ConfigName extends string>(
  sentenceBegin: SentenceBegin,
  configName: ConfigName,
  definedAtData: NonNullable<DefinedAtData>,
): `${SentenceBegin} ${ConfigName} defined at ${string}` {
  return `${begin(sentenceBegin, configName)} at ${getDefinedAtString(definedAtData, configName)}`
}
function getConfigDefinedAtOptional<SentenceBegin extends 'Config' | 'config' /*| 'Hook'*/, ConfigName extends string>(
  sentenceBegin: SentenceBegin,
  configName: ConfigName,
  definedAtData: DefinedAtData,
): `${SentenceBegin} ${ConfigName} defined ${'internally' | `at ${string}`}` {
  if (!definedAtData) {
    return `${begin(sentenceBegin, configName)} internally`
  } else {
    return `${begin(sentenceBegin, configName)} at ${getDefinedAtString(definedAtData, configName)}`
  }
}
function begin<ConfigName extends string, SentenceBegin extends string>(
  sentenceBegin: SentenceBegin,
  configName: ConfigName,
) {
  return `${sentenceBegin} ${pc.cyan(configName)} defined` as const
}

function getDefinedAtString(definedAtData: NonNullable<DefinedAtData>, configName: string): string {
  let files: DefinedAt[]
  if (isArray(definedAtData)) {
    files = definedAtData
  } else {
    files = [definedAtData]
  }
  assert(files.length >= 1)
  const definedAtString = files
    .map((definedAt) => {
      if (definedAt.definedBy) return getDefinedByString(definedAt, configName)
      const { filePathToShowToUser, fileExportPathToShowToUser } = definedAt
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

function getDefinedByString(definedAt: DefinedBy, configName: string) {
  if (definedAt.definedBy === 'api') {
    return `API call ${pc.cyan(`${definedAt.operation as string}({ vikeConfig: { ${configName} } })`)}` as const
  }
  const { definedBy } = definedAt
  if (definedBy === 'cli') {
    return `CLI option ${pc.cyan(`--${configName}`)}` as const
  }
  if (definedBy === 'env') {
    return `environment variable ${pc.cyan(`VIKE_CONFIG="{${configName}}"`)}` as const
  }
  checkType<never>(definedBy)
  assert(false)
}
