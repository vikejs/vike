import{j as e,i as t,L as s,o as d}from"../chunks/chunk-CA25TqZK.js";import{L as n}from"../chunks/chunk-BjLQpSqv.js";/* empty css                      */import{D as o}from"../chunks/chunk-Dq2nKeNP.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-DQ1DQlqi.js";/* empty css                      *//* empty css                      */const a=[{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function l(r){const i={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",ol:"ol",p:"p",pre:"pre",span:"span",ul:"ul",...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(i.p,{children:"Disable the automatic chaining of build steps."}),`
`,e.jsxs(o,{children:[e.jsx(i.p,{children:"This setting is deprecated and will soon be removed. (Because Vite will soon use one Rolldown build in replacement of two Rollup builds.)"}),e.jsxs(i.p,{children:["Consider ",e.jsx(n,{href:"/prerender#disableautorun"})," instead."]})]}),`
`,e.jsx(i.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(i.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(i.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(i.span,{"data-line":"",children:e.jsx(i.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,e.jsx(i.span,{"data-line":"",children:" "}),`
`,e.jsxs(i.span,{"data-line":"",children:[e.jsx(i.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(i.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(i.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(i.span,{"data-line":"",children:e.jsx(i.span,{style:{color:"#6A737D"},children:"  // Disable all chaining"})}),`
`,e.jsxs(i.span,{"data-line":"",children:[e.jsx(i.span,{style:{color:"#24292E"},children:"  disableAutoFullBuild: "}),e.jsx(i.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(i.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(i.span,{"data-line":"",children:e.jsx(i.span,{style:{color:"#6A737D"},children:"  // Or only disable the automatic pre-render triggering"})}),`
`,e.jsxs(i.span,{"data-line":"",children:[e.jsx(i.span,{style:{color:"#24292E"},children:"  disableAutoFullBuild: "}),e.jsx(i.span,{style:{color:"#032F62"},children:"'prerender'"})]}),`
`,e.jsx(i.span,{"data-line":"",children:e.jsx(i.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(i.p,{children:["Running ",e.jsx(i.code,{children:"$ vite build"})," executes three build steps:"]}),`
`,e.jsxs(i.ol,{children:[`
`,e.jsxs(i.li,{children:["Client-side build (",e.jsx(i.code,{children:"dist/client/"}),")."]}),`
`,e.jsxs(i.li,{children:["Server-side build (",e.jsx(i.code,{children:"dist/server/"}),")."]}),`
`,e.jsxs(i.li,{children:["Pre-rendering (if ",e.jsx(n,{text:"pre-rendering is enabled",href:"/pre-rendering"}),")."]}),`
`]}),`
`,e.jsxs(i.p,{children:["When setting ",e.jsx(i.code,{children:"disableAutoFullBuild"})," to ",e.jsx(i.code,{children:"true"})," then only step ",e.jsx(i.code,{children:"1"})," is executed. To run the full build, you then have to:"]}),`
`,e.jsxs(i.ul,{children:[`
`,e.jsxs(i.li,{children:["Run ",e.jsx(i.code,{children:"$ vite build"}),", to build the client-side (",e.jsx(i.code,{children:"dist/client/"}),")."]}),`
`,e.jsxs(i.li,{children:["Run ",e.jsx(i.code,{children:"$ vite build --ssr"}),", to build the server-side (",e.jsx(i.code,{children:"dist/server/"}),")."]}),`
`,e.jsxs(i.li,{children:["Run the pre-rendering programmatically, see ",e.jsx(n,{href:"/api#prerender",doNotInferSectionTitle:!0}),"."]}),`
`]}),`
`,e.jsxs(i.blockquote,{children:[`
`,e.jsxs(i.p,{children:["If your goal is only to ",e.jsx(n,{href:"/api#prerender",children:"programmatically run pre-rendering"})," then consider using ",e.jsx(n,{href:"/prerender#disableautorun",children:e.jsx("code",{children:"prerender.disableAutoRun"})})," instead."]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(i.ul,{children:[`
`,e.jsxs(i.li,{children:[`
`,e.jsx(n,{href:"/api#prerender",doNotInferSectionTitle:!0}),`
`]}),`
`,e.jsxs(i.li,{children:[`
`,e.jsx(n,{href:"/prerender#disableautorun"}),`
`]}),`
`,e.jsx(i.li,{children:e.jsxs(i.a,{href:"https://vitejs.dev/guide/api-javascript.html#build",children:["Vite > JavaScript API > ",e.jsx(i.code,{children:"build"})]})}),`
`]})]})}function c(r={}){const{wrapper:i}=r.components||{};return i?e.jsx(i,{...r,children:e.jsx(l,{...r})}):l(r)}const p=Object.freeze(Object.defineProperty({__proto__:null,default:c,pageSectionsExport:a},Symbol.toStringTag,{value:"Module"})),A={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:d}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/disableAutoFullBuild/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:p}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:s}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:t}}};export{A as configValuesSerialized};
