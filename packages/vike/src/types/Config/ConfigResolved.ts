export type { ConfigResolved }

import type { ConfigBuiltIn, ConfigBuiltInResolved } from '../Config.js'
import type { ImportStringList } from '../../node/vite/shared/importString.js'

// https://vike.dev/meta#typescript
type ConfigUnresolved = WithoutImportString<ConfigBuiltIn & Vike.Config>
type ConfigResolvedOnly = ConfigBuiltInResolved & Vike.ConfigResolved
type ConfigResolved = ConfigResolvedOnly & Omit<ConfigUnresolved, keyof ConfigResolvedOnly>

type WithoutImportString<T> = { [K in keyof T]: Exclude<T[K], ImportStringList> }
