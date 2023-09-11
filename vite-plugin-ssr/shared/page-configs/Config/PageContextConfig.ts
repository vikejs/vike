export type { PageContextConfig }

import type { ConfigBuiltIn, ConfigVikeReact, ConfigVikeSolid, ConfigVikeSvelte, ConfigVikeVue } from '../Config.js'
import type { Combine, IsNotEmpty, XOR4 } from './helpers.d.ts'

// Like the type `Config` but meant for pageContext.config
type PageContextConfig = ConfigBuiltIn &
  (ConfigVikePackagesNotEmptyXor extends true ? ConfigVikePackagesIntersection : ConfigVikePackagesCombined)

// Preserves JSDocs, such as the the JSDoc pageContext.config.title defined by vike-react
type ConfigVikePackagesIntersection = ConfigVikeReact & ConfigVikeVue & ConfigVikeSolid & ConfigVikeSvelte
// Loses JSDocs, such as the the JSDoc pageContext.config.title defined by vike-react
type ConfigVikePackagesCombined = Combine<
  ConfigVikeReact,
  Combine<ConfigVikeVue, Combine<ConfigVikeSolid, ConfigVikeSvelte>>
>

type ConfigVikePackagesNotEmptyXor = XOR4<
  IsNotEmpty<ConfigVikeReact>,
  IsNotEmpty<ConfigVikeVue>,
  IsNotEmpty<ConfigVikeSolid>,
  IsNotEmpty<ConfigVikeSvelte>
>
