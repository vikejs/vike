import{j as e,i as l,L as s,o}from"../chunks/chunk-CVeds7zB.js";import{L as t}from"../chunks/chunk-CDGlbBNL.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-BfU7pBuA.js";/* empty css                      */const r=[{pageSectionId:"globs",pageSectionLevel:2,pageSectionTitle:"Globs"},{pageSectionId:"catch-all",pageSectionLevel:2,pageSectionTitle:"Catch-All"},{pageSectionId:"precedence",pageSectionLevel:2,pageSectionTitle:"Precedence"},{pageSectionId:"escape",pageSectionLevel:2,pageSectionTitle:"Escape `@`"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function i(a){const n={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...a.components};return e.jsxs(e.Fragment,{children:[e.jsxs(n.p,{children:["For a page ",e.jsx(n.code,{children:"/pages/movie/+Page.js"}),", you can define its Route String in an adjacent file ",e.jsx(n.code,{children:"/pages/movie/+route.js"}),"."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/movie/+route.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Match URLs such as /movie/123 or /movie/abc"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#032F62"},children:" '/movie/@id'"})]})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Route Strings and ",e.jsx(t,{href:"/route-function",children:"Route Functions"})," override ",e.jsx(t,{href:"/filesystem-routing",children:"Filesystem Routing"}),". If you always use Route Strings and Route Functions then you effectively opt-out of Filesystem Routing."]}),`
`]}),`
`,e.jsxs(n.p,{children:["The value ",e.jsx(n.code,{children:"@id"})," is available at ",e.jsx(n.code,{children:"pageContext.routeParams.id"}),"."]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`URL                   MATCH    pageContext.routeParams.id
==================    =====    ==========================
/movie/123            ✅       123
/movie/abc            ✅       abc
/movie/9Ab(@29!c      ✅       9Ab(@29!c
/movie/123/reviews    ❌
/movie                ❌
`})}),`
`,e.jsx(n.p,{children:"You can define:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Multiple parameters, for example ",e.jsx(n.code,{children:"/movie/@category/@name"}),"."]}),`
`,e.jsxs(n.li,{children:[e.jsx(t,{href:"#globs",children:"Globs"}),", for example ",e.jsx(n.code,{children:"/movie/*"})," to also match ",e.jsx(n.code,{children:"/movie/123/reviews"}),"."]}),`
`]}),`
`,e.jsxs(n.p,{children:["For more advanced routing logic, consider using a ",e.jsx(t,{href:"/route-function",children:"Route Function"})," instead of a Route String."]}),`
`,e.jsx("h2",{id:"globs",children:"Globs"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/product/+route.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#032F62"},children:" '/product/*'"})]})]})})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`URL                         MATCH /product/@id    MATCH /product/*    MATCH /product*
========================    ==================    ================    ===============
/product/123                ✅                    ✅                  ✅
/product/123/nested         ❌                    ✅                  ✅
/product/123/nested/path    ❌                    ✅                  ✅
/product                    ❌                    ❌                  ✅
`})}),`
`,e.jsxs(n.p,{children:["The value of the glob is available at ",e.jsx(n.code,{children:"pageContext.routeParams['*']"}),", for example for the Route String ",e.jsx(n.code,{children:"/product/*"}),":"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`URL                          pageContext.routeParams['*']
=========================    ============================
/product/123                 123
/product/123/nested          123/nested
/product/123/nested/path/    123/nested/path/
`})}),`
`,e.jsxs(n.p,{children:["If you define multiple globs (e.g. ",e.jsx(n.code,{children:"/*/movie/@id/*"}),"), their values are available at:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"pageContext.routeParams['*1']"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"pageContext.routeParams['*2']"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"pageContext.routeParams['*3']"})}),`
`,e.jsx(n.li,{children:"..."}),`
`]}),`
`,e.jsx("h2",{id:"catch-all",children:"Catch-All"}),`
`,e.jsxs(n.p,{children:["You can use a ",e.jsx(t,{href:"#globs",children:"glob"})," to catch all URLs:"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/catch-all/+route.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Route all URLs to a single page"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#032F62"},children:" '*'"})]})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/catch-all/+Page.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// The single page of our app."})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { Page }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// ..."})})]})})}),`
`,e.jsx("h2",{id:"precedence",children:"Precedence"}),`
`,e.jsx(n.p,{children:"Upon Route String conflicts, Vike chooses the first route from most specific to least specific."}),`
`,e.jsxs(n.p,{children:["See ",e.jsx(t,{href:"/routing-precedence"}),"."]}),`
`,e.jsxs("h2",{id:"escape",children:["Escape ",e.jsx("code",{children:"@"})]}),`
`,e.jsxs(n.p,{children:["The special character ",e.jsx(n.code,{children:"@"})," cannot be escaped, use a ",e.jsx(n.a,{href:"/route-function",children:"Route Function"})," instead."]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(t,{href:"/routing"}),`
`]}),`
`]})]})}function d(a={}){const{wrapper:n}=a.components||{};return n?e.jsx(n,{...a,children:e.jsx(i,{...a})}):i(a)}const c=Object.freeze(Object.defineProperty({__proto__:null,default:d,pageSectionsExport:r},Symbol.toStringTag,{value:"Module"})),S={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/route-string/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:c}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:s}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:l}}};export{S as configValuesSerialized};
