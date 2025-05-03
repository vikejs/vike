import{j as e,b as o,i as t,L as s,o as a}from"../chunks/chunk-BQSxdChQ.js";import{L as n}from"../chunks/chunk-DqWfkHoE.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-DHRxp7Fa.js";import{E as d}from"../chunks/chunk-XAkNSdBp.js";/* empty css                      *//* empty css                      *//* empty css                      */const c=[{pageSectionId:"examples",pageSectionLevel:2,pageSectionTitle:"Examples"},{pageSectionId:"wrangler",pageSectionLevel:2,pageSectionTitle:"Wrangler"},{pageSectionId:"vite-plugin-cloudflare",pageSectionLevel:2,pageSectionTitle:"vite-plugin-cloudflare"},{pageSectionId:"extend-1mb-limit",pageSectionLevel:2,pageSectionTitle:"Extend 1MB limit"},{pageSectionId:"cloudflare-pages",pageSectionLevel:2,pageSectionTitle:"Cloudflare Pages"},{pageSectionId:"development",pageSectionLevel:2,pageSectionTitle:"Development"},{pageSectionId:"universal-fetch",pageSectionLevel:2,pageSectionTitle:"Universal `fetch()`"}];function i(l){const r={a:"a",blockquote:"blockquote",code:"code",li:"li",p:"p",ul:"ul",...l.components};return e.jsxs(e.Fragment,{children:[e.jsxs(r.p,{children:["Deploying to ",e.jsx(r.a,{href:"https://workers.cloudflare.com",children:"Cloudflare Workers"}),"."]}),`
`,e.jsxs(r.blockquote,{children:[`
`,e.jsxs(r.p,{children:["For a much improved DX, instead of directly using Cloudflare Workers, we recommend using ",e.jsx(n,{href:"/cloudflare-pages#full-stack",doNotInferSectionTitle:!0}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"examples",children:"Examples"}),`
`,e.jsxs(r.ul,{children:[`
`,e.jsxs(r.li,{children:["React: ",e.jsx(o,{path:"/examples/cloudflare-workers-react/"})]}),`
`,e.jsxs(r.li,{children:["React + SSR Streaming: ",e.jsx(o,{path:"/examples/cloudflare-workers-react-full/"})]}),`
`,e.jsxs(r.li,{children:["Vue: ",e.jsx(o,{path:"/examples/cloudflare-workers-vue/"})]}),`
`]}),`
`,e.jsx("h2",{id:"wrangler",children:"Wrangler"}),`
`,e.jsx(r.p,{children:"Cloudflare Workers requires your entire worker code to be bundled into a single file."}),`
`,e.jsxs(r.blockquote,{children:[`
`,e.jsx(r.p,{children:'Cloudflare uses the term "worker code" to denote server code that is run on its edge infrastructure.'}),`
`]}),`
`,e.jsxs(r.p,{children:["We recommend using ",e.jsx(r.a,{href:"https://github.com/cloudflare/wrangler2",children:"Wrangler v2"})," (the v2 uses ",e.jsx(r.a,{href:"https://esbuild.github.io/",children:"esbuild"})," under the hood)."]}),`
`,e.jsx("h2",{id:"vite-plugin-cloudflare",children:"vite-plugin-cloudflare"}),`
`,e.jsxs(r.p,{children:["You can also use ",e.jsx(r.a,{href:"https://github.com/Aslemammad/vite-plugin-cloudflare",children:"vite-plugin-cloudflare"})," which enables you to simply use ",e.jsx(r.code,{children:"$ vike build"})," and ",e.jsx(r.code,{children:"$ vike dev"})," to build and develop your worker code (including HMR support!)."]}),`
`,e.jsxs(r.p,{children:["Example: ",e.jsxs(r.a,{href:"https://github.com/Aslemammad/vite-plugin-cloudflare/tree/main/examples/vite-plugin-ssr",children:["GitHub > ",e.jsx(r.code,{children:"Aslemammad/vite-plugin-cloudflare"})," > ",e.jsx(r.code,{children:"examples/vite-plugin-ssr/"})]}),"."]}),`
`,e.jsxs(r.blockquote,{children:[`
`,e.jsxs(r.p,{children:["vite-plugin-ssr was the ",e.jsx(r.a,{href:"https://vite-plugin-ssr.com/vike",children:"previous name of Vike"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"extend-1mb-limit",children:"Extend 1MB limit"}),`
`,e.jsx(r.p,{children:"The bundle size of your worker should not exceed 1MB, but you can request sizes of up to 100MB and beyond:"}),`
`,e.jsxs(r.ul,{children:[`
`,e.jsx(r.li,{children:e.jsx(r.a,{href:"https://www.cloudflare.com/larger-scripts-on-workers-early-access/",children:"Cloudflare Workers > Larger Scripts"})}),`
`,e.jsx(r.li,{children:e.jsx(r.a,{href:"https://developers.cloudflare.com/workers/platform/limits/#worker-size",children:"Cloudflare Workers > Limits > Worker Size"})}),`
`]}),`
`,e.jsx("h2",{id:"cloudflare-pages",children:"Cloudflare Pages"}),`
`,e.jsxs(r.p,{children:["You can also use ",e.jsx(r.a,{href:"https://developers.cloudflare.com/pages/",children:"Cloudflare Pages"})," to deploy your Vike app."]}),`
`,e.jsxs(r.p,{children:["To deploy your SSR worker use a ",e.jsx(r.a,{href:"https://developers.cloudflare.com/pages/platform/functions/",children:"Cloudflare Pages Function"}),"."]}),`
`,e.jsx(r.p,{children:"Example:"}),`
`,e.jsxs(r.ul,{children:[`
`,e.jsxs(r.li,{children:[`
`,e.jsx(d,{timestamp:"2022.04",repo:"Immortalin/vite-plugin-ssr-cloudflare-pages-demo"}),`
`]}),`
`]}),`
`,e.jsxs(r.blockquote,{children:[`
`,e.jsxs(r.p,{children:["vite-plugin-ssr was the ",e.jsx(r.a,{href:"https://vite-plugin-ssr.com/vike",children:"previous name of Vike"}),"."]}),`
`]}),`
`,e.jsx(r.p,{children:"See also:"}),`
`,e.jsxs(r.ul,{children:[`
`,e.jsx(r.li,{children:e.jsx(r.a,{href:"https://blog.cloudflare.com/wrangler-v2-beta/",children:"Wrangler 2.0 — a new developer experience for Cloudflare Workers"})}),`
`]}),`
`,e.jsx("h2",{id:"development",children:"Development"}),`
`,e.jsx(r.p,{children:"For a significantly faster development experience, we recommend, whenever possible, using Vite's development server instead of wrangler (or an Express.js server)."}),`
`,e.jsx(r.p,{children:"This means:"}),`
`,e.jsxs(r.ul,{children:[`
`,e.jsxs(r.li,{children:["Skip ",e.jsx(r.code,{children:"wrangler"})," / Cloudflare Workers altogether while developing your app."]}),`
`,e.jsxs(r.li,{children:["Use ",e.jsx(r.code,{children:"wrangler dev"})," to preview your worker."]}),`
`,e.jsxs(r.li,{children:["Use ",e.jsx(r.code,{children:"wrangler publish"})," to deploy your worker to Cloudflare Workers."]}),`
`]}),`
`,e.jsxs(r.p,{children:["See the setup of the ",e.jsx(r.a,{href:"#examples",children:"examples"}),"."]}),`
`,e.jsxs("h2",{id:"universal-fetch",children:["Universal ",e.jsx("code",{children:"fetch()"})]}),`
`,e.jsxs(r.p,{children:["When using Node.js for development and Cloudflare Workers for production, you may need a ",e.jsx(r.code,{children:"fetch()"})," function that works in both environments."]}),`
`,e.jsxs(r.p,{children:["But libraries such as ",e.jsx(r.code,{children:"node-fetch"})," or ",e.jsx(r.code,{children:"cross-fetch"})," typically don't work with Cloudflare Workers."]}),`
`,e.jsxs(r.p,{children:["What you can do is to define a fetch function at ",e.jsx(r.code,{children:"pageContext.fetch"}),` that works in all environments.
The trick is to add a different `,e.jsx(r.code,{children:"fetch()"})," implementation to ",e.jsx(r.code,{children:"pageContextInit"})," at ",e.jsx(n,{text:e.jsx(r.code,{children:"renderPage(pageContextInit)"}),href:"/renderPage"}),"."]}),`
`,e.jsxs(r.p,{children:["Example: ",e.jsx(o,{path:"/examples/cloudflare-workers-react-full#universal-fetch"}),"."]})]})}function p(l={}){const{wrapper:r}=l.components||{};return r?e.jsx(r,{...l,children:e.jsx(i,{...l})}):i(l)}const u=Object.freeze(Object.defineProperty({__proto__:null,default:p,pageSectionsExport:c},Symbol.toStringTag,{value:"Module"})),E={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:a}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/cloudflare-workers/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:u}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:s}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:t}}};export{E as configValuesSerialized};
