# [0.1.0-beta.10](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.8...v0.1.0-beta.10) (2021-03-05)


### Bug Fixes

* convert windows path to posix for micromatch ([cc9c405](https://github.com/brillout/vite-plugin-ssr/commit/cc9c405)), closes [#4](https://github.com/brillout/vite-plugin-ssr/issues/4)
* don't try to inject dynamic import polyfill ([fdffd37](https://github.com/brillout/vite-plugin-ssr/commit/fdffd37))
* **boilerplates:** remove duplicated file ([4421aa6](https://github.com/brillout/vite-plugin-ssr/commit/4421aa6))


### Features

* allow render hook to return an object instead of HTML ([a649eaf](https://github.com/brillout/vite-plugin-ssr/commit/a649eaf))
* support _500.page.js and improve error handling ([d492b9c](https://github.com/brillout/vite-plugin-ssr/commit/d492b9c))
* support `html` tag composition ([9a57006](https://github.com/brillout/vite-plugin-ssr/commit/9a57006))



# [0.1.0-beta.9](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.8...v0.1.0-beta.9) (2021-03-01)

### Bug Fixes

* Fix released build



# [0.1.0-beta.8](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.7...v0.1.0-beta.8) (2021-03-01)


### Bug Fixes

* re-export default ([cd43e6e](https://github.com/brillout/vite-plugin-ssr/commit/cd43e6e))
* use `in` operator only on objects ([819dfe1](https://github.com/brillout/vite-plugin-ssr/commit/819dfe1))


### Features

* remove html.sanitize and make sanitized automatic ([95d145c](https://github.com/brillout/vite-plugin-ssr/commit/95d145c))


### BREAKING CHANGES

* Removed `html.sanitize()`; simply directly insert the
string and vite-plugin-ssr will automatically sanitize it



# [0.1.0-beta.7](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.6...v0.1.0-beta.7) (2021-02-28)


### Features

* Pass `Page` to addContextProps. ([2512ee3](https://github.com/brillout/vite-plugin-ssr/commit/2512ee3))



# [0.1.0-beta.6](https://github.com/brillout/vite-plugin-ssr/tree/963afbafa5697d7745b6803bf1475b4aad7559c2) (2021-02-22)

Initial public release
