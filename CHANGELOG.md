## [0.4.224](https://github.com/vikejs/vike/compare/v0.4.223...v0.4.224) (2025-02-28)


### Bug Fixes

* also copy server assets of entry ([#2190](https://github.com/vikejs/vike/issues/2190)) ([8260c0f](https://github.com/vikejs/vike/commit/8260c0ffeea4c7adfca4b05b4e56383faff7b20e))
* compatibility with bun runtime (fix [#2204](https://github.com/vikejs/vike/issues/2204)) ([#2208](https://github.com/vikejs/vike/issues/2208)) ([f1089b4](https://github.com/vikejs/vike/commit/f1089b4f41bc03c06f6b2f4b1aa10ca7e2b9b020))
* don't break Vitest source mapping ([a187344](https://github.com/vikejs/vike/commit/a18734407474eb965fce2a3f6ae1e4107dd9da5e))
* externalize linked npm packages ([0d242d9](https://github.com/vikejs/vike/commit/0d242d9e5cf9639fd6a8fd2b0a1228cff4c888c5))
* fix addFileExtensionsToRequireResolve() ([703d38e](https://github.com/vikejs/vike/commit/703d38e89a692334cde054d51c93b1432cdafcaa))
* fix asset manifest generation for Environment API (closes [#2202](https://github.com/vikejs/vike/issues/2202)) ([#2203](https://github.com/vikejs/vike/issues/2203)) ([f939424](https://github.com/vikejs/vike/commit/f939424a5955baad4e1eeefdcf62296e435ccd05))
* fix replication of Vite's root resolve (fix [#2219](https://github.com/vikejs/vike/issues/2219)) ([32cd543](https://github.com/vikejs/vike/commit/32cd543b7eb8e7dc81c22ae05d4192c7f9f62155))
* further catch invalid React element error ([a0ef0b6](https://github.com/vikejs/vike/commit/a0ef0b6947cb150d2a823aee81c8c61c6841e1bc))
* import instead of serializing non-serializable build-time values ([2a8e575](https://github.com/vikejs/vike/commit/2a8e575f91d9655b3e6743e25b8f719a40e99146))
* load routes at build-time ([cee3a17](https://github.com/vikejs/vike/commit/cee3a17afec2cb2c7af9f9ecbf85850c1294857a))
* more precise urlResolved assert ([#2197](https://github.com/vikejs/vike/issues/2197)) ([6f064ad](https://github.com/vikejs/vike/commit/6f064adc7a157d63a57c646bfb4fb0524be5dd99))
* remove edge-light export ([8fffec3](https://github.com/vikejs/vike/commit/8fffec3fecb72e06ba3af3a20080870da7db0d1d))
* remove faulty assertion (fix [#2227](https://github.com/vikejs/vike/issues/2227)) ([3502685](https://github.com/vikejs/vike/commit/350268576973a707c682f99342abf7aa0a6d2570))
* skip `.generated.` files from crawler (fix [#2222](https://github.com/vikejs/vike/issues/2222)) ([435dbbc](https://github.com/vikejs/vike/commit/435dbbc8f3557372349a15e78cb1dc8c91c14f94))
* update @brillout/import ([ae0ac32](https://github.com/vikejs/vike/commit/ae0ac322c08494d493377259feb8ac99ce61e251))
* update @brillout/import ([acf73d2](https://github.com/vikejs/vike/commit/acf73d2a514c23d34ff322451e8059cdf2dda3a8))
* update @brillout/picocolors ([fcd5f8d](https://github.com/vikejs/vike/commit/fcd5f8d2f4643c2e17c5bb07dc6347107b72c45a))
* update @brillout/picocolors ([ca5ce3e](https://github.com/vikejs/vike/commit/ca5ce3e05ce05be32a7b66269ddd0143932e5c95))
* update @brillout/picocolors ([#2199](https://github.com/vikejs/vike/issues/2199)) ([586dbfb](https://github.com/vikejs/vike/commit/586dbfb53839695dde9a177e28162f0f5bcc17eb))
* update @brillout/vite-plugin-server-entry (closes [#2201](https://github.com/vikejs/vike/issues/2201)) ([105441e](https://github.com/vikejs/vike/commit/105441e5caa212eab9d946e974bbd3cee2c58feb))
* update picocolors ([db2df70](https://github.com/vikejs/vike/commit/db2df70719f2f7ce3494165b59fc680269eee60f))


### Features

* `getPageContextClient()` ([#2191](https://github.com/vikejs/vike/issues/2191)) ([f3c57ba](https://github.com/vikejs/vike/commit/f3c57ba03e819206bb9a9c097dfbbd883a74291f))
* `getVikeConfig()` ([#2194](https://github.com/vikejs/vike/issues/2194)) ([5a81b60](https://github.com/vikejs/vike/commit/5a81b60c9b8e6beb07e1247a0c78787405029e88))
* `prerender.value` ([535bde1](https://github.com/vikejs/vike/commit/535bde1a586e31f9192d53b2fcb62089e860b761))
* `prerenderContext.output` ([3ad49ff](https://github.com/vikejs/vike/commit/3ad49ff7ee4385c265501e1dd988040138470850))
* `VIKE_CRAWL="{ignore:'**/some-dir/**'}"` (closes [#2228](https://github.com/vikejs/vike/issues/2228)) ([#2229](https://github.com/vikejs/vike/issues/2229)) ([56675a0](https://github.com/vikejs/vike/commit/56675a04669107bcc188f266f04d45ad999db91c))
* allow `meta.effect` to change value of config ([86fe9b4](https://github.com/vikejs/vike/commit/86fe9b4554e2fc1934ac60ffeb755305350ec2bc))


### Performance Improvements

* switch from `fast-glob` to `tinyglobby` ([#2193](https://github.com/vikejs/vike/issues/2193)) ([69f80f4](https://github.com/vikejs/vike/commit/69f80f4915c22dab95f17104116f9f506a703445))



## [0.4.223](https://github.com/vikejs/vike/compare/v0.4.222...v0.4.223) (2025-02-16)


### Bug Fixes

* Environment API compatibility ([#2184](https://github.com/vikejs/vike/issues/2184)) ([49c04fd](https://github.com/vikejs/vike/commit/49c04fd918877662be93db40fabecc326f1f8564))
* improve bug report link ([bc234f8](https://github.com/vikejs/vike/commit/bc234f88664e39880e2adf873c871048c6d12086))
* improve version mismatch error ([e42d6c6](https://github.com/vikejs/vike/commit/e42d6c66b9eea2a9afde5bc10f6d2cedf72003c7))
* improve vike/plugin return type ([#2174](https://github.com/vikejs/vike/issues/2174)) ([6ff9bd7](https://github.com/vikejs/vike/commit/6ff9bd75b3077f98a95ac80a6b56f57ece0f52fb))
* properly expose page routes ([#2177](https://github.com/vikejs/vike/issues/2177)) ([6647d1e](https://github.com/vikejs/vike/commit/6647d1e5c83e4ac82fbe9e6a60d8da2d01fa1b48))
* refactor safe `viteIsSSR()` implementation ([#2179](https://github.com/vikejs/vike/issues/2179)) ([#2186](https://github.com/vikejs/vike/issues/2186)) ([ce4e16e](https://github.com/vikejs/vike/commit/ce4e16e45b6b84e3fefa62d825b350c1a1f9e6fa))
* remove outdated assert (fix [#2179](https://github.com/vikejs/vike/issues/2179)) ([5513d32](https://github.com/vikejs/vike/commit/5513d3297f5d9e5ab52211e92713183c2149473d))
* remove outdated warning ([d808eda](https://github.com/vikejs/vike/commit/d808eda1a262e01785d3413e59a8e691909ff21e))


### Features

* `globalContext.baseStatic` & `globalContext.baseServer` ([#2175](https://github.com/vikejs/vike/issues/2175)) ([207e079](https://github.com/vikejs/vike/commit/207e079c171a2987c8ece235e9550d6098fa4f04))
* pageContext.isBaseMissing ([#2153](https://github.com/vikejs/vike/issues/2153)) ([fab3841](https://github.com/vikejs/vike/commit/fab3841f0805ab174548a5163c479c4f42aa07ca))
* universal-middleware ([#2183](https://github.com/vikejs/vike/issues/2183)) ([1d30e12](https://github.com/vikejs/vike/commit/1d30e12db1a66d003736055b817db6f6664b8dfc))



## [0.4.222](https://github.com/vikejs/vike/compare/v0.4.221...v0.4.222) (2025-02-12)


### Bug Fixes

* +{configName}.js pointer imports ([3310144](https://github.com/vikejs/vike/commit/33101440d8cda78072ac01e6f42ace3b2a17fc87))
* also crawl + files at root directory ([6247354](https://github.com/vikejs/vike/commit/6247354277eef8622ea25d1e46ccbf22a2f403fb))
* apply global configs (fix [#2165](https://github.com/vikejs/vike/issues/2165)) ([#2169](https://github.com/vikejs/vike/issues/2169)) ([8c0ee5e](https://github.com/vikejs/vike/commit/8c0ee5eaa2011a243ba8d168aab6d9461d10790f))
* auto-reload config upon + value file changes ([#2170](https://github.com/vikejs/vike/issues/2170)) ([54388c3](https://github.com/vikejs/vike/commit/54388c3f484e9310c42bc1addaf6818c76e6b4bf))
* consider + files living as root as global + files ([ed23891](https://github.com/vikejs/vike/commit/ed23891f03032182c645f8cfb9ecebe741002b8c))
* ensure no race condition upon HMR of + files ([24cd2e7](https://github.com/vikejs/vike/commit/24cd2e7f06ff6893eef9060fda2190269182b859))
* fix css duplication warning ([#2163](https://github.com/vikejs/vike/issues/2163)) ([488a81a](https://github.com/vikejs/vike/commit/488a81ae4a84bb55825f0deaa98bc420a4f22a74))
* forbid adding Vike's Vite plugin using +vite ([#2162](https://github.com/vikejs/vike/issues/2162)) ([4c0695b](https://github.com/vikejs/vike/commit/4c0695bf3646e28927f10a2309d5c21d1b1239c2))
* properly assert configs are known ([e9725c9](https://github.com/vikejs/vike/commit/e9725c98d928b7358b14a3bcf69a008331f1a09c))


### Features

* [experimental] config.vike.pages ([#2172](https://github.com/vikejs/vike/issues/2172)) ([6ae23f2](https://github.com/vikejs/vike/commit/6ae23f2814e0c6ee8ccc248fae610df9bd89142f))
* new debug flag vike:crawl ([b173629](https://github.com/vikejs/vike/commit/b17362991130bb6d57dd9c81140819991a7ce872))
* wildcard debug logs `vike:*` ([ab1d057](https://github.com/vikejs/vike/commit/ab1d057c8473ac5db08e96f6525ce25a67978dd0))



## [0.4.221](https://github.com/vikejs/vike/compare/v0.4.220...v0.4.221) (2025-02-10)


### Bug Fixes

* add debug logs ([#2138](https://github.com/vikejs/vike/issues/2138)) ([5c7810f](https://github.com/vikejs/vike/commit/5c7810f3080ab62536950f26e019bb2a3a517082))
* allow user to define global custom configs ([8fd9d0f](https://github.com/vikejs/vike/commit/8fd9d0fe079fda7bc5e3ac80e5658a747027b752))
* also load value files of global custom configs ([eb981b9](https://github.com/vikejs/vike/commit/eb981b967e16bd86863280ec11e180418c411c32))
* always start pre-rendering during Vite build ([#2123](https://github.com/vikejs/vike/issues/2123)) ([#2124](https://github.com/vikejs/vike/issues/2124)) ([9a1fe8d](https://github.com/vikejs/vike/commit/9a1fe8d53a3bb0a2b3bf39a309e28f73f5970e89))
* fallback fonts should not be preloaded ([#2144](https://github.com/vikejs/vike/issues/2144)) ([af5c91f](https://github.com/vikejs/vike/commit/af5c91fe3749b8519fb5e01f1fbbe890ffa22064))
* fix cross env pointer import check ([965359a](https://github.com/vikejs/vike/commit/965359abbc252fcefcbb64b533571fa482e654ef))
* further ensure that assertViteVersion() is called ([#2135](https://github.com/vikejs/vike/issues/2135)) ([9a798ce](https://github.com/vikejs/vike/commit/9a798ce07db9a4800daa35bb19c4fdbfd9aa0c15))
* improve error message upon using unsupported Vite version ([#2135](https://github.com/vikejs/vike/issues/2135)) ([e7f407b](https://github.com/vikejs/vike/commit/e7f407ba24aa60534ba5a4ab540b301e349ac446))
* improve unknown config handling ([7af4702](https://github.com/vikejs/vike/commit/7af470243ebbea15addc4cdb032612b672d82c3d))
* improve warning upon global config defined locally ([#2145](https://github.com/vikejs/vike/issues/2145)) ([2a0e304](https://github.com/vikejs/vike/commit/2a0e3043184f77b5417beabe44c5195ac1e9bd89))
* inspect `configValuesLoaded===undefined` bug ([#2092](https://github.com/vikejs/vike/issues/2092)) ([47f28a0](https://github.com/vikejs/vike/commit/47f28a0cf0ea535969b02d776a69b3324de70bc1))
* narrow config.vike.global public experimental API ([#2122](https://github.com/vikejs/vike/issues/2122)) ([818a106](https://github.com/vikejs/vike/commit/818a10605d6d8e658fab309ec53fc018c4da7126))
* narrow extensions pre-vike-cli interop ([#2122](https://github.com/vikejs/vike/issues/2122)) ([5f27fc2](https://github.com/vikejs/vike/commit/5f27fc2dd3330c5e4aed575ada8557dc261abb79))
* refactor & fix config reload upon dev changes (fix [#2152](https://github.com/vikejs/vike/issues/2152)) ([#2156](https://github.com/vikejs/vike/issues/2156)) ([f7f7b3d](https://github.com/vikejs/vike/commit/f7f7b3dba5407919a515c369ff303fc769c62fda))
* refactor & simplify back-/forward navigation ([#2117](https://github.com/vikejs/vike/issues/2117)) ([5f20340](https://github.com/vikejs/vike/commit/5f203404eb2babb84d77626c765619a0a385bfd8))
* soft-deprecate & move options set by `vike(options)` in vite.config.js ([#2128](https://github.com/vikejs/vike/issues/2128)) ([d79eb01](https://github.com/vikejs/vike/commit/d79eb016cfb98cd46fde26c71ab19f194f7e3cbe))


### Features

* [experimental] `config.vike.prerenderContext._output` ([#2123](https://github.com/vikejs/vike/issues/2123)) ([#2125](https://github.com/vikejs/vike/issues/2125)) ([a9f46b8](https://github.com/vikejs/vike/commit/a9f46b8f10ed0dbe6ca39cfe4d7cf26bc0c99a77))
* [experimental] `globalContext.config` & `config.vike.config` ([#2149](https://github.com/vikejs/vike/issues/2149)) ([1a661dc](https://github.com/vikejs/vike/commit/1a661dce01df82ec8902ba0ad8023fb2a71e93b3))
* [experimental] add compatibility with Vite 6 Environment API ([#2146](https://github.com/vikejs/vike/issues/2146)) ([d9703b8](https://github.com/vikejs/vike/commit/d9703b8a3763d7b77742736bfd35f92f7e9ebded))
* support text fragments `:~:text=` (fix [#2114](https://github.com/vikejs/vike/issues/2114)) ([#2119](https://github.com/vikejs/vike/issues/2119)) ([67dbd62](https://github.com/vikejs/vike/commit/67dbd6215c102eadd1aab0a6ef44ec74e40bbc4f))


### Performance Improvements

* [refactor] eagerly load user files ([#2158](https://github.com/vikejs/vike/issues/2158)) ([d651343](https://github.com/vikejs/vike/commit/d6513433c8b47105512c327b1de2b43a337ecf0a))
* dedupe conf transpiling ([dbfbe1d](https://github.com/vikejs/vike/commit/dbfbe1d7b94aa815750678cc8eccb00d7cfe413e))
* reduce client-side dependencies ([#2140](https://github.com/vikejs/vike/issues/2140)) ([c9437a3](https://github.com/vikejs/vike/commit/c9437a3158e0cf0c23d63932231a4b53a751d914))



## [0.4.220](https://github.com/vikejs/vike/compare/v0.4.219...v0.4.220) (2025-01-27)


### Bug Fixes

* always let browsers handle hash links ([74befa8](https://github.com/vikejs/vike/commit/74befa88ba405a7e849f92f078cd941754b34471))
* fix config overriding precedence ([8833925](https://github.com/vikejs/vike/commit/8833925fd4a3b585b8d6f4b04f5185041ff5dc0d))
* improve warning message ([a2846c4](https://github.com/vikejs/vike/commit/a2846c4fa6f0db567df018a18beccdeb58ffd1ab))



## [0.4.219](https://github.com/vikejs/vike/compare/v0.4.218...v0.4.219) (2025-01-24)


### Bug Fixes

* allow subsequent same-process API calls ([#2100](https://github.com/vikejs/vike/issues/2100)) ([ea3a842](https://github.com/vikejs/vike/commit/ea3a84264222768b9869e5f87ce4429e0685f3ae))
* avoid hoisting race condition ([da1f60b](https://github.com/vikejs/vike/commit/da1f60b36a8c137f874cbaa8f5533acf4ffc8df6))
* don't force exit build() API ([84ef85b](https://github.com/vikejs/vike/commit/84ef85bb0ea91e1b9b8f76d198b6672266e3def1))
* fix bug handling ([30f5a91](https://github.com/vikejs/vike/commit/30f5a91fb4df9a23941e154f104f03d460b1d148))
* fix Vike extensions regression with __internal/setup ([5d388ee](https://github.com/vikejs/vike/commit/5d388ee21a93c976bc1eaf2c780aa3ddaae5b4fe))
* fix Vike extensions regression with configVikePromise ([81f6f32](https://github.com/vikejs/vike/commit/81f6f32edda4b73d5f87debcb5d0126188f89f95))
* fix Vike extensions regression with vitePluginSsr config ([0a599fa](https://github.com/vikejs/vike/commit/0a599fa0dc0092b2e74b82780597b7b8f4d5282f))
* improve NODE_ENV check ([52e3f12](https://github.com/vikejs/vike/commit/52e3f123a94542f98dd386895a90590f9c3b3904))
* minor fix debug flag detection ([dbd2d00](https://github.com/vikejs/vike/commit/dbd2d0024a33bec80da02a9054bbfdbee18a8eb5))
* new debug flag vike:globalContext ([ceba41c](https://github.com/vikejs/vike/commit/ceba41c2565efefe4c23d7c1d7657b14608daee3))
* polish error message ([18258fa](https://github.com/vikejs/vike/commit/18258fa91234a03804b3a64eef7d6ab108a29fbb))
* support dist/ inject + pre-rendering ([221ee54](https://github.com/vikejs/vike/commit/221ee5449062a3a47fef8b67b825d5ed2b3c8a06))
* warn when `NODE_ENV` is string `"undefined"` (cloudflare/workers-sdk[#7886](https://github.com/vikejs/vike/issues/7886)) ([127e85e](https://github.com/vikejs/vike/commit/127e85e530ee744172e34d1315b38554e9fee327))
* workaround import() cache upon subsequent API calls ([15baeca](https://github.com/vikejs/vike/commit/15baeca803775c1f2a47ced39ced279f93337ebb))


### Features

* [experimental] Vite resolved config.vike ([85af52a](https://github.com/vikejs/vike/commit/85af52a40e2a89e597fe8f928600770fddd8a2d9))
* new setting `vite` ([#2103](https://github.com/vikejs/vike/issues/2103)) ([ed9b3d4](https://github.com/vikejs/vike/commit/ed9b3d45efbf477930fd81dba225313c359a58e7))



## [0.4.218](https://github.com/vikejs/vike/compare/v0.4.217...v0.4.218) (2025-01-18)


### Bug Fixes

* enable Base URL to be set in + files ([#2090](https://github.com/vikejs/vike/issues/2090)) ([1113bb0](https://github.com/vikejs/vike/commit/1113bb0dc7a8197a31644dad631ca0283b6a0bbe))
* fix crawling of symlinked directories ([#2086](https://github.com/vikejs/vike/issues/2086)) ([cc7cb18](https://github.com/vikejs/vike/commit/cc7cb1822c681366d86f23023a3f6b4b02a1afff))
* pass correct command value 'build' to `resolveConfig()` upon pre-rendering ([ec0904a](https://github.com/vikejs/vike/commit/ec0904ac21a8e30dc27945db2157cae2cf9c0973))
* reduce redundant `resolveConfig()` calls ([950e4cc](https://github.com/vikejs/vike/commit/950e4cc7da16a42ed1efecba4723f506c974df2f))
* remove `vike({ crawl: { git: false } })` in favor of `VIKE_CRAWL={git:false}` ([#2088](https://github.com/vikejs/vike/issues/2088)) ([99ea561](https://github.com/vikejs/vike/commit/99ea561081a8a8661398905e1d3ccd9ca1bcd4d0))
* remove symlink directory crawling ([#2087](https://github.com/vikejs/vike/issues/2087)) ([e15d78e](https://github.com/vikejs/vike/commit/e15d78e9d4e64a35c085368a1045ad8f92bc7cdd))



## [0.4.217](https://github.com/vikejs/vike/compare/v0.4.216...v0.4.217) (2025-01-16)


### Bug Fixes

* pass correct default mode to resolveConfig() ([949d82d](https://github.com/vikejs/vike/commit/949d82d33e358b367614767bc002a7af6e52cdf1))



## [0.4.216](https://github.com/vikejs/vike/compare/v0.4.215...v0.4.216) (2025-01-15)


### Bug Fixes

* add JSDocs to API functions ([70a6dac](https://github.com/vikejs/vike/commit/70a6dac49c7a75e60ef4ff388c4fa300d8ce74f5))
* also crawl outDir ([d1fee1d](https://github.com/vikejs/vike/commit/d1fee1d61a688d8104fbed57d8d311c96452dc93))
* deprecate Vite's JavaScript API ([#2078](https://github.com/vikejs/vike/issues/2078)) ([26fd9ac](https://github.com/vikejs/vike/commit/26fd9ac77acbb3e100ca5d37a42dfe7b74e11305))
* improve setup checks ([#2080](https://github.com/vikejs/vike/issues/2080)) ([24959ea](https://github.com/vikejs/vike/commit/24959ea3ba05d09b5973740a2abd0d95664a95f8))
* improve wrong middleware order error ([0429bdc](https://github.com/vikejs/vike/commit/0429bdc7979b1a08e3a64b4b1318c135ce036ae9))



## [0.4.215](https://github.com/vikejs/vike/compare/v0.4.214...v0.4.215) (2025-01-14)


### Bug Fixes

* improve API return values ([b71cd5c](https://github.com/vikejs/vike/commit/b71cd5c452cd76d65e24402bdc4e69ea5eda4032))
* remove slow crawl warning ([52d9899](https://github.com/vikejs/vike/commit/52d98993523725f6389d820eccdd8803920cf539))



## [0.4.214](https://github.com/vikejs/vike/compare/v0.4.213...v0.4.214) (2025-01-12)


### Bug Fixes

* add Vite 6 HMR regression workaround ([#2069](https://github.com/vikejs/vike/issues/2069)) ([a389dea](https://github.com/vikejs/vike/commit/a389dea020c04193ad25cdfcf3d95b224efdacb6))
* clarify Vike CLI usage (fix [#2057](https://github.com/vikejs/vike/issues/2057)) ([609dc8a](https://github.com/vikejs/vike/commit/609dc8af3616f3d197cdbaee3f2068055b6dadb1))
* make vite peer dependency optional ([#2070](https://github.com/vikejs/vike/issues/2070)) ([457c88e](https://github.com/vikejs/vike/commit/457c88ebf30504f086803dd82c47b1ae2ccfda24))



## [0.4.213](https://github.com/vikejs/vike/compare/v0.4.212...v0.4.213) (2025-01-09)


### Bug Fixes

* add missing files to npm package ([96df2b1](https://github.com/vikejs/vike/commit/96df2b1b95cd09e0e02ccb37f59fe882149f7895))
* fix resolve fallbacks (fix [#2040](https://github.com/vikejs/vike/issues/2040)) ([962127b](https://github.com/vikejs/vike/commit/962127b7cc2fe5849eb1f9373f92d1bbeb7cb308))
* improve `@experimental` JSDocs ([557bad2](https://github.com/vikejs/vike/commit/557bad2f8f3e44616196b7a6ef9af83eb8cd532c))


### Features

* Vike CLI ([#1434](https://github.com/vikejs/vike/issues/1434)) ([1494e70](https://github.com/vikejs/vike/commit/1494e70838c2b6feb243f9311d816ac905644532))



## [0.4.212](https://github.com/vikejs/vike/compare/v0.4.211...v0.4.212) (2025-01-05)


### Bug Fixes

* fix module style/script distinction (fix [#2039](https://github.com/vikejs/vike/issues/2039)) ([be2fe23](https://github.com/vikejs/vike/commit/be2fe23158b297922a3af0f57147d5c88128fc12))
* further remove duplicated dist/ assets (fix [#2034](https://github.com/vikejs/vike/issues/2034)) ([87669c5](https://github.com/vikejs/vike/commit/87669c5c05584e77dc783b2aa9104b3e0f47e5bf))



## [0.4.211](https://github.com/vikejs/vike/compare/v0.4.210...v0.4.211) (2024-12-28)


### Bug Fixes

* add hint for `window is not defined` ([7e270e9](https://github.com/vikejs/vike/commit/7e270e9f0c1af403fb39b2277fc7aaa86cdc0c11))
* fix wrong alias assertion ([07fd3f1](https://github.com/vikejs/vike/commit/07fd3f183a29a57370ea56e7af3d83dfae23200f))
* remove assets from dist/server/ (fix [#2034](https://github.com/vikejs/vike/issues/2034)) ([c1cd2d9](https://github.com/vikejs/vike/commit/c1cd2d978b9b811c159551927d0f843d7709066e))
* set `host: true` if inside docker container ([cac186d](https://github.com/vikejs/vike/commit/cac186d45f6a6505256f3e670088f6aaf32962e8))
* stabilize extends order (fix [#2037](https://github.com/vikejs/vike/issues/2037)) ([d93dfe1](https://github.com/vikejs/vike/commit/d93dfe1fe4b16a8c253032906449d75c1560fd68))
* support .{client,server.shared}.js for pointer imports ([285fedb](https://github.com/vikejs/vike/commit/285fedbe561f376aa897caabf5d35b7f907792f6))



## [0.4.210](https://github.com/vikejs/vike/compare/v0.4.209...v0.4.210) (2024-12-17)


### Bug Fixes

* change Vite 6 default port from `5731` to `3000` ([9d68312](https://github.com/vikejs/vike/commit/9d6831246019dc6032c91521de1e948dbf228ea1))


### Features

* `pageContext.pageContextNavigation` ([#2002](https://github.com/vikejs/vike/issues/2002)) ([5e317ec](https://github.com/vikejs/vike/commit/5e317ec4cc5228860ad5a943c231aa4e61a5a084))



## [0.4.209](https://github.com/vikejs/vike/compare/v0.4.208...v0.4.209) (2024-12-12)


### Bug Fixes

* error message typo ([a4576ad](https://github.com/vikejs/vike/commit/a4576ad727fec566029097703cd8b2c220950128))
* improve warning upon side exports ([8d0a7ba](https://github.com/vikejs/vike/commit/8d0a7ba576fb52268c2c6e28dac2a22bd01355db))
* show proper error message upon wrong onRenderHtml usage ([c3e6b54](https://github.com/vikejs/vike/commit/c3e6b5427710f24cc4f4b850948ce6bf1628815b))
* tolerate side exports in + files ([2e1d6de](https://github.com/vikejs/vike/commit/2e1d6decd88543f7c12834fc91720fd6cee8cfc2))
* update @brillout/vite-plugin-server-entry ([bcc7ba6](https://github.com/vikejs/vike/commit/bcc7ba6a75d4dd6962aefe682e228e54e826b4ce))



## [0.4.208](https://github.com/vikejs/vike/compare/v0.4.207...v0.4.208) (2024-12-09)


### Bug Fixes

* update @brillout/json-serializer ([#2016](https://github.com/vikejs/vike/issues/2016)) ([b4214a8](https://github.com/vikejs/vike/commit/b4214a85188e8e8e83672bb73407657e032697f6))



## [0.4.207](https://github.com/vikejs/vike/compare/v0.4.206...v0.4.207) (2024-12-09)


### Bug Fixes

* improve warning ([ba322c0](https://github.com/vikejs/vike/commit/ba322c00c9a2fe19032ffa5f43fde9f8345ab5df))
* show warning upon `cssCodeSplit: false` ([#1993](https://github.com/vikejs/vike/issues/1993)) ([bc2d5a8](https://github.com/vikejs/vike/commit/bc2d5a8dd1e75eed3d9daf5e86f7c21ad63afb1a))


### Features

* [experimental] getMiddlewares() ([0d8ef7e](https://github.com/vikejs/vike/commit/0d8ef7e6f644606fb47f33cb7ce73b97a6811c5c))
* [experimental] new config +middleware ([d19051a](https://github.com/vikejs/vike/commit/d19051a20d786ed1703bc6fa61a55a0f956f55d6))



## [0.4.206](https://github.com/vikejs/vike/compare/v0.4.205...v0.4.206) (2024-11-30)


### Bug Fixes

* fix error message handling ([558b60d](https://github.com/vikejs/vike/commit/558b60defef512bc2c20cc6dcaac2488b494651d))
* improve error message upon unexpected module ID ([#1985](https://github.com/vikejs/vike/issues/1985)) ([796c72f](https://github.com/vikejs/vike/commit/796c72f44e4ad6a21a78f0ba5fc75311bf52bb4f))
* show warning upon CSS duplication ([#1815](https://github.com/vikejs/vike/issues/1815)) ([5ef458c](https://github.com/vikejs/vike/commit/5ef458ceeae1d13d2e2e2a0f3a398b9135da7ffe))



## [0.4.205](https://github.com/vikejs/vike/compare/v0.4.204...v0.4.205) (2024-11-27)


### Bug Fixes

* accept esbuild 0.24 ([ed633d8](https://github.com/vikejs/vike/commit/ed633d864c29d81b84c818c3e038fd62aa8d1c9d))
* add debug logs for firefox history null bug ([#1962](https://github.com/vikejs/vike/issues/1962)) ([29a621a](https://github.com/vikejs/vike/commit/29a621a87d3e4bf454d16bcf8f76b0b4b247287c))
* fix hash URL parsing ([7c752c4](https://github.com/vikejs/vike/commit/7c752c4e90ded8a53120655884667371a0c8342a))
* fix regression of resolving hash URLs (fix [#1987](https://github.com/vikejs/vike/issues/1987)) ([13b4e50](https://github.com/vikejs/vike/commit/13b4e5030950053fc762605e31cf9f0b053518e6))
* make getCacheControl return defaultValue on 5xx server errors ([#1981](https://github.com/vikejs/vike/issues/1981)) ([7f41ba2](https://github.com/vikejs/vike/commit/7f41ba223a7ae03570c0c0d4fa78dc2afb998a2c))
* support large `$ git ls-files` outputs (fix [#1982](https://github.com/vikejs/vike/issues/1982)) ([386d2d8](https://github.com/vikejs/vike/commit/386d2d89aba2e2682de7a81f0b09fe9383fec2f0))


### Features

* add `pageContext` argument to `navigate()` (fix [#1976](https://github.com/vikejs/vike/issues/1976)) ([9a97c22](https://github.com/vikejs/vike/commit/9a97c22f50d4250e3fa7a9ce48459c1e76328101))



## [0.4.204](https://github.com/vikejs/vike/compare/v0.4.203...v0.4.204) (2024-11-20)


### Bug Fixes

* fix export assertion (fix [#1964](https://github.com/vikejs/vike/issues/1964)) ([162a660](https://github.com/vikejs/vike/commit/162a660d3b896ed195c09c9a8b8dc89be350bce3))
* fix resolving of relative URL with hash ([9f54397](https://github.com/vikejs/vike/commit/9f54397eb75a809d6a3f54887290cbea783908f9))
* improve client-side init execution order (fix [#1962](https://github.com/vikejs/vike/issues/1962)) ([#1965](https://github.com/vikejs/vike/issues/1965)) ([1b14559](https://github.com/vikejs/vike/commit/1b145596768fb6151ebe40e0e2b1c6b28898e353))
* improve detection of hash navigation link ([953f625](https://github.com/vikejs/vike/commit/953f625e7f0dd8e0d0b3c08264236ffad3fbcc90))
* improve type of hashOriginal and searchOriginal ([6c69cb5](https://github.com/vikejs/vike/commit/6c69cb5ad550e5a3a6a9a9beed8f77eade15121e))
* minor hash scrolling fix ([b4c0f11](https://github.com/vikejs/vike/commit/b4c0f1168cb32e6ebda9053bb54370a6f0c35caa))
* workaround Firefox bug upon clicking hash link that doesn't change URL (fix [#1962](https://github.com/vikejs/vike/issues/1962)) ([cb7f3ff](https://github.com/vikejs/vike/commit/cb7f3ffdd32f85d6af24d431cf24df7bcce5c61b))



## [0.4.203](https://github.com/vikejs/vike/compare/v0.4.202...v0.4.203) (2024-11-17)


### Bug Fixes

* allow Vike extensions to omit + in file names (vikejs/vike-react[#151](https://github.com/vikejs/vike/issues/151)) ([#1963](https://github.com/vikejs/vike/issues/1963)) ([f9f0c5a](https://github.com/vikejs/vike/commit/f9f0c5a308ee18cac86a02aef34c610abdf310b0))



## [0.4.202](https://github.com/vikejs/vike/compare/v0.4.201...v0.4.202) (2024-11-16)


### Bug Fixes

* ignore + files in ejected/ ([1a64227](https://github.com/vikejs/vike/commit/1a642275757d010d9e46dd0779094a8d0bf914d4))
* polish error message ([2ce82b8](https://github.com/vikejs/vike/commit/2ce82b8f96dee75e5b3e3591aee2e4a3b126ab57))
* remove outdated extension name assertion ([efe809b](https://github.com/vikejs/vike/commit/efe809b90f540f0dbaeea0779851b85207ae62e2))
* skip convention for ejected Vike extension ([5584b7d](https://github.com/vikejs/vike/commit/5584b7de4d998b5b1a6ddeaa0b5f661b604d4ee0))



## [0.4.201](https://github.com/vikejs/vike/compare/v0.4.200...v0.4.201) (2024-11-06)


### Bug Fixes

* escape url in HTML (fix [#1949](https://github.com/vikejs/vike/issues/1949)) ([ac84558](https://github.com/vikejs/vike/commit/ac84558b1409a4e33c3fdbe54bc36cf493feb224))
* workaround esbuild bug macos resolve (fix [#1729](https://github.com/vikejs/vike/issues/1729)) ([6e76e5e](https://github.com/vikejs/vike/commit/6e76e5ebd9dcd2ca34cbf9809bd77a24515d6500))



## [0.4.200](https://github.com/vikejs/vike/compare/v0.4.199...v0.4.200) (2024-11-03)


### Bug Fixes

* add debug logs ([#1929](https://github.com/vikejs/vike/issues/1929)) ([60ea36a](https://github.com/vikejs/vike/commit/60ea36a79100a745e28c223fd180f2010d115154))
* fix cross-origin redirect (fix [#1865](https://github.com/vikejs/vike/issues/1865)) ([29f9afc](https://github.com/vikejs/vike/commit/29f9afc1223b173546ed011c038db79e89d069c2))
* fix history.pushState usage ([10966dc](https://github.com/vikejs/vike/commit/10966dc4c48868ec7a499fa04f74e481ebfae718))
* improve log ([c90748a](https://github.com/vikejs/vike/commit/c90748a4dd2b2b85df98a6c51c4aa28bcea8c994))
* re-render same URL upon forward/backward navigation ([6620e1c](https://github.com/vikejs/vike/commit/6620e1cf178e76ebdf7f43c8d40d44da5b594232))
* remove `sirv` dependency ([#1939](https://github.com/vikejs/vike/issues/1939)) ([87d5c46](https://github.com/vikejs/vike/commit/87d5c460144c6480fda5269a86b68ef21994fd01))
* tolerate non-normalized id (fix [#1935](https://github.com/vikejs/vike/issues/1935)) ([749c7bd](https://github.com/vikejs/vike/commit/749c7bd00a0c0404a2658fc0fdc0f0816dda76ce))
* workaround vite-plugin-svgr issue (fix [#1933](https://github.com/vikejs/vike/issues/1933)) ([ed4f15e](https://github.com/vikejs/vike/commit/ed4f15e950156747f47dc13dd9d88aefabace454))


### Features

* onPopstate() ([d7daa00](https://github.com/vikejs/vike/commit/d7daa00db5b8810a36846ed0be0136f0d904d2a1))



## [0.4.199](https://github.com/vikejs/vike/compare/v0.4.198...v0.4.199) (2024-10-13)


### Bug Fixes

* add injectFilter to OnRenderHtml{Async,Sync} ([92f3cf6](https://github.com/vikejs/vike/commit/92f3cf6cf142a67868c0f22d452b9a5d67fad8ed))
* fix early prefetch bug (fix [#1920](https://github.com/vikejs/vike/issues/1920)) ([77f6a27](https://github.com/vikejs/vike/commit/77f6a27f58fa46821e7a0aa0ea8a0f7cd04b38c3))
* fix somefile.client.vue (fix [#1912](https://github.com/vikejs/vike/issues/1912)) ([081c85f](https://github.com/vikejs/vike/commit/081c85f28905d1a94168addb6cbb8e51be1cd7b1))
* forbid using experimental pageContext prefetching (fix [#1915](https://github.com/vikejs/vike/issues/1915)) ([58e216f](https://github.com/vikejs/vike/commit/58e216f2692ce6b1bd6e7083cf06ea9663f82e9d))
* improve type OnRenderHtml{Sync,Async} ([8b9f6ac](https://github.com/vikejs/vike/commit/8b9f6ac481947719949cbd1d118721fad87c8d4b))
* remove isClientSideNavigation assertion (fix [#1910](https://github.com/vikejs/vike/issues/1910)) ([05a4973](https://github.com/vikejs/vike/commit/05a4973e6142c0abd8e4129653acc44d8cda4f90))



## [0.4.198](https://github.com/vikejs/vike/compare/v0.4.197...v0.4.198) (2024-10-02)


### Bug Fixes

* allow absolute URLs to be passed to navigate() and prefetch() ([29ab56f](https://github.com/vikejs/vike/commit/29ab56fd49f8be4599a87a039152ca1e1c55bb21))
* assertUsage() import strings (vikejs/vike-solid[#127](https://github.com/vikejs/vike/issues/127)) ([11810cf](https://github.com/vikejs/vike/commit/11810cf377b3e7bd1d705e9487efd28cbd295c84))
* improve unknown config error message ([c0b828b](https://github.com/vikejs/vike/commit/c0b828b6485b5b166454f271bcdd2efbc3e5d292))
* refactor pointer importer / externalization logic ([828238d](https://github.com/vikejs/vike/commit/828238d77e6643dd3c79829deb77b544716204b5))


### Features

* [experimental] prefetch page context ([#246](https://github.com/vikejs/vike/issues/246)) ([#1617](https://github.com/vikejs/vike/issues/1617)) ([7971d17](https://github.com/vikejs/vike/commit/7971d17bf9416012167e134c3f6c46c46970d924))



## [0.4.197](https://github.com/vikejs/vike/compare/v0.4.196...v0.4.197) (2024-09-25)


### Bug Fixes

* improve removing of all FOUC buster <link> ([df033dd](https://github.com/vikejs/vike/commit/df033ddfbf128d5177423f364235b50d714ef3c1))


### Features

* `+keepScrollPosition` ([#1853](https://github.com/vikejs/vike/issues/1853)) ([3c5eea2](https://github.com/vikejs/vike/commit/3c5eea2425f6ef38ab6aad7a1820422211ab5a66))
* `pageContext.pageId` (closes [#553](https://github.com/vikejs/vike/issues/553)) ([#1894](https://github.com/vikejs/vike/issues/1894)) ([44d14c9](https://github.com/vikejs/vike/commit/44d14c9d82a2e6da3e5a529ff313ad00c161a1a8))



## [0.4.196](https://github.com/vikejs/vike/compare/v0.4.195...v0.4.196) (2024-09-20)


### Bug Fixes

* allow navigate() to be called early in +client.js (fix [#1868](https://github.com/vikejs/vike/issues/1868)) ([9168fb3](https://github.com/vikejs/vike/commit/9168fb3f2b9ceb16c317ab9abe477ecf981d59e2))
* char escape fix ([#1867](https://github.com/vikejs/vike/issues/1867)) ([98f7145](https://github.com/vikejs/vike/commit/98f7145798bb4abe38dbe0786c46d7a51d0ff7cc))
* fix and improve error HTTP response (fix [#1872](https://github.com/vikejs/vike/issues/1872)) ([0634732](https://github.com/vikejs/vike/commit/0634732b9b749efc3b6a59269bcbf8d3db06a749))
* fix config import resolving + make passToClient env server-only (fix [#1882](https://github.com/vikejs/vike/issues/1882)) ([#1886](https://github.com/vikejs/vike/issues/1886)) ([a7151a1](https://github.com/vikejs/vike/commit/a7151a19bd61d423e43c9a0624e96755640aca3a))
* further skip hash links (fix [#1883](https://github.com/vikejs/vike/issues/1883)) ([3f77496](https://github.com/vikejs/vike/commit/3f77496bcdc75295d88137fd1e86b985e3fbc03d))
* make .client.js and .server.js work for dynamic imports (fix [#1861](https://github.com/vikejs/vike/issues/1861)) ([#1884](https://github.com/vikejs/vike/issues/1884)) ([f7e91ba](https://github.com/vikejs/vike/commit/f7e91ba49823a4b1825ad52a8889d803eded1ca5))
* update @brillout/picocolors ([f017481](https://github.com/vikejs/vike/commit/f0174812a16d1aff83cbaeb6564dab8d037d4f32))
* use client router for error page only if possible ([b06195f](https://github.com/vikejs/vike/commit/b06195f8b2da15af171f195480a3f40ebdf7ece5))



## [0.4.195](https://github.com/vikejs/vike/compare/v0.4.194...v0.4.195) (2024-09-07)


### Bug Fixes

* correctly use onPageTransition{Start,End} of previous page ([b39160a](https://github.com/vikejs/vike/commit/b39160af6103c77c9894913b8c972864e88e339b))
* fix URL color regression ([fa12443](https://github.com/vikejs/vike/commit/fa1244309b68f08dadde87da86a961b5d084c7bc))
* improve `injectScriptsAt` condition handling ([#1857](https://github.com/vikejs/vike/issues/1857)) ([8c85511](https://github.com/vikejs/vike/commit/8c85511c04e3f6e43bac747dcea2cfcfb4c09d24))
* improve assertion ([#1852](https://github.com/vikejs/vike/issues/1852)) ([0acb855](https://github.com/vikejs/vike/commit/0acb855ea1235ef35164e93e774163d8166528b1))
* rename STREAM to HTML_STREAM ([#1859](https://github.com/vikejs/vike/issues/1859)) ([483b017](https://github.com/vikejs/vike/commit/483b01731867bcd6ea6a5bc4812ecf10fa7356b5))



## [0.4.194](https://github.com/vikejs/vike/compare/v0.4.193...v0.4.194) (2024-09-04)


### Bug Fixes

* add avif mediatype ([#1832](https://github.com/vikejs/vike/issues/1832)) ([38002cb](https://github.com/vikejs/vike/commit/38002cbcbaeef69b3e5cf52e4b288c98c458ca37))
* always generate an HTTP response `pageContext.httpResponse` ([#1848](https://github.com/vikejs/vike/issues/1848)) ([b45c154](https://github.com/vikejs/vike/commit/b45c1549d2d0ba965bcc7ba7cc10aba24da2579e))
* disallow onRenderHtml() to return null/undefined ([57a2eba](https://github.com/vikejs/vike/commit/57a2eba378c5ed3762b079b3eef7497d0e844d91))
* don't skip invalid URL but throw error instead ([2800dff](https://github.com/vikejs/vike/commit/2800dfff4314fabac8dc245d5ca9e7d3b328f619))
* enforce Base URL instead of showing warning ([8c7c0f4](https://github.com/vikejs/vike/commit/8c7c0f41d3251e84b1c2c85939fe6de9f5373cb7))
* gracefully handle favicon.ico 404 requests ([ff39218](https://github.com/vikejs/vike/commit/ff3921892ecfb4d5e6bcdffdfc8bad38d4e6e8af))
* improve eslint exports workaround (fix [#1838](https://github.com/vikejs/vike/issues/1838)) ([c1d490a](https://github.com/vikejs/vike/commit/c1d490a8291b98f0ebf0cd6ba2dd96dd43fc12ed))
* improve renderPage() validation error messages ([3f4f218](https://github.com/vikejs/vike/commit/3f4f218819dd39d5cc2ae321056197debcbe4967))
* improve Vite request URL check ([9bb3c2d](https://github.com/vikejs/vike/commit/9bb3c2d08f13446b330bf91b2d40f3155a0678ce))
* prettify logged URL ([787bd2d](https://github.com/vikejs/vike/commit/787bd2da80f6cbfb6419ae989f6e4c7361cecf08))
* remove faulty assert() (fix [#1828](https://github.com/vikejs/vike/issues/1828)) ([408f798](https://github.com/vikejs/vike/commit/408f7985ef03176ab36f481ecf17de8dc928476f))
* remove log clearing ([bb6a6c2](https://github.com/vikejs/vike/commit/bb6a6c227402221fea8a3039a438ec8f53e3cc9e))
* throw error upon wrong vite setup ([a8b636d](https://github.com/vikejs/vike/commit/a8b636d3469cced7a1b6ec5b6e2803ee01088ac5))
* update @brillout/vite-plugin-server-entry ([dd850ef](https://github.com/vikejs/vike/commit/dd850efc9f22e589bd948492ea4dfb93860b4f4a))


### Features

* [experimental] pageContext._previousPageContext ([91f6e68](https://github.com/vikejs/vike/commit/91f6e68bc2ba90104287e221fa35a796d4ae968b))



## [0.4.193](https://github.com/vikejs/vike/compare/v0.4.192...v0.4.193) (2024-08-23)


### Bug Fixes

* inject assets map in a reliable way (vikejs/vike-node[#8](https://github.com/vikejs/vike/issues/8)) ([c4d8f61](https://github.com/vikejs/vike/commit/c4d8f619050c3957bf6dfe8040f2612c5e899849))
* update @brillout/vite-plugin-server-entry ([6da64f6](https://github.com/vikejs/vike/commit/6da64f677a383cd712d48e34093b1ee7e36783ce))



## [0.4.192](https://github.com/vikejs/vike/compare/v0.4.191...v0.4.192) (2024-08-23)


### Bug Fixes

* add argument getGlobalContextAsync(isProduction) ([#1826](https://github.com/vikejs/vike/issues/1826)) ([d2ca712](https://github.com/vikejs/vike/commit/d2ca7121e4023e6024fbe25a3160a8982e96f62e))
* fix providePageContext() type ([142a999](https://github.com/vikejs/vike/commit/142a9991a3bbdba2fe7a09fe850d1a8e9f86f4f4))
* update @brillout/vite-plugin-server-entry ([311c52d](https://github.com/vikejs/vike/commit/311c52d440808c5fea0e3a22bde5996a054a2f7c))
* web stream encoding ([#1821](https://github.com/vikejs/vike/issues/1821)) ([5d81041](https://github.com/vikejs/vike/commit/5d81041b1605d655ba5fe1838b10390e81befe96))


### Features

* [experimental][temporary] getPageFilesAllSafe() ([#1823](https://github.com/vikejs/vike/issues/1823)) ([59d5e23](https://github.com/vikejs/vike/commit/59d5e2303042e8ac7b02afe2a0aa0a9ad699db71))
* expose eager meta config ([dffe6a2](https://github.com/vikejs/vike/commit/dffe6a23729358af8cae1731a1d166dfcb46b5e7))
* new option 'prerender' for disableAutoFullBuild ([#1824](https://github.com/vikejs/vike/issues/1824)) ([a9b66fe](https://github.com/vikejs/vike/commit/a9b66fe43145d8ed3791680af5c4dcca0b98d654))


### Performance Improvements

* eagerly load user files ([b8d3619](https://github.com/vikejs/vike/commit/b8d36192f0580db1b019329d05597bd64a6366f1))



## [0.4.191](https://github.com/vikejs/vike/compare/v0.4.190...v0.4.191) (2024-08-20)


### Features

* export providePageContext() ([94c527f](https://github.com/vikejs/vike/commit/94c527f752eb294ff85daf77fea2d3e621858bc4))



## [0.4.190](https://github.com/vikejs/vike/compare/v0.4.189...v0.4.190) (2024-08-20)


### Bug Fixes

* improve built css file names ([ac192a4](https://github.com/vikejs/vike/commit/ac192a4b0a24777d96b98093ccf81799887038f9))
* support fake paths upon disable CSS bundling (fix [#1818](https://github.com/vikejs/vike/issues/1818)) ([6dfac95](https://github.com/vikejs/vike/commit/6dfac95352edc476981bfae9461f2af660702c53))



## [0.4.189](https://github.com/vikejs/vike/compare/v0.4.188...v0.4.189) (2024-08-20)


### Bug Fixes

* avoid untracked async flow ([178c3b7](https://github.com/vikejs/vike/commit/178c3b7529ae6b375b368cbb9620e3ad0343bf19))
* fix config inheritance (fix [#1802](https://github.com/vikejs/vike/issues/1802)) ([#1817](https://github.com/vikejs/vike/issues/1817)) ([94c0c43](https://github.com/vikejs/vike/commit/94c0c43d5d29c96521bc63167f976099fe34c8fc))
* workaround CSS module HMR (fix [#1127](https://github.com/vikejs/vike/issues/1127)) ([373ae21](https://github.com/vikejs/vike/commit/373ae21adb2b6a55054d986bdaac8ff9d2611b43))



## [0.4.188](https://github.com/vikejs/vike/compare/v0.4.187...v0.4.188) (2024-08-19)


### Bug Fixes

* improve built css file names ([#1815](https://github.com/vikejs/vike/issues/1815)) ([d5ebcdc](https://github.com/vikejs/vike/commit/d5ebcdcacf76d0ba07399411db630da5c8c32192))
* support virtual modules upon disabling CSS bundling (fix [#1816](https://github.com/vikejs/vike/issues/1816)) ([#1815](https://github.com/vikejs/vike/issues/1815)) ([17ed1f2](https://github.com/vikejs/vike/commit/17ed1f2db763e88695d1840b22e18e58e5dd792b))



## [0.4.187](https://github.com/vikejs/vike/compare/v0.4.186...v0.4.187) (2024-08-19)


### Bug Fixes

* disable CSS bundling (fix [#1815](https://github.com/vikejs/vike/issues/1815)) ([420e8f5](https://github.com/vikejs/vike/commit/420e8f52546a2bae9e894558c96915270904a85e))
* improve support for user-defined manualChunk ([80d6c55](https://github.com/vikejs/vike/commit/80d6c55501d30681b48d6e1e9bf5b75e1dda7d7c))



## [0.4.186](https://github.com/vikejs/vike/compare/v0.4.185...v0.4.186) (2024-08-18)


### Bug Fixes

* fix rollupOptions.output.manualChunks passthrough ([8d75b15](https://github.com/vikejs/vike/commit/8d75b155d0aeced5bc128d3a52800d1b505b36ad))



## [0.4.185](https://github.com/vikejs/vike/compare/v0.4.184...v0.4.185) (2024-08-18)


### Bug Fixes

* avoid CSS code duplication ([#1815](https://github.com/vikejs/vike/issues/1815)) ([35c0916](https://github.com/vikejs/vike/commit/35c0916b38491e96e454b0b94800ce50a9c3f653))
* improve error message ([9e92b7e](https://github.com/vikejs/vike/commit/9e92b7e462dd84e0106bc77959035cc4255805ec))
* support IPV6 (fix [#1808](https://github.com/vikejs/vike/issues/1808)) ([7048cc1](https://github.com/vikejs/vike/commit/7048cc125bd1a3c783ca1e676aac3b6483fc0417))
* support latest esbuild versions ([0ad7dc7](https://github.com/vikejs/vike/commit/0ad7dc7db8a0980ffed1023531d473723433315c))



## [0.4.184](https://github.com/vikejs/vike/compare/v0.4.183...v0.4.184) (2024-08-12)


### Bug Fixes

* stop using `createServer()` to distinguish dev/prod (fix [#1791](https://github.com/vikejs/vike/issues/1791)) ([38f60f1](https://github.com/vikejs/vike/commit/38f60f148e97562b2af00b4379bff68b634c8196))
* streamReadableWebToString encoding ([#1799](https://github.com/vikejs/vike/issues/1799)) ([6268228](https://github.com/vikejs/vike/commit/62682283574d0c83914a4e470dbef9057e1cd1d0))


### BREAKING CHANGES

* Update to `vite@5.1.0` or above.



## [0.4.183](https://github.com/vikejs/vike/compare/v0.4.182...v0.4.183) (2024-08-08)


### Bug Fixes

* also exclude vike/getPageContext from optimizeDeps ([4405294](https://github.com/vikejs/vike/commit/4405294d03eddcc45a959bae45cd9b0b074209d4))
* more lightweight and succint client-side err msg ([83bd1b7](https://github.com/vikejs/vike/commit/83bd1b7f3f6cf700a6a8248637674e7b2e409e31))



## [0.4.182](https://github.com/vikejs/vike/compare/v0.4.181...v0.4.182) (2024-07-29)


### Bug Fixes

* fix import.meta.env security check (fix [#1764](https://github.com/vikejs/vike/issues/1764)) ([ee50efa](https://github.com/vikejs/vike/commit/ee50efa944535d01b392b0f52691dd01ba3b4f26))
* improve file-env error message ([#1769](https://github.com/vikejs/vike/issues/1769)) ([163123b](https://github.com/vikejs/vike/commit/163123ba15b269f09c038542ac343d3a96d84382))
* skip file-env check upon Vite scan (fix [#1768](https://github.com/vikejs/vike/issues/1768)) ([2f53249](https://github.com/vikejs/vike/commit/2f53249bf8c4bb7c3a9da261487ad5d73ca465e7))


### Features

* new meta config `global` ([#1772](https://github.com/vikejs/vike/issues/1772)) ([785730b](https://github.com/vikejs/vike/commit/785730b5dfafde4d2d02288e5ae19361284cdbee))



## [0.4.181](https://github.com/vikejs/vike/compare/v0.4.180...v0.4.181) (2024-07-19)


### Bug Fixes

* add assertUsage() to navigate() (fix [#1751](https://github.com/vikejs/vike/issues/1751)) ([01873ad](https://github.com/vikejs/vike/commit/01873ad65fe0dfe6e03210dd7d3ad50043a170d3))
* add missing getPageContext() type pointer ([39f5754](https://github.com/vikejs/vike/commit/39f57543e0643e7ee263475d8887516f599e4b79))
* always hard redirect upon external URL ([24641cd](https://github.com/vikejs/vike/commit/24641cd638e5dd9588f135a920dc18de55199cc9))
* condense client-side error message ([3a7b262](https://github.com/vikejs/vike/commit/3a7b26218ea739e982cded3ccc168063340fab6a))
* don't try to remove Base URL from pageContext.urlLogical or pageContext._urlRewrite ([0d35bc9](https://github.com/vikejs/vike/commit/0d35bc9038c93dd7fbba062c082acf881a8f8edc))
* fix * redirection ([c9f5331](https://github.com/vikejs/vike/commit/c9f5331276248c4bc06fe488fcf7965958e3953b))
* fix ipfs:// and ipns:// URL handling ([6b75eae](https://github.com/vikejs/vike/commit/6b75eae7d03bf1113d4b5563b9bec4bd9c306b81))
* improve JSDocs ([2eaeea4](https://github.com/vikejs/vike/commit/2eaeea42d91927f27ec34c9a163193e47e36b02c))
* improve prefetch() validation ([2bc59a9](https://github.com/vikejs/vike/commit/2bc59a9c9d93fc210ba7af1919b857b824290159))
* make build deterministic (closes [#1750](https://github.com/vikejs/vike/issues/1750)) ([648cd01](https://github.com/vikejs/vike/commit/648cd01c67e40c10ee35bb4bb0f5d0d55443622a))
* make client-side error message more precise and compact ([ad30cc4](https://github.com/vikejs/vike/commit/ad30cc4a038189fb38403595f7bf9e337e76d43a))


### Features

* modifyUrl() ([fbd3354](https://github.com/vikejs/vike/commit/fbd3354637ff0326f1cf36fa3f1456f8b685150e))
* pageContext.urlParsed.href (closes [#1630](https://github.com/vikejs/vike/issues/1630)) ([d802189](https://github.com/vikejs/vike/commit/d8021898b009033e97ee8a1d543a7c118428cb51))
* pageContext.urlParsed.protocol ([60fdd43](https://github.com/vikejs/vike/commit/60fdd434823c02b3f0c3a712996b46bcc16e742b))



## [0.4.180](https://github.com/vikejs/vike/compare/v0.4.179...v0.4.180) (2024-07-16)


### Bug Fixes

* avoid cloning pageContext on the client-side ([9f4ee04](https://github.com/vikejs/vike/commit/9f4ee04c56206d19b975474acbd963bc3f1c0c02))
* avoid cloning pageContext when routing ([6ade0d5](https://github.com/vikejs/vike/commit/6ade0d5770cea2774c609bd631a7130df7a100fa))
* fix type PageContext['routeParams'] ([1a2bff3](https://github.com/vikejs/vike/commit/1a2bff30a59941593262b75fa8ca18c7d35bffa1))
* improve handling of useConfig() serialization error ([9384166](https://github.com/vikejs/vike/commit/9384166a4f4cbfabd59946434f9fda43738f624b))
* improve serialization error message ([0b717ad](https://github.com/vikejs/vike/commit/0b717ad90a7f7223ddb63cf3de7a0c15b2681da3))
* support `injectScriptsAt: 'STREAM'` ([#1740](https://github.com/vikejs/vike/issues/1740)) ([b0d2d3a](https://github.com/vikejs/vike/commit/b0d2d3a435025aad94e12d51d68e6de676de15a7))
* update react-streaming ([c4d759a](https://github.com/vikejs/vike/commit/c4d759aa9c46974593b633d8c373075acb843023))


### Features

* new setting `injectScriptsAt` ([#1743](https://github.com/vikejs/vike/issues/1743)) ([6a03f74](https://github.com/vikejs/vike/commit/6a03f74a8472f0134380477e1a8a0a5c10a3eb9f))



## [0.4.179](https://github.com/vikejs/vike/compare/v0.4.178...v0.4.179) (2024-07-06)


### Bug Fixes

* remove fouc buster (fix [#1003](https://github.com/vikejs/vike/issues/1003)) ([fae90a1](https://github.com/vikejs/vike/commit/fae90a15d88e5e87ca9fcbb54cf2dc8773d2f229))
* update react-streaming ([#1733](https://github.com/vikejs/vike/issues/1733)) ([c638d40](https://github.com/vikejs/vike/commit/c638d401148bfba74c8637db5d004fbc8c74c0df))



## [0.4.178](https://github.com/vikejs/vike/compare/v0.4.177...v0.4.178) (2024-07-03)


### Bug Fixes

* imporve error message (fix [#1720](https://github.com/vikejs/vike/issues/1720)) ([36d13be](https://github.com/vikejs/vike/commit/36d13bec72a240999dc00d41f2d0f9e567ab87ae))
* improve DEBUG:vike-stream ([ef0eb3d](https://github.com/vikejs/vike/commit/ef0eb3d4fe9af2c39e2876c4431fed983a8b2ef3))
* improve url protocol parsing ([#1719](https://github.com/vikejs/vike/issues/1719)) ([027858d](https://github.com/vikejs/vike/commit/027858d895b45b74fdc398e241e12bfe996ee962))
* make env var STORYBOOK public (fix [#1724](https://github.com/vikejs/vike/issues/1724)) ([51d612a](https://github.com/vikejs/vike/commit/51d612a0a655e27b19338e3659f89a127a025c1e))
* support any URL protocol ([886a99f](https://github.com/vikejs/vike/commit/886a99ff21e86a8ca699a25cee7edc184aa058e4))
* support capacitor protocol (fix [#1706](https://github.com/vikejs/vike/issues/1706)) ([f4a92e0](https://github.com/vikejs/vike/commit/f4a92e0db20eb50e494459d0aba5e1c3f8a6aa81))
* support symlink directories ([#1688](https://github.com/vikejs/vike/issues/1688)) ([ff3d6cd](https://github.com/vikejs/vike/commit/ff3d6cd090d27cbdd606b28f39b83aa218332e2e))
* tolerate injecting to stream after it ended ([#1722](https://github.com/vikejs/vike/issues/1722)) ([3f4283f](https://github.com/vikejs/vike/commit/3f4283fe994b8a55a023d38d560c0a459193bcb2))



## [0.4.177](https://github.com/vikejs/vike/compare/v0.4.176...v0.4.177) (2024-06-17)


### Bug Fixes

* enable setting `env: { client: false, server: false, config: false }` (fix [#1693](https://github.com/vikejs/vike/issues/1693)) ([775d83b](https://github.com/vikejs/vike/commit/775d83b5a10d4afd8ada5e8b7043826ada6f0166))
* fix error message upon mixing old and new design (fix [#1701](https://github.com/vikejs/vike/issues/1701)) ([03270e7](https://github.com/vikejs/vike/commit/03270e79b9d3c6f254d1cadc2f9aa6618ffe7f71))
* improve error message ([6e30d15](https://github.com/vikejs/vike/commit/6e30d1534283df68ca376c0f3ba4a18c8ae8422a))
* improve error messages ([e2c5e93](https://github.com/vikejs/vike/commit/e2c5e9308e80d6c53ea1e949e1d5859084fcf762))
* make onPrerenderStart eager (fix [#1702](https://github.com/vikejs/vike/issues/1702)) ([1442a4a](https://github.com/vikejs/vike/commit/1442a4a49aba081bb72adabc4d3e86be331f73b7))


### Performance Improvements

* remove client-side validation to save KBs ([9168c5b](https://github.com/vikejs/vike/commit/9168c5be9342e4adcfa3d42c7d5c10a09f3ac513))



## [0.4.176](https://github.com/vikejs/vike/compare/v0.4.175...v0.4.176) (2024-06-12)


### Bug Fixes

* fix config inheritance of parentheses directories (fix [#1690](https://github.com/vikejs/vike/issues/1690)) ([fef43b1](https://github.com/vikejs/vike/commit/fef43b17dbb4d49a9c9cdbe79a4e708a55eb28b2))
* fix export assertion ([d4c1df7](https://github.com/vikejs/vike/commit/d4c1df735259b2137a34262ae3b0957b8f805321))



## [0.4.175](https://github.com/vikejs/vike/compare/v0.4.174...v0.4.175) (2024-06-10)


### Bug Fixes

* workaround pseudo headers (fix [#1683](https://github.com/vikejs/vike/issues/1683)) ([8abdb8f](https://github.com/vikejs/vike/commit/8abdb8fbb7c2d0ac6fcfb23576f9825c75465b89))


### Features

* [Filesystem Routing] skip `(someDir)/` directories (closes [#1684](https://github.com/vikejs/vike/issues/1684)) ([d226ee7](https://github.com/vikejs/vike/commit/d226ee776b5a8abf2ab3f7a108154f1abf54811f))



## [0.4.174](https://github.com/vikejs/vike/compare/v0.4.173...v0.4.174) (2024-06-06)


### Bug Fixes

* declare semver dependency (fix [#1676](https://github.com/vikejs/vike/issues/1676)) ([8f0b499](https://github.com/vikejs/vike/commit/8f0b49997f9ccdb5f1f9802b99e723c2bf0f8cce))



## [0.4.173](https://github.com/vikejs/vike/compare/v0.4.172...v0.4.173) (2024-06-05)


### Bug Fixes

* `export type { ImportString }` ([1161acd](https://github.com/vikejs/vike/commit/1161acd6f45d26a037631c238945b01dd1740667))
* add vite.config.js headers to SSR response ([#1669](https://github.com/vikejs/vike/issues/1669)) ([605b4a5](https://github.com/vikejs/vike/commit/605b4a502fc5e34ea8948216ddee607e9a558666))
* always show assert stack traces upon DEBUG=vike:error ([a437fe9](https://github.com/vikejs/vike/commit/a437fe9b67375cb124889eeee7e28db438caa854))
* enforce Vike extension conventions ([be770f2](https://github.com/vikejs/vike/commit/be770f2edcecf051c0556e0774e7b77b614b529f))
* fix deducing of extension name ([2c361cc](https://github.com/vikejs/vike/commit/2c361cc87228304af728164cc3615bd0900b7e9e))
* move dev code outside of prod runtime ([5d69efa](https://github.com/vikejs/vike/commit/5d69efa41688c1608fff215646b8641bc6a99b66))
* prettify logged URL ([#1658](https://github.com/vikejs/vike/issues/1658)) ([ea2b76c](https://github.com/vikejs/vike/commit/ea2b76c5fd96298f7b5b750c78a4993f11e1b2c2))
* remove ImportString from pageContext.config type ([1b7b761](https://github.com/vikejs/vike/commit/1b7b7613f9364e617341f5285b27646a72592edf))
* remove outdated Bun workaround ([6701c7b](https://github.com/vikejs/vike/commit/6701c7b4bfeb0fd23cccc6bd870ff4ade72c2267))
* remove too strict convention ([7b30d71](https://github.com/vikejs/vike/commit/7b30d7197dbee6545e4b0db65744d619f34c569c))
* support pre-releases for require setting ([24e2d90](https://github.com/vikejs/vike/commit/24e2d909ab49f128711e96de31d544a574a74c71))
* support UTF-9 file paths (fix [#1658](https://github.com/vikejs/vike/issues/1658)) ([a7cc8ad](https://github.com/vikejs/vike/commit/a7cc8adb3f8ccdf2718ad334280d232b3c6069a5))


### Features

* [experimental] new setting crawl.git (closes [#1655](https://github.com/vikejs/vike/issues/1655)) ([c1b0884](https://github.com/vikejs/vike/commit/c1b08840bd2a0d741bffc78a045edbc77fbf64f4))
* new setting `clientHooks` (closes [#1671](https://github.com/vikejs/vike/issues/1671)) ([c1dcd5f](https://github.com/vikejs/vike/commit/c1dcd5f3c01eee8cb888912f0860d30b87f71521))
* new setting `require` for Vike extensions (fix [#1668](https://github.com/vikejs/vike/issues/1668)) ([5ceeb1a](https://github.com/vikejs/vike/commit/5ceeb1ac0affae3de47bf4d881f477dccea62a94))



## [0.4.172](https://github.com/vikejs/vike/compare/v0.4.171...v0.4.172) (2024-05-26)


### Bug Fixes

* add CJS/ESM error hint ([90101cd](https://github.com/vikejs/vike/commit/90101cd1c5c5635ca9049ee3fc50386f9d0fa163))
* add hint for React's invalid hook call ([42c3173](https://github.com/vikejs/vike/commit/42c31737fc615d150eafd66f66fa009db40a9f15))
* further preserve pageContext property getters ([155b2ea](https://github.com/vikejs/vike/commit/155b2ea045f9732991bfb8b5757d146a8f087cba))
* improve & simplify passToClient error ([0c459cc](https://github.com/vikejs/vike/commit/0c459cc5b7f12372187a4e345f0d608ad8d0ee14))
* improve cumulative support, and fix bugs ([c14c8d0](https://github.com/vikejs/vike/commit/c14c8d08a99053606fc3c199b1506cb79be24c13))
* improve error hint messag ([e02a1b6](https://github.com/vikejs/vike/commit/e02a1b632da3bb040ae3c97c7853b447079384ea))
* improve warning stack traces ([9af790a](https://github.com/vikejs/vike/commit/9af790a11bd4183047f628837b932264f257373b))
* make client-side script order determinisic also in dev ([#1468](https://github.com/vikejs/vike/issues/1468)) ([a3be198](https://github.com/vikejs/vike/commit/a3be1984ab8d80bff5a4048aeef18b3275334d94))
* pointer imports used anywhere in config object ([b4ba6b7](https://github.com/vikejs/vike/commit/b4ba6b70e6bdc2e1f460c0d2e4c3faae5d0a733c))
* polish error message ([ff5af85](https://github.com/vikejs/vike/commit/ff5af85172ee25f2804a44824e1f4e1b1a1bd213))
* polish HTML errors ([642566b](https://github.com/vikejs/vike/commit/642566be420a08e2badaf0310c3e5cf22f9effae))
* remove faulty logErrorHint() assertion ([061f51e](https://github.com/vikejs/vike/commit/061f51e8b5bedc4a1998cc83e559bacd5e79eaac))


### Features

* [experimental] `pageContext.source` and `pageContext.from` ([#1268](https://github.com/vikejs/vike/issues/1268)) ([8cc0de4](https://github.com/vikejs/vike/commit/8cc0de484d98172792370f4ea5661454015cade9))
* add headers to pageContext in dev ([2ea822a](https://github.com/vikejs/vike/commit/2ea822a3dc742e49385a2f1bc937454d0c04510d))
* cumulative for non-serializable configs ([da4f0c3](https://github.com/vikejs/vike/commit/da4f0c37d4c4310f39b769a24112e1c935f39ded))
* getPageContext() ([b2d327e](https://github.com/vikejs/vike/commit/b2d327ec358fe0cc24a5975d5ad3e71c408c116b))
* pageContext.headersOriginal ([a78a110](https://github.com/vikejs/vike/commit/a78a1101956fa0f5e41b96e13a09342584014838))
* support +client.js for all render modes (closes [#1468](https://github.com/vikejs/vike/issues/1468)) ([6e37128](https://github.com/vikejs/vike/commit/6e371286c04f53e37ed00ec23b71bbe6c033339f))
* Vike.ConfigResolved ([978d69d](https://github.com/vikejs/vike/commit/978d69d3a5209b8990165f70ddb7fa76a364ebdd))



## [0.4.171](https://github.com/vikejs/vike/compare/v0.4.170...v0.4.171) (2024-04-20)


### Bug Fixes

* fix meta env change upon `.server.js`/`.client.js`/`.shared.js` ([#1588](https://github.com/vikejs/vike/issues/1588)) ([f3f2b2f](https://github.com/vikejs/vike/commit/f3f2b2fb517c7890f66a8265a65e05fc70123b4f))



## [0.4.170](https://github.com/vikejs/vike/compare/v0.4.169...v0.4.170) (2024-04-20)


### Bug Fixes

* fix distinguishing npm package imports from path aliases ([7ee74f4](https://github.com/vikejs/vike/commit/7ee74f483e88d7e7140544dc95771f72e0ccb1f7))



## [0.4.169](https://github.com/vikejs/vike/compare/v0.4.168...v0.4.169) (2024-04-20)


### Bug Fixes

* always pass pageContext.routeParams to client-side (fix vikejs/vike-react[#104](https://github.com/vikejs/vike/issues/104)) ([241100f](https://github.com/vikejs/vike/commit/241100fb19ab612372f99162ba851b97a9385fd1))
* avoid empty file name in dist/ ([d3b3014](https://github.com/vikejs/vike/commit/d3b30148a0ccc88cbdfa7c1313b9ad543bb6ab71))
* improve configDefinedAt type ([b6e2cb2](https://github.com/vikejs/vike/commit/b6e2cb2d3c82e6d96470696324dfb553fa78e807))
* improve route string globbing ([3a45aa2](https://github.com/vikejs/vike/commit/3a45aa2995b04f45543d42713296791402312c68))
* let user decide stack trace size ([b950341](https://github.com/vikejs/vike/commit/b9503417a4df30fb1d9b8a5f6004766e1e2bd6a6))
* simplify cumulative ([c880121](https://github.com/vikejs/vike/commit/c8801211f5bdabe740f83169207f47a04818a1af))
* tolerate relative paths starting with a hidden directory (fix [#1589](https://github.com/vikejs/vike/issues/1589)) ([ce94f5c](https://github.com/vikejs/vike/commit/ce94f5c9947a7d167fc5b6234c8204ffda41ba74))
* tolerate unconventional Vanilla Extract Vite plugin (fix [#1592](https://github.com/vikejs/vike/issues/1592)) ([7678a7d](https://github.com/vikejs/vike/commit/7678a7dc2de62441e09ad30ba1424f9fd6084874))



## [0.4.168](https://github.com/vikejs/vike/compare/v0.4.167...v0.4.168) (2024-03-30)


### Bug Fixes

* always use esbuild to resolve import paths (fix [#1580](https://github.com/vikejs/vike/issues/1580)) ([4996ef0](https://github.com/vikejs/vike/commit/4996ef0fe9c2f9fdb824f20c5c4388e80cfa2519))
* clean esbuild errros ([ea598f8](https://github.com/vikejs/vike/commit/ea598f8e2e192510fa44e59ec189737911b0f439))
* don't send superfluous JavaScript Early Hint for HTML-only page (fix [#1574](https://github.com/vikejs/vike/issues/1574)) ([14e4b5e](https://github.com/vikejs/vike/commit/14e4b5e362841ad98a084927ba2a6ed344295b6b))
* enable tools to monkey path `history.pushState()` to listen to Vike navigations ([#1582](https://github.com/vikejs/vike/issues/1582)) ([b4b3e0c](https://github.com/vikejs/vike/commit/b4b3e0ccaa0ab48864cae74a280632f7538c3815))
* improve DX & docs upon using vike-{react,vue,solid} configs without installing (fix [#1578](https://github.com/vikejs/vike/issues/1578)) ([c08a6bb](https://github.com/vikejs/vike/commit/c08a6bbeb8edb2411504a3313ad9c8841fca0c6d))
* improve error message upon non-existing import path in +config.js (fix [#1576](https://github.com/vikejs/vike/issues/1576)) ([1525f69](https://github.com/vikejs/vike/commit/1525f691f32e9bdcb929543f490a042e5be9c9be))
* improve hint for CJS/ESM error ([e0596ba](https://github.com/vikejs/vike/commit/e0596ba47c7476d51b06520e3ec48f8accf8275c))
* improve tmp build file names ([ee414f3](https://github.com/vikejs/vike/commit/ee414f34f5b5e7349d007f612f25ead3dd082122))
* remove superfluous user-land extends warning ([28dc27a](https://github.com/vikejs/vike/commit/28dc27a213d396a8b9094be41bdaf29fa25a8120))



## [0.4.167](https://github.com/vikejs/vike/compare/v0.4.166...v0.4.167) (2024-03-22)


### Bug Fixes

* allow vite-tsconfig-paths again ([a5e2596](https://github.com/vikejs/vike/commit/a5e25969f0787d1caf390fadf2e28cbecdfae155))
* call onPageTransitionStart() earlier (fix [#1560](https://github.com/vikejs/vike/issues/1560)) ([1a3a59f](https://github.com/vikejs/vike/commit/1a3a59f8dfc1d6fe054a5c298df5c304a12f23a5))
* improve DEBUG flags DX ([0f5ac02](https://github.com/vikejs/vike/commit/0f5ac0229900af1964a1efdffda1f54a86cbda80))
* only call page transition hooks if page was rendered before ([e334999](https://github.com/vikejs/vike/commit/e3349998ce75f502967e35c85f3caa014e601780))
* remove faulty assertion (fix [#1571](https://github.com/vikejs/vike/issues/1571)) ([b457127](https://github.com/vikejs/vike/commit/b45712739a1022aa9c2603da85c9f008e21055c3))
* support path aliases that look like npm package imports (fix [#1146](https://github.com/vikejs/vike/issues/1146)) ([8b5827e](https://github.com/vikejs/vike/commit/8b5827efd11ec2af28409d5e43d5e2f146df905d))
* update error message upon no page find found ([#1570](https://github.com/vikejs/vike/issues/1570)) ([d7b56d6](https://github.com/vikejs/vike/commit/d7b56d68c9829b5f2cee59210c201ea77d8228a3))



## [0.4.166](https://github.com/vikejs/vike/compare/v0.4.165...v0.4.166) (2024-03-19)


### Bug Fixes

* add `Vike.Config` to `PageContextConfig` (fix [#1532](https://github.com/vikejs/vike/issues/1532)) ([74b18b0](https://github.com/vikejs/vike/commit/74b18b0dbd21600f0a15d0871da437bc1d57caf1))
* conservatively preserve all assets in dist/server (fix [#1154](https://github.com/vikejs/vike/issues/1154)) ([6dfef11](https://github.com/vikejs/vike/commit/6dfef11d74c420b5d695f0897f1d292f3b8b7e95))
* emphasize CJS/ESM error hint ([3e344b9](https://github.com/vikejs/vike/commit/3e344b9734c267bc43abd7e49402456aebc4cc18))
* generate assets.json early (fix [#1527](https://github.com/vikejs/vike/issues/1527)) ([2598887](https://github.com/vikejs/vike/commit/259888792f8906282951f89d7602ce1c2a601cb8))
* improve handling of unsuable Git ([#1549](https://github.com/vikejs/vike/issues/1549)) ([42d58ff](https://github.com/vikejs/vike/commit/42d58ff9d9aa9eb27c7495e216ecaf3e29970614))
* improve HTTP request error message upon Vike config error ([e405b77](https://github.com/vikejs/vike/commit/e405b7795328582bef08d4a4e24b8fa5abb7170d))
* improve logging upon skipped HTTP request ([0e4145b](https://github.com/vikejs/vike/commit/0e4145b03b2b5d6f6f6673ccc3d0a4084cfe674f))
* improve package.json#exports by adding import export ([#1382](https://github.com/vikejs/vike/issues/1382)) ([c270210](https://github.com/vikejs/vike/commit/c27021060034f5245873cc196e700d5e54cbb427))
* improve package.json#exports by making require export last ([#1382](https://github.com/vikejs/vike/issues/1382)) ([ca218b3](https://github.com/vikejs/vike/commit/ca218b3f9b0277e9ad6f47bae1e5e2d87a076732))
* improve package.json#exports order ([#1382](https://github.com/vikejs/vike/issues/1382)) ([7def2dd](https://github.com/vikejs/vike/commit/7def2ddd8d5019e9f29cc23a9469d767fe8b8bdc))
* injectBreakLines regex speedup ([b3cc3cb](https://github.com/vikejs/vike/commit/b3cc3cb82439a42e2d14ef5b34d70131f7c8e152))
* package.json#exports replace "import" with "default" ([#1382](https://github.com/vikejs/vike/issues/1382)) ([6942f61](https://github.com/vikejs/vike/commit/6942f61589d038a4d3d51f3a7e08fbe1eddf5383))
* rename `triggedBy` to `triggeredBy` (fix [#1563](https://github.com/vikejs/vike/issues/1563)) ([a08160f](https://github.com/vikejs/vike/commit/a08160fb3465d126a49c41863308200e73960493))
* support Electron by adding 'file://' protocol (fix [#1557](https://github.com/vikejs/vike/issues/1557)) ([8eba585](https://github.com/vikejs/vike/commit/8eba58501bb593a26de94543e55145e6c4fa08a7))



## [0.4.165](https://github.com/vikejs/vike/compare/v0.4.164...v0.4.165) (2024-03-01)


### Bug Fixes

* improve error deduping ([9e34c0d](https://github.com/vikejs/vike/commit/9e34c0dd82c372edc82782511e4c01bb665eead8))
* improve error preamble ([d547664](https://github.com/vikejs/vike/commit/d54766478f61b601d42914a65610172c8d410d1d))
* improve logging of errors coming from Vite ([5a42d7d](https://github.com/vikejs/vike/commit/5a42d7d721baec62e655293dec9d80e4e5fa7541))
* remove faulty assert() (fix [#1529](https://github.com/vikejs/vike/issues/1529)) ([9fa3358](https://github.com/vikejs/vike/commit/9fa3358aea51bb0aecb9208aa1ea1a6497402361))
* simplify error handling logic and require >= vite@4.4.0 ([60d6ef4](https://github.com/vikejs/vike/commit/60d6ef4520b844d9d85225bc507a71ef05f7d132))



## [0.4.164](https://github.com/vikejs/vike/compare/v0.4.163...v0.4.164) (2024-02-28)


### Bug Fixes

* fix support for config.build.assetsDir ([#1154](https://github.com/vikejs/vike/issues/1154)) ([407cb5c](https://github.com/vikejs/vike/commit/407cb5cd466767fc3c4e7e07d894973f45bd58ea))
* improve hint for ESM/CJS errors ([a53cd6c](https://github.com/vikejs/vike/commit/a53cd6ce904ce3b3fa1aa7807e5b25c2a4aa0d26))
* re-implement workaround for legacy plugin (fix [#1154](https://github.com/vikejs/vike/issues/1154)) ([2305d5b](https://github.com/vikejs/vike/commit/2305d5b1a2918dfdc3693553efe36ee0e680bea6))
* warn instead of error upon unexpected NODE_ENV value ([#1526](https://github.com/vikejs/vike/issues/1526), [#1482](https://github.com/vikejs/vike/issues/1482)) ([f0bf7ee](https://github.com/vikejs/vike/commit/f0bf7ee8a404b5686545b50ad4b56936c7f6274d))



## [0.4.163](https://github.com/vikejs/vike/compare/v0.4.162...v0.4.163) (2024-02-22)


### Bug Fixes

* always show a passToClient warning (closes [#1494](https://github.com/vikejs/vike/issues/1494)) ([9365fa5](https://github.com/vikejs/vike/commit/9365fa5e429831c7daf639a0edb374810e8e74a1))
* disambiguate value file (fix [#1490](https://github.com/vikejs/vike/issues/1490)) ([b163627](https://github.com/vikejs/vike/commit/b1636273a72e9c15b82d3ff4e730a00f8e3603fa))
* don't try to normalize .pageContext.json URLs ([#1502](https://github.com/vikejs/vike/issues/1502)) ([46e97c0](https://github.com/vikejs/vike/commit/46e97c09a7d3310f2adee9f6ab969ca1c198a552))
* fix client-side error page rendering ([49fe40c](https://github.com/vikejs/vike/commit/49fe40c6640fc3238516b07a7d0c4bfb102bd5a0))
* improve error message upon adding Vike's Vite plugin twice (fix [#1502](https://github.com/vikejs/vike/issues/1502)) ([6812418](https://github.com/vikejs/vike/commit/68124188a60c7b96f7c35ba4739cc05b148d8aeb))
* improve warning upon overwritten config value ([421de1c](https://github.com/vikejs/vike/commit/421de1cb3cb8c7608b73b3e1b65f0f76b2a35656))


### Features

* `getGlobalContext{Sync,Async}()` (fix [#1501](https://github.com/vikejs/vike/issues/1501)) ([dbb52e9](https://github.com/vikejs/vike/commit/dbb52e97b026e1143aa7b826ff160f8d973df509))



## [0.4.162](https://github.com/vikejs/vike/compare/v0.4.161...v0.4.162) (2024-02-17)


### Bug Fixes

* assertUsage() config file extension ([a6c3398](https://github.com/vikejs/vike/commit/a6c3398645561f44b05fe253f1d6721ddb89a4e7))
* explicitly pass through source map avoid Rollup warning (fix [#1481](https://github.com/vikejs/vike/issues/1481)) ([b94db0f](https://github.com/vikejs/vike/commit/b94db0ff66f185fd1b619da3f896f8c6695475c4))
* improve error message upon build when mixing designs ([#1480](https://github.com/vikejs/vike/issues/1480)) ([0e9c635](https://github.com/vikejs/vike/commit/0e9c635b1bd6921bc8f0ae2b4f8904760a2130c4))
* only apply new Vite syntax for V1 design ([#1485](https://github.com/vikejs/vike/issues/1485)) ([5b523fa](https://github.com/vikejs/vike/commit/5b523fa601906f2646e43f0a4f9897f50c2a1882))
* remove superfluous pointer import warning ([0309330](https://github.com/vikejs/vike/commit/03093307b979edcbb50a9aa99fd3e344c4a2b0dd))
* skip transpiling only for extension configs ([bf221a4](https://github.com/vikejs/vike/commit/bf221a41f65b35735de96243c06856c38bfc9971))
* start requiring Vike extensions to set the name setting ([82573a5](https://github.com/vikejs/vike/commit/82573a56fa8c3b101fac85c336eb99b74e9e028d))
* support client entry import ([ba539a4](https://github.com/vikejs/vike/commit/ba539a404408f06ccbf40ffab689c453246509ba))
* transform imports iff .h.js ([b19a853](https://github.com/vikejs/vike/commit/b19a853025eadbe7a100a0c84e4512936f3ada11))
* update @brillout/vite-plugin-server-entry ([ead4a94](https://github.com/vikejs/vike/commit/ead4a94550c213aa3e578b4e421914b053b639e6))
* update warnings around header files / pointer imports ([56687d4](https://github.com/vikejs/vike/commit/56687d49fa12f1a3a93b838b5d4abe165d706929))
* use heuristic to decide whether config import is a pointer/fake import ([563bd60](https://github.com/vikejs/vike/commit/563bd60b625bcd241f6a5b12d502cf3476b8d417))
* use latest Vite interface ([f7e5cd8](https://github.com/vikejs/vike/commit/f7e5cd85d015cc08d3757b305b3f47f1c5f9e4e4))



## [0.4.161](https://github.com/vikejs/vike/compare/v0.4.160...v0.4.161) (2024-02-07)


### Bug Fixes

* add error hint ([#1469](https://github.com/vikejs/vike/issues/1469)) ([5bab863](https://github.com/vikejs/vike/commit/5bab86306d08120ab0be2aba8fd568ba3a91cfb7))
* add missing getReadableNodeStream() type (fix [#1473](https://github.com/vikejs/vike/issues/1473)) ([f473528](https://github.com/vikejs/vike/commit/f47352858b05ab118bda2dee1c74962294039596))
* deprecate `$ vike prerender` options ([fd0065e](https://github.com/vikejs/vike/commit/fd0065e601b625d30b2af733e61486bfddbf7062))
* export fake prefetch() on server-side (fix [#1471](https://github.com/vikejs/vike/issues/1471)) ([937d8d5](https://github.com/vikejs/vike/commit/937d8d5c728896b9abad98533e84ab01b6cf8b15))
* fix internal assertion (fix [#1457](https://github.com/vikejs/vike/issues/1457)) ([2c9e631](https://github.com/vikejs/vike/commit/2c9e6312c7cb14984a874c9e4cf482b45af1f45a))
* fix order of meta merging (fix [#1458](https://github.com/vikejs/vike/issues/1458)) ([a1101c1](https://github.com/vikejs/vike/commit/a1101c17fd966feffc20c92e3d985f216553487d))
* improve guard() error message ([#1457](https://github.com/vikejs/vike/issues/1457)) ([df435bb](https://github.com/vikejs/vike/commit/df435bbdcc2530398e3568cf242d1fc232d92be4))
* prohibit wrong NODE_ENV value upon building ([#1469](https://github.com/vikejs/vike/issues/1469)) ([a49930c](https://github.com/vikejs/vike/commit/a49930c37924a71aac9c14613ecfad5f8fd14e2f))
* rename `export { PROJECT_VERSION }` to `export { version }` ([224ae95](https://github.com/vikejs/vike/commit/224ae953d23fb84619b7ae9141f76d1d23b45ecf))
* sort config value sources ([8297658](https://github.com/vikejs/vike/commit/8297658e148f4ff5ff496f910712fba141e9cefc))
* track config dependencies ([c98e555](https://github.com/vikejs/vike/commit/c98e5556be7a7519d7e719de3094f3416748db07))
* use config.build.ssrEmitAssets workaround ([#1364](https://github.com/vikejs/vike/issues/1364)) ([b198cdb](https://github.com/vikejs/vike/commit/b198cdb7a07a21c75b1573136ef0f41a3e429f0d))



## [0.4.160](https://github.com/vikejs/vike/compare/v0.4.159...v0.4.160) (2024-01-23)


### Bug Fixes

* add debug logs for faulty setups ([#1450](https://github.com/vikejs/vike/issues/1450)) ([2746aa6](https://github.com/vikejs/vike/commit/2746aa64056ae432fce093fb2211102354909034))
* allow `+config.js` to `export { config }` instead of `export default` ([fbfe1bd](https://github.com/vikejs/vike/commit/fbfe1bdaf3173abfb317caacdfc0a3e4cf99d90e))
* avoid loading extension config files twice ([d73533a](https://github.com/vikejs/vike/commit/d73533a4e4ad0c09feb4959d4d9965fde02b2185))
* fix header file warning ([3e25ac7](https://github.com/vikejs/vike/commit/3e25ac7ae74f6858f4e5fc6306a5c9762b684eb4))
* further add JSDoc ([1ab632f](https://github.com/vikejs/vike/commit/1ab632faa925b7a9e8c85029582c43ddc3ec3bc7))
* implement more straightforward assertUsage() upon loading vike/plugin in production ([#1450](https://github.com/vikejs/vike/issues/1450)) ([0304246](https://github.com/vikejs/vike/commit/03042466c25bb73f0017ac3ec4ad3e4c69902c75))
* improve error message upon loading vike/plugin in production (fix [#1450](https://github.com/vikejs/vike/issues/1450)) ([4ed9533](https://github.com/vikejs/vike/commit/4ed95339121486983c3f877def91c1f5e638d007))
* improve logic deciding when imports are transform ([62f4450](https://github.com/vikejs/vike/commit/62f44507619971908cbc435e33ae48e34209aa45))
* make wrong process.env.NODE_ENV value a hard failure ([f3926bd](https://github.com/vikejs/vike/commit/f3926bd78ad345656ccd329177db056d1c67cfa3))
* remove superfluous warning upon non-standard extension config file name ([dc46063](https://github.com/vikejs/vike/commit/dc46063d60efa9327bb3281af4e5570a3a2ea00c))
* skip transpiling config files of extensions ([5e86965](https://github.com/vikejs/vike/commit/5e8696539a04f75938d90129389caf205d53664c))
* small performance boost ([d754c6d](https://github.com/vikejs/vike/commit/d754c6dd0ded676575b592b78d538f8205057a13))



## [0.4.159](https://github.com/vikejs/vike/compare/v0.4.158...v0.4.159) (2024-01-20)


### Bug Fixes

* add <Data> generic to PageContext types ([7e44992](https://github.com/vikejs/vike/commit/7e44992518df7f5b0303b85f9dbc8bcafb89b0d4))
* deprecated old PageContext types ([c6fddba](https://github.com/vikejs/vike/commit/c6fddbafd5d03bb9df0401c8cf6e32111fdcd304))
* remove <Page> generic ([7cb2120](https://github.com/vikejs/vike/commit/7cb21201ac49fd6ba768347312da1339dc23fec2))



## [0.4.158](https://github.com/vikejs/vike/compare/v0.4.157...v0.4.158) (2024-01-18)


### Features

* pageContext.httpResponse.getReadableNodeStream() ([09af9e7](https://github.com/vikejs/vike/commit/09af9e7d0e375577fe7b097fbce1cd3cf2182b7d))



## [0.4.157](https://github.com/vikejs/vike/compare/v0.4.156...v0.4.157) (2024-01-18)


### Bug Fixes

* apply env check also to eager imports (fix [#1423](https://github.com/vikejs/vike/issues/1423)) ([20674a7](https://github.com/vikejs/vike/commit/20674a7faf32d3854bf32eb29a348b32cfe36009))
* enable user to opt-out Vike's rollupOutput.*Names settings ([#1421](https://github.com/vikejs/vike/issues/1421)) ([d07fbe8](https://github.com/vikejs/vike/commit/d07fbe827118677177ef1226afb5ba23fc86fd43))
* fix and improve URL validation for `throw render()` and `throw redirect()` (fix [#1445](https://github.com/vikejs/vike/issues/1445)) ([4b753b8](https://github.com/vikejs/vike/commit/4b753b85143ffda30a0d8c5063f1acc1a429eb68))
* fix root cause for extractAssetsRemoveQuery() bug (fix [#1420](https://github.com/vikejs/vike/issues/1420)) ([3275e1c](https://github.com/vikejs/vike/commit/3275e1c7921c715c4e8dd65331334f34ca1bcbbe))
* improve client-side error handling ([9dcb1e1](https://github.com/vikejs/vike/commit/9dcb1e1f4354d4c81e9aaf04cc63dce8b183ef6b))
* improve deprecation warning ([f230cb3](https://github.com/vikejs/vike/commit/f230cb35d811e20337c8fd8199a0ba018a71ebde))
* improve error message upon invalid filename (fix [#1425](https://github.com/vikejs/vike/issues/1425)) ([04acbac](https://github.com/vikejs/vike/commit/04acbacf2c261b52963bccce9c5fa87019ebbe52))
* pageContext._routeMatch for vite-plugin-vercel ([ad0534c](https://github.com/vikejs/vike/commit/ad0534cb45479408c6e63eccb8f313abb978ac31))
* pick pageContext.urlLogical first (fix [#1436](https://github.com/vikejs/vike/issues/1436)) ([d8d55d2](https://github.com/vikejs/vike/commit/d8d55d27b018eddb55d1c7205d7fcb366bf4a1e5))
* remove faulty crawl assert (fix [#1440](https://github.com/vikejs/vike/issues/1440)) ([e46716d](https://github.com/vikejs/vike/commit/e46716d832215f25148dd57d6d9cc1c2193c0970))
* set ssr.external to true by default ([07b92e3](https://github.com/vikejs/vike/commit/07b92e3c2600c0874aa3101e4042503ba6ef2a31))
* temporarily don't make ssr.external true by default ([1b7b3c5](https://github.com/vikejs/vike/commit/1b7b3c531035d3c4735a343f450a29e52bc87f15))



## [0.4.156](https://github.com/vikejs/vike/compare/v0.4.155...v0.4.156) (2024-01-07)


### Bug Fixes

* update @brillout/vite-plugin-server-entry ([6fc93be](https://github.com/vikejs/vike/commit/6fc93be09ac4062e925e7ee9dd7339026384d6b6))



## [0.4.155](https://github.com/vikejs/vike/compare/v0.4.154...v0.4.155) (2024-01-07)


### Bug Fixes

* update @brillout/vite-plugin-import-build -> @brillout/vite-plugin-server-entry ([81d8de1](https://github.com/vikejs/vike/commit/81d8de160354b565ceeccdf15f1efc7a99453db3))
* whitelist @brillout/import from CJS/ESM error hint ([bb14de3](https://github.com/vikejs/vike/commit/bb14de39ed32ce31fa9362de9705bee79c16f748))



## [0.4.154](https://github.com/vikejs/vike/compare/v0.4.153...v0.4.154) (2024-01-06)


### Bug Fixes

* apply vite.ssrFixStackTrace() to warning stack trace (fix [#1355](https://github.com/vikejs/vike/issues/1355)) ([6415b1c](https://github.com/vikejs/vike/commit/6415b1c3031b360e8fb77c4b70c0fe30aeca1fc7))
* improve slow crawling warning ([5865113](https://github.com/vikejs/vike/commit/58651134ec827307c6aa67ce227995733fd4ebcd))
* increase hook timeouts upon pre-rendering ([61f05c0](https://github.com/vikejs/vike/commit/61f05c0e4ed42ba72b226e6f0f52a14f4b51ecab))
* reliable workaround for Rollup bug ([3e842bb](https://github.com/vikejs/vike/commit/3e842bbe6ef4a19bb0a3a0eb980a333ea2cbbb15))
* remove superfluous and misleading assertion ([fe12f96](https://github.com/vikejs/vike/commit/fe12f966f76fd9a27c63432abe484370fa969076))
* remove superfluous importBuild await ([#1404](https://github.com/vikejs/vike/issues/1404)) ([7fdfa41](https://github.com/vikejs/vike/commit/7fdfa410772baf71322dd347616cfa077f32b9fe))
* show hint upon CJS/ESM errors ([#1358](https://github.com/vikejs/vike/issues/1358), fixes [#621](https://github.com/vikejs/vike/issues/621)) ([2043733](https://github.com/vikejs/vike/commit/2043733a2892bcbea35154fdcd7426c1b5e033da))
* tolerate + anywhere in file paths (fix [#1407](https://github.com/vikejs/vike/issues/1407)) ([159c659](https://github.com/vikejs/vike/commit/159c6595199547db558248d8a3ebc2ca02be356d))
* update @brillout/vite-plugin-import-build ([5f01f30](https://github.com/vikejs/vike/commit/5f01f30259cc90e6b85bf327104718a153f74544))
* update @brillout/vite-plugin-import-build (fix [#1404](https://github.com/vikejs/vike/issues/1404)) ([f84370a](https://github.com/vikejs/vike/commit/f84370a310272636c87be93bdcc28b8e9e4a6ac3))
* workaround Rollup bug ([01ab602](https://github.com/vikejs/vike/commit/01ab6020e6a46f80b1b4e6e0ca3c1f498aac5251))



## [0.4.153](https://github.com/vikejs/vike/compare/v0.4.152...v0.4.153) (2023-12-31)


### Bug Fixes

* improve handling of redundant errors ([c410699](https://github.com/vikejs/vike/commit/c410699680a70de59abec3d90fe36bc88d1acd99))
* improve handling of virtual modules ([#479](https://github.com/vikejs/vike/issues/479)) ([3d25618](https://github.com/vikejs/vike/commit/3d2561887127a5ba8564ba1a98309c77a5325922))
* improve render abort logging ([415899b](https://github.com/vikejs/vike/commit/415899bf77d58d474b99f1c2c5dda41ee705a1f0))
* mitigate risk of infinite reloading page ([c21cea2](https://github.com/vikejs/vike/commit/c21cea215cea832930563a1380f2e40f1b61ceea))
* properly handle errors thrown in onHydrationEnd() and onPageTransition{Start,End}() ([ad532e0](https://github.com/vikejs/vike/commit/ad532e08272392afa150e2a25549657c8a346e24))
* properly handle errors thrown in onRenderClient ([6f928f9](https://github.com/vikejs/vike/commit/6f928f9ee6c1eeaf8279e9ee3b8180d987ba10c0))
* use simplier dynamic import (fix [#1393](https://github.com/vikejs/vike/issues/1393)) ([06c1fd5](https://github.com/vikejs/vike/commit/06c1fd57376891766792ecc2a3ae248ff0b231df))



## [0.4.152](https://github.com/vikejs/vike/compare/v0.4.151...v0.4.152) (2023-12-26)


### Bug Fixes

* don't inject script preload tags for HTML-only pages (fix [#1379](https://github.com/vikejs/vike/issues/1379)) ([e8c6494](https://github.com/vikejs/vike/commit/e8c6494ca56befed80af98b987bf7be7582e3a44))


### Features

* cacheControl setting ([bb7fd09](https://github.com/vikejs/vike/commit/bb7fd09c46730d638b45a89f5db35f2ac4188f6b))
* generic `<Data>` type for `onBeforePrerenderStart()` ([29f265b](https://github.com/vikejs/vike/commit/29f265b35832c7b882ab1a6414afef88f5cbc0b4))
* redirect to URI without http protocal (closes [#1380](https://github.com/vikejs/vike/issues/1380)) ([58f404c](https://github.com/vikejs/vike/commit/58f404c2ebf82ca86b56d6cc603603d2008cc9cf))



## [0.4.151](https://github.com/vikejs/vike/compare/v0.4.150...v0.4.151) (2023-12-22)


### Bug Fixes

* add vike:outDir debug logs ([92240b6](https://github.com/vikejs/vike/commit/92240b65573b0d22555245e5b3d57859bb46d489))
* enable URL redirection that resolves to a URL with @ (fix [#1347](https://github.com/vikejs/vike/issues/1347)) ([469866a](https://github.com/vikejs/vike/commit/469866a3f8a30f8332c7aad002f69d9479250d96))
* fix error message upon loading server-only module on the client-side ([#1335](https://github.com/vikejs/vike/issues/1335)) ([09d362e](https://github.com/vikejs/vike/commit/09d362eb1ab3932d0d994682b865f7be18fda7f8))
* improve debug logs visual formatting ([222b1b2](https://github.com/vikejs/vike/commit/222b1b247a537d0fd02e6cc72dcd03cacf71442a))
* make standalone builds easier ([#1165](https://github.com/vikejs/vike/issues/1165), [#1342](https://github.com/vikejs/vike/issues/1342)) ([f555646](https://github.com/vikejs/vike/commit/f5556463959a35f82b9c78a29ecd15e809ce8401))
* remove assertion (fix [#1359](https://github.com/vikejs/vike/issues/1359)) ([63b1c32](https://github.com/vikejs/vike/commit/63b1c32b10ed90694c8722430cd829c13e0790ef))
* remove wrong assertion ([f91537e](https://github.com/vikejs/vike/commit/f91537ed9869af7cd8407b9c6899819b7b090d28))
* sound URL pathname resolution implementation ([#1347](https://github.com/vikejs/vike/issues/1347)) ([42c1df1](https://github.com/vikejs/vike/commit/42c1df1462a923b954d254e81960370a5ae19cfc))
* update @brillout/vite-plugin-import-build ([c954cbc](https://github.com/vikejs/vike/commit/c954cbc49da08f805e96cdb6d9a7b8bd16504be4))


### Features

* `.server.js` and `.client.js` [#1296](https://github.com/vikejs/vike/issues/1296) (closes [#744](https://github.com/vikejs/vike/issues/744)) ([6178b40](https://github.com/vikejs/vike/commit/6178b403fd08bc9c4ea90483b3808a5b70bc330c))
* data hook ([b61a87e](https://github.com/vikejs/vike/commit/b61a87e70cb4b6cb3c6fe86b58085e4c42239ff4))


### Performance Improvements

* improve crawl speed ([77e1875](https://github.com/vikejs/vike/commit/77e1875cee7fd92e41b1ff5f0d7a7e521f506a12))



## [0.4.150](https://github.com/vikejs/vike/compare/v0.4.149...v0.4.150) (2023-12-08)


### Bug Fixes

* avoid FOUC for virtual style modules (fix [#1327](https://github.com/vikejs/vike/issues/1327)) ([761fec4](https://github.com/vikejs/vike/commit/761fec4191aac3ed986abf1719bc05dfbe67e30b))
* fix pipe() assertion ([#1325](https://github.com/vikejs/vike/issues/1325)) ([aa0ab7b](https://github.com/vikejs/vike/commit/aa0ab7be919e94a946b3907e5880169767989c6d))
* handle cancel() of Web Readable Stream (fix [#1325](https://github.com/vikejs/vike/issues/1325)) ([e18675e](https://github.com/vikejs/vike/commit/e18675e6571b6cbc82f6446ec3102b0c2b6a8ee7))
* remove empty lines from crawl result (fix [#1328](https://github.com/vikejs/vike/issues/1328)) ([544b031](https://github.com/vikejs/vike/commit/544b031eb7b0cab32a1520961eb69533781a09e4))
* support Tailwind edge case (fix [#1330](https://github.com/vikejs/vike/issues/1330)) ([19b2220](https://github.com/vikejs/vike/commit/19b2220f309fe95218db97a067b2ca252694ba3c))
* warn instead of failure upon redundant export (fix [#1323](https://github.com/vikejs/vike/issues/1323)) ([c44ab60](https://github.com/vikejs/vike/commit/c44ab608b328d8376bcf7e57c5586d33aa711eb7))
* whitelist vue alias (fix [#1329](https://github.com/vikejs/vike/issues/1329)) ([d815556](https://github.com/vikejs/vike/commit/d815556d187ed78d637ebe153f79ecedca9c82af))



## [0.4.149](https://github.com/vikejs/vike/compare/v0.4.148...v0.4.149) (2023-12-06)


### Bug Fixes

* add react-streaming to optimizeDeps.exclude ([3073c89](https://github.com/vikejs/vike/commit/3073c8955f52f2c4bf5ad612dc5feccd163611f4))
* fix regression for config.outDir outside of config.root (fix [#1317](https://github.com/vikejs/vike/issues/1317)) ([70e7518](https://github.com/vikejs/vike/commit/70e7518b2eb9b7d767b2463c5174af1b5a63f8c3))
* make Git test more reliable (fix [#1320](https://github.com/vikejs/vike/issues/1320)) ([bd1f159](https://github.com/vikejs/vike/commit/bd1f159d425d7bc01bfcc292af006c0ff9566327))
* stop crawling tracked but deleted plus files ([7bae6de](https://github.com/vikejs/vike/commit/7bae6de5c530634d89f1e6f82ce1120c53f496ec))
* test whether git is installed (fix [#1313](https://github.com/vikejs/vike/issues/1313)) ([7596dcd](https://github.com/vikejs/vike/commit/7596dcd57d846db8adaded4a7bd34353e205ea7f))



## [0.4.148](https://github.com/vikejs/vike/compare/v0.4.147...v0.4.148) (2023-12-04)


### Bug Fixes

* [v1 design] improve DX around header files ([fb58692](https://github.com/vikejs/vike/commit/fb586923ec73b2c15ed25edcbe4cd839f6c8e177))
* assertUsage() wrong onBeforeRender() env ([0826fb4](https://github.com/vikejs/vike/commit/0826fb4319ae39842ecadf640fb60f8cc9461aec))
* edge case URL handling (fix [#1281](https://github.com/vikejs/vike/issues/1281)) ([3d1a786](https://github.com/vikejs/vike/commit/3d1a78670b751b1616c28acba8c7e8d1beb98a5a))
* fix Base URL check (fix [#1302](https://github.com/vikejs/vike/issues/1302)) ([0848f62](https://github.com/vikejs/vike/commit/0848f620cffbc8ef69e2ca1aa57d533691d87378))
* improve onBeforeRender() env logic ([#1266](https://github.com/vikejs/vike/issues/1266)) ([2580d69](https://github.com/vikejs/vike/commit/2580d69b532a125edfd65e5fa04336e62a690b7b))
* improve stream warning ([74d84f5](https://github.com/vikejs/vike/commit/74d84f54c2f024cd9b47b1fa7582dfb710003035))
* improve the logical URL that is considered when catching infinite redirect loops (fix [#1270](https://github.com/vikejs/vike/issues/1270)) ([8397523](https://github.com/vikejs/vike/commit/839752366946277744218db32c4a8f1bf8c2da72))
* improve white space handling in URLs ([2fa53b2](https://github.com/vikejs/vike/commit/2fa53b26bc16a812de0faa2e20b68923de4d2e44))
* show deprecating warning for old deprecated design ([6bcd2d0](https://github.com/vikejs/vike/commit/6bcd2d0e3935a998bc075e2e23c9efb1ff6e71ac))


### Features

* enable user to configure hook timeouts ([#1290](https://github.com/vikejs/vike/issues/1290)) ([27229c5](https://github.com/vikejs/vike/commit/27229c5753b1d63187bbde182a1e5abf0e3eeb05))



## [0.4.147](https://github.com/vikejs/vike/compare/v0.4.146...v0.4.147) (2023-11-17)


### Bug Fixes

* [V1 design] implement lazy serializable config values ([e358cc3](https://github.com/vikejs/vike/commit/e358cc3850a033ebb237e8ce19a78da6781a2d1e))
* [V1 design] refactor config.meta[configName].env ([79116f5](https://github.com/vikejs/vike/commit/79116f53fedc1e4ffca16a8e88670470e309200d))
* export version ([cfb9551](https://github.com/vikejs/vike/commit/cfb9551077fbcbef8e84508d494155236987999a))
* make prerender opt-out precede over prerender hooks ([baead9d](https://github.com/vikejs/vike/commit/baead9d1d1fb210932eeef7c8ca3c3fc4d5e40d6))
* support Base URLs with trailing slash (fix [#1258](https://github.com/vikejs/vike/issues/1258)) ([701e2e5](https://github.com/vikejs/vike/commit/701e2e5cf76a0ef73b528bb9d30ec9f6a0809b3d))



## [0.4.146](https://github.com/vikejs/vike/compare/v0.4.145...v0.4.146) (2023-11-14)


### Bug Fixes

* bin path for `$ vike` CLI ([3ee5592](https://github.com/vikejs/vike/commit/3ee55921ca738890d3d3854ec33450082a32e2e5))
* define prerender value over +prerender.js file ([e6d8513](https://github.com/vikejs/vike/commit/e6d8513fad1f75a293eebd699edfb25199d674c7))
* enable plus files to export null ([2520555](https://github.com/vikejs/vike/commit/25205552b5c216ba1b758d06414533fc48e67760))
* fix back-/forward navigation regression ([#1231](https://github.com/vikejs/vike/issues/1231)) ([0678210](https://github.com/vikejs/vike/commit/06782109c7b94b9b54151335ca98fe6cf46dd3fc))
* turn non re-exported imports error into a warning ([af313b7](https://github.com/vikejs/vike/commit/af313b7db20984241236e379bff212e298d4b954))



## [0.4.145](https://github.com/vikejs/vike/compare/v0.4.144...v0.4.145) (2023-11-13)


### Bug Fixes

* [v1 design] allow cumulative values to be imported ([de18325](https://github.com/vikejs/vike/commit/de183259b297c691e254c0b34adefde061540302))
* [v1 design] further enable configs to be defined in +{configName}.js files ([0b976a6](https://github.com/vikejs/vike/commit/0b976a6c08b003fd14885198e8c29cca89c48250))
* [V1 design] improve meta wrong usage errors ([cf6997e](https://github.com/vikejs/vike/commit/cf6997e8bef38579cb77b677dbd5dfb45ae254d3))
* [V1 design] improve/fix effect() wrong usage error messages ([ec3773f](https://github.com/vikejs/vike/commit/ec3773fbe1f17caffbebe9a0dda05a491ee515b6))
* add client-side error to pageContext.errorWhileRendering ([d195f92](https://github.com/vikejs/vike/commit/d195f921cc76a84aa3cbc506889f03485c0dc5d5))
* add warning when trying to prefetch non-routable URL ([a434afa](https://github.com/vikejs/vike/commit/a434afafa6c72e60459f91389b73e45d4699e858))
* allow "constructor" search param in URL ([adfc183](https://github.com/vikejs/vike/commit/adfc183baea13f45b4c7cc92ec78f85e08a5da2a))
* allow users to use `history.pushState()` ([#1231](https://github.com/vikejs/vike/issues/1231)) ([7f5e99a](https://github.com/vikejs/vike/commit/7f5e99ad7f030a51af9ca8abe7478b222d031b66))
* always check client-side renderability ([aceaa35](https://github.com/vikejs/vike/commit/aceaa3531237492076093cbe9b5b95a715d73be0))
* check whether URL rewrite is client-side renderable ([934c2ef](https://github.com/vikejs/vike/commit/934c2ef0dbd798117444e98abb94b95674a17d79))
* don't show 404 table when terminal isn't width enough (fix [#1219](https://github.com/vikejs/vike/issues/1219)) ([6aef8a6](https://github.com/vikejs/vike/commit/6aef8a6764a32b47f202fdf8716a13105224bd88))
* ensure boundary upon env var static replacing (fix [#1214](https://github.com/vikejs/vike/issues/1214)) ([d687042](https://github.com/vikejs/vike/commit/d68704223ebd50cde512a328788ea935eda2929d))
* fallback to Server Routing if trying to client-side render URL not matching any route ([fb5337e](https://github.com/vikejs/vike/commit/fb5337ee0e8f0fbe63f4edbd2c9a49b27c4d01e2))
* fix preview for partial pre-rendering ([31edf79](https://github.com/vikejs/vike/commit/31edf79f0519dc8138a855a747d8b994118b3b5f))
* fix some typos ([752df95](https://github.com/vikejs/vike/commit/752df953aec60834400fb286cf1235260afdce13))
* further abort outdated client rendering ([5893a2f](https://github.com/vikejs/vike/commit/5893a2f422ac0b887d270a4acb86dab2c1ffe489))
* handle serialization errors caused by getter errors (fix [#1232](https://github.com/vikejs/vike/issues/1232)) ([8664301](https://github.com/vikejs/vike/commit/8664301b9a0baf09b63514d7d5fdce22ada5fc6a))
* improve client-side error handling ([81c3bbd](https://github.com/vikejs/vike/commit/81c3bbd972ceb361d7c6fbc22e38770041193b43))
* improve/fix not pre-renderable page warning (fix [#1252](https://github.com/vikejs/vike/issues/1252)) ([ca10f32](https://github.com/vikejs/vike/commit/ca10f32cd05c50d001c6acf6904deec543636bfa))
* make i18n hook control more robust ([4b7b0b2](https://github.com/vikejs/vike/commit/4b7b0b2bc6ef308924a6b946b6a8f338ea84b53a))
* properly handle eager/lazy config values (fix [#1208](https://github.com/vikejs/vike/issues/1208)) ([e40e9b1](https://github.com/vikejs/vike/commit/e40e9b189068a8936f094c57cfb752207dc6bb02))
* scroll to top upon client-side `throw render()` ([f16cbe5](https://github.com/vikejs/vike/commit/f16cbe53fa93bb41b78aa91f1bec36163dac6140))
* set pageContext.isClientSideNavigation on the client-side (fix [#1243](https://github.com/vikejs/vike/issues/1243)) ([a9895e8](https://github.com/vikejs/vike/commit/a9895e89088bf73719bafc5bebd9ae22452889da))
* show more succint 404 table ([#1219](https://github.com/vikejs/vike/issues/1219)) ([aff81fa](https://github.com/vikejs/vike/commit/aff81fad2da918302ec9960bc7f1c564f1674cd1))
* systematically abort client-side renderering if possible ([85207c9](https://github.com/vikejs/vike/commit/85207c9bec125b1d7b25f7ea87dad91a65d4d2ce))
* workaround regression introduced by vitejs/vite[#14756](https://github.com/vikejs/vike/issues/14756) ([c56391d](https://github.com/vikejs/vike/commit/c56391dd8d7b93443cb650ff3dd128f46ca441ab))



## [0.4.144](https://github.com/vikejs/vike/compare/v0.4.143...v0.4.144) (2023-10-23)


### Bug Fixes

* [v1 design] allow export name to match config name ([051f3e7](https://github.com/vikejs/vike/commit/051f3e73e41c4a5e9179124919b0590c8c0daf86))
* [v1 design] always check env consistency of resolve import paths ([8444966](https://github.com/vikejs/vike/commit/8444966c6424b240f54c9a29a33d020e0bed4ac0))
* [v1 design] don't assert re-exports of value files ([4a86ab4](https://github.com/vikejs/vike/commit/4a86ab421785d82fe006cf32084b8d1d05d8133a))
* [v1 design] improve error handling of config effects ([4034f86](https://github.com/vikejs/vike/commit/4034f86cac342097dccdab7da8da7857ee16d827))
* [v1 design] more succinct logs ([11c207a](https://github.com/vikejs/vike/commit/11c207a5d9143c0b9bc0c8f7f104a9b5bfd22f45))
* [v1 design] only tolerate side exports for value files ([ad8e233](https://github.com/vikejs/vike/commit/ad8e233bca7bf67742276984555a2c280cb0fa3a))
* [v1 design] use absolute file paths to check for consistent env ([0cd8de6](https://github.com/vikejs/vike/commit/0cd8de6f899cff08a791a0e0788be9bbb1de9c8a))
* 404 table layout: strip ansi ([76a5530](https://github.com/vikejs/vike/commit/76a553022706f63152e6529e31e626499e090411))
* add/improve pageContext.urlOriginal JSDoc ([e93d5e9](https://github.com/vikejs/vike/commit/e93d5e928f8fe245946c5e15ee018c7ae886fb14))
* apply Rollup 4 breaking change ([521b895](https://github.com/vikejs/vike/commit/521b895b6f041a028e4b1d33ecc79c9a0e3d47cf))
* assertUsage() route value ([14def35](https://github.com/vikejs/vike/commit/14def35100f38468cf47452c0cede09e5580aeb3))
* await async `onPageTransition{Start,End}` ([58f822b](https://github.com/vikejs/vike/commit/58f822b8f8880f9168478a1956ff8ed6997d06da))
* be stricter about side exports ([8b553f8](https://github.com/vikejs/vike/commit/8b553f850d8c59782fe7567a5b00ea05fb08595c))
* don't glob +files in dist/ ([b25fbb2](https://github.com/vikejs/vike/commit/b25fbb25b7d4d49eaea2127180ed8d070cd29d90))
* don't glob page files in dist/ ([db783c9](https://github.com/vikejs/vike/commit/db783c9622827808fd8be179193d9da1fdf04e3d))
* don't glob page files in dist/ // [#1189](https://github.com/vikejs/vike/issues/1189) ([4e8d082](https://github.com/vikejs/vike/commit/4e8d082ed9d7e9aecd87d4319183cdbb80f9d918))
* expose type `Url` (fix [#1184](https://github.com/vikejs/vike/issues/1184)) ([dc6fea0](https://github.com/vikejs/vike/commit/dc6fea0d7a72ca8666616f51358cc8b7698cbcf8))
* improve JSDoc ([8b0c0a2](https://github.com/vikejs/vike/commit/8b0c0a2733365b2a263ca523fe295e9bf58eda83))
* improve TypeScript's IntelliSense QuickInfo of PageContext and PageContextClient ([3fd1378](https://github.com/vikejs/vike/commit/3fd13788f5023e5227df5e31a25c8f830a4edd16))
* properly handle undefined return value (fix [#1179](https://github.com/vikejs/vike/issues/1179)) ([f03b42d](https://github.com/vikejs/vike/commit/f03b42d0fa872b33db2547e4831458b6edf90303))
* update boilerplates to use Vike.PageContext ([a69556b](https://github.com/vikejs/vike/commit/a69556b53d1e83c1ec12233690a5b1ad5d78f451))


### Features

* hooks types, e.g. https://vike.dev/onBeforeRender#typescript ([b3a4709](https://github.com/vikejs/vike/commit/b3a4709d8e029f6e0fd014d998daf1186a986912))



## [0.4.143](https://github.com/vikejs/vike/compare/v0.4.142...v0.4.143) (2023-10-08)


### Bug Fixes

* [v1 design] further use @brillout/json-serializer instead of JSON.stringify for serializing config values (fix [#1159](https://github.com/vikejs/vike/issues/1159)) ([50a417c](https://github.com/vikejs/vike/commit/50a417c7ee1319b68b6e84a4b8c8f7079ea70bcd))
* [v1 design] make unused import an error instead of a warning (fix [#1159](https://github.com/vikejs/vike/issues/1159)) ([ac0bb99](https://github.com/vikejs/vike/commit/ac0bb99f8828d98d88a2525564b90f7c0b9eeabe))
* [V1 design] support NodeNext import paths with file extension (fix [#1142](https://github.com/vikejs/vike/issues/1142)) ([7d2383c](https://github.com/vikejs/vike/commit/7d2383cbfd46e56f7b1b0eb9062568f1c98fe1e5))
* add hint to error upon unknown config ([5e62d95](https://github.com/vikejs/vike/commit/5e62d95303330d8a12be4f66ad2a9c9cc252bffb))
* fix defineConfig implementation ([#1156](https://github.com/vikejs/vike/issues/1156)) ([463fad8](https://github.com/vikejs/vike/commit/463fad89d0001958b90f7f1defcff9ec0ecb885b))
* improve CJS warning ([aa6af48](https://github.com/vikejs/vike/commit/aa6af4861ac1f20e93fe8dab3fd9890ed609b50d))
* improve suppressing of expected Rollup warnings ([acfc159](https://github.com/vikejs/vike/commit/acfc1590f7fa3a7a4fa230f4b7d997bf65623cc0))
* relative URL resolving (fix [#1155](https://github.com/vikejs/vike/issues/1155)) ([937cb3b](https://github.com/vikejs/vike/commit/937cb3b8a8a0480bfe5b992db3a31fbef081739e))
* remove problematic assertion for legacy plugin (fix [#1154](https://github.com/vikejs/vike/issues/1154)) ([279d82b](https://github.com/vikejs/vike/commit/279d82b1e99adc81b6bf09b47fa23453a34f4320))
* remove vike from ssr.noExternal (fix [#1163](https://github.com/vikejs/vike/issues/1163)) ([86abfd5](https://github.com/vikejs/vike/commit/86abfd54091baae5a8140adb35524eb29599d653))
* suppress expected Rollup warning about Solid transformed code (batijs/bati[#89](https://github.com/vikejs/vike/issues/89)) ([7111abb](https://github.com/vikejs/vike/commit/7111abb4d89c8ad535d963b7c9e74a969eea9aa3))
* update @brillout/vite-plugin-import-build ([2dfbf8a](https://github.com/vikejs/vike/commit/2dfbf8aa1c82e1b198aa7ce9fd4cdf48240a7948))
* update @brillout/vite-plugin-import-build ([e5018ae](https://github.com/vikejs/vike/commit/e5018ae5ea788a31da64ec340b3534935daec8c0))
* update border of not-helpful-error hint ([85e89b8](https://github.com/vikejs/vike/commit/85e89b8fce58f5d54b25d3c00784bb069123fe35))


### Features

* add defineConfig helper (fix [#1156](https://github.com/vikejs/vike/issues/1156)) ([219760b](https://github.com/vikejs/vike/commit/219760ba341835f68219c4dbababd95e5be7dec8))
* add extensive support for glob routes (closes [#1167](https://github.com/vikejs/vike/issues/1167)) ([42b51df](https://github.com/vikejs/vike/commit/42b51dfe3a1b8d40e7f28d99016363c47c8ab64e))



## [0.4.142](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.141...v0.4.142) (2023-09-22)


### Bug Fixes

* add vite-plugin-ssr -> Vike rename warning ([fbc46ad](https://github.com/brillout/vite-plugin-ssr/commit/fbc46ad3ce0950956e518fe3737ff3600d6c4e46))
* improve invalid path alias error message ([16e41f3](https://github.com/brillout/vite-plugin-ssr/commit/16e41f3189137b402ed1f3a600b759db4c41cc90))
* improve invalid path alias handling ([7d7b240](https://github.com/brillout/vite-plugin-ssr/commit/7d7b240a3142ca4d7ffc46ffdd44c98130c0e51f))
* improve manifest.json location ([5baecef](https://github.com/brillout/vite-plugin-ssr/commit/5baecef1d816bfd34930cdab6c1e3df8996acc8d))
* make URL parsing more robust for users shimming `window` in Node.js ([b324757](https://github.com/brillout/vite-plugin-ssr/commit/b3247573c5798fe9fefd014338d71753136af123))


### Features

* provide new type `PageContext` and enable users to extend it ([785821b](https://github.com/brillout/vite-plugin-ssr/commit/785821bb79c903907374c58a0d01058ae3ac3c7f))


### Performance Improvements

* don't use try catch in url parsing ([#1115](https://github.com/brillout/vite-plugin-ssr/issues/1115)) ([f1b34b0](https://github.com/brillout/vite-plugin-ssr/commit/f1b34b04c514d215d2102d280f0689331f95f168))



## [0.4.141](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.140...v0.4.141) (2023-09-15)


### Bug Fixes

* `throw redirect(/some-url/, 301)` (fix [#1104](https://github.com/brillout/vite-plugin-ssr/issues/1104)) ([64f684f](https://github.com/brillout/vite-plugin-ssr/commit/64f684f8e8709b1e0fb8ae06570120b4291e72be))
* +config.h.js prerender flag ([2c58da8](https://github.com/brillout/vite-plugin-ssr/commit/2c58da83abbcd3b2d6720838040f39ceb996a451))
* add hint to error message upon invalid route string ([c1537dc](https://github.com/brillout/vite-plugin-ssr/commit/c1537dcf2bd7725ae9690606cd31ec9f51b7dc69))
* add missing config type to PageContextBuiltInServer ([362d69c](https://github.com/brillout/vite-plugin-ssr/commit/362d69c3cb98b165038de8262a04aab2203d29a1))
* avoid overriding meta ([f2ec4bd](https://github.com/brillout/vite-plugin-ssr/commit/f2ec4bd44d98dcf8a0604234da702f3019f36765))
* enable vike-* packages to seamlessly extend Config using interface merging ([894c039](https://github.com/brillout/vite-plugin-ssr/commit/894c03903265f0fc7ed4d09e8d4c126316b10198))
* external redirects (fix [#1103](https://github.com/brillout/vite-plugin-ssr/issues/1103)) ([7343a85](https://github.com/brillout/vite-plugin-ssr/commit/7343a85f11fc7115a41659c0aeb76a6eb1fc1b4b))
* further discourage loading multiple versions (fix [#1108](https://github.com/brillout/vite-plugin-ssr/issues/1108)) ([3a66e95](https://github.com/brillout/vite-plugin-ssr/commit/3a66e952396b739bbedb6f8f8d7bac1d64026e90))
* further use colors instead of backtick in error messages ([3cdb970](https://github.com/brillout/vite-plugin-ssr/commit/3cdb9707bd6ad0969dd004612efebaaf5fb3861e))
* further use colors instead of backtick in error messages ([6739302](https://github.com/brillout/vite-plugin-ssr/commit/6739302e8e71eb4fc1f5c6098caf6a75f785fbdb))
* further use colors instead of backtick in error messages ([0f23c0d](https://github.com/brillout/vite-plugin-ssr/commit/0f23c0d2ac9c22d46f2828e3bb0b0bc52d733e46))
* further use colors instead of backtick in error messages ([b178539](https://github.com/brillout/vite-plugin-ssr/commit/b1785391d5ecf2f85ec5f38143503012125db313))
* further use colors instead of backtick in error messages ([2296914](https://github.com/brillout/vite-plugin-ssr/commit/229691493d90e505a2cae9b74da2f03171f0bcb9))
* improve error message about non-default exports ([58f8b2f](https://github.com/brillout/vite-plugin-ssr/commit/58f8b2fb5fbcea2f3ee28cbc9b0c741440c8d225))
* improve error message upon code defined inside header files ([687c5b2](https://github.com/brillout/vite-plugin-ssr/commit/687c5b25b42a264d7730bbdec8a4b8bfb7106643))
* improve JSDoc of `throw redirect()` ([2ce54a2](https://github.com/brillout/vite-plugin-ssr/commit/2ce54a2d6834d133a271b4d787530d4260be537c))
* improve log colors ([b936aee](https://github.com/brillout/vite-plugin-ssr/commit/b936aee111a78ead7274f6929000e4897b906039))
* improve serialization error message ([1bedc8a](https://github.com/brillout/vite-plugin-ssr/commit/1bedc8a76f7388fb269c188f3d0ba782e744713c))
* improve wrong redirection usage error ([83f8586](https://github.com/brillout/vite-plugin-ssr/commit/83f8586f47f59eda03613fe5bd53a4eb2ab0dd44))
* intercept log for `throw redirect()` ([950ebd0](https://github.com/brillout/vite-plugin-ssr/commit/950ebd0212c7717be5135c28d0e253ca4aacb561))
* make inheritance check consider whole path segments (fix [#1109](https://github.com/brillout/vite-plugin-ssr/issues/1109)) ([5bd8c1e](https://github.com/brillout/vite-plugin-ssr/commit/5bd8c1e128cad87d04ba5d54af1eda788dc69f54))
* set Page type to unknown instead of any by default ([412a26a](https://github.com/brillout/vite-plugin-ssr/commit/412a26aed262b868ef250265173372525d706a07))
* set pageContext.is404 upon throw render(404) (fix [#1107](https://github.com/brillout/vite-plugin-ssr/issues/1107)) ([9dd96c3](https://github.com/brillout/vite-plugin-ssr/commit/9dd96c31104e34f2cd9dc9313ccce0906a81dff1))
* use colors instead of backtick in error messages ([a052d52](https://github.com/brillout/vite-plugin-ssr/commit/a052d52656fd084d2df5f44502ddfad892aec97b))
* use colors instead of quotes in error messages ([ceb7af8](https://github.com/brillout/vite-plugin-ssr/commit/ceb7af8ec059159e0eea90f2a60b084af8691591))


### Features

* [V1 design] cumulative ([25af958](https://github.com/brillout/vite-plugin-ssr/commit/25af9587611e0bdf8df993f7c8f027460c0206aa))
* new namespace `Vike` to enable users to refine type `Config` ([c0e909d](https://github.com/brillout/vite-plugin-ssr/commit/c0e909d4e4e58ff506f02889773f0e927d4ccfde))
* static external redirections ([#926](https://github.com/brillout/vite-plugin-ssr/issues/926)) ([fa02b0e](https://github.com/brillout/vite-plugin-ssr/commit/fa02b0e0d1b1fc38689888482a6da629374f9e1b))
* static glob redirections ([#926](https://github.com/brillout/vite-plugin-ssr/issues/926)) ([80a15a1](https://github.com/brillout/vite-plugin-ssr/commit/80a15a110f3140001486e776af55e07a1917e00b))



## [0.4.140](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.139...v0.4.140) (2023-08-30)


### Bug Fixes

* allow 410 status code (fix [#1097](https://github.com/brillout/vite-plugin-ssr/issues/1097)) ([ac52a24](https://github.com/brillout/vite-plugin-ssr/commit/ac52a24b88adab168c404dcfd433074cf55581b7))
* log redirect target ([afc81e9](https://github.com/brillout/vite-plugin-ssr/commit/afc81e95849618be12886c12a00683be313eafe0))
* show log upon permanent redirect defined by config.redirects ([4eb8f59](https://github.com/brillout/vite-plugin-ssr/commit/4eb8f59fa220714c7cd59fec332f914c15f5e596))


### Features

* config.trailingSlash and config.disableUrlNormalization ([#949](https://github.com/brillout/vite-plugin-ssr/issues/949), [#926](https://github.com/brillout/vite-plugin-ssr/issues/926)) ([7c8fc28](https://github.com/brillout/vite-plugin-ssr/commit/7c8fc28e2be07c643f20e0480ec832c5aa98fae3))



## [0.4.139](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.138...v0.4.139) (2023-08-26)


### Bug Fixes

* forbid vite-tsconfig-paths (fix [#1060](https://github.com/brillout/vite-plugin-ssr/issues/1060)) ([8192d28](https://github.com/brillout/vite-plugin-ssr/commit/8192d2822064d4e391c78eb8c21e1dd617cdd01b))
* show iKnowThePerformanceRisksOfAsyncRouteFunctions deprecation warning ([9fd3748](https://github.com/brillout/vite-plugin-ssr/commit/9fd37484e10890f8c4f4d887ecd2452eda1c5d2d))



## [0.4.138](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.137...v0.4.138) (2023-08-24)


### Bug Fixes

* add null to onBeforeRender type ([#1075](https://github.com/brillout/vite-plugin-ssr/issues/1075)) ([fefc63e](https://github.com/brillout/vite-plugin-ssr/commit/fefc63ead5959aec6e6344f53b049d9cafeb2139))
* enable adding urlParsed to passToClient without triggering hash warning (fix [#1092](https://github.com/brillout/vite-plugin-ssr/issues/1092)) ([bee05be](https://github.com/brillout/vite-plugin-ssr/commit/bee05beb13363f03eee6f8fe55b2ad4dd0c3f391))
* improve error message upon +page.js ([c0979f2](https://github.com/brillout/vite-plugin-ssr/commit/c0979f223d88b08f6d39c2e08459a07f32414c26))
* improve similar known config hint ([9b55367](https://github.com/brillout/vite-plugin-ssr/commit/9b553679d12c2fdc2b5e2e9bdac2c0aec97bb3c3))
* improve urlParsed type ([#1092](https://github.com/brillout/vite-plugin-ssr/issues/1092)) ([be471d4](https://github.com/brillout/vite-plugin-ssr/commit/be471d4d42ee5ef345d125cf9b1284bc29caf24c))
* rename PageContextBuiltIn to PageContextBuiltInServer ([49cd1e6](https://github.com/brillout/vite-plugin-ssr/commit/49cd1e6f547b096c075fcf74f1c05ec2f5c8c00f))



## [0.4.137](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.136...v0.4.137) (2023-08-23)


### Bug Fixes

* [V1 design] improve error messages ([42e3b6c](https://github.com/brillout/vite-plugin-ssr/commit/42e3b6c83f7e5183054f1544a2fa93d32763497c))
* apply config.redirects to URL without Base URL ([7202ab6](https://github.com/brillout/vite-plugin-ssr/commit/7202ab61ad07872335ad69147c00c358d87486f5))
* check whether link is client-side routable only when strictly needed ([#1073](https://github.com/brillout/vite-plugin-ssr/issues/1073)) ([575d48c](https://github.com/brillout/vite-plugin-ssr/commit/575d48c96894627440cee8dff5e0582c279889fd))
* don't call guard() hook for the error page (fix [#1090](https://github.com/brillout/vite-plugin-ssr/issues/1090)) ([4013ac6](https://github.com/brillout/vite-plugin-ssr/commit/4013ac66749dc56769596afb468ab9894102bff9))
* don't pass _abortCaller to client-side ([359bddf](https://github.com/brillout/vite-plugin-ssr/commit/359bddf3c708f07481cd7f16c30a5e188ddbe818))
* expose pageContext.abortStatusCode ([#1077](https://github.com/brillout/vite-plugin-ssr/issues/1077)) ([1f7b92b](https://github.com/brillout/vite-plugin-ssr/commit/1f7b92b9153f3f58f5d33e41678b10ace9e2386b))
* improve RenderErrorPage() dev logging ([2dbc2a2](https://github.com/brillout/vite-plugin-ssr/commit/2dbc2a2dffc6e22ef5ac23780ac1fea70d30b065))
* preserve URL origin upon URL path normalization redirection ([3b43bb7](https://github.com/brillout/vite-plugin-ssr/commit/3b43bb7bf790def4775d5ca58672b502d355fdea))
* remove superfluous Node.js dependency ([fabbee3](https://github.com/brillout/vite-plugin-ssr/commit/fabbee3b5c8e30cdd7c6a09b93ef5b220ce44211))
* show RenderErrorPage() deprecation warning more prominently ([6ba3a2a](https://github.com/brillout/vite-plugin-ssr/commit/6ba3a2a2fc1d8a547ce5b2476cbaea013a3dfe92))
* warn users that still use CJS ([290403b](https://github.com/brillout/vite-plugin-ssr/commit/290403bda286fa39ac7c0233d373207dd02bd459))


### Features

* hook suppressing by setting hook value to `null` (fix [#1075](https://github.com/brillout/vite-plugin-ssr/issues/1075)) ([11202d2](https://github.com/brillout/vite-plugin-ssr/commit/11202d24730af9e9477283f9e921609b421b6865))



## [0.4.136](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.135...v0.4.136) (2023-08-15)


### Bug Fixes

* contentType migration link ([588f5eb](https://github.com/brillout/vite-plugin-ssr/commit/588f5eb9ed10ab5b3f235e661cb85b355f545e08))
* ensure correct Node.js version (fix [#1068](https://github.com/brillout/vite-plugin-ssr/issues/1068)) ([3b305cb](https://github.com/brillout/vite-plugin-ssr/commit/3b305cbb83a3a9667c5ce1565520aaf5dca28033))
* gracefully handle infinite loop of URL redirects/rewrites ([#926](https://github.com/brillout/vite-plugin-ssr/issues/926)) ([522bd0f](https://github.com/brillout/vite-plugin-ssr/commit/522bd0fa3190e31aa4f59e781f7661d1a9569b12))
* improve redirect logging ([#926](https://github.com/brillout/vite-plugin-ssr/issues/926)) ([ec17c1f](https://github.com/brillout/vite-plugin-ssr/commit/ec17c1f2a2a92c209fba3676d30286ee84f7c3fa))
* stop superfluous copying of publicDir for dist/server/ ([de43088](https://github.com/brillout/vite-plugin-ssr/commit/de4308860847d286af071f37157c11fb9e428a4d))


### Features

* config.redirects ([#926](https://github.com/brillout/vite-plugin-ssr/issues/926)) ([c230680](https://github.com/brillout/vite-plugin-ssr/commit/c2306806a653f5fbe9f7ca85aa97c2fc54802169))



## [0.4.135](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.134...v0.4.135) (2023-08-05)


### Bug Fixes

* also skip assertPassToClient when previous read was __v_raw (fix [#1041](https://github.com/brillout/vite-plugin-ssr/issues/1041)) ([ec0122b](https://github.com/brillout/vite-plugin-ssr/commit/ec0122b5f300b2f41ca21c0dc979df22ec9654ec))
* call onBeforeRender for the first render if it's client-only (fix [#1043](https://github.com/brillout/vite-plugin-ssr/issues/1043)) ([ddf2e39](https://github.com/brillout/vite-plugin-ssr/commit/ddf2e39ca8210ae17654dd4991a39d9605fe8110))
* oven-sh/bun[#3743](https://github.com/brillout/vite-plugin-ssr/issues/3743) - Support Bun ([45aa3ec](https://github.com/brillout/vite-plugin-ssr/commit/45aa3ec3f3b622dd7aded0b75ca95f3b2ed3972b))
* properly handle frame error with id windows path (fix [#1053](https://github.com/brillout/vite-plugin-ssr/issues/1053)) ([6a760d1](https://github.com/brillout/vite-plugin-ssr/commit/6a760d167f767546efe561e43685d0831a780902))
* warn when trying to access the URL hash on the server-side (fix [#1042](https://github.com/brillout/vite-plugin-ssr/issues/1042)) ([f0f6c0a](https://github.com/brillout/vite-plugin-ssr/commit/f0f6c0a761d4a9a6dbe5ca7f556861cbff1975cd))



## [0.4.134](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.133...v0.4.134) (2023-08-03)


### Bug Fixes

* align vite(-plugin-ssr) tag colors ([b71d927](https://github.com/brillout/vite-plugin-ssr/commit/b71d9276be0a17724fef73e556d808d63fbb0263))
* also install require shim in dev ([40b6836](https://github.com/brillout/vite-plugin-ssr/commit/40b6836f4651d7619973b74a1db59c826111202b))
* also retrieve pageContext JSON when pageContextInit adds custom props ([bbc6d12](https://github.com/brillout/vite-plugin-ssr/commit/bbc6d122e27b9c3de96731784836e77f48366e71))
* call client-side guard() hook after retrieving pageContext from server ([fee58b2](https://github.com/brillout/vite-plugin-ssr/commit/fee58b2613ab4735ca198bab620d2f0460109957))
* consolidate `throw renderErrorPage()` and `throw renderUrl()` into a single utility `throw render()` ([#926](https://github.com/brillout/vite-plugin-ssr/issues/926)) ([3c2be02](https://github.com/brillout/vite-plugin-ssr/commit/3c2be027841d4b38cc5abfde6db9ea34f817b641))
* fetch server-side pageContext before calling client-side onBeforeRender hook ([c7d574c](https://github.com/brillout/vite-plugin-ssr/commit/c7d574c8f6331e8146bda3d3ec00ef62f6736349))
* fix error page client-side rendering ([cb82f14](https://github.com/brillout/vite-plugin-ssr/commit/cb82f14196959461a5b2012cfeb024663facea9f))
* gracefully handle non-serializable pageContext values ([9bedf61](https://github.com/brillout/vite-plugin-ssr/commit/9bedf61e7f0c00ee7ef7426faa30e5cb7fa75598))
* hide redirect() statusCode option ([#926](https://github.com/brillout/vite-plugin-ssr/issues/926)) ([5ae9243](https://github.com/brillout/vite-plugin-ssr/commit/5ae924312657ce60286806acdb0d2fdd7889c2f3))
* improve 404 hint ([f9bd674](https://github.com/brillout/vite-plugin-ssr/commit/f9bd6746b603380c74077e0c9ac6e50c34295368))
* improve client-side handling of non-serializable/missing pageContext value ([ed5335f](https://github.com/brillout/vite-plugin-ssr/commit/ed5335f98ee26fd880f28bc22516f369f1e4f946))
* improve error message upon client runtime conflict ([#750](https://github.com/brillout/vite-plugin-ssr/issues/750)) ([62a4bf8](https://github.com/brillout/vite-plugin-ssr/commit/62a4bf848a20101e14392207f3599040fecbc463))
* improve error upon aborting pre-rendering ([#926](https://github.com/brillout/vite-plugin-ssr/issues/926)) ([3226c3e](https://github.com/brillout/vite-plugin-ssr/commit/3226c3eb2ba8cb0cbf0df6823346a134f7e79ac0))
* improve error upon invalid config.build.outDir (fix [#1046](https://github.com/brillout/vite-plugin-ssr/issues/1046)) ([d958a41](https://github.com/brillout/vite-plugin-ssr/commit/d958a41497477c3edb2f4d929f5caa015be47df6))
* improve logging of abort errors ([#926](https://github.com/brillout/vite-plugin-ssr/issues/926)) ([61d3f71](https://github.com/brillout/vite-plugin-ssr/commit/61d3f7119d7e6cb38242e1f27cc816fb2ec21d46))
* improve require shim ([56fc5b3](https://github.com/brillout/vite-plugin-ssr/commit/56fc5b3e945a1086dab5259a2c2e341768e44e86))
* improve routes table ([40818a6](https://github.com/brillout/vite-plugin-ssr/commit/40818a6fc26f38c32128244fdc9a092ca0f70767))
* improve serialization error ([b720277](https://github.com/brillout/vite-plugin-ssr/commit/b72027751e869c03d301d9bc33a1969517d0cb7c))
* set `includeAssetsImportedByServer` to `true` by default ([67aa8d4](https://github.com/brillout/vite-plugin-ssr/commit/67aa8d4cf3edd474c52b45066ffa1affeb62338f))
* show warning instead of error upon dangerous HTML strings ([#999](https://github.com/brillout/vite-plugin-ssr/issues/999)) ([846a92e](https://github.com/brillout/vite-plugin-ssr/commit/846a92ee74ad2f006ebd60fae60a3625fbc12e6a))
* simplify and improve warning about error page missing ([668e971](https://github.com/brillout/vite-plugin-ssr/commit/668e971faba2e3d4dc3755b71cf8832e7f3ae4cb))
* use more nominal hook lifecycle for client-side error page rendering ([145e9ba](https://github.com/brillout/vite-plugin-ssr/commit/145e9ba0225efc7e302aa18bcd613e39dd7536f7))
* V1 design config HMR minor fix ([ad15d8c](https://github.com/brillout/vite-plugin-ssr/commit/ad15d8ca42815215272d0ac5a992d264302d5bd8))


### Features

* `throw reload()` ([#926](https://github.com/brillout/vite-plugin-ssr/issues/926)) ([6d86708](https://github.com/brillout/vite-plugin-ssr/commit/6d8670895498ab834a5c33fceb0cd75aa2329255))
* automatically normalize and redirect URLs ([#926](https://github.com/brillout/vite-plugin-ssr/issues/926), fix [#949](https://github.com/brillout/vite-plugin-ssr/issues/949)) ([4b774bc](https://github.com/brillout/vite-plugin-ssr/commit/4b774bc1762201b93ddb0373369016bc7f82f4d6))
* `trhow redirect()` ([#926](https://github.com/brillout/vite-plugin-ssr/issues/926)) ([199e6a7](https://github.com/brillout/vite-plugin-ssr/commit/199e6a7ec8d52ea65924aa2f00f4ea6ea50aba76))



## [0.4.133](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.132...v0.4.133) (2023-07-04)


### Bug Fixes

* also convert resolved config.build.outDir to POSIX path ([#935](https://github.com/brillout/vite-plugin-ssr/issues/935)) ([9ae9aa2](https://github.com/brillout/vite-plugin-ssr/commit/9ae9aa21616527e1c72802adff0983780eaf3a38))
* don't assume UserConfig.build.outDir to be a POSIX path ([#935](https://github.com/brillout/vite-plugin-ssr/issues/935)) ([3f235bc](https://github.com/brillout/vite-plugin-ssr/commit/3f235bc84becf2f6940a622bce633eb87c94dd07))
* forbid config value files to live in different environments ([80ab2e2](https://github.com/brillout/vite-plugin-ssr/commit/80ab2e252d5280affd0459124075c3c39aa9e180))
* handle HMR for config dependency file removal/creation ([1880172](https://github.com/brillout/vite-plugin-ssr/commit/1880172a59d24e77ff286ec243842d031be3857e))
* make CLI parsing more robust (fix [#990](https://github.com/brillout/vite-plugin-ssr/issues/990)) ([36ffa2b](https://github.com/brillout/vite-plugin-ssr/commit/36ffa2b3533864a2df6abbd3f415ae6426eef593))
* remove isNpmPackage() assertions from client-side bundle ([2f35023](https://github.com/brillout/vite-plugin-ssr/commit/2f350236b0e3e809c2f5f292cdba6daa60d7ad9a))
* respect `disableAutoFullBuild: false` (fix [#990](https://github.com/brillout/vite-plugin-ssr/issues/990)) ([36814e9](https://github.com/brillout/vite-plugin-ssr/commit/36814e995d4a7075b363af239e329200fa6373dd))
* support HMR for config file imports ([53616d0](https://github.com/brillout/vite-plugin-ssr/commit/53616d0b496d83ddcd1854c95c2b9b05f084e428))
* tolerate missing global context ([150f3ea](https://github.com/brillout/vite-plugin-ssr/commit/150f3ea5f0a1f397b1a7e3c64820387a09612bb3))
* tolerate non-conventional path aliases ([461ea84](https://github.com/brillout/vite-plugin-ssr/commit/461ea840e3a553c1907dd764f1151a952dab2315))
* workaround Vite swallowing handleHotUpdate() errors ([81d2582](https://github.com/brillout/vite-plugin-ssr/commit/81d25820120e50d5664c1ed157b4025077edb8b2))


### Features

* improve environment variables support ([30d0027](https://github.com/brillout/vite-plugin-ssr/commit/30d0027ee9c181109e424b69d8e49c3ff472dd18))



## [0.4.132](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.131...v0.4.132) (2023-06-23)


### Bug Fixes

* [error-handling] ensure debug note is shown whenever an error is swallowed ([4d2e482](https://github.com/brillout/vite-plugin-ssr/commit/4d2e4821d19938130720a6351d3755c22021b338))
* [V1 design] handle removed/added + files ([6bd930c](https://github.com/brillout/vite-plugin-ssr/commit/6bd930c5fed5fc51198819b425498dddbdbc6be2))
* [V1 design] impose `.h.js` ([744247a](https://github.com/brillout/vite-plugin-ssr/commit/744247ab63168b0b51ae9d44c2346008c5c2d614))
* [V1 design] invalidate virtual modules upon removed/added + file ([8e510da](https://github.com/brillout/vite-plugin-ssr/commit/8e510da6e96409e40247fa5c3d793b7b783ceac3))
* [V1 design] make Config['filesystemRoutingRoot'] a string ([42b972f](https://github.com/brillout/vite-plugin-ssr/commit/42b972f18aaf83e0f5034d58649eeaa1f3b8fab8))
* [V1 design] simplify Config type for non-header files ([e13542b](https://github.com/brillout/vite-plugin-ssr/commit/e13542b2a32e3e7722e82870f5a6874b1afc3189))
* [V1 design] skip +*.telefunc.js files ([fc97459](https://github.com/brillout/vite-plugin-ssr/commit/fc974593c6756847e5700426a05d3283bb6e94e1))
* add deprecation notice to wrong RenderErrorPage import ([b82c51e](https://github.com/brillout/vite-plugin-ssr/commit/b82c51ee47bd6a2e60c3b34ef61f07c210ca1458))
* add fixtures ([75c42e9](https://github.com/brillout/vite-plugin-ssr/commit/75c42e9c463f7828163a77328c09cb37920af012))
* add JSDoc comment to RenderErrorPage() ([47d43c2](https://github.com/brillout/vite-plugin-ssr/commit/47d43c2d90633998f761c83d416735cdd02250b1))
* further swallow RenderErrorPage() error on the client-side ([ef0e07c](https://github.com/brillout/vite-plugin-ssr/commit/ef0e07c6e12bf5e556caf199251644a19a7d4792))
* improve backwards compatibility of PageContextBuiltIn types ([f1d0cf2](https://github.com/brillout/vite-plugin-ssr/commit/f1d0cf2c9492b30dd21dfda0421233d2dcd48870))
* improve error equivalence check ([fddc417](https://github.com/brillout/vite-plugin-ssr/commit/fddc4174743cb4e52f2e17228792035c8e859c8f))
* improve error message upon mixing a Web Stream with a Node.js Stream ([#933](https://github.com/brillout/vite-plugin-ssr/issues/933)) ([7ffb373](https://github.com/brillout/vite-plugin-ssr/commit/7ffb37300f8075d13145fa12b3b5255090dcea3b))
* lift need for importBuild.cjs when pre-rendering (fix [#935](https://github.com/brillout/vite-plugin-ssr/issues/935)) ([ec8b2f3](https://github.com/brillout/vite-plugin-ssr/commit/ec8b2f39b2bf26f6e3dce1e18597aa42ac640d39))
* prettify SWC errors ([29b257d](https://github.com/brillout/vite-plugin-ssr/commit/29b257d8f1a4090333c7c06894d0acfa2234bd72))
* refactor error handling ([4678f9f](https://github.com/brillout/vite-plugin-ssr/commit/4678f9f60f6242ead98ea0a1eb144f5f271347ac))
* RenderErrorPage() without any options ([880e65c](https://github.com/brillout/vite-plugin-ssr/commit/880e65ce7b9187ade52e4e30cc01a980629d61d8))
* soft-deprecate async onBeforeRoute() ([7dd7428](https://github.com/brillout/vite-plugin-ssr/commit/7dd7428a0ecafa5483533fae5e557ee84522d117))
* soft-deprecate Async Route Functions ([a101a9c](https://github.com/brillout/vite-plugin-ssr/commit/a101a9c9d3bf15c5eac46699fd7a492ca794dfc6))
* support ESM namespace imports in header files (fix [#945](https://github.com/brillout/vite-plugin-ssr/issues/945)) ([8be32b0](https://github.com/brillout/vite-plugin-ssr/commit/8be32b03d1f522f7aef756d7f9dffc861df6f465))
* update @brillout/vite-plugin-import-build ([b1ed09a](https://github.com/brillout/vite-plugin-ssr/commit/b1ed09a317178c554060120c9d073f6837c1a422))


### Features

* expose pageContext._pageRoutes ([#49](https://github.com/brillout/vite-plugin-ssr/issues/49)) ([2a2c223](https://github.com/brillout/vite-plugin-ssr/commit/2a2c223595ee52b7c667652887bbac331dff17e8))
* implement guard() hook ([91a11a0](https://github.com/brillout/vite-plugin-ssr/commit/91a11a0bcdd06853402e04c53adb779aababede0))
* temporary config `_disableAutomaticLinkInterception` (fix [#918](https://github.com/brillout/vite-plugin-ssr/issues/918)) ([35ca471](https://github.com/brillout/vite-plugin-ssr/commit/35ca471f7763be25ad445d22edbe3417c70ab0c6))



## [0.4.131](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.130...v0.4.131) (2023-05-30)


### Bug Fixes

* [V1 design] add config npm dependencies to optimizeDeps.include ([2b4a84a](https://github.com/brillout/vite-plugin-ssr/commit/2b4a84a0342011f06e604671ec9ebdbe68ee1da9))
* [V1 design] ignore backup files ([062b064](https://github.com/brillout/vite-plugin-ssr/commit/062b0644613e8445f544fd16ace08e796d9a34a9))
* [V1 design] implement filesystem routing for npm package root imports ([ce04fdb](https://github.com/brillout/vite-plugin-ssr/commit/ce04fdb919ac63dc219a835568676b1620909706))
* [V1 design] improve error handling when extends import cannot be ([e70b362](https://github.com/brillout/vite-plugin-ssr/commit/e70b3621fb8a38ff1385c3dd435a9c1842cae738))
* [V1 design] improve type handling of non-header config files ([fa18331](https://github.com/brillout/vite-plugin-ssr/commit/fa1833156fef669f50bade0459771236f5d389bd))
* add .page.server.js?extractAssets to Rollup entries (fix [#911](https://github.com/brillout/vite-plugin-ssr/issues/911)) ([078a2c7](https://github.com/brillout/vite-plugin-ssr/commit/078a2c70dd27bae4e03768ad0c5db40f4b552b1a))
* improve dist/ file names ([d042d69](https://github.com/brillout/vite-plugin-ssr/commit/d042d696ac1844f5a5037c4ffd0a379c0609445e))
* improve handling of manually triggering pre-rendering while config prerender is false ([f4a7f55](https://github.com/brillout/vite-plugin-ssr/commit/f4a7f55cde9c0eeac7319ae9e514edffc14ef736))
* recommend path aliases to follow `#` prefix convention ([2fc2193](https://github.com/brillout/vite-plugin-ssr/commit/2fc2193084924c28d31cdf89acd8560c7d482d01))



## [0.4.130](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.129...v0.4.130) (2023-05-26)


### Bug Fixes

* [V1 design] refactor DX of non-header configs ([26342dd](https://github.com/brillout/vite-plugin-ssr/commit/26342ddd608ee4baee2a07a408edae6e800bca11))



## [0.4.129](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.128...v0.4.129) (2023-05-25)


### Bug Fixes

* add computed URL props as non-enumerable when pre-rendering (fix [#914](https://github.com/brillout/vite-plugin-ssr/issues/914)) ([2784ac9](https://github.com/brillout/vite-plugin-ssr/commit/2784ac938e4840a7ffc679c077cf4ecd7cf5a3f7))
* improve debug infos upon manifest miss ([#911](https://github.com/brillout/vite-plugin-ssr/issues/911)) ([c3975e3](https://github.com/brillout/vite-plugin-ssr/commit/c3975e39371942cb47879d3cf56d2fe0b1b387c2))
* improve error message upon malformed HTML (fix [#913](https://github.com/brillout/vite-plugin-ssr/issues/913)) ([a6799d1](https://github.com/brillout/vite-plugin-ssr/commit/a6799d1cd9f9c372cfb9625e982cd30ac8b76f13))
* improve error message upon setting pageContext.is404 (fix [#912](https://github.com/brillout/vite-plugin-ssr/issues/912)) ([7b0d31d](https://github.com/brillout/vite-plugin-ssr/commit/7b0d31df4688b86e9508ec07eaa4d50800d9e20e))
* refactor and fix render hook validation ([20ae8ad](https://github.com/brillout/vite-plugin-ssr/commit/20ae8ad24b082b6bc7ab9017a39332d9fae50f4b))
* update links to docs ([bf38acc](https://github.com/brillout/vite-plugin-ssr/commit/bf38accef2d578a6a12ae68af125c5206817a89e))



## [0.4.128](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.127...v0.4.128) (2023-05-25)


### Bug Fixes

* temporarily disable non-header file warning ([bdc07e3](https://github.com/brillout/vite-plugin-ssr/commit/bdc07e32822331e4656334fefd7989268055ef7b))



## [0.4.127](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.126...v0.4.127) (2023-05-24)


### Bug Fixes

* [V1 design] add configElement for side exports (fix [#904](https://github.com/brillout/vite-plugin-ssr/issues/904)) ([2c83f7b](https://github.com/brillout/vite-plugin-ssr/commit/2c83f7bacc06569671b6250c03a46fe77e0c6afb))
* [V1 design] don't serialize config-only configs ([943accb](https://github.com/brillout/vite-plugin-ssr/commit/943accb4b8f45b5a724f7fb6cbbe22f67640e969))
* [V1 design] implement JavaScript header files `.h.js`, and `Path` ([5ced26a](https://github.com/brillout/vite-plugin-ssr/commit/5ced26a2a2875e13a5e4dc8a89ca6e8a3bf82c9e))
* [V1 design] improve warning upon invalid +config.js ([8fa9aa5](https://github.com/brillout/vite-plugin-ssr/commit/8fa9aa50f0ced387841c2a4e8f7e5bff920c2475))
* [V1 design] make +meta.js work ([81f07c4](https://github.com/brillout/vite-plugin-ssr/commit/81f07c4d51821ab6258cea7d9ce64e437d91cd47))
* [V1 design] make eager loading of value files optional ([cdfd079](https://github.com/brillout/vite-plugin-ssr/commit/cdfd0797b9937680e99304072b590f89366de6db))
* [V1 design] refactor invalidation logic ([3fed5d2](https://github.com/brillout/vite-plugin-ssr/commit/3fed5d2e5b728d2dd7ed1a2b95318b137b1f3577))
* fix error message upon unknown config (fix [#909](https://github.com/brillout/vite-plugin-ssr/issues/909)) ([4b02857](https://github.com/brillout/vite-plugin-ssr/commit/4b02857116408c3f2eaf7f1dcb9b9bff13e09919))
* improve require() shim ([f095b02](https://github.com/brillout/vite-plugin-ssr/commit/f095b02433f0af677a604a5646ae2b3d2fb2c557))



## [0.4.126](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.125...v0.4.126) (2023-05-20)


### Bug Fixes

* [V1 design] catch extends infinite loop ([bf6a22a](https://github.com/brillout/vite-plugin-ssr/commit/bf6a22ac8018de9fd5a4c3277276ed22e27e226c))
* [V1 design] don't assume meta effect() to target an existing config element ([cec8abb](https://github.com/brillout/vite-plugin-ssr/commit/cec8abb24eace0d98aa6fd05d5008314572cbd98))
* [V1 design] fix configDefinedAt ([5f00714](https://github.com/brillout/vite-plugin-ssr/commit/5f00714028f278a4f06eee0cb2a7a5d406e908f3))
* [V1 design] fix prerender config handling ([ee7ad7a](https://github.com/brillout/vite-plugin-ssr/commit/ee7ad7a519a25d4cc32471878f00fb6f24ecd4d8))
* [V1 design] implement filesystemRoutingRoot ([d15142a](https://github.com/brillout/vite-plugin-ssr/commit/d15142a88903755dcb52d76e3c88ff7759b7b45c))
* [V1 design] improve effect() implementation ([3363e1f](https://github.com/brillout/vite-plugin-ssr/commit/3363e1f6df017aa9e7ff825345073e0b6120ef52))
* [V1 design] improve error message upon wrong config value type ([4d1be16](https://github.com/brillout/vite-plugin-ssr/commit/4d1be16c5ea6bf055666e9b52ceff3a5ae13b6a1))
* be more loose in what interface files are considered global (fix [#897](https://github.com/brillout/vite-plugin-ssr/issues/897)) ([de7014f](https://github.com/brillout/vite-plugin-ssr/commit/de7014f1f94192251f3c5721805d8bbd159f2f8f))
* make config inheritance more robust (fix [#897](https://github.com/brillout/vite-plugin-ssr/issues/897)) ([9fccc6f](https://github.com/brillout/vite-plugin-ssr/commit/9fccc6fd3716e31670406bc15ebf12ce42e33ecd))



## [0.4.125](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.124...v0.4.125) (2023-05-18)


### Bug Fixes

* [V1 design] implement partial pre-rendering warning for V1 design ([2bd69f0](https://github.com/brillout/vite-plugin-ssr/commit/2bd69f0e6fa1422018845116a4758c44bb9beb29))
* [V1 design] print real hook name ([189974c](https://github.com/brillout/vite-plugin-ssr/commit/189974c285a55434d5dc6eba54c961cde03aea04))
* [V1 design] print real hook name ([dca30fd](https://github.com/brillout/vite-plugin-ssr/commit/dca30fd243bd7574c376e2d39146268caaf968b0))
* expect pageId to be a npm package ([532ceaa](https://github.com/brillout/vite-plugin-ssr/commit/532ceaa648ab174f0ab581c883cebb642acfe1cc))
* improve handling of undefined and null HTML variables ([648ed9a](https://github.com/brillout/vite-plugin-ssr/commit/648ed9ad2ae2f82094aa8b3f0862eb435e383e9d))
* in dev, warn when escaping HTML (fix [#865](https://github.com/brillout/vite-plugin-ssr/issues/865)) ([038f544](https://github.com/brillout/vite-plugin-ssr/commit/038f5447607d6fbf02fd7309c493f381c803e76b))



## [0.4.124](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.123...v0.4.124) (2023-05-18)


### Bug Fixes

* [V1 design] support `export { frontmatter }` in `.mdx` files (fix [#869](https://github.com/brillout/vite-plugin-ssr/issues/869)) ([9833afa](https://github.com/brillout/vite-plugin-ssr/commit/9833afa27dc3a39a908538f7ce69cb350888d5b8))
* fix internal assertion about eager loading of configValue (fix [#874](https://github.com/brillout/vite-plugin-ssr/issues/874)) ([51f1c80](https://github.com/brillout/vite-plugin-ssr/commit/51f1c8092b3621723c064f95768e684a5dd8640d))
* fix prefetchLinks deprecation notice ([a4b2694](https://github.com/brillout/vite-plugin-ssr/commit/a4b26943d01168e59cff81d8859eb5e45b584492))
* further improve error message upon incorrect setup ([#886](https://github.com/brillout/vite-plugin-ssr/issues/886)) ([2eb6511](https://github.com/brillout/vite-plugin-ssr/commit/2eb65117a153b6d05a55fee2c07da54ba454bd26))
* handle edge case when user wrongfully tries to use `require()` in Vite land (fix [#879](https://github.com/brillout/vite-plugin-ssr/issues/879)) ([896b22e](https://github.com/brillout/vite-plugin-ssr/commit/896b22e7177bc27e85805647966d4ad089d604ce))
* improve error message upon incorrect setup ([#886](https://github.com/brillout/vite-plugin-ssr/issues/886)) ([0096e93](https://github.com/brillout/vite-plugin-ssr/commit/0096e9308d7cbe46808db77d4455cbde95b14658))
* improve error message upon invalid URL provided by `onBeforeRoute()` (fix [#887](https://github.com/brillout/vite-plugin-ssr/issues/887)) ([7def153](https://github.com/brillout/vite-plugin-ssr/commit/7def153efb2dbe590f1d9d89667f3a8b87584577))
* improve prefetchStaticAssets setting values ([#889](https://github.com/brillout/vite-plugin-ssr/issues/889)) ([74225a8](https://github.com/brillout/vite-plugin-ssr/commit/74225a8cf3a14c554e57709479af6606a01381fb))
* improve wrong re-export error message ([#864](https://github.com/brillout/vite-plugin-ssr/issues/864)) ([6ca3639](https://github.com/brillout/vite-plugin-ssr/commit/6ca3639f8f4eb76cde9c910047d1b9d000823b1c))
* link to `?extractExportNames` bug workaround (closes [#864](https://github.com/brillout/vite-plugin-ssr/issues/864)) ([a2a4880](https://github.com/brillout/vite-plugin-ssr/commit/a2a48804c8d6cd9b3ec954d52a561ee4c2ac7594))


### Features

* data-prefetch-static-assets (closes [#889](https://github.com/brillout/vite-plugin-ssr/issues/889)) ([df8dd7e](https://github.com/brillout/vite-plugin-ssr/commit/df8dd7ee9b6a1d27affd19def3560cd9cbda3894))
* new config `extends` ([85a29e9](https://github.com/brillout/vite-plugin-ssr/commit/85a29e97911823252c94dec1008a93c79da89ff4))



## [0.4.123](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.122...v0.4.123) (2023-05-05)


### Bug Fixes

* auto-add VPS's middleware at last ([f0abd07](https://github.com/brillout/vite-plugin-ssr/commit/f0abd07f242a4ac2db55ec1ed0999a375832ffa2))
* improve filesystem apply root (fix [#858](https://github.com/brillout/vite-plugin-ssr/issues/858)) ([173cca0](https://github.com/brillout/vite-plugin-ssr/commit/173cca062ebd37e051a8cf91263935eace203d1f))
* make filesystem inheritance conflict resolution more robust (fix [#858](https://github.com/brillout/vite-plugin-ssr/issues/858)) ([a5d0d5d](https://github.com/brillout/vite-plugin-ssr/commit/a5d0d5d266e7f297d31997063c52d3541380cedc))
* make filesystem root apply clearer ([4eb5f45](https://github.com/brillout/vite-plugin-ssr/commit/4eb5f4541e1518897bc6862481536bf790d3c4e3))
* remove cyclic dependency (fix [#861](https://github.com/brillout/vite-plugin-ssr/issues/861)) ([80d4856](https://github.com/brillout/vite-plugin-ssr/commit/80d48564fa569670ace4e0a0f4ee6c14f69b218a))



## [0.4.122](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.121...v0.4.122) (2023-05-03)


### Bug Fixes

* [V1 design] consolidate route validation ([8004aa9](https://github.com/brillout/vite-plugin-ssr/commit/8004aa9c20cbf659f2ca615f1ac99b1ed48f8dd0))
* [V1 design] support aliased imports in +config.js (fix [#852](https://github.com/brillout/vite-plugin-ssr/issues/852)) ([3a664b0](https://github.com/brillout/vite-plugin-ssr/commit/3a664b02dfd2a6978b1213b6fda7005ff381122c))
* improve code splitting rule handling (fix [#848](https://github.com/brillout/vite-plugin-ssr/issues/848)) ([ccf11aa](https://github.com/brillout/vite-plugin-ssr/commit/ccf11aa19e55e20761d5f007750d64afb197b0e2))



## [0.4.121](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.120...v0.4.121) (2023-05-02)


### Bug Fixes

* [V1 design] improve error handling upon wrong import path (fix [#843](https://github.com/brillout/vite-plugin-ssr/issues/843)) ([676b7e3](https://github.com/brillout/vite-plugin-ssr/commit/676b7e31c1dd5d3e236e9e159788093cec576242))
* [V1 design] warn instead of fail upon unrespected export rule ([#844](https://github.com/brillout/vite-plugin-ssr/issues/844)) ([06b449e](https://github.com/brillout/vite-plugin-ssr/commit/06b449e447e09380fe83507388b1a1bd4095cc15))
* ignore `export { _rerender_only }` (fix [#844](https://github.com/brillout/vite-plugin-ssr/issues/844)) ([7144fdb](https://github.com/brillout/vite-plugin-ssr/commit/7144fdb147e2d95e7b4d5a87d0b2f756cd58875d))
* remove unnecessary error handling edge case ([#843](https://github.com/brillout/vite-plugin-ssr/issues/843)) ([92009e5](https://github.com/brillout/vite-plugin-ssr/commit/92009e54db7bd7804b29b4882e8b1aa9b58c7a30))



## [0.4.120](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.119...v0.4.120) (2023-04-30)


### Bug Fixes

* filesystem routing between page configs and config value files (fix [#831](https://github.com/brillout/vite-plugin-ssr/issues/831)) ([21fac73](https://github.com/brillout/vite-plugin-ssr/commit/21fac7338fe3640680a3619a9bcc576fd99fd624))



## [0.4.119](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.118...v0.4.119) (2023-04-29)


### Bug Fixes

* [V1 design] add warning when defining global configs in +config.js ([7320170](https://github.com/brillout/vite-plugin-ssr/commit/732017048a5a650b478a9cf606cb525447ccb0b6))
* [V1 design] improve warning when global hook is defined by + file ([fa39dd8](https://github.com/brillout/vite-plugin-ssr/commit/fa39dd8ccba8882bb0f6ae60e549efb30af7ca62))
* [V1 design] remove global configs from Config type ([0fcd1c8](https://github.com/brillout/vite-plugin-ssr/commit/0fcd1c8b07ae8768978d1750258f23b2d6bca7e4))
* [V1 design] remove obsolete path strings ([2140e1f](https://github.com/brillout/vite-plugin-ssr/commit/2140e1f8efed93d3572dad8357c06de01e67dd32))
* improve handling of pre-rendering toggle contradiction ([121f27d](https://github.com/brillout/vite-plugin-ssr/commit/121f27d761f9db0ccfecb741b5a78fff3635e26d))
* support Vercel Edge Runtime (fix [#828](https://github.com/brillout/vite-plugin-ssr/issues/828)) ([84f1fde](https://github.com/brillout/vite-plugin-ssr/commit/84f1fdeb728ee3e91f110504f403e2770e71a77f))
* use closeBundle() to force exit (fix [#807](https://github.com/brillout/vite-plugin-ssr/issues/807)) ([964577d](https://github.com/brillout/vite-plugin-ssr/commit/964577da4bc47b2fb6701b9b9345dc5bfed3f493))
* warn instead of throw upon wrong html template var type ([05a25d0](https://github.com/brillout/vite-plugin-ssr/commit/05a25d0e1dccd33fbca27ac9f0781a299d0cf055))



## [0.4.118](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.117...v0.4.118) (2023-04-27)


### Bug Fixes

* [V1 design] properly handle empty string config values (fix [#817](https://github.com/brillout/vite-plugin-ssr/issues/817)) ([60f7b34](https://github.com/brillout/vite-plugin-ssr/commit/60f7b34bef858d2f0dd6ec7461c23af584cc568a))
* add page files to server entries on the server-side as well ([cc293e6](https://github.com/brillout/vite-plugin-ssr/commit/cc293e66ba99d7bad75f40a02666677b140814dd))
* apply pre-render force exit in a last-order Rollup hook ([#807](https://github.com/brillout/vite-plugin-ssr/issues/807)) ([7d50676](https://github.com/brillout/vite-plugin-ssr/commit/7d50676e57c4d3ad743f4cbea86e5028f2b686d6))
* ensure each client entry gets bundle ([#820](https://github.com/brillout/vite-plugin-ssr/issues/820)) ([a5b47af](https://github.com/brillout/vite-plugin-ssr/commit/a5b47af8706d4bb64de8c1cdabb18ab07d1a9f27))
* improve dist/ filenames ([cbd38b4](https://github.com/brillout/vite-plugin-ssr/commit/cbd38b404b2dc2bd2a5b40a9d620f4a3e4d64de1))
* revert autoFullBuild sequential pre order ([4df2571](https://github.com/brillout/vite-plugin-ssr/commit/4df2571275fd50696e33cd44dbd9a974d3ba2748))
* set autoFullBuild Rollup hooks as sequential ([#807](https://github.com/brillout/vite-plugin-ssr/issues/807)) ([a2bc5fa](https://github.com/brillout/vite-plugin-ssr/commit/a2bc5fa185f07abfce4285fdc9e7b8acc7093bde))



## [0.4.117](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.116...v0.4.117) (2023-04-24)


### Bug Fixes

* [V1 design] implement config filesystem overriding (fix [#812](https://github.com/brillout/vite-plugin-ssr/issues/812)) ([f9d826c](https://github.com/brillout/vite-plugin-ssr/commit/f9d826c813f8cf14c9f2ef235662b3bf23cb06c4))



## [0.4.116](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.115...v0.4.116) (2023-04-23)


### Bug Fixes

* [V1 design] expose types Meta and Effect ([6a581a1](https://github.com/brillout/vite-plugin-ssr/commit/6a581a1df4dadc7af4b59f63f68e759ded2401a0))
* [V1 design] use portable syntax for temp generated files (fix [#800](https://github.com/brillout/vite-plugin-ssr/issues/800)) ([39ec890](https://github.com/brillout/vite-plugin-ssr/commit/39ec890d70e828075aa672a26a5b281ee87b018d))
* [V1 Design] workaround Vite bug when `process.cwd() !== config.root` ([48e75ec](https://github.com/brillout/vite-plugin-ssr/commit/48e75eca8e4799e2933cc7151ec5688942555d6f))
* always set `pageContext.is404` when rendering error page on the client-side (fix [#806](https://github.com/brillout/vite-plugin-ssr/issues/806)) ([dbfb0f7](https://github.com/brillout/vite-plugin-ssr/commit/dbfb0f744afaa43a3a651ef5cd4dcd4201f201ae))
* clean stack traces only for Node.js ([8161b54](https://github.com/brillout/vite-plugin-ssr/commit/8161b54a53efc2691737d77adc29b0846f456aac))
* force exit pre-rendering (fix [#807](https://github.com/brillout/vite-plugin-ssr/issues/807)) ([8aedcaa](https://github.com/brillout/vite-plugin-ssr/commit/8aedcaa46a69dfdfa94a0c7d700ac38ab6a01535))
* improve chunk asset name ([fb34270](https://github.com/brillout/vite-plugin-ssr/commit/fb342702c5dbe89dc98a44f1853a56cf5642fb1a))
* improve contradictory env warning ([#792](https://github.com/brillout/vite-plugin-ssr/issues/792)) ([58ccdcd](https://github.com/brillout/vite-plugin-ssr/commit/58ccdcd8fa0ad1bc7f45f9ab3ba037b72aa90c6e))
* improve wrong NODE_ENV warning ([472a16d](https://github.com/brillout/vite-plugin-ssr/commit/472a16d55e3cb815fc48de015f6e846d046968bf))
* skip warning when `process.env.NODE_ENV === "test"` ([3c910c0](https://github.com/brillout/vite-plugin-ssr/commit/3c910c0eb2de84b6315039be7d4e06218b8ee1b3))
* support tauri:// protocol ([#808](https://github.com/brillout/vite-plugin-ssr/issues/808)) ([f7afe16](https://github.com/brillout/vite-plugin-ssr/commit/f7afe1609560d5b8badd1910315f69e98e37e953))
* tolerate URL with missing pathname ([#808](https://github.com/brillout/vite-plugin-ssr/issues/808)) ([fc76ffe](https://github.com/brillout/vite-plugin-ssr/commit/fc76ffe239128a0d55e2ffab1e957203e7c0706d))



## [0.4.115](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.114...v0.4.115) (2023-04-20)


### Bug Fixes

* [V1 Design] tolerate vite-plugin-solid transformation on + files ([5cbfcbe](https://github.com/brillout/vite-plugin-ssr/commit/5cbfcbe5812a3d8439ea5eaf25a2dcaa127f2d62))
* add Vite dev log messages in CI logs ([b5d2a6f](https://github.com/brillout/vite-plugin-ssr/commit/b5d2a6f0219eddcec9b2436597cd3e65b97de795))
* add warning upon unexpected `process.env.NODE_ENV` value ([#792](https://github.com/brillout/vite-plugin-ssr/issues/792)) ([b0c1588](https://github.com/brillout/vite-plugin-ssr/commit/b0c158844176880884b1107819cd09059d60286b))
* add warning when renderPage() is called with Vite client request ([#792](https://github.com/brillout/vite-plugin-ssr/issues/792)) ([e5e670b](https://github.com/brillout/vite-plugin-ssr/commit/e5e670bec5320ab24631505272dc6edfaa7b9280))
* ensure asset name to be file name and not file path (fix [#794](https://github.com/brillout/vite-plugin-ssr/issues/794)) ([b84d67f](https://github.com/brillout/vite-plugin-ssr/commit/b84d67f8d48605be8b378aa927e3f33c1db1dfa5))
* improve passToClient hint ([5935e81](https://github.com/brillout/vite-plugin-ssr/commit/5935e811d44f5592d1c557ce9f02f705395d26ba))
* improve wrong import path error ([6e8492a](https://github.com/brillout/vite-plugin-ssr/commit/6e8492aecc6671908a897b061b84e01efe27fbe7))



## [0.4.114](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.113...v0.4.114) (2023-04-17)


### Bug Fixes

* [V1 design] rename config `clientEntry` to `client` ([fa8d29e](https://github.com/brillout/vite-plugin-ssr/commit/fa8d29e1ecb64aae1fb069cafb0eae87e65401d1))
* add /types to package.json#exports (fix [#788](https://github.com/brillout/vite-plugin-ssr/issues/788)) ([900326c](https://github.com/brillout/vite-plugin-ssr/commit/900326c923fb5f04b1311dc98fb72312040372ba))
* update @brillout/vite-plugin-import-build ([42a1dcc](https://github.com/brillout/vite-plugin-ssr/commit/42a1dcc2e4a273e578d1d0a1bdf5aee750169937))
* update @brillout/vite-plugin-import-build ([f7786e6](https://github.com/brillout/vite-plugin-ssr/commit/f7786e64cdd375fb43697fc984871513455f5ca8))



## [0.4.113](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.112...v0.4.113) (2023-04-13)


### Bug Fixes

* [V1 design] implement filesystem route for npm package imports ([0b42eba](https://github.com/brillout/vite-plugin-ssr/commit/0b42eba256a8765068b50bc6cc74be628f9f8318))
* fix type export path (fix [#785](https://github.com/brillout/vite-plugin-ssr/issues/785)) ([34e2e86](https://github.com/brillout/vite-plugin-ssr/commit/34e2e862a93bb98ca9602ca2625aa845160d9079))
* further tolerate PWA manifest workaround (fix [#769](https://github.com/brillout/vite-plugin-ssr/issues/769)) ([2a50fba](https://github.com/brillout/vite-plugin-ssr/commit/2a50fba4174dd92abfda712a04095fe14f32d48d))
* improve error message when trying to prerender while prerender isn't enabled ([#773](https://github.com/brillout/vite-plugin-ssr/issues/773)) ([b60420b](https://github.com/brillout/vite-plugin-ssr/commit/b60420b463b781fccd551f7fb5e30fa4ac2047f1))
* make early hint deduping support CDN deployments (fix [#775](https://github.com/brillout/vite-plugin-ssr/issues/775)) ([b547ca1](https://github.com/brillout/vite-plugin-ssr/commit/b547ca156266373fce21a51348bf475c1fb4b0d9))



## [0.4.112](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.111...v0.4.112) (2023-04-09)


### Bug Fixes

* normalize chunkInfo.facadeModuleId (fix [#771](https://github.com/brillout/vite-plugin-ssr/issues/771)) ([b8eb4f1](https://github.com/brillout/vite-plugin-ssr/commit/b8eb4f1eca0ad440349a94515e377d77dc0d467f))
* replace node path with pathe library ([ccc65ce](https://github.com/brillout/vite-plugin-ssr/commit/ccc65ce3e313d99a19f2f0d8214216e653515b84))
* tolerate PWA manifest workaround (fix [#769](https://github.com/brillout/vite-plugin-ssr/issues/769)) ([4f9992d](https://github.com/brillout/vite-plugin-ssr/commit/4f9992d047e807f3e1dd09f223ed6f4ca318b051))
* use simple path shim ([f0234ee](https://github.com/brillout/vite-plugin-ssr/commit/f0234eea67e1ce207db157e77e2765cc3858ee8f))
* use updated dependencies that don't depend on Node.js ([f00a096](https://github.com/brillout/vite-plugin-ssr/commit/f00a0968390e465ace6c7f0f9602d5559ee4748e))



## [0.4.111](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.110...v0.4.111) (2023-04-05)


### Bug Fixes

* [V1 Design] fix pageConfigFile consolidation ([467a225](https://github.com/brillout/vite-plugin-ssr/commit/467a22524dc77efec819d72bef65b25fdd74482e))
* [V1 Design] improve error message upon wrong exports ([a639121](https://github.com/brillout/vite-plugin-ssr/commit/a639121774097e8b5c795599bcc6bc95c73e7ec3))
* [V1 design] replace `isErrorPage: true` with `_error/` convention ([ce185e0](https://github.com/brillout/vite-plugin-ssr/commit/ce185e030ff756960eed4b058b31e087ef5b9d97))
* [V1 Design] support multiple imports from same file in +config.js ([5ffaae7](https://github.com/brillout/vite-plugin-ssr/commit/5ffaae799f2367c38a256e09c34575ddead69c63))
* [V1 Design] support prefetchStaticAssets ([7840f60](https://github.com/brillout/vite-plugin-ssr/commit/7840f609b4bdb20aa8e4d6cedffced4c73b69727))
* [V1 design] warn upon unrespected import rule ([8ea6a40](https://github.com/brillout/vite-plugin-ssr/commit/8ea6a400d459132c9e09c297fe0d62b37b80c7df))
* improve client runtime assertions ([#750](https://github.com/brillout/vite-plugin-ssr/issues/750)) ([caab024](https://github.com/brillout/vite-plugin-ssr/commit/caab024f42fb29cd3a4693b71b96f46135672f8e))
* improve new frontend deployment handling ([1bda80f](https://github.com/brillout/vite-plugin-ssr/commit/1bda80f1b84cb1605014bc9aa24851e8e673d1f4))
* refactor types building and exporting ([d4cde57](https://github.com/brillout/vite-plugin-ssr/commit/d4cde57a089a74e70dcaf45fc0de92dd29bf70bd))



## [0.4.110](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.109...v0.4.110) (2023-03-31)


### Bug Fixes

* add JSDoc ([be87309](https://github.com/brillout/vite-plugin-ssr/commit/be87309816a80ca8b77a011d193959222257ef9f))
* workaround TypeScript auto-importing re-export target ([9f39733](https://github.com/brillout/vite-plugin-ssr/commit/9f397335f15a1c6bc3bdeeefc4907afef359d027))



## [0.4.109](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.108...v0.4.109) (2023-03-31)


### Bug Fixes

* [V1 Design] rename `pageContext.configEntries[number].configOrigin` -> `pageContext.configEntries[number].configDefinedAt` ([b46df9d](https://github.com/brillout/vite-plugin-ssr/commit/b46df9d55208f4bda8d1a14501a9165b0764dd6f))
* [V1 Design] rename `pageContext.configList` -> `pageContext.configEntries` ([c5e4215](https://github.com/brillout/vite-plugin-ssr/commit/c5e4215a45013547ecf04ca0afe8e3aac22d3e86))
* move all types to `vite-plugin-ssr/types` ([d36bfcf](https://github.com/brillout/vite-plugin-ssr/commit/d36bfcf7c81496065af3833f8b122d1e8a17e041))



## [0.4.108](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.107...v0.4.108) (2023-03-29)


### Bug Fixes

* export type `ConfigList` ([9847a04](https://github.com/brillout/vite-plugin-ssr/commit/9847a046ff37e826cbbac85f7775028698f9bd8d))
* tolerate VPS frameworks to remove the `+` symbol ([8a9a93e](https://github.com/brillout/vite-plugin-ssr/commit/8a9a93eb2e25df51be39f3d674ab1158e7dd4dd5))



## [0.4.107](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.106...v0.4.107) (2023-03-29)


### Bug Fixes

* [v1] impl `pageContext.config` and `pageContext.configAll` ([38187a3](https://github.com/brillout/vite-plugin-ssr/commit/38187a34913f36796388060727a6abf96263722c))
* always add VPS to ssr.external ([472652f](https://github.com/brillout/vite-plugin-ssr/commit/472652fd38357bea8c72318294155901fe0acc09))
* suppress warning about removing `"use client";` directives (fix [#746](https://github.com/brillout/vite-plugin-ssr/issues/746)) ([e0a1f66](https://github.com/brillout/vite-plugin-ssr/commit/e0a1f6647be3f67687382bac32d06655ed7fcbcf))



## [0.4.106](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.105...v0.4.106) (2023-03-28)


### Bug Fixes

* temporary disable error deduping ([#743](https://github.com/brillout/vite-plugin-ssr/issues/743), vitejs/vite[#12631](https://github.com/brillout/vite-plugin-ssr/issues/12631)) ([4fdca3f](https://github.com/brillout/vite-plugin-ssr/commit/4fdca3f55a1ef694d973eb3818aaad5733e007d1))



## [0.4.105](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.104...v0.4.105) (2023-03-28)


### Bug Fixes

* improve client/server routing contradiction error ([#745](https://github.com/brillout/vite-plugin-ssr/issues/745)) ([e079ea0](https://github.com/brillout/vite-plugin-ssr/commit/e079ea0e589db0d80d34f16c75f0425c3e80f5bd))



## [0.4.104](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.103...v0.4.104) (2023-03-27)


### Bug Fixes

* further export V1 types ([df2876c](https://github.com/brillout/vite-plugin-ssr/commit/df2876cc7ebf70314b3eb859d3778c1dddffe7c4))
* simplify string is equal buster (fix [#742](https://github.com/brillout/vite-plugin-ssr/issues/742)) ([0e62c53](https://github.com/brillout/vite-plugin-ssr/commit/0e62c536c3fcc4a36df5f1d19246903294295c61))



## [0.4.103](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.102...v0.4.103) (2023-03-24)


### Bug Fixes

* slightly improve error message ([#730](https://github.com/brillout/vite-plugin-ssr/issues/730)) ([4f7e0f8](https://github.com/brillout/vite-plugin-ssr/commit/4f7e0f8033254968d231dc86c8038bcfc4ad9577))
* workaround Vite not respecting clear option ([c8e28a6](https://github.com/brillout/vite-plugin-ssr/commit/c8e28a65245a7171667fba177d3c4b2982a577a7))



## [0.4.102](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.101...v0.4.102) (2023-03-24)


### Bug Fixes

* improve error message upon outdated imports (fix [#730](https://github.com/brillout/vite-plugin-ssr/issues/730)) ([cdc6e95](https://github.com/brillout/vite-plugin-ssr/commit/cdc6e951edd533958198fa90656cb7adffaee3b7))



## [0.4.101](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.100...v0.4.101) (2023-03-23)


### Bug Fixes

* improve error message upon importing Client Routing utilities while using Server Routing (fix [#731](https://github.com/brillout/vite-plugin-ssr/issues/731)) ([b14dfda](https://github.com/brillout/vite-plugin-ssr/commit/b14dfdaff3c3662793e10c842d50e7ceceb5f641))
* improve migration hint ([bc6a8ae](https://github.com/brillout/vite-plugin-ssr/commit/bc6a8aebcd65872a2133b439d31d49a8e1757af7))



## [0.4.100](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.99...v0.4.100) (2023-03-22)


### Bug Fixes

* add resolve helpers to npm package ([#717](https://github.com/brillout/vite-plugin-ssr/issues/717)) ([85a2a10](https://github.com/brillout/vite-plugin-ssr/commit/85a2a109d3051ddd48e2f8bb85b2b7e1069f96c8))
* improve error message when server-only module is loaded in browser (#fix 723) ([37eaf60](https://github.com/brillout/vite-plugin-ssr/commit/37eaf60d52076129e1ecb7a104fa6930538166b8))
* move server exports to 'vite-plugin-ssr/server' ([fe07744](https://github.com/brillout/vite-plugin-ssr/commit/fe0774493108755ba59b198f9b5924962017d38b))



## [0.4.99](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.98...v0.4.99) (2023-03-19)


### Bug Fixes

* improve condition for adding VPS middleware to dev server ([ac8eb24](https://github.com/brillout/vite-plugin-ssr/commit/ac8eb2473123886e88d7efe9c3d93e336639a827))
* re-add `pageContext._prerenderContext` ([#722](https://github.com/brillout/vite-plugin-ssr/issues/722)) ([f2803ec](https://github.com/brillout/vite-plugin-ssr/commit/f2803ece116829f09b7b0c8d3aab86f0c58317a0))



## [0.4.98](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.97...v0.4.98) (2023-03-18)


### Features

* `pageContext.isClientSideNavigation` (closes [#568](https://github.com/brillout/vite-plugin-ssr/issues/568)) ([9943f28](https://github.com/brillout/vite-plugin-ssr/commit/9943f2889359f2199e246d9cfb20654ac35128e7))



## [0.4.97](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.96...v0.4.97) (2023-03-17)


### Bug Fixes

* throw an error upon 404 on the client-side ([6f80f80](https://github.com/brillout/vite-plugin-ssr/commit/6f80f802c2ade2bc20fe5dc62988b4d6e5599628))


### Features

* support `RenderErrorPage()` on the client-side (fix [#717](https://github.com/brillout/vite-plugin-ssr/issues/717)) ([a7313b6](https://github.com/brillout/vite-plugin-ssr/commit/a7313b64567325c225a372458aff5a4736f6453a))



## [0.4.96](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.95...v0.4.96) (2023-03-17)


### Bug Fixes

* add `package.json#exports[string].types` to each entry (fix [#716](https://github.com/brillout/vite-plugin-ssr/issues/716)) ([c88b1c5](https://github.com/brillout/vite-plugin-ssr/commit/c88b1c59754503910c7d84005596a99407515235))



## [0.4.95](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.94...v0.4.95) (2023-03-17)


### Bug Fixes

* [v1] suggest config name upon wrong lowercase ([334c303](https://github.com/brillout/vite-plugin-ssr/commit/334c303c15284ce539b486840895733683787179))
* [v1] use levenshtein distance for similarity ([4c5cfed](https://github.com/brillout/vite-plugin-ssr/commit/4c5cfed1ad85267d32238d68a0376092722659ae))
* fix navigate() jsdoc ([146bd65](https://github.com/brillout/vite-plugin-ssr/commit/146bd65cb94fbfec45130cb310f6ccfb5e716459))
* point `package.json#exports[string].types` to `.d.ts` files ([8541b6c](https://github.com/brillout/vite-plugin-ssr/commit/8541b6cc0150e8534c39e206155e16f96c8bc102))
* update bug message ([15de976](https://github.com/brillout/vite-plugin-ssr/commit/15de97624d445ac17115ddc33adb25d263ff838a))



## [0.4.94](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.93...v0.4.94) (2023-03-14)


### Bug Fixes

* add `'vite-plugin-ssr'` to `ssr.external` only if strictly needed ([68b1fcb](https://github.com/brillout/vite-plugin-ssr/commit/68b1fcb7574ec3d0ab5bc0f0c3f944a1e0498d64))
* improve makeFilePathAbsolute assertion (fix [#703](https://github.com/brillout/vite-plugin-ssr/issues/703)) ([2d6489b](https://github.com/brillout/vite-plugin-ssr/commit/2d6489b30220c019feff41ef9b778b5cf906f311))
* remove unreliable isFilesystemAbsolute() assertion (fix [#703](https://github.com/brillout/vite-plugin-ssr/issues/703)) ([41adc4a](https://github.com/brillout/vite-plugin-ssr/commit/41adc4ad408b124fee00991ef42875ece8147f79))
* shim `require()` for ESM modules (fix [#701](https://github.com/brillout/vite-plugin-ssr/issues/701)) ([7b269e0](https://github.com/brillout/vite-plugin-ssr/commit/7b269e0504a413d276baa28960baa06804198004))
* suppress not actionable Rollup warnings ([e6925c4](https://github.com/brillout/vite-plugin-ssr/commit/e6925c49609066e8ddd1d5be8884a76761e44965))
* update @brillout/vite-plugin-import-build ([ec4cf32](https://github.com/brillout/vite-plugin-ssr/commit/ec4cf32c6ff40016b88a7df127fedf11b6ac3e95))
* use assertIsVitePluginCode() instead of isNodeJS() ([03f594d](https://github.com/brillout/vite-plugin-ssr/commit/03f594d40d4aa5949be71c34eff089ed1e650d2d))



## [0.4.93](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.92...v0.4.93) (2023-03-10)


### Bug Fixes

* improve dist/ filenames (fix [#696](https://github.com/brillout/vite-plugin-ssr/issues/696)) ([d594af8](https://github.com/brillout/vite-plugin-ssr/commit/d594af8da62bbfaf58d99638e47c3bb8441cbdd6))



## [0.4.92](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.91...v0.4.92) (2023-03-10)


### Bug Fixes

* aggressively add all page files to optimizeDeps.entries ([d20f92a](https://github.com/brillout/vite-plugin-ssr/commit/d20f92a604814a05a665a10677229d72a5991c17))
* improve utils/assertSingleInstance.ts ([#691](https://github.com/brillout/vite-plugin-ssr/issues/691)) ([fee06f3](https://github.com/brillout/vite-plugin-ssr/commit/fee06f38179eb0fe1a2cef867d96ae682727358f))
* support Vite's dev server hotkey <r> ([3054d2f](https://github.com/brillout/vite-plugin-ssr/commit/3054d2f384e25a5455f520c0b01f902e78bb16db))


### Features

* add placeholders for inserting assets into HTML ([#419](https://github.com/brillout/vite-plugin-ssr/issues/419), [#544](https://github.com/brillout/vite-plugin-ssr/issues/544), fix [#638](https://github.com/brillout/vite-plugin-ssr/issues/638)) ([b3a3de1](https://github.com/brillout/vite-plugin-ssr/commit/b3a3de1f0f87b36a7ea4b9800317e7cd45efac0a))



## [0.4.91](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.90...v0.4.91) (2023-03-05)


### Bug Fixes

* fix and consolidate `pageContext.pageProps.is404` logic [#681](https://github.com/brillout/vite-plugin-ssr/issues/681) ([99e9e39](https://github.com/brillout/vite-plugin-ssr/commit/99e9e39c4c09515117860ca2758959414076fa60))
* update @brillout/vite-plugin-import-build ([908cb17](https://github.com/brillout/vite-plugin-ssr/commit/908cb1707b366ef0e3b57b03190709458bec3c55))



## [0.4.90](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.89...v0.4.90) (2023-03-04)


### Bug Fixes

* improve dist/ file names ([b1a232c](https://github.com/brillout/vite-plugin-ssr/commit/b1a232ce735a390d71a51db06344bc2489870626))
* make dependency sharing with Vite much more likely ([a9949bd](https://github.com/brillout/vite-plugin-ssr/commit/a9949bdc3b33bff3bd71a81aede044a9b7636698))
* remove special characters from emitted dist/ files ([b019fe7](https://github.com/brillout/vite-plugin-ssr/commit/b019fe7bbde3ad1ced1dc37716b24d3560cb9e0b))



## [0.4.89](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.88...v0.4.89) (2023-02-25)


### Bug Fixes

* only warn about slow file crawling in dev ([d5eac01](https://github.com/brillout/vite-plugin-ssr/commit/d5eac01df7347909ff9f1fd143a9b3e766e29dc6))
* skip devPlugin() when building ([91a6312](https://github.com/brillout/vite-plugin-ssr/commit/91a6312b656e53e56565643ad0d49fa71c0f2563))
* update @brillout/vite-plugin-import-build (fix [#672](https://github.com/brillout/vite-plugin-ssr/issues/672)) ([a60315a](https://github.com/brillout/vite-plugin-ssr/commit/a60315ad0c1022574956f6d660b964af9efdc5a1))



## [0.4.88](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.87...v0.4.88) (2023-02-24)


### Bug Fixes

* only warn about slow file crawling in dev ([1cfefb7](https://github.com/brillout/vite-plugin-ssr/commit/1cfefb7d8f876a9d374a1d7644909cf9bd6b4ef0))
* update @brillout/vite-plugin-import-build ([2f16a65](https://github.com/brillout/vite-plugin-ssr/commit/2f16a657d45f6f66b85688cfa08ae449c95271c4))



## [0.4.87](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.86...v0.4.87) (2023-02-22)


### Bug Fixes

* don't add CSS files to optimizeDeps ([e8f5b17](https://github.com/brillout/vite-plugin-ssr/commit/e8f5b178f0e4c291d7a0a98b1ff5de2740c1536b))
* unique error page assertion (fix [#661](https://github.com/brillout/vite-plugin-ssr/issues/661)) ([a2027a8](https://github.com/brillout/vite-plugin-ssr/commit/a2027a871564d9e4013881b49fb3ec27ec243d13))



## [0.4.86](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.85...v0.4.86) (2023-02-20)


### Bug Fixes

* add esbuild to list of dependencies (fix [#659](https://github.com/brillout/vite-plugin-ssr/issues/659)) ([535bc4b](https://github.com/brillout/vite-plugin-ssr/commit/535bc4b49c6d3ce23cc1cafdb2ef02ac911e35a4))
* improve warning upon pre-render hook providing URL not matching any page route ([e933c00](https://github.com/brillout/vite-plugin-ssr/commit/e933c00762291cbc6cde658f1194b5d3a36ed0c7))
* improve wording ([25903e3](https://github.com/brillout/vite-plugin-ssr/commit/25903e3128823aea8644e7ffc1c52308053f7b0f))
* remove false positive of using pageContext.url ([#654](https://github.com/brillout/vite-plugin-ssr/issues/654)) ([ede98b3](https://github.com/brillout/vite-plugin-ssr/commit/ede98b33f27fdb601710d929cc2b7a44eb302778))
* show stack trace upon pageContext.url usage warning ([44a21aa](https://github.com/brillout/vite-plugin-ssr/commit/44a21aa2ae6d94d8f8166a4b05b109a475949c19))



## [0.4.85](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.84...v0.4.85) (2023-02-19)


### Bug Fixes

* add assertUsage() for onBeforePrerender() usage ([71211af](https://github.com/brillout/vite-plugin-ssr/commit/71211af847e0321ed1763086018fffc921fbbd24))
* also assertUsage() prerender() string[] return ([3cfff0b](https://github.com/brillout/vite-plugin-ssr/commit/3cfff0b7e8a59083cc47f6888e672e8556ef527b))
* forbid prerender hooks to provide the same URL twice ([#654](https://github.com/brillout/vite-plugin-ssr/issues/654)) ([594bc50](https://github.com/brillout/vite-plugin-ssr/commit/594bc50d8908cd2b6d0c33d0e25cdca8c8b59fea))
* improve pre-rendering warnings ([c15cc80](https://github.com/brillout/vite-plugin-ssr/commit/c15cc8051e1136576126747496365ddd1acce511))
* pageContext.pageContexts => pageContext._pageContexts ([7204a6f](https://github.com/brillout/vite-plugin-ssr/commit/7204a6f1b310188289d4076421cd60836f4b71a3))
* polish pre-render assertUsage() messages ([348336b](https://github.com/brillout/vite-plugin-ssr/commit/348336bcab6a16f2cf8c751e5b86113ef91fc08a))
* stop providing pageContext._pageContexts ([5860a9c](https://github.com/brillout/vite-plugin-ssr/commit/5860a9c7f1f519b07761070dbbd2c269991e5584))



## [0.4.84](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.83...v0.4.84) (2023-02-17)


### Bug Fixes

* colorize dev logs ([3ce3f0d](https://github.com/brillout/vite-plugin-ssr/commit/3ce3f0d15d592e758e6190abefb4a0a0496b71d2))
* improve error messages ([3ec176c](https://github.com/brillout/vite-plugin-ssr/commit/3ec176c96297c6d8f9946084f56dab016ab4abc9))
* improve internal assertion ([549b5ab](https://github.com/brillout/vite-plugin-ssr/commit/549b5ab6b9333dc6d697a27481225c94a7d43da4))
* swallow expected pageContext.urlOriginal access error ([58e991f](https://github.com/brillout/vite-plugin-ssr/commit/58e991f4729a629de10b0696ac9fda9047ddfe25))
* update @brillout/vite-plugin-import-build ([622d8a4](https://github.com/brillout/vite-plugin-ssr/commit/622d8a434cec429be17c1aa632bf0e9f996ae7a4))



## [0.4.83](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.82...v0.4.83) (2023-02-17)


### Bug Fixes

* normalize URLs upon pre-rendering ([#654](https://github.com/brillout/vite-plugin-ssr/issues/654)) ([967b896](https://github.com/brillout/vite-plugin-ssr/commit/967b896df078aef7f25698dead311b73a325b0d2))
* set globalThis._isVitePluginSsr = true ([9d3cc76](https://github.com/brillout/vite-plugin-ssr/commit/9d3cc76de9c966a9c38803553ecfcae740a02860))
* update @brillout/vite-plugin-import-build ([5795486](https://github.com/brillout/vite-plugin-ssr/commit/5795486da1caee87db9fdba83216a4fd827fd401))
* update link to https://vite-plugin-ssr.com/route-function#cannot-provide-pagecontext ([86944eb](https://github.com/brillout/vite-plugin-ssr/commit/86944ebbfaed769c1d4fe97321726d7126a5f546))



## [0.4.82](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.81...v0.4.82) (2023-02-13)


### Bug Fixes

* update @brillout/vite-plugin-import-build ([07a1265](https://github.com/brillout/vite-plugin-ssr/commit/07a126525d7c9c0d91920c7ba9f4cdd16cafa168))



## [0.4.81](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.80...v0.4.81) (2023-02-13)


### Bug Fixes

* fix support for custom config.build.rollupOptions.output.assetFileNames (fix [#647](https://github.com/brillout/vite-plugin-ssr/issues/647)) ([bcc248e](https://github.com/brillout/vite-plugin-ssr/commit/bcc248ee4b5e7e8f5ee686190b48aeaa66107c5a))



## [0.4.80](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.79...v0.4.80) (2023-02-12)


### Bug Fixes

* collect single css when `cssCodeSplit: false` (fix [#644](https://github.com/brillout/vite-plugin-ssr/issues/644)) ([0040e48](https://github.com/brillout/vite-plugin-ssr/commit/0040e4826fdefed626fcf4770d63761b6e7303c8))



## [0.4.79](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.78...v0.4.79) (2023-02-11)


### Bug Fixes

* use configureDevServer() instead of config.isProduction to diff dev/prod ([dbad544](https://github.com/brillout/vite-plugin-ssr/commit/dbad544c5b9944afe714ad9d02dc7ac6ae530b81))



## [0.4.78](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.77...v0.4.78) (2023-02-10)


### Bug Fixes

* improve assertion failure log ([1bff480](https://github.com/brillout/vite-plugin-ssr/commit/1bff480a92b26ef5b7f2b1173b0bf214b3425a17))
* improve importBuild.cjs instructions (fix [#627](https://github.com/brillout/vite-plugin-ssr/issues/627)) ([cd7ba41](https://github.com/brillout/vite-plugin-ssr/commit/cd7ba41ac5436ff35836409189e6820c74b2255b))
* log fetch error causing new frontend deploy detection ([f54b3b7](https://github.com/brillout/vite-plugin-ssr/commit/f54b3b7c36edd1a3e5e0e87f70d75b6a4b2edf3d))
* update @brillout/vite-plugin-import-build ([463fe05](https://github.com/brillout/vite-plugin-ssr/commit/463fe05e8cfe300213fffb27f3f53ba130b290a9))



## [0.4.77](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.76...v0.4.77) (2023-02-04)


### Bug Fixes

* improve error logging logic (fix [#625](https://github.com/brillout/vite-plugin-ssr/issues/625)) ([56cb9ca](https://github.com/brillout/vite-plugin-ssr/commit/56cb9ca2501e9853b9e5001c02678e8c1ee5c274))



## [0.4.76](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.75...v0.4.76) (2023-02-04)


### Bug Fixes

* consider only fonts as fallback assets (fix [#624](https://github.com/brillout/vite-plugin-ssr/issues/624)) ([523167f](https://github.com/brillout/vite-plugin-ssr/commit/523167f64ef5e7a747e88a817bcd72f511fd3f66))



## [0.4.75](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.74...v0.4.75) (2023-02-03)


### Bug Fixes

* determine fallback asset by also removing hash from filename (fix [#634](https://github.com/brillout/vite-plugin-ssr/issues/634)) ([66fe475](https://github.com/brillout/vite-plugin-ssr/commit/66fe47522299eb9ba01cfd0a6dc16002699c46fd))



## [0.4.74](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.73...v0.4.74) (2023-02-03)


### Bug Fixes

* package.json ./__internal/setup export ([d11401d](https://github.com/brillout/vite-plugin-ssr/commit/d11401dcee15aa6b0803c577d599c8bff608b062))
* remove early hint crossorigin property (fix [#618](https://github.com/brillout/vite-plugin-ssr/issues/618)) ([fd7f76e](https://github.com/brillout/vite-plugin-ssr/commit/fd7f76ed2170625fa6623f83f29518dd5a756060))
* remove fallback assets from early hints (fix [#624](https://github.com/brillout/vite-plugin-ssr/issues/624)) ([693ff00](https://github.com/brillout/vite-plugin-ssr/commit/693ff006e5971ed310a3916304157586e255c896))



## [0.4.73](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.72...v0.4.73) (2023-01-30)


### Bug Fixes

* simplify and correct status code for onRenderResult (fix [#619](https://github.com/brillout/vite-plugin-ssr/issues/619)) ([e0b2f20](https://github.com/brillout/vite-plugin-ssr/commit/e0b2f20015d350af91e0e8ed9c44db85d9731c8c))



## [0.4.72](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.71...v0.4.72) (2023-01-30)


### Bug Fixes

* don't log RenderErrorPage ([8b7afc4](https://github.com/brillout/vite-plugin-ssr/commit/8b7afc4037c4e45f09c2044dd977f604317d54ec))
* improve Vite dev server logging ([e588487](https://github.com/brillout/vite-plugin-ssr/commit/e5884873c646bf7d7ccbb6c14f5ba6e249a78706))
* set pageContext.errorWhileRendering to original error ([d58e024](https://github.com/brillout/vite-plugin-ssr/commit/d58e0241feb63879a925495a8b8a5c3f8109bbbd))
* support multiple Rollup output entries ([#477](https://github.com/brillout/vite-plugin-ssr/issues/477)) ([65a1053](https://github.com/brillout/vite-plugin-ssr/commit/65a105315addc89587c0fa40557df7657e3d39e2))
* update vite-plugin-import-build (fix [#612](https://github.com/brillout/vite-plugin-ssr/issues/612)) ([72999ef](https://github.com/brillout/vite-plugin-ssr/commit/72999ef9b1eeac70fb37041be3255adcc58715bc))



## [0.4.71](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.70...v0.4.71) (2023-01-20)


### Bug Fixes

* fix react-streaming optional TypeScript dependency ([8a6af79](https://github.com/brillout/vite-plugin-ssr/commit/8a6af7994e920d1bb9f82a970f0a35720ec8a9f3))
* improve logging of build warnings ([7780b27](https://github.com/brillout/vite-plugin-ssr/commit/7780b277f70826e853ef3eb1a19a92e76e6ac9e3))



## [0.4.70](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.69...v0.4.70) (2023-01-18)


### Bug Fixes

* improve formatting of transpilation error logs in dev ([d158d97](https://github.com/brillout/vite-plugin-ssr/commit/d158d979ffe559b9e007922de64d14fd7fbc2612))
* improve transpile error handling ([1f9f45d](https://github.com/brillout/vite-plugin-ssr/commit/1f9f45d29064cb3409a77d01f05b5e9b13d55751))
* workaround immutable exports (fix [#596](https://github.com/brillout/vite-plugin-ssr/issues/596)) ([3753cc2](https://github.com/brillout/vite-plugin-ssr/commit/3753cc23e9f1af61ec1341f6c983a9db087c6e8c))



## [0.4.69](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.68...v0.4.69) (2022-12-29)


### Bug Fixes

* support Deno (fix [#579](https://github.com/brillout/vite-plugin-ssr/issues/579)) ([3fbd912](https://github.com/brillout/vite-plugin-ssr/commit/3fbd912a1b9093edcbea92da7367574baa6f8155))



## [0.4.68](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.67...v0.4.68) (2022-12-27)


### Bug Fixes

* ensure stream buffer is flushed at stream end ([#577](https://github.com/brillout/vite-plugin-ssr/issues/577)) ([9956583](https://github.com/brillout/vite-plugin-ssr/commit/9956583c6184e3198898b6bd708cbb6b920549ef))
* improve stream wrapper handling ([#577](https://github.com/brillout/vite-plugin-ssr/issues/577)) ([61d2010](https://github.com/brillout/vite-plugin-ssr/commit/61d2010882465293f1e3bcf11b2fdf6c5a0dc707))
* improve stream wrapper release logic ([#577](https://github.com/brillout/vite-plugin-ssr/issues/577)) ([49ce49e](https://github.com/brillout/vite-plugin-ssr/commit/49ce49e4c05c126bab0d90bb1901cca460129440))
* revert hacky workaround ([#577](https://github.com/brillout/vite-plugin-ssr/issues/577)) ([fa6b1a0](https://github.com/brillout/vite-plugin-ssr/commit/fa6b1a0591dd0d1c426127081d7eb84ee39f0c6a))



## [0.4.67](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.66...v0.4.67) (2022-12-27)


### Bug Fixes

* pipe original stream asynchronously ([c87c32e](https://github.com/brillout/vite-plugin-ssr/commit/c87c32e975316279891f4096a6bbdeb788d9a393))



## [0.4.66](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.65...v0.4.66) (2022-12-26)


### Bug Fixes

* also apply pageContextInit to pre-rendered 404 page ([#576](https://github.com/brillout/vite-plugin-ssr/issues/576)) ([4c027f7](https://github.com/brillout/vite-plugin-ssr/commit/4c027f7447d03fa9af35c206d97f280135af0460))
* apply prerender pageContextInit (fix [#576](https://github.com/brillout/vite-plugin-ssr/issues/576)) ([32f0860](https://github.com/brillout/vite-plugin-ssr/commit/32f08606a859f71ca995ee09d3a9aff2356cd3f6))



## [0.4.65](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.64...v0.4.65) (2022-12-22)


### Bug Fixes

* tolerate superfluous globalContext setters (fix [#572](https://github.com/brillout/vite-plugin-ssr/issues/572)) ([74954c1](https://github.com/brillout/vite-plugin-ssr/commit/74954c1348f18ed29c178a4535faef362d43df5f))



## [0.4.64](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.63...v0.4.64) (2022-12-21)


### Bug Fixes

* expose internal _pageContextHtmlTag ([#545](https://github.com/brillout/vite-plugin-ssr/issues/545)) ([05c1c3b](https://github.com/brillout/vite-plugin-ssr/commit/05c1c3b81b9a6e1431b96bc36a6996839fedd960))
* refactor fsAllow handling (fix [#555](https://github.com/brillout/vite-plugin-ssr/issues/555)) ([7cb77a9](https://github.com/brillout/vite-plugin-ssr/commit/7cb77a9fe6acfb168020464347d2a82968955f3f))



## [0.4.63](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.62...v0.4.63) (2022-12-20)


### Bug Fixes

* always use defer for scripts ([#567](https://github.com/brillout/vite-plugin-ssr/issues/567)) ([53dbf91](https://github.com/brillout/vite-plugin-ssr/commit/53dbf91432d24a60f00be6cf117fcad9c20ab747))
* improve interoperability ([c49a5ae](https://github.com/brillout/vite-plugin-ssr/commit/c49a5ae070946bd5ac0a63e706b91ce88e89a708))



## [0.4.62](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.61...v0.4.62) (2022-12-15)


### Bug Fixes

* always use original Base URL config for determining fine-grained Base URLs (fix [#556](https://github.com/brillout/vite-plugin-ssr/issues/556)) ([8dd3f75](https://github.com/brillout/vite-plugin-ssr/commit/8dd3f75188a14d86639991dcceebe22aaaa29185))



## [0.4.61](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.60...v0.4.61) (2022-12-15)


### Bug Fixes

* apply extension assets handling only if needed ([#556](https://github.com/brillout/vite-plugin-ssr/issues/556)) ([6f7ee64](https://github.com/brillout/vite-plugin-ssr/commit/6f7ee64bf9c1e9702567a910d88f5ff1adc49d32))



## [0.4.60](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.59...v0.4.60) (2022-12-14)


### Bug Fixes

* workaround searchForWorkspaceRoot() windows bug (fix [#555](https://github.com/brillout/vite-plugin-ssr/issues/555)) ([5ddb5a4](https://github.com/brillout/vite-plugin-ssr/commit/5ddb5a47fad91eb4bcf4ebc7c1d5379797b511ec))



## [0.4.59](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.58...v0.4.59) (2022-12-13)


### Bug Fixes

* soft-deprecate pageContext promises in favor of pageContext async functions ([f0bc24d](https://github.com/brillout/vite-plugin-ssr/commit/f0bc24d1b3a437a1c0505d764c6c21f2a664de08))
* update outdated assertion (fix [#552](https://github.com/brillout/vite-plugin-ssr/issues/552)) ([6477dbd](https://github.com/brillout/vite-plugin-ssr/commit/6477dbd48036fb39a8f589d4c5a71f8e2632e06e))



## [0.4.58](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.57...v0.4.58) (2022-12-13)


### Bug Fixes

* add 'VITE_' to envPrefix (fix [#554](https://github.com/brillout/vite-plugin-ssr/issues/554)) ([6095042](https://github.com/brillout/vite-plugin-ssr/commit/609504200fa4d94708c60d9e2dae695f6fc46b74))



## [0.4.57](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.56...v0.4.57) (2022-12-10)


### Bug Fixes

* pageContext promise function ([776b156](https://github.com/brillout/vite-plugin-ssr/commit/776b156800fbaa58a205056c6b4af6378f18b32e))



## [0.4.56](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.55...v0.4.56) (2022-12-10)


### Bug Fixes

* stop showing warning upon `$ vite-plugin-ssr prerender` ([659f28b](https://github.com/brillout/vite-plugin-ssr/commit/659f28beb116ec3c777ec922ddae751d3e6b2844))
* tolerate hook file path to be a npm package module (fix [#550](https://github.com/brillout/vite-plugin-ssr/issues/550)) ([2215db7](https://github.com/brillout/vite-plugin-ssr/commit/2215db7120d5398c67303ffadbce7d0d6645ea5c))


### Features

* allow pageContextPromise to be a lazy-called function (fix [#548](https://github.com/brillout/vite-plugin-ssr/issues/548)) ([a273ce3](https://github.com/brillout/vite-plugin-ssr/commit/a273ce33b3ce48a7b8ddb369653a8d2088e8139b))



## [0.4.55](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.54...v0.4.55) (2022-12-09)


### Bug Fixes

* implement new configurations `baseAssets` and `baseServer` (fix [#542](https://github.com/brillout/vite-plugin-ssr/issues/542)) ([3b41f93](https://github.com/brillout/vite-plugin-ssr/commit/3b41f935fda055757a7b2c0f0cfdd12203dac782))
* improve onBeforePrerender() interface ([48b953f](https://github.com/brillout/vite-plugin-ssr/commit/48b953f648daffca783bb869d85ab61a43927a72))
* properly handle virtual IDs ([2e596c5](https://github.com/brillout/vite-plugin-ssr/commit/2e596c5549be563a418839f73230a5d01dd4bbfe))
* remove convoluted extractAssets assertions and improve comments ([05fc470](https://github.com/brillout/vite-plugin-ssr/commit/05fc4700ac84dc4b1b8c05029c39d9b8afcaa4d5))
* simplify processing of extension source page files ([948b131](https://github.com/brillout/vite-plugin-ssr/commit/948b131011958bb674eac1eed61dc1a9e62ebba1))


### Features

* implement extensions ([fbd3b44](https://github.com/brillout/vite-plugin-ssr/commit/fbd3b449717b9df7cba60eefed150cbc66f3ae9a))



## [0.4.54](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.53...v0.4.54) (2022-11-26)


### Bug Fixes

* always use defer instead of async in dev ([#524](https://github.com/brillout/vite-plugin-ssr/issues/524)) ([7513326](https://github.com/brillout/vite-plugin-ssr/commit/75133261d75a2cc2e3dcc2352addbe55e3d8e755))
* use defer in dev (fix [#524](https://github.com/brillout/vite-plugin-ssr/issues/524)) ([d0d27ff](https://github.com/brillout/vite-plugin-ssr/commit/d0d27ffffa55ce9c182cc28c0d9836c64c679c6f))



## [0.4.53](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.52...v0.4.53) (2022-11-25)

* support Vite 4


## [0.4.52](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.51...v0.4.52) (2022-11-24)


### Bug Fixes

* allow arbitrary mode, independently of dev/prod (fix [#516](https://github.com/brillout/vite-plugin-ssr/issues/516)) ([65bcf53](https://github.com/brillout/vite-plugin-ssr/commit/65bcf53eec6b53634d611f77a87fa6cf64312eb0))
* remove unnecessary NODE_ENV check ([#516](https://github.com/brillout/vite-plugin-ssr/issues/516)) ([11f0155](https://github.com/brillout/vite-plugin-ssr/commit/11f0155a01e1acec0afdb82df002a54d2b5f545f))
* explicitly fail when using two streams ([7dbdae8](https://github.com/brillout/vite-plugin-ssr/commit/7dbdae8a38bf415ddc8b6f1db43a610c4477dc6e))
* improve html whitespace handling ([0915436](https://github.com/brillout/vite-plugin-ssr/commit/0915436124ace75a861ac6ef3338f0eb724c9a7b))
* improve PageAsset data structure ([#262](https://github.com/brillout/vite-plugin-ssr/issues/262)) ([e41ab39](https://github.com/brillout/vite-plugin-ssr/commit/e41ab396536d03b568019f3c135c9587537f2dca))
* improve warning message upon wrong HTML variable value ([19f3423](https://github.com/brillout/vite-plugin-ssr/commit/19f342380dcfeb849a0ec136b352a1645390d818))
* increase timeouts ([7f25745](https://github.com/brillout/vite-plugin-ssr/commit/7f257452911bb560efd263575112efb89240be6b))
* make HTML injections more readable ([38c97c7](https://github.com/brillout/vite-plugin-ssr/commit/38c97c7b92c58ffc9440204cbd808d7067991040))


### Features

* `pageContext.httpResponse.earlyHints` (closes [#262](https://github.com/brillout/vite-plugin-ssr/issues/262)) ([3c20516](https://github.com/brillout/vite-plugin-ssr/commit/3c20516612fadbb6684a5afb08dc61e00fd2e8b4))
* implement `injectFilter()` (closes [#262](https://github.com/brillout/vite-plugin-ssr/issues/262), closes [#419](https://github.com/brillout/vite-plugin-ssr/issues/419), closes [#420](https://github.com/brillout/vite-plugin-ssr/issues/420), closes [#510](https://github.com/brillout/vite-plugin-ssr/issues/510)) ([e0785a6](https://github.com/brillout/vite-plugin-ssr/commit/e0785a6afa9c5855ea698fd7109f53d90cfa3d6c))


### Performance Improvements

* allow user to control script preloading ([b0374b1](https://github.com/brillout/vite-plugin-ssr/commit/b0374b14881633fda79b24dbcc0669060c951a87))
* only preload fonts and JavaScript by default ([00cbf39](https://github.com/brillout/vite-plugin-ssr/commit/00cbf392bb8608f7d52fee83ec8f325a80f80815))
* remove superfluous preload tag ([70cc112](https://github.com/brillout/vite-plugin-ssr/commit/70cc1121963ff0c8bcccb0025c9018139868198d))
* in dev, load scripts before static assets ([3358460](https://github.com/brillout/vite-plugin-ssr/commit/335846010d490d300f4074af671db53717d3cd87))



## [0.4.51](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.50...v0.4.51) (2022-11-19)


### Bug Fixes

* assert Stem packages to define package.json#exports ([55c40b8](https://github.com/brillout/vite-plugin-ssr/commit/55c40b86d1cedb9dfc29ffcee1dedb465f3a8490))
* don't assume Stem packages to always define a VPS config ([f5c41d6](https://github.com/brillout/vite-plugin-ssr/commit/f5c41d6a24d68c917cc86e4e4a805dfa929b92c3))
* fix resolving of Stem client entries ([cb2f359](https://github.com/brillout/vite-plugin-ssr/commit/cb2f35945d5644ef3961f0c6ba6fe0e80aac06d8))
* refine wrong usage message ([#516](https://github.com/brillout/vite-plugin-ssr/issues/516)) ([1e4dbe6](https://github.com/brillout/vite-plugin-ssr/commit/1e4dbe65cf552665b388eac54e4dd3ad3f50db00))
* workaround windows bug ([91393d7](https://github.com/brillout/vite-plugin-ssr/commit/91393d73ef4032059f3618fd652a09b0b80ee088))



## [0.4.50](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.49...v0.4.50) (2022-11-17)


### Bug Fixes

* improve error message upon wrong Vite dev server usage (fix [#516](https://github.com/brillout/vite-plugin-ssr/issues/516)) ([0b7c9bc](https://github.com/brillout/vite-plugin-ssr/commit/0b7c9bc3935f1df2430ce4939134d910d773a935))
* look for package.json as well as in parent directories (fix [#518](https://github.com/brillout/vite-plugin-ssr/issues/518)) ([5bd5434](https://github.com/brillout/vite-plugin-ssr/commit/5bd54349d6fcf48c8608a07f9d8de5ee12d98653))



## [0.4.49](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.48...v0.4.49) (2022-11-17)


### Bug Fixes

* `export type { TemplateWrapped }` (fix [#511](https://github.com/brillout/vite-plugin-ssr/issues/511)) ([e9be7fe](https://github.com/brillout/vite-plugin-ssr/commit/e9be7fe6c6ca751716c4015835545cd3b8f725d4))
* `export type { UserConfig }` ([e760135](https://github.com/brillout/vite-plugin-ssr/commit/e760135db68aa82fe9885a121a850ffbfedfcbe4))
* add Stem entries to optimizeDeps.include ([b65b639](https://github.com/brillout/vite-plugin-ssr/commit/b65b63995511f1d7d71f2c7f66609e2b16d6eec2))
* avoid importBuild var collision ([43811ba](https://github.com/brillout/vite-plugin-ssr/commit/43811ba4dc09b7e9ada46761f085190460b3325e))
* deprecate `package.json#vite-plugin-ssr.pageFilesDir` ([e0b2291](https://github.com/brillout/vite-plugin-ssr/commit/e0b2291ddc5a41de46202f36d56767c8278c6880))
* enforce Stem npm packages to belong to a npm org ([c1a9bc4](https://github.com/brillout/vite-plugin-ssr/commit/c1a9bc44d3a194d7e78de47942eb690828200882))
* fix `pageContext.exportsAll` type ([dda92b8](https://github.com/brillout/vite-plugin-ssr/commit/dda92b86fb51263964631012e5304878caafaf90))
* improve Stem package resolver ([c929ab4](https://github.com/brillout/vite-plugin-ssr/commit/c929ab46a349c7e17abc4978171a21bec4381b9b))
* warn instead of err upon wrong Stem package name ([7c198b9](https://github.com/brillout/vite-plugin-ssr/commit/7c198b9ce8e32dfae11412fed122ab171fbd3047))


### Features

* enable Stem packages to define vite-plugin-ssr config ([25a204f](https://github.com/brillout/vite-plugin-ssr/commit/25a204f4f3f0822cfb4bb7894ac491adb63e6147))



## [0.4.48](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.47...v0.4.48) (2022-11-10)


### Features

* expose `pageContext.exportsAll[exportName][0].filePath` ([0dec2ce](https://github.com/brillout/vite-plugin-ssr/commit/0dec2ce56a96ab485ef05bc353c7efe209db95af))



## [0.4.47](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.46...v0.4.47) (2022-11-09)


### Bug Fixes

* remove internal heuristic in favor of new config `hydrationCanBeAborted` (fix [#423](https://github.com/brillout/vite-plugin-ssr/issues/423)) ([56f6c3e](https://github.com/brillout/vite-plugin-ssr/commit/56f6c3e91bc58d13739470aeb6745aee9cff0ec2))



## [0.4.46](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.45...v0.4.46) (2022-11-07)


### Bug Fixes

* fix `navigate()` type ([#501](https://github.com/brillout/vite-plugin-ssr/issues/501)) ([76f1e75](https://github.com/brillout/vite-plugin-ssr/commit/76f1e75280f115c7ff67813ea0566254958ee3c8))



## [0.4.45](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.44...v0.4.45) (2022-11-07)


### Bug Fixes

* add JSDoc to `navigate()` ([c240e8e](https://github.com/brillout/vite-plugin-ssr/commit/c240e8e144a9573b4511a635bbab387f0ba420eb))
* also check whether new page is renderable for `navigate()` (fix [#502](https://github.com/brillout/vite-plugin-ssr/issues/502)) ([d7729e9](https://github.com/brillout/vite-plugin-ssr/commit/d7729e9f12432f3ddac8e6d459c2b0f85fe3520c))
* fix `navigate()` type export for newer TypeScript versions ([3713643](https://github.com/brillout/vite-plugin-ssr/commit/3713643db771c6914eb960c4823fac21babc31f2))



## [0.4.44](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.43...v0.4.44) (2022-11-03)


### Bug Fixes

* improve wrong usage error message ([#496](https://github.com/brillout/vite-plugin-ssr/issues/496)) ([8f8cab4](https://github.com/brillout/vite-plugin-ssr/commit/8f8cab47c2a229ab6161e8bb01d3fda447602ceb))
* support autoFullBuild for globally installed Vite (fix [#484](https://github.com/brillout/vite-plugin-ssr/issues/484)) ([ef5c49f](https://github.com/brillout/vite-plugin-ssr/commit/ef5c49fdf3e66a33c53161d14dd4a3e763db4aa3))
* tolerate navigate to be loaded and called in tests (fix [#496](https://github.com/brillout/vite-plugin-ssr/issues/496)) ([d1ccd25](https://github.com/brillout/vite-plugin-ssr/commit/d1ccd25a50509cceb86fb27d5e4afd0a90e3b2c7))
* use jsdoc [@deprecated](https://github.com/deprecated) ([#491](https://github.com/brillout/vite-plugin-ssr/issues/491)) ([dbeb556](https://github.com/brillout/vite-plugin-ssr/commit/dbeb556b4a4bd783b34d0a955a7d5dd6c6078b92))
* workaround new URL() bug (fix [#495](https://github.com/brillout/vite-plugin-ssr/issues/495)) ([ced0fea](https://github.com/brillout/vite-plugin-ssr/commit/ced0fea8072243b40f936edf87297bf5621771f0))



## [0.4.43](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.42...v0.4.43) (2022-10-19)


### Bug Fixes

* align CLI option parsing with Vite ([54d2b22](https://github.com/brillout/vite-plugin-ssr/commit/54d2b22591c5fba1e2f901d6e268c4713df7f1b2))
* don't preload virtual css modules (fix [#479](https://github.com/brillout/vite-plugin-ssr/issues/479)) ([3f7b991](https://github.com/brillout/vite-plugin-ssr/commit/3f7b9916dddc84e29e2c20d2b0df7211b6f1acbd))
* improve error message upon environment loading wrong exports entry (fix [#481](https://github.com/brillout/vite-plugin-ssr/issues/481)) ([3c58410](https://github.com/brillout/vite-plugin-ssr/commit/3c58410c7785467456b40a92243b15142b49d726))



## [0.4.42](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.41...v0.4.42) (2022-10-18)


### Bug Fixes

* remove erroneous assertions (fix [#469](https://github.com/brillout/vite-plugin-ssr/issues/469)) ([7e2bf51](https://github.com/brillout/vite-plugin-ssr/commit/7e2bf51c567a0698a74b14fa8a2ffe11e5eb6f32))
* skip autoFullBuild upon @vitejs/plugin-legacy internal build() ([#477](https://github.com/brillout/vite-plugin-ssr/issues/477)) ([d578381](https://github.com/brillout/vite-plugin-ssr/commit/d578381f3e353640a4e8618beaf21ed82af66966))
* stop assuming build command ([9254b66](https://github.com/brillout/vite-plugin-ssr/commit/9254b6681cd4f8e56fed14ad6ab80082ce375979))
* stop assuming Vite CLI command to occur first ([b9738b7](https://github.com/brillout/vite-plugin-ssr/commit/b9738b7ab9481aa5bb55ab3aa1a956036652e0cd))
* support older Edge browsers ([#477](https://github.com/brillout/vite-plugin-ssr/issues/477)) ([9b9f551](https://github.com/brillout/vite-plugin-ssr/commit/9b9f55172493fad660a10c74387ecb94a33117e9))



## [0.4.41](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.40...v0.4.41) (2022-10-15)


### BREAKING CHANGES

* [disableAutoFullBuild](https://vite-plugin-ssr.com/disableAutoFullBuild) defaults to `true` when using Vite's `build()` API.
  > We introduce this breaking change in a minor because it affects only very small number of users.


### Bug Fixes

* avoid Rollup handling chained build errors ([#472](https://github.com/brillout/vite-plugin-ssr/issues/472)) ([70d90a2](https://github.com/brillout/vite-plugin-ssr/commit/70d90a26a21bf526520b0fc77abd84007f77e4ca))
* support Vite CLI arguments (fix [#444](https://github.com/brillout/vite-plugin-ssr/issues/444)) ([b907fe2](https://github.com/brillout/vite-plugin-ssr/commit/b907fe214ee98bf968fd5ec432b9253b715c4796))


### Performance Improvements

* faster script injection ([#474](https://github.com/brillout/vite-plugin-ssr/pull/474))



## [0.4.40](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.39...v0.4.40) (2022-10-07)


### Bug Fixes

* [stream] ensure order of stream writing and stream flushing ([#466](https://github.com/brillout/vite-plugin-ssr/issues/466)) ([11a5cbd](https://github.com/brillout/vite-plugin-ssr/commit/11a5cbd629fb67d134f2c8f1e414cf9345da2ab8))
* [stream] flush HTML begin/end injections ([#466](https://github.com/brillout/vite-plugin-ssr/issues/466)) ([50bd119](https://github.com/brillout/vite-plugin-ssr/commit/50bd1193bee6444317eb109c6a03eb8c4cb12489))
* [stream] flush script injection ([e618438](https://github.com/brillout/vite-plugin-ssr/commit/e618438b33f7bac658c08ed5cd8d62ad43b6f5a0))
* fix slow hook timeouts ([58525c1](https://github.com/brillout/vite-plugin-ssr/commit/58525c129450c7a36f0a89653282a668e45134a6))
* make `includeAssetsImportedByServer` support `?url` imports (fix [#464](https://github.com/brillout/vite-plugin-ssr/issues/464)) ([29f046e](https://github.com/brillout/vite-plugin-ssr/commit/29f046e72e99f4889372538cdbb9b90899f2d73f))



## [0.4.39](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.38...v0.4.39) (2022-10-03)


### Bug Fixes

* add timeout to hook calls ([1f5be92](https://github.com/brillout/vite-plugin-ssr/commit/1f5be92b09a33d290908da0d24913ca556370036))



## [0.4.38](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.37...v0.4.38) (2022-09-22)


### Bug Fixes

* check bundle package duplicate only for production ([59c832e](https://github.com/brillout/vite-plugin-ssr/commit/59c832eb800a9affd58d9e02adf11c3d25301765))



## [0.4.37](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.36...v0.4.37) (2022-09-22)


### Bug Fixes

* fix exports (fix [#457](https://github.com/brillout/vite-plugin-ssr/issues/457)) ([172fae9](https://github.com/brillout/vite-plugin-ssr/commit/172fae9f9942b91decf03d76f3c80f51501c95f7))
* improve single loaded version assertion ([a97bc12](https://github.com/brillout/vite-plugin-ssr/commit/a97bc1233e9fc1a336dd8ff4696b6ca6c9ba1bf4))
* stop assuming single module instances (fix [#460](https://github.com/brillout/vite-plugin-ssr/issues/460)) ([f0f4991](https://github.com/brillout/vite-plugin-ssr/commit/f0f4991514a460c909903e3d09b0271f13f5dbbe))



## [0.4.36](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.35...v0.4.36) (2022-09-19)


### Bug Fixes

* improve error message when using Vite 2 (fix [#455](https://github.com/brillout/vite-plugin-ssr/issues/455)) ([3a274ef](https://github.com/brillout/vite-plugin-ssr/commit/3a274ef530b93c8a0953e2116fd7616cd9666b72))



## [0.4.35](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.34...v0.4.35) (2022-09-17)


### Bug Fixes

* don't treat page as HTML-only if it defines client renderer (fix [#446](https://github.com/brillout/vite-plugin-ssr/issues/446)) ([a89540f](https://github.com/brillout/vite-plugin-ssr/commit/a89540f824cc23fef4d6b73329395e385d340a22))



## [0.4.34](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.33...v0.4.34) (2022-09-14)


### Bug Fixes

* [#449](https://github.com/brillout/vite-plugin-ssr/issues/449) ([ef2718e](https://github.com/brillout/vite-plugin-ssr/commit/ef2718ec5a66f62580a11eca1683156b9cdf35ea))
* apply routing precedence to FileSystem Routing (fix [#448](https://github.com/brillout/vite-plugin-ssr/issues/448)) ([61ecb82](https://github.com/brillout/vite-plugin-ssr/commit/61ecb820a03419655265cbe79d8530c11789ecb4))



## [0.4.33](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.32...v0.4.33) (2022-09-13)


### Bug Fixes

* revert "fix: do not copy static assets to `dist/server/`" (fix [#447](https://github.com/brillout/vite-plugin-ssr/issues/447)) ([ec93afe](https://github.com/brillout/vite-plugin-ssr/commit/ec93afe7240aeb19e9ec8458c0579c995329f26a))



## [0.4.32](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.31...v0.4.32) (2022-09-08)


### Bug Fixes

* comply to common reverse proxy setups (fix [#443](https://github.com/brillout/vite-plugin-ssr/issues/443)) ([7b76001](https://github.com/brillout/vite-plugin-ssr/commit/7b76001da5e212c00f492e1bb62ddf066708e5b2))
* improve error message upon trying to use `navigate()` without Client Routing (fix [#441](https://github.com/brillout/vite-plugin-ssr/issues/441)) ([5c97cc4](https://github.com/brillout/vite-plugin-ssr/commit/5c97cc4d07f689bdb303a50be955d2580df429e9))



## [0.4.31](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.30...v0.4.31) (2022-09-04)


### Bug Fixes

* make streaming SSR work on Firefox ([a0c791c](https://github.com/brillout/vite-plugin-ssr/commit/a0c791ce14a0add270e8c3369e2480d953d31abd))
* typescript: allow user to define `Page` type ([4e3ac79](https://github.com/brillout/vite-plugin-ssr/commit/4e3ac790f165c73c6189630cef08b04129f4905a))



## [0.4.30](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.29...v0.4.30) (2022-09-02)


### Performance Improvements

* use picocolors instead of kolorist ([f4f2e1c](https://github.com/brillout/vite-plugin-ssr/commit/f4f2e1ce472fe2b1f6ff24629ed32e2d30c37439))



## [0.4.29](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.28...v0.4.29) (2022-08-30)


### Bug Fixes

* support `includeAssetsImportedByServer` for linked dependencies ([eaa857b](https://github.com/brillout/vite-plugin-ssr/commit/eaa857b0067899ddfab5c756cf5055fef0f9e8d8))
* use Vite's built-in `import.meta.glob()` instead of `vite-plugin-glob` (fix [#431](https://github.com/brillout/vite-plugin-ssr/issues/431)) ([19385ef](https://github.com/brillout/vite-plugin-ssr/commit/19385ef06bd4997955e267c72bc4f416fbf8dcb1))


### BREAKING CHANGES

* `vite-plugin-ssr@0.4.29` doesn't work with Vite 2 anymore: make sure to update to Vite 3.



## [0.4.28](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.27...v0.4.28) (2022-08-29)


### Bug Fixes

* improve `getFileUrl()` assertions ([4799316](https://github.com/brillout/vite-plugin-ssr/commit/4799316bba2ec8e3fe6edb0cbae6d6fb8aa43d24))
* update react detection heuristic ([#423](https://github.com/brillout/vite-plugin-ssr/issues/423)) ([931a8e9](https://github.com/brillout/vite-plugin-ssr/commit/931a8e95e8d56130be3c3e5488b33b60d7c3d8b2))



## [0.4.27](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.26...v0.4.27) (2022-08-26)


### Bug Fixes

* improve `config.build.outDir` handling ([d6415f8](https://github.com/brillout/vite-plugin-ssr/commit/d6415f8de80e0b8b942d55edb7f473f58612c342))
* track instances for improved debuggability ([6d24934](https://github.com/brillout/vite-plugin-ssr/commit/6d249347210c75ecc5f9b7ae9273419b517b82fe))
* update vite-plugin-import-build ([8856f94](https://github.com/brillout/vite-plugin-ssr/commit/8856f94aab7f4361e03574e230df93fe323f534c))


### Reverts

* Revert "start using @brillout/vite-plus" ([03d0b0f](https://github.com/brillout/vite-plugin-ssr/commit/03d0b0fbb793c67c2e6ba0da8f6b23b7e8804fd0))
* Revert "update @brillout/vite-plus" ([5a9cdc5](https://github.com/brillout/vite-plugin-ssr/commit/5a9cdc5c4889acced311358c2900a2485728d947))



## [0.4.26](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.25...v0.4.26) (2022-08-23)


### Bug Fixes

* use latest vite-plugin-import-build version ([4a2d3ea](https://github.com/brillout/vite-plugin-ssr/commit/4a2d3ea00c3c250f04e90381d6820db989799eef))



## [0.4.25](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.24...v0.4.25) (2022-08-22)


### Bug Fixes

* improve 404 logging during dev ([522f8cc](https://github.com/brillout/vite-plugin-ssr/commit/522f8ccc7ae32beb56299bc7f59b0355fc4f2c03))
* improve React detection heuristic ([#423](https://github.com/brillout/vite-plugin-ssr/issues/423)) ([bbd39c6](https://github.com/brillout/vite-plugin-ssr/commit/bbd39c644e9433075cb5685479c03857fd50e310))
* skip 404 warning upon `RenderErrorPage` error ([45fd93f](https://github.com/brillout/vite-plugin-ssr/commit/45fd93fcee08c1e87486592c360d86a859558305))



## [0.4.24](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.23...v0.4.24) (2022-08-22)


### Bug Fixes

* Async Route Functions (fix [#425](https://github.com/brillout/vite-plugin-ssr/issues/425)) ([2ba489f](https://github.com/brillout/vite-plugin-ssr/commit/2ba489fb44b78a4d649c8e5e733f130404d5ba7f))



## [0.4.23](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.22...v0.4.23) (2022-08-21)


### Bug Fixes

* rename `pageContext.url` to `pageContext.urlOriginal` ([b2e7ff0](https://github.com/brillout/vite-plugin-ssr/commit/b2e7ff0dad2a1d60c83ac4a59a0b4101a8e8d39a))
  > This fix contains a soft breaking change, see [vite-plugin-ssr.com/migration/0.4.23](https://vite-plugin-ssr.com/migration/0.4.23).



## [0.4.22](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.21...v0.4.22) (2022-08-18)


### Bug Fixes

* add module `vite-plugin-ssr/routing` to `optimizeDeps.exclude` ([3585d9e](https://github.com/brillout/vite-plugin-ssr/commit/3585d9eb483408e1af87495fd8316a3f68b777d6))



## [0.4.21](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.20...v0.4.21) (2022-08-18)


### Bug Fixes

* further tolerate vite-plugin-ssr being loaded twice ([da02463](https://github.com/brillout/vite-plugin-ssr/commit/da02463c8d227467c35642f20ff3f594dcf5575e))
* improve error message upon vite-plugin-ssr being included twice in bundle ([58427f5](https://github.com/brillout/vite-plugin-ssr/commit/58427f5320be5518eb9cc795b9c95b71d6f98515))
* improve scroll restoration for Firefox ([fd70fad](https://github.com/brillout/vite-plugin-ssr/commit/fd70fadb0bcea8d922f961f1c88713994e0aaf34))
* pass entire pageContext to Route Functions ([a596b59](https://github.com/brillout/vite-plugin-ssr/commit/a596b590bc67ab7909684edcbcdccde90784684b))
* re-support & improve hash navigation (fix [#418](https://github.com/brillout/vite-plugin-ssr/issues/418)) ([88b9da0](https://github.com/brillout/vite-plugin-ssr/commit/88b9da0b96c3103eaa6152dbb58ebff943b6ee70))


### Features

* impl `resolveRoute` (close [#370](https://github.com/brillout/vite-plugin-ssr/issues/370)) ([15104af](https://github.com/brillout/vite-plugin-ssr/commit/15104af9bd12686b49d6cc11be4cec579029cb9b))



## [0.4.20](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.19...v0.4.20) (2022-08-12)


### Bug Fixes

* fix types for react streaming ([432d1a7](https://github.com/brillout/vite-plugin-ssr/commit/432d1a78b9f8c96c42b6b8d57658cb842b0b265d))
* further tolerate vite-plugin-ssr being loaded twice ([8038fbe](https://github.com/brillout/vite-plugin-ssr/commit/8038fbe917cfc96b4d0e204ddf40171f32da9640))
* stop injecting into stream when streaming is disabled ([#416](https://github.com/brillout/vite-plugin-ssr/issues/416)) ([a8e1519](https://github.com/brillout/vite-plugin-ssr/commit/a8e15193314deb0d9cfc3576a1a6c7e75d15e7f3))



## [0.4.19](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.18...v0.4.19) (2022-08-10)


### Bug Fixes

* improve TypeScripts types ([02c4089](https://github.com/brillout/vite-plugin-ssr/commit/02c408933a6262891703075dfc4da07a8ca728ef))


### Features

* implement `pageContext.isBackwardNavigation` ([510501b](https://github.com/brillout/vite-plugin-ssr/commit/510501b5d2757bc6e2be191ee07ce3d70c7b6797))



## [0.4.18](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.17...v0.4.18) (2022-08-05)


### Bug Fixes

* don't swallow unexpected error upon prefetching ([0e05293](https://github.com/brillout/vite-plugin-ssr/commit/0e0529347cec4dfca868768763a49795a4bc45ca))
* improve error message upon duplicated page files ([32bbdfd](https://github.com/brillout/vite-plugin-ssr/commit/32bbdfdbcf294aae3458b02c9fb4a59958d757eb))
* improve error message upon failure fetching static assets ([1d134a7](https://github.com/brillout/vite-plugin-ssr/commit/1d134a7c168dc3e58bfe95b7550c7b123a39df5e))
* improve error message upon wrong provided `pageContext.url` value in `onBeforeRoute()` ([cb50a55](https://github.com/brillout/vite-plugin-ssr/commit/cb50a556e055d3091470bc9cd6c9f5b8c911e607))
* upon `onBeforeRoute()` overwriting `pageContext.url`, preserve and use original URL for `.pageContex.json` requests ([b9cca1b](https://github.com/brillout/vite-plugin-ssr/commit/b9cca1bd2247217350d51f733f31e80fe11248d1))



## [0.4.17](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.16...v0.4.17) (2022-08-03)


### Bug Fixes

* only inject CSS root import to HTML (fix [#400](https://github.com/brillout/vite-plugin-ssr/issues/400), fix [#398](https://github.com/brillout/vite-plugin-ssr/issues/398)) ([84ea940](https://github.com/brillout/vite-plugin-ssr/commit/84ea94087ee0b744ee880a0f9d37777d172766f7))



## [0.4.16](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.15...v0.4.16) (2022-08-01)


### Bug Fixes

* improve `onBeforeRender()` hook handling upon error ([5838c18](https://github.com/brillout/vite-plugin-ssr/commit/5838c18361472e7a42c772a168ecef8b03d0c468))
* support `build.assetsDir` (fix [#397](https://github.com/brillout/vite-plugin-ssr/issues/397)) ([6909c8a](https://github.com/brillout/vite-plugin-ssr/commit/6909c8a730dce4923d6c9a941c58bddf38eb3f55))


### Features

* `pageContext.enableEagerStreaming` (fix [#396](https://github.com/brillout/vite-plugin-ssr/issues/396)) ([7fd58e8](https://github.com/brillout/vite-plugin-ssr/commit/7fd58e81d6f931534f319ad12e137ee21be37aed))



## [0.4.15](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.14...v0.4.15) (2022-07-31)

### Bug Fixes

* revert [#384](https://github.com/brillout/vite-plugin-ssr/pull/384) (fix [#183](https://github.com/brillout/vite-plugin-ssr/issues/183)) ([7341a4](https://github.com/brillout/vite-plugin-ssr/commit/7341a498a41aec60c455ad59df2dafa2b4faeefe))



## [0.4.14](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.13...v0.4.14) (2022-07-30)


### Bug Fixes

* add `exportsAll` to `PageContextBuiltIn` ([06b0c6c](https://github.com/brillout/vite-plugin-ssr/commit/06b0c6cda4f094515f2a3dec00e9faa16a7dc5bd))
* add `is404` to `pageContext` docs and `PageContextBuiltIn` ([bcb2ab5](https://github.com/brillout/vite-plugin-ssr/commit/bcb2ab53a5d2609e636db8c51da2189f98b559f2))
* add JSDoc annotations to `PageContextBuiltIn` ([62dcc0e](https://github.com/brillout/vite-plugin-ssr/commit/62dcc0e7c1e4aa9e21e8c7cedc5aba41220d72be))
* add support for server-side rendered preprocessed stylesheets (PostCSS, SASS, ...) ([6d30acf](https://github.com/brillout/vite-plugin-ssr/commit/6d30acf433ed8b5f5564b2d21528f8fd9f6b94c6))
* improve `vite-plugin-pwa` error message ([#388](https://github.com/brillout/vite-plugin-ssr/issues/388)) ([6e6f872](https://github.com/brillout/vite-plugin-ssr/commit/6e6f8729c2e08b61fb39b8b74416aae5147a7855))
* improve error message upon wrong base value (fix [#394](https://github.com/brillout/vite-plugin-ssr/issues/394)) ([7671cfa](https://github.com/brillout/vite-plugin-ssr/commit/7671cfa1aa45a6b151106fc7f7b3dce347ec81d5))
* improve error message upon wrong outDir value (fix [#392](https://github.com/brillout/vite-plugin-ssr/issues/392)) ([f2df3fe](https://github.com/brillout/vite-plugin-ssr/commit/f2df3fe3df62f4f498177f2ff5a04cc11b685882))
* improve error message upon wrong Rollup config ([998e9f6](https://github.com/brillout/vite-plugin-ssr/commit/998e9f69c29fb5bd9a1bc43a5e62c4483c67907b))
* improve error message when trying to apply 's HTML transformer (fix [#388](https://github.com/brillout/vite-plugin-ssr/issues/388)) ([2ab98c9](https://github.com/brillout/vite-plugin-ssr/commit/2ab98c93eb65b716ce61b55ca78cc20537b00736))
* make onPagePrerender pageContext concurrent safe ([ba11709](https://github.com/brillout/vite-plugin-ssr/commit/ba11709cbfc70272ac66f0f8a66f826c73083965))
* make React detection heuristic more robust ([dfe45d3](https://github.com/brillout/vite-plugin-ssr/commit/dfe45d30955ef560d6a6a757c1d222249e872f4f))
* remove problematic assertion (fix [#391](https://github.com/brillout/vite-plugin-ssr/issues/391)) ([9500fe3](https://github.com/brillout/vite-plugin-ssr/commit/9500fe3a010358a591abede4a16458d24e621d9d))
* render error page on the client-side (fix [#393](https://github.com/brillout/vite-plugin-ssr/issues/393)) ([9f2dfb7](https://github.com/brillout/vite-plugin-ssr/commit/9f2dfb745dd54685be7c933c640793472472216f))
* show second error if it's not the same as first one ([859678d](https://github.com/brillout/vite-plugin-ssr/commit/859678da0eaf026210380bdab9803efe1f7375c8))
* stop erasing previous `optimizeDeps.entries` (fix [#386](https://github.com/brillout/vite-plugin-ssr/issues/386)) ([255e788](https://github.com/brillout/vite-plugin-ssr/commit/255e788f1f27a5c91e632337524acc2e8e734dcb))
* stop executing `onBeforeRender()` hook upon rendering the error page ([f992343](https://github.com/brillout/vite-plugin-ssr/commit/f992343cdbaebb313ba852a125db3acb2f2e49e0))
* support 404 for `$ vite preview` + SSG ([28f8e02](https://github.com/brillout/vite-plugin-ssr/commit/28f8e02e8425f3b30efa53da99a058a320d09b1f))



## [0.4.13](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.12...v0.4.13) (2022-07-26)


### Bug Fixes

* forbidden re-exports in page files ([6bd30c8](https://github.com/brillout/vite-plugin-ssr/commit/6bd30c89a635eee84f092a6743ff1acb2b7298b7))
* further improve error message upon wrong Vite config while using pre-rendering ([#380](https://github.com/brillout/vite-plugin-ssr/issues/380)) ([013cb92](https://github.com/brillout/vite-plugin-ssr/commit/013cb929725102678a45a53a308cd39136b0e838))
* improve error message upon `prerender()` API usage with wrong Vite config (fix [#380](https://github.com/brillout/vite-plugin-ssr/issues/380)) ([4084c5a](https://github.com/brillout/vite-plugin-ssr/commit/4084c5aad2925a994cf4eeae0441dfa33a163fb2))
* remove wildcard re-export wrong usage assertion ([db3c015](https://github.com/brillout/vite-plugin-ssr/commit/db3c0150b12661cb211422d6a6124fe680aacc8e))
* remove wrong assertion (fix [#383](https://github.com/brillout/vite-plugin-ssr/issues/383)) ([928e12e](https://github.com/brillout/vite-plugin-ssr/commit/928e12e82debc8d09f3fbfa5db9f8afc6089e008))
* support dynamic `doNotPrerender` values (fix [#382](https://github.com/brillout/vite-plugin-ssr/issues/382)) ([8a5b9a4](https://github.com/brillout/vite-plugin-ssr/commit/8a5b9a4af63c773bb38427be9985d95e05c33df2))
* support wildcard re-exports (fix [#381](https://github.com/brillout/vite-plugin-ssr/issues/381)) ([64dc9a9](https://github.com/brillout/vite-plugin-ssr/commit/64dc9a9025d40061cf6f9151ba92789e163b731e))
* tell user to not define `doNotPrerender` in `.page.client.js` files ([5863a99](https://github.com/brillout/vite-plugin-ssr/commit/5863a997257972ae1588c83d42303e68a77c2a1e))
* use custom debug implementation instead of `debug` npm package ([b4bdf62](https://github.com/brillout/vite-plugin-ssr/commit/b4bdf624451af7816e50ccd7c74f4cf0e661735a))


### Features

* allow `doNotPrerender` to be defined in `_default.page.` files (close [#373](https://github.com/brillout/vite-plugin-ssr/issues/373)) ([33f6119](https://github.com/brillout/vite-plugin-ssr/commit/33f61195249f8f90a73e7f65dcb185b6e92eaebb))



## [0.4.12](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.11...v0.4.12) (2022-07-25)


### Bug Fixes

* add export resolvers for TS ([c995bfc](https://github.com/brillout/vite-plugin-ssr/commit/c995bfccf7a5ab2f723db62c740da93531c8443a))
* allow `_error.page.js` to be defined in `_default/` (fix [#374](https://github.com/brillout/vite-plugin-ssr/issues/374)) ([556b4b6](https://github.com/brillout/vite-plugin-ssr/commit/556b4b6ae4d7f0318e498759a0340c4c49f9610c))
* allow `export { doNotPrerender }` to be defined in `.page.js` and `.page.client.js` (fix [#378](https://github.com/brillout/vite-plugin-ssr/issues/378)) ([409b625](https://github.com/brillout/vite-plugin-ssr/commit/409b6253ae494ab1f95c9172c30161a2696244d9))
* explain user wrong usage instead of failing upon wrong export values ([dd6e94e](https://github.com/brillout/vite-plugin-ssr/commit/dd6e94e1bc3aefdc5fbfee9342cf60144dfc005e))
* false positive of using `pageContext.urlParsed.[hashString|searchString]` (fix [#377](https://github.com/brillout/vite-plugin-ssr/issues/377)) ([c129b9e](https://github.com/brillout/vite-plugin-ssr/commit/c129b9ed7e619455078baff073bd51b86ca12563))
* improve DEBUG=vps:extractStyles flag ([#376](https://github.com/brillout/vite-plugin-ssr/issues/376)) ([5301336](https://github.com/brillout/vite-plugin-ssr/commit/5301336a7e0cb5e52e8b045e23edda40f5d25829))
* improve error message upon wrong `onBeforePrerender()` hook usage ([f533bda](https://github.com/brillout/vite-plugin-ssr/commit/f533bda90688e82c68c4cdfdafa2ee146382b4c1))
* make `includeAssetsImportedByServer: false` work ([099bc10](https://github.com/brillout/vite-plugin-ssr/commit/099bc10b5877a656d19e3300795250fca4624133))
* make `includeAssetsImportedByServer` work for Vue SFCs (fix [#376](https://github.com/brillout/vite-plugin-ssr/issues/376)) ([f4c57fb](https://github.com/brillout/vite-plugin-ssr/commit/f4c57fb90d5e8d939a9f4edcdac0604a070ed1cc))
* set `includeAssetsImportedByServer` to `false` by default ([d8aa9a5](https://github.com/brillout/vite-plugin-ssr/commit/d8aa9a5f5ba1212bb714003771c1694d2d0f8e87))
* improve error messages ([611bb45](https://github.com/brillout/vite-plugin-ssr/commit/611bb45445cf75f00ce97393985808917163f825))


### Performance Improvements

* load less page files while pre-rendering ([611bb45](https://github.com/brillout/vite-plugin-ssr/commit/611bb45445cf75f00ce97393985808917163f825))
* use `PageFile[exportNames]` while pre-rendering, in order to avoid unnecessary loading of page files ([#373](https://github.com/brillout/vite-plugin-ssr/issues/373), [#378](https://github.com/brillout/vite-plugin-ssr/issues/378)) ([00db4f9](https://github.com/brillout/vite-plugin-ssr/commit/00db4f9c8db8b39ea71a28ab7990ce76e14c6fcb))



## [0.4.11](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.10...v0.4.11) (2022-07-22)


### Bug Fixes

* assertion when user throws non-object error ([7bad325](https://github.com/brillout/vite-plugin-ssr/commit/7bad325b3246fb45d9374293f2bcf01cb8ccc3ad))
* improve err msg upon production build not found ([9aaa254](https://github.com/brillout/vite-plugin-ssr/commit/9aaa254c28aea9cec8c5357db1591a51cb12a21d))



## [0.4.10](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.9...v0.4.10) (2022-07-20)


### Bug Fixes

* show the stack trace for warnings with a direct call stack from the user ([f5c22d4](https://github.com/brillout/vite-plugin-ssr/commit/f5c22d4cee29c62ca38070df77bf2c4c11c735fc))
* treat `_default/` directories as empty for filesystem routing `_default.page.*` files ([da9af6e](https://github.com/brillout/vite-plugin-ssr/commit/da9af6e615d6377f14e2364f80e25cb0a002e778))



## [0.4.9](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.8...v0.4.9) (2022-07-15)


### Bug Fixes

* ensure that plugin helpers are not loaded by server-side runtime ([48714f3](https://github.com/brillout/vite-plugin-ssr/commit/48714f36360e001c34d826b1d315f114182ce32a))



## [0.4.8](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.7...v0.4.8) (2022-07-15)


### Bug Fixes

* add `node_modules/vite-plugin-ssr` to `fs.allow` list ([86b1173](https://github.com/brillout/vite-plugin-ssr/commit/86b11734c49f24ac27371d7f8992fae4e42c9edf))
* do not import `es-module-lexer` from server-side runtime ([7420876](https://github.com/brillout/vite-plugin-ssr/commit/74208764de0dee4a7f36952a6029d5bec007c70e))
* do not import `fast-glob` from server-side runtime ([0fabc6d](https://github.com/brillout/vite-plugin-ssr/commit/0fabc6d2b5ca5eae0bc0103ecd5600db84da0b16))



## [0.4.7](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.6...v0.4.7) (2022-07-15)


### Bug Fixes

* `prerender()` types ([a53c492](https://github.com/brillout/vite-plugin-ssr/commit/a53c492ffcd990cf3c38e348a1b9d193328ff92d))
* avoid false warnings of outdated pageContext.pageExports usage ([905f830](https://github.com/brillout/vite-plugin-ssr/commit/905f83019a6483a1662152ad0f02da1bc548e692))
* do not load route files when using server routing ([0891002](https://github.com/brillout/vite-plugin-ssr/commit/0891002055a51b7976cb9a380c5dbc9e09448e66))
* eslint `prerender()` ([f8f12b5](https://github.com/brillout/vite-plugin-ssr/commit/f8f12b5a074ccc59595395eea8538be9b8b577bd))
* show stack trace upon outdated pageExports usage ([641f7d3](https://github.com/brillout/vite-plugin-ssr/commit/641f7d320f5cc132ad2e8efc993c9a484235ef3b))
* show viewport prefetching dev info only once ([dae2e98](https://github.com/brillout/vite-plugin-ssr/commit/dae2e98c287c481081a1933cdffe32ad46d8b8fc))



## [0.4.6](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.5...v0.4.6) (2022-07-14)


### Bug Fixes

* add page files to optimizeDeps.entries ([3c5fa83](https://github.com/brillout/vite-plugin-ssr/commit/3c5fa83aff61ff7528ba837274449aaf5e6b4a69))
* make fs logic simpler ([2d83b67](https://github.com/brillout/vite-plugin-ssr/commit/2d83b678d95bfc7f1ec353e50283ce9f5bd0c418))


### Performance Improvements

* improve page files to be scanned by Vite ([31f4c01](https://github.com/brillout/vite-plugin-ssr/commit/31f4c01555e003a4ffd278b7d8ffd37aacecf039))
* prevent Vite from scanning too many page files ([2772814](https://github.com/brillout/vite-plugin-ssr/commit/277281448edef026e666837089817acbba639960))



## [0.4.5](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.4...v0.4.5) (2022-07-12)


### Bug Fixes

* Vite CLI for npm (fix [#363](https://github.com/brillout/vite-plugin-ssr/issues/363)) ([13b00b5](https://github.com/brillout/vite-plugin-ssr/commit/13b00b508b9d9a4e354a6b7ae677ffdca10af75e))



## [0.4.4](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.3...v0.4.4) (2022-07-12)


### Bug Fixes

* workaround Vite 3 ping bug vitejs/vite[#9051](https://github.com/brillout/vite-plugin-ssr/issues/9051) ([0140b51](https://github.com/brillout/vite-plugin-ssr/commit/0140b5107ddc95767331daa16f7ee87ea5673793))



## [0.4.3](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.2...v0.4.3) (2022-07-12)


### Bug Fixes

* client entry loaded twice (fix [#362](https://github.com/brillout/vite-plugin-ssr/issues/362)) ([031f47c](https://github.com/brillout/vite-plugin-ssr/commit/031f47ccfaf20b0cae8e55161b9fb79f7432f569))



## [0.4.2](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.1...v0.4.2) (2022-07-11)


### Bug Fixes

* update URLs to https://vite-plugin-ssr.com docs ([2fc1a3a](https://github.com/brillout/vite-plugin-ssr/commit/2fc1a3a7199e9bf319847ea3cd581edd4e681d1e))



## [0.4.1](https://github.com/brillout/vite-plugin-ssr/compare/v0.4.0...v0.4.1) (2022-07-11)


### Bug Fixes

* add crossorigin attribute to preload link with absolute src (fix [#355](https://github.com/brillout/vite-plugin-ssr/issues/355)) ([2c4ed4b](https://github.com/brillout/vite-plugin-ssr/commit/2c4ed4b5f5c9b04da43903fcf654f209c107d7af))
* route precedence for new param token `@` ([f83aa57](https://github.com/brillout/vite-plugin-ssr/commit/f83aa57c2928afc6cdcd666e9e9d0d13912f0740))



# [0.4.0](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.64...v0.4.0) (2022-07-10)


### BREAKING CHANGES

See [vite-plugin-ssr.com/migration/0.4](https://vite-plugin-ssr.com/migration/0.4) for how to migrate from `0.3` to `0.4`.


### Features

Major feature: see [this Twitter Thread](https://twitter.com/brillout/status/1546478670860140544).

Minor features:

* enable overwriting default routing with onBeforeRoute() ([46b9e19](https://github.com/brillout/vite-plugin-ssr/commit/46b9e19386367419cc881307c326df5b5fa8b54c))
* pageContext.urlParsed.searchAll ([94ee761](https://github.com/brillout/vite-plugin-ssr/commit/94ee7611283a933b4d05fbf043d8bc2166e80992))
* Parameterized Filesystem Routing ([416a94e](https://github.com/brillout/vite-plugin-ssr/commit/416a94e238557271d4e93cf713e05f8a1ff44336))
* support export default (fix [#314](https://github.com/brillout/vite-plugin-ssr/issues/314)) ([f653b68](https://github.com/brillout/vite-plugin-ssr/commit/f653b68b7d957f4c0139a22394988e576deaf05d))


### Bug Fixes

* add routing debug logs ([dfdb208](https://github.com/brillout/vite-plugin-ssr/commit/dfdb2081187d5e5f8a4872ad07fea67a693ce49d))
* add support for `$ vite preview` command ([c8ca4b8](https://github.com/brillout/vite-plugin-ssr/commit/c8ca4b8ed09eeba2becb7b0bb6b815a9800974cc))
* add support for ReScript ([a040fe7](https://github.com/brillout/vite-plugin-ssr/commit/a040fe7e56ea34ab2aee2951d91e626abd870bcf))
* add worker exports to `package.json#exports` for Cloudflare Workers ([954fe02](https://github.com/brillout/vite-plugin-ssr/commit/954fe02c13e103210499508e1736bef3044615ec))
* assert HTML variables ([254cf54](https://github.com/brillout/vite-plugin-ssr/commit/254cf549292a7b523dbad4f4f66c92e195c5b8d2))
* do not append ?extractStyles to asset imports for image Vite plugins (fix [#353](https://github.com/brillout/vite-plugin-ssr/issues/353)) ([1b937e2](https://github.com/brillout/vite-plugin-ssr/commit/1b937e28c656515e4d7c15791745a9a6c77dde49))
* do not copy static assets to `dist/server/` ([7e33664](https://github.com/brillout/vite-plugin-ssr/commit/7e336640ab859be358e35da4ea6d800a96bd3984))
* ensure HMR preamble code to be executed before client entries ([f4ff28b](https://github.com/brillout/vite-plugin-ssr/commit/f4ff28bc01ea2b81a354e3974749b5fe1eca253a))
* ensure Rollup generates an entry for each page file (fix [#350](https://github.com/brillout/vite-plugin-ssr/issues/350)) ([e659e26](https://github.com/brillout/vite-plugin-ssr/commit/e659e2643d4002f01113c1bd7b7ce926d077d8eb))
* ensure stream end handler is called once ([768c383](https://github.com/brillout/vite-plugin-ssr/commit/768c38328cc4544232968abee591e04870c9b5e5))
* ensure stream is always flushed ([5770d9f](https://github.com/brillout/vite-plugin-ssr/commit/5770d9fa8a845c16e137f7f4d37bc45fa4d3c8cf))
* fix styling in development for browser back/fwd buttons ([d3d4190](https://github.com/brillout/vite-plugin-ssr/commit/d3d4190b16b1179578df9d04acb3d3d56a70830d))
* handle destroyed Node.js writable proxy ([6488300](https://github.com/brillout/vite-plugin-ssr/commit/6488300cc1f4e5418ae178efa46ceef421f70995))
* handle URLs with several trailing slashes ([#310](https://github.com/brillout/vite-plugin-ssr/issues/310)) ([551b020](https://github.com/brillout/vite-plugin-ssr/commit/551b0207d0b3440ed60f92f337e5c97fdc18552f))
* improve asset naming ([8791d66](https://github.com/brillout/vite-plugin-ssr/commit/8791d6643da73c7624329386dda73123d3e59c6f))
* improve debug logs ([978a7c2](https://github.com/brillout/vite-plugin-ssr/commit/978a7c28f37ba59bcb81d8113a403a5ad240b9f7))
* improve error message upon multiple versions loaded ([6bb206e](https://github.com/brillout/vite-plugin-ssr/commit/6bb206eef570b22647a4161eb64137a9921d8e0b))
* improve error message upon wrong streaming setup ([baf8c88](https://github.com/brillout/vite-plugin-ssr/commit/baf8c8802e0e66c224486e6232ceebc5a9e21f2f))
* improve filesystem routing when `pages/` is (deeply) nested ([858dde4](https://github.com/brillout/vite-plugin-ssr/commit/858dde4498947432d7bf91ba5345ef29ccbe939b))
* improve prefetch config ([f4b4cc7](https://github.com/brillout/vite-plugin-ssr/commit/f4b4cc7945355b32ed7188cdcb6f84e6f22a6051))
* improve stream error handling ([d4835c0](https://github.com/brillout/vite-plugin-ssr/commit/d4835c06b31c23688b7a97ac095059e44b9cf834))
* improve wrong usage error message ([2d3132d](https://github.com/brillout/vite-plugin-ssr/commit/2d3132db0ed1e8f4d17e4d7b079c17f7d5dc84c8))
* increase scroll listener throttle timeout ([#46](https://github.com/brillout/vite-plugin-ssr/issues/46)) ([ab36ac3](https://github.com/brillout/vite-plugin-ssr/commit/ab36ac3d44569bb3bf77d5115f28c8ece891c9b5))
* isolate framework pageFiles symlink directory ([6e2d6f1](https://github.com/brillout/vite-plugin-ssr/commit/6e2d6f18e91dc7efd16a185588d91ad45b44c837))
* make `$ vite dev` and `$ vite preview` support HTML streaming ([9a59360](https://github.com/brillout/vite-plugin-ssr/commit/9a593608be34c0e7323751f484c4c2815ef29634))
* make `httpResponse.pipe()` work with Readable Streams ([558f87a](https://github.com/brillout/vite-plugin-ssr/commit/558f87a72548576d3def017ad3bee3c13f69b35d))
* make `navigate()` cross-bundle safe ([68a9e7a](https://github.com/brillout/vite-plugin-ssr/commit/68a9e7a6cc28936c29ef1ed1cb6997d63f107244))
* make vps resilient against array prototype extensions ([2d09e75](https://github.com/brillout/vite-plugin-ssr/commit/2d09e75b0ce992c3342de6f9b4969771389b73b2))
* only add vps dev middleware for Vite's CLI ([b0c3974](https://github.com/brillout/vite-plugin-ssr/commit/b0c3974f15a4508f99e6d22dedbf4e1b8f6c6d5e))
* route precedence ([e2bfd5d](https://github.com/brillout/vite-plugin-ssr/commit/e2bfd5d13aa1846c5e6fd68a574ab4c43c5f47b9))
* support `$ vite dev` command ([4ca3e39](https://github.com/brillout/vite-plugin-ssr/commit/4ca3e39f75da0482f2050f3ab73e7f649d1752dd))
* support `vite preview` command for SSG ([a7c602a](https://github.com/brillout/vite-plugin-ssr/commit/a7c602a84d263dd9db84afc6bb59310f6cbf9cc3))
* support rollup format synonyms ([1a7d4f7](https://github.com/brillout/vite-plugin-ssr/commit/1a7d4f7d65a5ec3aec354b1411a2f8cdc09f9e6b))
* swallow expected errors upon new frontend deploy ([34d800f](https://github.com/brillout/vite-plugin-ssr/commit/34d800f12aed3411c40ca5c1f9f744a206b5a0d2))
* switch to server-routing if asset fail to load upon new deploy ([#292](https://github.com/brillout/vite-plugin-ssr/issues/292)) ([1f837d5](https://github.com/brillout/vite-plugin-ssr/commit/1f837d5cb8d8239d043227b4a832f3bbe461a6cd))
* throw normalized client-side error upon new deploy handling ([e0163a8](https://github.com/brillout/vite-plugin-ssr/commit/e0163a80f1293306a48e6d9f5c46414335f3783a))
* tolerate multiple vps instances ([74b8eb2](https://github.com/brillout/vite-plugin-ssr/commit/74b8eb20e270a1412af8452cb95ccfc9eb623720))
* treat `Object.ceate(null)` as plain JavaScript object ([c9eb387](https://github.com/brillout/vite-plugin-ssr/commit/c9eb387ff2f878ee949441f4f1235ab9461e6d17))
* update pageContext.urlParsed type ([12261ac](https://github.com/brillout/vite-plugin-ssr/commit/12261ac06341b5a3db985d8ee2aa80df43d58291))


### Performance Improvements

* ensure scripts to be loaded last ([b921e60](https://github.com/brillout/vite-plugin-ssr/commit/b921e606f0a11f7f6a5ffbbc962b940d669b006b))
* only add page entries to `optimizeDeps.entries` if CI ([8e10dae](https://github.com/brillout/vite-plugin-ssr/commit/8e10dae2c2b4517981ded3ead148db9aeaeadc8a))
* resolve dynamic imports early ([a9da5a2](https://github.com/brillout/vite-plugin-ssr/commit/a9da5a2d968411a17ff40e3ac4fb1737ba7e00c7))
* scan index page on dev start ([4f82f03](https://github.com/brillout/vite-plugin-ssr/commit/4f82f035a9def4580d9a28f2e6cea928fdf764b5))



## [0.3.64](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.63...v0.3.64) (2022-04-14)


### Bug Fixes

* remove console.log() ([32848a7](https://github.com/brillout/vite-plugin-ssr/commit/32848a79a2fedc7ae9b1ee53f3c843c4203ad311))



## [0.3.63](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.62...v0.3.63) (2022-04-14)


### Bug Fixes

* client-side routing unicode navigate (fix [#307](https://github.com/brillout/vite-plugin-ssr/issues/307)) ([fba7e77](https://github.com/brillout/vite-plugin-ssr/commit/fba7e777135f5b2fea061cc35150c344bdbc6b31))



## [0.3.62](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.61...v0.3.62) (2022-04-09)


### Bug Fixes

* help esbuild resolve `navigate()` server-side import (fix [#301](https://github.com/brillout/vite-plugin-ssr/issues/301)) ([a03a392](https://github.com/brillout/vite-plugin-ssr/commit/a03a3921a8a4c0b9981c4ae42c6b21bd57bbdd21))



## [0.3.61](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.60...v0.3.61) (2022-03-30)


### Bug Fixes

* Fix duplicate decodeURI logic ([#291](https://github.com/brillout/vite-plugin-ssr/pull/291))



## [0.3.60](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.59...v0.3.60) (2022-03-11)


### Bug Fixes

* allow `prerender()` to be called without any argument ([7eca89d](https://github.com/brillout/vite-plugin-ssr/commit/7eca89d5ba53bc28fa27a16c6b7e8ad34d9bdcf6))
* forbid usage of older problematic Vite version ([1b04a99](https://github.com/brillout/vite-plugin-ssr/commit/1b04a99f100e763ff4e0929f97d40f03d745a7b9))
* support unicode URLs ([443f7c6](https://github.com/brillout/vite-plugin-ssr/commit/443f7c646d7d1e9ccc73a36d0fc5b31c9f94bf14))



## [0.3.59](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.58...v0.3.59) (2022-02-23)


### Bug Fixes

* help eslint resolve modules (fix [#270](https://github.com/brillout/vite-plugin-ssr/issues/270)) ([14dfe7a](https://github.com/brillout/vite-plugin-ssr/commit/14dfe7ad91532ecf461417593da3037e58a35750))
* improve bug error message ([#268](https://github.com/brillout/vite-plugin-ssr/issues/268)) ([a848d9d](https://github.com/brillout/vite-plugin-ssr/commit/a848d9d7f086a73b8f556480d9c1a9feb9f5b5b7))
* improve error message upon wrong `escapeInject` usage (fix [#268](https://github.com/brillout/vite-plugin-ssr/issues/268)) ([9331aa8](https://github.com/brillout/vite-plugin-ssr/commit/9331aa8a34ca5ec4d36953ac0a742fe93e6e1b8a))



## [0.3.58](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.57...v0.3.58) (2022-02-20)


### Bug Fixes

* fix windows dynamic import path resolve ([c548f3e](https://github.com/brillout/vite-plugin-ssr/commit/c548f3ee4c336eaaeeff3f4a8f7dc12680ac5a7d))



## [0.3.57](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.56...v0.3.57) (2022-02-20)


### Bug Fixes

* support ESM module dist/server ([4499330](https://github.com/brillout/vite-plugin-ssr/commit/449933089f9d9708830b8b12e6a2413c48c32f90))
* use `import()` instead of `require()` ([a7886be](https://github.com/brillout/vite-plugin-ssr/commit/a7886be09f642cff56434a86f8ce00d20860b625))



## [0.3.56](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.55...v0.3.56) (2022-02-19)


### Bug Fixes

* [bundle-size reduction] remove unused utils from client ([cb86e81](https://github.com/brillout/vite-plugin-ssr/commit/cb86e81f57a5e1d975a0104cd474dc2ff054057c))
* [npm package size reduction] remove tests from npm package ([3ad6a6b](https://github.com/brillout/vite-plugin-ssr/commit/3ad6a6ba0cf9bea45444cc49c6db78fe9db51268))
* [npm package size reduction] replace dual ESM+CJS transpiling with ([0157912](https://github.com/brillout/vite-plugin-ssr/commit/0157912aa72ae4b2a5d3c103ff2f65c27244522f))



## [0.3.55](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.54...v0.3.55) (2022-02-18)


### Bug Fixes

* remove TS source files from npm package (fix [#265](https://github.com/brillout/vite-plugin-ssr/issues/265)) ([d15f134](https://github.com/brillout/vite-plugin-ssr/commit/d15f134c768ef7f244e65cdff1b88bada9f98a60))



## [0.3.54](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.53...v0.3.54) (2022-02-17)


### Bug Fixes

* improve internal failure message ([eaa1aba](https://github.com/brillout/vite-plugin-ssr/commit/eaa1ababa81a1a15748c178ebf27b4fb65f6d19e))
* skip empty href links (fix [#263](https://github.com/brillout/vite-plugin-ssr/issues/263)) ([5568754](https://github.com/brillout/vite-plugin-ssr/commit/556875465b4d026f1c02df7d8182766f59f88c6f))



## [0.3.53](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.52...v0.3.53) (2022-02-10)


### Bug Fixes

* add TypeScript types to CLI JavaScript API ([b1d90c5](https://github.com/brillout/vite-plugin-ssr/commit/b1d90c54a6c13e92abc32a2c24111af1261666e6))



## [0.3.52](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.51...v0.3.52) (2022-02-10)


### Features

* pass `globalContext` to `prerender()` hooks ([0f52a77](https://github.com/brillout/vite-plugin-ssr/commit/0f52a778691c2b27bdbe6a2ade4c153ad0d84372))



## [0.3.51](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.50...v0.3.51) (2022-02-01)


### Bug Fixes

* fix @brillout/json-s optimizeDeps entry ([4e45d08](https://github.com/brillout/vite-plugin-ssr/commit/4e45d084d05d3a473d7295143432493dcc50a248))
* gracefully handle unexpected URL formats (fix [#252](https://github.com/brillout/vite-plugin-ssr/issues/252)) ([48ca1b1](https://github.com/brillout/vite-plugin-ssr/commit/48ca1b10ce9067e948425cbefc59072a206c000a))
* improve DX around wrong environment ([4f705c4](https://github.com/brillout/vite-plugin-ssr/commit/4f705c4d3043479cefefebcb687abe3554da89f9))
* use more robust Node.js env test ([7240263](https://github.com/brillout/vite-plugin-ssr/commit/724026366b41f811e9b20047419d17eda2a759e8))



## [0.3.50](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.49...v0.3.50) (2022-01-28)


### Bug Fixes

* fix 404 link ([1006387](https://github.com/brillout/vite-plugin-ssr/commit/10063874a8b4ae1f9ec5ba3187ae5b538e9defd4))
* improve DX upon serialization failure ([d42911c](https://github.com/brillout/vite-plugin-ssr/commit/d42911ca0d4fd6c2bfae28ea4cb8846113102cbd))


### Features

* enable users to trigger error page by `throw RenderPageError({ pageContext: /* some additional context passed to _error.page.js */ })` ([8731c6e](https://github.com/brillout/vite-plugin-ssr/commit/8731c6e3a83ef014db4361a4b4f6a8dcb1bc6e87))



## [0.3.49](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.48...v0.3.49) (2022-01-26)


### Features

* add `baseAssets` option; enable CDN deployments ([dac4841](https://github.com/brillout/vite-plugin-ssr/commit/dac484193fbbe6f2432b0e2ad35197bfba1e378a))



## [0.3.48](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.47...v0.3.48) (2022-01-25)


### Bug Fixes

* fix and rename `doNotCreateNewHistoryEntry` to `overwriteLastHistoryEntry` ([d3a4582](https://github.com/brillout/vite-plugin-ssr/commit/d3a458252e43e337769c17d03293201e5abf4e8c))



## [0.3.47](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.46...v0.3.47) (2022-01-24)


### Features

* new `navigate()` option `doNotCreateNewHistoryEntry` ([59460fd](https://github.com/brillout/vite-plugin-ssr/commit/59460fdc2a6b678be92636f129e0707d8871ff4c))



## [0.3.46](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.45...v0.3.46) (2022-01-18)


### Features

* allow `render()` hook to return a `pageContext` promise ([44ef89d](https://github.com/brillout/vite-plugin-ssr/commit/44ef89d2eb03dc0ee0a26a3257f9ca6b72a4504f))



## [0.3.45](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.44...v0.3.45) (2022-01-17)


### Bug Fixes

* allow user to define `rollupOptions.input` with a `string` or `string[]` ([d3f116d](https://github.com/brillout/vite-plugin-ssr/commit/d3f116ddcbdfdac2417179d8bf95360e97e8669f))



## [0.3.44](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.43...v0.3.44) (2022-01-12)


### Features

* expose SSR errors at `pageContext.errorWhileRendering` ([3a10f11](https://github.com/brillout/vite-plugin-ssr/commit/3a10f112ec52000ed507d8bf2b0874ef8f929ad0))



## [0.3.43](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.42...v0.3.43) (2022-01-04)


### Bug Fixes

* enable improved SPA example ([f111fd5](https://github.com/brillout/vite-plugin-ssr/commit/f111fd594b0cdd2ef4a4bbdd3208a3395827e1d2))



## [0.3.42](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.41...v0.3.42) (2021-12-27)


### Bug Fixes

* attempt to fix the setup.ts bug ([0ae3499](https://github.com/brillout/vite-plugin-ssr/commit/0ae3499df2389389e2f1c49d0d2764b45858e5bb))



## [0.3.41](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.40...v0.3.41) (2021-12-24)


### Features

* add option `prerender({ onPagePrender })` ([b864664](https://github.com/brillout/vite-plugin-ssr/commit/b864664cca241ca6e14f09915d9ecbd581fd1ecb))



## [0.3.40](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.39...v0.3.40) (2021-12-23)


### Bug Fixes

* do not use `outDir` config for plugin `dist/` folder ([a7b2cc5](https://github.com/brillout/vite-plugin-ssr/commit/a7b2cc5def992d41c538d156bb914d3dd3878dcd))
* improve error message when `importBuild.js` is missing (fix [#235](https://github.com/brillout/vite-plugin-ssr/issues/235)) ([4390d7f](https://github.com/brillout/vite-plugin-ssr/commit/4390d7f13885bed5ddeb3d9f2c34f314c0fe27fa))
* replace direct eval with new Function ([9432d31](https://github.com/brillout/vite-plugin-ssr/commit/9432d31ed9f6e2519a76d61bfd2691495532c5a2))
* support Cloudflare Pages workers ([950b470](https://github.com/brillout/vite-plugin-ssr/commit/950b470703522f1c9bb1946cfd3d565c96d12739))



## [0.3.39](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.38...v0.3.39) (2021-12-18)


### Bug Fixes

* add debug info for `setup.ts:14` bug ([edad4cc](https://github.com/brillout/vite-plugin-ssr/commit/edad4cce99eefae4e2db04a641914b9982b41e45))



## [0.3.38](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.37...v0.3.38) (2021-12-18)


### Bug Fixes

* make `noExternal: true` work with vite-plugin-ssr ([bacba9f](https://github.com/brillout/vite-plugin-ssr/commit/bacba9f8d5991242d466047bf38cc45e75d5d778))



## [0.3.37](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.36...v0.3.37) (2021-12-17)


### Bug Fixes

* HTML tag detection regex ([d8c3846](https://github.com/brillout/vite-plugin-ssr/commit/d8c3846d1cab2df9fa24a28a9c1715eb78aae625))
* load stream module dynamically only if needed ([beb589d](https://github.com/brillout/vite-plugin-ssr/commit/beb589d54ca02c3927b4be25b90b8a84e55e4e7a))
* remove Vite's require hook plugin ([55270db](https://github.com/brillout/vite-plugin-ssr/commit/55270dbb80a825cb02bbcf88217ca88c2400b7c4))


### BREAKING CHANGES

* HTML Streaming changes.

 - `httpResponse.bodyNodeStream` -> `httpResponse.getNodeStream()`
 - `httpResponse.bodyWebStream` -> `httpResponse.getWebStream()`
 - `httpResponse.bodyPipeToNodeWritable()` -> `httpResponse.pipeToNodeWritable()`
 - `httpResponse.bodyPipeToWebWritable()` -> `httpResponse.pipeToWebWritable()`

More infos at https://vite-plugin-ssr.com/stream



## [0.3.36](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.35...v0.3.36) (2021-12-13)


### Bug Fixes

* add support for relative URLs such as `./relative-path` or `?query` ([b0329d2](https://github.com/brillout/vite-plugin-ssr/commit/b0329d206cf80ab6b0b202d1c7fc9093e9b65fb7))
* deprecate `pageContext.urlNormalized` in favor of `pageContext.urlPathname` and `pageContext.urlParsed` ([2b23bf3](https://github.com/brillout/vite-plugin-ssr/commit/2b23bf345ca9aebc1f0633a5b557c3049dbc600f))


### BREAKING CHANGES

* `pageContext.urlNormalized` is deprecated. Use `pageContext.urlPathname` and `pageContext.urlParsed` instead.



## [0.3.35](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.34...v0.3.35) (2021-12-07)


### Bug Fixes

* fix minor Base URL bug


## [0.3.34](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.33...v0.3.34) (2021-12-04)


### Bug Fixes

* filesystemRoutingRoot living at root ([3f27e5d](https://github.com/brillout/vite-plugin-ssr/commit/3f27e5da55450a7d8f71195fe6c389e28f68e9b7))



## [0.3.33](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.32...v0.3.33) (2021-12-03)


### Bug Fixes

* improve assert ([d6bb445](https://github.com/brillout/vite-plugin-ssr/commit/d6bb44567d2fefce48dd7987d81906a99eda7daf))



## [0.3.32](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.31...v0.3.32) (2021-12-03)


### Bug Fixes

* remove duplicated Base URL in dev ([b6b660d](https://github.com/brillout/vite-plugin-ssr/commit/b6b660d582023da48fa6c92ba96f13219221a626))
* support page files at app root ([7674ec7](https://github.com/brillout/vite-plugin-ssr/commit/7674ec7edacd43f9de82af6a34d9c88d26edd6ef))



## [0.3.31](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.30...v0.3.31) (2021-11-19)


### Bug Fixes

* don't assume Vite to normalize `root` (fix [#208](https://github.com/brillout/vite-plugin-ssr/issues/208)) ([3b50083](https://github.com/brillout/vite-plugin-ssr/commit/3b5008337ebb346057f1cd0133d9dd5e244e2f6c))
* fix client routing deadlock when ensureHydration is set ([124c83c](https://github.com/brillout/vite-plugin-ssr/commit/124c83c692cfb8713e30af196a84bf91d9a98472))



## [0.3.30](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.29...v0.3.30) (2021-11-18)


### Bug Fixes

* make `pageContext.pageProps.is404` more resilient ([765c5b3](https://github.com/brillout/vite-plugin-ssr/commit/765c5b3df4068a9b89c56a816d09285aea4d33f2))



## [0.3.29](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.28...v0.3.29) (2021-11-16)


### Bug Fixes

* add support for `url === '/some-base-url' && baseUrl === '/some-base-url/'` ([bfac53b](https://github.com/brillout/vite-plugin-ssr/commit/bfac53b2055faa2ca395d762d3ee9f25a678c657))
* Client Router + Base URL regression (fix [#205](https://github.com/brillout/vite-plugin-ssr/issues/205)) ([cb95ed4](https://github.com/brillout/vite-plugin-ssr/commit/cb95ed45a9b727a38105ce296b6cd0a6a10e486d))
* improve argument handling of `useClientRouter()` ([8db8836](https://github.com/brillout/vite-plugin-ssr/commit/8db8836163c92b499cd74a787c41ff8d76c9a8ae))
* regression pageProps.is404 overridden by user provided `pageContext` ([a796168](https://github.com/brillout/vite-plugin-ssr/commit/a7961686cdb9c834bd0bd70f33c70472e563258f))
* skip Client Router for links that don't match Base URL ([bce64c5](https://github.com/brillout/vite-plugin-ssr/commit/bce64c5c49a6b595a54b6379aad50593a589a737))



## [0.3.28](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.27...v0.3.28) (2021-11-15)


### Bug Fixes

* add scss/sass/less to inferred types (fix [#196](https://github.com/brillout/vite-plugin-ssr/issues/196)) ([0a329cf](https://github.com/brillout/vite-plugin-ssr/commit/0a329cf9a7fd7c99a435f7ad861a48809ed51513))
* always use camelCase for CLI options ([2ad6027](https://github.com/brillout/vite-plugin-ssr/commit/2ad60273c0b23d89afeccaafad36525806136282))
* fix buggy CSS test ([8676afa](https://github.com/brillout/vite-plugin-ssr/commit/8676afa10436d55225e68a5644056d802cf943ed))
* fix Route Function precedence value assertion ([f4d41c7](https://github.com/brillout/vite-plugin-ssr/commit/f4d41c7eb8d1d63ae21fc8620ac74b969a10e55f))
* improve error message when client-side routing to 404 ([c036f51](https://github.com/brillout/vite-plugin-ssr/commit/c036f516c22c9dda65c92bb82b82a600835f7b94))
* show warning instead of internal error upon relative link URLs ([83255e2](https://github.com/brillout/vite-plugin-ssr/commit/83255e260aed5ab4dd8a80a16e56e7236e76472d))


### BREAKING CHANGES

* CLI option `$ vite-plugin-ssr prerender --no-extra-dir`
renamed to `$ vite-plugin-ssr prerender --noExtraDir`.



## [0.3.27](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.26...v0.3.27) (2021-11-10)


### Bug Fixes

* circumvent React/Node.js bug (fix [#203](https://github.com/brillout/vite-plugin-ssr/issues/203)) ([b024045](https://github.com/brillout/vite-plugin-ssr/commit/b024045f01bdf0496251b2f2eb9ff3bb7e54b7ad))



## [0.3.26](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.25...v0.3.26) (2021-11-05)


### Bug Fixes

* do not normalize `pageContext.url` ([22a5311](https://github.com/brillout/vite-plugin-ssr/commit/22a5311a327bee99707e1a384c3a2ac9c985a3bd))



## [0.3.25](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.24...v0.3.25) (2021-11-05)


### Bug Fixes

* fix wrong assert ([4d4fa35](https://github.com/brillout/vite-plugin-ssr/commit/4d4fa35c718887581433a4aab5cb6e19e6b9cdc7))



## [0.3.24](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.23...v0.3.24) (2021-11-04)


### Bug Fixes

* [Client Router] add support for links with hash ([39ad1fb](https://github.com/brillout/vite-plugin-ssr/commit/39ad1fb420474825538aaf0cfd30bd7e7e664c07))
* add link prefetch handlers once ([b8e0d00](https://github.com/brillout/vite-plugin-ssr/commit/b8e0d003d2c70e95d7b0a89311c4e94bf58eaf97))



## [0.3.23](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.22...v0.3.23) (2021-11-03)


### Bug Fixes

* also render 500 page upon client-side routing ([252137b](https://github.com/brillout/vite-plugin-ssr/commit/252137ba9667afa334a3f7818b1d645cb34b31fd))
* ensure right content type for `.pageContext.json` URLs ([#191](https://github.com/brillout/vite-plugin-ssr/issues/191)) ([56e356f](https://github.com/brillout/vite-plugin-ssr/commit/56e356fb64b59a6c7ec9e2dad037e9ae7ed6c1e3))
* impl clear message when hooks wrongfully return whole `pageContext` object (fix [#174](https://github.com/brillout/vite-plugin-ssr/issues/174)) ([c38eb98](https://github.com/brillout/vite-plugin-ssr/commit/c38eb98188d1a27119c2e67582213bd025a0904d))



## [0.3.22](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.21...v0.3.22) (2021-11-02)


### Bug Fixes

* Add webp to inferred types ([#195](https://github.com/brillout/vite-plugin-ssr/pull/195))



## [0.3.21](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.20...v0.3.21) (2021-11-02)


### Bug Fixes

* provide `pageContext.httpResponse.contentType` (fix [#191](https://github.com/brillout/vite-plugin-ssr/issues/191)) ([ee5009d](https://github.com/brillout/vite-plugin-ssr/commit/ee5009dcd0e5ec8b5a18cdd8dc13ab095f4016ca))



## [0.3.20](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.19...v0.3.20) (2021-10-30)


### Bug Fixes

* fix renderPage type (fix [#184](https://github.com/brillout/vite-plugin-ssr/issues/184)) ([2263f43](https://github.com/brillout/vite-plugin-ssr/commit/2263f438e90b8605ff7a3f2bfe5fda3f925a90bf))



## [0.3.19](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.18...v0.3.19) (2021-10-27)


### Bug Fixes

* improve CSP support ([#181](https://github.com/brillout/vite-plugin-ssr/pull/181))



## [0.3.18](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.17...v0.3.18) (2021-10-26)


### Bug Fixes

* ensure filesystem routing is skipped when there is a page route file ([95eff57](https://github.com/brillout/vite-plugin-ssr/commit/95eff57d0866e620cec5019acf11951abc34dad2))
* improve overall precedence algorithm ([4f84f4e](https://github.com/brillout/vite-plugin-ssr/commit/4f84f4e0777e2fc9f6ac3b9f6a04cd14b2373eaf))



## [0.3.17](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.16...v0.3.17) (2021-10-25)


### Bug Fixes

* improve route string precedence ([74e6abb](https://github.com/brillout/vite-plugin-ssr/commit/74e6abb16c9362c68520ba0789bdb1d30a1d8f4e))



## [0.3.16](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.15...v0.3.16) (2021-10-25)


### Bug Fixes

* refactor route precedence algorithm ([8ce369b](https://github.com/brillout/vite-plugin-ssr/commit/8ce369b6460a49ab6e2b81fd414452f3bf756703))


### BREAKING CHANGES

* Route Functions should return `precedence` instead of
`matchValue`, see https://vite-plugin-ssr.com/route-function



## [0.3.15](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.14...v0.3.15) (2021-10-24)


### Bug Fixes

* reduce priority of catch-all routes ([3b11956](https://github.com/brillout/vite-plugin-ssr/commit/3b11956a9083c4a281380d363a97b23c4f7c5ddb))



## [0.3.14](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.13...v0.3.14) (2021-10-24)


### Bug Fixes

* avoid duplicate error logs ([63eb40f](https://github.com/brillout/vite-plugin-ssr/commit/63eb40fcebc724180d7232934098fc7623418f4d))
* make catch-all route lower prio (fix [#178](https://github.com/brillout/vite-plugin-ssr/issues/178)) ([235e0dc](https://github.com/brillout/vite-plugin-ssr/commit/235e0dcd1151b8bc7ff3487f6887954bc1efcd05))


### Features

* make `outDir` configurable instead of always being `dist/` ([#177](https://github.com/brillout/vite-plugin-ssr/pull/177))


### BREAKING CHANGES

* Route String priority algorithm changed. AFAICT there
aren't any breaking change, but no guarantee here.



## [0.3.13](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.12...v0.3.13) (2021-10-21)


### Features

* link prefetching ([9d93b46](https://github.com/brillout/vite-plugin-ssr/commit/9d93b46d5d7c5e22901c97f2d81b6c5b8255477a))



## [0.3.12](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.11...v0.3.12) (2021-10-17)


### Bug Fixes

* client router TS type ([4d11ac3](https://github.com/brillout/vite-plugin-ssr/commit/4d11ac35d4f42fe5ded1d6f71a7d4a7ee87ecdc5))



## [0.3.11](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.10...v0.3.11) (2021-10-16)


### Features

* support multiple `onBeforeRender()` hooks in `.page.js` and `.page.server.js` ([#95](https://github.com/brillout/vite-plugin-ssr/issues/95), [#153](https://github.com/brillout/vite-plugin-ssr/issues/153))


### Bug Fixes

* do not `optimizeDeps` client code deps ([#168](https://github.com/brillout/vite-plugin-ssr/issues/168))
* update path-to-regexp ([f997192](https://github.com/brillout/vite-plugin-ssr/commit/f997192c54bc5209102e6a01d9e57945ce5fe4bb))


### BREAKING CHANGES

* catch-all route is now `'/*'` instead of `'/:params*'`,
see https://vite-plugin-ssr.com/catch-all



## [0.3.10](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.9...v0.3.10) (2021-10-09)


### Bug Fixes

* prepare Vite breaking change ([8312b5d](https://github.com/brillout/vite-plugin-ssr/commit/8312b5d5875db8f411c74bc568b99415f109ad19))



## [0.3.9](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.7...v0.3.9) (2021-10-08)


### Bug Fixes

* add option `useClientRouter({ ensureHydration: boolean })` to mitigate "Hydration Mismatch" errors for Vue users" ([c5891cd](https://github.com/brillout/vite-plugin-ssr/commit/c5891cdc3af5e7873d169c4c672805c994e4f150))
* fix tolerate readable streams with missing read() handler ([#138](https://github.com/brillout/vite-plugin-ssr/issues/138)) ([e33eea4](https://github.com/brillout/vite-plugin-ssr/commit/e33eea453b3242f6d7784c559f8b36ff315e8308))
* stop make superfluous `.pageContext.json` requests when there are no `onBeforeRender()` defined on the server-side ([#95](https://github.com/brillout/vite-plugin-ssr/issues/95)) ([6a16049](https://github.com/brillout/vite-plugin-ssr/commit/6a16049ac084eed28e0eced2ccfa54518601dd8d))
* tolerate readable streams with missing `read()` handler ([#138](https://github.com/brillout/vite-plugin-ssr/issues/138)) ([a214190](https://github.com/brillout/vite-plugin-ssr/commit/a2141909cd40a96bdc167bfbb07d7659178ede5d))



## [0.3.8](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.7...v0.3.8) (2021-10-07)


### Bug Fixes

* add option `useClientRouter({ ensureHydration: boolean })` to mitigate "Hydration Mismatch" errors for Vue users" ([c5891cd](https://github.com/brillout/vite-plugin-ssr/commit/c5891cdc3af5e7873d169c4c672805c994e4f150))
* stop make superfluous `.pageContext.json` requests when there are no `onBeforeRender()` defined on the server-side ([#95](https://github.com/brillout/vite-plugin-ssr/issues/95)) ([6a16049](https://github.com/brillout/vite-plugin-ssr/commit/6a16049ac084eed28e0eced2ccfa54518601dd8d))
* tolerate readable streams with missing `read()` handler ([#138](https://github.com/brillout/vite-plugin-ssr/issues/138)) ([a214190](https://github.com/brillout/vite-plugin-ssr/commit/a2141909cd40a96bdc167bfbb07d7659178ede5d))



## [0.3.7](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.6...v0.3.7) (2021-10-05)


### Bug Fixes

* also add `@brillout/json-s` to `optimizeDeps` ([ed255d1](https://github.com/brillout/vite-plugin-ssr/commit/ed255d1a563ccd7f07b2387b7b15464390993860))



## [0.3.6](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.5...v0.3.6) (2021-10-05)


### Bug Fixes

* tell Vite what to pre-bundle also for `vite-plugin-ssr/client/router` ([#156](https://github.com/brillout/vite-plugin-ssr/issues/156)) ([64f7444](https://github.com/brillout/vite-plugin-ssr/commit/64f7444409c0b30a85634277dbdc7caa9726812d))



## [0.3.5](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.4...v0.3.5) (2021-10-05)


### Bug Fixes

* circumvent Vite bug that occurs when HTML has no `<head>` ([e282837](https://github.com/brillout/vite-plugin-ssr/commit/e282837d0fb82cbe0eeb80901fbe62712300b9e7))
* tell Vite what to pre-bundle (fix [#156](https://github.com/brillout/vite-plugin-ssr/issues/156)) ([59dfb4c](https://github.com/brillout/vite-plugin-ssr/commit/59dfb4c51a4c5394847944b3df2069a746c0574a))



## [0.3.4](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.3...v0.3.4) (2021-10-05)


### Bug Fixes

* make sure `renderPage()` never throws an error, gracefully handle errors instead ([ec37859](https://github.com/brillout/vite-plugin-ssr/commit/ec37859a29411b9edf4a0ecae66596035c5c92c0))



## [0.3.3](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.2...v0.3.3) (2021-09-29)


### Features

* HTML streaming support ([#138](https://github.com/brillout/vite-plugin-ssr/issues/138))



## [0.3.2](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.1...v0.3.2) (2021-09-22)


### Bug Fixes

* correctly handle base URL that contains a URL origin (fix [#149](https://github.com/brillout/vite-plugin-ssr/issues/149)) ([41fb77c](https://github.com/brillout/vite-plugin-ssr/commit/41fb77c8cdc99fa5db5c3acc93d1b4f8278616bd))
* filesystem routing: also map `src/` directories to empty string ([c629cbe](https://github.com/brillout/vite-plugin-ssr/commit/c629cbe12de7f90003e9097564d237fb53124da8))


### Features

* `pageContext.httpResponse.bodyWebStream`, `pageContext.httpResponse.bodyNodeStream`, `pageContext.httpResponse.getBody()` ([c2e1ce2](https://github.com/brillout/vite-plugin-ssr/commit/c2e1ce290b521b020b5f7ab96b099750b083f15f))



## [0.3.1](https://github.com/brillout/vite-plugin-ssr/compare/v0.3.0...v0.3.1) (2021-09-14)


### Bug Fixes

* unknown exports warning ([324480c](https://github.com/brillout/vite-plugin-ssr/commit/324480c68f7a54e3e76a67eb83f1f25b1960b956))



# [0.3.0](https://github.com/brillout/vite-plugin-ssr/compare/v0.2.13...v0.3.0) (2021-09-14)


### Bug Fixes

* dx: forbid user to inject assets twice instead of silently failing ([6d4166e](https://github.com/brillout/vite-plugin-ssr/commit/6d4166ebaee123a6c2fdaad12451c6cf7fc708a1))
* support latest `@types/node` version ([3078ac5](https://github.com/brillout/vite-plugin-ssr/commit/3078ac5021da335c1d3808b524154cd79bf1020a))
* ts: use all strict flags in order to accommodate for users with strict TS settings ([#145](https://github.com/brillout/vite-plugin-ssr/issues/145)) ([fd5bae5](https://github.com/brillout/vite-plugin-ssr/commit/fd5bae5c0c5bd63117af56e3a75e37eb674bda96))

### Features

* implement domain-drive file structure (closes [#125](https://github.com/brillout/vite-plugin-ssr/issues/125)) ([fb368ff](https://github.com/brillout/vite-plugin-ssr/commit/fb368ff2f9cffdd44e556492e01f021d34e84af5))
* allow `render()` hook to modify `pageContext` (e.g. [boilerplate-react/renderer/_default.page.server.jsx](/boilerplates/boilerplate-react/renderer/_default.page.server.jsx))
* `onBeforeRoute()` out of beta
* `onBeforePrerender()` out of beta
* `vite-plugin-ssr` can now automatically inject assets to HTML in more situations (paving the way for built-in HTML streaming support)

### BREAKING CHANGES

* `dangerouslySkipEscape` is now a standalone import.
   ```diff
     // _default.page.server.js

   - import { html } from "vite-plugin-ssr"
   + import { html, dangerouslySkipEscape } from "vite-plugin-ssr"

     export function render() {
       return html`<!DOCTYPE html>
         <html>
           <body>
   -         <div id="root">${html.dangerouslySkipEscape(pageHtml)}</div>
   +         <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
           </body>
         </html>`
     }
   ```

* `html` template tag renamed to `escapeInject`.
   ```diff
     // _default.page.server.js

   - import { html, dangerouslySkipEscape } from "vite-plugin-ssr"
   + import { escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr"

     export function render() {
   -   return html`<!DOCTYPE html>
   +   return escapeInject`<!DOCTYPE html>
         <html>
           <body>
             <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
           </body>
         </html>`
     }
   ```

* `createPageRender()` renamed `createPageRenderer()`.
  ```diff
    // server.js

  - const renderPage = createPageRender(/*...*/)
  + const renderPage = createPageRenderer(/*...*/)
  ```

* `renderPage()` changes:
  ```diff
    // server.js

    const renderPage = createPageRenderer(/*...*/)
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl
  -   const pageContext = { url }
  -   const result = await renderPage(pageContext)
  -   if (result.nothingRendered) return next()
  -   res.status(result.statusCode).send(result.renderResult)
  +   const pageContextInit = { url }
  +   const pageContext = await renderPage(pageContextInit)
  +   if (!pageContext.httpResponse) return next()
  +   res.status(pageContext.httpResponse.statusCode).send(pageContext.httpResponse.body)
    })
  ```

* Hook `addPageContext()` deprecated and replaced with `onBeforeRender()`.
  ```diff
    // *.page.server.js

  - export function addPageContext(pageContext) {
  + export function onBeforeRender(pageContext) {
      const pageProps = /*...*/
  -   return { pageProps }
  +   return {
  +     pageContext: {
  +       pageProps
  +     }
  +   }
    }
  ```

* `_onBeforeRoute()` and `_onBeforePrerender()` are out of beta: rename them to `onBeforeRoute()` and `onBeforePrerender()`.

* `_injectAssets()` is now a standalone import.
   ```diff
     // _default.page.server.js

   - import { html } from "vite-plugin-ssr"
   + import { _injectAssets } from "vite-plugin-ssr"

     export function render() {
   -   html._injectAssets(/*...*/)
   +   _injectAssets(/*...*/)
     }
   ```

## [0.2.13](https://github.com/brillout/vite-plugin-ssr/compare/v0.2.12...v0.2.13) (2021-09-03)


### Bug Fixes

* ts: fix typings for HTML Fragments ([392268a](https://github.com/brillout/vite-plugin-ssr/commit/392268aa22b5943c59d16a201d3b6e2ba5b389c3))



## [0.2.12](https://github.com/brillout/vite-plugin-ssr/compare/v0.2.11...v0.2.12) (2021-09-01)


### Bug Fixes

* do not override page's `render` hook ([0f51330](https://github.com/brillout/vite-plugin-ssr/commit/0f51330e975ea097ae733de393654ea01c369149))


### Features

* [beta feature] allow user to define `_onBeforeRoute()` hook ([#136](https://github.com/brillout/vite-plugin-ssr/issues/136), fix [#140](https://github.com/brillout/vite-plugin-ssr/issues/140)) ([91ed460](https://github.com/brillout/vite-plugin-ssr/commit/91ed46044b3d05336a97f6802f3851251c42eeb7))
* allow `_onBeforeRoute()` to modify `pageContext.url` ([bad2405](https://github.com/brillout/vite-plugin-ssr/commit/bad240514f0fdef6c5db85e5c8e60885bcdb1b2f))
* allow missing `.page.js` when `.page.client.js` and `.page.server.js` is defined ([37f6f6b](https://github.com/brillout/vite-plugin-ssr/commit/37f6f6be4d211f93f2532d910ad1ff98ab8349ca))
* [beta feature] allow user to define `_onBeforePrerender()` hook (fix [#136](https://github.com/brillout/vite-plugin-ssr/issues/136)) ([9b6a135](https://github.com/brillout/vite-plugin-ssr/commit/9b6a135ce3440e5cd7765d6ac47dba1c61ce24fb))
* dx: improve no route matching warning ([586e1c4](https://github.com/brillout/vite-plugin-ssr/commit/586e1c42669127de89bf8368b024a3af293d041e))



## [0.2.11](https://github.com/brillout/vite-plugin-ssr/compare/v0.2.10...v0.2.11) (2021-08-22)


### Bug Fixes

* allow `parallel` option to be passed via cli ([9a94bc9](https://github.com/brillout/vite-plugin-ssr/commit/9a94bc908ba785abdf25ddec3d93acfd875c94b7))



## [0.2.10](https://github.com/brillout/vite-plugin-ssr/compare/v0.2.9...v0.2.10) (2021-08-22)


### Bug Fixes

* pre-rendering: allow user to control concurrency (fix [#134](https://github.com/brillout/vite-plugin-ssr/issues/134), fix ([c7f9454](https://github.com/brillout/vite-plugin-ssr/commit/c7f9454d0c50211dd578c72ac1d52234f9925ad5))
* ts: fix conflicting ViteDevServer type definitions ([8d3aef3](https://github.com/brillout/vite-plugin-ssr/commit/8d3aef390343aafc09fa6bd1f7b432b940cdcc05))
* ts: make `getPage()` generic, e.g. `getPage<SomeCustomPageContext>()` ([f56104d](https://github.com/brillout/vite-plugin-ssr/commit/f56104dba0f51c3bb276cf96a0be451e0115c8f4))



## [0.2.9](https://github.com/brillout/vite-plugin-ssr/compare/v0.2.8...v0.2.9) (2021-08-15)


### Bug Fixes

* allow pageContext to be Vue reactive ([65ac828](https://github.com/brillout/vite-plugin-ssr/commit/65ac8288597068ed846723a3a1f7ca4328023971))
* dx: improve pageContext not available in browser wrong usage message ([0563c20](https://github.com/brillout/vite-plugin-ssr/commit/0563c20ce26606faad31d8a9d25ff9b3b242eb54))
* help TS resolve plugin until TS supports `package.json#exports` ([414ce14](https://github.com/brillout/vite-plugin-ssr/commit/414ce14d667e02b559350d28bca19929bec39575))
* skip symbols and `toJSON` in pageContext proxy ([361bca2](https://github.com/brillout/vite-plugin-ssr/commit/361bca28f7c65e47e7d74d1b0cc81eaf07a73ed6))
* ts: return plugin as `any` to avoid Plugin type mismatches when there are multiple Vite versions installed ([34e9b6a](https://github.com/brillout/vite-plugin-ssr/commit/34e9b6ac4c4799e0ca6c18117ecd97a6b9f4adae))



## [0.2.8](https://github.com/brillout/vite-plugin-ssr/compare/v0.2.7...v0.2.8) (2021-08-12)

### DX

* dx: improve error message when user forgot to run `$ vite build` for production.



## [0.2.7](https://github.com/brillout/vite-plugin-ssr/compare/v0.2.6...v0.2.7) (2021-08-10)


### Bug Fixes

* make server-side test work again for CF (fix [#130](https://github.com/brillout/vite-plugin-ssr/issues/130)) ([fe01932](https://github.com/brillout/vite-plugin-ssr/commit/fe019325ab1475bb55446a827c0a3f0bdaa60aec))
* properly remove built-in props from error message ([6e23c10](https://github.com/brillout/vite-plugin-ssr/commit/6e23c10ae4d25d3b2783ea168fa2a97e9b344780))
* resolve --root arg ([6a51f2a](https://github.com/brillout/vite-plugin-ssr/commit/6a51f2a10e46fb2cce13b1994e9aef6a3bec16b6))



## [0.2.6](https://github.com/brillout/vite-plugin-ssr/compare/v0.2.5...v0.2.6) (2021-08-09)


### Bug Fixes

* use `utils/assert` instead of `assert` of `console` module ([#129](https://github.com/brillout/vite-plugin-ssr/issues/129)) ([8b4e39c](https://github.com/brillout/vite-plugin-ssr/commit/8b4e39cfe61c650b977646323b8123063215a3d5))



## [0.2.5](https://github.com/brillout/vite-plugin-ssr/compare/v0.2.4...v0.2.5) (2021-08-06)


### DX

* dx: improve error message when `pageContext` is not serializable [#127](https://github.com/brillout/vite-plugin-ssr/issues/127) (fix [#128](https://github.com/brillout/vite-plugin-ssr/issues/128))



## [0.2.4](https://github.com/brillout/vite-plugin-ssr/compare/v0.2.3...v0.2.4) (2021-08-03)


### Bug Fixes

* don't overwrite but supplement rollupOptions.input ([f3268a8](https://github.com/brillout/vite-plugin-ssr/commit/f3268a8221c1a784f94b394a0c269590cf73b711))


### Features

* impl `.page.server.js#doNotPrerender` to enable pre-rendering skipping ([bfb2dd1](https://github.com/brillout/vite-plugin-ssr/commit/bfb2dd165a3d866aa880f97ca5168f0c37f521ba))



## [0.2.3](https://github.com/brillout/vite-plugin-ssr/compare/v0.2.2...v0.2.3) (2021-07-21)


### Bug Fixes

* don't return null upon several matching _default page files (fix [#120](https://github.com/brillout/vite-plugin-ssr/issues/120)) ([801b92f](https://github.com/brillout/vite-plugin-ssr/commit/801b92f3fbc291dabc2f3f929e57a7e7c8b45f14))



## [0.2.2](https://github.com/brillout/vite-plugin-ssr/compare/v0.2.1...v0.2.2) (2021-07-20)


### Bug Fixes

* add support for server written in ESM (fix [#118](https://github.com/brillout/vite-plugin-ssr/issues/118)) ([56e3885](https://github.com/brillout/vite-plugin-ssr/commit/56e388500946d9de8e9887c001b972e476fc92bc))



## [0.2.1](https://github.com/brillout/vite-plugin-ssr/compare/v0.2.0...v0.2.1) (2021-07-19)


### Bug Fixes

* add support for ssr-window [#116](https://github.com/brillout/vite-plugin-ssr/issues/116) ([46c2323](https://github.com/brillout/vite-plugin-ssr/commit/46c23233d90ff6655af97eab24a4f906a1c4a3bb))



# [0.2.0](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.5...v0.2.0) (2021-07-16)


* improve `dist/server/importBuild.js` ergonomics ([cad8683](https://github.com/brillout/vite-plugin-ssr/commit/cad868369754aeb7093c71c97b57f4a769e43c22))


### BREAKING CHANGES

* `dist/server/importer.js` has been renamed to
`dist/server/importBuild.js`.



## [0.1.5](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.4...v0.1.5) (2021-07-11)


### Bug Fixes

* error when route string is missing a leading slash instead of silently failing ([21052c6](https://github.com/brillout/vite-plugin-ssr/commit/21052c632c20cf0fe9cba80b03a2b4fb1015df74))
* properly handle URL suffix `.pageContext.json` for URL `/` ([84b3e76](https://github.com/brillout/vite-plugin-ssr/commit/84b3e76478e6a8716baa77bf8b06ab8e3d7bc46c))



## [0.1.4](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.3...v0.1.4) (2021-07-07)


### Features

* add option `$ vite-plugin-ssr prerender --noExtraDir` ([c88e030](https://github.com/brillout/vite-plugin-ssr/commit/c88e030aaee42a3d269247257657c3b4a0a935c9))
* provide TypeScript types for `pageContext` (fix [#110](https://github.com/brillout/vite-plugin-ssr/issues/110)) ([ceb6ebd](https://github.com/brillout/vite-plugin-ssr/commit/ceb6ebdc5caaf84fe87f958f1094906164dde8c4))



## [0.1.3](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.2...v0.1.3) (2021-07-07)


### Bug Fixes

* don't lower case when matching URLs ([333583f](https://github.com/brillout/vite-plugin-ssr/commit/333583f297ee73b7b464635e456e9281925c8241))
* improve strategy to hunt down Vite cache bug ([#108](https://github.com/brillout/vite-plugin-ssr/issues/108)) ([085207a](https://github.com/brillout/vite-plugin-ssr/commit/085207a293ab651c81efa64534da850427dc9fcf))



## [0.1.2](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.1...v0.1.2) (2021-06-17)


### Features

* also expose `pageContext.pageExports` on the client-side ([83801ff](https://github.com/brillout/vite-plugin-ssr/commit/83801ff17182cd5a7aa5063cc48e3472efeaf217))
* support async route functions (fix [#97](https://github.com/brillout/vite-plugin-ssr/issues/97)) ([0aca411](https://github.com/brillout/vite-plugin-ssr/commit/0aca411e01373c9717678b123d5d0f4390ba060a))



## [0.1.1](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0...v0.1.1) (2021-06-09)


### Features

* enable Jest/Babel component unit testing (fix [#91](https://github.com/brillout/vite-plugin-ssr/issues/91)) ([cb3417d](https://github.com/brillout/vite-plugin-ssr/commit/cb3417de974de6697ab29a8a55347fd91f72feac))



# [0.1.0](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.50...v0.1.0) (2021-06-06)

Nothing changed (`0.1.0` is equivalent to `0.1.0-beta.50`); `vite-plugin-ssr` is now out of beta :-).


# [0.1.0-beta.50](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.49...v0.1.0-beta.50) (2021-06-02)


### Bug Fixes

* define ESM build in tsconfig.ts instead of CLI (vitejs/vite[#3617](https://github.com/brillout/vite-plugin-ssr/issues/3617), fix [#85](https://github.com/brillout/vite-plugin-ssr/issues/85)) ([4fdbf91](https://github.com/brillout/vite-plugin-ssr/commit/4fdbf91e9c59f91ca8111dd88b6df7a3c664d0c2))



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

- Replace all occurrences in your source code of `addContextProps` to
  `addPageContext`, and all occurrences of `contextProps` to `pageContext`.
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

* on static hosts, fallback to Server Routing for 404 pages ([#57](https://github.com/brillout/vite-plugin-ssr/issues/57)) ([56e0d0a](https://github.com/brillout/vite-plugin-ssr/commit/56e0d0a47f2ad14708073c0c467d0db1b5d19177))


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
