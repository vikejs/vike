export type { Vike }
export type { VikePackages }

// Enable users and vike-* packages to define types, e.g.:
//  - User can set Config['Page'] over Vike.Config['Page']
//  - vike-vercel can add Config['isr'] over Vike.Config['isr']

declare global {
  /** Refine Vike types. */
  namespace Vike {
    /** Extend and/or refine the `Config` type (`import type { Config } from 'vike/types'`).
     *
     *  For example:
     *  - You can refine the type of `Config['Page']`.
     *  - You can define the type of custom configurations created with `config.meta` (https://vike.dev/meta)
     *
     */
    interface Config {}

    /** Extend and/or refine the `PageContext` type (`import type { PageContext } from 'vike/types'`).
     *
     *  For example:
     *  - You can define the type of fetched data, e.g. `PageContext['movies']`.
     *  - You can refine the type of `PageContext['Page']`.
     *
     */
    interface PageContext {
      data: Data
    }

    /** Extend and/or refine the `Data` type (`import type { Data } from 'vike/types'`). LA_TODO
     *
     *  This type describes the data fetched by your `data` hooks (https://vike.dev/data) LA_TODO
     *
     */
    interface Data {}
  }

  /** This namespace is only used by:
   *  - `vike-react`
   *  - `vike-vue`
   *  - `vike-solid`
   *  - `vike-svelte`
   *
   *  As a Vike user, you can ignore this.
   */
  namespace VikePackages {
    // Enable vike-{react/vue/solid/svelte} to extend the type `Config`.
    //  - We need a different interface for each vike-{react/vue/solid/svelte} package because of conflicts.
    //    - E.g. Config['Page'] is a React/Vue/Solid/Svelte component depending on which vike-{react/vue/solid/svelte} package is being used.
    //      - The user can be using more than one vike-{react/vue/solid/svelte} package.
    interface ConfigVikeReact {} // For vike-react
    interface ConfigVikeVue {} // For vike-vue
    interface ConfigVikeSolid {} // For vike-solid
    interface ConfigVikeSvelte {} // For vike-svelte (the vike-svelte package doesn't exist yet)
  }
}
