export type { PageConfigRuntimeSerialized }
export type { PageConfigGlobalRuntimeSerialized }
export type { ConfigValueSerialized }
export type { ConfigValueImported }

import type { DefinedAt, PageConfigRuntime } from '../PageConfig.js'

/** page config data structure serialized in virtual files: parsing it results in PageConfigRuntime */
type PageConfigRuntimeSerialized = Omit<PageConfigRuntime, 'configValues'> & {
  /** Config values that are loaded eagerly and serializable such as config.passToClient */
  configValuesSerialized: Record<string, ConfigValueSerialized>
  /** Config values imported eagerly such as config.route */
  configValuesImported: ConfigValueImported[]
}

type PageConfigGlobalRuntimeSerialized = {
  configValuesImported: ConfigValueImported[]
}

/** Value is serialized. */
type ConfigValueSerialized = {
  valueSerialized: string
  definedAt: DefinedAt
}
/** Value is imported. */
type ConfigValueImported = {
  configName: string
  // TODO: rename?
  importPath: string
} & (
  | {
      isValueFile: true // importPath is a +{configName}.js file
      // TODO: rename?
      importFileExports: Record<string, unknown>
    }
  | {
      isValueFile: false // importPath is imported by a +config.js file
      // TODO: rename?
      // import { something } from './importPathRelative.js'
      // -> exportName === 'something'
      // -> importFileExportValue holds the value of `something`
      exportName: string
      importFileExportValue: unknown
    }
)
