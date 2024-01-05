import { isReactInvalidComponentError, isCjsEsmError } from '../logHintForCjsEsmError'
import { expect, describe, it } from 'vitest'
import { errror_cannot_use_import_outside_of_module } from './errors'

describe('isCjsEsmError()', () => {
  ERR_MODULE_NOT_FOUND()
  ERR_UNKNOWN_FILE_EXTENSION()
  ERR_UNSUPPORTED_DIR_IMPORT()
  cannot_read_property_of_undefined()
  ERR_REQUIRE_ESM()
  cjs_named_export()
  cannot_use_import_outside_of_module()
  is_not_defined()
  is_not_exported()
  unexpected_token_export()
})

describe('isReactInvalidComponentError()', () => {
  react_invalid_component()
})

// Classic: file extension missing in import path.
function ERR_MODULE_NOT_FOUND() {
  it('ERR_MODULE_NOT_FOUND / ERR_LOAD_URL', () => {
    t2(
      '@aws-amplify/ui-react',
      // https://github.com/aws-amplify/amplify-ui/issues/3155#issue-1488517976
      `
Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'node_modules/lodash/debounce' imported from node_modules/@aws-amplify/ui-react/dist/esm/primitives/Collection/Collection.js
Did you mean to import lodash@4.17.21/node_modules/lodash/debounce.js?
    at new NodeError (node:internal/errors:372:5)
  code: 'ERR_MODULE_NOT_FOUND'
}
`
    )

    t2(
      '@mdxeditor/editor',
      // https://github.com/vikejs/vike/discussions/1084#discussion-5536319
      `
Error: Cannot find package '/test/node_modules/@mdxeditor/editor/dist/node_modules/react-diff-view/' imported from /test/node_modules/@mdxeditor/editor/dist/plugins/diff-source/DiffViewer.js
    at legacyMainResolve (/test/node_modules/ts-node/dist-raw/node-internal-modules-esm-resolve.js:286:9)
    at packageResolve (/test/node_modules/ts-node/dist-raw/node-internal-modules-esm-resolve.js:750:14)
    at moduleResolve (/test/node_modules/ts-node/dist-raw/node-internal-modules-esm-resolve.js:798:18)
    at Object.defaultResolve (/test/node_modules/ts-node/dist-raw/node-internal-modules-esm-resolve.js:912:11)
    at /test/node_modules/ts-node/src/esm.ts:218:35
    at entrypointFallback (/test/node_modules/ts-node/src/esm.ts:168:34)
    at /test/node_modules/ts-node/src/esm.ts:217:14
    at addShortCircuitFlag (/test/node_modules/ts-node/src/esm.ts:409:21)
    at resolve (/test/node_modules/ts-node/src/esm.ts:197:12)
    at resolve (/test/node_modules/ts-node/src/child/child-loader.ts:15:39)
    at nextResolve (node:internal/modules/esm/loader:163:28)
    at ESMLoader.resolve (node:internal/modules/esm/loader:838:30)
    at ESMLoader.getModuleJob (node:internal/modules/esm/loader:424:18)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:77:40)
    at link (node:internal/modules/esm/module_job:76:36)
`
    )

    t1(
      'vike-react',
      /* node_modules/ land, wrong import path: missing file extension.
       * - Error artificially created:
       *   ```diff
       *   // node_modules/vike-react/dist/renderer/onRenderHtml.js:
       *   - import { getPageElement } from './getPageElement.js';
       *   + import { getPageElement } from './getPageElement';
       *   ```
       */
      {
        message:
          "Cannot find module '/home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/getPageElement' imported from /home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/onRenderHtml.js",
        code: 'ERR_MODULE_NOT_FOUND',
        stack: `
Error: Cannot find module '/home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/getPageElement' imported from /home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/onRenderHtml.js
    at new NodeError (node:internal/errors:399:5)
    at finalizeResolution (node:internal/modules/esm/resolve:326:11)
    at moduleResolve (node:internal/modules/esm/resolve:945:10)
    at defaultResolve (node:internal/modules/esm/resolve:1153:11)
    at nextResolve (node:internal/modules/esm/loader:163:28)
    at ESMLoader.resolve (node:internal/modules/esm/loader:838:30)
    at ESMLoader.getModuleJob (node:internal/modules/esm/loader:424:18)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:77:40)
    at link (node:internal/modules/esm/module_job:76:36)
`
      }
    )

    t1(
      false,
      // - User land, transpiled by Vite
      // - Wrong import path (it should be `components/does-not-exist/Counter` instead of `components/does-not-exist/Counter`)
      {
        message:
          'Failed to load url ../../components/does-not-exist/Counter (resolved id: ../../components/does-not-exist/Counter) in /home/romu/code/vike/examples/react-full/pages/index/+Page.tsx. Does the file exist?',
        code: 'ERR_LOAD_URL',
        stack: `
Error: Failed to load url ../../components/does-not-exist/Counter (resolved id: ../../components/does-not-exist/Counter) in /home/romu/code/vike/examples/react-full/pages/index/+Page.tsx. Does the file exist?
    at loadAndTransform (file:///home/romu/code/vike/node_modules/.pnpm/vite@5.0.10_@types+node@20.10.5/node_modules/vite/dist/node/chunks/dep-R0I0XnyH.js:49376:21)
    at instantiateModule (file:///home/romu/code/vike/node_modules/.pnpm/vite@5.0.10_@types+node@20.10.5/node_modules/vite/dist/node/chunks/dep-R0I0XnyH.js:50404:10)
`
      }
    )

    t1(
      false,
      // User land, executed directly by Node.js
      {
        message:
          "Cannot find package 'some-not-installed-package' imported from /home/romu/code/vike/boilerplates/boilerplate-react/server/index.js",
        code: 'ERR_MODULE_NOT_FOUND',
        stack: `
Cannot find package 'some-not-installed-package' imported from /home/romu/code/vike/boilerplates/boilerplate-react/server/index.js
    at new NodeError (node:internal/errors:399:5)
    at packageResolve (node:internal/modules/esm/resolve:889:9)
    at moduleResolve (node:internal/modules/esm/resolve:938:20)
    at defaultResolve (node:internal/modules/esm/resolve:1153:11)
    at nextResolve (node:internal/modules/esm/loader:163:28)
    at ESMLoader.resolve (node:internal/modules/esm/loader:838:30)
    at ESMLoader.getModuleJob (node:internal/modules/esm/loader:424:18)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:77:40)
    at link (node:internal/modules/esm/module_job:76:36)
`
      }
    )
    t1(
      false,
      // User land, transpiled by Vite
      {
        message:
          "Cannot find module 'some-not-installed-package' imported from '/home/romu/code/vike/examples/react-full/pages/index/+Page.tsx'",
        code: 'ERR_MODULE_NOT_FOUND',
        stack: `
Error: Cannot find module 'some-not-installed-package' imported from '/home/romu/code/vike/examples/react-full/pages/index/+Page.tsx'
    at nodeImport (file:///home/romu/code/vike/node_modules/.pnpm/vite@4.5.1_@types+node@20.10.4/node_modules/vite/dist/node/chunks/dep-68d1a114.js:56088:25)
    at ssrImport (file:///home/romu/code/vike/node_modules/.pnpm/vite@4.5.1_@types+node@20.10.4/node_modules/vite/dist/node/chunks/dep-68d1a114.js:55990:30)
    at eval (/home/romu/code/vike/examples/react-full/pages/index/+Page.tsx:7:37)
    at instantiateModule (file:///home/romu/code/vike/node_modules/.pnpm/vite@4.5.1_@types+node@20.10.4/node_modules/vite/dist/node/chunks/dep-68d1a114.js:56052:9)
`
      }
    )
    t1(false, {
      // I guess it's an error generated by Vite, which seems redundant with the ERR_MODULE_NOT_FOUND error above. Let's ignore it since we already handle ERR_MODULE_NOT_FOUND errors.
      message:
        'Failed to load url some-not-installed-package (resolved id: some-not-installed-package) in /home/romu/code/vike/examples/react-full/pages/index/+Page.tsx. Does the file exist?',
      // See comment down below about ERR_LOAD_URL errors
      code: 'ERR_LOAD_URL',
      stack: `
Error: Failed to load url some-not-installed-package (resolved id: some-not-installed-package) in /home/romu/code/vike/examples/react-full/pages/index/+Page.tsx. Does the file exist?
    at loadAndTransform (file:///home/romu/code/vike/node_modules/.pnpm/vite@4.5.1_@types+node@20.10.4/node_modules/vite/dist/node/chunks/dep-68d1a114.js:55015:21)
`
    })
  })
}

