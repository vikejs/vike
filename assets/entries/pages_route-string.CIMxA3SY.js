import{o as r,a as d}from"../chunks/chunk-CxIOOiKX.js";import{j as e}from"../chunks/chunk-B35a6FX-.js";import{L as t}from"../chunks/chunk-BbfG-aTg.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as s}from"../chunks/chunk-CJvpbNqo.js";/* empty css                      *//* empty css                      *//* empty css                      */const c=[{pageSectionId:"globs",pageSectionLevel:2,pageSectionTitle:"Globs"},{pageSectionId:"catch-all",pageSectionLevel:2,pageSectionTitle:"Catch-All"},{pageSectionId:"precedence",pageSectionLevel:2,pageSectionTitle:"Precedence"},{pageSectionId:"escape",pageSectionLevel:2,pageSectionTitle:"Escape `@`"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function l(n){const a={a:"a",blockquote:"blockquote",code:"code",div:"div",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...s(),...n.components},{ChoiceGroup:i}=a;return i||h("ChoiceGroup"),e.jsxs(e.Fragment,{children:[e.jsxs(a.p,{children:["For a page ",e.jsx(a.code,{children:"/pages/movie/+Page.js"}),", you can define its Route String in an adjacent file ",e.jsx(a.code,{children:"/pages/movie/+route.js"}),"."]}),`
`,e.jsxs(i,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",hide:!0,children:[e.jsx(a.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(a.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(a.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(a.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(a.span,{"data-line":"",children:e.jsx(a.span,{style:{color:"#6A737D"},children:"// /pages/movie/+route.js"})}),`
`,e.jsx(a.span,{"data-line":"",children:" "}),`
`,e.jsx(a.span,{"data-line":"",children:e.jsx(a.span,{style:{color:"#6A737D"},children:"// Match URLs such as /movie/123 or /movie/abc"})}),`
`,e.jsxs(a.span,{"data-line":"",children:[e.jsx(a.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(a.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(a.span,{style:{color:"#032F62"},children:" '/movie/@id'"})]})]})})})}),e.jsx(a.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(a.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(a.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(a.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(a.span,{"data-line":"",children:e.jsx(a.span,{style:{color:"#6A737D"},children:"// /pages/movie/+route.ts"})}),`
`,e.jsx(a.span,{"data-line":"",children:" "}),`
`,e.jsx(a.span,{"data-line":"",children:e.jsx(a.span,{style:{color:"#6A737D"},children:"// Match URLs such as /movie/123 or /movie/abc"})}),`
`,e.jsxs(a.span,{"data-line":"",children:[e.jsx(a.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(a.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(a.span,{style:{color:"#032F62"},children:" '/movie/@id'"})]})]})})})})]}),`
`,e.jsxs(a.blockquote,{children:[`
`,e.jsxs(a.p,{children:["Route Strings and ",e.jsx(t,{href:"/route-function",children:"Route Functions"})," override ",e.jsx(t,{href:"/filesystem-routing",children:"Filesystem Routing"}),". If you always use Route Strings and Route Functions then you effectively opt-out of Filesystem Routing."]}),`
`]}),`
`,e.jsxs(a.p,{children:["The value ",e.jsx(a.code,{children:"@id"})," is available at ",e.jsx(a.code,{children:"pageContext.routeParams.id"}),"."]}),`
`,e.jsx(a.pre,{children:e.jsx(a.code,{children:`URL                   MATCH    pageContext.routeParams.id
==================    =====    ==========================
/movie/123            ✅       123
/movie/abc            ✅       abc
/movie/9Ab(@29!c      ✅       9Ab(@29!c
/movie/123/reviews    ❌
/movie                ❌
`})}),`
`,e.jsx(a.p,{children:"You can define:"}),`
`,e.jsxs(a.ul,{children:[`
`,e.jsxs(a.li,{children:["Multiple parameters, for example ",e.jsx(a.code,{children:"/movie/@category/@name"}),"."]}),`
`,e.jsxs(a.li,{children:[e.jsx(t,{href:"#globs",children:"Globs"}),", for example ",e.jsx(a.code,{children:"/movie/*"})," to also match ",e.jsx(a.code,{children:"/movie/123/reviews"}),"."]}),`
`]}),`
`,e.jsxs(a.p,{children:["For more advanced routing logic, consider using a ",e.jsx(t,{href:"/route-function",children:"Route Function"})," instead of a Route String."]}),`
`,e.jsx("h2",{id:"globs",children:"Globs"}),`
`,e.jsxs(i,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",hide:!0,children:[e.jsx(a.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(a.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(a.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(a.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(a.span,{"data-line":"",children:e.jsx(a.span,{style:{color:"#6A737D"},children:"// /pages/product/+route.js"})}),`
`,e.jsx(a.span,{"data-line":"",children:" "}),`
`,e.jsxs(a.span,{"data-line":"",children:[e.jsx(a.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(a.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(a.span,{style:{color:"#032F62"},children:" '/product/*'"})]})]})})})}),e.jsx(a.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(a.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(a.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(a.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(a.span,{"data-line":"",children:e.jsx(a.span,{style:{color:"#6A737D"},children:"// /pages/product/+route.ts"})}),`
`,e.jsx(a.span,{"data-line":"",children:" "}),`
`,e.jsxs(a.span,{"data-line":"",children:[e.jsx(a.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(a.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(a.span,{style:{color:"#032F62"},children:" '/product/*'"})]})]})})})})]}),`
`,e.jsx(a.pre,{children:e.jsx(a.code,{children:`URL                         MATCH /product/@id    MATCH /product/*    MATCH /product*
========================    ==================    ================    ===============
/product/123                ✅                    ✅                  ✅
/product/123/nested         ❌                    ✅                  ✅
/product/123/nested/path    ❌                    ✅                  ✅
/product                    ❌                    ❌                  ✅
`})}),`
`,e.jsxs(a.p,{children:["The value of the glob is available at ",e.jsx(a.code,{children:"pageContext.routeParams['*']"}),", for example for the Route String ",e.jsx(a.code,{children:"/product/*"}),":"]}),`
`,e.jsx(a.pre,{children:e.jsx(a.code,{children:`URL                          pageContext.routeParams['*']
=========================    ============================
/product/123                 123
/product/123/nested          123/nested
/product/123/nested/path/    123/nested/path/
`})}),`
`,e.jsxs(a.p,{children:["If you define multiple globs (e.g. ",e.jsx(a.code,{children:"/*/movie/@id/*"}),"), their values are available at:"]}),`
`,e.jsxs(a.ul,{children:[`
`,e.jsx(a.li,{children:e.jsx(a.code,{children:"pageContext.routeParams['*1']"})}),`
`,e.jsx(a.li,{children:e.jsx(a.code,{children:"pageContext.routeParams['*2']"})}),`
`,e.jsx(a.li,{children:e.jsx(a.code,{children:"pageContext.routeParams['*3']"})}),`
`,e.jsx(a.li,{children:"..."}),`
`]}),`
`,e.jsx("h2",{id:"catch-all",children:"Catch-All"}),`
`,e.jsxs(a.p,{children:["You can use a ",e.jsx(t,{href:"#globs",children:"glob"})," to catch all URLs:"]}),`
`,e.jsxs(i,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",hide:!0,children:[e.jsx(a.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(a.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(a.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(a.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(a.span,{"data-line":"",children:e.jsx(a.span,{style:{color:"#6A737D"},children:"// /pages/catch-all/+route.js"})}),`
`,e.jsx(a.span,{"data-line":"",children:" "}),`
`,e.jsx(a.span,{"data-line":"",children:e.jsx(a.span,{style:{color:"#6A737D"},children:"// Route all URLs to a single page"})}),`
`,e.jsxs(a.span,{"data-line":"",children:[e.jsx(a.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(a.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(a.span,{style:{color:"#032F62"},children:" '*'"})]})]})})})}),e.jsx(a.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(a.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(a.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(a.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(a.span,{"data-line":"",children:e.jsx(a.span,{style:{color:"#6A737D"},children:"// /pages/catch-all/+route.ts"})}),`
`,e.jsx(a.span,{"data-line":"",children:" "}),`
`,e.jsx(a.span,{"data-line":"",children:e.jsx(a.span,{style:{color:"#6A737D"},children:"// Route all URLs to a single page"})}),`
`,e.jsxs(a.span,{"data-line":"",children:[e.jsx(a.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(a.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(a.span,{style:{color:"#032F62"},children:" '*'"})]})]})})})})]}),`
`,e.jsxs(i,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(a.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(a.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(a.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(a.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(a.span,{"data-line":"",children:e.jsx(a.span,{style:{color:"#6A737D"},children:"// /pages/catch-all/+Page.js"})}),`
`,e.jsx(a.span,{"data-line":"",children:" "}),`
`,e.jsx(a.span,{"data-line":"",children:e.jsx(a.span,{style:{color:"#6A737D"},children:"// The single page of our app."})}),`
`,e.jsxs(a.span,{"data-line":"",children:[e.jsx(a.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(a.span,{style:{color:"#24292E"},children:" { Page }"})]}),`
`,e.jsx(a.span,{"data-line":"",children:" "}),`
`,e.jsx(a.span,{"data-line":"",children:e.jsx(a.span,{style:{color:"#6A737D"},children:"// ..."})})]})})})}),e.jsx(a.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(a.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(a.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(a.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(a.span,{"data-line":"",children:e.jsx(a.span,{style:{color:"#6A737D"},children:"// /pages/catch-all/+Page.ts"})}),`
`,e.jsx(a.span,{"data-line":"",children:" "}),`
`,e.jsx(a.span,{"data-line":"",children:e.jsx(a.span,{style:{color:"#6A737D"},children:"// The single page of our app."})}),`
`,e.jsxs(a.span,{"data-line":"",children:[e.jsx(a.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(a.span,{style:{color:"#24292E"},children:" { Page }"})]}),`
`,e.jsx(a.span,{"data-line":"",children:" "}),`
`,e.jsx(a.span,{"data-line":"",children:e.jsx(a.span,{style:{color:"#6A737D"},children:"// ..."})})]})})})})]}),`
`,e.jsx("h2",{id:"precedence",children:"Precedence"}),`
`,e.jsx(a.p,{children:"Upon Route String conflicts, Vike chooses the first route from most specific to least specific."}),`
`,e.jsxs(a.p,{children:["See ",e.jsx(t,{href:"/routing-precedence"}),"."]}),`
`,e.jsxs("h2",{id:"escape",children:["Escape ",e.jsx("code",{children:"@"})]}),`
`,e.jsxs(a.p,{children:["The special character ",e.jsx(a.code,{children:"@"})," cannot be escaped, use a ",e.jsx(a.a,{href:"/route-function",children:"Route Function"})," instead."]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(a.ul,{children:[`
`,e.jsxs(a.li,{children:[`
`,e.jsx(t,{href:"/routing"}),`
`]}),`
`]})]})}function o(n={}){const{wrapper:a}={...s(),...n.components};return a?e.jsx(a,{...n,children:e.jsx(l,{...n})}):l(n)}function h(n,a){throw new Error("Expected component `"+n+"` to be defined: you likely forgot to import, pass, or provide it.")}const p=Object.freeze(Object.defineProperty({__proto__:null,default:o,pageSectionsExport:c},Symbol.toStringTag,{value:"Module"})),P={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:d}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:r}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/route-string/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:p}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{P as configValuesSerialized};
