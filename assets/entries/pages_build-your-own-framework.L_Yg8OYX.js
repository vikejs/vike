import{j as e,L as t,o as n,i}from"../chunks/chunk-BJ4IHJDj.js";import{L as s}from"../chunks/chunk-BCA10iX_.js";/* empty css                      */import{W as d}from"../chunks/chunk-CSRmRspr.js";/* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-B8V8gitZ.js";/* empty css                      *//* empty css                      *//* empty css                      */const l=[{pageSectionId:"basic-framework",pageSectionLevel:2,pageSectionTitle:"Basic framework"},{pageSectionId:"all-included-framework",pageSectionLevel:2,pageSectionTitle:"All-included framework"},{pageSectionId:"more-tools",pageSectionLevel:2,pageSectionTitle:"More tools"}];function a(o){const r={a:"a",blockquote:"blockquote",code:"code",figure:"figure",p:"p",pre:"pre",span:"span",strong:"strong",...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(d,{children:"This documentation is a draft. Directly reach out to Vike maintainers if you're interested in this."}),`
`,e.jsx(r.p,{children:"With Vike, you can create your own Next.js / Nuxt with only hundreds of lines of code."}),`
`,e.jsxs(r.p,{children:["Vike frameworks use the same interface as regular Vike apps: the only difference is that some code (e.g. ",e.jsx(s,{href:"/onRenderHtml",children:"onRenderHtml()"}),") lives in ",e.jsx(r.code,{children:"app/node_modules/framework/"})," instead of ",e.jsx(r.code,{children:"app/"}),"."]}),`
`,e.jsx(r.p,{children:"Your framework can include more functionality beyond Vike, such as a custom server, custom deployment integration, custom data fetching integration, etc."}),`
`,e.jsx("h2",{id:"basic-framework",children:"Basic framework"}),`
`,e.jsx(r.p,{children:"A basic Vike framework provides a renderer so that the user of your framework doesn't have to implement it:"}),`
`,e.jsx(r.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(r.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"bash","data-theme":"github-light",children:e.jsxs(r.code,{"data-language":"bash","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(r.span,{"data-line":"",children:e.jsx(r.span,{style:{color:"#6A737D"},children:"# Renderer implemented by the framework"})}),`
`,e.jsx(r.span,{"data-line":"",children:e.jsx(r.span,{style:{color:"#6F42C1"},children:"node_modules/framework/renderer/+onRenderHtml.js"})}),`
`,e.jsx(r.span,{"data-line":"",children:e.jsx(r.span,{style:{color:"#6F42C1"},children:"node_modules/framework/renderer/+onRenderClient.js"})}),`
`,e.jsx(r.span,{"data-line":"",children:" "}),`
`,e.jsx(r.span,{"data-line":"",children:e.jsx(r.span,{style:{color:"#6A737D"},children:"# User page files"})}),`
`,e.jsx(r.span,{"data-line":"",children:e.jsx(r.span,{style:{color:"#6F42C1"},children:"pages/index/+Page.js"})}),`
`,e.jsx(r.span,{"data-line":"",children:e.jsx(r.span,{style:{color:"#6F42C1"},children:"pages/about/+Page.js"})})]})})}),`
`,e.jsxs(r.p,{children:["In other words, the framework takes care of the UI framework integration (React, Vue, ...) so that all the framework's users have left to do is to define UI components and pages using ",e.jsx(r.code,{children:"/pages/**/+*.js"})," files."]}),`
`,e.jsxs(r.blockquote,{children:[`
`,e.jsxs(r.p,{children:[e.jsx(r.strong,{children:"Progressively build your framework"}),". We recommend to build your framework progressively by first implementing a normal Vike app without building any framework. Once you're satisfied with the architecture of your Vike app, you can start creating your own framework by moving ",e.jsx(r.code,{children:"renderer/"})," from ",e.jsx(r.code,{children:"my-app/renderer/"})," to ",e.jsx(r.code,{children:"my-app/node_modules/my-own-framework/renderer/"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"all-included-framework",children:"All-included framework"}),`
`,e.jsx(r.p,{children:"Beyond integrating Vike with a UI framework, you can include anything you want to your framework, such as a custom server (e.g. Express.js), a database and ORM (e.g. SQLite + Prisma), deployment (e.g. Cloudflare Workers), error tracking (e.g. Sentry), a CLI, etc."}),`
`,e.jsxs(r.p,{children:["You can implement an ",e.jsx(r.a,{href:"https://land.vike.dev/#all-included",children:"all-included framework"})," so that all your framework's users have left to do is: define UI components, and define data models (if your framework has a database)."]}),`
`,e.jsx("h2",{id:"more-tools",children:"More tools"}),`
`,e.jsxs(r.p,{children:["See ",e.jsx(r.a,{href:"https://land.vike.dev/#getting-started",children:"Vike > Getting Started"})," for more tools to build your own framework."]})]})}function c(o={}){const{wrapper:r}=o.components||{};return r?e.jsx(r,{...o,children:e.jsx(a,{...o})}):a(o)}const p=Object.freeze(Object.defineProperty({__proto__:null,default:c,pageSectionsExport:l},Symbol.toStringTag,{value:"Module"})),S={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:t}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:n}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:i}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/build-your-own-framework/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:p}}};export{S as configValuesSerialized};