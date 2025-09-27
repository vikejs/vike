import{o as t,a as r}from"../chunks/chunk-YrzSF-5M.js";import{j as e}from"../chunks/chunk-DylOdVSZ.js";import{L as l}from"../chunks/chunk-DnqwWAsR.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{C as o}from"../chunks/chunk-C5rDYQWE.js";/* empty css                      */import"../chunks/chunk-CvHq2b10.js";/* empty css                      */const i=[{pageSectionId:"use-cases",pageSectionLevel:2,pageSectionTitle:"Use cases"},{pageSectionId:"init",pageSectionLevel:3,pageSectionTitle:"Init"},{pageSectionId:"global-data",pageSectionLevel:3,pageSectionTitle:"Global data"},{pageSectionId:"authentication",pageSectionLevel:3,pageSectionTitle:"Authentication"},{pageSectionId:"store",pageSectionLevel:3,pageSectionTitle:"Store"},{pageSectionId:"lifecycle",pageSectionLevel:2,pageSectionTitle:"Lifecycle"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function a(s){const n={blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{env:"client, server",cumulative:!0,global:!0}),`
`,e.jsxs(n.p,{children:["Hook called when the ",e.jsxs(l,{href:"/globalContext",children:[e.jsx(n.code,{children:"globalContext"})," object"]})," is created."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+onCreateGlobalContext.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: server & client"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { GlobalContext } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onCreateGlobalContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"globalContext"}),e.jsx(n.span,{style:{color:"#D73A49"},children:":"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" GlobalContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // The object globalContext was just created"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.p,{children:"You can define:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"+onCreateGlobalContext.js"})," => called when ",e.jsx(n.code,{children:"globalContext"})," is created (both client and server)."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"+onCreateGlobalContext.server.js"})," => called when ",e.jsx(n.code,{children:"globalContext"})," is created on the server."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"+onCreateGlobalContext.client.js"})," => called when ",e.jsx(n.code,{children:"globalContext"})," is created on the client."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"+onCreateGlobalContext.server.js"})," and ",e.jsx(n.code,{children:"+onCreateGlobalContext.server.js"})," => two different ",e.jsx(n.code,{children:"onCreateGlobalContext()"})," hooks for server and client."]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"See also:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{href:"/file-env"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{href:"/onCreatePageContext"}),`
`]}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"use-cases",children:"Use cases"}),`
`,e.jsx("h3",{id:"init",children:"Init"}),`
`,e.jsxs(n.p,{children:["Initializing a ",e.jsx(n.code,{children:"globalContext"})," property:"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+onCreateGlobalContext.client.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: client"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { GlobalContextClient } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onCreateGlobalContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"globalContext"}),e.jsx(n.span,{style:{color:"#D73A49"},children:":"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" GlobalContextClient"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  globalContext.someInstance "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#D73A49"},children:" new"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Instance"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"declare"}),e.jsx(n.span,{style:{color:"#24292E"},children:" global {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  namespace"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Vike"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"    interface"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" GlobalContextClient"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#E36209"},children:"      someInstance"}),e.jsx(n.span,{style:{color:"#D73A49"},children:":"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Instance"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h3",{id:"global-data",children:"Global data"}),`
`,e.jsx(n.p,{children:"Fetching global data that is accessible to all pages:"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+onCreateGlobalContext.server.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { GlobalContextServer } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onCreateGlobalContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"globalContext"}),e.jsx(n.span,{style:{color:"#D73A49"},children:":"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" GlobalContextServer"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  globalContext.someData "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" fetchSomeData"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"declare"}),e.jsx(n.span,{style:{color:"#24292E"},children:" global {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  namespace"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Vike"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // Extend GlobalContext instead of GlobalContextServer because someData is passed to client"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"    interface"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" GlobalContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#E36209"},children:"      someData"}),e.jsx(n.span,{style:{color:"#D73A49"},children:":"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Awaited"}),e.jsx(n.span,{style:{color:"#24292E"},children:"<"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"ReturnType"}),e.jsx(n.span,{style:{color:"#24292E"},children:"<"}),e.jsx(n.span,{style:{color:"#D73A49"},children:"typeof"}),e.jsx(n.span,{style:{color:"#24292E"},children:" fetchSomeData>>"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  passToClient: ["}),e.jsx(n.span,{style:{color:"#032F62"},children:"'someData'"}),e.jsx(n.span,{style:{color:"#24292E"},children:"]"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"} "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(l,{href:"/passToClient",noBreadcrumb:!0})," also works for ",e.jsx(n.code,{children:"globalContext"}),"."]}),`
`]}),`
`,e.jsx("h3",{id:"authentication",children:"Authentication"}),`
`,e.jsx(n.p,{children:"Client-side authentication:"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+onCreateGlobalContext.client.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: client"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { GlobalContextClient } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onCreateGlobalContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"globalContext"}),e.jsx(n.span,{style:{color:"#D73A49"},children:":"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" GlobalContextClient"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  globalContext.loggedInUser "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" retrieveUserFromCookie"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"declare"}),e.jsx(n.span,{style:{color:"#24292E"},children:" global {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  namespace"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Vike"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"    interface"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" GlobalContextClient"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#E36209"},children:"      loggedInUser"}),e.jsx(n.span,{style:{color:"#D73A49"},children:":"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" ReturnType"}),e.jsx(n.span,{style:{color:"#24292E"},children:"<"}),e.jsx(n.span,{style:{color:"#D73A49"},children:"typeof"}),e.jsx(n.span,{style:{color:"#24292E"},children:" retrieveUserFromCookie>"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["See also: ",e.jsx(l,{href:"/auth#ssg",doNotInferSectionTitle:!0}),"."]}),`
`]}),`
`,e.jsx("h3",{id:"store",children:"Store"}),`
`,e.jsxs(n.p,{children:["Initializing a ",e.jsx(l,{href:"/store",children:"store"})," on the client-side:"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+onCreateGlobalContext.client.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: client"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { Store } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'some-state-management-library'"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { GlobalContextClient } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onCreateGlobalContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"globalContext"}),e.jsx(n.span,{style:{color:"#D73A49"},children:":"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" GlobalContextClient"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  globalContext.store "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#D73A49"},children:" new"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Store"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"declare"}),e.jsx(n.span,{style:{color:"#24292E"},children:" global {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  namespace"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Vike"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"    interface"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" GlobalContextClient"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#E36209"},children:"      store"}),e.jsx(n.span,{style:{color:"#D73A49"},children:":"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Store"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.p,{children:["On the server-side, the store is typically initialized by using a ",e.jsx(l,{href:"/onCreatePageContext",noBreadcrumb:!0}),"."]}),`
`,e.jsx(n.p,{children:"See also:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{href:"/onCreatePageContext#store"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{href:"/store#manual-integration"}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"lifecycle",children:"Lifecycle"}),`
`,e.jsxs(n.p,{children:["See ",e.jsx(l,{href:"/globalContext#lifecycle"})," which explains when the ",e.jsx(n.code,{children:"globalContext"})," object is created (the ",e.jsx(n.code,{children:"onCreateGlobalContext()"})," hook is called immediately afterwards)."]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{href:"/globalContext"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{href:"/getGlobalContext"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{href:"/onCreatePageContext"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{href:"/hooks"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{href:"/hooks#lifecycle"}),`
`]}),`
`]})]})}function c(s={}){const{wrapper:n}=s.components||{};return n?e.jsx(n,{...s,children:e.jsx(a,{...s})}):a(s)}const d=Object.freeze(Object.defineProperty({__proto__:null,default:c,pageSectionsExport:i},Symbol.toStringTag,{value:"Module"})),v={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:r}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:t}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/onCreateGlobalContext/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:d}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{v as configValuesSerialized};
