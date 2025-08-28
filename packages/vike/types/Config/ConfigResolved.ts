export type { ConfigResolved }

import type { VikePackages } from '../VikeNamespace.js'
import type { ConfigBuiltIn, ConfigBuiltInResolved, ImportString } from '../Config.js'
import type { Combine, IsNotEmpty, XOR5 } from './helpers.js'

// https://vike.dev/meta#typescript
type ConfigUnresolved = WithoutImportString<ConfigBuiltIn & Vike.Config>
type ConfigResolvedOnly = ConfigBuiltInResolved & Vike.ConfigResolved
type ConfigResolved = ConfigResolvedOnly & Omit<ConfigUnresolved, keyof ConfigResolvedOnly> & ConfigResolvedPackages

// TODO/now: remove the whole XOR logic
type ConfigResolvedPackages = ConfigVikePackagesNotEmptyXor extends true
  ? ConfigVikePackagesIntersection
  : ConfigVikePackagesCombined

// Preserves JSDocs, such as the the JSDoc pageContext.config.title defined by vike-react
type ConfigVikePackagesIntersection = VikePackages.ConfigVikeReact &
  VikePackages.ConfigVikeVue &
  VikePackages.ConfigVikeSolid &
  VikePackages.ConfigVikeSvelte &
  VikePackages.ConfigVikeAngular
// Loses JSDocs, such as the the JSDoc pageContext.config.title defined by vike-react
type ConfigVikePackagesCombined = Combine<
  VikePackages.ConfigVikeReact,
  Combine<
    VikePackages.ConfigVikeVue,
    Combine<VikePackages.ConfigVikeSolid, Combine<VikePackages.ConfigVikeSvelte, VikePackages.ConfigVikeAngular>>
  >
>

type ConfigVikePackagesNotEmptyXor = XOR5<
  IsNotEmpty<VikePackages.ConfigVikeReact>,
  IsNotEmpty<VikePackages.ConfigVikeVue>,
  IsNotEmpty<VikePackages.ConfigVikeSolid>,
  IsNotEmpty<VikePackages.ConfigVikeSvelte>,
  IsNotEmpty<VikePackages.ConfigVikeAngular>
>

type WithoutImportString<T> = { [K in keyof T]: Exclude<T[K], ImportString> }
