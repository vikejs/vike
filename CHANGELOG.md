# [0.1.0-beta.50](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.49...v0.1.0-beta.50) (2021-06-02)


### Bug Fixes

* define ESM build in tsconfig.ts instead of CLI (vitejs/vite[#3617](https://github.com/brillout/vite-plugin-ssr/issues/3617), fix [#85](https://github.com/brillout/vite-plugin-ssr/issues/85)) ([4fdbf91](https://github.com/brillout/vite-plugin-ssr/commit/4fdbf91e9c59f91ca8111dd88b6df7a3c664d0c2))


### Reverts

* Revert "boilerplate: pin vite@2.3.4" ([8940d8b](https://github.com/brillout/vite-plugin-ssr/commit/8940d8bdcc14c1787f6a31801224a11c9d627be8))



# [0.1.0-beta.49](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.48...v0.1.0-beta.49) (2021-06-02)

### Bug Fixes

*  dual publish CJS + ESM (vitejs/vite#3617, fix #85)



# [0.1.0-beta.48](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.47...v0.1.0-beta.48) (2021-05-30)


* rename `dangerouslySetHtml` to `dangerouslySkipEscape` (fix #84) ([b14bd17](https://github.com/brillout/vite-plugin-ssr/commit/b14bd17b0177a0b2bedb74f143677cad7521d365)), closes [#84](https://github.com/brillout/vite-plugin-ssr/issues/84)


### Bug Fixes

* export SsrEnv as type ([8c8f5ba](https://github.com/brillout/vite-plugin-ssr/commit/8c8f5ba800cb45f951031a0a5ce2546a5fdc9a68))


### BREAKING CHANGES

* Replace `dangerouslySetHtml` with
`dangerouslySkipEscape`. E.g. for linux users:
`git ls-files | xargs sed -i "s/dangerouslySetHtml/dangerouslySkipEscape/g"`



# [0.1.0-beta.47](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.46...v0.1.0-beta.47) (2021-05-29)

### Features

*  make `*.page.js` exports available to user as `pageContext.pageExports` (fix [#80](https://github.com/brillout/vite-plugin-ssr/issues/80))



# [0.1.0-beta.46](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.45...v0.1.0-beta.46) (2021-05-28)

* define everything on `pageContext` (fix #76) ([15d68f8](https://github.com/brillout/vite-plugin-ssr/commit/15d68f8bd6133b1c5e8916fa5c2aaad8cf5f4579)), closes [#76](https://github.com/brillout/vite-plugin-ssr/issues/76)

### BREAKING CHANGES

* Apply following changes:

```diff
  // *.page.server.js

  export { render }
- function render({ Page, pageContext }) {
+ function render(pageContext) {
+   const { Page } = pageContext
    /* ... */
  }

  export { addPageContext }
- function addPageContext({ Page, pageContext }) {
+ function addPageContext(pageContext) {
+   const { Page } = pageContext
    /* ... */
  }
```

```diff
  // *.page.client.js

  import { getPage } from "vite-plugin-ssr/client";

- const { Page, pageContext } = await getPage();
+ const pageContext = await getPage();
+ const { Page } = pageContext
```

```diff
  // *.page.client.js

  import { useClientRouter } from 'vite-plugin-ssr/client/router'

  useClientRouter({
-   render({ Page, pageContext, isHydration }) {
+   render(pageContext) {
+     const { Page, isHydration } = pageContext
      /* ... */
    },
  })
```

```diff
  // At your server integration point

  const express = require('express')
  const { createPageRender } = require('vite-plugin-ssr')

  /* ... */

  const pageRender = createPageRender(/*...*/)

  /* ... */

- pageRender({ url, pageContext })
+ pageContext.url = url
+ pageRender(pageContext)
```

- `pageContext.urlFull` is deprecated; use `pageContext.urlNormalized`
instead.



# [0.1.0-beta.45](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.44...v0.1.0-beta.45) (2021-05-26)


### Bug Fixes

* reload glob imports in dev ([#66](https://github.com/brillout/vite-plugin-ssr/issues/66)) ([09b54c0](https://github.com/brillout/vite-plugin-ssr/commit/09b54c0dfd988f42d8237450a2f57e0f4d6abf1a))
* Route Functions should return `routeParams` instead of `contextProps` (fix [#63](https://github.com/brillout/vite-plugin-ssr/issues/63)) ([e03b918](https://github.com/brillout/vite-plugin-ssr/commit/e03b9185917f94c4b826a83cb0eafb8a6b98bd93))


### Features

* always route on the server-side (fix [#73](https://github.com/brillout/vite-plugin-ssr/issues/73)) ([ef3eb3c](https://github.com/brillout/vite-plugin-ssr/commit/ef3eb3ce56ded30d2cffdf86f06096e6fd1529ad))
* rename `contextProps` to `pageContext`, and `addContextProps` to `addPageContext` (fix #58) ([aedf9fc](https://github.com/brillout/vite-plugin-ssr/commit/aedf9fc516cc72b3d06128dedd900994a8457767)), closes [#58](https://github.com/brillout/vite-plugin-ssr/issues/58)


### BREAKING CHANGES

- Replace all occurences in your source code of `addContextProps` to
  `addPageContext`, and all occurences of `contextProps` to `pageContext`.
  There is no need for semantic replacing: you can simply replace
  text, for example with a linux terminal:
   1. `git ls-files | xargs sed -i "s/addContextProps/addPageContext/g"`
   2. `git ls-files | xargs sed -i "s/contextProps/pageContext/g"`
- Make your Route Functions return
  `{ match: true, routeParams: {/*...*/} }` instead of
  `{ match: true, pageContext: {/*...*/} }` (or
  `{ match: true, contextProps: {/*...*/} }` if you didn't
  rename `contextProps` to `pageContext` yet).



# [0.1.0-beta.44](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.43...v0.1.0-beta.44) (2021-05-20)


### Bug Fixes

* Add mime types to preload tags, add common image preload tags ([29a3b96](https://github.com/brillout/vite-plugin-ssr/commit/29a3b960e3a852d79fed4456503f5a9be0f4fc9b))



# [0.1.0-beta.43](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.42...v0.1.0-beta.43) (2021-05-18)


### Bug Fixes

* use `visibilitychange` event instead of `unload` event ([b2cc36e](https://github.com/brillout/vite-plugin-ssr/commit/b2cc36e1091ef0fec25592d59b31e84f7ae36a68))


### Features

* implement `<a keep-scroll-position />` and `navigate(url, { keepScrollPosition: true })` ([#62](https://github.com/brillout/vite-plugin-ssr/issues/62)) ([6a8515a](https://github.com/brillout/vite-plugin-ssr/commit/6a8515aaf18e65957ada68709d25bc348bc09a0c))



# [0.1.0-beta.42](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.41...v0.1.0-beta.42) (2021-05-14)


### Bug Fixes

* write pre-render files sequentially (fix [#59](https://github.com/brillout/vite-plugin-ssr/issues/59)) ([2339746](https://github.com/brillout/vite-plugin-ssr/commit/2339746c493278a3abcf131429ec44bc8d555c28))



# [0.1.0-beta.41](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.40...v0.1.0-beta.41) (2021-05-14)


### Bug Fixes

* on static hosts, fallback to Server-side Routing for 404 pages ([#57](https://github.com/brillout/vite-plugin-ssr/issues/57)) ([56e0d0a](https://github.com/brillout/vite-plugin-ssr/commit/56e0d0a47f2ad14708073c0c467d0db1b5d19177))


### Features

* also generate `dist/client/404.html` when pre-rendering (fix [#57](https://github.com/brillout/vite-plugin-ssr/issues/57)) ([d6072f2](https://github.com/brillout/vite-plugin-ssr/commit/d6072f2f93723f60df02fc4f2dc6e1edf5ad7bcf))



# [0.1.0-beta.40](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.38...v0.1.0-beta.40) (2021-05-05)


### Bug Fixes

* add empty .npmignore to ensure dist/ is always published ([c241c53](https://github.com/brillout/vite-plugin-ssr/commit/c241c5311f8950f78f84d6de861fafda9b2c22c0))



# [0.1.0-beta.38](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.37...v0.1.0-beta.38) (2021-05-05)


### Bug Fixes

* make sure Node.js doesn't try to use browser entry points (fix [#55](https://github.com/brillout/vite-plugin-ssr/issues/55)) ([4e9c14b](https://github.com/brillout/vite-plugin-ssr/commit/4e9c14b813973dca778f29bb08627def6a006a77))



# [0.1.0-beta.37](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.36...v0.1.0-beta.37) (2021-05-04)


* make route parameters available only at `contextProps.routeParams` ([f98f94b](https://github.com/brillout/vite-plugin-ssr/commit/f98f94b072921d9c0325afe57e24e7862e7e27bc))


### BREAKING CHANGES

* Route parameters are not available directly at `contextProps`
anymore. E.g. use `contextProps.routeParams.movieId` instead of
`contextProps.movieId` (for a route string `/movie/:movieId`).



# [0.1.0-beta.36](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.35...v0.1.0-beta.36) (2021-05-01)


### Bug Fixes

* also check windows path for `usesClientRouter` test ([b3c1cab](https://github.com/brillout/vite-plugin-ssr/commit/b3c1cabdf72d916a08830ebb8db6243e5fd285b9))
* do not assume .page.js files to always be the root in the manifest (fix [#51](https://github.com/brillout/vite-plugin-ssr/issues/51)) ([138a3f7](https://github.com/brillout/vite-plugin-ssr/commit/138a3f731a29369099407af77fecebfd76691af8))
* fix preload tags paths when building on windows ([9c2fd40](https://github.com/brillout/vite-plugin-ssr/commit/9c2fd40608f0ad0798da573afcb948561652b246))



# [0.1.0-beta.35](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.34...v0.1.0-beta.35) (2021-04-26)


### Bug Fixes

* `vite-fix-2390` is not required anymore (& bump Vite dependency) ([36fade0](https://github.com/brillout/vite-plugin-ssr/commit/36fade02f6dd535513013b95cf2a563502c1af94))
* do not reload page when user only changes the URL hash ([dbb6f9a](https://github.com/brillout/vite-plugin-ssr/commit/dbb6f9a092181a6ae8256b24ee1082e8c61ffb65))
* do not use new URL for extracting URL search and URL hash (fix [#47](https://github.com/brillout/vite-plugin-ssr/issues/47)) ([4f3d737](https://github.com/brillout/vite-plugin-ssr/commit/4f3d737bc0bfc2edf54c744302f84fdca9367b72))
* throttle `scroll` event listener (fix [#46](https://github.com/brillout/vite-plugin-ssr/issues/46)) ([c58d1ff](https://github.com/brillout/vite-plugin-ssr/commit/c58d1fff680fd2658ed533570faaf71afe867bcf))
* use browser scroll restore for first page load ([b6f701b](https://github.com/brillout/vite-plugin-ssr/commit/b6f701bce234d8dc789555f4261d2198c1f9cd2f))


### Features

* allow Route Functions to return a boolean and make returning `match` optional ([963e488](https://github.com/brillout/vite-plugin-ssr/commit/963e488e1a7dbf588be4f16ce1eec40e9a2f9426))
* make `contextProps.urlParsed` available to user ([97aa908](https://github.com/brillout/vite-plugin-ssr/commit/97aa9082497b2a85c33434855ac5fc013e91673e))



# [0.1.0-beta.34](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.33...v0.1.0-beta.34) (2021-04-21)


### Bug Fixes

* simplify `navigationState` and avoid unnecessary `contextProps` fetching when navigating to `/#` ([#43](https://github.com/brillout/vite-plugin-ssr/issues/43)) ([9e2196b](https://github.com/brillout/vite-plugin-ssr/commit/9e2196b27e9d28cac491d9da5918afa143ee3061))
* use path.posix.relative instead of path.relative ([5eadbb1](https://github.com/brillout/vite-plugin-ssr/commit/5eadbb13a3b6870c57426b3397a1033e586fa35f))
* version number in assertion messages ([47a99a6](https://github.com/brillout/vite-plugin-ssr/commit/47a99a6cb26196b064f1279ca2c20b5122d30487))


### Features

* make `contextProps.urlFull` and `contextProps.urlPathname` available everywhere (fix [#42](https://github.com/brillout/vite-plugin-ssr/issues/42), fix [#42](https://github.com/brillout/vite-plugin-ssr/issues/42)) ([b3f46fc](https://github.com/brillout/vite-plugin-ssr/commit/b3f46fc8c416d66ef455f58261f67461551cf430))


### BREAKING CHANGES

* `contextProps.url` and `contextProps.urlNormalized` are deprecated: use `contextProps.urlFull` and `contextProps.urlPathname` instead.



# [0.1.0-beta.33](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.31...v0.1.0-beta.33) (2021-04-17)


### Bug Fixes

* retrieve context props for 404 page, and expect missing context props for 404 page if no `_error.page.js` is defined (fix [#41](https://github.com/brillout/vite-plugin-ssr/issues/41)) ([55cd596](https://github.com/brillout/vite-plugin-ssr/commit/55cd5969c18d0b876ed8fa86bf554eda5efaad79))



# [0.1.0-beta.32](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.31...v0.1.0-beta.32) (2021-04-16)


### Features

* simplify data fetching ([2d1a52d](https://github.com/brillout/vite-plugin-ssr/commit/2d1a52d4f698741c90049e9978a0904c6ca0dc0d))


### BREAKING CHANGES

* `pageProps` and `setPageProps()` are deprecated. Define
your page props on `contextProps.pageProps` by returning `pageProps` in
`addContextProps()`, and then `export const passToClient = ['pageProps']`
in `.page.server.js` to tell `vite-plugin-ssr` to serialize and pass
`contextProps.pageProps` to the browser. In the browser `contextProps`
is now available at `const { Page, contextProps } = await getPage()`
and `useClientRouter({ render({ Page, contextProps, isHydration }) })`.



# [0.1.0-beta.31](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.30...v0.1.0-beta.31) (2021-04-15)


### Bug Fixes

* remove test files from boilerplates ([c255dbb](https://github.com/brillout/vite-plugin-ssr/commit/c255dbb5d5f01dbdfaea8172dced08f48074af16))
* use `parseUrl()` instead of `new URL()` (fix [#28](https://github.com/brillout/vite-plugin-ssr/issues/28)) ([447d095](https://github.com/brillout/vite-plugin-ssr/commit/447d095f7424be4e6f64412a781015ccc3d7ee14))



# [0.1.0-beta.30](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.29...v0.1.0-beta.30) (2021-04-10)


### Bug Fixes

* prevent dynamic dependency paths from mistakenly being statically analysed ([a1eca47](https://github.com/brillout/vite-plugin-ssr/commit/a1eca47ea6c3246689cffdb936a4f25aa8c78b55))


### Features

* accept any valid URL to be passed to `renderPage()` ([930865e](https://github.com/brillout/vite-plugin-ssr/commit/930865ee1e0aef8c506323fe4dda12485bf1d102))
* add `contextProps.routeParams` ([512a253](https://github.com/brillout/vite-plugin-ssr/commit/512a253830adb079e222d02e5da3eade7f13256f))
* add `contextProps.urlNormalized` ([9c932b0](https://github.com/brillout/vite-plugin-ssr/commit/9c932b0e3f275257a54f0c381ba784fed6443139))



# [0.1.0-beta.29](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.28...v0.1.0-beta.29) (2021-04-10)


### Bug Fixes

* ssr vite entry path ([0237d78](https://github.com/brillout/vite-plugin-ssr/commit/0237d78bcc8ae10736dbd9867884736e52c4798b))



# [0.1.0-beta.28](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.27...v0.1.0-beta.28) (2021-04-10)


### Bug Fixes

* **cli:** process exit 1 on unhandled promise rejections (fix [#33](https://github.com/brillout/vite-plugin-ssr/issues/33)) ([6ab3b49](https://github.com/brillout/vite-plugin-ssr/commit/6ab3b493dce2eff11e4221d391f351c981736768))
* [cloudflare workers] do not import plugin code in prod ([#1](https://github.com/brillout/vite-plugin-ssr/issues/1)) ([a6af9e7](https://github.com/brillout/vite-plugin-ssr/commit/a6af9e7b0043efd082c3ba0c125a36aa972abd4f))
* change url right before rendering new page ([97530f0](https://github.com/brillout/vite-plugin-ssr/commit/97530f0b6e21299d53f56bce4a7aaa36a75636b7))
* do not assume asset path to start with `assets/` (fix [#32](https://github.com/brillout/vite-plugin-ssr/issues/32)) ([9791c41](https://github.com/brillout/vite-plugin-ssr/commit/9791c4108ff0e93e0f150e7ff30cca2de5f9ad8c))
* improve error handling for CF workers ([70a89e0](https://github.com/brillout/vite-plugin-ssr/commit/70a89e0469d83be728282954125069b4219c08a9))


### Features

* [cloudflare workers] generate importer.js ([#1](https://github.com/brillout/vite-plugin-ssr/issues/1)) ([dfa4e76](https://github.com/brillout/vite-plugin-ssr/commit/dfa4e7614956b06edde463464938f610b8f66914))
* **cli:** add option to set `root` ([4f1087a](https://github.com/brillout/vite-plugin-ssr/commit/4f1087a09dbe4e5bd085245d54b041662765ee9e))
* [cloudflare workers] allow user to manually set Vite Manifests ([#1](https://github.com/brillout/vite-plugin-ssr/issues/1)) ([75aa55e](https://github.com/brillout/vite-plugin-ssr/commit/75aa55e0addb9890de2d7b4143ffa2d7f110aa54))
* [cloudflare workers] make loading vite entry user file loader self sufficient for build ([#1](https://github.com/brillout/vite-plugin-ssr/issues/1)) ([0693184](https://github.com/brillout/vite-plugin-ssr/commit/0693184695d7e57d274f00652ad85d4db1e2f9ca))
* [cloudflare workers] remove client-side code in SSR bundles ([#1](https://github.com/brillout/vite-plugin-ssr/issues/1)) ([557fabc](https://github.com/brillout/vite-plugin-ssr/commit/557fabc0aab6d64484dfa72cfb9c5736e46cf3b6))


### BREAKING CHANGES

* `import ssr from 'vite-plugin-ssr'` now throws an error; use `import ssr from 'vite-plugin-ssr/plugin'` instead.



# [0.1.0-beta.27](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.26...v0.1.0-beta.27) (2021-04-03)


### Bug Fixes

* wrong assertion (fix [#28](https://github.com/brillout/vite-plugin-ssr/issues/28)) ([97ba440](https://github.com/brillout/vite-plugin-ssr/commit/97ba440ffb55f0b803f34d22666390d75c16b5f2))


### Features

* auto-detect whether `useClientRouter()` is used and pass that info to the pre-render + pass Vite's `base` value to the pre-render ([698f060](https://github.com/brillout/vite-plugin-ssr/commit/698f060c57bc40fdf17aded40e60bb316b93ebcc))
* support base url for prod server ([de8c0e0](https://github.com/brillout/vite-plugin-ssr/commit/de8c0e00956b1ff0b47b93eb1ffe53c1fbaad2d5))



# [0.1.0-beta.26](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.25...v0.1.0-beta.26) (2021-03-30)


### Bug Fixes

* CJS default plugin export ([09c3ee4](https://github.com/brillout/vite-plugin-ssr/commit/09c3ee4c09bcb7d3b75015b977dffe3279c93fe7))



# [0.1.0-beta.25](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.24...v0.1.0-beta.25) (2021-03-30)


### Bug Fixes

* TS type declarations ([40de96a](https://github.com/brillout/vite-plugin-ssr/commit/40de96a1a592209128264270869db0d41964400c))



# [0.1.0-beta.24](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.23...v0.1.0-beta.24) (2021-03-30)


### Bug Fixes

* use vite@2.1.4 ([1ff3668](https://github.com/brillout/vite-plugin-ssr/commit/1ff36683e09fe1cdd1a759b01655bb5363d225a8))


### Features

* support URL query strings ([#22](https://github.com/brillout/vite-plugin-ssr/issues/22)) ([4d58d4c](https://github.com/brillout/vite-plugin-ssr/commit/4d58d4c3ff3b400814caa63ce80049f225226d17))


### BREAKING CHANGES

* This release only works with `@vite@2.1.4`; make sure
to pin your `vite` dependency to `2.1.4` in your `package.json`.



# [0.1.0-beta.23](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.22...v0.1.0-beta.23) (2021-03-28)


### Bug Fixes

* add CJS default export for `vite-plugin-ssr/plugin` ([40216d2](https://github.com/brillout/vite-plugin-ssr/commit/40216d2db44f7b12d802a2193cb76b9cce3fdcc3))



# [0.1.0-beta.22](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.21...v0.1.0-beta.22) (2021-03-28)


### Bug Fixes

* only intercept regular left clicks on regular links ([405a27f](https://github.com/brillout/vite-plugin-ssr/commit/405a27f7200997c24014edf9b9ca73dc8698fca2))
* save & restore scroll position upon client-side routing ([72815c7](https://github.com/brillout/vite-plugin-ssr/commit/72815c7c00adb04f8fdb8a20924b473cc3a66f49))


### improve

* don't load plugin code in production ([95e7e0f](https://github.com/brillout/vite-plugin-ssr/commit/95e7e0f5492cb907748da312d0ec8b6cb7b5f659))


### BREAKING CHANGES

* It's now recommended to do `import ssr from
'vite-plugin-ssr/plugin';` instead of `import ssr from
'vite-plugin-ssr';`. A warning will be shown otherwise.



# [0.1.0-beta.21](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.20...v0.1.0-beta.21) (2021-03-26)


### Bug Fixes

* Filesystem Routing bug when common prefix ends in filename ([06ccfaa](https://github.com/brillout/vite-plugin-ssr/commit/06ccfaa231319055377af9eb20f74887ad7fb484))
* fix mapping of pageId and page files (fix [#18](https://github.com/brillout/vite-plugin-ssr/issues/18)) ([45436f5](https://github.com/brillout/vite-plugin-ssr/commit/45436f570c5938570717e13b2e77a87657337081))
* use some-path/index.html instead of some-path.html (fix [#19](https://github.com/brillout/vite-plugin-ssr/issues/19)) ([7281ffe](https://github.com/brillout/vite-plugin-ssr/commit/7281ffe9091f99b024b0d4e40833e64c21b07a60))


### Features

* expose CLI as JavaScript API ([e16ec91](https://github.com/brillout/vite-plugin-ssr/commit/e16ec9113763ca9bc46394d38f0011b2737a8a09))



# [0.1.0-beta.20](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.19...v0.1.0-beta.20) (2021-03-26)


### Bug Fixes

* export ES module for Vite (fix [#17](https://github.com/brillout/vite-plugin-ssr/issues/17)) ([8dcd875](https://github.com/brillout/vite-plugin-ssr/commit/8dcd8755622b2d292cf6c02600b553fe52406c67))


### Features

* update peer dependency on vite 2.1.2->2.1.3 ([6778f09](https://github.com/brillout/vite-plugin-ssr/commit/6778f09cfcb2fb63bf1e983aa0aae7d35a8f1a39))


### BREAKING CHANGES

* this release works *only* with vite@2.1.3 so make sure
to pin your vite dependency to 2.1.3



# [0.1.0-beta.19](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.18...v0.1.0-beta.19) (2021-03-25)


### Features

* add --skip-git flag to boilerplates ([18e1616](https://github.com/brillout/vite-plugin-ssr/commit/18e16165324a9204c17cec9370af58696e9303b1))
* add support for base url (fix [#16](https://github.com/brillout/vite-plugin-ssr/issues/16)) ([b4a4f2f](https://github.com/brillout/vite-plugin-ssr/commit/b4a4f2fb40f5872700a2badf86a914941066b6b3))



# [0.1.0-beta.18](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.17...v0.1.0-beta.18) (2021-03-24)


### Bug Fixes

* when injecting HTML: also recognize tags that have attributes ([651428a](https://github.com/brillout/vite-plugin-ssr/commit/651428a4e5bd80acc999b7d822ce682fa8ec135d))


### Features

* impl `useClientRouter()` ([4cfe4ef](https://github.com/brillout/vite-plugin-ssr/commit/4cfe4ef30aeb3c1f6b276cd04c6b405538914bf8))



# [0.1.0-beta.17](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.16...v0.1.0-beta.17) (2021-03-19)


### Bug Fixes

* remove zero-js problematic example ([69d662d](https://github.com/brillout/vite-plugin-ssr/commit/69d662dbbf1845aa90cb707cb810ebcf0b8b4cc2))


### Features

* impl pre-rendering ([2e9de2d](https://github.com/brillout/vite-plugin-ssr/commit/2e9de2d717a0dc63519a9f7e6aae1e3a9e3f9188))



# [0.1.0-beta.16](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.15...v0.1.0-beta.16) (2021-03-18)


### Bug Fixes

* auto apply @brillout/vite-fix-2390 ([f847a32](https://github.com/brillout/vite-plugin-ssr/commit/f847a32a2282ba9ab7dcbfafcd470a039f01893b)), closes [#5](https://github.com/brillout/vite-plugin-ssr/issues/5)



# [0.1.0-beta.15](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.14...v0.1.0-beta.15) (2021-03-17)


### Bug Fixes

* support building in ts cjs projects ([be5c7dc](https://github.com/brillout/vite-plugin-ssr/commit/be5c7dca707cd6a62e15191d5f8387cc67a47ced)), closes [#11](https://github.com/brillout/vite-plugin-ssr/issues/11)



# [0.1.0-beta.14](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.13...v0.1.0-beta.14) (2021-03-17)


### Bug Fixes

* improve thenable check ([62fca8e](https://github.com/brillout/vite-plugin-ssr/commit/62fca8e53ca67fdb3e9a92103d287d93a26a485b))
* remove need for AntiFlicker by preloading styles in dev ([debb9bd](https://github.com/brillout/vite-plugin-ssr/commit/debb9bdbc72d0674066541e39362810d7127b161)), closes [#2](https://github.com/brillout/vite-plugin-ssr/issues/2)


### Reverts

* Revert "failed attempt 4 for a workaround for vitejs/vite#2390" ([4c2130f](https://github.com/brillout/vite-plugin-ssr/commit/4c2130f3be5405f19b695dd7c90584ac89a1a0cd)), closes [vitejs/vite#2390](https://github.com/vitejs/vite/issues/2390)



# [0.1.0-beta.13](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.12...v0.1.0-beta.13) (2021-03-14)


### Bug Fixes

* do not assertUsage viteDevServer in production ([d7f69c5](https://github.com/brillout/vite-plugin-ssr/commit/d7f69c56b270faa5c449d97e402b02e0c667c8cc))



# [0.1.0-beta.12](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.11...v0.1.0-beta.12) (2021-03-12)


### Features

* allow non-page .server file extensions ([10a14d1](https://github.com/brillout/vite-plugin-ssr/commit/10a14d10462aac26f08736d72da1ff028b7a2a51)), closes [#3](https://github.com/brillout/vite-plugin-ssr/issues/3)



# [0.1.0-beta.11](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.10...v0.1.0-beta.11) (2021-03-09)


### Bug Fixes

* skip /favicon.ico requests ([f528784](https://github.com/brillout/vite-plugin-ssr/commit/f528784c87746be3671a301fd289aaaf77ae9540))


### chore

* rename `createRender()` to `createPageRender()` ([f62dc8e](https://github.com/brillout/vite-plugin-ssr/commit/f62dc8ed96db90a09f8cfd636fa3813718bb6358))


### Features

* improve error handling ([4a945bf](https://github.com/brillout/vite-plugin-ssr/commit/4a945bf4c109457326c1b832e928431c829fd716))
* improve route functions ([9af7f7b](https://github.com/brillout/vite-plugin-ssr/commit/9af7f7bc876092c892ec0f76f6c0d5ccb3f3fec9))
* improve usage error messages ([cc0d678](https://github.com/brillout/vite-plugin-ssr/commit/cc0d67865378b7eba85aecc54695ed74ceb8dda8))


### BREAKING CHANGES

* server integration point `createRender()` renamed to `createPageRender()`.
* `render()` function (`const render = createRender(/*...*/)`) now returns an object `{ nothingRendered, renderResult, statusCode }`.
* `_404.page.js` and `_500.page.js` deprecated and replaced with `_error.page.js`.



# [0.1.0-beta.10](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.8...v0.1.0-beta.10) (2021-03-05)


### Bug Fixes

* convert windows path to posix for micromatch ([cc9c405](https://github.com/brillout/vite-plugin-ssr/commit/cc9c405924d38e3615ea042b951c8e58e342f161)), closes [#4](https://github.com/brillout/vite-plugin-ssr/issues/4)
* don't try to inject dynamic import polyfill ([fdffd37](https://github.com/brillout/vite-plugin-ssr/commit/fdffd37c0bff0f3b16d28268ec0ba4bcc193b5cc))
* **boilerplates:** remove duplicated file ([4421aa6](https://github.com/brillout/vite-plugin-ssr/commit/4421aa6fb3b8b2a0f82d0d1eec80d0cc59cc54d3))


### Features

* allow render hook to return an object instead of HTML ([a649eaf](https://github.com/brillout/vite-plugin-ssr/commit/a649eafbc8bf4e746d792b8f3c55ab8161330deb))
* support _500.page.js and improve error handling ([d492b9c](https://github.com/brillout/vite-plugin-ssr/commit/d492b9caba88a07bf28c00f9e14291f69cb5d694))
* support `html` tag composition ([9a57006](https://github.com/brillout/vite-plugin-ssr/commit/9a57006b53dae411ca1981642f2569c5e3cf3cae))



# [0.1.0-beta.9](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.8...v0.1.0-beta.9) (2021-03-01)

### Bug Fixes

* Fix released build



# [0.1.0-beta.8](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.7...v0.1.0-beta.8) (2021-03-01)


### Bug Fixes

* re-export default ([cd43e6e](https://github.com/brillout/vite-plugin-ssr/commit/cd43e6ee27ca48d99fafbb41cf2a6cf4025044ad))
* use `in` operator only on objects ([819dfe1](https://github.com/brillout/vite-plugin-ssr/commit/819dfe14f2ab84bf9535a3e62d5fa2722130eb99))


### Features

* remove html.sanitize and make sanitized automatic ([95d145c](https://github.com/brillout/vite-plugin-ssr/commit/95d145c24123631eac169828b26c0114c63e48d8))


### BREAKING CHANGES

* Removed `html.sanitize()`; simply directly insert the
string and vite-plugin-ssr will automatically sanitize it



# [0.1.0-beta.7](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.6...v0.1.0-beta.7) (2021-02-28)


### Features

* Pass `Page` to addContextProps. ([2512ee3](https://github.com/brillout/vite-plugin-ssr/commit/2512ee30a43294d5b6bf61224a0c20d94f88e7ed))



# [0.1.0-beta.6](https://github.com/brillout/vite-plugin-ssr/tree/963afbafa5697d7745b6803bf1475b4aad7559c2) (2021-02-22)

Initial public release
