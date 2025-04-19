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
    interface Config {}
    /** Refine the `pageContext.config` type.
     *
     *  It's used for cumulative configs: the `pageContext.config[configName]` type is an `array` whereas `Config[configName]` isn't.
     *
     *  https://vike.dev/meta#typescript
     */
    interface ConfigResolved {}

    /** Extend the `PageContext` type (`import type { PageContext } from 'vike/types'`).
     *
     *  https://vike.dev/pageContext#typescript
     */
    interface PageContext {}
    /** Extend the `PageContextClient` type (`import type { PageContextClient } from 'vike/types'`).
     *
     *  https://vike.dev/pageContext#typescript
     */
    interface PageContextClient {}
    /** Extend the `PageContextServer` type (`import type { PageContextServer } from 'vike/types'`).
     *
     *  https://vike.dev/pageContext#typescript
     */
    interface PageContextServer {}

    /** Extend the `GlobalContext` type (`import type { GlobalContext } from 'vike/types'`).
     *
     *  https://vike.dev/globalContext#typescript
     */
    interface GlobalContext {}
    /** Extend the `GlobalContextClient` type (`import type { GlobalContextClient } from 'vike/types'`).
     *
     *  https://vike.dev/globalContext#typescript
     */
    interface GlobalContextClient {}
    /** Extend the `GlobalContextServer` type (`import type { GlobalContextServer } from 'vike/types'`).
     *
     *  https://vike.dev/globalContext#typescript
     */
    interface GlobalContextServer {}
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
    interface ConfigVikeReact {} // For vike-react
    interface ConfigVikeVue {} // For vike-vue
    interface ConfigVikeSolid {} // For vike-solid
    interface ConfigVikeSvelte {} // For vike-svelte (the vike-svelte package doesn't exist yet)
    interface ConfigVikeAngular {} // For vike-angular
  }
}
