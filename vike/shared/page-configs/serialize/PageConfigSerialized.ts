export type { PageConfigRuntimeSerialized }
export type { PageConfigGlobalRuntimeSerialized }
export type { ConfigValueSerialized }
export type { ValueSerialized }

import type {
  ConfigValueStandard,
  ConfigValueComputed,
  ConfigValueCumulative,
  PageConfigCommon,
  PageConfigRuntime
} from '../PageConfig.js'

/** Page config data structure serialized in virtual files: parsing it results in PageConfigRuntime */
type PageConfigRuntimeSerialized = PageConfigCommon & {
  /** Config values that are serializable and loaded eagerly such as config.passToClient */
  configValuesSerialized: Record<string, ConfigValueSerialized>
  loadConfigLazy: PageConfigRuntime['loadConfigLazy']
}

type PageConfigGlobalRuntimeSerialized = {
  configValuesSerialized: Record<string, ConfigValueSerialized>
}

type ValueSerialized =
  | {
      type: 'js-serialized'
      value: unknown
    }
  | {
      type: 'plus-file'
      exportValues: Record<string, unknown>
    }
  | {
      type: 'pointer-import'
      value: unknown
    }

/** Value is serialized */
type ConfigValueSerialized =
  | (Omit<ConfigValueStandard, 'value'> & { valueSerialized: ValueSerialized })
  | (Omit<ConfigValueCumulative, 'value'> & { valueSerialized: ValueSerialized[] })
  | (Omit<ConfigValueComputed, 'value'> & { valueSerialized: ValueSerialized })