// Classic: server-side code importing CSS.
function ERR_UNKNOWN_FILE_EXTENSION() {
  it('ERR_UNKNOWN_FILE_EXTENSION', () => {
    t1(
      'vike-react',
      /* node_modules/ land
       * - Error artificially created:
       *   ```diff
       *   // node_modules/vike-react/dist/renderer/onRenderHtml.js:
       *   + import './foo.css'
       *   // node_modules/vike-react/dist/renderer/foo.css
       *   + body {
       *   +   background-color: blue;
       *   + }
       *   ```
       */
      {
        message:
          'Unknown file extension ".css" for /home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/foo.css',
        code: 'ERR_UNKNOWN_FILE_EXTENSION',
        stack: `
TypeError: Unknown file extension ".css" for /home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/foo.css
    at new NodeError (node:internal/errors:399:5)
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:79:11)
    at defaultGetFormat (node:internal/modules/esm/get_format:121:38)
    at defaultLoad (node:internal/modules/esm/load:81:20)
    at nextLoad (node:internal/modules/esm/loader:163:28)
    at ESMLoader.load (node:internal/modules/esm/loader:605:26)
    at ESMLoader.moduleProvider (node:internal/modules/esm/loader:457:22)
    at new ModuleJob (node:internal/modules/esm/module_job:64:26)
    at ESMLoader.#createModuleJob (node:internal/modules/esm/loader:480:17)
    at ESMLoader.getModuleJob (node:internal/modules/esm/loader:434:34)
`
      }
    )

    t2(
      'vuetify',
      // https://github.com/vikejs/vike/discussions/682#discussion-4927859
      `
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".css" for /Users/xxx/Projects/xxx/xxx/node_modules/vuetify/lib/components/VGrid/VGrid.css
    at new NodeError (node:internal/errors:387:5)
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:76:11)
    at defaultGetFormat (node:internal/modules/esm/get_format:118:38)
    at defaultLoad (node:internal/modules/esm/load:81:20)
    at nextLoad (node:internal/modules/esm/loader:165:28)
    at ESMLoader.load (node:internal/modules/esm/loader:608:26)
    at ESMLoader.moduleProvider (node:internal/modules/esm/loader:464:22)
    at new ModuleJob (node:internal/modules/esm/module_job:63:26)
    at ESMLoader.#createModuleJob (node:internal/modules/esm/loader:483:17)
    at ESMLoader.getModuleJob (node:internal/modules/esm/loader:441:34)
`
    )

    t2(
      '@react-spectrum/actiongroup',
      // https://github.com/vikejs/vike/discussions/791#discussion-5101014
      `
Error: ERR_UNKNOWN_FILE_EXTENSION .css /home/stuart/tmp/vite-ssr-example/node_modules/.pnpm/@react-spectrum+actiongroup@3.8.2_@react-spectrum+provider@3.7.1_react-dom@18.2.0_react@18.2.0/node_modules/@react-spectrum/actiongroup/dist/main.css
    at defaultGetFormat (/home/stuart/tmp/vite-ssr-example/node_modules/.pnpm/ts-node@10.9.1_@types+node@18.15.11_typescript@4.9.5/node_modules/ts-node/dist-raw/node-internal-modules-esm-get_format.js:93:15)
    at defer (/home/stuart/tmp/vite-ssr-example/node_modules/.pnpm/ts-node@10.9.1_@types+node@18.15.11_typescript@4.9.5/node_modules/ts-node/src/esm.ts:296:7)
    at entrypointFallback (/home/stuart/tmp/vite-ssr-example/node_modules/.pnpm/ts-node@10.9.1_@types+node@18.15.11_typescript@4.9.5/node_modules/ts-node/src/esm.ts:304:22)
    at getFormat (/home/stuart/tmp/vite-ssr-example/node_modules/.pnpm/ts-node@10.9.1_@types+node@18.15.11_typescript@4.9.5/node_modules/ts-node/src/esm.ts:338:26)
    at /home/stuart/tmp/vite-ssr-example/node_modules/.pnpm/ts-node@10.9.1_@types+node@18.15.11_typescript@4.9.5/node_modules/ts-node/src/esm.ts:245:17
    at addShortCircuitFlag (/home/stuart/tmp/vite-ssr-example/node_modules/.pnpm/ts-node@10.9.1_@types+node@18.15.11_typescript@4.9.5/node_modules/ts-node/src/esm.ts:409:21)
    at load (/home/stuart/tmp/vite-ssr-example/node_modules/.pnpm/ts-node@10.9.1_@types+node@18.15.11_typescript@4.9.5/node_modules/ts-node/src/esm.ts:239:12)
    at load (/home/stuart/tmp/vite-ssr-example/node_modules/.pnpm/ts-node@10.9.1_@types+node@18.15.11_typescript@4.9.5/node_modules/ts-node/src/child/child-loader.ts:18:36)
    at nextLoad (node:internal/modules/esm/loader:163:28)
    at ESMLoader.load (node:internal/modules/esm/loader:605:26)
`
    )

    t2(
      false,
      // User land ESM error
      `
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".123" for /home/xxx/projects/vike/xxx/server/root.123
at new NodeError (node:internal/errors:399:5)
at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:79:11)
at defaultGetFormat (node:internal/modules/esm/get_format:121:38)
at defaultLoad (node:internal/modules/esm/load:81:20)
at nextLoad (node:internal/modules/esm/loader:163:28)
at ESMLoader.load (node:internal/modules/esm/loader:605:26)
at ESMLoader.moduleProvider (node:internal/modules/esm/loader:457:22)
at new ModuleJob (node:internal/modules/esm/module_job:64:26)
at #createModuleJob (node:internal/modules/esm/loader:480:17)
at ESMLoader.getModuleJob (node:internal/modules/esm/loader:434:34) {
code: 'ERR_UNKNOWN_FILE_EXTENSION'
}
`
    )

    t2(
      false,
      // https://github.com/vikejs/vike/discussions/901#discussioncomment-6733600
      // https://github.com/vikejs/vike/discussions/1067
      // https://github.com/vikejs/vike/issues/877
      `TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /media/oem/MyFiles/8_DEVELOPMENT/vite-ssr-ts-project/server/index.ts`
    )
  })
}

