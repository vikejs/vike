## [0.7.2](https://github.com/vikejs/vike-solid/compare/v0.7.1...v0.7.2) (2024-08-17)


### Bug Fixes

* enable useConfig() after hydration ([#179](https://github.com/vikejs/vike-solid/issues/179)) ([0d28905](https://github.com/vikejs/vike-solid/commit/0d28905))



## [0.7.1](https://github.com/vikejs/vike-solid/compare/v0.7.0...v0.7.1) (2024-08-12)


### Bug Fixes

* don't unnecessarily pass useConfig() values to client-side ([613bce3](https://github.com/vikejs/vike-solid/commit/613bce3))


### Features

* new [components `<Head>` and `<Config>`](https://vike.dev/useConfig#config-head) ([#104](https://github.com/vikejs/vike-solid/issues/104)) ([ed1c070](https://github.com/vikejs/vike-solid/commit/ed1c070))



# [0.7.0](https://github.com/vikejs/vike-solid/compare/v0.6.2...v0.7.0) (2024-08-06)


### Bug Fixes

* avoid the default of title/lang setting to override Head setting ([1f91f16](https://github.com/vikejs/vike-solid/commit/1f91f16))
* export Vike config only at /config ([d66c678](https://github.com/vikejs/vike-solid/commit/d66c678))


### Features

* [useConfig()](https://vike.dev/useConfig) ([88496ed](https://github.com/vikejs/vike-solid/commit/88496ed))
* new hook [`onAfterRenderClient`](https://vike.dev/onAfterRenderClient) ([149f555](https://github.com/vikejs/vike-solid/commit/149f555))


### BREAKING CHANGES

* component `<ClientOnly>` removed: use `clientOnly()` helper instead https://vike.dev/clientOnly
* Update to `vike@0.4.191` or above.



## [0.6.2](https://github.com/vikejs/vike-solid/compare/v0.6.1...v0.6.2) (2024-06-25)


### Features

* Add streaming support for Web Stream ([69ac3cd](https://github.com/vikejs/vike-solid/commit/69ac3cd))



## [0.6.1](https://github.com/vikejs/vike-solid/compare/v0.6.0...v0.6.1) (2024-06-22)


**For previous versions, see [MIGRATION.md](https://github.com/vikejs/vike-solid/blob/main/MIGRATION.md).**
