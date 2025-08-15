import{o as i,a as o}from"../chunks/chunk-Dt87FEO1.js";import{j as e}from"../chunks/chunk-kyZV5qjS.js";import{L as r}from"../chunks/chunk-CPSo54Vd.js";/* empty css                      */import{W as a}from"../chunks/chunk-D5LEB8u3.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{U as d}from"../chunks/chunk-DE4l8XbL.js";import{C as c}from"../chunks/chunk-OURw7ITu.js";import{E as l}from"../chunks/chunk-DHf31EOY.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */const h=[{pageSectionId:"examples",pageSectionLevel:2,pageSectionTitle:"Examples"},{pageSectionId:"process-env-nextauth-url",pageSectionLevel:2,pageSectionTitle:"`process.env.NEXTAUTH_URL`"},{pageSectionId:"fetch-polyfill-for-getsession",pageSectionLevel:2,pageSectionTitle:"Fetch polyfill for `getSession()`"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function t(n){const s={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(c,{url:"https://authjs.dev"}),`
`,e.jsx(d,{children:"Auth.js (previously known as NextAuth.js)"}),`
`,e.jsx("h2",{id:"examples",children:"Examples"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{timestamp:"2022.07",repo:"iMrDJAi/vps-nextauth-example"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{timestamp:"2021.07",repo:"s-kris/vite-ssr-next-auth"}),`
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
`,e.jsxs(a,{children:["Don't add ",e.jsx(s.code,{children:"NEXTAUTH_"})," to ",e.jsx(s.code,{children:"envPrefix"})," as it would leak ",e.jsx(s.code,{children:"NEXTAUTH_SECRET"}),"."]}),`
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
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// server.ts"})}),`
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
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(r,{href:"/auth"}),`
`]}),`
`]})]})}function p(n={}){const{wrapper:s}=n.components||{};return s?e.jsx(s,{...n,children:e.jsx(t,{...n})}):t(n)}const x=Object.freeze(Object.defineProperty({__proto__:null,default:p,pageSectionsExport:h},Symbol.toStringTag,{value:"Module"})),P={serverOnlyHooks:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:i}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/AuthJS/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:x}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{P as configValuesSerialized};
