export type { ConfigResolved }

import type { ConfigBuiltIn, ConfigBuiltInResolved, ImportString } from '../Config.js'

// https://vike.dev/meta#typescript
type ConfigUnresolved = WithoutImportString<ConfigBuiltIn & Vike.Config>
type ConfigResolvedOnly = ConfigBuiltInResolved & Vike.ConfigResolved
type ConfigResolved = ConfigResolvedOnly & Omit<ConfigUnresolved, keyof ConfigResolvedOnly>

type WithoutImportString<T> = { [K in keyof T]: Exclude<T[K], ImportString> }
