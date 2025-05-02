import{j as e,b as i,i as a,L as o,o as d}from"../chunks/chunk-DsUGhAdV.js";import{L as n}from"../chunks/chunk-B74EZ2O7.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-BTRB94Nx.js";import{U as r}from"../chunks/chunk-Bsw6VKyD.js";/* empty css                      *//* empty css                      *//* empty css                      */const c=[{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function t(l){const s={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",ol:"ol",p:"p",pre:"pre",span:"span",ul:"ul",...l.components};return e.jsxs(e.Fragment,{children:[e.jsxs(s.p,{children:["The following shows how to add SSR / ",e.jsx(n,{href:"/pre-rendering",children:"pre-rendering (aka SSG)"})," to an existing ",e.jsx(s.a,{href:"https://vitejs.dev",children:"Vite"})," app:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/brillout/vite-to-vike",children:"Example of adding SSR/SSG to a Vite + React app"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/brillout/vite-to-vike/tree/vue",children:"Example of adding SSR/SSG to a Vite + Vue app"})}),`
`]}),`
`,e.jsx(s.p,{children:"It showcases how to do so in a step-by-step, progressive, and customizable fashion:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"Choose between SSR and pre-rendering (SSG)."}),`
`,e.jsxs(s.li,{children:["With or without ",e.jsx(r,{name:!0,list:["vike-react","vike-vue"]}),"."]}),`
`,e.jsxs(s.li,{children:["With ",e.jsx(n,{href:"/server-routing",children:"Server Routing"})," or ",e.jsx(n,{href:"/client-routing",children:"Client Routing"}),"."]}),`
`,e.jsx(s.li,{children:"Progressively migrate towards the stack you (eventually) want."}),`
`]}),`
`,e.jsxs(s.p,{children:["You can choose whether you want to migrate towards a full-fledged SSR/SSG framework DX (like Next.js and Nuxt by using ",e.jsx(r,{name:!0}),"), or add a minimal SSR/SSG implementation (applying a minimal amount of changes to your existing code), or something in-between."]}),`
`,e.jsx(s.p,{children:"This way, you can move quickly while progressively choosing your stack as you go."}),`
`,e.jsx(s.p,{children:"On a high-level, this is how you add Vike to your existing Vite app:"}),`
`,e.jsxs(s.ol,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsxs(s.p,{children:["Add Vike to your ",e.jsx(s.code,{children:"vite.config.js"}),"."]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Example: ",e.jsx(i,{path:"/boilerplates/boilerplate-react/vite.config.js"})]}),`
`]}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(s.p,{children:"Use Vike's CLI instead of Vite's CLI."}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"json5","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"json5","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// package.json"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"{"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:'  "scripts"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": {"})]}),`
`,e.jsxs(s.span,{className:"diff remove","data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:'    "dev"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"vite"'}),e.jsx(s.span,{style:{color:"#24292E"},children:", "})]}),`
`,e.jsxs(s.span,{className:"diff add","data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:'    "dev"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"vike dev"'}),e.jsx(s.span,{style:{color:"#24292E"},children:", "})]}),`
`,e.jsxs(s.span,{className:"diff remove","data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:'    "build"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"vite build"'}),e.jsx(s.span,{style:{color:"#24292E"},children:", "})]}),`
`,e.jsxs(s.span,{className:"diff add","data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:'    "build"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"vike build"'}),e.jsx(s.span,{style:{color:"#24292E"},children:", "})]}),`
`,e.jsxs(s.span,{className:"diff remove","data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:'    "preview"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"vite preview"'}),e.jsx(s.span,{style:{color:"#24292E"},children:", "})]}),`
`,e.jsxs(s.span,{className:"diff add","data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:'    "preview"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"vike preview"'}),e.jsx(s.span,{style:{color:"#24292E"},children:", "})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(s.p,{children:"Either:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Enable pre-rendering, or",`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["See ",e.jsx(n,{href:"/pre-rendering"})]}),`
`]}),`
`]}),`
`,e.jsxs(s.li,{children:["add a ",e.jsx(n,{href:"/express",children:"Express.js"}),"/",e.jsx(n,{href:"/hono",children:"Hono"}),"/",e.jsx(n,{href:"/fastify",children:"Fastify"}),"/",e.jsx(n,{href:"/server",children:"..."})," server (or add ",e.jsx(n,{href:"/renderPage",children:"Vike's server middleware"})," if you already have one).",`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["Example: ",e.jsx(i,{path:"/boilerplates/boilerplate-react/server/index.js"})]}),`
`]}),`
`]}),`
`]}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(s.p,{children:"Either:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Use ",e.jsx(r,{name:!0}),", or"]}),`
`,e.jsxs(s.li,{children:["define ",e.jsx(n,{href:"/onAfterRenderClient",children:e.jsx(s.code,{children:"+onRenderClient.js"})})," and ",e.jsx(n,{href:"/onRenderHtml",children:e.jsx(s.code,{children:"+onRenderHtml.js"})}),".",`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"Examples:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(i,{text:"Vue",path:"/boilerplates/boilerplate-vue/renderer/"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(i,{text:"Vue + TypeScript",path:"/boilerplates/boilerplate-vue-ts/renderer/"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(i,{text:"React",path:"/boilerplates/boilerplate-react/renderer/"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(i,{text:"React + TypeScript",path:"/boilerplates/boilerplate-react-ts/renderer/"}),`
`]}),`
`]}),`
`]}),`
`]}),`
`]}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsxs(s.p,{children:["Create your first ",e.jsx(n,{href:"/Page",children:e.jsx(s.code,{children:"+Page.js"})})," file."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"Examples:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(i,{text:"Vue",path:"/boilerplates/boilerplate-vue/pages/index/+Page.vue"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(i,{text:"Vue + TypeScript",path:"/boilerplates/boilerplate-vue-ts/pages/index/+Page.vue"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(i,{text:"React",path:"/boilerplates/boilerplate-react/pages/index/+Page.jsx"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(i,{text:"React + TypeScript",path:"/boilerplates/boilerplate-react-ts/pages/index/+Page.tsx"}),`
`]}),`
`]}),`
`]}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/new"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/new/core"}),`
`]}),`
`,e.jsx(s.li,{children:e.jsxs(s.a,{href:"https://github.com/vikejs/vike/tree/main/boilerplates",children:["GitHub > ",e.jsx(s.code,{children:"vikejs/vike"})," > ",e.jsx(s.code,{children:"boilerplates/"})]})}),`
`,e.jsx(s.li,{children:e.jsxs(s.a,{href:"https://github.com/vikejs/vike/tree/main/examples/react-minimal",children:["GitHub > ",e.jsx(s.code,{children:"vikejs/vike"})," > ",e.jsx(s.code,{children:"examples/react-minimal"})]})}),`
`,e.jsx(s.li,{children:e.jsxs(s.a,{href:"https://github.com/vikejs/vike/tree/main/examples/react-full",children:["GitHub > ",e.jsx(s.code,{children:"vikejs/vike"})," > ",e.jsx(s.code,{children:"examples/react-full"})]})}),`
`,e.jsx(s.li,{children:e.jsxs(s.a,{href:"https://github.com/vikejs/vike/tree/main/examples/vue-minimal",children:["GitHub > ",e.jsx(s.code,{children:"vikejs/vike"})," > ",e.jsx(s.code,{children:"examples/vue-minimal"})]})}),`
`,e.jsx(s.li,{children:e.jsxs(s.a,{href:"https://github.com/vikejs/vike/tree/main/examples/vue-full",children:["GitHub > ",e.jsx(s.code,{children:"vikejs/vike"})," > ",e.jsx(s.code,{children:"examples/vue-full"})]})}),`
`]})]})}function h(l={}){const{wrapper:s}=l.components||{};return s?e.jsx(s,{...l,children:e.jsx(t,{...l})}):t(l)}const p=Object.freeze(Object.defineProperty({__proto__:null,default:h,pageSectionsExport:c},Symbol.toStringTag,{value:"Module"})),R={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:d}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/add/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:p}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:a}}};export{R as configValuesSerialized};
