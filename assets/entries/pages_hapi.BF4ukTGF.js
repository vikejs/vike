import{o,a as s}from"../chunks/chunk-CRR3HCM0.js";import{j as e}from"../chunks/chunk-BVtPDciO.js";import{L as l}from"../chunks/chunk-UcDNXDXa.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as n}from"../chunks/chunk-BQoaMqtm.js";import{C as a}from"../chunks/chunk-DGNQ2E4v.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-CtmF0dnF.js";const d=[];function r(i){const t={a:"a",blockquote:"blockquote",code:"code",em:"em",li:"li",ol:"ol",p:"p",ul:"ul",...n(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(a,{url:"https://hapi.dev"}),`
`,e.jsx(t.p,{children:"We recommend the following setup."}),`
`,e.jsxs(t.p,{children:["In development, we use ",e.jsx(t.em,{children:"two"})," servers:"]}),`
`,e.jsxs(t.ol,{children:[`
`,e.jsx(t.li,{children:"We use Vite's development server. (It automatically includes Vike's server middleware.)"}),`
`,e.jsxs(t.li,{children:["We use our hapi server ",e.jsx(t.em,{children:"without"})," Vite nor Vike."]}),`
`]}),`
`,e.jsx(t.p,{children:"This means that in development, Vite is responsible for serving the entire frontend, while our hapi server is responsible only for serving the backend."}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsx(t.p,{children:"When using Express.js we usually integrate the Vite development middleware to Express.js but we cannot do that with hapi, because hapi doesn't support connect middlewares (the Vite development middleware is a connect middleware). See"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsx(t.li,{children:e.jsx(t.a,{href:"https://github.com/hapijs/hapi/issues/4369",children:"GitHub > hapi > Support Vite (#4369)"})}),`
`,e.jsx(t.li,{children:e.jsx(t.a,{href:"https://github.com/hapijs/hapi/issues/80",children:"GitHub > hapi > Express/Connect middleware support (#80)"})}),`
`]}),`
`]}),`
`,e.jsxs(t.p,{children:["In production, we use only ",e.jsx(t.em,{children:"one"})," server:"]}),`
`,e.jsxs(t.ol,{children:[`
`,e.jsxs(t.li,{children:["Our hapi server that serves the backend ",e.jsx(t.em,{children:"as well"})," as the frontend: it serves the static files living at ",e.jsx(t.code,{children:"dist/client/"})," and does server-side rendering by using Vike's ",e.jsx(l,{text:e.jsx(t.code,{children:"renderPage()"}),href:"/renderPage"}),"."]}),`
`]}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsxs(t.p,{children:["See ",e.jsxs(t.a,{href:"https://github.com/vikejs/vike/issues/366#issuecomment-1189144446",children:["GitHub > ",e.jsx(t.code,{children:"vikejs/vike"})," > hapi (#366)"]}),"."]}),`
`]})]})}function p(i={}){const{wrapper:t}={...n(),...i.components};return t?e.jsx(t,{...i,children:e.jsx(r,{...i})}):r(i)}const u=Object.freeze(Object.defineProperty({__proto__:null,default:p,pageSectionsExport:d},Symbol.toStringTag,{value:"Module"})),V={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:s}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:o}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/hapi/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:u}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{V as configValuesSerialized};
