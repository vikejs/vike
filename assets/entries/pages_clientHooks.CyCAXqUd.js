import{j as e,i as l,L as s,o as r}from"../chunks/chunk-CLbSyNWy.js";import{L as i}from"../chunks/chunk-DAsvLARH.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-DvkY7wvd.js";/* empty css                      */const d=[{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function o(n){const t={blockquote:"blockquote",code:"code",li:"li",p:"p",ul:"ul",...n.components};return e.jsxs(e.Fragment,{children:[e.jsxs(t.p,{children:["The ",e.jsx(t.code,{children:"clientHooks"})," setting determines whether the page loads client ",e.jsx(i,{href:"/hooks",children:"hooks"}),"."]}),`
`,e.jsxs(t.p,{children:["If ",e.jsx(t.code,{children:"false"})," then no client hook is loaded on the client-side (saving KBs)."]}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsxs(t.p,{children:[e.jsx(i,{href:"/client",children:e.jsx(t.code,{children:"+client.js"})})," is always loaded, regardless of this setting. Set/",e.jsx(i,{href:"/config#inheritance",children:"override"})," the value of the ",e.jsx(t.code,{children:"client"})," setting to ",e.jsx(t.code,{children:"null"})," if you also want to skip loading ",e.jsx(t.code,{children:"+client.js"}),"."]}),`
`]}),`
`,e.jsxs(t.p,{children:["The usual use case is to control what code is loaded on the client-side for HTML-only pages, see ",e.jsx(i,{href:"/render-modes#html-only",doNotInferSectionTitle:!0}),"."]}),`
`,e.jsxs(t.p,{children:["By default, Vike sets its value to ",e.jsx(t.code,{children:"true"})," (client-side hooks are loaded) if and only if:"]}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(i,{href:"/onRenderClient",children:e.jsx(t.code,{children:"onRenderClient()"})})," is defined, and"]}),`
`,e.jsxs(t.li,{children:[e.jsx(i,{href:"/Page",children:e.jsx(t.code,{children:"Page"})})," is defined and its ",e.jsx(i,{href:"/meta#api",children:e.jsx(t.code,{children:"meta.env.client"})})," is ",e.jsx(t.code,{children:"true"}),"."]}),`
`]}),`
`,e.jsx(t.p,{children:"Use this setting to override the default:"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:["Set to ",e.jsx(t.code,{children:"false"})," if you want the page to skip loading client hooks (saving KBs)."]}),`
`,e.jsxs(t.li,{children:["Set to ",e.jsx(t.code,{children:"true"})," if you want to make sure the page loads client hooks."]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[`
`,e.jsx(i,{href:"/render-modes"}),`
`]}),`
`,e.jsxs(t.li,{children:[`
`,e.jsx(i,{href:"/render-modes#html-only"}),`
`]}),`
`,e.jsxs(t.li,{children:[`
`,e.jsx(i,{href:"/client"}),`
`]}),`
`,e.jsxs(t.li,{children:[`
`,e.jsx(i,{href:"/settings"}),`
`]}),`
`]})]})}function a(n={}){const{wrapper:t}=n.components||{};return t?e.jsx(t,{...n,children:e.jsx(o,{...n})}):o(n)}const c=Object.freeze(Object.defineProperty({__proto__:null,default:a,pageSectionsExport:d},Symbol.toStringTag,{value:"Module"})),T={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:r}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/clientHooks/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:c}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:s}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:l}}};export{T as configValuesSerialized};
