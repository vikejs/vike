> :warning: This document is work-in-progress. It isn't exhaustive.

## Essentials

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


## Architecture

- From a server-perspective, Vike is just a middleware (a pure function)
  - Vike can be easily integrated into any deployment strategy
- Low-level primitives allowing users to deeply integrate with data fetching tools.
  - For example, Vike sponsors use it to deeply integrate Relay. (Facebook's internal framework deeply integrates with Relay in ways that aren't possible with Next.js.)


## Features

Build fast.
- First-class SPA/SSR/SSG
  - `+ssr` => disable/enable page-by-page
  - `+prerender` => disable/enable page-by-page
     - [Not the case with Next.js: https://x.com/leerob/status/1969256190241640946]
  - `+prerender.redirects` => SSG redirects
  - [wip] SPA fallback => pre-render dynamic routes
  - `+data.client.js` => Client-side only data-fetching
  - [Example]: you can easily create a 100% client-side SPA like the old days
  - `react-streaming` => progressive rendering (aka partial hydration)
  - [Better than Remix] https://github.com/vikejs/vike-react/issues/105#issuecomment-2061601329
- Telefunc (much simpler than anything else)
- File-based server/client separation => ✅ Never mixed server/client code inside same file
  - [wip] IDE extension to show you the environment of each file.
- Out-of-the-box state management support with Vike extensions.
  [TO-DO/eventually] Compare with:
  - https://redux.js.org/usage/nextjs
  - https://zustand.docs.pmnd.rs/guides/nextjs
- Powerful hooks
  - +onCreateGlobalContext
  - +onCreatePageContext
  - +onHookCall
- [wip] Typesafe routes
- [wip] AI
  - Simple approach: add Vike's docs to the LLMs's context => completely solves the "AI generates outdated code" problem
  - `llm-{small,medium,full}.txt` => accommodates diverse foundational AI models & tools
- Bati
  - [Tanner got a lot of applause for TanStack's Bati-like feature]

Build right.
- Compasable framework
  - Vike's architecture: core stable & robust core + powerful extensions
  - GraphQL
  - Adopt the future
    - Web + Mobile => needs innovation +++
    - RPC/ => needs innovation ++
    - UI reactivity & state management (e.g. signals) => needs innovation +
    - [Example] Remix is creating a big monolith framework (they're innovating with their React alternative which is great, but a bit sad that it's tightly coupled with Remix => talk about why it's sad and why it's important to decouple)
  - No architectural breaking change => pick Vike extension you want (e.g. vike-react-rsc)
    - [Example] Next.js' `app/` vs `pages/` => britle architecture
  - Hackable
    - Photon/
      [cyco130/knave]() => client-side routing
  - Beginner friendly

Open Source Pricing
- [One of my favorite feature — Yes, it's a feature, not a bug]
- Premium support => we reply every GitHub issue/disucssion
- Bugs quickly fixed (usually under 24h)
- Goal: ~~most popular?~~ ✅ Best framework
- [Our passion: solve your issues, build a premium framework, and for that we need to capture some fraction of the value we create]


## Features [TO-DO/eventually: organize]

Unique Vike features:
 - URL rewriting for both [novel DX and novel UX](https://twitter.com/brillout/status/1687431520569425920) around authentication and authorization
 - Domain-driven file structure

Details:
- [Automatic frontend deployment synchronization](https://vike.dev/deploy-sync)
- `93` warnings && `294` helpful error messages
  - [Example] Warning is shown when a hook takes more than 4 seconds to resolve (avoiding the user to ask himself "why is my Vike app hanging?")
  - [Example] Typo in option name (with "Did you mean xxx instead?")
- User can use `history.pushState()`: Vike's router detects that and gets out of the user's way
- React component stack injected in stack trace
- pageContext.dangerouslyUseInternals
  - https://vike.dev/warning/internals
  - Explain why + give example => Vike's philosophy to treat blockers as high prio and minimize them as much as possible
- Infinite loop guards, e.g. for infinite redirections
- Part of Vite's CI

Misc:
- `throw render()`
- Route Functions, powerful route globing
- Text fragments https://github.com/vikejs/vike/issues/2114
- CSP nonce
  - PCI DSS compliance
- ISR

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


## Features [TO-DO/eventually: implement]

Things missing that some frameworks have (but is on the roadmap):
 - Nested Layouts
 - Typesafe links ([#698](https://github.com/vikejs/vike/issues/698))


## Marketing

- Users can build a custom [Framework-as-a-Product](https://land.vike.dev/#framework-as-a-product). (Vike has been designed so that frameworks can be built on top of it.)
- [+meta](https://vike.dev/meta)
- Collaboration and openness are core values.
- 5 years of relentless hard work
- Emphasis no known bugs?
  - Rock-solid HTML streaming support (hard to achieve)
  - Rock-solid client-side navigation scroll restoration (hard to achieve)
  - Rock-solid URL handling (much harder than it seems)
  - In general, things just work. No surprise of stumbling upon some bug.

## Used by
- https://formatjs.github.io/  
  https://github.com/formatjs/formatjs/blob/e8f3770799e54aeedf11d93cecffcc808121fc5c/package.json#L144
