import{o,a as l}from"../chunks/chunk-s_Ka62my.js";import{j as e,b as i}from"../chunks/chunk-C8nyMdhy.js";import{L as n}from"../chunks/chunk-BEJI2KvG.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as a}from"../chunks/chunk-Dmi2Rm13.js";import{U as c}from"../chunks/chunk-DDHIDe0x.js";import{E as d}from"../chunks/chunk-C5hja8qv.js";import{C as h}from"../chunks/chunk-DhqS1gHT.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-Bu7-ihKy.js";import"../chunks/chunk-DTP0COTw.js";const p=[{pageSectionId:"vike-react",pageSectionLevel:2,pageSectionTitle:"`vike-react`"},{pageSectionId:"custom-integration",pageSectionLevel:2,pageSectionTitle:"Custom integration"},{pageSectionId:"react-server-components",pageSectionLevel:2,pageSectionTitle:"React Server Components"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function s(r){const t={a:"a",blockquote:"blockquote",code:"code",li:"li",p:"p",ul:"ul",...a(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx("h2",{id:"vike-react",children:e.jsx("code",{children:"vike-react"})}),`
`,e.jsxs(t.p,{children:["We recommend using ",e.jsx(n,{href:"/vike-react",children:e.jsx(t.code,{children:"vike-react"})})," which integrates ",e.jsx(t.a,{href:"https://react.dev",children:"React"})," in a full-fledged manner."]}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsx(c,{children:e.jsx(t.code,{children:"vike-react"})}),`
`]}),`
`,e.jsxs(t.p,{children:["You can also ",e.jsx(n,{href:"#custom-integration",children:"integrate React yourself"})," if you want full control over the React integration."]}),`
`,e.jsx("h2",{id:"custom-integration",children:"Custom integration"}),`
`,e.jsxs(t.p,{children:["Instead of using ",e.jsx(n,{href:"/vike-react",children:e.jsx(t.code,{children:"vike-react"})}),", you can implement your own React integration, for full control over the integration of React and React libraries."]}),`
`,e.jsx(h,{uiFramework:"react"}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsxs(t.p,{children:["You can use ",e.jsx(n,{href:"/new/core",children:"vike.dev/new/core"})," to scaffold a Vike app showcasing a manual React integration."]}),`
`]}),`
`,e.jsx(t.p,{children:"Official examples:"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(i,{path:"/packages/create-vike-core/boilerplate-react-ts"})," - Classic integration, using ",e.jsx(n,{href:"/client-routing",children:"Client Routing"}),"."]}),`
`,e.jsxs(t.li,{children:[e.jsx(i,{path:"/examples/react-minimal"})," - Minimalistic integration, using ",e.jsx(n,{href:"/server-routing",children:"Server Routing"}),"."]}),`
`,e.jsxs(t.li,{children:[e.jsxs(t.a,{href:"https://github.com/vikejs/vike-react/tree/main/packages/vike-react",children:[e.jsx(t.code,{children:"vike-react"})," source code"]})," - Full-fledged integration."]}),`
`,e.jsxs(t.li,{children:[e.jsx(i,{path:"/examples/render-modes"})," - Integration supporting all ",e.jsx(n,{href:"/render-modes",children:"render modes"})," (SSR, SPA, and HTML-only)."]}),`
`]}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsxs(t.p,{children:["For more official examples, see ",e.jsxs(t.a,{href:"https://github.com/vikejs/vike/tree/main/examples",children:["GitHub > ",e.jsx(t.code,{children:"vikejs/vike"})," > ",e.jsx(t.code,{children:"examples/"})]}),"."]}),`
`]}),`
`,e.jsx(t.p,{children:"Community examples:"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(d,{timestamp:"2023.12",repo:"luisfloat/vike-island-example"})," - ",e.jsx(t.a,{href:"https://jasonformat.com/islands-architecture/",children:"Islands Architecture"})," implementation, mixing React and Vue."]}),`
`]}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsxs(t.p,{children:["For more community examples, see integration guides such as ",e.jsx(n,{href:"/tanstack-query"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"react-server-components",children:"React Server Components"}),`
`,e.jsxs(t.p,{children:[e.jsx(t.a,{href:"https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components",children:"React Server Components (RSC)"})," is a new application architecture designed by the React team."]}),`
`,e.jsx(t.p,{children:"The design can be broken down into three parts:"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsx(t.li,{children:"✅ RPC (Server Actions)"}),`
`,e.jsx(t.li,{children:"✅ Progressive Rendering"}),`
`,e.jsx(t.li,{children:"🚧 Server Components"}),`
`]}),`
`,e.jsxs(t.p,{children:["Vike already supports ",e.jsx(n,{href:"/streaming#progressive-rendering",children:"Progressive Rendering"})," as well as ",e.jsx(n,{href:"/RPC",children:"RPC"}),"."]}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsxs(t.p,{children:["Instead of using ",e.jsxs(t.a,{href:"https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations",children:["Server Actions using ",e.jsx(t.code,{children:"'use server'"})]}),", we recommend using ",e.jsx(t.a,{href:"https://telefunc.com/",children:"Telefunc"})," which we believe to feature a superior design. That said, a ",e.jsx(n,{href:"/vike-react",children:e.jsx(t.code,{children:"vike-react"})})," fork can be developed that supports ",e.jsx(t.code,{children:"'use server'"}),"."]}),`
`]}),`
`,e.jsxs(t.p,{children:["Experimental Server Components implementation: ",e.jsx(t.a,{href:"https://github.com/nitedani/vike-react-rsc",children:e.jsx(t.code,{children:"vike-react-rsc"})}),"."]}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsxs(t.p,{children:["While ",e.jsx(t.a,{href:"https://github.com/reactjs/rfcs/pull/188#issuecomment-754815233",children:"we are thrilled about Server Components"}),", we believe it isn't production ready yet."]}),`
`,e.jsxs(t.p,{children:["There are multiple reasons for that. For example, use cases that are essential such as infinite scroll aren't supported yet, ",e.jsx(t.a,{href:"https://github.com/reactjs/rfcs/pull/219",children:"RFC: injectToStream"})," is a major blocker, and there doesn't seem to be a clear recommendation (yet) where to set the ",e.jsx(t.a,{href:"https://react.dev/reference/react/use-client",children:e.jsx(t.code,{children:"'use client'"})})," boundaries (minimizing the number of client components is, counterintuitively, ",e.jsx(t.a,{href:"https://twitter.com/cyco130/status/1663515982218838017",children:"not always the best strategy"}),")."]}),`
`,e.jsxs(t.p,{children:["Also, while the added value of Server Components which is to reduce the size of client-side bundles is definitely a nice-to-have, we believe the slight performance gain isn't worth the added DX complexity. We are hopeful this is going to change as the Server Components design matures: several React frameworks are experimenting and pushing the Server Components design forward. In the meantime, we recommend sticking to the classic and battle tested SSR/SPA/SSG approach (with Vike you can ",e.jsx(n,{href:"/ssr",children:"toggle SSR"})," and ",e.jsx(n,{href:"/pre-rendering",children:"toggle SSG"}),")."]}),`
`]}),`
`,e.jsxs(t.p,{children:["The most significant added value of the RSC architecture is its novel approach to SSR streaming which unlocks many exciting features around data fetching. Not only does Vike has first-class support for SSR streaming, but it also supports it in a unique way that enables both an easy DX as well as flexibility: you can integrate tools with the SSR stream manually yourself (e.g. using ",e.jsx(t.a,{href:"https://github.com/brillout/react-streaming#readme",children:"react-streaming"}),"), or you can use built-in integrations such as ",e.jsx(t.a,{href:"https://github.com/vikejs/vike-react/tree/main/packages/vike-react-query#readme",children:e.jsx(t.code,{children:"vike-react-query"})})," and ",e.jsx(t.a,{href:"https://telefunc.com",children:"Telefunc"}),"."]}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsxs(t.p,{children:["SSR streaming enables you to define components that can fetch data, while each of these data-fetching components are loaded and rendered independently of each other: the user sees a UI with non-data-fetching parts that are rendered quickly, and data-fetching parts that are rendered as data comes in. This leads to a significantly improved (perceived) page speed. See ",e.jsx(n,{href:"/streaming#progressive-rendering",children:"Progressive Rendering"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[`
`,e.jsx(n,{href:"/vike-react"}),`
`]}),`
`,e.jsxs(t.li,{children:[`
`,e.jsx(n,{href:"/vue"}),`
`]}),`
`,e.jsxs(t.li,{children:[`
`,e.jsx(n,{href:"/solid"}),`
`]}),`
`]})]})}function u(r={}){const{wrapper:t}={...a(),...r.components};return t?e.jsx(t,{...r,children:e.jsx(s,{...r})}):s(r)}const m=Object.freeze(Object.defineProperty({__proto__:null,default:u,pageSectionsExport:p},Symbol.toStringTag,{value:"Module"})),F={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:l}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:o}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/react/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:m}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{F as configValuesSerialized};
