import{j as e,i as r,L as t,o as l}from"../chunks/chunk-DLnvT0nE.js";import{L as n}from"../chunks/chunk-B92IqNIY.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-D_sMC2hT.js";import{U as o}from"../chunks/chunk-B63MbhWS.js";import{I as d}from"../chunks/chunk-D2eyCRvb.js";/* empty css                      *//* empty css                      *//* empty css                      */const c=[{pageSectionId:"inheritance",pageSectionLevel:2,pageSectionTitle:"Inheritance"},{pageSectionId:"without-vike-react-vue-solid",pageSectionLevel:2,pageSectionTitle:"Without `vike-{react,vue,solid}`"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function i(a){const s={a:"a",blockquote:"blockquote",br:"br",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...a.components};return e.jsxs(e.Fragment,{children:[e.jsxs(s.p,{children:["Default value: ",e.jsx(s.code,{children:"false"}),". (Or ",e.jsx(s.code,{children:"true"})," if using a ",e.jsx(n,{href:"/extensions",children:"Vike extension"})," that requires streaming.)",e.jsx(s.br,{}),`
`,"Requires: ",e.jsx(n,{href:"/ssr",children:e.jsx(s.code,{children:"ssr: true"})}),"."]}),`
`,e.jsxs(d,{children:["the ",e.jsx(s.code,{children:"stream"})," setting"]}),`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.code,{children:"stream"})," setting allows you to:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"Enable or disable HTML Streaming."}),`
`,e.jsxs(s.li,{children:["Specify the stream type (either a ",e.jsx(s.a,{href:"https://nodejs.org/api/stream.html",children:"Node.js Stream"})," or a ",e.jsx(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/Streams_API",children:"Web Stream"}),")."]}),`
`]}),`
`,e.jsx("span",{id:"what-is-streaming"}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"What is HTML Streaming?"})," If you're unfamiliar with HTML streaming then check out ",e.jsx(s.a,{href:"https://github.com/reactwg/react-18/discussions/37",children:"this explanation of SSR, HTML streaming, and Progressive Rendering"}),". Although it explains it in the context of React, we also recommend reading it if you use a UI framework other than React."]}),`
`]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Enable HTML Streaming. Let Vike extensions decide whether to use a Node.js or Web stream."})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  stream: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Enable HTML Streaming. Force the stream to be a Web Stream."})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  stream: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'web'"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Enable HTML Streaming. Force the stream to be a Node.js Stream."})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  stream: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'node'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h2",{id:"inheritance",children:"Inheritance"}),`
`,e.jsx(s.p,{children:"Enable for all your pages:"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This config applies to all pages (/pages/**)."})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  stream: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(s.p,{children:"Enable only for some pages:"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/admin/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"/* This config applies only to admin pages (/pages/admin/**) such as:"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"   FILESYSTEM                            URL"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"   /pages/admin/+Page.js                 /admin"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"   /pages/admin/user/@id/+Page.js        /admin/user/@id"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"   /pages/admin/product/@id/+Page.js     /admin/product/@id"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"*/"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  stream: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(s.p,{children:["For an improved file and config organization, you can consider using a ",e.jsx(n,{href:"/routing#domain-driven-file-structure",children:"domain-driven file structure"}),"."]}),`
`,e.jsxs("h2",{id:"without-vike-react-vue-solid",children:["Without ",e.jsx("code",{children:"vike-{react,vue,solid}"})]}),`
`,e.jsxs(s.p,{children:["In case you don't use a ",e.jsx(o,{}),", you can:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Integrate HTML streaming yourself, see ",e.jsx(n,{href:"/streaming"}),"."]}),`
`,e.jsxs(s.li,{children:["Implement the ",e.jsx(s.code,{children:"stream"})," setting yourself by using ",e.jsx(n,{href:"/meta",children:"meta"}),". Examples:",`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsxs(s.a,{href:"https://github.com/vikejs/vike-react/blob/main/packages/vike-react",children:[e.jsx(s.code,{children:"vike-react"})," source code"]})}),`
`,e.jsx(s.li,{children:e.jsxs(s.a,{href:"https://github.com/vikejs/vike-vue/blob/main/packages/vike-vue",children:[e.jsx(s.code,{children:"vike-vue"})," source code"]})}),`
`,e.jsx(s.li,{children:e.jsxs(s.a,{href:"https://github.com/vikejs/vike-solid/blob/main/vike-solid",children:[e.jsx(s.code,{children:"vike-solid"})," source code"]})}),`
`]}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/streaming"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/ssr"}),`
`]}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/reactwg/react-18/discussions/37",children:"Explanation of SSR, HTML streaming, and Progressive Rendering"})}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://nodejs.org/api/stream.html",children:"Node.js Streams"})," (Node.js documentation)"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/Streams_API",children:"Web Streams"})," (MDN documentation)"]}),`
`]})]})}function h(a={}){const{wrapper:s}=a.components||{};return s?e.jsx(s,{...a,children:e.jsx(i,{...a})}):i(a)}const p=Object.freeze(Object.defineProperty({__proto__:null,default:h,pageSectionsExport:c},Symbol.toStringTag,{value:"Module"})),w={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:l}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/stream/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:p}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:t}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:r}}};export{w as configValuesSerialized};
