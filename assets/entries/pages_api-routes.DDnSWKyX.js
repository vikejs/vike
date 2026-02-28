import{o as l,a as s}from"../chunks/chunk-CxIOOiKX.js";import{j as e}from"../chunks/chunk-B35a6FX-.js";import{L as o}from"../chunks/chunk-BbfG-aTg.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as i}from"../chunks/chunk-CJvpbNqo.js";/* empty css                      *//* empty css                      *//* empty css                      */const a=[{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function r(n){const t={a:"a",blockquote:"blockquote",code:"code",li:"li",p:"p",ul:"ul",...i(),...n.components};return e.jsxs(e.Fragment,{children:[e.jsxs(t.p,{children:["Vike doesn't include built-in support for ",e.jsx(t.a,{href:"https://nextjs.org/docs/api-routes/introduction",children:"API routes"})," by design."]}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsxs(t.p,{children:["We believe API tools ",e.jsx(o,{href:"/why#flourishing-do-one-thing-do-it-well-ecosystem",children:"should be developed independently"})," of Vike."]}),`
`]}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsxs(t.p,{children:["See ",e.jsx(o,{href:"/data-fetching"})," for a general introduction about fetching data with Vike."]}),`
`]}),`
`,e.jsxs(t.p,{children:["We generally recommend using ",e.jsx(t.a,{href:"https://telefunc.com",children:"Telefunc"})," (or another RPC tool) instead of API routes, see ",e.jsx(o,{href:"/RPC"}),"."]}),`
`,e.jsx(t.p,{children:"That said, creating API routes can make sense:"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsx(t.li,{children:"For specific needs where Telefunc doesn't fit, such as file uploads or fine-grained HTTP cache control."}),`
`,e.jsx(t.li,{children:"If you only need a handful of endpoints, creating a couple of API routes can be simpler than adding a new tool to your stack."}),`
`]}),`
`,e.jsxs(t.p,{children:["To achieve a similar DX as API routes, you can use a server like ",e.jsx(t.a,{href:"https://expressjs.com",children:"Express.js"})," or ",e.jsx(t.a,{href:"https://hono.dev",children:"Hono"})," to create server routes that handle HTTP ",e.jsx(t.code,{children:"GET"}),"/",e.jsx(t.code,{children:"POST"})," endpoints."]}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsxs(t.p,{children:["Make sure ",e.jsx(o,{href:"/renderPage",children:"Vike's middleware"})," is your last middleware. (It's a catch-all middleware so it would override your API routes.)"]}),`
`]}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsxs(t.p,{children:["If you don't use ",e.jsx(o,{href:"/vike-photon",children:e.jsx(t.code,{children:"vike-photon"})}),", then you may need to manually restart your server for changes to take effect."]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[`
`,e.jsx(o,{href:"/RPC"}),`
`]}),`
`,e.jsxs(t.li,{children:[`
`,e.jsx(o,{href:"/data-fetching"}),`
`]}),`
`,e.jsxs(t.li,{children:[`
`,e.jsx(o,{href:"/server-integration"}),`
`]}),`
`]})]})}function d(n={}){const{wrapper:t}={...i(),...n.components};return t?e.jsx(t,{...n,children:e.jsx(r,{...n})}):r(n)}const c=Object.freeze(Object.defineProperty({__proto__:null,default:d,pageSectionsExport:a},Symbol.toStringTag,{value:"Module"})),w={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:s}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:l}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/api-routes/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:c}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{w as configValuesSerialized};
