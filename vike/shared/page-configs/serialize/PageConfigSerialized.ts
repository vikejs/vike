export type { PageConfigRuntimeSerialized }
export type { ConfigValueSerialized }
export type { PageConfigGlobalRuntimeSerialized }

import type { ConfigValueImported, DefinedAt, PageConfigRuntime } from '../PageConfig.js'

/** page config data structure serialized in virtual files: parsing it results in PageConfigRuntime */
type PageConfigRuntimeSerialized = Omit<PageConfigRuntime, 'configValues'> & {
  /** Config values that are loaded eagerly and serializable such as config.passToClient */
  configValuesSerialized: Record<string, ConfigValueSerialized>
  /** Config values imported eagerly such as config.route */
  configValuesImported: ConfigValueImported[]
}

type ConfigValueSerialized = {
  valueSerialized: string
  definedAt: DefinedAt
}
type PageConfigGlobalRuntimeSerialized = {
  configValuesImported: ConfigValueImported[]
}
