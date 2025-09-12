import{o as i,a as r}from"../chunks/chunk-eD_Oz-vE.js";import{j as e}from"../chunks/chunk-CC4ltPc3.js";import{L as s}from"../chunks/chunk-DFQUjVEP.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{C as o}from"../chunks/chunk-CvFcKlTK.js";/* empty css                      */import"../chunks/chunk-dnLs9nqY.js";/* empty css                      */const a=[{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function l(t){const n={blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{env:"server",isTypeOneLiner:!0,children:e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsx(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#032F62"},children:"'HTML_BEGIN'"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" |"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'HTML_END'"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" |"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'STREAM'"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" |"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" null"})]})})})})}),`
`,e.jsx(n.p,{children:"Vike injects scripts at three possible positions:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"At the end of the HTML."}),`
`,e.jsx(n.li,{children:"At the beginning of the HTML."}),`
`,e.jsxs(n.li,{children:["At the beginning of the ",e.jsx(s,{href:"/streaming",children:"HTML stream"}),"."]}),`
`]}),`
`,e.jsx(n.p,{children:"Depending on heuristics, Vike makes a sensible choice about where to inject scripts."}),`
`,e.jsxs(n.p,{children:["You can use the ",e.jsx(n.code,{children:"injectScriptsAt"})," setting to override Vike's heuristics and control where Vike injects scripts."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Alternatively, for a more fine-grained control of where and what assets Vike injects, use ",e.jsx(s,{href:"/injectFilter",children:e.jsx(n.code,{children:"injectFilter()"})}),"."]}),`
`]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// +config.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Inject scripts at the beginning of the HTML"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  injectScriptsAt: "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'HTML_BEGIN'"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Inject scripts at the end of the HTML"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  injectScriptsAt: "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'HTML_END'"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Inject scripts at the beginning of the HTML stream"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  injectScriptsAt: "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'STREAM'"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Let Vike decide"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  injectScriptsAt: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"null"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"} "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Setting ",e.jsx(n.code,{children:"injectAssetsAt"})," to ",e.jsx(n.code,{children:"null"})," can be useful in the context of ",e.jsx(s,{href:"/config#inheritance",children:"config inheritance"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/injectFilter"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/settings"}),`
`]}),`
`]})]})}function c(t={}){const{wrapper:n}=t.components||{};return n?e.jsx(n,{...t,children:e.jsx(l,{...t})}):l(t)}const d=Object.freeze(Object.defineProperty({__proto__:null,default:c,pageSectionsExport:a},Symbol.toStringTag,{value:"Module"})),C={serverOnlyHooks:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:r}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:i}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/injectScriptsAt/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:d}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{C as configValuesSerialized};