// Classic: server-side code importing CSS.
function ERR_UNSUPPORTED_DIR_IMPORT() {
  it('ERR_UNSUPPORTED_DIR_IMPORT', () => {
    t2(
      '@aws-amplify/datastore',
      // https://github.com/vikejs/vike/discussions/934
      `
Error: ERR_UNSUPPORTED_DIR_IMPORT /Users/xxx/Documents/Github/xxx/node_modules/@aws-amplify/datastore/ssr /Users/xxx/Documents/Github/xxx/dist/server/renderer/default-page-server.js
    at finalizeResolution (/Users/xxx/Documents/Github/xxx/node_modules/ts-node/dist-raw/node-internal-modules-esm-resolve.js:362:17)
    at moduleResolve (/Users/xxx/Documents/Github/xxx/node_modules/ts-node/dist-raw/node-internal-modules-esm-resolve.js:801:10)
    at Object.defaultResolve (/Users/xxx/Documents/Github/xxx/node_modules/ts-node/dist-raw/node-internal-modules-esm-resolve.js:912:11)
    at /Users/xxx/Documents/Github/xxx/node_modules/ts-node/src/esm.ts:218:35
    at entrypointFallback (/Users/xxx/Documents/Github/xxx/node_modules/ts-node/src/esm.ts:168:34)
    at /Users/xxx/Documents/Github/xxx/node_modules/ts-node/src/esm.ts:217:14
    at addShortCircuitFlag (/Users/xxx/Documents/Github/xxx/node_modules/ts-node/src/esm.ts:409:21)
    at resolve (/Users/xxx/Documents/Github/xxx/node_modules/ts-node/src/esm.ts:197:12)
    at resolve (/Users/xxx/Documents/Github/xxx/node_modules/ts-node/src/child/child-loader.ts:15:39)
    at nextResolve (node:internal/modules/esm/loader:165:28)
`
    )

    t2(
      '@mui/material',
      // https://github.com/vikejs/vike/discussions/700#discussioncomment-5283034
      `
Error: ERR_UNSUPPORTED_DIR_IMPORT ...\\vite-ssr-app\\node_modules\\@mui\\material\\styles from ...\\vite-ssr-app\\dist\\server\\renderer\\default-page-server.js
    `
    )

    t2(
      false,
      // User land ESM error
      `
Error [ERR_UNSUPPORTED_DIR_IMPORT]: Directory import '/Users/xxx/xxx/src/models' is not supported resolving ES modules imported from /Users/xxx/xxx/src/index.js
  at finalizeResolution (internal/modules/esm/resolve.js:272:17)
  at moduleResolve (internal/modules/esm/resolve.js:699:10)
  at Loader.defaultResolve [as _resolve] (internal/modules/esm/resolve.js:810:11)
  at Loader.resolve (internal/modules/esm/loader.js:85:40)
  at Loader.getModuleJob (internal/modules/esm/loader.js:229:28)
  at ModuleWrap.<anonymous> (internal/modules/esm/module_job.js:51:40)
  at link (internal/modules/esm/module_job.js:50:36) {
code: 'ERR_UNSUPPORTED_DIR_IMPORT',
url: 'file:///Users/xxx/xxx/src/models'
}
`
    )

    // More similar errors:
    //  - https://github.com/vikejs/vike/discussions/571#discussioncomment-6145155
  })
}

