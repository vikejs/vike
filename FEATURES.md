> :warning: This document is work-in-progress. It isn't exhaustive.

> TO-DO: add the features missing in this list.

# Features

All essentials:
 - All render modes: SSR, SPA, and HTML-templating (zero browser-side JavaScript)
   - Each page can choose a different render mode
 - Pre-rendering (AKA SSG)
   - Each page can opt in/out
 - Client-side routing
 - Data-fetching
   - Both isomorphic data fetching (to avoid a network detour over the server), and server-only data fetching (to be able to directly read the database)
 - Optimal code-splitting (each page has its own client-side bundle, while common code is extracted and shared)
 - Filesystem Routing
 - Layouts
 - Route guards
 - HTML streaming
 - Link prefetching
 - i18n
 - Base URL

I'm not aware of any framework that implements *all* these features which I consider must-haves. (For example Next.js is missing isomorphic data fetching.)

Unique vite-plugin-ssr features:
 - [Do-one-thing-do-it-well architecture](https://vite-plugin-ssr.com/architecture)
 - From a server-perspective, vite-plugin-ssr is just a middleware (a pure function)
   - Vite-plugin-ssr can be easily integrated into any deployment strategy
   - Especially important for large companies that already have a deployment architecture
 - vite-plugin-ssr allows the user to use different UI frameworks for the same app
   - For example, a vite-plugin-ssr sponsor uses vite-plugin-ssr to use Solid for all its pages except for one page that uses React because it needs a React library that doesn't exist for Solid
     - Important for Solid: for React users that are tempted to use Solid, Solid can sell the story "try Solid while being able to fallback to React, e.g. if a page needs some React library".
 - Users can build a custom [Framework-as-a-Product](https://vike.land/#framework-as-a-product). (Vike has been designed so that frameworks can be built on top of it.)
   - [Custom configs](https://vite-plugin-ssr.com/meta)
 - Low-level primites allowing users to deeply integrate with data fetching tools.
   - For example, vite-plugin-ssr sponsors use it to deeply integrate Relay. (Facebook's internal framework deeply integrates with Relay in ways that aren't possible with Next.js.)
 - URL rewriting for both [novel DX and novel UX](https://twitter.com/brillout/status/1687431520569425920) around authentication and authorization

Marketing boost of using "Vike - The Open Framework" &mdash; collaboration and openness being one of Vike's core value.

No known bugs, most notably:
 - Rock-solid HTML streaming support (hard to achieve)
 - Rock-solid client-side navigation scroll restoration (hard to achieve)
 - Rock-solid URL handling (much harder than it seems)
 - In general, things just work. No surprise of stumbling upon some bug.

Things missing that some frameworks have (but is on the roadmap):
 - Nested Layouts (TODO: update ticket with latest design)
 - Typesafe links ([#698](https://github.com/brillout/vite-plugin-ssr/issues/698))
 - Single Route File

Minor features that can be life changing for some users:
- Zero runtime dependency on Node.js
- Tauri support
- Ability to set two Base URLs: one for the static assets (CDN deployments) and another one for the SSR server.
- Low-level i18n hooks which allow to implement i18n without compromise (not a single user has reported a missing i18n use case, covering all i18n use cases is hard)
- Not only Route Guards but also Route Functions (define your route with a function for full programmatic flexibility)
- `pageContext.isBackwardsNavigation` (https://vite-plugin-ssr.com/pageContext) for backwards/forward page transition animations
- vite-plugin-ssr can be loaded twice (or more) on the server-side, (some deployement architectures need this)
- Catches and interupts infinite loops of URL redirections and URL rewrites

And lots of details:
- [Automatic frontend deployment synchronization](https://vite-plugin-ssr.com/deploy-sync)
- `93` warning messages that help the user. For example:
  - Warning is shown when a hook takes more than 4 seconds to resolve (avoiding the user to ask himself "why is my vite-plugin-ssr app hanging?")
  - Warning is shown when client runtime is included twice in the bundle
  - Warning wrongly using `process.env.NODE_ENV`, including docs: https://vite-plugin-ssr.com/NODE_ENV
- `294` helpul error messages. For example:
  - Upon a 404 in dev, the complete list of routes is shown
  - Helpful error when different versions of vite-plugin-ssr are loaded
  - Typo in an option name (with "Did you mean xxx instead?")
- Proper development error hanlding (hard to achieve, especially since Vite is bogus about it)

Misc:
- `throw Render()`
