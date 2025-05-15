import{j as e,i as a,L as i,o}from"../chunks/chunk-Q99tO9V-.js";import{L as s}from"../chunks/chunk-B2tJ4ijZ.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-DR98Rfxn.js";/* empty css                      */import{a as l}from"../chunks/chunk-B-lm3by4.js";/* empty css                      *//* empty css                      */const c=[{pageSectionId:"built-in",pageSectionLevel:2,pageSectionTitle:"Built-in"},{pageSectionId:"custom",pageSectionLevel:2,pageSectionTitle:"Custom"},{pageSectionId:"hooks",pageSectionLevel:3,pageSectionTitle:"Hooks"},{pageSectionId:"ui-components",pageSectionLevel:3,pageSectionTitle:"UI components"},{pageSectionId:"navigate",pageSectionLevel:3,pageSectionTitle:"`navigate()`"},{pageSectionId:"renderpage",pageSectionLevel:3,pageSectionTitle:"`renderPage()`"},{pageSectionId:"faq",pageSectionLevel:2,pageSectionTitle:"FAQ"},{pageSectionId:"can-i-mutate-pagecontext",pageSectionLevel:3,pageSectionTitle:"Can I mutate `pageContext`?"},{pageSectionId:"can-i-use-pagecontext-as-a-ui-store",pageSectionLevel:3,pageSectionTitle:"Can I use `pageContext` as a UI store?"},{pageSectionId:"can-i-check-whether-ssr-is-enabled",pageSectionLevel:3,pageSectionTitle:"Can I check whether SSR is enabled?"},{pageSectionId:"typescript",pageSectionLevel:2,pageSectionTitle:"TypeScript"},{pageSectionId:"basics",pageSectionLevel:3,pageSectionTitle:"Basics"},{pageSectionId:"narrowing-down",pageSectionLevel:3,pageSectionTitle:"Narrowing down"},{pageSectionId:"extend",pageSectionLevel:3,pageSectionTitle:"Extend"},{pageSectionId:"server-routing",pageSectionLevel:3,pageSectionTitle:"Server Routing"},{pageSectionId:"lifecycle",pageSectionLevel:2,pageSectionTitle:"Lifecycle"},{pageSectionId:"server",pageSectionLevel:3,pageSectionTitle:"Server"},{pageSectionId:"client",pageSectionLevel:3,pageSectionTitle:"Client"},{pageSectionId:"pre-rendering",pageSectionLevel:3,pageSectionTitle:"Pre-rendering"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function t(r){const n={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...r.components};return e.jsxs(e.Fragment,{children:[e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"pageContext"})," object provides contextual information about the current page."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/product/@id/+data.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" data"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Common built-in properties"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  pageContext.urlParsed.pathname "}),e.jsx(n.span,{style:{color:"#6A737D"},children:"// /product/42"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  pageContext.routeParams.id "}),e.jsx(n.span,{style:{color:"#6A737D"},children:"// 42"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  pageContext.headers "}),e.jsx(n.span,{style:{color:"#6A737D"},children:"// { cookie: 'user-id=1337', ... }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Common custom properties"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  pageContext.user "}),e.jsx(n.span,{style:{color:"#6A737D"},children:"// { name: 'John', id: 1337 }"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  pageContext.initialStoreState "}),e.jsx(n.span,{style:{color:"#6A737D"},children:"// { todoList: [{ id: 1718872184291, text: 'Buy milk' }] }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"+data"})," hook is explained at ",e.jsx(s,{href:"/data-fetching"}),"."]}),`
`]}),`
`,e.jsxs(n.p,{children:["You can access ",e.jsx(n.code,{children:"pageContext"}),":"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["In any UI component (by using ",e.jsx(s,{href:"/usePageContext",children:e.jsx(n.code,{children:"usePageContext()"})}),")."]}),`
`,e.jsxs(n.li,{children:["In any ",e.jsx(s,{href:"/hooks",children:"Vike hook"}),", e.g. ",e.jsx(s,{href:"/data",children:e.jsx(n.code,{children:"+data"})}),"."]}),`
`,e.jsxs(n.li,{children:["On both the server and client (by using ",e.jsx(s,{href:"/passToClient",children:e.jsx(n.code,{children:"passToClient"})}),")."]}),`
`]}),`
`,e.jsx(n.p,{children:"It includes:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(s,{href:"#built-in",children:"Built-in properties"}),", e.g. ",e.jsx(n.code,{children:"pageContext.urlParsed"})," and ",e.jsx(n.code,{children:"pageContext.routeParams"}),"."]}),`
`,e.jsxs(n.li,{children:[e.jsx(s,{href:"#custom",children:"Custom properties"})," that you can add, for example ",e.jsx(n.code,{children:"pageContext.user"}),"."]}),`
`]}),`
`,e.jsxs(n.p,{children:["When the user navigates to a new page, a completely new ",e.jsx(n.code,{children:"pageContext"})," object is created and the previous ",e.jsx(n.code,{children:"pageContext"})," becomes obsolete — that's why it's called ",e.jsx(n.strong,{children:"page"}),"Context, not ",e.jsx(n.strong,{children:"app"}),"Context. See ",e.jsx(s,{href:"#lifecycle"})," for more information."]}),`
`,e.jsxs(n.p,{children:["See also: ",e.jsx(s,{href:"/globalContext"}),"."]}),`
`,e.jsx("h2",{id:"built-in",children:"Built-in"}),`
`,e.jsx(n.p,{children:"Built-in properties."}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"pageContext"})," object also contains many internals (they are prefixed with ",e.jsx(n.code,{children:"_"}),", e.g. ",e.jsx(n.code,{children:"pageContext._httpRequestId"}),"). You should use them only if strictly needed and, if you do, then let us know so that we can add official support for your use case (otherwise you'll expose yourself to breaking changes upon any version update)."]}),`
`]}),`
`,e.jsx(l,{name:"Page"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"export { Page }"})," or ",e.jsx(n.code,{children:"export default"})," of the ",e.jsxs(s,{href:"/Page",children:[e.jsx(n.code,{children:"+Page.js"})," file"]}),"."]}),`
`,e.jsx(l,{name:"data"}),`
`,e.jsxs(n.p,{children:["The value returned by the ",e.jsxs(s,{href:"/data",children:[e.jsx(n.code,{children:"data()"})," hook"]}),", see also ",e.jsx(s,{href:"/useData"}),"."]}),`
`,e.jsx(l,{name:"routeParams"}),`
`,e.jsxs(n.p,{children:["The route parameters. (E.g. ",e.jsx(n.code,{children:"pageContext.routeParams.movieId"})," for a page with a Route String ",e.jsx(n.code,{children:"/movie/@movieId"}),".)"]}),`
`,e.jsx(l,{name:"urlOriginal"}),`
`,e.jsx(n.p,{children:"The current URL."}),`
`,e.jsxs(n.p,{children:["On the server-side, ",e.jsx(n.code,{children:"pageContext.urlOriginal"})," is the value you passed at the server middleware:"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Server middleware"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"app."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"get"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#032F62"},children:"'*'"}),e.jsx(n.span,{style:{color:"#24292E"},children:", "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(n.span,{style:{color:"#24292E"},children:" ("}),e.jsx(n.span,{style:{color:"#E36209"},children:"req"}),e.jsx(n.span,{style:{color:"#24292E"},children:") "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" pageContextInit"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#24292E"},children:" {}"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // `pageContext.urlOriginal` is defined here"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  pageContextInit.urlOriginal "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:" req.url"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" pageContext"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" renderPage"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(pageContextInit)"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  /* ... */"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"})"})})]})})}),`
`,e.jsx(n.p,{children:"On the client-side:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["When using ",e.jsx(s,{href:"/client-routing",children:"Client Routing"}),", the value of ",e.jsx(n.code,{children:"pageContext.urlOriginal"})," is the browser's current URL (",e.jsx(n.code,{children:"window.location.href"}),")."]}),`
`,e.jsxs(n.li,{children:["When using ",e.jsx(s,{href:"/server-routing",children:"Server Routing"}),", the value of ",e.jsx(n.code,{children:"pageContext.urlOriginal"})," is ",e.jsx(n.code,{children:"undefined"})," (unless you use ",e.jsx(n.a,{href:"/passToClient",children:e.jsx(n.code,{children:"passToClient"})}),")."]}),`
`]}),`
`,e.jsx(l,{name:"urlPathname"}),`
`,e.jsxs(n.p,{children:["Alias for ",e.jsx(n.code,{children:"pageContext.urlParsed.pathname"}),"."]}),`
`,e.jsx(l,{name:"urlParsed"}),`
`,e.jsx(n.p,{children:"URL information:"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"{"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  pathname"}),e.jsx(n.span,{style:{color:"#24292E"},children:": string"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  pathnameOriginal"}),e.jsx(n.span,{style:{color:"#24292E"},children:": string"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  search"}),e.jsx(n.span,{style:{color:"#24292E"},children:": Record"}),e.jsx(n.span,{style:{color:"#D73A49"},children:"<"}),e.jsx(n.span,{style:{color:"#24292E"},children:"string, string"}),e.jsx(n.span,{style:{color:"#D73A49"},children:">"}),e.jsx(n.span,{style:{color:"#6A737D"},children:" // AKA query parameters"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  searchAll"}),e.jsx(n.span,{style:{color:"#24292E"},children:": Record"}),e.jsx(n.span,{style:{color:"#D73A49"},children:"<"}),e.jsx(n.span,{style:{color:"#24292E"},children:"string, string[]"}),e.jsx(n.span,{style:{color:"#D73A49"},children:">"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  searchOriginal"}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"null"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" |"}),e.jsx(n.span,{style:{color:"#24292E"},children:" string"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  hash"}),e.jsx(n.span,{style:{color:"#24292E"},children:": string"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  hashOriginal"}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"null"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" |"}),e.jsx(n.span,{style:{color:"#24292E"},children:" string"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  href"}),e.jsx(n.span,{style:{color:"#24292E"},children:": string"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  origin"}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"null"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" |"}),e.jsx(n.span,{style:{color:"#24292E"},children:" string"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  protocol"}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"null"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" |"}),e.jsx(n.span,{style:{color:"#24292E"},children:" string"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  hostname"}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"null"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" |"}),e.jsx(n.span,{style:{color:"#24292E"},children:" string"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  port"}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"null"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" |"}),e.jsx(n.span,{style:{color:"#24292E"},children:" string"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.p,{children:"Example:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`https://example.com/some-base-url/hello/s%C3%A9bastien?fruit=%C3%A2pple&fruit=orânge#%C3%A2ge
`})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"{"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Without Base URL, and decodes escaped characters."})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  pathname"}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'/hello/sébastien'"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // With Base URL, and doesn't decode escaped characters."})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  pathnameOriginal"}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'/some-base-url/hello/s%C3%A9bastien'"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  search"}),e.jsx(n.span,{style:{color:"#24292E"},children:": { "}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"fruit"}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'orânge'"}),e.jsx(n.span,{style:{color:"#24292E"},children:" },"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  searchAll"}),e.jsx(n.span,{style:{color:"#24292E"},children:": { "}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"fruit"}),e.jsx(n.span,{style:{color:"#24292E"},children:": ["}),e.jsx(n.span,{style:{color:"#032F62"},children:"'âpple'"}),e.jsx(n.span,{style:{color:"#24292E"},children:", "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'orânge'"}),e.jsx(n.span,{style:{color:"#24292E"},children:"] },"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  searchOriginal"}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'?fruit=%C3%A2pple&fruit=orânge'"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  hash"}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'âge'"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  hashOriginal"}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'#%C3%A2ge'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Without Base URL, and doesn't decode escaped characters."})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  href"}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'https://example.com/hello/s%C3%A9bastien?fruit=%C3%A2pple&fruit=orânge#%C3%A2ge'"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  origin"}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'https://example.com'"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  protocol"}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'https://'"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  hostname"}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'example.com'"}),e.jsx(n.span,{style:{color:"#24292E"},children:", "}),e.jsx(n.span,{style:{color:"#6A737D"},children:"// 'localhost' if http://localhost:3000"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  port"}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"null"}),e.jsx(n.span,{style:{color:"#6A737D"},children:" // 3000 if http://localhost:3000"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(l,{name:"headers"}),`
`,e.jsxs(n.p,{children:["The headers of the HTTP Request. As a string object (",e.jsx(n.code,{children:"Record<string, string>"}),") normalized by Vike, see ",e.jsx(s,{href:"/headers"}),"."]}),`
`,e.jsx(l,{name:"headersOriginal"}),`
`,e.jsxs(n.p,{children:["The headers of the HTTP Request. The original object provided by the server, see ",e.jsx(s,{href:"/headers"}),"."]}),`
`,e.jsx(l,{name:"config"}),`
`,e.jsxs(n.p,{children:["All runtime information about the ",e.jsx(s,{href:"/config",children:"page's configuration"})," (the page's route, hooks, settings, ...)."]}),`
`,e.jsx(l,{name:"isHydration"}),`
`,e.jsx(n.p,{children:"Whether the page is rendered to HTML."}),`
`,e.jsxs(n.p,{children:["When using ",e.jsx(s,{href:"/client-routing",noBreadcrumb:!0}),", the value is ",e.jsx(n.code,{children:"true"})," for the first page the user navigates to, and ",e.jsx(n.code,{children:"false"})," for any subsequent navigation. When using ",e.jsx(s,{href:"/server-routing",noBreadcrumb:!0}),", the value is always ",e.jsx(n.code,{children:"true"}),"."]}),`
`,e.jsxs(n.p,{children:["If the page doesn't throw an error then it's equivalent to ",e.jsx("code",{children:"pageContext.isHydration === !pageContext.isClientSideNavigation"}),". If there is an error, the error page is rendered and both ",e.jsx(n.code,{children:"pageContext.isHydration"})," ",e.jsx(n.code,{children:"pageContext.isClientSideNavigation"})," are ",e.jsx(n.code,{children:"false"}),"."]}),`
`,e.jsx(l,{name:"isClientSide"}),`
`,e.jsxs(n.p,{children:["Whether the page is being rendered on the client-side, or server-side / ",e.jsx(s,{href:"/pre-rendering",children:"pre-rendered"}),"."]}),`
`,e.jsxs(n.p,{children:["Also useful for narrowing down the ",e.jsx(n.code,{children:"PageContext"})," type to either ",e.jsx(n.code,{children:"PageContextClient"})," or ",e.jsx(n.code,{children:"PageContextServer"}),", see ",e.jsx(s,{href:"#narrowing-down"}),"."]}),`
`,e.jsxs(n.p,{children:["It's equivalent to ",e.jsx("code",{children:"pageContext.isClientSide === !import.meta.env.SSR"}),"."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:[e.jsxs(n.a,{href:"https://vite.dev/guide/ssr.html#conditional-logic",children:["Like ",e.jsx(n.code,{children:"import.meta.env.SSR"})]}),", code in if/else blocks is eliminated when building production client/server bundles (using ",e.jsx(n.a,{href:"https://rollupjs.org/faqs/#what-is-tree-shaking",children:"Rollup's tree-shaking"}),")."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// This import is also removed when building for the server-side"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" someClientImport "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" '../../client'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// This import is also removed when building for the client-side"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" someServerImport "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" '.././server'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"if"}),e.jsx(n.span,{style:{color:"#24292E"},children:" (pageContext.isClientSide) {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // This code block is removed when building for the server-side"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  someClientImport"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // ... client code ..."})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"} "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"else"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // This code block is removed when building for the client-side"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  someServerImport"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // ... server code ..."})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`]}),`
`,e.jsx(l,{name:"isPrerendering"}),`
`,e.jsxs(n.p,{children:["Whether the page is being ",e.jsx(s,{href:"/pre-rendering",children:"pre-rendered"}),". The value is always ",e.jsx(n.code,{children:"false"})," in development."]}),`
`,e.jsx(l,{name:"isBackwardNavigation"}),`
`,e.jsx(n.p,{children:"Whether the user is navigating back in history."}),`
`,e.jsxs(n.p,{children:["The value is ",e.jsx(n.code,{children:"true"})," when the user clicks on his browser's backward navigation button, or when invoking ",e.jsx(n.code,{children:"history.back()"}),"."]}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"isBackwardNavigation"})," property is only defined when using ",e.jsx(s,{href:"/client-routing",noBreadcrumb:!0}),"."]}),`
`,e.jsx(l,{name:"previousPageContext"}),`
`,e.jsxs(n.p,{children:["Upon client-side page navigation, you can use ",e.jsx(n.code,{children:"pageContext.previousPageContext"})," to access the ",e.jsx(n.code,{children:"pageContext"})," of the previous page. See ",e.jsx(s,{href:"#lifecycle"}),"."]}),`
`,e.jsx(l,{name:"is404"}),`
`,e.jsxs(n.p,{children:["If an error occurs, whether the error is a ",e.jsx(n.code,{children:"404 Page Not Found"})," or a ",e.jsx(n.code,{children:"500 Internal Error"}),", see ",e.jsx(s,{href:"/error-page"}),"."]}),`
`,e.jsx(l,{name:"isClientSideNavigation"}),`
`,e.jsx(n.p,{children:"Whether the page was navigated by the client-side router."}),`
`,e.jsxs(n.p,{children:["In other words, when using ",e.jsx(s,{href:"/client-routing",noBreadcrumb:!0}),", the value is ",e.jsx(n.code,{children:"false"})," for the first page the user visits, and ",e.jsx(n.code,{children:"true"})," for any subsequent navigation. (When using ",e.jsx(s,{href:"/server-routing",noBreadcrumb:!0}),", the value is always ",e.jsx(n.code,{children:"false"}),".)"]}),`
`,e.jsx(l,{name:"abortReason"}),`
`,e.jsxs(n.p,{children:["Set by ",e.jsx(s,{href:"/render",text:e.jsx(n.code,{children:"throw render()"})})," and used by the ",e.jsx(s,{text:"error page",href:"/error-page"}),"."]}),`
`,e.jsx(l,{name:"abortStatusCode"}),`
`,e.jsxs(n.p,{children:["Set by ",e.jsx(s,{href:"/render",text:e.jsx(n.code,{children:"throw render()"})})," and used by the ",e.jsx(s,{text:"error page",href:"/error-page"}),"."]}),`
`,e.jsx(l,{name:"errorWhileRendering"}),`
`,e.jsxs(n.p,{children:["The first error (if there is any) that occurred while rendering the page, see ",e.jsx(s,{href:"/error-tracking"}),"."]}),`
`,e.jsx(l,{name:"isBaseMissing"}),`
`,e.jsxs(n.p,{children:["Whether the Base URL is missing in the URL of the HTTP request made to the SSR server, see ",e.jsx(s,{href:"/base-url#setup"}),"."]}),`
`,e.jsx(l,{name:"globalContext"}),`
`,e.jsxs(n.p,{children:["Runtime information about your app, see ",e.jsx(s,{href:"/globalContext"}),"."]}),`
`,e.jsx(l,{name:"isPageContext"}),`
`,e.jsxs(n.p,{children:["Always ",e.jsx(n.code,{children:"true"}),", useful for distinguishing ",e.jsx(n.code,{children:"pageContext"})," from other objects and narrowing down TypeScript unions, see ",e.jsx(s,{href:"#narrowing-down"}),"."]}),`
`,e.jsx("h2",{id:"custom",children:"Custom"}),`
`,e.jsxs(n.p,{children:["You can define custom ",e.jsx(n.code,{children:"pageContext"})," properties."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsx(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"pageContext.myCustomProp "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:" someValue "}),e.jsx(n.span,{style:{color:"#6A737D"},children:"// Add or modify"})]})})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["See the section ",e.jsx(s,{href:"#extend",children:"TypeScript > Extend"})," for how to define the type of ",e.jsx(n.code,{children:"pageContext.myCustomProp"}),"."]}),`
`]}),`
`,e.jsxs(n.p,{children:["See also: ",e.jsx(s,{href:"/globalContext#custom"}),"."]}),`
`,e.jsxs(n.p,{children:["You can create/modify ",e.jsx(n.code,{children:"pageContext"})," properties at:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"#hooks"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"#ui-components"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"#navigate"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"#renderpage"}),`
`]}),`
`]}),`
`,e.jsx("h3",{id:"hooks",children:"Hooks"}),`
`,e.jsxs(n.p,{children:["You can use ",e.jsx(s,{href:"/hooks",children:"any Vike hook"})," to define custom properties."]}),`
`,e.jsxs(n.p,{children:["For example ",e.jsx(s,{href:"/onCreatePageContext",children:e.jsx(n.code,{children:"+onCreatePageContext"})}),":"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+onCreatePageContext.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onCreatePageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  pageContext.myCustomProp "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:" someValue"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["See concrete use case at ",e.jsx(s,{href:"/auth"}),"."]}),`
`]}),`
`,e.jsxs(n.p,{children:["Or ",e.jsx(s,{href:"/data",children:e.jsx(n.code,{children:"+data"})}),":"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/product/@id/+data.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" data"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"data"}),e.jsx(n.span,{style:{color:"#24292E"},children:", "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"queryDuration"}),e.jsx(n.span,{style:{color:"#24292E"},children:" } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" fetchSomeData"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  pageContext.queryDuration "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:" queryDuration"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" data"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h3",{id:"ui-components",children:"UI components"}),`
`,e.jsxs(n.p,{children:["You can define custom properties inside your UI components, by using ",e.jsx(s,{href:"/usePageContext",children:e.jsx(n.code,{children:"usePageContext()"})}),":"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Inside a UI component"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" pageContext"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" usePageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"pageContext.myCustomProp "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:" someValue "}),e.jsx(n.span,{style:{color:"#6A737D"},children:"// Add or modify property"})]})]})})}),`
`,e.jsx("h3",{id:"navigate",children:e.jsx("code",{children:"navigate()"})}),`
`,e.jsxs(n.p,{children:["Custom properties can be defined at ",e.jsx(s,{href:"/navigate#options",children:e.jsx(n.code,{children:"navigate({ pageContext: { someExtra: 'value' } })"})}),"."]}),`
`,e.jsx("h3",{id:"renderpage",children:e.jsx("code",{children:"renderPage()"})}),`
`,e.jsxs(n.p,{children:["If you don't use ",e.jsx(s,{href:"/server",children:e.jsx(n.code,{children:"vike-server"})}),", then you can define custom properties at ",e.jsx(s,{href:"/renderPage",children:e.jsx(n.code,{children:"renderPage()"})}),":"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Your Vike server middleware integration"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"app."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"get"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#032F62"},children:"'*'"}),e.jsx(n.span,{style:{color:"#24292E"},children:", "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(n.span,{style:{color:"#24292E"},children:" ("}),e.jsx(n.span,{style:{color:"#E36209"},children:"req"}),e.jsx(n.span,{style:{color:"#24292E"},children:") "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" pageContextInit"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // ***************************************"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // *** Built-in pageContext properties ***"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // ***************************************"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    urlOriginal: req.url,"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    headersOriginal: req.headers,"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // ***************************************"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // **** Custom pageContext properties ****"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // ***************************************"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // Common use case: make information about logged-in user available at pageContext.user"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    user: req.user,"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // Or any other value:"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // pageContext.myCustomProp"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    myCustomProp: someValue"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" pageContext"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" renderPage"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(pageContextInit)"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // ..."})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"})"})})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Setting ",e.jsx(n.code,{children:"pageContext.user"})," is a common use case for integrating authentication tools, see ",e.jsx(s,{href:"/auth"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"faq",children:"FAQ"}),`
`,e.jsxs("h3",{id:"can-i-mutate-pagecontext",children:["Can I mutate ",e.jsx("code",{children:"pageContext"}),"?"]}),`
`,e.jsxs(n.p,{children:["Yes, it's a common practice to change/add ",e.jsx(n.code,{children:"pageContext"})," properties. See ",e.jsx(s,{href:"#custom"}),"."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsx(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"pageContext.someProp "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:" someValue"})]})})})}),`
`,e.jsxs("h3",{id:"can-i-use-pagecontext-as-a-ui-store",children:["Can I use ",e.jsx("code",{children:"pageContext"})," as a UI store?"]}),`
`,e.jsxs(n.p,{children:["Instead of using ",e.jsx(n.code,{children:"pageContext"}),", we generally recommend using a proper UI state management tool such as React's ",e.jsx(n.code,{children:"useState()"}),", Redux, Vue's ",e.jsx(n.code,{children:"ref()"}),", Pinia, etc."]}),`
`,e.jsxs(n.p,{children:["That said, there are use cases for using ",e.jsx(n.code,{children:"pageContext"})," to store client-side state. For example to pass information from the previous page to the next during navigation."]}),`
`,e.jsxs(n.p,{children:["See ",e.jsx(s,{href:"#lifecycle"})," to understand whether using ",e.jsx(n.code,{children:"pageContext"})," can make sense for your use case."]}),`
`,e.jsx("h3",{id:"can-i-check-whether-ssr-is-enabled",children:"Can I check whether SSR is enabled?"}),`
`,e.jsxs(n.p,{children:["On the server-side, you can tell ",e.jsx(s,{href:"/ssr",children:"whether SSR is enabled"})," by checking whether ",e.jsx(s,{href:"#Page",noWarning:!0,children:e.jsx(n.code,{children:"pageContext.Page"})})," is set:"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// +onAfterRenderHtml.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onAfterRenderHtml"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" isSSR"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#D73A49"},children:" !!"}),e.jsx(n.span,{style:{color:"#24292E"},children:"pageContext.Page"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(n.span,{style:{color:"#24292E"},children:" (isSSR) {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // ..."})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h2",{id:"typescript",children:"TypeScript"}),`
`,e.jsx("h3",{id:"basics",children:"Basics"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // For code loaded in client and server"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  PageContext,"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // For code loaded in client only"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  PageContextClient,"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // For code loaded in server only"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  PageContextServer"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"} "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]})]})})}),`
`,e.jsx("h3",{id:"narrowing-down",children:"Narrowing down"}),`
`,e.jsxs(n.p,{children:[`You can use
`,e.jsx(s,{href:"#isClientSide",noWarning:!0,children:e.jsx(n.code,{children:"pageContext.isClientSide"})})," and ",e.jsx(s,{href:"#isPageContext",noWarning:!0,children:e.jsx(n.code,{children:"pageContext.isPageContext"})}),`
to narrow down TypeScript unions.`]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { PageContext, GlobalContext } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" someFunction"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"someObject"}),e.jsx(n.span,{style:{color:"#D73A49"},children:":"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" PageContext"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" |"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" GlobalContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(n.span,{style:{color:"#24292E"},children:" (someObject.isPageContext) {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // someObject is PageContext"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"else"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // someObject is GlobalContext"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { PageContext } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" someFunction"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#D73A49"},children:":"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" PageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(n.span,{style:{color:"#24292E"},children:" (pageContext.isClientSide) {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // pageContext is PageContextClient"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"else"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // pageContext is PageContextServer"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h3",{id:"extend",children:"Extend"}),`
`,e.jsxs(n.p,{children:["To extend and/or refine ",e.jsx(n.code,{children:"PageContext"}),"/",e.jsx(n.code,{children:"PageContextServer"}),"/",e.jsx(n.code,{children:"PageContextClient"}),", use the global interface ",e.jsx(n.code,{children:"Vike.PageContext"}),":"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"declare"}),e.jsx(n.span,{style:{color:"#24292E"},children:" global {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  namespace"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Vike"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"    interface"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" PageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"      // Type of pageContext.user"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#E36209"},children:"      user"}),e.jsx(n.span,{style:{color:"#D73A49"},children:"?:"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#E36209"},children:"        name"}),e.jsx(n.span,{style:{color:"#D73A49"},children:":"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" string"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#E36209"},children:"        id"}),e.jsx(n.span,{style:{color:"#D73A49"},children:":"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" string"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#E36209"},children:"        isAdmin"}),e.jsx(n.span,{style:{color:"#D73A49"},children:":"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" boolean"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"      }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"      // Refine type of pageContext.Page"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"      Page"}),e.jsx(n.span,{style:{color:"#D73A49"},children:":"}),e.jsx(n.span,{style:{color:"#24292E"},children:" () "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" React"}),e.jsx(n.span,{style:{color:"#24292E"},children:"."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"JSX"}),e.jsx(n.span,{style:{color:"#24292E"},children:"."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"Element"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// If you define Vike.PageContext in a .d.ts file then"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// make sure there is at least one export/import statement."})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Tell TypeScript this file isn't an ambient module:"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {}"})]})]})})}),`
`,e.jsxs(n.p,{children:["To define properties only for the server-/client-side, use the interfaces ",e.jsx(n.code,{children:"Vike.PageContextServer"})," and ",e.jsx(n.code,{children:"Vike.PageContextClient"})," instead."]}),`
`,e.jsx("h3",{id:"server-routing",children:"Server Routing"}),`
`,e.jsxs(n.p,{children:["If you use ",e.jsx(s,{text:"Server Routing",href:"/server-routing"}),":"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // For code loaded in client and server"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  PageContextWithServerRouting "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"as"}),e.jsx(n.span,{style:{color:"#24292E"},children:" PageContext,"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // For code loaded in client only"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  PageContextClientWithServerRouting "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"as"}),e.jsx(n.span,{style:{color:"#24292E"},children:" PageContextClient,"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // For code loaded in server only"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  PageContextServer"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"} "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]})]})})}),`
`,e.jsx("h2",{id:"lifecycle",children:"Lifecycle"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"pageContext"})," object is tied to the rendering process of a single page: whenever a new page is rendered, a new ",e.jsx(n.code,{children:"pageContext"})," object is created. (If the current page is re-rendered, a new ",e.jsx(n.code,{children:"pageContext"})," object is created as well.)"]}),`
`,e.jsxs(n.p,{children:["The lifecycle of the ",e.jsx(n.code,{children:"pageContext"})," object is straightforward on the client and server. But for pre-rendered pages ",e.jsxs(s,{href:"#pre-rendering",children:["it can be surprising (some ",e.jsx(n.code,{children:"pageContext"}),' properties may seem "outdated")']}),"."]}),`
`,e.jsx("h3",{id:"server",children:"Server"}),`
`,e.jsxs(n.p,{children:["On the server-side, a new ",e.jsx(n.code,{children:"pageContext"})," object is created whenever a page is rendered to HTML. The ",e.jsx(n.code,{children:"pageContext"})," object is discarded after the HTML is sent to the client. (But ",e.jsx(n.code,{children:"pageContext"})," properties sent to the client via ",e.jsx(s,{href:"/passToClient",children:"passToClient"})," are preserved on the client-side.)"]}),`
`,e.jsx("h3",{id:"client",children:"Client"}),`
`,e.jsxs(n.p,{children:["On the client side, a new ",e.jsx(n.code,{children:"pageContext"})," object is created whenever a page is rendered. In other words:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Upon ",e.jsx(s,{href:"/hydration",children:"hydrating"})," (the first page the user visits)."]}),`
`,e.jsxs(n.li,{children:["Upon ",e.jsx(s,{href:"/client-routing",children:"client-side navigation"}),"."]}),`
`]}),`
`,e.jsxs(n.p,{children:["If data is fetched on the server-side, then some ",e.jsx(n.code,{children:"pageContext"})," properties are fetched from the server, see ",e.jsx(s,{href:"/pageContext.json"}),"."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["On the client-side, you can access the ",e.jsx(n.code,{children:"pageContext"})," of the previous render by using ",e.jsx(n.code,{children:"pageContext.previousPageContext"}),"."]}),`
`]}),`
`,e.jsx("h3",{id:"pre-rendering",children:"Pre-rendering"}),`
`,e.jsxs(n.p,{children:["Upon ",e.jsx(s,{href:"/pre-rendering",children:"pre-rendering a page"}),", the ",e.jsx(n.code,{children:"pageContext"})," object used for pre-rendering the page to HTML is preserved and saved twice at:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"dist/client/${urlOfThePage}/index.pageContext.json"})," (see ",e.jsx(s,{href:"/pageContext.json"}),")"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"dist/client/${urlOfThePage}/index.html"})," (see ",e.jsx(n.code,{children:'<script id="vike_pageContext">'}),")"]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["If you inspect ",e.jsx(n.code,{children:"dist/client/"}),", you'll find a ",e.jsx(n.code,{children:"index.pageContext.json"})," file for each pre-rendered page."]}),`
`]}),`
`,e.jsxs(n.p,{children:["Since a pre-rendered page is built ahead of time, its server-side ",e.jsx(n.code,{children:"pageContext"})," may be outdated by the time a user visits the page."]}),`
`,e.jsx(n.p,{children:e.jsxs(n.strong,{children:["Problem: ",e.jsx(n.code,{children:"pageContext"})," is outdated upon hydration"]})}),`
`,e.jsxs(n.p,{children:["Upon hydration, some ",e.jsx(n.code,{children:"pageContext"}),' properties may appear incorrect or "outdated".']}),`
`,e.jsxs(n.p,{children:["For example, if a user visits ",e.jsx(n.code,{children:"/products?filter=computer"})," then ",e.jsx(n.code,{children:"pageContext.urlParsed.search"})," is empty and ",e.jsx(n.code,{children:"?filter=computer"})," is missing."]}),`
`,e.jsxs(n.p,{children:["That's because Vike uses the server-side ",e.jsx(n.code,{children:"pageContext.urlOriginal"})," that was used to pre-render the URL ",e.jsx(n.code,{children:"/products"})," which didn't have ",e.jsx(n.code,{children:"?filter=computer"}),"."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["In theory, Vike could update ",e.jsx(n.code,{children:"pageContext.urlParsed"})," on the client-side to include ",e.jsx(n.code,{children:"?filter=computer"}),", but this would cause a ",e.jsx(s,{href:"/hydration-mismatch",children:"hydration mismatch"}),". That's why, upon hydration, Vike intentionally keeps the client- and server-side ",e.jsx(n.code,{children:"pageContext"})," aligned."]}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Workarounds"})}),`
`,e.jsx(n.p,{children:"To workaround the issue you can either:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Re-render the page after hydration, by using ",e.jsx(s,{href:"/reload",children:e.jsx(n.code,{children:"reload()"})})," with ",e.jsx(s,{href:"/onHydrationEnd",children:e.jsx(n.code,{children:"onHydrationEnd()"})}),".",`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/products/+onHydrationEnd.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { reload } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/client/router'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onHydrationEnd"}),e.jsx(n.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(n.span,{style:{color:"#24292E"},children:" (window.location.href."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"includes"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#032F62"},children:"'?filter'"}),e.jsx(n.span,{style:{color:"#24292E"},children:")) "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"await"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" reload"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`]}),`
`,e.jsxs(n.li,{children:["Or, if the number of ",e.jsx(n.code,{children:"?filter="})," values isn't too large, you can use ",e.jsx(s,{href:"/onBeforePrerenderStart",children:e.jsx(n.code,{children:"onBeforePrerenderStart()"})})," to pre-render all filter values: ",e.jsx(n.code,{children:"/products?filter=computer"}),", ",e.jsx(n.code,{children:"/products?filter=car"}),", ...",`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["You can then also use ",e.jsxs(s,{href:"/routing#parameterized-routes",children:["parameterized route ",e.jsx(n.code,{children:"/products/@filter"})]})," instead of ",e.jsx(n.code,{children:"?filter="})," if you prefer."]}),`
`]}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/globalContext"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/onCreatePageContext"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/usePageContext"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/useData"}),`
`]}),`
`]})]})}function d(r={}){const{wrapper:n}=r.components||{};return n?e.jsx(n,{...r,children:e.jsx(t,{...r})}):t(r)}const h=Object.freeze(Object.defineProperty({__proto__:null,default:d,pageSectionsExport:c},Symbol.toStringTag,{value:"Module"})),S={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/pageContext/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:h}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:i}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:a}}};export{S as configValuesSerialized};
