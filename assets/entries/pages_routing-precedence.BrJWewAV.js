import{j as e,i as l,L as t,o}from"../chunks/chunk-CLbSyNWy.js";/* empty css                      */import"../chunks/chunk-DvkY7wvd.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */const i=[];function r(s){const n={a:"a",blockquote:"blockquote",br:"br",code:"code",figure:"figure",li:"li",ol:"ol",p:"p",pre:"pre",span:"span",strong:"strong",...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.p,{children:"When the route of two pages match the same URL, there is a routing conflict: Vike has to decide which one to render for that URL."}),`
`,e.jsx(n.p,{children:"Upon Route String conflicts, Vike chooses the first route from most specific to least specific. For example:"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"/about/team"})," (most specific: it matches only a single URL)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"/about/@path"})," (less specific: it also matches ",e.jsx(n.code,{children:"/about/company"}),", ",e.jsx(n.code,{children:"/about/vision"}),", ...)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"/about/*"})," (less specific: it also matches ",e.jsx(n.code,{children:"/about/some/nested/path"}),")"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"/*"})," (least specific: it matches all URLs)"]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["You can find more examples at ",e.jsx(n.a,{href:"https://github.com/vikejs/vike/blob/main/vike/shared/route/resolvePrecedence/resolvePrecedence_route-strings.spec.ts",children:e.jsx(n.code,{children:"resolvePrecedence_route-strings.spec.ts"})}),"."]}),`
`]}),`
`,e.jsx(n.p,{children:"Upon conflicts between Filesystem Routing, Route Strings and Route Functions, Vike chooses the first route in following order:"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:["Route Function, returned high positive ",e.jsx(n.code,{children:"precedence"})," number (e.g. ",e.jsx(n.code,{children:"99"}),")"]}),`
`,e.jsxs(n.li,{children:["Route Function, returned low positive ",e.jsx(n.code,{children:"precedence"})," number (e.g. ",e.jsx(n.code,{children:"1"}),")"]}),`
`,e.jsx(n.li,{children:"Filesystem Routing"}),`
`,e.jsxs(n.li,{children:["Route String, static (i.e. without ",e.jsx(n.code,{children:"@"}),"/",e.jsx(n.code,{children:"*"})," parameter segment, e.g. ",e.jsx(n.code,{children:"/about/company"}),")"]}),`
`,e.jsxs(n.li,{children:["Route Function, returned no ",e.jsx(n.code,{children:"precedence"})," number (or ",e.jsx(n.code,{children:"0"}),")"]}),`
`,e.jsxs(n.li,{children:["Route String, parameterized (i.e. with ",e.jsx(n.code,{children:"@"}),"/",e.jsx(n.code,{children:"*"})," parameter segment, e.g. ",e.jsx(n.code,{children:"/product/@productId"})," or ",e.jsx(n.code,{children:"/product/*"}),")"]}),`
`,e.jsxs(n.li,{children:["Route Function, returned low negative ",e.jsx(n.code,{children:"precedence"})," number (e.g. ",e.jsx(n.code,{children:"-1"}),")"]}),`
`,e.jsxs(n.li,{children:["Route Function, returned high negative ",e.jsx(n.code,{children:"precedence"})," number (e.g. ",e.jsx(n.code,{children:"-99"}),")"]}),`
`]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Example (4) + (6) + (7)"}),":"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// product/list/+route.js"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#032F62"},children:" '/product'"})]})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// product/item/+route.js"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#032F62"},children:" '/product/@productId'"})]})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// product/catch-all/+route.js"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#E36209"},children:" pageContext"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" =>"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(n.span,{style:{color:"#24292E"},children:" ("}),e.jsx(n.span,{style:{color:"#D73A49"},children:"!"}),e.jsx(n.span,{style:{color:"#24292E"},children:"pageContext.urlPathname."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"startsWith"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#032F62"},children:"'/product/'"}),e.jsx(n.span,{style:{color:"#24292E"},children:")) "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"return"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" false"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"    precedence: "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"-"}),e.jsx(n.span,{style:{color:"#005CC5"},children:"1"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    pageContext: {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"      // E.g. redirect `/product/wrong/url` to `/product`"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"      redirectTo: "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'/product'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`URL                           MATCHES                                WINNER
==================            ===============================        ======
/product/42                   product/item/+route.js      (6)        ⬅️
                              product/catch-all/+route.js (7)
`})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`URL                           MATCHES                                WINNER
==================            ===============================        ======
/product                      product/list/+route.js      (4)        ⬅️
                              product/catch-all/+route.js (7)
`})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`URL                           MATCHES                                WINNER
==================            ===============================        ======
/product/wrong/url            product/catch-all/+route.js (7)        ⬅️
`})}),`
`,e.jsxs(n.p,{children:["4: Route String, static (without ",e.jsx(n.code,{children:"@param"})," segment, e.g. ",e.jsx(n.code,{children:"/about/company"}),")",e.jsx(n.br,{}),`
`,"6: Route String, parameterized (with ",e.jsx(n.code,{children:"@param"})," segments, e.g. ",e.jsx(n.code,{children:"/product/@productId"})," or ",e.jsx(n.code,{children:"/product/*"}),")",e.jsx(n.br,{}),`
`,"7: Route Function, returned low negative ",e.jsx(n.code,{children:"precedence"})," number (e.g. ",e.jsx(n.code,{children:"-1"}),")"]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Example (1) + (4)"}),":"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// admin/+route.js"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#032F62"},children:" '/admin'"})]})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// login/+route.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#E36209"},children:" pageContext"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" =>"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(n.span,{style:{color:"#24292E"},children:"( pageContext.user "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"==="}),e.jsx(n.span,{style:{color:"#005CC5"},children:" null"}),e.jsx(n.span,{style:{color:"#24292E"},children:" ) {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"    return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"      precedence: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"99"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" false"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`URL                   pageContext.user       MATCHES                   WINNER
======                ================       ===================       ======
/admin                null                   login/+route.js (1)       ⬅️
                                             admin/+route.js (4)
`})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`URL                   pageContext.user       MATCHES                   WINNER
======                ================       ===================       ======
/admin                'brillout'             admin/+route.js (4)       ⬅️
`})}),`
`,e.jsxs(n.p,{children:["1: Route Function, returned high positive ",e.jsx(n.code,{children:"precedence"})," number",e.jsx(n.br,{}),`
`,"4: Route String, static (without ",e.jsx(n.code,{children:"@param"})," segment, e.g. ",e.jsx(n.code,{children:"/about/company"}),")"]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["More examples at ",e.jsx(n.a,{href:"https://github.com/vikejs/vike/blob/main/vike/shared/route/resolvePrecedence/resolvePrecedence_overall.spec.ts",children:e.jsx(n.code,{children:"resolvePrecedence_overall.spec.ts"})}),"."]}),`
`]})]})}function c(s={}){const{wrapper:n}=s.components||{};return n?e.jsx(n,{...s,children:e.jsx(r,{...s})}):r(s)}const d=Object.freeze(Object.defineProperty({__proto__:null,default:c,pageSectionsExport:i},Symbol.toStringTag,{value:"Module"})),b={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/routing-precedence/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:d}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:t}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:l}}};export{b as configValuesSerialized};
