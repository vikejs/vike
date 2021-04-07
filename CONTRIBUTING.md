# Contribute to `vite-plugin-ssr`

- [Requirements](#requirements)
- [Ceate new example](#create-new-example)
- [Modify existing example](#modify-existing-example)
- [Modify `vite-plugin-ssr`](#modify-vite-plugin-ssr)
- [Run test suite](#run-test-suite)


## Requirements

These requirements are for *developing* the source code; you can use `vite-plugin-ssr` with Windows and Node.js `>= v12.19.0`.

- Node.js `>= v15.0.0`.
- Unix (e.g. macOS and Linux). (Windows may work but there are no guarantees.)

## Create new example

New examples should be minimal and implement only what the example wants to showcase.
Use the [boilerplates](/#boilerplates) to create a new minimal example.
(Do not start off `/examples/react/` nor `/examples/vue/` as these are full-featured demos.)

## Modify existing example

To run an example:

```shell
git clone git@github.com:brillout/vite-plugin-ssr
cd vite-plugin-ssr/examples/some-example/
npm install
npm run start
```

`npm run start` starts the example in dev mode: it will auto-reload most modifications.

Check whether `.test.spec.ts` is still valid and make changes accordingly.

## Modify `vite-plugin-ssr`

Install everything:

```shell
git clone git@github.com:brillout/vite-plugin-ssr
cd vite-plugin-ssr/
npm run dev:setup
npm run dev
```

You can now change the source code of `vite-plugin-ssr` (at `/src/`) and try your modifications with one of the `/examples/*` or `/boilerplates/boilerplate-*`.
To start the example, follow the `README.md` instructions of the example.
You may need to restart the example's Node.js server for your `vite-plugin-ssr` modifications to apply.

Once you're done and before opening a pull request, run the test suite to ensure that your modifications don't break anything.


## Run test suite

```shell
git clone git@github.com:brillout/vite-plugin-ssr
cd vite-plugin-ssr/
npm run test:setup
```

To run a single test:

```shell
npm test -- --root-dir examples/some-example/
```

To run all tests:

```
npm test
```

Sometimes the test suite returns the following which is a false positive you can safely ignore.

```shell

  ● Test suite failed to run

    Expected an Error, but "" was thrown
```

Which means that the following test run is actually successful.

```shell
$ npm test

> test
> jest --config=tests/jest.config.ts

 PASS   browser: chromium  examples/react/.test-prod.spec.ts (49.728 s)
 PASS   browser: chromium  boilerplates/boilerplate-react-ts/.test-prod.spec.ts (25.019 s)
 FAIL   browser: chromium  boilerplates/boilerplate-react-ts/.test-dev.spec.ts (9.047 s)


  ● Test suite failed to run

    Expected an Error, but "" was thrown

 PASS   browser: chromium  examples/vue/.test-prod.spec.ts (25.704 s)
 PASS   browser: chromium  boilerplates/boilerplate-react/.test-prod.spec.ts (21.434 s)
 PASS   browser: chromium  boilerplates/boilerplate-vue-ts/.test-prod.spec.ts (18.775 s)
 PASS   browser: chromium  examples/react/.test-dev.spec.ts (16.158 s)
 PASS   browser: chromium  boilerplates/boilerplate-vue/.test-prod.spec.ts (15.046 s)
 PASS   browser: chromium  examples/vue/.test-dev.spec.ts (14.499 s)
 PASS   browser: chromium  boilerplates/boilerplate-react/.test-dev.spec.ts (9.078 s)
 FAIL   browser: chromium  boilerplates/boilerplate-vue-ts/.test-dev.spec.ts (11.75 s)


  ● Test suite failed to run

    Expected an Error, but "" was thrown

 PASS   browser: chromium  boilerplates/boilerplate-vue/.test-dev.spec.ts (9.453 s)
 PASS   browser: chromium  examples/redux/.test.spec.ts (8.438 s)
 PASS   browser: chromium  examples/vuex/.test.spec.ts (5.189 s)

Test Suites: 2 failed, 12 passed, 14 total
Tests:       63 passed, 63 total
Snapshots:   0 total
Time:        243.838 s
```
