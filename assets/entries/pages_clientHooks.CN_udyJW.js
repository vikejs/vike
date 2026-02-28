import{o as r,a as s}from"../chunks/chunk-CxIOOiKX.js";import{j as e}from"../chunks/chunk-B35a6FX-.js";import{L as t}from"../chunks/chunk-BbfG-aTg.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as l}from"../chunks/chunk-CJvpbNqo.js";/* empty css                      */import{C as d}from"../chunks/chunk-BLfhGi7M.js";/* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-DuyKlQcD.js";/* empty css                      */const a=[{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function o(i){const n={blockquote:"blockquote",code:"code",li:"li",p:"p",span:"span",ul:"ul",...l(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(d,{env:"config",isTypeOneLiner:!0,children:e.jsx(n.p,{children:e.jsx(n.span,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.code,{"data-language":"ts","data-theme":"github-light",children:e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"boolean "})})})})})}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"clientHooks"})," setting determines whether the page loads client ",e.jsx(t,{href:"/hooks",children:"hooks"}),"."]}),`
`,e.jsxs(n.p,{children:["If ",e.jsx(n.code,{children:"false"})," then no client hook is loaded on the client-side (saving KBs)."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(t,{href:"/client",children:e.jsx(n.code,{children:"+client.js"})})," is always loaded, regardless of this setting. Set/",e.jsx(t,{href:"/config#inheritance",children:"override"})," the value of the ",e.jsx(n.code,{children:"client"})," setting to ",e.jsx(n.code,{children:"null"})," if you also want to skip loading ",e.jsx(n.code,{children:"+client.js"}),"."]}),`
`]}),`
`,e.jsxs(n.p,{children:["The usual use case is to control what code is loaded on the client-side for HTML-only pages, see ",e.jsx(t,{href:"/render-modes#html-only",doNotInferSectionTitle:!0}),"."]}),`
`,e.jsxs(n.p,{children:["By default, Vike sets its value to ",e.jsx(n.code,{children:"true"})," (client-side hooks are loaded) if and only if:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(t,{href:"/onRenderClient",children:e.jsx(n.code,{children:"onRenderClient()"})})," is defined, and"]}),`
`,e.jsxs(n.li,{children:[e.jsx(t,{href:"/Page",children:e.jsx(n.code,{children:"Page"})})," is defined and its ",e.jsx(t,{href:"/meta#api",children:e.jsx(n.code,{children:"meta.env.client"})})," is ",e.jsx(n.code,{children:"true"}),"."]}),`
`]}),`
`,e.jsx(n.p,{children:"Use this setting to override the default:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Set to ",e.jsx(n.code,{children:"false"})," if you want the page to skip loading client hooks (saving KBs)."]}),`
`,e.jsxs(n.li,{children:["Set to ",e.jsx(n.code,{children:"true"})," if you want to make sure the page loads client hooks."]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(t,{href:"/render-modes"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(t,{href:"/render-modes#html-only"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(t,{href:"/client"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(t,{href:"/settings"}),`
`]}),`
`]})]})}function c(i={}){const{wrapper:n}={...l(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(o,{...i})}):o(i)}const h=Object.freeze(Object.defineProperty({__proto__:null,default:c,pageSectionsExport:a},Symbol.toStringTag,{value:"Module"})),E={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:s}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:r}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/clientHooks/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:h}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{E as configValuesSerialized};
