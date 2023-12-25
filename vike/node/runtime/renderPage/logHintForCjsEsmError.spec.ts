import { isCjsEsmError } from './logHintForCjsEsmError'
import { expect, describe, it } from 'vitest'

describe('isCjsEsmError', () => {
  it('works', () => {
    expectResult(
      'vuetify',
      // https://github.com/vikejs/vike/discussions/682
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

    expectResult(
      'vue-i18n',
      // https://github.com/vikejs/vike/discussions/635
      `
        import { useI18n, createI18n } from "vue-i18n/dist/vue-i18n.runtime.esm-bundler.js";
                            ^^^^^^^^^^
        SyntaxError: Named export 'createI18n' not found. The requested module 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js' is a CommonJS module, which may not support all module.exports as named exports.
        CommonJS modules can always be imported via the default export, for example using:
        
        import pkg from 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js';
        const { useI18n, createI18n } = pkg;
        `
    )

    expectResult(
      '@react-spectrum/actiongroup',
      // https://github.com/vikejs/vike/discussions/791
      `
        Error: ERR_UNKNOWN_FILE_EXTENSION .css /home/xxx/tmp/vite-ssr-example/node_modules/.pnpm/@react-spectrum+actiongroup@3.8.2_@react-spectrum+provider@3.7.1_react-dom@18.2.0_react@18.2.0/node_modules/@react-spectrum/actiongroup/dist/main.css
            at defaultGetFormat (/home/xxx/tmp/vite-ssr-example/node_modules/.pnpm/ts-node@10.9.1_@types+node@18.15.11_typescript@4.9.5/node_modules/ts-node/dist-raw/node-internal-modules-esm-get_format.js:93:15)
            at defer (/home/xxx/tmp/vite-ssr-example/node_modules/.pnpm/ts-node@10.9.1_@types+node@18.15.11_typescript@4.9.5/node_modules/ts-node/src/esm.ts:296:7)
            at entrypointFallback (/home/xxx/tmp/vite-ssr-example/node_modules/.pnpm/ts-node@10.9.1_@types+node@18.15.11_typescript@4.9.5/node_modules/ts-node/src/esm.ts:304:22)
            at getFormat (/home/xxx/tmp/vite-ssr-example/node_modules/.pnpm/ts-node@10.9.1_@types+node@18.15.11_typescript@4.9.5/node_modules/ts-node/src/esm.ts:338:26)
            at /home/xxx/tmp/vite-ssr-example/node_modules/.pnpm/ts-node@10.9.1_@types+node@18.15.11_typescript@4.9.5/node_modules/ts-node/src/esm.ts:245:17
            at addShortCircuitFlag (/home/xxx/tmp/vite-ssr-example/node_modules/.pnpm/ts-node@10.9.1_@types+node@18.15.11_typescript@4.9.5/node_modules/ts-node/src/esm.ts:409:21)
            at load (/home/xxx/tmp/vite-ssr-example/node_modules/.pnpm/ts-node@10.9.1_@types+node@18.15.11_typescript@4.9.5/node_modules/ts-node/src/esm.ts:239:12)
            at load (/home/xxx/tmp/vite-ssr-example/node_modules/.pnpm/ts-node@10.9.1_@types+node@18.15.11_typescript@4.9.5/node_modules/ts-node/src/child/child-loader.ts:18:36)
            at nextLoad (node:internal/modules/esm/loader:163:28)
            at ESMLoader.load (node:internal/modules/esm/loader:605:26)
          `
    )

    expectResult(
      '@apollo/client',
      // https://github.com/vikejs/vike/discussions/872
      `
        import { ApolloClient } from "@apollo/client";
                ^^^^^^^^^^^^
        SyntaxError: Named export 'ApolloClient' not found. The requested module '@apollo/client' is a CommonJS module, which may not support all module.exports as named exports.
        CommonJS modules can always be imported via the default export, for example using:
        
        import pkg from '@apollo/client';
        const { ApolloClient } = pkg;
        `
    )

    expectResult(
      true,
      // https://github.com/brillout/vps-mui/tree/reprod-2
      `
        TypeError: require is not a function
            at /home/xxx/tmp/vps-mui/node_modules/.pnpm/@mui+icons-material@5.11.16_@mui+material@5.13.2_@types+react@18.2.6_react@18.2.0/node_modules/@mui/icons-material/Menu.js:3:30
            at instantiateModule (file:///home/xxx/tmp/vps-mui/node_modules/.pnpm/vite@4.3.8_@types+node@18.16.14/node_modules/vite/dist/node/chunks/dep-4d3eff22.js:54399:15)
            at processTicksAndRejections (node:internal/process/task_queues:95:5)
        `
    )

    expectResult(
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

    expectResult(
      'react-runner',
      // https://github.com/vikejs/vike/discussions/571
      `
        import{useRunner as e}from"react-runner";export*from"react-runner";import t,{useState as r,useEffect as n,Fragment as a,useCallback as l,useRef as o,useMemo as c,createContext as s,useContext as i}from"react";import p from"react-simple-code-editor";import m,{Prism as u}from"prism-react-renderer";function g(){return g=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},g.apply(this,arguments)}function y(e,t){if(null==e)return{};var r,n,a={},l=Object.keys(e);for(n=0;n<l.length;n++)t.indexOf(r=l[n])>=0||(a[r]=e[r]);return a}const d=["initialCode","transformCode"],h=t=>{let{initialCode:a="",transformCode:l}=t,o=y(t,d);const[c,s]=r(a),{element:i,error:p}=e(g({code:l?l(c):c},o));return n(()=>{s(a)},[a]),{element:i,error:p,code:c,onChange:s}},f={plain:{color:"#ffffff",backgroundColor:"#282c34"},styles:[{types:["comment","block-comment","prolog","doctype","cdata"],style:{color:"#b2b2b2"}},{types:["property","number","function-name","constant","symbol","deleted"],style:{color:"#5a9bcf"}},{types:["boolean"],style:{color:"#ff8b50"}},{types:["tag"],style:{color:"#fc929e"}},{types:["string","attr-value"],style:{color:"#8dc891"}},{types:["punctuation"],style:{color:"#88c6Be"}},{types:["selector","char","builtin","inserted"],style:{color:"#d8dee9"}},{types:["function"],style:{color:"#79b6f2"}},{types:["operator","entity","url","variable"],style:{color:"#d7deea"}},{types:["keyword"],style:{color:"#c5a5c5"}},{types:["atrule","class-name"],style:{color:"#fac863"}},{types:["important"],style:{fontWeight:"400"}},{types:["bold"],style:{fontWeight:"700"}},{types:["italic"],style:{fontStyle:"italic"}},{types:["entity"],style:{cursor:"help"}},{types:["namespace"],style:{opacity:.7}}]},b=["children","language","theme","Prism","padding","noWrapper","noWrap","className","style"],C=e=>{let{children:r,language:n="jsx",theme:l=f,Prism:o=u,padding:c=10,noWrapper:s,noWrap:i,className:p,style:d}=e,h=y(e,b);/*#__PURE__*/return t.createElement(m,{code:r||"",language:n,Prism:o,theme:l},({className:e,style:r,tokens:n,getLineProps:l,getTokenProps:o})=>{const m=n.map((e,r)=>/*#__PURE__*/t.createElement(a,{key:r},/*#__PURE__*/t.createElement("span",l({line:e}),e.map((e,r)=>/*#__PURE__*/t.createElement("span",o({token:e,key:r})))),"\\n"));return s?m:/*#__PURE__*/t.createElement("pre",g({className:p?:e,style:g({},r,{margin:0,padding:c,whiteSpace:i?"pre":"pre-wrap"},d)},h),m)})},v=["defaultValue","value","language","theme","Prism","highlight","padding","onChange"],E=e=>{let{defaultValue:n,value:a,language:s="jsx",theme:i=f,Prism:m,highlight:u,padding:d=10,onChange:h}=e,b=y(e,v);const[E,P]=r(n||""),k=void 0!==a,W=l(e=>/*#__PURE__*/t.createElement(C,{language:s,theme:i,Prism:m,noWrapper:!0},e),[s,i,m]),j=o(h);j.current=h;const x=l(e=>{k||P(e),null==j.current||j.current(e)},[k]),O=c(()=>g({},i.plain,b.style),[i.plain,b.style]);/*#__PURE__*/return t.createElement(p,g({},b,{highlight:u||W,padding:d,value:k?a:E,onValueChange:x,style:O}))},P=s({}),k=()=>i(P),W=["children","code","language","theme"],j=e=>{let{children:r,code:n="",language:a="jsx",theme:l=f}=e,o=y(e,W);const{element:c,error:s,code:i,onChange:p}=h(g({initialCode:n},o));/*#__PURE__*/return t.createElement(P.Provider,{value:{element:c,error:s,code:i,onChange:p,language:a,theme:l}},r)},x=e=>{const{code:r,language:n,theme:a,onChange:l}=k();/*#__PURE__*/return t.createElement(E,g({value:r,language:n,theme:a,onChange:l},e))},O=["Component"],w=e=>{let{Component:r="div"}=e,n=y(e,O);const{element:a}=k();/*#__PURE__*/return t.createElement(r,n,a)},N=e=>{const{error:r}=k();return r?/*#__PURE__*/t.createElement("pre",e,r):/*#__PURE__*/t.createElement(t.Fragment,null)};export{C as CodeBlock,E as CodeEditor,P as LiveContext,x as LiveEditor,N as LiveError,w as LivePreview,j as LiveProvider,f as defaultTheme,k as useLiveContext,h as useLiveRunner};
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

    expectResult(
      'react-simple-code-editor',
      // https://github.com/vikejs/vike/discussions/571#discussioncomment-6137618
      `
            ReferenceError: exports is not defined
                at eval (/Users/xxx/git/xxx/xxx/node_modules/react-simple-code-editor/lib/index.js:64:23)
                at instantiateModule (file:///Users/xxx/git/xxx/xxx/node_modules/vite/dist/node/chunks/dep-e8f070e8.js:54405:15)
            `
    )

    expectResult(
      true,
      // https://github.com/vikejs/vike/discussions/830
      `
        Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
            at renderElement (/home/xxx/Projects/xxx/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:6047:9)
            at renderNodeDestructiveImpl (/home/xxx/Projects/xxx/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:6108:11)
            at renderNodeDestructive (/home/xxx/Projects/xxx/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:6080:14)
            at renderIndeterminateComponent (/home/xxx/Projects/xxx/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:5789:7)
            at renderElement (/home/xxx/Projects/xxx/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:5950:7)
            at renderNodeDestructiveImpl (/home/xxx/Projects/xxx/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:6108:11)
            at renderNodeDestructive (/home/xxx/Projects/xxx/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:6080:14)
            at renderNode (/home/xxx/Projects/xxx/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:6263:12)
            at renderChildrenArray (/home/xxx/Projects/xxx/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:6215:7)
            at renderNodeDestructiveImpl (/home/xxx/Projects/xxx/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:6145:7)
        `
    )

    expectResult(
      true,
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

  it('skips user land errors', () => {
    expectResult(
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

    expectResult(
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

    expectResult(
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

    expectResult(
      false,
      // Package not installed
      `
          Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'aaaa' imported from /home/xxx/projects/vike/xxx/server/index.js
            at new NodeError (node:internal/errors:399:5)
            at packageResolve (node:internal/modules/esm/resolve:889:9)
            at moduleResolve (node:internal/modules/esm/resolve:938:20)
            at defaultResolve (node:internal/modules/esm/resolve:1153:11)
            at nextResolve (node:internal/modules/esm/loader:163:28)
            at ESMLoader.resolve (node:internal/modules/esm/loader:838:30)
            at ESMLoader.getModuleJob (node:internal/modules/esm/loader:424:18)
            at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:77:40)
            at link (node:internal/modules/esm/module_job:76:36) {
          code: 'ERR_MODULE_NOT_FOUND'
        }
        `
    )

    expectResult(
      false,
      // User land ESM error
      `
        ReferenceError: exports is not defined in ES module scope
        This file is being treated as an ES module because it has a '.js' file extension and '/home/xxx/projects/vike/xxx/package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
            at file:///home/xxx/projects/vike/xxx/server/index.js:14:1
            at ModuleJob.run (node:internal/modules/esm/module_job:194:25)
        `
    )
  })

  it('handles edge cases', () => {
    expectResult(
      // Not enough information => is this user land or node_modules/ land?
      false,
      // https://github.com/vitejs/vite/issues/11299
      `
        TypeError: Cannot read properties of undefined (reading 'extendTheme')
            at eval (/home/projects/llqijrlvr.github/src/entry.js:5:35)
            at async instantiateModule (file://file:///home/projects/llqijrlvr.github/node_modules/.pnpm/vite@4.0.0/node_modules/vite/dist/node/chunks/dep-ed9cb113.js:53295:9)
        `
    )
  })

  it("isn't perfect", () => {
    expectResult(
      // Should be `true`: https://github.com/vikejs/vike/discussions/1235#discussioncomment-7586473
      false,
      // https://github.com/vikejs/vike/discussions/1235
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
  })
})

function expectResult(expectedResult: boolean | string, stack: string) {
  const error = { stack }
  const res = isCjsEsmError(error)
  expect(res).toEqual(expectedResult)
}
