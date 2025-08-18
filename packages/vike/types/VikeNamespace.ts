export type { Vike }
export type { VikePackages }

// Enable users and vike-* packages to define types, e.g.:
//  - User can set Config['Page'] over Vike.Config['Page']
//  - vike-vercel can add Config['isr'] over Vike.Config['isr']

declare global {
  /** Refine Vike types. */
  namespace Vike {
    /** Extend the `Config` type (`import type { Config } from 'vike/types'`).
     *
     *  https://vike.dev/meta#typescript
     */
    interface Config {
      _interfaceIsNotAny?: never // https://typescript-eslint.io/rules/no-empty-object-type/
    }
    /** Refine the `pageContext.config` type.
     *
     *  It's used for cumulative configs: the `pageContext.config[configName]` type is an `array` whereas `Config[configName]` isn't.
     *
     *  https://vike.dev/meta#typescript
     */
    interface ConfigResolved {
      _interfaceIsNotAny?: never // https://typescript-eslint.io/rules/no-empty-object-type/
    }

    /** Extend the `PageContext` type (`import type { PageContext } from 'vike/types'`).
     *
     *  https://vike.dev/pageContext#typescript
     */
    interface PageContext {
      _interfaceIsNotAny?: never // https://typescript-eslint.io/rules/no-empty-object-type/
    }
    /** Extend the `PageContextClient` type (`import type { PageContextClient } from 'vike/types'`).
     *
     *  https://vike.dev/pageContext#typescript
     */
    interface PageContextClient {
      _interfaceIsNotAny?: never // https://typescript-eslint.io/rules/no-empty-object-type/
    }
    /** Extend the `PageContextServer` type (`import type { PageContextServer } from 'vike/types'`).
     *
     *  https://vike.dev/pageContext#typescript
     */
    interface PageContextServer {
      _interfaceIsNotAny?: never // https://typescript-eslint.io/rules/no-empty-object-type/
    }

    /** Extend the `GlobalContext` type (`import type { GlobalContext } from 'vike/types'`).
     *
     *  https://vike.dev/globalContext#typescript
     */
    interface GlobalContext {
      _interfaceIsNotAny?: never // https://typescript-eslint.io/rules/no-empty-object-type/
    }
    /** Extend the `GlobalContextClient` type (`import type { GlobalContextClient } from 'vike/types'`).
     *
     *  https://vike.dev/globalContext#typescript
     */
    interface GlobalContextClient {
      _interfaceIsNotAny?: never // https://typescript-eslint.io/rules/no-empty-object-type/
    }
    /** Extend the `GlobalContextServer` type (`import type { GlobalContextServer } from 'vike/types'`).
     *
     *  https://vike.dev/globalContext#typescript
     */
    interface GlobalContextServer {
      _interfaceIsNotAny?: never // https://typescript-eslint.io/rules/no-empty-object-type/
    }
  }

  /** This namespace is only used by:
   *  - `vike-react`
   *  - `vike-vue`
   *  - `vike-solid`
   *  - `vike-svelte`
   *  - `vike-angular`
   *
   *  As a Vike user, you can ignore this.
   */
  namespace VikePackages {
    // Enable vike-{react/vue/solid/svelte} to extend the type `Config`.
    //  - We need a different interface for each vike-{react/vue/solid/svelte} package because of conflicts.
    //    - E.g. Config['Page'] is a React/Vue/Solid/Svelte component depending on which vike-{react/vue/solid/svelte} package is being used.
    //      - The user can be using more than one vike-{react/vue/solid/svelte} package.
    // For vike-react
    interface ConfigVikeReact {
      _interfaceIsNotAny?: never // https://typescript-eslint.io/rules/no-empty-object-type/
    }
    // For vike-vue
    interface ConfigVikeVue {
      _interfaceIsNotAny?: never // https://typescript-eslint.io/rules/no-empty-object-type/
    }
    // For vike-solid
    interface ConfigVikeSolid {
      _interfaceIsNotAny?: never // https://typescript-eslint.io/rules/no-empty-object-type/
    }
    // For vike-svelte (the vike-svelte package doesn't exist yet)
    interface ConfigVikeSvelte {
      _interfaceIsNotAny?: never // https://typescript-eslint.io/rules/no-empty-object-type/
    }
    // For vike-angular
    interface ConfigVikeAngular {
      _interfaceIsNotAny?: never // https://typescript-eslint.io/rules/no-empty-object-type/
    }
  }
}
