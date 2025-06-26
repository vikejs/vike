import{o,a as r}from"../chunks/chunk-CD9QEe8_.js";import{j as e}from"../chunks/chunk-Douv1U2N.js";import{L as l}from"../chunks/chunk-CFMsqHiR.js";/* empty css                      *//* empty css                      */import{C as i}from"../chunks/chunk-C00lpPpU.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */const t=[{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function s(a){const n={blockquote:"blockquote",code:"code",em:"em",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...a.components};return e.jsxs(e.Fragment,{children:[e.jsxs(n.p,{children:["A config is called ",e.jsx(n.em,{children:"global"})," when it always applies to all pages (it cannot be applied to only a subset of pages)."]}),`
`,e.jsxs(n.p,{children:["For example, ",e.jsx(l,{href:"/base-url",children:"the Base URL settings"})," are global: changing the Base URL affects your whole app (all your pages)."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["There isn't any ",e.jsx(l,{href:"/config#inheritance",children:"config inheritance"})," for global configs."]}),`
`]}),`
`,e.jsxs(n.p,{children:["Consequently, it doesn't make sense to define a global config in a local ",e.jsxs(l,{href:"/config#files",children:[e.jsx(n.code,{children:"+"})," file"]}),"."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/tags/+config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// This is a local config file: it applies only to a subset of pages."})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // ❌ Defining a global setting in a local +config.js"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  baseServer: "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'/blog/'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/+config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// This is a global config file: it applies to all pages."})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // ✅ Defining a global setting in a global +config.js"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  baseServer: "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'/blog/'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.p,{children:"If you get the following warning then move your config to a global location."}),`
`,e.jsx(i,{lineBreak:"white-space",children:e.jsx(n.pre,{children:e.jsx(n.code,{children:"[vike][Warning] /pages/index/+config.js (which is a local config file) sets the config `baseServer` but it's a global config: define `baseServer` at a global config file such as /pages/+config.js instead.\n"})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Some settings (e.g. ",e.jsx(l,{href:"/prerender",children:e.jsx(n.code,{children:"prerender"})}),") are mixed: certain values can be defined only globally (e.g. ",e.jsx(l,{href:"/prerender#partial",children:e.jsx(n.code,{children:"prerender.partial"})}),") while other values can be defined locally (e.g. ",e.jsx(l,{href:"/prerender#toggle",children:e.jsx(n.code,{children:"false"})}),")."]}),`
`,e.jsxs(n.p,{children:["If you get the following warning, it's because you're defining a global value in a local ",e.jsx(n.code,{children:"+"})," file."]}),`
`,e.jsx(i,{lineBreak:"white-space",children:e.jsx(n.pre,{children:e.jsx(n.code,{children:"[vike][Warning] /pages/about/+config.ts (which is a local config file) sets the config `prerender` to a value that is global: define global values at a global config file such as /pages/+config.ts instead.\n"})})}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{href:"/config#inheritance"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{href:"/config#files",doNotInferSectionTitle:!0}),`
`]}),`
`]})]})}function d(a={}){const{wrapper:n}=a.components||{};return n?e.jsx(n,{...a,children:e.jsx(s,{...a})}):s(a)}const c=Object.freeze(Object.defineProperty({__proto__:null,default:d,pageSectionsExport:t},Symbol.toStringTag,{value:"Module"})),T={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:r}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:o}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/warning/global-config/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:c}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{T as configValuesSerialized};
