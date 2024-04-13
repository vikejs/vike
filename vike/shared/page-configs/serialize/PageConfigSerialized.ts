export type { PageConfigRuntimeSerialized }
export type { PageConfigGlobalRuntimeSerialized }
export type { ConfigValueSerialized }
export type { ConfigValueImported }

import type {
  ConfigValue,
  ConfigValueClassic,
  ConfigValueComputed,
  ConfigValueCumulative,
  PageConfigRuntime
} from '../PageConfig.js'

/** Page config data structure serialized in virtual files: parsing it results in PageConfigRuntime */
type PageConfigRuntimeSerialized = Omit<PageConfigRuntime, 'configValues'> & {
  /** Config values that are serializable and loaded eagerly such as config.passToClient */
  configValuesSerialized: Record<string, ConfigValueSerialized>
  /** Config values imported eagerly such as config.route */
  configValuesImported: ConfigValueImported[]
}

type PageConfigGlobalRuntimeSerialized = {
  configValuesImported: ConfigValueImported[]
}

/** Value is serialized */
type ConfigValueSerialized =
  | (Omit<ConfigValueClassic, 'value'> & { valueSerialized: string })
  | (Omit<ConfigValueCumulative, 'value'> & { valueSerialized: string })
  | (Omit<ConfigValueComputed, 'value'> & { valueSerialized: string })
/* We don't use this because it loses union logic.
type ConfigValueSerialized = Omit<ConfigValue, 'value'> & { valueSerialized: string }
*/

/** Value is imported */
type ConfigValueImported = {
  configName: string
  // See down below for what `importPath` values can be.
  importPath: string
} & (
  | {
      // `importPath` is /path/to/+{configName}.js
      isValueFile: true
      exportValues: Record<string, unknown>
    }
  | {
      // `importPath` comes from `import { something } from '${importPath}'` in a +config.js file
      isValueFile: false
      // import { something } from '${importPath}'
      // -> exportName === 'something' (the variable name "something")
      // -> exportValue === something (the value of `something`)
      exportName: string
      exportValue: unknown
    }
)
