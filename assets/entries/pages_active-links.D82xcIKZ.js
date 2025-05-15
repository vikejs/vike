import{j as e,b as o,i as r,L as s,o as l}from"../chunks/chunk-X87llDnF.js";import{L as n}from"../chunks/chunk-BO_pGV8P.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-DoYOumgL.js";/* empty css                      */const d=[];function a(i){const t={blockquote:"blockquote",code:"code",li:"li",p:"p",strong:"strong",ul:"ul",...i.components};return e.jsxs(e.Fragment,{children:[e.jsxs(t.blockquote,{children:[`
`,e.jsxs(t.p,{children:[e.jsx(t.strong,{children:"What are active links?"}),` It's the practice of visually highlighting the current page in the navigation.
For example, this page named "Active Links" is highlighted with a gray background in the navigation on the left of this website.
The link is said to be "active".`]}),`
`]}),`
`,e.jsx(t.p,{children:"To implement active links:"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:["Create a new component ",e.jsx(t.code,{children:"<Link>"}),"."]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.code,{children:"<Link>"})," uses ",e.jsx(n,{href:"/usePageContext",children:e.jsx(t.code,{children:"usePageContext()"})})," to access ",e.jsx(n,{href:"/pageContext",children:e.jsx(t.code,{children:"pageContext.urlPathname"})}),"."]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.code,{children:"<Link>"})," checks whether ",e.jsx(t.code,{children:"const isActive = href === pageContext.urlPathname"})," and sets a CSS class accordingly ",e.jsx(t.code,{children:'<a class="is-active">'}),"."]}),`
`]}),`
`,e.jsx(t.p,{children:"Examples:"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:["React: ",e.jsx(o,{path:"/boilerplates/boilerplate-react/renderer/Link.jsx"})]}),`
`,e.jsxs(t.li,{children:["Vue: ",e.jsx(o,{path:"/boilerplates/boilerplate-vue/renderer/Link.vue"})]}),`
`]}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsxs(t.p,{children:["You cannot use ",e.jsx(t.code,{children:"window.location.pathname"}),` if you use SSR, because it isn't available when the page is rendered on the server-side.
If you have set `,e.jsx(n,{href:"/ssr",children:e.jsx(t.code,{children:"ssr: false"})}),", then you can use ",e.jsx(t.code,{children:"window.location.pathname"})," instead of ",e.jsx(t.code,{children:"pageContext.urlPathname"}),"."]}),`
`]})]})}function c(i={}){const{wrapper:t}=i.components||{};return t?e.jsx(t,{...i,children:e.jsx(a,{...i})}):a(i)}const h=Object.freeze(Object.defineProperty({__proto__:null,default:c,pageSectionsExport:d},Symbol.toStringTag,{value:"Module"})),b={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:l}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/active-links/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:h}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:s}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:r}}};export{b as configValuesSerialized};