// Classic: reading the property of an import value that is undefined because of a CJS/ESM issue
function cannot_read_property_of_undefined() {
  it('TypeError: Cannot read properties of undefined', () => {
    t1(
      // true instead of 'vike-react' because the problem is the importee and not the importer
      true,
      /* node_modules/ land
       * - Error artificially created:
       *   ```diff
       *   // node_modules/vike-react/dist/renderer/onRenderHtml.js:
       *   - import { PageContextProvider } from './PageContextProvider.js';
       *   + const PageContextProvider = undefined
       *   // ...
       *   - React.createElement(PageContextProvider, { pageContext: pageContext },
       *   + React.createElement(PageContextProvider.foo, { pageContext: pageContext },
       *   ```
       */
      {
        message: "Cannot read properties of undefined (reading 'foo')",
        code: undefined,
        stack: `
TypeError: Cannot read properties of undefined (reading 'foo')
    at onRenderHtml (file:///home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/onRenderHtml.js:21:49)
    at file:///home/romu/code/vike/vike/dist/esm/node/runtime/renderPage/executeOnRenderHtmlHook.js:15:53
    at file:///home/romu/code/vike/vike/dist/esm/shared/hooks/executeHook.js:46:31
    at executeHook (file:///home/romu/code/vike/vike/dist/esm/shared/hooks/executeHook.js:55:7)
    at executeOnRenderHtmlHook (file:///home/romu/code/vike/vike/dist/esm/node/runtime/renderPage/executeOnRenderHtmlHook.js:15:35)
    at renderPageAlreadyRouted (file:///home/romu/code/vike/vike/dist/esm/node/runtime/renderPage/renderPageAlreadyRouted.js:57:36)
    at renderPageNominal (file:///home/romu/code/vike/vike/dist/esm/node/runtime/renderPage.js:266:36)
    at renderPageAlreadyPrepared (file:///home/romu/code/vike/vike/dist/esm/node/runtime/renderPage.js:121:45)
    at renderPageAndPrepare (file:///home/romu/code/vike/vike/dist/esm/node/runtime/renderPage.js:101:12)
    at file:///home/romu/code/vike/vike/dist/esm/node/plugin/shared/getHttpRequestAsyncStore.js:68:35
`
      }
    )

    t2(
      true,
      // https://github.com/vikejs/vike/discussions/1235#discussion-5806578
      `
TypeError: Cannot read properties of undefined (reading '__H')
    at getHookState (/Users/xxx/Code/Repos/xxx/node_modules/preact/hooks/src/index.js:137:19)
    at Object.h (/Users/xxx/Code/Repos/xxx/node_modules/preact/hooks/src/index.js:320:16)
    at Object.call (/Users/xxx/Code/Repos/xxx/node_modules/react-redux/lib/components/Provider.js:26:30)
    at renderFunctionComponent (file:///Users/xxx/Code/Repos/xxx/node_modules/preact-render-to-string/src/index.js:119:25)
    at _renderToString (file:///Users/xxx/Code/Repos/xxx/node_modules/preact-render-to-string/src/index.js:282:16)
    at _renderToString (file:///Users/xxx/Code/Repos/xxx/node_modules/preact-render-to-string/src/index.js:298:15)
    at Proxy.S (file:///Users/xxx/Code/Repos/xxx/node_modules/preact-render-to-string/src/index.js:80:9)
    at onRenderHtml (/Users/xxx/Code/Repos/xxx/renderer/+onRenderHtml.jsx:12:29)
    at file:///Users/xxx/Code/Repos/xxx/node_modules/vike/dist/esm/node/runtime/renderPage/executeOnRenderHtmlHook.js:16:53
    at file:///Users/xxx/Code/Repos/xxx/node_modules/vike/dist/esm/shared/hooks/executeHook.js:42:31
    at executeHook (file:///Users/xxx/Code/Repos/xxx/node_modules/vike/dist/esm/shared/hooks/executeHook.js:51:7)
    at executeOnRenderHtmlHook (file:///Users/xxx/Code/Repos/xxx/node_modules/vike/dist/esm/node/runtime/renderPage/executeOnRenderHtmlHook.js:16:35)
    at renderPageAlreadyRouted (file:///Users/xxx/Code/Repos/xxx/node_modules/vike/dist/esm/node/runtime/renderPage/renderPageAlreadyRouted.js:56:36)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at renderPageNominal (file:///Users/xxx/Code/Repos/xxx/node_modules/vike/dist/esm/node/runtime/renderPage.js:257:36)
    at renderPageAlreadyPrepared (file:///Users/xxx/Code/Repos/xxx/node_modules/vike/dist/esm/node/runtime/renderPage.js:113:45)
    at renderPageAndPrepare (file:///Users/xxx/Code/Repos/xxx/node_modules/vike/dist/esm/node/runtime/renderPage.js:93:12)
    at file:///Users/xxx/Code/Repos/xxx/node_modules/vike/dist/esm/node/plugin/shared/getHttpRequestAsyncStore.js:68:35
    at renderPage (file:///Users/xxx/Code/Repos/xxx/node_modules/vike/dist/esm/node/runtime/renderPage.js:46:50)
    at file:///Users/xxx/Code/Repos/xxx/node_modules/vike/dist/esm/node/plugin/shared/addSsrMiddleware.js:18:27
`
    )

    t2(
      false,
      // User land JavaScript error
      `
file:///home/xxx/projects/vike/xxx/server/index.js:20
  console.log(a.b);
                ^

TypeError: Cannot read properties of undefined (reading 'b')
    at startServer (file:///home/xxx/projects/vike/xxx/server/index.js:20:17)
    at file:///home/xxx/projects/vike/xxx/server/index.js:13:1
    at ModuleJob.run (node:internal/modules/esm/module_job:194:25)
`
    )

    t2(
      // Not enough information => is this user land or node_modules/ land?
      false,
      // https://github.com/vitejs/vite/issues/11299#issue-1487867332
      `
TypeError: Cannot read properties of undefined (reading 'extendTheme')
    at eval (/home/projects/llqijrlvr.github/src/entry.js:5:35)
    at async instantiateModule (file://file:///home/projects/llqijrlvr.github/node_modules/.pnpm/vite@4.0.0/node_modules/vite/dist/node/chunks/dep-ed9cb113.js:53295:9)
`
    )
  })
}

