import{o as i,a as o}from"../chunks/chunk-CxIOOiKX.js";import{j as e}from"../chunks/chunk-B35a6FX-.js";import{L as n}from"../chunks/chunk-BbfG-aTg.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as t}from"../chunks/chunk-CJvpbNqo.js";/* empty css                      *//* empty css                      *//* empty css                      */const c=[{pageSectionId:"example",pageSectionLevel:2,pageSectionTitle:"Example"},{pageSectionId:"avoid-pagecontext-json-requests",pageSectionLevel:2,pageSectionTitle:"Avoid `pageContext.json` requests"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function a(l){const s={a:"a",blockquote:"blockquote",code:"code",div:"div",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...t(),...l.components},{ChoiceGroup:r}=s;return r||h("ChoiceGroup"),e.jsxs(e.Fragment,{children:[e.jsxs(s.p,{children:["Upon ",e.jsx(n,{href:"/client-routing",children:"client-side navigation"}),`,
Vike retrieves certain server-side `,e.jsx(s.code,{children:"pageContext"})," properties by sending an HTTP request to your server."]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"shell","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"shell","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Retrieve data fetched on the server-side"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"HTTP"}),e.jsx(s.span,{style:{color:"#032F62"},children:" GET"}),e.jsx(s.span,{style:{color:"#032F62"},children:" /product/42/index.pageContext.json"})]})]})})}),`
`,e.jsxs(s.p,{children:["Most notably, the returned ",e.jsx(s.code,{children:"pageContext"})," object includes data fetched via ",e.jsxs(n,{href:"/data#environment",children:[e.jsx(s.code,{children:"+data"})," on the server-side"]}),"."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["If the server-side doesn't fetch data, then the client-side skips making a ",e.jsx(s.code,{children:"pageContext.json"})," request, see ",e.jsx(n,{href:"#avoid-pagecontext-json-requests"}),"."]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["See also: ",e.jsx(n,{href:"/pageContext#lifecycle"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"example",children:"Example"}),`
`,e.jsxs(r,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/star-wars/+data.server.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { data }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This data() hook is always called on the server-side. But, upon page navigation, the data"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// needs to be available on the client-side thus Vike makes a /star-wars/index.pageContext.json"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// request in order to pass the data from the server to the client."})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" data"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" response"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" fetch"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsxs(s.span,{style:{color:"#032F62"},children:["'",e.jsx(s.a,{href:"https://star-wars.brillout.com/api/films.json",children:"https://star-wars.brillout.com/api/films.json"}),"'"]}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" movies"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(s.span,{style:{color:"#24292E"},children:" response."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"json"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { movies }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/star-wars/+data.server.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { data }"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Data"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Awaited"}),e.jsx(s.span,{style:{color:"#24292E"},children:"<"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"ReturnType"}),e.jsx(s.span,{style:{color:"#24292E"},children:"<"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"typeof"}),e.jsx(s.span,{style:{color:"#24292E"},children:" data>>"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This data() hook is always called on the server-side. But, upon page navigation, the data"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// needs to be available on the client-side thus Vike makes a /star-wars/index.pageContext.json"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// request in order to pass the data from the server to the client."})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" data"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" response"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" fetch"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsxs(s.span,{style:{color:"#032F62"},children:["'",e.jsx(s.a,{href:"https://star-wars.brillout.com/api/films.json",children:"https://star-wars.brillout.com/api/films.json"}),"'"]}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" movies"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(s.span,{style:{color:"#24292E"},children:" response."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"json"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { movies }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})})]}),`
`,e.jsxs(s.p,{children:["The request ",e.jsx(s.code,{children:"/star-wars/index.pageContext.json"})," returns the data fetched by the ",e.jsx(s.code,{children:"data()"})," hook."]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"bash","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"bash","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:" curl"}),e.jsx(s.span,{style:{color:"#032F62"},children:" /star-wars/index.pageContext.json"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"{"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:'  "data"'}),e.jsx(s.span,{style:{color:"#005CC5"},children:":"}),e.jsx(s.span,{style:{color:"#032F62"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:'    "movies"'}),e.jsx(s.span,{style:{color:"#005CC5"},children:":"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ["})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:'        "title"'}),e.jsx(s.span,{style:{color:"#005CC5"},children:":"}),e.jsx(s.span,{style:{color:"#032F62"},children:' "A New Hope",'})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:'        "release_date"'}),e.jsx(s.span,{style:{color:"#005CC5"},children:":"}),e.jsx(s.span,{style:{color:"#032F62"},children:' "1977-05-25"'})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      },"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:'        "title"'}),e.jsx(s.span,{style:{color:"#005CC5"},children:":"}),e.jsx(s.span,{style:{color:"#032F62"},children:' "The Empire Strikes Back",'})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:'        "release_date"'}),e.jsx(s.span,{style:{color:"#005CC5"},children:":"}),e.jsx(s.span,{style:{color:"#032F62"},children:' "1980-05-17"'})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      },"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:'        "title"'}),e.jsx(s.span,{style:{color:"#005CC5"},children:":"}),e.jsx(s.span,{style:{color:"#032F62"},children:' "Return of the Jedi",'})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:'        "release_date"'}),e.jsx(s.span,{style:{color:"#005CC5"},children:":"}),e.jsx(s.span,{style:{color:"#032F62"},children:' "1983-05-25"'})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    ]"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs("h2",{id:"avoid-pagecontext-json-requests",children:["Avoid ",e.jsx("code",{children:"pageContext.json"})," requests"]}),`
`,e.jsxs(s.p,{children:["To minimize server requests, you may want Vike to stop making ",e.jsx(s.code,{children:"pageContext.json"})," requests."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"For example, if your data comes from another server, you typically don't want an unnecessary detour through your JavaScript/SSR server."}),`
`]}),`
`,e.jsxs(s.p,{children:["To stop Vike from requesting ",e.jsx(s.code,{children:"pageContext.json"}),", do the following:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsxs(s.p,{children:["Make sure the page doesn't use any server-only ",e.jsx(s.code,{children:"data()"}),", ",e.jsx(s.code,{children:"onCreatePageContext()"}),", or ",e.jsx(s.code,{children:"onBeforeRender()"})," hook."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"See also:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/data#environment"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/onBeforeRender#environment"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/onCreatePageContext"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/pageContext#lifecycle"}),`
`]}),`
`]}),`
`,e.jsx("p",{}),`
`,`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"Also make sure your Vike extensions don't define such server-only hook."}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["Consider using ",e.jsx(s.code,{children:".ssr.js"})," instead of ",e.jsx(s.code,{children:".server.js"}),", see ",e.jsx(n,{href:"/file-env#ssr-js",doNotInferSectionTitle:!0}),"."]}),`
`]}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsxs(s.p,{children:["If you have a ",e.jsx(n,{href:"/server-integration",children:"custom server integration"})," (i.e. you don't use ",e.jsx(n,{href:"/vike-photon",children:e.jsx(s.code,{children:"vike-photon"})}),"), make sure the ",e.jsx(s.code,{children:"pageContextInit"})," you pass to ",e.jsx(n,{href:"/renderPage",children:e.jsx(s.code,{children:"renderPage()"})})," doesn't contain a property included in ",e.jsx(n,{href:"/passToClient",children:e.jsx(s.code,{children:"passToClient"})}),"."]}),`
`,e.jsxs(r,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Vike server middleware"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:";"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("}),e.jsx(s.span,{style:{color:"#E36209"},children:"req"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#E36209"},children:"res"}),e.jsx(s.span,{style:{color:"#24292E"},children:") "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" pageContextInit"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    urlOriginal: req.originalUrl,"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // If passToClient contains 'user' then Vike makes a pageContext.json request"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // upon page navigation in order the retrieve the pageContextInit.user value."})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    user: req.user"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" pageContext"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" renderPage"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(pageContextInit)"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" pageContext.httpResponse"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Vike server middleware"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("}),e.jsx(s.span,{style:{color:"#E36209"},children:"req"}),e.jsx(s.span,{style:{color:"#D73A49"},children:":"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Request"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#E36209"},children:"res"}),e.jsx(s.span,{style:{color:"#D73A49"},children:":"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Response"}),e.jsx(s.span,{style:{color:"#24292E"},children:") "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" pageContextInit"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    urlOriginal: req.originalUrl,"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // If passToClient contains 'user' then Vike makes a pageContext.json request"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // upon page navigation in order the retrieve the pageContextInit.user value."})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    user: req.user"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" pageContext"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" renderPage"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(pageContextInit)"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" pageContext.httpResponse"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})})]}),`
`]}),`
`]}),`
`,e.jsx(s.p,{children:"See also:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsxs(s.a,{href:"https://github.com/vikejs/vike/issues/2566",children:["#2566 - New setting ",e.jsx(s.code,{children:".once.js"})," e.g. ",e.jsx(s.code,{children:"+data.once.js"})]})}),`
`,e.jsx(s.li,{children:e.jsxs(s.a,{href:"https://github.com/vikejs/vike/issues/2561",children:["#2561 - New setting ",e.jsx(s.code,{children:"requestPageContext: boolean"})]})}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/passToClient"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/pageContext#lifecycle"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/data#environment"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/onBeforeRender#environment"}),`
`]}),`
`]})]})}function d(l={}){const{wrapper:s}={...t(),...l.components};return s?e.jsx(s,{...l,children:e.jsx(a,{...l})}):a(l)}function h(l,s){throw new Error("Expected component `"+l+"` to be defined: you likely forgot to import, pass, or provide it.")}const p=Object.freeze(Object.defineProperty({__proto__:null,default:d,pageSectionsExport:c},Symbol.toStringTag,{value:"Module"})),T={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:i}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/pageContext-json/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:p}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{T as configValuesSerialized};
