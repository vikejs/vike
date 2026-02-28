import{o as r,a}from"../chunks/chunk-CxIOOiKX.js";import{j as e}from"../chunks/chunk-B35a6FX-.js";import{L as d}from"../chunks/chunk-BbfG-aTg.js";/* empty css                      */import{W as c}from"../chunks/chunk-4VEk4LmV.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as o}from"../chunks/chunk-CJvpbNqo.js";import{U as h}from"../chunks/chunk-Dz_a-sZe.js";import{C as p}from"../chunks/chunk-Xc0ZlJJz.js";import{E as i}from"../chunks/chunk-C63C6Qu-.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */const x=[{pageSectionId:"examples",pageSectionLevel:2,pageSectionTitle:"Examples"},{pageSectionId:"process-env-nextauth-url",pageSectionLevel:2,pageSectionTitle:"`process.env.NEXTAUTH_URL`"},{pageSectionId:"fetch-polyfill-for-getsession",pageSectionLevel:2,pageSectionTitle:"Fetch polyfill for `getSession()`"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function t(n){const s={a:"a",blockquote:"blockquote",code:"code",div:"div",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...o(),...n.components},{ChoiceGroup:l}=s;return l||u("ChoiceGroup"),e.jsxs(e.Fragment,{children:[e.jsx(p,{url:"https://authjs.dev"}),`
`,e.jsx(h,{children:"Auth.js (previously known as NextAuth.js)"}),`
`,e.jsx("h2",{id:"examples",children:"Examples"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(i,{timestamp:"2022.07",repo:"iMrDJAi/vps-nextauth-example"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(i,{timestamp:"2021.07",repo:"s-kris/vite-ssr-next-auth"}),`
`]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["vite-plugin-ssr was the ",e.jsx(s.a,{href:"https://vite-plugin-ssr.com/vike",children:"previous name of Vike"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"process-env-nextauth-url",children:e.jsx("code",{children:"process.env.NEXTAUTH_URL"})}),`
`,e.jsxs(s.p,{children:["To access environment variables on the client-side, such as ",e.jsx(s.code,{children:"process.env.NEXTAUTH_URL"}),`, we can use
`,e.jsx(s.a,{href:"https://vitejs.dev/config/#define",children:e.jsx(s.code,{children:"vite.config.js#define"})}),`
or
`,e.jsx(s.a,{href:"https://vitejs.dev/config/#envprefix",children:e.jsx(s.code,{children:"vite.config.js#envPrefix"})}),"."]}),`
`,e.jsxs(c,{children:["Don't add ",e.jsx(s.code,{children:"NEXTAUTH_"})," to ",e.jsx(s.code,{children:"envPrefix"})," as it would leak ",e.jsx(s.code,{children:"NEXTAUTH_SECRET"}),"."]}),`
`,e.jsx(s.p,{children:"See also:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://vitejs.dev/config/#environment-variables",children:"Vite > Config > Environment Variables"})}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["We can use ",e.jsx(s.code,{children:"process.env"})," as usual for server (e.g. Express.js) code. (Since ",e.jsx(s.a,{href:"https://github.com/vikejs/vike/issues/562",children:"server code isn't processed by Vite"}),".)"]}),`
`]}),`
`,e.jsxs("h2",{id:"fetch-polyfill-for-getsession",children:["Fetch polyfill for ",e.jsx("code",{children:"getSession()"})]}),`
`,e.jsxs(s.p,{children:["In order to use Auth.js's ",e.jsx(s.a,{href:"https://authjs.dev/reference/utilities/#getsession",children:e.jsx(s.code,{children:"getSession()"})})," on the server-side, we need to globally install a fetch polyfill."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["A polyfill isn't needed if we use ",e.jsx(s.code,{children:"getSession()"})," only on the client-side, or if we use Node.js 18 which ",e.jsxs(s.a,{href:"https://nodejs.org/en/blog/announcements/v18-release-announce/#fetch-experimental",children:["natively supports ",e.jsx(s.code,{children:"fetch()"})]}),"."]}),`
`]}),`
`,e.jsxs(s.p,{children:["We can use ",e.jsxs(s.a,{href:"https://github.com/node-fetch/node-fetch#providing-global-access",children:[e.jsx(s.code,{children:"node-fetch"})," to patch the global object"]}),":"]}),`
`,e.jsxs(l,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",hide:!0,children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// server.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Only install the polyfill on the server (e.g. Express.js). Browsers already implement"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// `fetch()` natively and it would be wasteful to load the polyfill on the browser-side."})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:'// Use node-fetch@2 instead of node-fetch@3 if your `package.json#type` isn\'t `"module"`.'})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Or some other `fetch()` polyfill, e.g. `cross-fetch`."})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" fetch, { Headers, Request, Response } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'node-fetch'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"if"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("}),e.jsx(s.span,{style:{color:"#D73A49"},children:"!"}),e.jsx(s.span,{style:{color:"#24292E"},children:"globalThis.fetch) {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  globalThis.fetch "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" fetch"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  globalThis.Headers "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" Headers"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  globalThis.Request "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" Request"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  globalThis.Response "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" Response"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// server.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Only install the polyfill on the server (e.g. Express.js). Browsers already implement"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// `fetch()` natively and it would be wasteful to load the polyfill on the browser-side."})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:'// Use node-fetch@2 instead of node-fetch@3 if your `package.json#type` isn\'t `"module"`.'})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Or some other `fetch()` polyfill, e.g. `cross-fetch`."})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" fetch, { Headers, Request, Response } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'node-fetch'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"if"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("}),e.jsx(s.span,{style:{color:"#D73A49"},children:"!"}),e.jsx(s.span,{style:{color:"#24292E"},children:"globalThis.fetch) {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  globalThis.fetch "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" fetch"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  globalThis.Headers "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" Headers"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  globalThis.Request "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" Request"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  globalThis.Response "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" Response"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})})]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(d,{href:"/auth"}),`
`]}),`
`]})]})}function j(n={}){const{wrapper:s}={...o(),...n.components};return s?e.jsx(s,{...n,children:e.jsx(t,{...n})}):t(n)}function u(n,s){throw new Error("Expected component `"+n+"` to be defined: you likely forgot to import, pass, or provide it.")}const f=Object.freeze(Object.defineProperty({__proto__:null,default:j,pageSectionsExport:x},Symbol.toStringTag,{value:"Module"})),N={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:a}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:r}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/AuthJS/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:f}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{N as configValuesSerialized};