// Classic: using require() to load ESM modules
function ERR_REQUIRE_ESM() {
  it('ERR_REQUIRE_ESM', () => {
    t1(
      'vike-react',
      /* node_modules/ land
       * - Error artificially created:
       *   ```diff
       *   // node_modules/vike-react/dist/renderer/onRenderHtml.js:
       *   + require('./getPageElement.js');
       *   ```
       */
      {
        message:
          'require() of ES Module /home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/getPageElement.js from /home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/onRenderHtml.js not supported.\nInstead change the require of getPageElement.js in /home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/onRenderHtml.js to a dynamic import() which is available in all CommonJS modules.',
        code: 'ERR_REQUIRE_ESM',
        stack: `
Error [ERR_REQUIRE_ESM]: require() of ES Module /home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/getPageElement.js from /home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/onRenderHtml.js not supported.
Instead change the require of getPageElement.js in /home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/onRenderHtml.js to a dynamic import() which is available in all CommonJS modules.
    at file:///home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/onRenderHtml.js:10:1
`
      }
    )

    // Make sure the right package is picked: the issue is the importer, not the importee
    t1(
      'vike-react-foo', // instead of 'vike-react'
      // artificially created: copy of above error with modified stack trace s/vike-react/vike-react-foo/g (while preserving error message)
      {
        message:
          'require() of ES Module /home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/getPageElement.js from /home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/onRenderHtml.js not supported.\nInstead change the require of getPageElement.js in /home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/onRenderHtml.js to a dynamic import() which is available in all CommonJS modules.',
        code: 'ERR_REQUIRE_ESM',
        stack: `
Error [ERR_REQUIRE_ESM]: require() of ES Module /home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/getPageElement.js from /home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/onRenderHtml.js not supported.
Instead change the require of getPageElement.js in /home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/onRenderHtml.js to a dynamic import() which is available in all CommonJS modules.
    at file:///home/romu/code/vike/node_modules/.pnpm/vike-react-foo@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react-foo/dist/renderer/onRenderHtml.js:10:1
`
      }
    )

    t2(
      false,
      // https://github.com/vikejs/vike/issues/621#issuecomment-1466175125
      `
Error [ERR_REQUIRE_ESM]: require() of ES Module
/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/node-fetch@3.3.1/node_modules/node-fetch/src/index.js
from
/home/rom/code/vite-plugin-ssr/examples/graphql-apollo-react/server/index.js
not supported.
      `
    )

    t2(
      false,
      // Cannot reproduce this error, I guess it comes from an older Node.js version?
      `
Error [ERR_REQUIRE_ESM]: Must use import to load ES Module: E:\\Javascript\\xxx\\node_modules\\@preact\\preset-vite\\dist\\index.js
require() of ES modules is not supported.
require() of E:\\Javascript\\xxx\\node_modules\\@preact\\preset-vite\\dist\\index.js from E:\\Javascript\\xxx\\vite.config.js is an ES module file as it is a .js file whose nearest parent package.json contains "type": "module" which defines all .js files in that package scope as ES modules.
Instead rename index.js to end in .cjs, change the requiring code to use import(), or remove "type": "module" from E:\\xxx\\Javascript\\xxx\\node_modules\\@preact\\preset-vite\\package.json.

    at Module._extensions..js (internal/modules/cjs/loader.js:1080:13)
    at Object.require.extensions.<computed> [as .js] (E:\\Javascript\\xxx\\node_modules\\vite\\dist\\node\\chunks\\dep-36bf480c.js:77286:13)
    at Module.load (internal/modules/cjs/loader.js:928:32)
    at Function.Module._load (internal/modules/cjs/loader.js:769:14)
    at Module.require (internal/modules/cjs/loader.js:952:19)
    at require (internal/modules/cjs/helpers.js:88:18)
    at Object.<anonymous> (E:\\xxx\\Javascript\\xxx\\vite.config.js:30:37)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)
    at Object.require.extensions.<computed> [as .js] (E:\\Javascript\\xxx\\node_modules\\vite\\dist\\node\\chunks\\dep-36bf480c.js:77283:20)
    at Module.load (internal/modules/cjs/loader.js:928:32)
`
    )
  })

  t1(
    'react-dom',
    /* Error artificially created:
    ```diff
    // node_modules/react-dom/server.node.js
    + require('vike-react')
    ``` */
    {
      message:
        'require() of ES Module /home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.4_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/+config.js from /home/romu/code/vike/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/server.node.js not supported.\nInstead change the require of +config.js in /home/romu/code/vike/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/server.node.js to a dynamic import() which is available in all CommonJS modules.',
      code: 'ERR_REQUIRE_ESM',
      stack: `
Error [ERR_REQUIRE_ESM]: require() of ES Module /home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.4_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/+config.js from /home/romu/code/vike/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/server.node.js not supported.
Instead change the require of +config.js in /home/romu/code/vike/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/server.node.js to a dynamic import() which is available in all CommonJS modules.
    at Object.<anonymous> (/home/romu/code/vike/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/server.node.js:13:1)
    at async nodeImport (file:///home/romu/code/vike/node_modules/.pnpm/vite@5.0.10_@types+node@17.0.45/node_modules/vite/dist/node/chunks/dep-R0I0XnyH.js:50544:17)
    at async ssrImport (file:///home/romu/code/vike/node_modules/.pnpm/vite@5.0.10_@types+node@17.0.45/node_modules/vite/dist/node/chunks/dep-R0I0XnyH.js:50444:24)
    at async eval (virtual:vike:pageConfigValuesAll:server:/pages/index:3:44)
    at async instantiateModule (file:///home/romu/code/vike/node_modules/.pnpm/vite@5.0.10_@types+node@17.0.45/node_modules/vite/dist/node/chunks/dep-R0I0XnyH.js:50506:9)
`
    }
  )
}

