import { testRunClassic } from '../../test/utils'
testRunClassic('npm run preview', {
  tolerateError(args) {
    /*
    ```console
    [21:07:06.605][/][npm run preview][stderr] 9:07:06 PM [vike][Warning] The CSS browser target should be the same for both client and server, but we got:
Client: ["chrome107","edge107","firefox104","safari16"]
Server: "es2022"
Different targets lead to CSS duplication, see https://github.com/vikejs/vike/issues/1815#issuecomment-2507002979 for more information.
    at file:///home/rom/code/vike/packages/vike/dist/esm/node/vite/plugins/pluginBuild/handleAssetsManifest.js:233:13
    at Array.forEach (<anonymous>)
    at file:///home/rom/code/vike/packages/vike/dist/esm/node/vite/plugins/pluginBuild/handleAssetsManifest.js:231:23
    at Array.forEach (<anonymous>)
    at handleAssetsManifest_assertUsageCssTarget (file:///home/rom/code/vike/packages/vike/dist/esm/node/vite/plugins/pluginBuild/handleAssetsManifest.js:229:19)
    at Object.handler (file:///home/rom/code/vike/packages/vike/dist/esm/node/vite/plugins/pluginBuild/pluginAutoFullBuild.js:58:21)
    at Object.handler (file:///home/rom/code/vike/node_modules/.pnpm/vite@7.0.6_@types+node@22.15.30_terser@5.38.1_tsx@4.19.4/node_modules/vite/dist/node/chunks/dep-BHkUv4Z8.js:34323:13)
    at file:///home/rom/code/vike/node_modules/.pnpm/rollup@4.43.0/node_modules/rollup/dist/es/shared/node-entry.js:22269:40
```
  */
    if (args.logText.includes('The CSS browser target should be the same for both client and server')) return true
  },
})
