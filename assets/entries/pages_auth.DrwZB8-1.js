import{j as e,b as a,i as t,L as o,o as i}from"../chunks/chunk-COY9qe_3.js";import{L as n}from"../chunks/chunk-C7hDb96N.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-BzWTU9BF.js";/* empty css                      */const c=[{pageSectionId:"with-vike-server",pageSectionLevel:2,pageSectionTitle:"With `vike-server`"},{pageSectionId:"without-vike-server",pageSectionLevel:2,pageSectionTitle:"Without `vike-server`"},{pageSectionId:"ssg",pageSectionLevel:2,pageSectionTitle:"SSG"},{pageSectionId:"login-flow",pageSectionLevel:2,pageSectionTitle:"Login flow"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function r(l){const s={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",ol:"ol",p:"p",pre:"pre",span:"span",ul:"ul",...l.components};return e.jsxs(e.Fragment,{children:[e.jsxs(s.p,{children:["You can make information about the authenticated user available to your pages and UI components by defining a ",e.jsxs(n,{href:"/pageContext#custom",children:["custom ",e.jsx(s.code,{children:"pageContext"})," property"]}),", such as ",e.jsx(s.code,{children:"pageContext.user"}),"."]}),`
`,e.jsxs(s.p,{children:["You can then access ",e.jsx(s.code,{children:"pageContext.user"})," from any UI component using ",e.jsx(n,{href:"/usePageContext",children:e.jsx(s.code,{children:"usePageContext()"})})," and ",e.jsx(n,{href:"/passToClient",children:e.jsx(s.code,{children:"+passToClient"})}),"."]}),`
`,e.jsx(s.p,{children:"In principle, you can use Vike with any authentication tool such as:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/better-auth/better-auth",children:"Better Auth"})}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{text:"Auth.js",href:"/Auth.js"}),`
`]}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/simov/grant",children:"Grant"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/jaredhanson/passport",children:"Passport.js"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://auth0.com/",children:"Auth0"})}),`
`,e.jsx(s.li,{children:"..."}),`
`]}),`
`,e.jsxs("h2",{id:"with-vike-server",children:["With ",e.jsx("code",{children:"vike-server"})]}),`
`,e.jsxs(s.p,{children:["You can use ",e.jsx(n,{href:"/onCreatePageContext",children:e.jsx(s.code,{children:"+onCreatePageContext.server.js"})}),":"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+onCreatePageContext.server.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// On the server-side, this hook is called upon new incoming HTTP requests"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" async"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" onCreatePageContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // vike-server defines pageContext.runtime"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"req"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" pageContext.runtime"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Authentication middlewares (e.g. Passport.js and Grant) usually provide"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // information about the logged-in user at req.user"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  pageContext.user "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" req.user"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Or when using a third-party authentication provider (e.g. Auth0)"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  pageContext.user "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(s.span,{style:{color:"#24292E"},children:" someAuthApi."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"getUser"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(req.headers)"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(s.p,{children:["You may also simply directly access ",e.jsx(s.code,{children:"pageContext.runtime.req.user"})," instead."]}),`
`,e.jsxs("h2",{id:"without-vike-server",children:["Without ",e.jsx("code",{children:"vike-server"})]}),`
`,e.jsxs(s.p,{children:["If you don't use ",e.jsx(n,{href:"/server",children:e.jsx(s.code,{children:"vike-server"})}),", then you can use ",e.jsx(n,{href:"/renderPage",children:e.jsx(s.code,{children:"renderPage()"})}),":"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// server/index.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Vike server middleware"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"app."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"get"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'*'"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("}),e.jsx(s.span,{style:{color:"#E36209"},children:"req"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#E36209"},children:"res"}),e.jsx(s.span,{style:{color:"#24292E"},children:") "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Authentication middlewares (e.g. Passport.js and Grant) usually provide"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // information about the logged-in user at req.user"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" user"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" req.user"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Or when using a third-party authentication provider (e.g. Auth0)"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" user"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(s.span,{style:{color:"#24292E"},children:" someAuthApi."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"getUser"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(req.headers)"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" pageContextInit"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    urlOriginal: req.url,"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // Make the user object available at pageContext.user"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    user"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" result"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" renderPage"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(pageContextInit)"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  /* ... */"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"})"})})]})})}),`
`,e.jsx("h2",{id:"ssg",children:"SSG"}),`
`,e.jsxs(s.p,{children:[e.jsx(n,{href:"/pre-rendering",children:"SSG apps"})," don't have a server and, therefore, a custom property such as ",e.jsx(s.code,{children:"pageContext.user"})," cannot be defined on the server-side."]}),`
`,e.jsxs(s.p,{children:["Instead, you can use ",e.jsx(n,{href:"/onCreateGlobalContext",children:e.jsx(s.code,{children:"+onCreateGlobalContext.client.js"})}),":"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+onCreateGlobalContext.client.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" async"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" onCreateGlobalContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#E36209"},children:"globalContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Fetch user information from your backend (or an authentication SaaS platform)"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" user"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" fetchUseInfo"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  globalContext.user "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" user"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(s.p,{children:["You can then use ",e.jsx(n,{href:"/pageContext#globalContext",children:e.jsx(s.code,{children:"pageContext.globalContext"})})," and/or ",e.jsx(n,{href:"/getGlobalContext",children:e.jsx(s.code,{children:"getGlobalContext()"})})," to access ",e.jsx(s.code,{children:"globalContext.user"})," anywhere."]}),`
`,e.jsx("h2",{id:"login-flow",children:"Login flow"}),`
`,e.jsxs(s.p,{children:["By using ",e.jsx(n,{href:"/guard",children:"+guard"})," with ",e.jsx(s.a,{href:"/redirect",children:e.jsx(s.code,{children:"throw redirect()"})})," or ",e.jsx(s.a,{href:"/render",children:e.jsx(s.code,{children:"throw render()"})})," you can:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"Implement login flows."}),`
`,e.jsx(s.li,{children:"Protect private pages from unprivileged access."}),`
`]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/admin/+guard.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { render, redirect } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/abort'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" guard"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("}),e.jsx(s.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:") "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"user"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" pageContext"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(s.span,{style:{color:"#24292E"},children:" (user "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"==="}),e.jsx(s.span,{style:{color:"#005CC5"},children:" null"}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // Render the login page while preserving the URL. (This is novel technique"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // which we explain down below.)"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"    throw"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" render"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'/login'"}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    /* The more traditional way, redirect the user:"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    throw redirect('/login')"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    */"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(s.span,{style:{color:"#24292E"},children:" (user.role "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"!=="}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'admin'"}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // Render the error page and show message to the user"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"    throw"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" render"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#005CC5"},children:"403"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'Only admins are allowed to access this page.'"}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["Using ",e.jsx(s.code,{children:"render('/login')"})," instead of ",e.jsx(s.code,{children:"redirect('/login')"})," allows the URL to be preserved during the entire login flow:"]}),`
`,e.jsxs(s.ol,{children:[`
`,e.jsxs(s.li,{children:["Unauthenticated user goes to URL ",e.jsx(s.code,{children:"/admin"})," and sees the login page. (URL is ",e.jsx(s.code,{children:"/admin"}),".)"]}),`
`,e.jsxs(s.li,{children:["User fills the sign-in form and successfully logs in. (URL is still ",e.jsx(s.code,{children:"/admin"}),".)"]}),`
`,e.jsxs(s.li,{children:[e.jsx(n,{text:"Reload",href:"/reload"})," the page, the user now sees the admin page. (URL is still ",e.jsx(s.code,{children:"/admin"}),".)"]}),`
`]}),`
`,e.jsxs(s.p,{children:["See ",e.jsx(a,{text:"example",path:"/examples/auth/"}),"."]}),`
`]}),`
`,e.jsxs(s.p,{children:["You can also define a ",e.jsx(s.code,{children:"guard()"})," hook that applies to multiple pages:"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+guard.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This guard() hook applies to all pages: the file is located at /pages/+guard.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// and therefore applies to all /pages/**/+Page.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { render } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/abort'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" guard"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("}),e.jsx(s.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:") "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("}),e.jsx(s.span,{style:{color:"#D73A49"},children:"!"}),e.jsx(s.span,{style:{color:"#24292E"},children:"pageContext.user) {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"    throw"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" render"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'/login'"}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/guard"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/redirect"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/render"}),`
`]}),`
`]})]})}function d(l={}){const{wrapper:s}=l.components||{};return s?e.jsx(s,{...l,children:e.jsx(r,{...l})}):r(l)}const h=Object.freeze(Object.defineProperty({__proto__:null,default:d,pageSectionsExport:c},Symbol.toStringTag,{value:"Module"})),E={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:i}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/auth/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:h}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:t}}};export{E as configValuesSerialized};