// Classic: Importing CJS named export from ESM
function cjs_named_export() {
  it('cjs_named_export', () => {
    t1(
      '@apollo/client',
      // https://github.com/brillout/cjs-esm-bug_apollo
      // https://github.com/vikejs/vike/discussions/872#discussion-5177942
      {
        message:
          "Named export 'ApolloClient' not found. The requested module '@apollo/client' is a CommonJS module, which may not support all module.exports as named exports.\nCommonJS modules can always be imported via the default export, for example using:\n\nimport pkg from '@apollo/client';\nconst { ApolloClient } = pkg;\n",
        code: undefined,
        stack: `
file:///home/romu/tmp/vite-ssr-test/dist/server/entries/pages_about_index-page.mjs:2
import { ApolloClient } from "@apollo/client";
         ^^^^^^^^^^^^
SyntaxError: Named export 'ApolloClient' not found. The requested module '@apollo/client' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from '@apollo/client';
const { ApolloClient } = pkg;

    at ModuleJob._instantiate (node:internal/modules/esm/module_job:131:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:213:5)
    at async ModuleLoader.import (node:internal/modules/esm/loader:316:24)
    at async pageFile.loadFile (file:///home/romu/tmp/vite-ssr-test/node_modules/.pnpm/vite-plugin-ssr@0.4.142_vite@4.0.3/node_modules/vite-plugin-ssr/dist/esm/shared/getPageFiles/parseGlobResults.js:31:40)
    at async Promise.all (index 0)
    at async loadPageFiles (file:///home/romu/tmp/vite-ssr-test/node_modules/.pnpm/vite-plugin-ssr@0.4.142_vite@4.0.3/node_modules/vite-plugin-ssr/dist/esm/node/runtime/renderPage/loadPageFilesServerSide.js:86:5)
    at async Promise.all (index 0)
    at async loadPageFilesServerSide (file:///home/romu/tmp/vite-ssr-test/node_modules/.pnpm/vite-plugin-ssr@0.4.142_vite@4.0.3/node_modules/vite-plugin-ssr/dist/esm/node/runtime/renderPage/loadPageFilesServerSide.js:13:110)
    at async renderPageAlreadyRouted (file:///home/romu/tmp/vite-ssr-test/node_modules/.pnpm/vite-plugin-ssr@0.4.142_vite@4.0.3/node_modules/vite-plugin-ssr/dist/esm/node/runtime/renderPage/renderPageAlreadyRouted.js:30:31)
    at async renderPageNominal (file:///home/romu/tmp/vite-ssr-test/node_modules/.pnpm/vite-plugin-ssr@0.4.142_vite@4.0.3/node_modules/vite-plugin-ssr/dist/esm/node/runtime/renderPage.js:267:36)
`
      }
    )

    t1(
      'react-live-runner',
      // https://github.com/brillout/vite-ssr-redux-react-live-runner-example
      // https://github.com/vikejs/vike/discussions/571#discussioncomment-6144329
      {
        message:
          "Named export 'LiveEditor' not found. The requested module 'react-live-runner' is a CommonJS module, which may not support all module.exports as named exports.\nCommonJS modules can always be imported via the default export, for example using:\n\nimport pkg from 'react-live-runner';\nconst { LiveProvider, LiveEditor } = pkg;\n",
        code: undefined,
        stack: `
file:///home/romu/tmp/vite-ssr-redux-react-live-runner-example/dist/server/entries/pages_index-page.mjs:4
import { LiveProvider, LiveEditor } from "react-live-runner";
                       ^^^^^^^^^^
SyntaxError: Named export 'LiveEditor' not found. The requested module 'react-live-runner' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from 'react-live-runner';
const { LiveProvider, LiveEditor } = pkg;

    at ModuleJob._instantiate (node:internal/modules/esm/module_job:131:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:213:5)
    at async ModuleLoader.import (node:internal/modules/esm/loader:316:24)
    at async pageFile.loadFile (/home/romu/tmp/vite-ssr-redux-react-live-runner-example/node_modules/.pnpm/vite-plugin-ssr@0.4.131_vite@4.3.9/node_modules/vite-plugin-ssr/dist/cjs/shared/getPageFiles/parseGlobResults.js:35:40)
    at async Promise.all (index 0)
    at async loadPageFilesServerSide (/home/romu/tmp/vite-ssr-redux-react-live-runner-example/node_modules/.pnpm/vite-plugin-ssr@0.4.131_vite@4.3.9/node_modules/vite-plugin-ssr/dist/cjs/shared/getPageFiles/analyzePageServerSide/loadPageFilesServerSide.js:10:5)
    at async Promise.all (index 0)
    at async loadPageFilesServer (/home/romu/tmp/vite-ssr-redux-react-live-runner-example/node_modules/.pnpm/vite-plugin-ssr@0.4.131_vite@4.3.9/node_modules/vite-plugin-ssr/dist/cjs/node/runtime/renderPage/loadPageFilesServer.js:15:110)
    at async /home/romu/tmp/vite-ssr-redux-react-live-runner-example/node_modules/.pnpm/vite-plugin-ssr@0.4.131_vite@4.3.9/node_modules/vite-plugin-ssr/dist/cjs/node/prerender/runPrerender.js:247:48
`
      }
    )

    t2(
      'vue-i18n',
      // https://github.com/vikejs/vike/discussions/635#discussion-4828827
      // https://github.com/vikejs/vike/discussions/635#discussioncomment-5029275
      `
import { useI18n, createI18n } from "vue-i18n/dist/vue-i18n.runtime.esm-bundler.js";
                  ^^^^^^^^^^
SyntaxError: Named export 'createI18n' not found. The requested module 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js';
const { useI18n, createI18n } = pkg;
`
    )

    // More similar errors:
    //  - https://github.com/vikejs/vike/discussions/934#discussioncomment-6085697
    //  - https://github.com/vikejs/vike/discussions/934#discussioncomment-6091261
    //  - https://github.com/vikejs/vike/discussions/934#discussioncomment-6091849
    //  - https://github.com/vikejs/vike/discussions/1021#discussion-5416877
    //  - https://github.com/vikejs/vike/discussions/1023#discussion-5421060
    //  - https://github.com/vikejs/vike/discussions/1084#discussion-5536319
    //  - https://github.com/vikejs/vike/discussions/1149#discussion-5676567
  })
}

