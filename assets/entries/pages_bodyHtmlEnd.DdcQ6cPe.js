import{j as e,i as r,L as o,o as a}from"../chunks/chunk-DpfQFkuk.js";import{L as n}from"../chunks/chunk-BzYnSCzE.js";/* empty css                      */import{W as i}from"../chunks/chunk-ClX67GYt.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-DSObOL_O.js";import{M as d}from"../chunks/chunk-CMfMZm9h.js";import{I as c}from"../chunks/chunk-MMGx4fGW.js";/* empty css                      *//* empty css                      */import"../chunks/chunk-BexpN8WB.js";/* empty css                      */const h=[{pageSectionId:"use-cases",pageSectionLevel:2,pageSectionTitle:"Use cases"},{pageSectionId:"react",pageSectionLevel:3,pageSectionTitle:"React"},{pageSectionId:"vue",pageSectionLevel:3,pageSectionTitle:"Vue"},{pageSectionId:"global",pageSectionLevel:2,pageSectionTitle:"Global"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function t(l){const s={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...l.components};return e.jsxs(e.Fragment,{children:[e.jsx(s.p,{children:"Environment: server."}),`
`,e.jsx(c,{list:["vike-vue","vike-react"],noCustomGuide:!0,children:e.jsx(s.code,{children:"bodyHtmlEnd"})}),`
`,e.jsxs(s.p,{children:["The settings ",e.jsx(s.code,{children:"bodyHtmlEnd"}),"/",e.jsx(n,{href:"/bodyHtmlBegin"})," enable you to insert HTML at the beginning/end of the ",e.jsx(s.code,{children:"<body>"})," tag."]}),`
`,e.jsx(s.p,{children:"Inserting static HTML:"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  bodyHtmlEnd: "}),e.jsx(s.span,{style:{color:"#032F62"},children:`'<div id="something"></div>'`})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["For adding ",e.jsx(s.code,{children:"<script>"})," tags consider ",e.jsx(n,{href:"/head",children:e.jsx(s.code,{children:"<Head>"})})," or ",e.jsx(n,{href:"/client",children:e.jsx(s.code,{children:"+client.js"})})," instead."]}),`
`]}),`
`,e.jsx(s.p,{children:"Inserting dynamically generated HTML:"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+bodyHtmlEnd.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("}),e.jsx(s.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:") "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"something"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" pageContext"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#032F62"},children:" `<div>${"}),e.jsx(s.span,{style:{color:"#24292E"},children:"something"}),e.jsx(s.span,{style:{color:"#032F62"},children:"}</div>`"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(i,{children:e.jsxs(s.p,{children:["Be cautious about the security risk called ",e.jsx(s.a,{href:"https://en.wikipedia.org/wiki/Cross-site_scripting",children:"XSS injections"}),"."]})}),`
`,e.jsx("h2",{id:"use-cases",children:"Use cases"}),`
`,e.jsx("h3",{id:"react",children:"React"}),`
`,e.jsx(s.p,{children:"When using React, it's often used for portals."}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  bodyHtmlEnd: "}),e.jsx(s.span,{style:{color:"#032F62"},children:`'<div id="portal-root"></div>'`})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(s.p,{children:"You'll then get the following HTML:"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"jsx","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"jsx","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"<"}),e.jsx(s.span,{style:{color:"#22863A"},children:"body"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  <!-- ... -->"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"div"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" id"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"root"'}),e.jsx(s.span,{style:{color:"#24292E"},children:">{reactHtml}</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"div"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{className:"diff add","data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"div"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" id"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"portal-root"'}),e.jsx(s.span,{style:{color:"#24292E"},children:"></"}),e.jsx(s.span,{style:{color:"#22863A"},children:"div"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"body"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]})]})})}),`
`,e.jsx("h3",{id:"vue",children:"Vue"}),`
`,e.jsx(s.p,{children:"When using Vue, it's often used for adding the HTML targets of teleports."}),`
`,e.jsxs(s.p,{children:["Teleports work out of the box when using ",e.jsx(s.code,{children:'<Teleport to="teleported">'})," and you don't have to use ",e.jsx(s.code,{children:"bodyHtml{Begin,End}"})," then."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:[e.jsx(s.code,{children:"vike-vue"})," always inserts this at the end of the ",e.jsx(s.code,{children:"<body>"})," tag:"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"<"}),e.jsx(s.span,{style:{color:"#22863A"},children:"div"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" id"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"teleported"'}),e.jsx(s.span,{style:{color:"#24292E"},children:">${"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  pageContext.ssrContext.teleports?.["}),e.jsx(s.span,{style:{color:"#032F62"},children:"'#teleported'"}),e.jsx(s.span,{style:{color:"#24292E"},children:"] "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"??"}),e.jsx(s.span,{style:{color:"#032F62"},children:" ''"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"}</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"div"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]})]})})}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["You can use ",e.jsxs(n,{href:"/pageContext",children:["Vike's ",e.jsx(s.code,{children:"pageContext"})," object"]})," to access ",e.jsxs(s.a,{href:"https://vuejs.org/api/ssr#usessrcontext",children:["Vue's ",e.jsx(s.code,{children:"ssrContext"})," object"]}),":"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+bodyHtmlEnd.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("}),e.jsx(s.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:") "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" content"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" pageContext.ssrContext.teleports?.["}),e.jsx(s.span,{style:{color:"#032F62"},children:"'#someTeleport'"}),e.jsx(s.span,{style:{color:"#24292E"},children:"] "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"??"}),e.jsx(s.span,{style:{color:"#032F62"},children:" ''"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#032F62"},children:' `<div id="someTeleport">${'}),e.jsx(s.span,{style:{color:"#24292E"},children:"content"}),e.jsx(s.span,{style:{color:"#032F62"},children:"}</div>`"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`]}),`
`,e.jsx("h2",{id:"global",children:"Global"}),`
`,e.jsx(d,{}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/bodyHtmlBegin"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/head-tags"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/client"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/onRenderHtml"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/settings#html",doNotInferSectionTitle:!0}),`
`]}),`
`]})]})}function p(l={}){const{wrapper:s}=l.components||{};return s?e.jsx(s,{...l,children:e.jsx(t,{...l})}):t(l)}const x=Object.freeze(Object.defineProperty({__proto__:null,default:p,pageSectionsExport:h},Symbol.toStringTag,{value:"Module"})),H={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:a}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/bodyHtmlEnd/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:x}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:r}}};export{H as configValuesSerialized};
