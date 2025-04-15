import{j as e,i as t,L as a,o}from"../chunks/chunk-Bx01gX6p.js";import{L as s}from"../chunks/chunk-aIpch0jO.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-DG5OaQvo.js";/* empty css                      */const i=[{pageSectionId:"precedence",pageSectionLevel:2,pageSectionTitle:"Precedence"},{pageSectionId:"resolveroute",pageSectionLevel:2,pageSectionTitle:"`resolveRoute()`"},{pageSectionId:"typescript",pageSectionLevel:2,pageSectionTitle:"TypeScript"},{pageSectionId:"lightweight-fast",pageSectionLevel:2,pageSectionTitle:"Lightweight & fast"},{pageSectionId:"async",pageSectionLevel:2,pageSectionTitle:"Async"},{pageSectionId:"redirection",pageSectionLevel:2,pageSectionTitle:"Redirection"},{pageSectionId:"cannot-provide-pagecontext",pageSectionLevel:2,pageSectionTitle:"Cannot provide `pageContext`"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function r(l){const n={a:"a",blockquote:"blockquote",code:"code",em:"em",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...l.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.p,{children:"Route Functions provide full programmatic flexibility to define routes."}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/product/edit/+route.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// This file defines the route of /pages/product/edit/+Page.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// We use a RegExp, but we could as well use a routing library."})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" partRegex "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'part-regex'"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" routeRegex"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" partRegex"}),e.jsx(n.span,{style:{color:"#032F62"},children:"`/product/${/("}),e.jsx(n.span,{style:{color:"#005CC5"},children:"[0-9]"}),e.jsx(n.span,{style:{color:"#D73A49"},children:"+"}),e.jsx(n.span,{style:{color:"#032F62"},children:")/}/edit`"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" route"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(n.span,{style:{color:"#24292E"},children:" ("}),e.jsx(n.span,{style:{color:"#D73A49"},children:"!"}),e.jsx(n.span,{style:{color:"#24292E"},children:"pageContext.user.isAdmin) "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"return"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" false"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" match"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#24292E"},children:" pageContext.urlPathname."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"match"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(routeRegex)"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(n.span,{style:{color:"#24292E"},children:" ("}),e.jsx(n.span,{style:{color:"#D73A49"},children:"!"}),e.jsx(n.span,{style:{color:"#24292E"},children:"match) "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"return"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" false"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#24292E"},children:" [, "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"id"}),e.jsx(n.span,{style:{color:"#24292E"},children:"] "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:" match"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    routeParams: { id }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["The parameter ",e.jsx(n.code,{children:"id"})," is available at ",e.jsx(s,{href:"/pageContext",children:e.jsx(n.code,{children:"pageContext.routeParams.id"})}),"."]}),`
`]}),`
`,e.jsxs(n.p,{children:["If you merely want to guard your page, then you can use a ",e.jsx(s,{text:"Route String",href:"/route-string"})," with a ",e.jsx(s,{text:e.jsx(n.code,{children:"guard()"}),href:"/guard"})," hook instead of a Route Function."]}),`
`,e.jsx(n.p,{children:"You can use any routing tool you want, such as:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Vike's ",e.jsx(s,{text:"Route String",href:"/route-string"})," resolver ",e.jsx(n.a,{href:"#resolveroute",children:e.jsx(n.code,{children:"resolveRoute()"})})]}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://github.com/brillout/part-regex",children:"partRegex"})}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"https://www.npmjs.com/package/path-to-regexp",children:"path-to-regexp"})," (the router used by Express.js)"]}),`
`,e.jsx(n.li,{children:"etc."}),`
`]}),`
`,e.jsx("h2",{id:"precedence",children:"Precedence"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"precedence"})," number can be used to resolve route conflicts, see ",e.jsx(s,{href:"/routing-precedence"}),"."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/product/edit/+route.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { route }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" route"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#24292E"},children:" ("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // ..."})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"    precedence: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"10"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h2",{id:"resolveroute",children:e.jsx("code",{children:"resolveRoute()"})}),`
`,e.jsxs(n.p,{children:["You can use ",e.jsx(s,{text:"Route Strings",href:"/route-string"})," inside Route Functions:"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/product/edit/+route.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { route }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { resolveRoute } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/routing'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" route"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#24292E"},children:" ("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(n.span,{style:{color:"#24292E"},children:" ("}),e.jsx(n.span,{style:{color:"#D73A49"},children:"!"}),e.jsx(n.span,{style:{color:"#24292E"},children:"pageContext.user.isAdmin) {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"    return"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" false"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" resolveRoute"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#032F62"},children:"'/product/@id/edit'"}),e.jsx(n.span,{style:{color:"#24292E"},children:", pageContext.urlPathname)"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/product/index/+route.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { route }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { resolveRoute } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/routing'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" route"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#24292E"},children:" ("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  {"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"    const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" result"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" resolveRoute"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#032F62"},children:"'/product/@id'"}),e.jsx(n.span,{style:{color:"#24292E"},children:", pageContext.urlPathname)"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"    if"}),e.jsx(n.span,{style:{color:"#24292E"},children:" (result.match) {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"      result.routeParams.view "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'overview'"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"      return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" result"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" result"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" resolveRoute"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#032F62"},children:"'/product/@id/@view'"}),e.jsx(n.span,{style:{color:"#24292E"},children:", pageContext.urlPathname)"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(n.span,{style:{color:"#24292E"},children:" ("}),e.jsx(n.span,{style:{color:"#D73A49"},children:"!"}),e.jsx(n.span,{style:{color:"#24292E"},children:"["}),e.jsx(n.span,{style:{color:"#032F62"},children:"'reviews'"}),e.jsx(n.span,{style:{color:"#24292E"},children:", "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'pricing'"}),e.jsx(n.span,{style:{color:"#24292E"},children:"]."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"includes"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(result.routeParams.view)) {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"    return"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" false"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" result"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h2",{id:"typescript",children:"TypeScript"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/product/index/+route.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { route }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { RouteSync } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { resolveRoute } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/routing'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" route"}),e.jsx(n.span,{style:{color:"#D73A49"},children:":"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" RouteSync"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#24292E"},children:" ("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:")"}),e.jsx(n.span,{style:{color:"#D73A49"},children:":"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" ReturnType"}),e.jsx(n.span,{style:{color:"#24292E"},children:"<"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"RouteSync"}),e.jsx(n.span,{style:{color:"#24292E"},children:"> "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // .."})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h2",{id:"lightweight-fast",children:"Lightweight & fast"}),`
`,e.jsx(n.p,{children:"Route Functions should be lightweight and fast."}),`
`,e.jsxs(n.p,{children:["Vike executes ",e.jsx(n.em,{children:"all"})," Route Functions every time the user navigates to a new page. This means that a slow Route Function slows down all pages."]}),`
`,e.jsx(n.p,{children:"Vike always has to run all Route Functions because it cannot magically predict the outcome of Route Functions. Consider the following example:"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/login/+route.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { route }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" route"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#24292E"},children:" ("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Only render the login page to unauthenticated users"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(n.span,{style:{color:"#24292E"},children:" (pageContext.user "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"!=="}),e.jsx(n.span,{style:{color:"#005CC5"},children:" null"}),e.jsx(n.span,{style:{color:"#24292E"},children:") "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"return"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" false"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // We override all other routes by setting a high `precedence` value of `99`."})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // This means that, if the user isn't authenticated, then *all* URLs render the login page."})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"    precedence: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"99"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["This authentication routing trick is further explained at ",e.jsx(s,{href:"/auth#login-flow"}),"."]}),`
`]}),`
`,e.jsx(n.p,{children:"Vike cannot know whether another Route Function will return a higher precedence number, therefore Vike has to execute all Route Functions."}),`
`,e.jsxs(n.p,{children:["If you use ",e.jsx(s,{text:"Client Routing",href:"/client-routing"}),", then ",e.jsx(n.em,{children:"all"})," your Route Functions are loaded in the browser. This means that if a Route Function imports a lot of code, then all that code is loaded on the client-side of ",e.jsx(n.em,{children:"every"})," page. A heavy Route Function slows down your whole app."]}),`
`,e.jsx(n.p,{children:"Route Functions should be lightweight and fast."}),`
`,e.jsx("h2",{id:"async",children:"Async"}),`
`,e.jsx(n.p,{children:"Asynchronous Route Functions are forbidden."}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// +route.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// ❌ This is forbidden"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" async"}),e.jsx(n.span,{style:{color:"#24292E"},children:" () "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { "}),e.jsx(n.span,{style:{color:"#6A737D"},children:"/* ... */"}),e.jsx(n.span,{style:{color:"#24292E"},children:" }"})]})]})})}),`
`,e.jsxs(n.p,{children:[`The motivation for having an asynchronous Route Function is usually to redirect/protect a private
page. You can achieve that by using `,e.jsx(s,{href:"/render",text:e.jsx(n.code,{children:"throw render()"})})," / ",e.jsx(s,{href:"/redirect",text:e.jsx(n.code,{children:"throw redirect()"})}),`
with an async `,e.jsx(s,{text:e.jsx(n.code,{children:"guard()"}),href:"/guard"}),", async ",e.jsx(s,{text:e.jsx(n.code,{children:"data()"}),href:"/data"}),`, or
async `,e.jsx(s,{text:e.jsx(n.code,{children:"onBeforeRender()"}),href:"/onBeforeRender"})," hook."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["An asynchronous Route Function would slow down your entire app: as explained in ",e.jsx(n.a,{href:"#lightweight-fast",children:"Lightweight & fast"}),", every time the user navigates to a new page ",e.jsx(n.em,{children:"all"})," your Route Functions are called. This means that a single slow Route Function slows down ",e.jsx(n.em,{children:"all"})," your pages."]}),`
`]}),`
`,e.jsx("h2",{id:"redirection",children:"Redirection"}),`
`,e.jsxs(n.p,{children:["See ",e.jsx(s,{href:"/redirect"}),"."]}),`
`,e.jsxs("h2",{id:"cannot-provide-pagecontext",children:["Cannot provide ",e.jsx("code",{children:"pageContext"})]}),`
`,e.jsxs(n.p,{children:["Using Route Functions to provide ",e.jsx(n.code,{children:"pageContext"})," values is forbidden."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// +route.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" () "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // This is forbidden and Vike will throw an error"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    pageContext: {"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"      some: "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'value'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.p,{children:["In principle, Vike could support providing ",e.jsx(n.code,{children:"pageContext"})," values but it deliberately doesn't support it in order to foster lightweight Route Functions."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["As explained in ",e.jsx(n.a,{href:"#lightweight-fast",children:"Lightweight & fast"}),`, you should keep Route Functions simple and you shouldn't
implement complex logic in `,e.jsx(n.code,{children:"+route.js"})," files."]}),`
`]}),`
`,e.jsxs(n.p,{children:["That said, you can work around it by misusing ",e.jsx(n.code,{children:"pageContext.routeParams"})," to provide data."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// +route.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" () "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    routeParams: {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"      // Any data can be added here"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.p,{children:["But it isn't recommended: ",e.jsx(n.code,{children:"pageContext.routeParams"}),` is supposed to hold only a minimal amount of information. Instead,
we recommend to implement complex logic in `,e.jsx(s,{text:e.jsx(n.code,{children:"data()"}),href:"/data"}),`,
`,e.jsx(s,{text:e.jsx(n.code,{children:"onBeforeRender()"}),href:"/onBeforeRender"}),", ",e.jsx(s,{text:e.jsx(n.code,{children:"guard()"}),href:"/guard"}),`,
or in a `,e.jsx(s,{text:"custom hook",href:"/meta"}),"."]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/routing"}),`
`]}),`
`]})]})}function c(l={}){const{wrapper:n}=l.components||{};return n?e.jsx(n,{...l,children:e.jsx(r,{...l})}):r(l)}const d=Object.freeze(Object.defineProperty({__proto__:null,default:c,pageSectionsExport:i},Symbol.toStringTag,{value:"Module"})),D={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/route-function/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:d}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:a}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:t}}};export{D as configValuesSerialized};