function cannot_use_import_outside_of_module() {
  it('Cannot use import statement outside a module', () => {
    t2(
      'react-runner',
      // Same as errror_cannot_use_import_outside_of_module but slimmed down
      // https://github.com/vikejs/vike/discussions/571#discussioncomment-6137618
      `
import{useRunner as e}from"react-runner";export*from"react-runner";import t,{useState as r,useEffect as n,Fragment as a,useCallback as l,useRef as o,useMemo as c,createContext as s,useContext as i}from"react";import p from"react-simple-code-editor";
^^^^^^

    SyntaxError: Cannot use import statement outside a module
        at Object.compileFunction (node:vm:360:18)
        at wrapSafe (node:internal/modules/cjs/loader:1084:15)
        at Module._compile (node:internal/modules/cjs/loader:1119:27)
        at Object.Module._extensions..js (node:internal/modules/cjs/loader:1209:10)
        at Module.load (node:internal/modules/cjs/loader:1033:32)
        at Function.Module._load (node:internal/modules/cjs/loader:868:12)
        at ModuleWrap.<anonymous> (node:internal/modules/esm/translators:169:29)
        at ModuleJob.run (node:internal/modules/esm/module_job:193:25)
        at processTicksAndRejections (node:internal/process/task_queues:96:5)
      at async Promise.all (index 0)
`
    )

    // https://github.com/vikejs/vike/discussions/571#discussioncomment-6137618
    t2('react-runner', errror_cannot_use_import_outside_of_module)

    // More similar errors:
    //  - https://github.com/vikejs/vike/discussions/1153#discussion-5682749
  })
}

function is_not_defined() {
  it('exports is not defined', () => {
    t2(
      'react-simple-code-editor',
      // https://github.com/vikejs/vike/discussions/571#discussioncomment-6137618
      `
ReferenceError: exports is not defined
    at eval (/Users/xxx/git/xxx/xxx/node_modules/react-simple-code-editor/lib/index.js:64:23)
    at instantiateModule (file:///Users/xxx/git/xxx/xxx/node_modules/vite/dist/node/chunks/dep-e8f070e8.js:54405:15)
`
    )

    t2(
      '@adobe/react-spectrum-ui',
      // https://github.com/vikejs/vike/discussions/791#discussioncomment-5647399
      `
ReferenceError: exports is not defined
    at /node_modules/.pnpm/@adobe+react-spectrum-ui@1.2.0_react-dom@18.2.0_react@18.2.0/node_modules/@adobe/react-spectrum-ui/dist/CornerTriangle.js:12:23
    at instantiateModule (file:///home/stuart/tmp/vite-ssr-example/node_modules/.pnpm/vite@4.2.1_@types+node@18.15.11/node_modules/vite/dist/node/chunks/dep-79892de8.js:53996:15)
      `
    )

    t2(
      false,
      // User land ESM error
      `
ReferenceError: exports is not defined in ES module scope
This file is being treated as an ES module because it has a '.js' file extension and '/home/xxx/projects/vike/xxx/package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
    at file:///home/xxx/projects/vike/xxx/server/index.js:14:1
    at ModuleJob.run (node:internal/modules/esm/module_job:194:25)
`
    )

    // More similar errors:
    //  - https://github.com/vikejs/vike/discussions/571#discussioncomment-6145155
    //  - https://github.com/vikejs/vike/discussions/1071#discussioncomment-6728731
  })

  it('require is not a function', () => {
    t1(
      '@mui/icons-material',
      // https://github.com/brillout/vps-mui/tree/reprod-2
      {
        message: 'require is not a function',
        code: undefined,
        stack: `
TypeError: require is not a function
    at eval (/home/romu/tmp/vps-mui/node_modules/.pnpm/@mui+icons-material@5.11.16_@mui+material@5.13.2_@types+react@18.2.6_react@18.2.0/node_modules/@mui/icons-material/Menu.js:5:30)
    at instantiateModule (file:///home/romu/tmp/vps-mui/node_modules/.pnpm/vite@4.3.8_@types+node@18.16.14/node_modules/vite/dist/node/chunks/dep-4d3eff22.js:54399:15)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
`
      }
    )
  })

  it('module is not defined', () => {
    t2(
      '@mdi/react',
      // https://github.com/vikejs/vike/discussions/830#discussioncomment-5763039
      `
    ReferenceError: module is not defined
    at eval (/@fs/home/rui/Projects/binedge-website/node_modules/@mdi/react/Icon.js:3:14)
    at instantiateModule (file:///home/rui/Projects/binedge-website/node_modules/vite/dist/node/chunks/dep-24daf00c.js:54351:15)
`
    )

    // More similar errors:
    //  - https://github.com/vikejs/vike/issues/984#issuecomment-1640267319
  })

  it('window is not defined', () => {
    t1(
      'vike-react',
      /* Error artificially created:
      ```diff
      // node_modules/vike-react/dist/renderer/onRenderHtml.js:
      + window;
      ``` */
      {
        message: 'window is not defined',
        code: undefined,
        stack: `
ReferenceError: window is not defined
    at file:///home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/onRenderHtml.js:10:1
    at ModuleJob.run (node:internal/modules/esm/module_job:194:25)
`
      }
    )
  })

  // The issue here is the other way around: the library shouldn't be ssr.noExternal, see https://github.com/vikejs/vike/issues/621#issuecomment-1781661083
  //  - Therefore, the hint we show is actually wrong. But we keep it in order to communicate the user that this is a CJS/ESM issue.
  //    - Ideally, we should implement a new hint for this error.
  it('__dirname is not defined', () => {
    t1(
      'vike-react',
      /* Error artificially created:
      ```diff
      // node_modules/vike-react/dist/renderer/onRenderHtml.js:
      + __dirname;
      ``` */
      {
        message:
          "__dirname is not defined in ES module scope\nThis file is being treated as an ES module because it has a '.js' file extension and '/home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/package.json' contains \"type\": \"module\". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.",
        code: undefined,
        stack: `
ReferenceError: __dirname is not defined in ES module scope
This file is being treated as an ES module because it has a '.js' file extension and '/home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
    at file:///home/romu/code/vike/node_modules/.pnpm/vike-react@0.3.8_react-dom@18.2.0_react@18.2.0_vike@vike_vite@5.0.10/node_modules/vike-react/dist/renderer/onRenderHtml.js:10:1
    at ModuleJob.run (node:internal/modules/esm/module_job:194:25)
`
      }
    )
  })
}

