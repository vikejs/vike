import{o as i,a as o}from"../chunks/chunk-B4JfPEMQ.js";import{j as e,b as l}from"../chunks/chunk-D_tQTwD-.js";import{L as s}from"../chunks/chunk-CaxrPmIz.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{U as r}from"../chunks/chunk-B3GE02Yg.js";/* empty css                      *//* empty css                      *//* empty css                      */const c=[{pageSectionId:"orm-sql",pageSectionLevel:2,pageSectionTitle:"ORM/SQL"},{pageSectionId:"error-handling",pageSectionLevel:2,pageSectionTitle:"Error handling"},{pageSectionId:"environment",pageSectionLevel:2,pageSectionTitle:"Environment"},{pageSectionId:"client-side-only",pageSectionLevel:3,pageSectionTitle:"Client-side only"},{pageSectionId:"server-and-client-side",pageSectionLevel:3,pageSectionTitle:"Server- and client-side"},{pageSectionId:"examples",pageSectionLevel:2,pageSectionTitle:"Examples"},{pageSectionId:"typescript",pageSectionLevel:2,pageSectionTitle:"TypeScript"},{pageSectionId:"without-vike-react-vue-solid",pageSectionLevel:2,pageSectionTitle:"Without `vike-{react,vue,solid}`"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function t(a){const n={blockquote:"blockquote",br:"br",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...a.components};return e.jsxs(e.Fragment,{children:[e.jsxs(n.p,{children:["Environment: server (",e.jsx(s,{href:"#environment",children:"configurable"}),")",e.jsx(n.br,{}),`
`,e.jsx(s,{href:"/config#cumulative",children:"Cumulative"}),": false",e.jsx(n.br,{}),`
`,e.jsx(s,{href:"/config#global",children:"Global"}),": false"]}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"data()"})," hook is used for fetching data. It's usually used together with ",e.jsx(s,{href:"/useData",children:e.jsx(n.code,{children:"useData()"})}),"."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["See ",e.jsx(s,{href:"/data-fetching"})," for an introduction about ",e.jsx(n.code,{children:"data()"})," and fetching data in general."]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["For a lower-level hook with more control, see ",e.jsx(s,{href:"/onBeforeRender"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"orm-sql",children:"ORM/SQL"}),`
`,e.jsxs(n.p,{children:["By default (",e.jsx(s,{href:"#environment",children:"it's configurable"}),") the ",e.jsx(n.code,{children:"data()"})," hook always runs the server-side, which means you can directly use ORM/SQL database queries:"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/movies/+data.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { data }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Note how we use `node-fetch`; this file is only run on the server-side, thus we don't need"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// to use an isomorphic (aka universal) implementation such as `cross-fetch`."})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" fetch "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'node-fetch'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" data"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" response"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" fetch"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#032F62"},children:"'https://star-wars.brillout.com/api/films.json'"}),e.jsx(n.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  let"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { movies } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(n.span,{style:{color:"#24292E"},children:" response."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"json"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  /* Or with an ORM:"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  let movies = await Movie.findAll() */"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  /* Or with SQL:"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  let movies = await sql.run('SELECT * FROM movies;') */"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // `movies` is serialized and passed to the client. Therefore, we pick only the"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // data the client needs in order to minimize what is sent over the network."})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  movies "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:" movies."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"map"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(({ "}),e.jsx(n.span,{style:{color:"#E36209"},children:"title"}),e.jsx(n.span,{style:{color:"#24292E"},children:", "}),e.jsx(n.span,{style:{color:"#E36209"},children:"release_date"}),e.jsx(n.span,{style:{color:"#24292E"},children:" }) "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(n.span,{style:{color:"#24292E"},children:" ({ title, release_date }))"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    movies"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h2",{id:"error-handling",children:"Error handling"}),`
`,e.jsxs(n.p,{children:["If an error is thrown by ",e.jsx(n.code,{children:"data()"}),", then Vike renders your ",e.jsx(s,{text:"error page",href:"/error-page"})," and there is usually nothing for you to do (beyond defining an error page ",e.jsx(n.code,{children:"/pages/_error/+Page.js"}),")."]}),`
`,e.jsxs(n.p,{children:['But if you want a more precise error handling (such as showing an insightful error message to the user instead of some generic "Something went wrong"), then use ',e.jsx(s,{href:"/render",text:e.jsx(n.code,{children:"throw render()"})})," and/or ",e.jsx(s,{href:"/redirect",text:e.jsx(n.code,{children:"throw redirect()"})}),"."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/movies/+data.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { data }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" fetch "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'node-fetch'"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { render, redirect } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/abort'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" data"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"id"}),e.jsx(n.span,{style:{color:"#24292E"},children:" } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:" pageContext.routeParams"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" response"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" fetch"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#032F62"},children:"`https://star-wars.brillout.com/api/films/${"}),e.jsx(n.span,{style:{color:"#24292E"},children:"id"}),e.jsx(n.span,{style:{color:"#032F62"},children:"}.json`"}),e.jsx(n.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(n.span,{style:{color:"#24292E"},children:" (response.status "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"==="}),e.jsx(n.span,{style:{color:"#005CC5"},children:" 404"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // Tell the user what went wrong"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"    throw"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" render"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#005CC5"},children:"404"}),e.jsx(n.span,{style:{color:"#24292E"},children:", "}),e.jsx(n.span,{style:{color:"#032F62"},children:"`Movie with ID ${"}),e.jsx(n.span,{style:{color:"#24292E"},children:"id"}),e.jsx(n.span,{style:{color:"#032F62"},children:"} doesn't exist.`"}),e.jsx(n.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    /* Or redirect the user:"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    throw redirect('/movie/add') */"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    /* Or render the movie submission form while preserving the URL:"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    throw render('/movie/add') */"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // ..."})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"throw render('/movie/add')"})," is a technique explained at ",e.jsx(s,{href:"/auth#login-flow"}),"."]}),`
`]}),`
`,e.jsxs(n.p,{children:["Alternatively, you can use ",e.jsx(n.code,{children:"throw render()"})," and ",e.jsx(n.code,{children:"throw redirect()"})," inside of a ",e.jsxs(s,{href:"/guard",children:[e.jsx(n.code,{children:"guard()"})," hook"]}),", see ",e.jsx(s,{href:"/auth"}),"."]}),`
`,e.jsx("h2",{id:"environment",children:"Environment"}),`
`,e.jsxs(n.p,{children:["By default, the ",e.jsx(n.code,{children:"data()"})," hook always runs on the server-side."]}),`
`,e.jsxs(n.p,{children:["By using ",e.jsxs(s,{href:"/file-env#for-files",children:[e.jsx(n.code,{children:".client.js"})," (or ",e.jsx(n.code,{children:".shared.js"}),")"]}),`,
you can tell Vike to only (or also) load and execute `,e.jsx(n.code,{children:"data()"})," on the client-side."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Alternatively, instead of using ",e.jsx(n.code,{children:".shared.js"})," and ",e.jsx(n.code,{children:".client.js"}),", you can modify the ",e.jsxs(s,{href:"/meta#example-modify-data-env",children:[e.jsx(n.code,{children:"meta.env"})," setting"]})," of the ",e.jsx(n.code,{children:"data()"})," hook in a global fashion, removing the need to add ",e.jsx(n.code,{children:".shared.js"})," / ",e.jsx(n.code,{children:".client.js"})," to each of your ",e.jsx(n.code,{children:"+data.js"})," files."]}),`
`]}),`
`,e.jsx("h3",{id:"client-side-only",children:"Client-side only"}),`
`,e.jsxs(n.p,{children:["By using ",e.jsx(n.code,{children:".client.js"}),`,
you can tell Vike to load and execute `,e.jsx(n.code,{children:"data()"})," only on the client-side (never on the server-side)."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["For ",e.jsx(s,{href:"/pre-rendering",children:"pre-rendered pages (SSG)"}),", if you want to fetch dynamic data provided by some server (Java/PHP/JavaScript/...), then make sure to always call ",e.jsx(n.code,{children:"data()"})," on the client-side (i.e. ",e.jsx(n.code,{children:"+data.client.js"}),")."]}),`
`,e.jsxs(n.p,{children:['Note that, for pre-rendered pages, the data that is fetched from the "server-side" is the static JSON file ',e.jsx(s,{href:"/pageContext.json",children:e.jsx(n.code,{children:"dist/client/some-page/index.pageContext.json"})})," that was generated at build-time upon pre-rendering the page."]}),`
`]}),`
`,e.jsx("h3",{id:"server-and-client-side",children:"Server- and client-side"}),`
`,e.jsxs(n.p,{children:["By using ",e.jsx(n.code,{children:".shared.js"}),`,
you can tell Vike to load and execute `,e.jsx(n.code,{children:"data()"})," also on the client-side:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"data()"})," runs on the server-side for the first page the user visits."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"data()"})," runs on the client-side for subsequent page navigations."]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["In general, we recommend running ",e.jsx(n.code,{children:"data()"})," only on the server-side because it's easier to write code that runs in only one environment."]}),`
`,e.jsxs(n.p,{children:["That said, if you want to minimize requests made to your server, then it can make sense to run ",e.jsx(n.code,{children:"data()"})," also on the client-side. See:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/pageContext.json#avoid-pagecontext-json-requests",doNotInferSectionTitle:!0,noBreadcrumb:!0}),`
`]}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"examples",children:"Examples"}),`
`,e.jsx(n.p,{children:"React + JavaScript:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{path:"/packages/create-vike-core/boilerplate-react/pages/star-wars/index/+data.js"}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(l,{path:"/packages/create-vike-core/boilerplate-react/pages/star-wars/index/+Page.jsx"})," (",e.jsx(n.code,{children:"useData()"})," usage)"]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{path:"/packages/create-vike-core/boilerplate-react/pages/star-wars/@id/+data.js"}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(l,{path:"/packages/create-vike-core/boilerplate-react/pages/star-wars/@id/+Page.jsx"})," (",e.jsx(n.code,{children:"useData()"})," usage)"]}),`
`]}),`
`,e.jsx(n.p,{children:"React + TypeScript:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{path:"/packages/create-vike-core/boilerplate-react-ts/pages/star-wars/index/+data.ts"}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(l,{path:"/packages/create-vike-core/boilerplate-react-ts/pages/star-wars/index/+Page.tsx"})," (",e.jsx(n.code,{children:"useData()"})," usage)"]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{path:"/packages/create-vike-core/boilerplate-react-ts/pages/star-wars/@id/+data.ts"}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(l,{path:"/packages/create-vike-core/boilerplate-react-ts/pages/star-wars/@id/+Page.tsx"})," (",e.jsx(n.code,{children:"useData()"})," usage)"]}),`
`]}),`
`,e.jsx(n.p,{children:"Vue + JavaScript:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{path:"/packages/create-vike-core/boilerplate-vue/pages/star-wars/index/+data.js"}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(l,{path:"/packages/create-vike-core/boilerplate-vue/pages/star-wars/index/+Page.vue"})," (",e.jsx(n.code,{children:"useData()"})," usage)"]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{path:"/packages/create-vike-core/boilerplate-vue/pages/star-wars/@id/+data.js"}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(l,{path:"/packages/create-vike-core/boilerplate-vue/pages/star-wars/@id/+Page.vue"})," (",e.jsx(n.code,{children:"useData()"})," usage)"]}),`
`]}),`
`,e.jsx(n.p,{children:"Vue + TypeScript:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{path:"/packages/create-vike-core/boilerplate-vue-ts/pages/star-wars/index/+data.ts"}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(l,{path:"/packages/create-vike-core/boilerplate-vue-ts/pages/star-wars/index/+Page.vue"})," (",e.jsx(n.code,{children:"useData()"})," usage)"]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{path:"/packages/create-vike-core/boilerplate-vue-ts/pages/star-wars/@id/+data.ts"}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(l,{path:"/packages/create-vike-core/boilerplate-vue-ts/pages/star-wars/@id/+Page.vue"})," (",e.jsx(n.code,{children:"useData()"})," usage)"]}),`
`]}),`
`,e.jsx("h2",{id:"typescript",children:"TypeScript"}),`
`,e.jsxs(n.p,{children:["See ",e.jsx(s,{href:"/useData#typescript",doNotInferSectionTitle:!0}),"."]}),`
`,e.jsxs("h2",{id:"without-vike-react-vue-solid",children:["Without ",e.jsx("code",{children:"vike-{react,vue,solid}"})]}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"data()"})," hook is usually used together with the component hook ",e.jsx(s,{href:"/useData",children:e.jsx(n.code,{children:"useData()"})})," which is provided by the ",e.jsx(r,{}),"."]}),`
`,e.jsxs(n.p,{children:["In general, for improved DX, we recommend using ",e.jsx(n.code,{children:"data()"})," together with a ",e.jsx(n.code,{children:"useData()"})," implementation."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["In case you don't use ",e.jsx(r,{name:!0,noLink:!0}),", you can implement ",e.jsx(n.code,{children:"useData()"})," yourself as shown at ",e.jsx(s,{href:"/useData#without-vike-react-vue-solid",doNotInferSectionTitle:!0})]}),`
`]}),`
`,e.jsxs(n.p,{children:["That said, you can also use ",e.jsx(n.code,{children:"data()"})," without ",e.jsx(n.code,{children:"useData()"}),":"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /renderer/+onRenderHtml.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { onRenderHtml }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { escapeInject, dangerouslySkipEscape } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/server'"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { renderToHtml, createElement } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'some-ui-framework'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onRenderHtml"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // The data is available at pageContext.data"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"Page"}),e.jsx(n.span,{style:{color:"#24292E"},children:", "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"data"}),e.jsx(n.span,{style:{color:"#24292E"},children:" } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:" pageContext"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" pageHtml"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" renderToHtml"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // Pass pageContext.data to the <Page> component"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"    createElement"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(Page, data)"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  )"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  /* JSX:"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  const pageHtml = await renderToHtml(<Page {...data} />)"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  */"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" escapeInject"}),e.jsx(n.span,{style:{color:"#032F62"},children:"`<html>"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#032F62"},children:"    <div id='view-root'>"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#032F62"},children:"      ${"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"dangerouslySkipEscape"}),e.jsx(n.span,{style:{color:"#032F62"},children:"("}),e.jsx(n.span,{style:{color:"#24292E"},children:"pageHtml"}),e.jsx(n.span,{style:{color:"#032F62"},children:")"}),e.jsx(n.span,{style:{color:"#032F62"},children:"}"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#032F62"},children:"    </div>"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#032F62"},children:"  </html>`"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /renderer/+onRenderClient.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: client"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { onRenderClient }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { hydrateDom, createElement } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'some-ui-framework'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onRenderClient"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"Page"}),e.jsx(n.span,{style:{color:"#24292E"},children:", "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"data"}),e.jsx(n.span,{style:{color:"#24292E"},children:" } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:" pageContext"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  await"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" hydrateDom"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // Pass pageContext.data to the <Page> component"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"    createElement"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(Page, data),"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"    document."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"getElementById"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#032F62"},children:"'view-root'"}),e.jsx(n.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  )"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  /* JSX:"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  await hydrateDom(<Page {...data} />, document.getElementById('view-root'))"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  */"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/movies/+Page.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: client and server"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { Page }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// In the onRenderHtml() and onRenderClient() hooks above,"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pageContext.data is passed to the <Page> component."})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Page"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"data"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"movies"}),e.jsx(n.span,{style:{color:"#24292E"},children:" } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:" data"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // ..."})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/data-fetching"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/useData"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(s,{href:"/pageContext#data",children:["API > ",e.jsx(n.code,{children:"pageContext.data"})]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/guard"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/onBeforeRender"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/pageContext.json"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/hooks"}),`
`]}),`
`]})]})}function d(a={}){const{wrapper:n}=a.components||{};return n?e.jsx(n,{...a,children:e.jsx(t,{...a})}):t(a)}const h=Object.freeze(Object.defineProperty({__proto__:null,default:d,pageSectionsExport:c},Symbol.toStringTag,{value:"Module"})),k={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:i}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/data/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:h}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{k as configValuesSerialized};
