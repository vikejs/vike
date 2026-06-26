## [0.4.260](https://github.com/vikejs/vike/compare/v0.4.259...v0.4.260) (2026-06-26)


### Bug Fixes

* --port/--host/--force now override vite.config.js ([05ff485](https://github.com/vikejs/vike/commit/05ff4858704e89250cc57ada3d5f29ce2f63ac09))
* add `startupLog` option to preview API ([75f6125](https://github.com/vikejs/vike/commit/75f6125900af73543cab3b05038e731bec7ace53))
* add global +configs to optimizeDeps scan ([#3306](https://github.com/vikejs/vike/issues/3306)) ([eec4029](https://github.com/vikejs/vike/commit/eec4029f2e3557ca2d1a6ffac4009dc244152875))
* add vike:vite-config debug flag ([9fc8a01](https://github.com/vikejs/vike/commit/9fc8a01f213740d42059dee67ee9aaf3691fa853))
* allow custom global configs to be set via CLI / env var ([#3302](https://github.com/vikejs/vike/issues/3302)) ([5ab9602](https://github.com/vikejs/vike/commit/5ab9602136c314e4c9154cdbfab47ea2672256cc))
* allow page-level configs via CLI/API/env ([#3304](https://github.com/vikejs/vike/issues/3304)) ([613f174](https://github.com/vikejs/vike/commit/613f174e68721fbb3b4f6cd80828e4e337005687))
* allow user to override Vite asset configs set by Vike ([#3326](https://github.com/vikejs/vike/issues/3326)) ([7646d97](https://github.com/vikejs/vike/commit/7646d9711c46405b44f37a7c9b409274e9ed565e))
* catch abort error thrown by +onCreatePageContext (fix [#3256](https://github.com/vikejs/vike/issues/3256)) ([2fe6cc7](https://github.com/vikejs/vike/commit/2fe6cc70404038e98282efdb5dfadc4e7768ea4a))
* don't crash request logger on redirect from +middleware (fix [#3357](https://github.com/vikejs/vike/issues/3357)) ([#3358](https://github.com/vikejs/vike/issues/3358)) ([aa6fa94](https://github.com/vikejs/vike/commit/aa6fa9432ce49531865d2d4ecc6ee83c57805973))
* don't force the esbuild CSS minifier on Vite 8+ (fix [#3326](https://github.com/vikejs/vike/issues/3326)) ([#3332](https://github.com/vikejs/vike/issues/3332)) ([4273d7f](https://github.com/vikejs/vike/commit/4273d7fb7ed8af73811ceaa851920151d2d3c6de))
* don't overly strip `vike:pointer` import attribute (fix brillout/docpress[#167](https://github.com/vikejs/vike/issues/167)) ([#3366](https://github.com/vikejs/vike/issues/3366)) ([286b6d4](https://github.com/vikejs/vike/commit/286b6d4aa30a996894d30e30777430e10ee256dd))
* don't swallow globalContext promise rejection ([#3252](https://github.com/vikejs/vike/issues/3252)) ([146b243](https://github.com/vikejs/vike/commit/146b243e4d38177b11c2025a14ff56cfebd9f61b))
* further nudge AI to read the docs ([0024d49](https://github.com/vikejs/vike/commit/0024d49135d6354abe7b3258d86d6884a2b9ab11))
* improve error message upon rare Vite module resolve race condition ([d575835](https://github.com/vikejs/vike/commit/d57583578e4f8eb31b7689ac1a2581392dc975a9))
* increase Vite RPC timeout ([927739b](https://github.com/vikejs/vike/commit/927739b447063a4620eb8931e4e48de6902342ee))
* log error-page render errors (fix [#3286](https://github.com/vikejs/vike/issues/3286)) ([cce07dd](https://github.com/vikejs/vike/commit/cce07ddbabc10b53f12b7fd7bb32a2ec416bc30d))
* make unkown config a warning instead of an error ([#3303](https://github.com/vikejs/vike/issues/3303)) ([53da9e4](https://github.com/vikejs/vike/commit/53da9e433f5d47989735be1faf27eee06b252f41))
* make Vike extension installation idempotent (fix [#3354](https://github.com/vikejs/vike/issues/3354)) ([#3355](https://github.com/vikejs/vike/issues/3355)) ([a91659b](https://github.com/vikejs/vike/commit/a91659ba33b85f2ab0bfa40cebb8050bc9d83510))
* nudge AI agents to load vike.dev/llms.txt ([#3298](https://github.com/vikejs/vike/issues/3298)) ([1f48061](https://github.com/vikejs/vike/commit/1f48061995cc1695f2dc29b19b23e1d2ead74b5d))
* nudge AIs to load https://vike.dev/llms.txt more prominently ([20ec687](https://github.com/vikejs/vike/commit/20ec6871e86c5a1049247c9c876f80804589ff01))
* polish Vike CLI help message ([8017bd1](https://github.com/vikejs/vike/commit/8017bd15396f276141e36f86b365c15e36b60278))
* prepend base to prerender redirect target URLs ([#3350](https://github.com/vikejs/vike/issues/3350)) ([ac2142e](https://github.com/vikejs/vike/commit/ac2142e13b32d4bff21bcd160ffd270a484d957d))
* remove outdated vike-photon workarounds ([b164b12](https://github.com/vikejs/vike/commit/b164b124cf6834e89b3b8cddef829e5e07a585f5))
* remove outdated Vite printUrls workaround ([7f57fbb](https://github.com/vikejs/vike/commit/7f57fbb80f3265f59fd7b9fa41387e387ff913ed))
* remove requestId ALS assertion (fix [#3289](https://github.com/vikejs/vike/issues/3289)) ([fffb051](https://github.com/vikejs/vike/commit/fffb0511fd73f6320d4b4829ce537a1316be3d54))
* respect Vite CLI [root]/-c args in early config resolution ([#3278](https://github.com/vikejs/vike/issues/3278)) ([ae71c2c](https://github.com/vikejs/vike/commit/ae71c2c9a746b04207f18633c2e8a0b5dda88686))
* route bare-specifier client entries to optimizeDeps.include (fix [#3290](https://github.com/vikejs/vike/issues/3290)) ([b520132](https://github.com/vikejs/vike/commit/b5201321a724b878c249e0767ea93ed2a0498316))
* set `pageContext.req` and `pageContext.res` as alias to `pageContext.runtime.{req,res}` (if `undefined`) ([#3338](https://github.com/vikejs/vike/issues/3338)) ([50a8955](https://github.com/vikejs/vike/commit/50a89550f4de54daa309b33695a24a7211ed40ed))
* support CLI syntax `--key=value` ([e44c5a1](https://github.com/vikejs/vike/commit/e44c5a137249945150fc64f264b0fbb3103f5ac2))
* update @brillout/json-serializer ([#3319](https://github.com/vikejs/vike/issues/3319)) ([40cdc35](https://github.com/vikejs/vike/commit/40cdc35acedcff5d00838df61e90677baf61aa58))
* wait for all Vite envs before force exit ([#3294](https://github.com/vikejs/vike/issues/3294)) ([c9d00d4](https://github.com/vikejs/vike/commit/c9d00d4cbb7858271c85787373de719d04e92274))


### Features

* `+pages` for programmatically defining pages (closes [#1691](https://github.com/vikejs/vike/issues/1691)) ([#3356](https://github.com/vikejs/vike/issues/3356)) ([f6ecfb2](https://github.com/vikejs/vike/commit/f6ecfb2451503f8c8af004a23d924a5eff98f6d5))
* add +root setting as alias for Vite's root ([#3311](https://github.com/vikejs/vike/issues/3311)) ([dcc116b](https://github.com/vikejs/vike/commit/dcc116b6d7cc12cce25507b4a0fa8de2f76c6cf7))
