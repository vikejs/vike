import{o as l,a as o}from"../chunks/chunk-eD_Oz-vE.js";import{j as e}from"../chunks/chunk-CC4ltPc3.js";import{L as s}from"../chunks/chunk-DFQUjVEP.js";/* empty css                      */import{W as a}from"../chunks/chunk-BZDWJXvC.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{U as d}from"../chunks/chunk--1n-cdxa.js";import{E as i}from"../chunks/chunk-Dfa3HFPf.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */const c=[{pageSectionId:"api-route",pageSectionLevel:2,pageSectionTitle:"API Route"},{pageSectionId:"vite-plugin-vercel",pageSectionLevel:2,pageSectionTitle:"vite-plugin-vercel"},{pageSectionId:"build-output-api",pageSectionLevel:2,pageSectionTitle:"Build Output API"},{pageSectionId:"data-apis-graphql-restful-rpc",pageSectionLevel:2,pageSectionTitle:"Data APIs (GraphQL, RESTful, RPC)"}];function r(n){const t={a:"a",blockquote:"blockquote",code:"code",li:"li",ol:"ol",p:"p",ul:"ul",...n.components};return e.jsxs(e.Fragment,{children:[e.jsxs(t.p,{children:["You can deploy Vike to ",e.jsx(t.a,{href:"https://vercel.com",children:"Vercel"})," simply by using a Vercel API Route. Alternatively, you can use ",e.jsx(t.code,{children:"vite-plugin-vercel"})," for a full-fledged Vercel integration with ISR and Edge Middlewares."]}),`
`,e.jsxs(t.p,{children:["We recommend using the Vercel API Route technique because it's a simple and sturdy integration. Later, if the need arises, you can switch to ",e.jsx(t.code,{children:"vite-plugin-vercel"}),"."]}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsx(d,{children:"Vercel"}),`
`]}),`
`,e.jsx("h2",{id:"api-route",children:"API Route"}),`
`,e.jsxs(t.p,{children:["You can integrate Vercel simply by creating a Vercel API Route ",e.jsx(t.code,{children:"api/ssr.js"})," that server-side renders your app."]}),`
`,e.jsx(t.p,{children:"Example:"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[`
`,e.jsx(i,{timestamp:"2024.03",repo:"brillout/vike-with-vercel"}),`
`]}),`
`]}),`
`,e.jsxs(a,{children:["Make sure to properly set ",e.jsx(t.code,{children:"OUTPUT DIRECTORY"})," in your Vercel dashboard, see the example's ",e.jsx(t.code,{children:"README.md"})," instructions."]}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsx(t.p,{children:"Using a Vercel API Route is a sturdy way to deploy to Vercel, as API Routes is a core Vercel feature: it's here to stay and, most importantly, stable. (Whereas Vercel's Build Output API is a moving target with occasional breaking changes.) Once you've set the server-side rendering API Route, you can expect it to work for the foreseeable future."}),`
`]}),`
`,e.jsx("h2",{id:"vite-plugin-vercel",children:"vite-plugin-vercel"}),`
`,e.jsxs(t.p,{children:[e.jsx(t.a,{href:"https://github.com/magne4000/vite-plugin-vercel",children:e.jsx(t.code,{children:"vite-plugin-vercel"})})," enables zero-configuration support for all Vercel features, including ",e.jsx(t.a,{href:"https://vercel.com/docs/concepts/incremental-static-regeneration/overview",children:"Incremental Static Regeneration (ISR)"})," and Edge Middlewares."]}),`
`,e.jsxs(t.p,{children:["If you ",e.jsx(s,{text:"pre-render your pages only partially",href:"/prerender#partial"}),", you can also use ",e.jsx(t.code,{children:"vite-plugin-vercel"})," to statically deploy your pre-rendered pages while dynamically serving your non-prerendered pages."]}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsxs(t.p,{children:["See Vike + ",e.jsx(t.code,{children:"vite-plugin-vercel"})," installation instructions at ",e.jsxs(t.a,{href:"https://github.com/magne4000/vite-plugin-vercel#usage-with-vike",children:[e.jsx(t.code,{children:"vite-plugin-vercel"})," > Usage with Vike"]}),"."]}),`
`]}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsxs(t.p,{children:["Under the hood, ",e.jsx(t.code,{children:"vite-plugin-vercel"})," uses Vercel's ",e.jsx(t.a,{href:"https://vercel.com/docs/build-output-api/v3",children:"Build Output API"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"build-output-api",children:"Build Output API"}),`
`,e.jsxs(t.p,{children:["For maximum flexibility and configuration options, you can directly use the ",e.jsx(t.a,{href:"https://vercel.com/docs/build-output-api/v3",children:"Build Output API"}),"."]}),`
`,e.jsx(t.p,{children:"Example:"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[`
`,e.jsx(i,{timestamp:"2022.07",repo:"brillout/vite-plugin-ssr_vercel_build-output-api"}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsxs(t.p,{children:["vite-plugin-ssr was the ",e.jsx(t.a,{href:"https://vite-plugin-ssr.com/vike",children:"previous name of Vike"}),"."]}),`
`]}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"data-apis-graphql-restful-rpc",children:"Data APIs (GraphQL, RESTful, RPC)"}),`
`,e.jsx(t.p,{children:"Vercel API Routes only work on Vercel's platform; you cannot run them locally."}),`
`,e.jsx(t.p,{children:"This means that you need to integrate your data layer twice:"}),`
`,e.jsxs(t.ol,{children:[`
`,e.jsx(t.li,{children:"Using Vercel's API Routes, for Vercel deployment."}),`
`,e.jsx(t.li,{children:"Using a local server (e.g. Express.js), for development."}),`
`]}),`
`,e.jsx(t.p,{children:"This is usually easy to achieve as most data layer tools integrate using a single HTTP endpoint. For example:"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://graphql.org/",children:"GraphQL"})," integrates over a single HTTP endpoint ",e.jsx(t.code,{children:"/graphql"}),"."]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://telefunc.com/",children:"Telefunc"})," integrates over a single HTTP endpoint ",e.jsx(t.code,{children:"/_telefunc"}),"."]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://trpc.io/",children:"tRPC"})," integrates over a single HTTP endpoint as well."]}),`
`]}),`
`,e.jsx(t.p,{children:"In other words, you can add a data layer by:"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsx(t.li,{children:"Creating a new Vercel API Route, integrating that single endpoint."}),`
`,e.jsx(t.li,{children:"Creating a new route to your local development server (e.g. Express.js), integrating that single endpoint."}),`
`]}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsxs(t.p,{children:["When using SSR, we recommend using ",e.jsx(t.a,{href:"https://telefunc.com/RPC-vs-GraphQL-REST",children:"RPC instead of GraphQL"}),", leading to a substantial simplification and increased development speed."]}),`
`]})]})}function p(n={}){const{wrapper:t}=n.components||{};return t?e.jsx(t,{...n,children:e.jsx(r,{...n})}):r(n)}const u=Object.freeze(Object.defineProperty({__proto__:null,default:p,pageSectionsExport:c},Symbol.toStringTag,{value:"Module"})),V={serverOnlyHooks:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:l}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/vercel/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:u}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{V as configValuesSerialized};
