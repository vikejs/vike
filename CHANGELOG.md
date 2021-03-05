# [0.1.0-beta.10](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.8...v0.1.0-beta.10) (2021-03-05)


### Bug Fixes

* convert windows path to posix for micromatch ([cc9c405](https://github.com/brillout/vite-plugin-ssr/commit/cc9c405924d38e3615ea042b951c8e58e342f161)), closes [#4](https://github.com/brillout/vite-plugin-ssr/issues/4)
* don't try to inject dynamic import polyfill ([fdffd37](https://github.com/brillout/vite-plugin-ssr/commit/fdffd37c0bff0f3b16d28268ec0ba4bcc193b5cc))
* **create-vite-plugin-ssr:** remove duplicated file ([4421aa6](https://github.com/brillout/vite-plugin-ssr/commit/4421aa6fb3b8b2a0f82d0d1eec80d0cc59cc54d3))


### Features

* allow render hook to return an object instead of HTML ([a649eaf](https://github.com/brillout/vite-plugin-ssr/commit/a649eafbc8bf4e746d792b8f3c55ab8161330deb))
* support _500.page.js and improve error handling ([d492b9c](https://github.com/brillout/vite-plugin-ssr/commit/d492b9caba88a07bf28c00f9e14291f69cb5d694))
* support `html` tag composition ([9a57006](https://github.com/brillout/vite-plugin-ssr/commit/9a57006b53dae411ca1981642f2569c5e3cf3cae))



# [0.1.0-beta.9](https://github.com/brillout/vite-plugin-ssr/compare/v0.1.0-beta.8...v0.1.0-beta.9) (2021-03-01)



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
