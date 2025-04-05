import{j as e,i as o,L as s,o as n}from"../chunks/chunk-BqJz907Y.js";import{L as a}from"../chunks/chunk-BmkgW3tD.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-drWBd06u.js";import{C as l}from"../chunks/chunk-Cxfo8nYn.js";/* empty css                      *//* empty css                      */import"../chunks/chunk-DLLinNPN.js";const d=[];function r(i){const t={a:"a",blockquote:"blockquote",code:"code",em:"em",li:"li",ol:"ol",p:"p",ul:"ul",...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(l,{url:"https://hapi.dev"}),`
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
`,e.jsxs(t.li,{children:["Our hapi server that serves the backend ",e.jsx(t.em,{children:"as well"})," as the frontend: it serves the static files living at ",e.jsx(t.code,{children:"dist/client/"})," and does server-side rendering by using Vike's ",e.jsx(a,{text:e.jsx(t.code,{children:"renderPage()"}),href:"/renderPage"}),"."]}),`
`]}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsxs(t.p,{children:["See ",e.jsxs(t.a,{href:"https://github.com/vikejs/vike/issues/366#issuecomment-1189144446",children:["GitHub > ",e.jsx(t.code,{children:"vikejs/vike"})," > hapi (#366)"]}),"."]}),`
`]})]})}function p(i={}){const{wrapper:t}=i.components||{};return t?e.jsx(t,{...i,children:e.jsx(r,{...i})}):r(i)}const h=Object.freeze(Object.defineProperty({__proto__:null,default:p,pageSectionsExport:d},Symbol.toStringTag,{value:"Module"})),k={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:n}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/hapi/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:h}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:s}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:o}}};export{k as configValuesSerialized};
