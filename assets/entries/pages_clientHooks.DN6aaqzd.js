import{o as l,a as s}from"../chunks/chunk-B4JfPEMQ.js";import{j as e}from"../chunks/chunk-D_tQTwD-.js";import{L as t}from"../chunks/chunk-CaxrPmIz.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */const r=[{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function o(i){const n={blockquote:"blockquote",code:"code",li:"li",p:"p",ul:"ul",...i.components};return e.jsxs(e.Fragment,{children:[e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"clientHooks"})," setting determines whether the page loads client ",e.jsx(t,{href:"/hooks",children:"hooks"}),"."]}),`
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
`]})]})}function d(i={}){const{wrapper:n}=i.components||{};return n?e.jsx(n,{...i,children:e.jsx(o,{...i})}):o(i)}const a=Object.freeze(Object.defineProperty({__proto__:null,default:d,pageSectionsExport:r},Symbol.toStringTag,{value:"Module"})),v={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:s}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:l}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/clientHooks/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:a}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{v as configValuesSerialized};