function is_not_exported() {
  it('is_not_exported', () => {
    t2(
      '@mui/icons-material',
      // https://github.com/vikejs/vike/discussions/901#discussioncomment-6498270
      `
RollupError: "MenuIcon" is not exported by "node_modules/.pnpm/@mui+icons-material@5.11.16_@mui+material@5.13.2_@types+react@18.2.6_react@18.2.0/node_modules/@mui/icons-material/esm/index.js", imported by "pages/index/index.page.tsx".
    at error (file:///home/rom/tmp/vps-mui/node_modules/.pnpm/rollup@3.23.0/node_modules/rollup/dist/es/shared/node-entry.js:2124:30)
    at Module.error (file:///home/rom/tmp/vps-mui/node_modules/.pnpm/rollup@3.23.0/node_modules/rollup/dist/es/shared/node-entry.js:13463:16)
    at Module.traceVariable (file:///home/rom/tmp/vps-mui/node_modules/.pnpm/rollup@3.23.0/node_modules/rollup/dist/es/shared/node-entry.js:13884:29)
    at ModuleScope.findVariable (file:///home/rom/tmp/vps-mui/node_modules/.pnpm/rollup@3.23.0/node_modules/rollup/dist/es/shared/node-entry.js:12429:39)
    at Identifier.bind (file:///home/rom/tmp/vps-mui/node_modules/.pnpm/rollup@3.23.0/node_modules/rollup/dist/es/shared/node-entry.js:8127:40)
    at CallExpression.bind (file:///home/rom/tmp/vps-mui/node_modules/.pnpm/rollup@3.23.0/node_modules/rollup/dist/es/shared/node-entry.js:5734:28)
    at CallExpression.bind (file:///home/rom/tmp/vps-mui/node_modules/.pnpm/rollup@3.23.0/node_modules/rollup/dist/es/shared/node-entry.js:9680:15)
    at ExpressionStatement.bind (file:///home/rom/tmp/vps-mui/node_modules/.pnpm/rollup@3.23.0/node_modules/rollup/dist/es/shared/node-entry.js:5738:23)
    at Program.bind (file:///home/rom/tmp/vps-mui/node_modules/.pnpm/rollup@3.23.0/node_modules/rollup/dist/es/shared/node-entry.js:5734:28)
    at Module.bindReferences (file:///home/rom/tmp/vps-mui/node_modules/.pnpm/rollup@3.23.0/node_modules/rollup/dist/es/shared/node-entry.js:13459:18)
 ELIFECYCLE  Command failed with exit code 1.
`
    )
  })
}

function unexpected_token_export() {
  it("Unexpected token 'export'", () => {
    t1(
      '@mui/material',
      // https://github.com/brillout/repro_node-syntax-error
      // https://github.com/vikejs/vike/discussions/901#discussioncomment-6643299
      // https://github.com/vikejs/vike/discussions/901#discussioncomment-6704554
      {
        message: "Unexpected token 'export'",
        code: undefined,
        // The preamble with the node_modules file path is injected by Node.js, see https://github.com/brillout/repro_node-syntax-error#nodejs-behavior
        stack: `
/home/romu/tmp/vite-ssr-project/node_modules/.pnpm/@mui+material@5.14.4_@emotion+react@11.11.1_@emotion+styled@11.11.0_@types+react@18.2.20_react-dom@18.2.0_react@18.2.0/node_modules/@mui/material/Button/index.js:3
export { default } from './Button';
^^^^^^

SyntaxError: Unexpected token 'export'
    at internalCompileFunction (node:internal/vm:73:18)
    at wrapSafe (node:internal/modules/cjs/loader:1176:20)
    at Module._compile (node:internal/modules/cjs/loader:1218:27)
    at Module._extensions..js (node:internal/modules/cjs/loader:1308:10)
    at Module.load (node:internal/modules/cjs/loader:1117:32)
    at Module._load (node:internal/modules/cjs/loader:958:12)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/translators:169:29)
    at ModuleJob.run (node:internal/modules/esm/module_job:194:25)
`
      }
    )
  })
}

// Classic: React's infamous invalid component error.
function react_invalid_component() {
  it('React: invalid component', () => {
    expect(true).toBe(
      isReactInvalidComponentError(
        /* Error artificially created:
        ```diff
        // node_modules/vike-react/dist/renderer/onRenderHtml.js:
        - import { PageContextProvider } from './PageContextProvider.js';
        + const PageContextProvider = undefined
        ``` */
        // https://github.com/brillout/vps-mui/tree/reprod-1
        // https://github.com/vikejs/vike/discussions/830#discussion-5143519
        // https://github.com/vikejs/vike/discussions/830#discussioncomment-5763136
        // https://github.com/vikejs/vike/discussions/571#discussioncomment-6141003
        // https://github.com/vikejs/vike/discussions/1031#discussion-5426053
        // https://github.com/vikejs/vike/discussions/1080#discussion-5535121
        {
          message:
            "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.",
          code: undefined,
          stack: `
Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
    at renderElement (/home/romu/code/vike/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:6047:9)
    at renderNodeDestructiveImpl (/home/romu/code/vike/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:6108:11)
    at renderNodeDestructive (/home/romu/code/vike/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:6080:14)
    at renderElement (/home/romu/code/vike/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:5975:9)
    at renderNodeDestructiveImpl (/home/romu/code/vike/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:6108:11)
    at renderNodeDestructive (/home/romu/code/vike/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:6080:14)
    at retryTask (/home/romu/code/vike/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:6532:5)
    at performWork (/home/romu/code/vike/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:6580:7)
    at /home/romu/code/vike/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:6904:12
    at scheduleWork (/home/romu/code/vike/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:78:3)
`
        }
      )
    )
    expect(true).toBe(
      isReactInvalidComponentError(
        // Also catch `but got: object`
        {
          message:
            "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.",
          // Fake error obejct
          code: undefined,
          stack: ``
        }
      )
    )
    expect(true).toBe(
      isReactInvalidComponentError(
        // Or any other invalid value
        {
          message:
            "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: foo. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.",
          // Fake error obejct
          code: undefined,
          stack: ``
        }
      )
    )
  })
}

function t1(expectedResult: Res, error: { message: string; code: string | undefined; stack: string }) {
  expectRes(isCjsEsmError(error), expectedResult)
}
function t2(resExpected: boolean | string, errString: string) {
  expectRes(isCjsEsmError({ stack: errString }), resExpected)
}
type Res = boolean | string | string[]
function expectRes(res: Res, resExpected: Res) {
  if (typeof res === 'string') res = [res]
  if (typeof resExpected === 'string') resExpected = [resExpected]
  expect(res).toEqual(resExpected)
}
