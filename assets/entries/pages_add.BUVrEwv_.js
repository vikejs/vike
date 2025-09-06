import{o as a,a as o}from"../chunks/chunk-BQuxccGo.js";import{j as e,b as n}from"../chunks/chunk-COSJmPUs.js";import{L as s}from"../chunks/chunk-BCHPCi_P.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{U as l}from"../chunks/chunk-BpZV3TIq.js";/* empty css                      *//* empty css                      *//* empty css                      */const c=[{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function t(r){const i={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",ol:"ol",p:"p",pre:"pre",span:"span",ul:"ul",...r.components};return e.jsxs(e.Fragment,{children:[e.jsxs(i.p,{children:["The following shows how to add SSR / ",e.jsx(s,{href:"/pre-rendering",children:"pre-rendering (aka SSG)"})," to an existing ",e.jsx(i.a,{href:"https://vitejs.dev",children:"Vite"})," app:"]}),`
`,e.jsxs(i.ul,{children:[`
`,e.jsx(i.li,{children:e.jsx(i.a,{href:"https://github.com/brillout/vite-to-vike",children:"Example of adding SSR/SSG to a Vite + React app"})}),`
`,e.jsx(i.li,{children:e.jsx(i.a,{href:"https://github.com/brillout/vite-to-vike/tree/vue",children:"Example of adding SSR/SSG to a Vite + Vue app"})}),`
`]}),`
`,e.jsx(i.p,{children:"It showcases how to do so in a step-by-step, progressive, and customizable fashion:"}),`
`,e.jsxs(i.ul,{children:[`
`,e.jsx(i.li,{children:"Choose between SSR and pre-rendering (SSG)."}),`
`,e.jsxs(i.li,{children:["With or without ",e.jsx(l,{name:!0,list:["vike-react","vike-vue"]}),"."]}),`
`,e.jsxs(i.li,{children:["With ",e.jsx(s,{href:"/server-routing",children:"Server Routing"})," or ",e.jsx(s,{href:"/client-routing",children:"Client Routing"}),"."]}),`
`,e.jsx(i.li,{children:"Progressively migrate towards the stack you (eventually) want."}),`
`]}),`
`,e.jsxs(i.p,{children:["You can choose whether you want to migrate towards a full-fledged SSR/SSG framework DX (like Next.js and Nuxt by using ",e.jsx(l,{name:!0}),"), or add a minimal SSR/SSG implementation (applying a minimal amount of changes to your existing code), or something in-between."]}),`
`,e.jsx(i.p,{children:"This way, you can move quickly while progressively choosing your stack as you go."}),`
`,e.jsx(i.p,{children:"On a high-level, this is how you add Vike to your existing Vite app:"}),`
`,e.jsxs(i.ol,{children:[`
`,e.jsxs(i.li,{children:[`
`,e.jsxs(i.p,{children:["Add Vike to your ",e.jsx(i.code,{children:"vite.config.js"}),"."]}),`
`,e.jsxs(i.ul,{children:[`
`,e.jsxs(i.li,{children:["Example: ",e.jsx(n,{path:"/packages/create-vike-core/boilerplate-react/vite.config.js"})]}),`
`]}),`
`]}),`
`,e.jsxs(i.li,{children:[`
`,e.jsx(i.p,{children:"Use Vike's CLI instead of Vite's CLI."}),`
`,e.jsx(i.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(i.pre,{className:"has-diff",style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"json5","data-theme":"github-light",children:e.jsxs(i.code,{"data-language":"json5","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(i.span,{"data-line":"",children:e.jsx(i.span,{style:{color:"#6A737D"},children:"// package.json"})}),`
`,e.jsx(i.span,{"data-line":"",children:e.jsx(i.span,{style:{color:"#24292E"},children:"{"})}),`
`,e.jsxs(i.span,{"data-line":"",children:[e.jsx(i.span,{style:{color:"#032F62"},children:'  "scripts"'}),e.jsx(i.span,{style:{color:"#24292E"},children:": {"})]}),`
`,e.jsxs(i.span,{className:"diff remove","data-line":"",children:[e.jsx(i.span,{style:{color:"#032F62"},children:'    "dev"'}),e.jsx(i.span,{style:{color:"#24292E"},children:": "}),e.jsx(i.span,{style:{color:"#032F62"},children:'"vite"'}),e.jsx(i.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(i.span,{className:"diff add","data-line":"",children:[e.jsx(i.span,{style:{color:"#032F62"},children:'    "dev"'}),e.jsx(i.span,{style:{color:"#24292E"},children:": "}),e.jsx(i.span,{style:{color:"#032F62"},children:'"vike dev"'}),e.jsx(i.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(i.span,{className:"diff remove","data-line":"",children:[e.jsx(i.span,{style:{color:"#032F62"},children:'    "build"'}),e.jsx(i.span,{style:{color:"#24292E"},children:": "}),e.jsx(i.span,{style:{color:"#032F62"},children:'"vite build"'}),e.jsx(i.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(i.span,{className:"diff add","data-line":"",children:[e.jsx(i.span,{style:{color:"#032F62"},children:'    "build"'}),e.jsx(i.span,{style:{color:"#24292E"},children:": "}),e.jsx(i.span,{style:{color:"#032F62"},children:'"vike build"'}),e.jsx(i.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(i.span,{className:"diff remove","data-line":"",children:[e.jsx(i.span,{style:{color:"#032F62"},children:'    "preview"'}),e.jsx(i.span,{style:{color:"#24292E"},children:": "}),e.jsx(i.span,{style:{color:"#032F62"},children:'"vite preview"'}),e.jsx(i.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(i.span,{className:"diff add","data-line":"",children:[e.jsx(i.span,{style:{color:"#032F62"},children:'    "preview"'}),e.jsx(i.span,{style:{color:"#24292E"},children:": "}),e.jsx(i.span,{style:{color:"#032F62"},children:'"vike preview"'}),e.jsx(i.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(i.span,{"data-line":"",children:e.jsx(i.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(i.span,{"data-line":"",children:e.jsx(i.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`]}),`
`,e.jsxs(i.li,{children:[`
`,e.jsx(i.p,{children:"Either:"}),`
`,e.jsxs(i.ul,{children:[`
`,e.jsxs(i.li,{children:["Enable pre-rendering, or",`
`,e.jsxs(i.blockquote,{children:[`
`,e.jsxs(i.p,{children:["See ",e.jsx(s,{href:"/pre-rendering"})]}),`
`]}),`
`]}),`
`,e.jsxs(i.li,{children:["add a ",e.jsx(s,{href:"/express",children:"Express.js"}),"/",e.jsx(s,{href:"/hono",children:"Hono"}),"/",e.jsx(s,{href:"/fastify",children:"Fastify"}),"/",e.jsx(s,{href:"/vike-server",children:"..."})," server (or add ",e.jsx(s,{href:"/renderPage",children:"Vike's server middleware"})," if you already have one).",`
`,e.jsxs(i.blockquote,{children:[`
`,e.jsxs(i.p,{children:["Example: ",e.jsx(n,{path:"/packages/create-vike-core/boilerplate-react/server/index.js"})]}),`
`]}),`
`]}),`
`]}),`
`]}),`
`,e.jsxs(i.li,{children:[`
`,e.jsx(i.p,{children:"Either:"}),`
`,e.jsxs(i.ul,{children:[`
`,e.jsxs(i.li,{children:["Use ",e.jsx(l,{name:!0}),", or"]}),`
`,e.jsxs(i.li,{children:["define ",e.jsx(s,{href:"/onAfterRenderClient",children:e.jsx(i.code,{children:"+onRenderClient.js"})})," and ",e.jsx(s,{href:"/onRenderHtml",children:e.jsx(i.code,{children:"+onRenderHtml.js"})}),".",`
`,e.jsxs(i.blockquote,{children:[`
`,e.jsx(i.p,{children:"Examples:"}),`
`,e.jsxs(i.ul,{children:[`
`,e.jsxs(i.li,{children:[`
`,e.jsx(n,{text:"Vue",path:"/packages/create-vike-core/boilerplate-vue/renderer/"}),`
`]}),`
`,e.jsxs(i.li,{children:[`
`,e.jsx(n,{text:"Vue + TypeScript",path:"/packages/create-vike-core/boilerplate-vue-ts/renderer/"}),`
`]}),`
`,e.jsxs(i.li,{children:[`
`,e.jsx(n,{text:"React",path:"/packages/create-vike-core/boilerplate-react/renderer/"}),`
`]}),`
`,e.jsxs(i.li,{children:[`
`,e.jsx(n,{text:"React + TypeScript",path:"/packages/create-vike-core/boilerplate-react-ts/renderer/"}),`
`]}),`
`]}),`
`]}),`
`]}),`
`]}),`
`]}),`
`,e.jsxs(i.li,{children:[`
`,e.jsxs(i.p,{children:["Create your first ",e.jsx(s,{href:"/Page",children:e.jsx(i.code,{children:"+Page.js"})})," file."]}),`
`,e.jsxs(i.blockquote,{children:[`
`,e.jsx(i.p,{children:"Examples:"}),`
`,e.jsxs(i.ul,{children:[`
`,e.jsxs(i.li,{children:[`
`,e.jsx(n,{text:"Vue",path:"/packages/create-vike-core/boilerplate-vue/pages/index/+Page.vue"}),`
`]}),`
`,e.jsxs(i.li,{children:[`
`,e.jsx(n,{text:"Vue + TypeScript",path:"/packages/create-vike-core/boilerplate-vue-ts/pages/index/+Page.vue"}),`
`]}),`
`,e.jsxs(i.li,{children:[`
`,e.jsx(n,{text:"React",path:"/packages/create-vike-core/boilerplate-react/pages/index/+Page.jsx"}),`
`]}),`
`,e.jsxs(i.li,{children:[`
`,e.jsx(n,{text:"React + TypeScript",path:"/packages/create-vike-core/boilerplate-react-ts/pages/index/+Page.tsx"}),`
`]}),`
`]}),`
`]}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(i.ul,{children:[`
`,e.jsxs(i.li,{children:[`
`,e.jsx(s,{href:"/new"}),`
`]}),`
`,e.jsxs(i.li,{children:[`
`,e.jsx(s,{href:"/new/core"}),`
`]}),`
`,e.jsx(i.li,{children:e.jsxs(i.a,{href:"https://github.com/vikejs/vike/tree/main/examples/react-minimal",children:["GitHub > ",e.jsx(i.code,{children:"vikejs/vike"})," > ",e.jsx(i.code,{children:"examples/react-minimal"})]})}),`
`,e.jsx(i.li,{children:e.jsxs(i.a,{href:"https://github.com/vikejs/vike/tree/main/examples/react-full",children:["GitHub > ",e.jsx(i.code,{children:"vikejs/vike"})," > ",e.jsx(i.code,{children:"examples/react-full"})]})}),`
`,e.jsx(i.li,{children:e.jsxs(i.a,{href:"https://github.com/vikejs/vike/tree/main/examples/vue-minimal",children:["GitHub > ",e.jsx(i.code,{children:"vikejs/vike"})," > ",e.jsx(i.code,{children:"examples/vue-minimal"})]})}),`
`,e.jsx(i.li,{children:e.jsxs(i.a,{href:"https://github.com/vikejs/vike/tree/main/examples/vue-full",children:["GitHub > ",e.jsx(i.code,{children:"vikejs/vike"})," > ",e.jsx(i.code,{children:"examples/vue-full"})]})}),`
`,e.jsx(i.li,{children:e.jsxs(i.a,{href:"https://github.com/vikejs/vike/tree/main/packages/create-vike-core/boilerplate-react",children:["GitHub > ",e.jsx(i.code,{children:"vikejs/vike"})," > ",e.jsx(i.code,{children:"packages/create-vike-core/boilerplate-react"})]})}),`
`,e.jsx(i.li,{children:e.jsxs(i.a,{href:"https://github.com/vikejs/vike/tree/main/packages/create-vike-core/boilerplate-react-ts",children:["GitHub > ",e.jsx(i.code,{children:"vikejs/vike"})," > ",e.jsx(i.code,{children:"packages/create-vike-core/boilerplate-react-ts"})]})}),`
`,e.jsx(i.li,{children:e.jsxs(i.a,{href:"https://github.com/vikejs/vike/tree/main/packages/create-vike-core/boilerplate-vue",children:["GitHub > ",e.jsx(i.code,{children:"vikejs/vike"})," > ",e.jsx(i.code,{children:"packages/create-vike-core/boilerplate-vue"})]})}),`
`,e.jsx(i.li,{children:e.jsxs(i.a,{href:"https://github.com/vikejs/vike/tree/main/packages/create-vike-core/boilerplate-vue-ts",children:["GitHub > ",e.jsx(i.code,{children:"vikejs/vike"})," > ",e.jsx(i.code,{children:"packages/create-vike-core/boilerplate-vue-ts"})]})}),`
`]})]})}function d(r={}){const{wrapper:i}=r.components||{};return i?e.jsx(i,{...r,children:e.jsx(t,{...r})}):t(r)}const h=Object.freeze(Object.defineProperty({__proto__:null,default:d,pageSectionsExport:c},Symbol.toStringTag,{value:"Module"})),R={serverOnlyHooks:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:a}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/add/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:h}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{R as configValuesSerialized};
