import{o as s,a as l}from"../chunks/chunk-Cgz1GdgB.js";import{j as e,l as i}from"../chunks/chunk-Dn-Xi2p3.js";import{L as n}from"../chunks/chunk-Be1bryip.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as o}from"../chunks/chunk-IMAl7YcV.js";import{U as c}from"../chunks/chunk-BpueW138.js";import{E as d}from"../chunks/chunk-CbcIrPPR.js";import{C as p}from"../chunks/chunk-TPj9QHFj.js";/* empty css                      */import"../chunks/chunk-CRkRl3Um.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-r8IY6BSZ.js";import"../chunks/chunk-BrBnlIOR.js";const h=[{pageSectionId:"vike-react",pageSectionLevel:2,pageSectionTitle:"`vike-react`"},{pageSectionId:"custom-integration",pageSectionLevel:2,pageSectionTitle:"Custom integration"},{pageSectionId:"react-server-components",pageSectionLevel:2,pageSectionTitle:"React Server Components"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function a(r){const t={a:"a",blockquote:"blockquote",code:"code",li:"li",p:"p",ul:"ul",...o(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx("h2",{id:"vike-react",children:e.jsx("code",{children:"vike-react"})}),`
`,e.jsxs(t.p,{children:["We recommend using ",e.jsx(n,{href:"/vike-react",children:e.jsx(t.code,{children:"vike-react"})})," which integrates ",e.jsx(t.a,{href:"https://react.dev",children:"React"})," in a full-fledged manner."]}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsx(c,{children:e.jsx(t.code,{children:"vike-react"})}),`
`]}),`
`,e.jsxs(t.p,{children:["You can also ",e.jsx(n,{href:"#custom-integration",children:"integrate React yourself"})," if you want full control over React integration."]}),`
`,e.jsx("h2",{id:"custom-integration",children:"Custom integration"}),`
`,e.jsxs(t.p,{children:["Instead of using ",e.jsx(n,{href:"/vike-react",children:e.jsx(t.code,{children:"vike-react"})}),", you can implement your own React integration for full control over React as well as React libraries."]}),`
`,e.jsx(p,{uiFramework:"react"}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsxs(t.p,{children:["You can use ",e.jsx(n,{href:"/new/core",children:"vike.dev/new/core"})," to scaffold a Vike app that uses a manual React integration."]}),`
`]}),`
`,e.jsx(t.p,{children:"Official examples:"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(i,{path:"/packages/create-vike-core/boilerplate-react-ts"})," - Classic integration, using ",e.jsx(n,{href:"/client-routing",children:"Client Routing"}),"."]}),`
`,e.jsxs(t.li,{children:[e.jsx(i,{path:"/examples/react-minimal"})," - Minimal integration, using ",e.jsx(n,{href:"/server-routing",children:"Server Routing"}),"."]}),`
`,e.jsxs(t.li,{children:[e.jsxs(t.a,{href:"https://github.com/vikejs/vike-react/tree/main/packages/vike-react",children:[e.jsx(t.code,{children:"vike-react"})," source code"]})," - Full-fledged integration."]}),`
`,e.jsxs(t.li,{children:[e.jsx(i,{path:"/examples/render-modes"})," - Integration supporting all ",e.jsx(n,{href:"/render-modes",children:"render modes"})," (SSR, SPA, and HTML-only)."]}),`
`]}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsxs(t.p,{children:["For more official examples, see ",e.jsxs(t.a,{href:"https://github.com/vikejs/vike/tree/main/examples",children:["GitHub > ",e.jsx(t.code,{children:"vikejs/vike"})," > ",e.jsx(t.code,{children:"examples/"})]}),"."]}),`
`]}),`
`,e.jsx(t.p,{children:"Community examples:"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(d,{timestamp:"2023.12",repo:"luisfuturist/vike-island-example"})," - ",e.jsx(t.a,{href:"https://jasonformat.com/islands-architecture/",children:"Islands Architecture"}),", mixed React and Vue."]}),`
`]}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsxs(t.p,{children:["For more community examples, see integration guides such as ",e.jsx(n,{href:"/tanstack-query",children:"Integration > TanStack Query"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"react-server-components",children:"React Server Components"}),`
`,e.jsxs(t.p,{children:[e.jsx(t.a,{href:"https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components",children:"React Server Components (RSC)"})," is a new application architecture designed by the React team."]}),`
`,e.jsxs(t.p,{children:["Vike has experimental support for Server Components via ",e.jsx(t.a,{href:"https://github.com/nitedani/vike-react-rsc",children:e.jsx(t.code,{children:"vike-react-rsc"})}),"."]}),`
`,e.jsxs(t.p,{children:["If you use ",e.jsx(t.code,{children:"vike-react"}),", use ",e.jsx(n,{href:"/RPC",children:"RPC"})," instead of ",e.jsx(t.a,{href:"https://react.dev/reference/rsc/server-functions",children:"Server Functions (aka Server Actions)"}),"."]}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsxs(t.p,{children:[e.jsx(t.a,{href:"https://telefunc.com",children:"Telefunc"})," is an RPC implementation with minimal boilerplate similar to Server Functions."]}),`
`]}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsxs(t.p,{children:["Vike fully supports ",e.jsx(n,{href:"/streaming#progressive-rendering",children:"Progressive Rendering"})," (HTML streaming) which can be used also without Server Components."]}),`
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
`]})]})}function u(r={}){const{wrapper:t}={...o(),...r.components};return t?e.jsx(t,{...r,children:e.jsx(a,{...r})}):a(r)}const m=Object.freeze(Object.defineProperty({__proto__:null,default:u,pageSectionsExport:h},Symbol.toStringTag,{value:"Module"})),V={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:l}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:s}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/react/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:m}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{V as configValuesSerialized};
