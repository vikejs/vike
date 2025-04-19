import{j as e,i as l,L as s,o as a}from"../chunks/chunk-oGtKMovp.js";import{L as t}from"../chunks/chunk-Bkiv_Lc_.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-BLdc4UAa.js";import{U as o}from"../chunks/chunk-DyxVxI_4.js";import{I as d}from"../chunks/chunk-Canzcw45.js";/* empty css                      *//* empty css                      */const c=[{pageSectionId:"lifecycle",pageSectionLevel:2,pageSectionTitle:"Lifecycle"},{pageSectionId:"conditional",pageSectionLevel:2,pageSectionTitle:"Conditional"},{pageSectionId:"pagecontext-pagehtml-string-stream",pageSectionLevel:2,pageSectionTitle:"`pageContext.pageHtml{String,Stream}`"},{pageSectionId:"use-cases",pageSectionLevel:2,pageSectionTitle:"Use cases"},{pageSectionId:"without-vike-react-vue-solid",pageSectionLevel:2,pageSectionTitle:"Without `vike-{react,vue,solid}`"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function i(r){const n={a:"a",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.p,{children:"Environment: server."}),`
`,e.jsx(d,{list:["vike-react","vike-vue"],children:e.jsx(n.code,{children:"onAfterRenderHtml()"})}),`
`,e.jsxs(n.p,{children:["Hook called right after the ",e.jsxs(t,{href:"/Page",children:["the ",e.jsx(n.code,{children:"+Page"})," component"]})," is rendered to HTML."]}),`
`,e.jsx("h2",{id:"lifecycle",children:"Lifecycle"}),`
`,e.jsx(n.p,{children:"It's called upon rendering the first page the user visits. It isn't called upon page navigation (since pages aren't rendered to HTML upon page navigation)."}),`
`,e.jsxs(n.p,{children:["It's called regardless of whether ",e.jsx(t,{href:"/ssr",children:"SSR"})," is disabled. (The first page the user visits is always rendered to HTML: when SSR is disabled it's just an HTML shell that doesn't contain the content of the page.)"]}),`
`,e.jsxs(n.p,{children:["For ",e.jsx(t,{href:"/pre-rendering",children:"pre-rendered pages"})," it's called at build-time. (Since the HTML of pre-rendered pages are generated at build-time.)"]}),`
`,e.jsx("h2",{id:"conditional",children:"Conditional"}),`
`,e.jsxs(n.p,{children:["You can apply ",e.jsx(n.code,{children:"onAfterRenderHtml()"})," only upon certain conditions, for example you can ",e.jsx(t,{href:"/pageContext#can-i-check-whether-ssr-is-enabled",children:"apply it only if SSR is enabled"}),"."]}),`
`,e.jsx("h2",{id:"pagecontext-pagehtml-string-stream",children:e.jsx("code",{children:"pageContext.pageHtml{String,Stream}"})}),`
`,e.jsx(n.p,{children:"To access the page's HTML string/stream:"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// +onAfterRenderHtml.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onAfterRenderHtml"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // The +Page.js component rendered to an HTML string"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  pageContext.pageHtmlString"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // The +Page.js component rendered to an HTML stream"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  pageContext.pageHtmlStream"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.p,{children:["You can mutate ",e.jsx(n.code,{children:"pageContext.pageHtmlString"})," and ",e.jsx(n.code,{children:"pageContext.pageHtmlStream"}),", for example to modify the HTML."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// +onAfterRenderHtml.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onAfterRenderHtml"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Apply some HTML transformation, e.g. HTML minification"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  pageContext.pageHtmlString "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" minifyHtml"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(pageContext.pageHtmlString)"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h2",{id:"use-cases",children:"Use cases"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"onAfterRenderHtml()"})," and ",e.jsx(t,{href:"/onBeforeRenderHtml",children:e.jsx(n.code,{children:"onBeforeRenderHtml()"})})," hooks are typically used for integrating tools."]}),`
`,e.jsxs(n.p,{children:["For example, ",e.jsx(n.code,{children:"onAfterRenderHtml()"})," is often used for dehydrating state management libraries, and ",e.jsx(n.code,{children:"onBeforeRenderHtml()"})," can be used for collecting the page's CSS defined by a CSS-in-JS library (",e.jsx(n.a,{href:"https://github.com/vikejs/vike-vue/issues/141",children:"#141 - CSS-in-JS with SSR"}),")."]}),`
`,e.jsxs(n.p,{children:["It can also be used to modify the HTML, see ",e.jsx(t,{href:"#pagecontext-pagehtml-string-stream"}),"."]}),`
`,e.jsxs("h2",{id:"without-vike-react-vue-solid",children:["Without ",e.jsx("code",{children:"vike-{react,vue,solid}"})]}),`
`,e.jsxs(n.p,{children:["If you don't use a ",e.jsx(o,{}),", then you don't need ",e.jsx(n.code,{children:"onAfterRenderHtml()"})," nor ",e.jsx(t,{href:"/onBeforeRenderHtml",children:e.jsx(n.code,{children:"onBeforeRenderHtml()"})})," since you already have full control over HTML rendering at your ",e.jsx(t,{href:"/onRenderHtml",children:e.jsx(n.code,{children:"onRenderHtml()"})})," hook."]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(t,{href:"/onBeforeRenderHtml"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(t,{href:"/onRenderHtml"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(t,{href:"/onBeforeRenderClient"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(t,{href:"/onAfterRenderClient"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(t,{href:"/hooks"}),`
`]}),`
`]})]})}function p(r={}){const{wrapper:n}=r.components||{};return n?e.jsx(n,{...r,children:e.jsx(i,{...r})}):i(r)}const h=Object.freeze(Object.defineProperty({__proto__:null,default:p,pageSectionsExport:c},Symbol.toStringTag,{value:"Module"})),L={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:a}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/onAfterRenderHtml/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:h}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:s}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:l}}};export{L as configValuesSerialized};
