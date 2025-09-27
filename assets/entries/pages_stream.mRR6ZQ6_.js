import{o as l,a as t}from"../chunks/chunk-YrzSF-5M.js";import{j as e}from"../chunks/chunk-DylOdVSZ.js";import{L as n}from"../chunks/chunk-DnqwWAsR.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{U as a}from"../chunks/chunk-CvHq2b10.js";import{C as o,P as d}from"../chunks/chunk-C5rDYQWE.js";/* empty css                      *//* empty css                      *//* empty css                      */const c=[{pageSectionId:"inheritance",pageSectionLevel:2,pageSectionTitle:"Inheritance"},{pageSectionId:"without-vike-react-vue-solid",pageSectionLevel:2,pageSectionTitle:"Without `vike-{react,vue,solid}`"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function i(r){const s={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{default:e.jsxs(e.Fragment,{children:[e.jsx(s.code,{children:"false"})," (or ",e.jsx(s.code,{children:"true"})," if using a ",e.jsx(n,{href:"/extensions",children:"Vike extension"})," that requires streaming)"]}),providedBy:e.jsxs(d,{children:["the ",e.jsx(s.code,{children:"stream"})," setting"]}),requires:e.jsx(n,{href:"/ssr",children:e.jsx(s.code,{children:"ssr: true"})}),isTypeOneLiner:!0,children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsx(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"boolean "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"|"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'web'"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" |"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'node'"})]})})})})}),`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.code,{children:"stream"})," setting allows you to:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"Enable or disable HTML Streaming."}),`
`,e.jsxs(s.li,{children:["Specify the stream type (either a ",e.jsx(s.a,{href:"https://nodejs.org/api/stream.html",children:"Node.js Stream"})," or a ",e.jsx(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/Streams_API",children:"Web Stream"}),")."]}),`
`]}),`
`,e.jsx("span",{id:"what-is-streaming"}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"What is HTML Streaming?"})," If you're unfamiliar with HTML streaming then check out ",e.jsx(s.a,{href:"https://github.com/reactwg/react-18/discussions/37",children:"this explanation of SSR, HTML streaming, and Progressive Rendering"}),". Although it explains it in the context of React, we also recommend reading it if you use a UI framework other than React."]}),`
`]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Enable HTML Streaming. Let Vike extensions decide whether to use a Node.js or Web stream."})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  stream: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Enable HTML Streaming. Force the stream to be a Web Stream."})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  stream: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'web'"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Enable HTML Streaming. Force the stream to be a Node.js Stream."})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  stream: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'node'"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Why doesn't it seem to work?"})," If you enable HTML Streaming but the HTML is still sent all at once, note that:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsxs(s.strong,{children:["The ",e.jsxs(n,{href:"/data",children:[e.jsx(s.code,{children:"+data"})," hook"]})," doesn't trigger HTML Streaming"]})," — the ",e.jsx(s.code,{children:"+data"})," hook applies to the whole page and is fully awaited before rendering starts. ",e.jsxs(s.a,{href:"https://github.com/vikejs/vike-react/pull/189/commits/a834d9ba0f259f0f2d332e46a99cc9d895cbedf2",children:["A slow ",e.jsx(s.code,{children:"+data"})," hook"]})," still results in the HTML being sent all at once. To see HTML streaming in action, use a Vike extension like ",e.jsx(s.a,{href:"https://github.com/vikejs/vike-react/tree/main/packages/vike-react-query#readme",children:e.jsx(s.code,{children:"vike-react-query"})}),"/",e.jsx(s.a,{href:"https://github.com/vikejs/vike-vue/tree/main/packages/vike-vue-query#readme",children:e.jsx(s.code,{children:"vike-vue-query"})}),"/",e.jsx(s.a,{href:"https://github.com/vikejs/vike-solid/tree/main/packages/vike-solid-query#readme",children:e.jsx(s.code,{children:"vike-solid-query"})})," (and the upcoming Telefunc integrations such as ",e.jsx(s.a,{href:"https://github.com/vikejs/vike-react/issues/131",children:e.jsx(s.code,{children:"vike-react-telefunc"})}),")."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"By default, HTML streaming is disabled for bots"}),". For example, the ",e.jsxs(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/User-Agent",children:[e.jsx(s.code,{children:"User-Agent"})," header"]})," sent by ",e.jsx(s.a,{href:"https://curl.se",children:e.jsx(s.code,{children:"curl"})})," is interpreted as a bot. See ",e.jsxs(s.a,{href:"https://github.com/brillout/react-streaming#bots",children:[e.jsx(s.code,{children:"react-streaming"})," > Bots"]}),"."]}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"inheritance",children:"Inheritance"}),`
`,e.jsx(s.p,{children:"Enable for all your pages:"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This config applies to all pages (/pages/**)."})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  stream: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})}),`
`,e.jsx(s.p,{children:"Enable only for some pages:"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/admin/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"/* This config applies only to admin pages (/pages/admin/**) such as:"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"   FILESYSTEM                            URL"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"   /pages/admin/+Page.ts                 /admin"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"   /pages/admin/user/@id/+Page.ts        /admin/user/@id"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"   /pages/admin/product/@id/+Page.ts     /admin/product/@id"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"*/"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  stream: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["For better config organization, you can use a ",e.jsx(n,{href:"/routing#domain-driven-file-structure",children:"domain-driven file structure"}),"."]}),`
`]}),`
`,e.jsxs("h2",{id:"without-vike-react-vue-solid",children:["Without ",e.jsx("code",{children:"vike-{react,vue,solid}"})]}),`
`,e.jsxs(s.p,{children:["In case you don't use a ",e.jsx(a,{}),", you can:"]}),`
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
`]})]})}function h(r={}){const{wrapper:s}=r.components||{};return s?e.jsx(s,{...r,children:e.jsx(i,{...r})}):i(r)}const p=Object.freeze(Object.defineProperty({__proto__:null,default:h,pageSectionsExport:c},Symbol.toStringTag,{value:"Module"})),C={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:t}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:l}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/stream/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:p}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{C as configValuesSerialized};
