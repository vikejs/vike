import{o as r,a as t}from"../chunks/chunk-Dljvy3Ab.js";import{j as e}from"../chunks/chunk-Fu7fMDLz.js";import{L as s}from"../chunks/chunk-B8koGbNS.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{U as l}from"../chunks/chunk-DxeMCUt-.js";import{P as o}from"../chunks/chunk-CLNjR8-k.js";/* empty css                      *//* empty css                      *//* empty css                      */const d=[{pageSectionId:"inheritance",pageSectionLevel:2,pageSectionTitle:"Inheritance"},{pageSectionId:"without-vike-react-vue-solid",pageSectionLevel:2,pageSectionTitle:"Without `vike-{react,vue,solid}`"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function i(a){const n={a:"a",blockquote:"blockquote",br:"br",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...a.components};return e.jsxs(e.Fragment,{children:[e.jsxs(n.p,{children:["Default value: ",e.jsx(n.code,{children:"false"}),". (Or ",e.jsx(n.code,{children:"true"})," if using a ",e.jsx(s,{href:"/extensions",children:"Vike extension"})," that requires streaming.)",e.jsx(n.br,{}),`
`,"Requires: ",e.jsx(s,{href:"/ssr",children:e.jsx(n.code,{children:"ssr: true"})}),"."]}),`
`,e.jsxs(o,{children:["the ",e.jsx(n.code,{children:"stream"})," setting"]}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"stream"})," setting allows you to:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Enable or disable HTML Streaming."}),`
`,e.jsxs(n.li,{children:["Specify the stream type (either a ",e.jsx(n.a,{href:"https://nodejs.org/api/stream.html",children:"Node.js Stream"})," or a ",e.jsx(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/Streams_API",children:"Web Stream"}),")."]}),`
`]}),`
`,e.jsx("span",{id:"what-is-streaming"}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"What is HTML Streaming?"})," If you're unfamiliar with HTML streaming then check out ",e.jsx(n.a,{href:"https://github.com/reactwg/react-18/discussions/37",children:"this explanation of SSR, HTML streaming, and Progressive Rendering"}),". Although it explains it in the context of React, we also recommend reading it if you use a UI framework other than React."]}),`
`]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/+config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Enable HTML Streaming. Let Vike extensions decide whether to use a Node.js or Web stream."})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  stream: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Enable HTML Streaming. Force the stream to be a Web Stream."})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  stream: "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'web'"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Enable HTML Streaming. Force the stream to be a Node.js Stream."})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  stream: "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'node'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h2",{id:"inheritance",children:"Inheritance"}),`
`,e.jsx(n.p,{children:"Enable for all your pages:"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/+config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// This config applies to all pages (/pages/**)."})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  stream: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.p,{children:"Enable only for some pages:"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/admin/+config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"/* This config applies only to admin pages (/pages/admin/**) such as:"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"   FILESYSTEM                            URL"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"   /pages/admin/+Page.js                 /admin"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"   /pages/admin/user/@id/+Page.js        /admin/user/@id"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"   /pages/admin/product/@id/+Page.js     /admin/product/@id"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"*/"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  stream: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.p,{children:["For an improved file and config organization, you can consider using a ",e.jsx(s,{href:"/routing#domain-driven-file-structure",children:"domain-driven file structure"}),"."]}),`
`,e.jsxs("h2",{id:"without-vike-react-vue-solid",children:["Without ",e.jsx("code",{children:"vike-{react,vue,solid}"})]}),`
`,e.jsxs(n.p,{children:["In case you don't use a ",e.jsx(l,{}),", you can:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Integrate HTML streaming yourself, see ",e.jsx(s,{href:"/streaming"}),"."]}),`
`,e.jsxs(n.li,{children:["Implement the ",e.jsx(n.code,{children:"stream"})," setting yourself by using ",e.jsx(s,{href:"/meta",children:"meta"}),". Examples:",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsxs(n.a,{href:"https://github.com/vikejs/vike-react/blob/main/packages/vike-react",children:[e.jsx(n.code,{children:"vike-react"})," source code"]})}),`
`,e.jsx(n.li,{children:e.jsxs(n.a,{href:"https://github.com/vikejs/vike-vue/blob/main/packages/vike-vue",children:[e.jsx(n.code,{children:"vike-vue"})," source code"]})}),`
`,e.jsx(n.li,{children:e.jsxs(n.a,{href:"https://github.com/vikejs/vike-solid/blob/main/vike-solid",children:[e.jsx(n.code,{children:"vike-solid"})," source code"]})}),`
`]}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/streaming"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/ssr"}),`
`]}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://github.com/reactwg/react-18/discussions/37",children:"Explanation of SSR, HTML streaming, and Progressive Rendering"})}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"https://nodejs.org/api/stream.html",children:"Node.js Streams"})," (Node.js documentation)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/Streams_API",children:"Web Streams"})," (MDN documentation)"]}),`
`]})]})}function c(a={}){const{wrapper:n}=a.components||{};return n?e.jsx(n,{...a,children:e.jsx(i,{...a})}):i(a)}const h=Object.freeze(Object.defineProperty({__proto__:null,default:c,pageSectionsExport:d},Symbol.toStringTag,{value:"Module"})),D={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:t}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:r}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/stream/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:h}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{D as configValuesSerialized};
