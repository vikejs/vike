> :warning: This document is work-in-progress. It isn't exhaustive.

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

Unique Vike features:
 - [Do-one-thing-do-it-well architecture](https://vike.dev/architecture)
 - From a server-perspective, Vike is just a middleware (a pure function)
   - Vike can be easily integrated into any deployment strategy
   - Especially important for large companies that already have a deployment architecture
 - Vike allows the user to use different UI frameworks for the same app
   - For example, a Vike sponsor uses Vike to use Solid for all its pages except for one page that uses React because it needs a React library that doesn't exist for Solid
     - Important for Solid: for React users that are tempted to use Solid, Solid can sell the story "try Solid while being able to fall back to React, e.g. if a page needs some React library".
 - Users can build a custom [Framework-as-a-Product](https://land.vike.dev/#framework-as-a-product). (Vike has been designed so that frameworks can be built on top of it.)
   - [Custom configs](https://vike.dev/meta)
 - Low-level primitives allowing users to deeply integrate with data fetching tools.
   - For example, Vike sponsors use it to deeply integrate Relay. (Facebook's internal framework deeply integrates with Relay in ways that aren't possible with Next.js.)
 - URL rewriting for both [novel DX and novel UX](https://twitter.com/brillout/status/1687431520569425920) around authentication and authorization
 - Domain-driven file structure

Marketing boost of using "Vike - The Open Framework" &mdash; collaboration and openness being one of Vike's core value.

No known bugs, most notably:
 - Rock-solid HTML streaming support (hard to achieve)
 - Rock-solid client-side navigation scroll restoration (hard to achieve)
 - Rock-solid URL handling (much harder than it seems)
 - In general, things just work. No surprise of stumbling upon some bug.

Things missing that some frameworks have (but is on the roadmap):
 - Nested Layouts
 - Typesafe links ([#698](https://github.com/vikejs/vike/issues/698))
 - Single Route File

Minor features that can be life changing for some users:
- Zero runtime dependency on Node.js
- Tauri support
- Ability to set two Base URLs: one for the static assets (CDN deployments) and another one for the SSR server.
- Low-level i18n hooks which allow to implement i18n without compromise (not a single user has reported a missing i18n use case, covering all i18n use cases is hard)
- Not only Route Guards but also Route Functions (define your route with a function for full programmatic flexibility)
- `pageContext.isBackwardsNavigation` (https://vike.dev/pageContext) for backwards/forward page transition animations
- Vike can be loaded twice (or more) on the server-side, (some deployment architectures need this)
- Catches and interrupts infinite loops of URL redirections and URL rewrites
- Supports [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy).

And lots of details:
- [Automatic frontend deployment synchronization](https://vike.dev/deploy-sync)
- `93` warning messages that help the user. For example:
  - Warning is shown when a hook takes more than 4 seconds to resolve (avoiding the user to ask himself "why is my Vike app hanging?")
  - Warning is shown when client runtime is included twice in the bundle
  - Warning wrongly using `process.env.NODE_ENV`, including docs: https://vike.dev/NODE_ENV
- `294` helpful error messages. For example:
  - Upon a 404 in dev, the complete list of routes is shown
  - Helpful error when different versions of Vike are loaded
  - Typo in an option name (with "Did you mean xxx instead?")
- Proper development error handling (hard to achieve, especially since Vite is bogus about it)
- User can use `history.pushState()`: Vike's router detects that and gets out of the user's way

Misc:
- `throw render()`
- Powerful Routing (Route Functions, powerful globing)
- First-class SSG support
  - https://github.com/vikejs/vike-react/issues/105#issuecomment-2061601329
- Text fragments https://github.com/vikejs/vike/issues/2114
- Infinite loop guards, e.g. for infinite redirections
- "Open Internals" (e.g. `pageContext._*`)
- Out-of-the-box state management support with Vike extensions
  - Compare with:
    - https://redux.js.org/usage/nextjs
    - https://zustand.docs.pmnd.rs/guides/nextjs
- @brillout/test-e2e => endcheck

First-class SSG support
- +prerender.partial
- +prerender.redirects
