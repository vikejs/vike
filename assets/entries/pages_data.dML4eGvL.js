import{j as e,b as l,i,L as o,o as d}from"../chunks/chunk-CD4OIbt0.js";import{L as n}from"../chunks/chunk-DU346RtI.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-Dn2LrIF6.js";import{U as r}from"../chunks/chunk-CbSIsiJb.js";/* empty css                      *//* empty css                      */const c=[{pageSectionId:"orm-sql",pageSectionLevel:2,pageSectionTitle:"ORM/SQL"},{pageSectionId:"error-handling",pageSectionLevel:2,pageSectionTitle:"Error handling"},{pageSectionId:"environment",pageSectionLevel:2,pageSectionTitle:"Environment"},{pageSectionId:"client-side-only",pageSectionLevel:3,pageSectionTitle:"Client-side only"},{pageSectionId:"server-and-client-side",pageSectionLevel:3,pageSectionTitle:"Server- and client-side"},{pageSectionId:"examples",pageSectionLevel:2,pageSectionTitle:"Examples"},{pageSectionId:"typescript",pageSectionLevel:2,pageSectionTitle:"TypeScript"},{pageSectionId:"without-vike-react-vue-solid",pageSectionLevel:2,pageSectionTitle:"Without `vike-{react,vue,solid}`"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function t(a){const s={blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...a.components};return e.jsxs(e.Fragment,{children:[e.jsxs(s.p,{children:["Environment: server (",e.jsx(n,{href:"#environment",children:"configurable"}),")."]}),`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.code,{children:"data()"})," hook is used for fetching data. It's usually used together with ",e.jsx(n,{href:"/useData",children:e.jsx(s.code,{children:"useData()"})}),"."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["See ",e.jsx(n,{href:"/data-fetching"})," for an introduction about ",e.jsx(s.code,{children:"data()"})," and fetching data in general."]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["For a lower-level hook with more control, see ",e.jsx(n,{href:"/onBeforeRender"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"orm-sql",children:"ORM/SQL"}),`
`,e.jsxs(s.p,{children:["By default (",e.jsx(n,{href:"#environment",children:"it's configurable"}),") the ",e.jsx(s.code,{children:"data()"})," hook always runs the server-side, which means you can directly use ORM/SQL database queries:"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/movies/+data.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { data }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Note how we use `node-fetch`; this file is only run on the server-side, thus we don't need"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// to use an isomorphic (aka universal) implementation such as `cross-fetch`."})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" fetch "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'node-fetch'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" data"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" response"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" fetch"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'https://star-wars.brillout.com/api/films.json'"}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  let"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { movies } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(s.span,{style:{color:"#24292E"},children:" response."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"json"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  /* Or with an ORM:"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  let movies = await Movie.findAll() */"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  /* Or with SQL:"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  let movies = await sql.run('SELECT * FROM movies;') */"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // `movies` is serialized and passed to the client. Therefore, we pick only the"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // data the client needs in order to minimize what is sent over the network."})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  movies "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" movies."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"map"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(({ "}),e.jsx(s.span,{style:{color:"#E36209"},children:"title"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#E36209"},children:"release_date"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }) "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ({ title, release_date }))"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    movies"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h2",{id:"error-handling",children:"Error handling"}),`
`,e.jsxs(s.p,{children:["If an error is thrown by ",e.jsx(s.code,{children:"data()"}),", then Vike renders your ",e.jsx(n,{text:"error page",href:"/error-page"})," and there is usually nothing for you to do (beyond defining an error page ",e.jsx(s.code,{children:"/pages/_error/+Page.js"}),")."]}),`
`,e.jsxs(s.p,{children:['But if you want a more precise error handling (such as showing an insightful error message to the user instead of some generic "Something went wrong"), then use ',e.jsx(n,{href:"/render",text:e.jsx(s.code,{children:"throw render()"})})," and/or ",e.jsx(n,{href:"/redirect",text:e.jsx(s.code,{children:"throw redirect()"})}),"."]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/movies/+data.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { data }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" fetch "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'node-fetch'"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { render, redirect } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/abort'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" data"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"id"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" pageContext.routeParams"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" response"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" fetch"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"`https://star-wars.brillout.com/api/films/${"}),e.jsx(s.span,{style:{color:"#24292E"},children:"id"}),e.jsx(s.span,{style:{color:"#032F62"},children:"}.json`"}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(s.span,{style:{color:"#24292E"},children:" (response.status "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"==="}),e.jsx(s.span,{style:{color:"#005CC5"},children:" 404"}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // Tell the user what went wrong"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"    throw"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" render"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#005CC5"},children:"404"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#032F62"},children:"`Movie with ID ${"}),e.jsx(s.span,{style:{color:"#24292E"},children:"id"}),e.jsx(s.span,{style:{color:"#032F62"},children:"} doesn't exist.`"}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    /* Or redirect the user:"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    throw redirect('/movie/add') */"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    /* Or render the movie submission form while preserving the URL:"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    throw render('/movie/add') */"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // ..."})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:[e.jsx(s.code,{children:"throw render('/movie/add')"})," is a technique explained at ",e.jsx(n,{href:"/auth#login-flow"}),"."]}),`
`]}),`
`,e.jsxs(s.p,{children:["Alternatively, you can use ",e.jsx(s.code,{children:"throw render()"})," and ",e.jsx(s.code,{children:"throw redirect()"})," inside of a ",e.jsxs(n,{href:"/guard",children:[e.jsx(s.code,{children:"guard()"})," hook"]}),", see ",e.jsx(n,{href:"/auth"}),"."]}),`
`,e.jsx("h2",{id:"environment",children:"Environment"}),`
`,e.jsxs(s.p,{children:["By default, the ",e.jsx(s.code,{children:"data()"})," hook always runs on the server-side."]}),`
`,e.jsxs(s.p,{children:["By using ",e.jsxs(n,{href:"/file-env#for-files",children:[e.jsx(s.code,{children:".client.js"})," (or ",e.jsx(s.code,{children:".shared.js"}),")"]}),`,
you can tell Vike to only (or also) load and execute `,e.jsx(s.code,{children:"data()"})," on the client-side."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["Alternatively, instead of using ",e.jsx(s.code,{children:".shared.js"})," and ",e.jsx(s.code,{children:".client.js"}),", you can modify the ",e.jsxs(n,{href:"/meta#example-modify-data-env",children:[e.jsx(s.code,{children:"meta.env"})," setting"]})," of the ",e.jsx(s.code,{children:"data()"})," hook in a global fashion, removing the need to add ",e.jsx(s.code,{children:".shared.js"})," / ",e.jsx(s.code,{children:".client.js"})," to each of your ",e.jsx(s.code,{children:"+data.js"})," files."]}),`
`]}),`
`,e.jsx("h3",{id:"client-side-only",children:"Client-side only"}),`
`,e.jsxs(s.p,{children:["By using ",e.jsx(s.code,{children:".client.js"}),`,
you can tell Vike to load and execute `,e.jsx(s.code,{children:"data()"})," only on the client-side (never on the server-side)."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["For ",e.jsx(n,{href:"/pre-rendering",children:"pre-rendered pages (SSG)"}),", if you want to fetch dynamic data provided by some server (Java/PHP/JavaScript/...), then make sure to always call ",e.jsx(s.code,{children:"data()"})," on the client-side (i.e. ",e.jsx(s.code,{children:"+data.client.js"}),")."]}),`
`,e.jsxs(s.p,{children:['Note that, for pre-rendered pages, the data that is fetched from the "server-side" is the static JSON file ',e.jsx(n,{href:"/pageContext.json",children:e.jsx(s.code,{children:"dist/client/some-page/index.pageContext.json"})})," that was generated at build-time upon pre-rendering the page."]}),`
`]}),`
`,e.jsx("h3",{id:"server-and-client-side",children:"Server- and client-side"}),`
`,e.jsxs(s.p,{children:["By using ",e.jsx(s.code,{children:".shared.js"}),`,
you can tell Vike to load and execute `,e.jsx(s.code,{children:"data()"})," also on the client-side:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"data()"})," runs on the server-side for the first page the user visits."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"data()"})," runs on the client-side for subsequent page navigations."]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["In general, we recommend running ",e.jsx(s.code,{children:"data()"})," only on the server-side because it's easier to write code that runs in only one environment."]}),`
`,e.jsxs(s.p,{children:["That said, if you want to minimize requests made to your server, then it can make sense to run ",e.jsx(s.code,{children:"data()"})," also on the client-side. See:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/pageContext.json#avoid-pagecontext-json-requests",doNotInferSectionTitle:!0,noBreadcrumb:!0}),`
`]}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"examples",children:"Examples"}),`
`,e.jsx(s.p,{children:"React + JavaScript:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{path:"/boilerplates/boilerplate-react/pages/star-wars/index/+data.js"}),`
`]}),`
`,e.jsxs(s.li,{children:[e.jsx(l,{path:"/boilerplates/boilerplate-react/pages/star-wars/index/+Page.jsx"})," (",e.jsx(s.code,{children:"useData()"})," usage)"]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{path:"/boilerplates/boilerplate-react/pages/star-wars/@id/+data.js"}),`
`]}),`
`,e.jsxs(s.li,{children:[e.jsx(l,{path:"/boilerplates/boilerplate-react/pages/star-wars/@id/+Page.jsx"})," (",e.jsx(s.code,{children:"useData()"})," usage)"]}),`
`]}),`
`,e.jsx(s.p,{children:"React + TypeScript:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{path:"/boilerplates/boilerplate-react-ts/pages/star-wars/index/+data.ts"}),`
`]}),`
`,e.jsxs(s.li,{children:[e.jsx(l,{path:"/boilerplates/boilerplate-react-ts/pages/star-wars/index/+Page.tsx"})," (",e.jsx(s.code,{children:"useData()"})," usage)"]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{path:"/boilerplates/boilerplate-react-ts/pages/star-wars/@id/+data.ts"}),`
`]}),`
`,e.jsxs(s.li,{children:[e.jsx(l,{path:"/boilerplates/boilerplate-react-ts/pages/star-wars/@id/+Page.tsx"})," (",e.jsx(s.code,{children:"useData()"})," usage)"]}),`
`]}),`
`,e.jsx(s.p,{children:"Vue + JavaScript:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{path:"/boilerplates/boilerplate-vue/pages/star-wars/index/+data.js"}),`
`]}),`
`,e.jsxs(s.li,{children:[e.jsx(l,{path:"/boilerplates/boilerplate-vue/pages/star-wars/index/+Page.vue"})," (",e.jsx(s.code,{children:"useData()"})," usage)"]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{path:"/boilerplates/boilerplate-vue/pages/star-wars/@id/+data.js"}),`
`]}),`
`,e.jsxs(s.li,{children:[e.jsx(l,{path:"/boilerplates/boilerplate-vue/pages/star-wars/@id/+Page.vue"})," (",e.jsx(s.code,{children:"useData()"})," usage)"]}),`
`]}),`
`,e.jsx(s.p,{children:"Vue + TypeScript:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{path:"/boilerplates/boilerplate-vue-ts/pages/star-wars/index/+data.ts"}),`
`]}),`
`,e.jsxs(s.li,{children:[e.jsx(l,{path:"/boilerplates/boilerplate-vue-ts/pages/star-wars/index/+Page.vue"})," (",e.jsx(s.code,{children:"useData()"})," usage)"]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{path:"/boilerplates/boilerplate-vue-ts/pages/star-wars/@id/+data.ts"}),`
`]}),`
`,e.jsxs(s.li,{children:[e.jsx(l,{path:"/boilerplates/boilerplate-vue-ts/pages/star-wars/@id/+Page.vue"})," (",e.jsx(s.code,{children:"useData()"})," usage)"]}),`
`]}),`
`,e.jsx("h2",{id:"typescript",children:"TypeScript"}),`
`,e.jsxs(s.p,{children:["See ",e.jsx(n,{href:"/useData#typescript",doNotInferSectionTitle:!0}),"."]}),`
`,e.jsxs("h2",{id:"without-vike-react-vue-solid",children:["Without ",e.jsx("code",{children:"vike-{react,vue,solid}"})]}),`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.code,{children:"data()"})," hook is usually used together with the component hook ",e.jsx(n,{href:"/useData",children:e.jsx(s.code,{children:"useData()"})})," which is provided by the ",e.jsx(r,{}),"."]}),`
`,e.jsxs(s.p,{children:["In general, for improved DX, we recommend using ",e.jsx(s.code,{children:"data()"})," together with a ",e.jsx(s.code,{children:"useData()"})," implementation."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["In case you don't use ",e.jsx(r,{name:!0,noLink:!0}),", you can implement ",e.jsx(s.code,{children:"useData()"})," yourself as shown at ",e.jsx(n,{href:"/useData#without-vike-react-vue-solid",doNotInferSectionTitle:!0})]}),`
`]}),`
`,e.jsxs(s.p,{children:["That said, you can also use ",e.jsx(s.code,{children:"data()"})," without ",e.jsx(s.code,{children:"useData()"}),":"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/+onRenderHtml.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { onRenderHtml }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { escapeInject, dangerouslySkipEscape } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/server'"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { renderToHtml, createElement } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'some-ui-framework'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" onRenderHtml"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // The data is available at pageContext.data"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"Page"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"data"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" pageContext"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" pageHtml"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" renderToHtml"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // Pass pageContext.data to the <Page> component"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"    createElement"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(Page, data)"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  )"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  /* JSX:"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  const pageHtml = await renderToHtml(<Page {...data} />)"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  */"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" escapeInject"}),e.jsx(s.span,{style:{color:"#032F62"},children:"`<html>"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"    <div id='view-root'>"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"      ${"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"dangerouslySkipEscape"}),e.jsx(s.span,{style:{color:"#032F62"},children:"("}),e.jsx(s.span,{style:{color:"#24292E"},children:"pageHtml"}),e.jsx(s.span,{style:{color:"#032F62"},children:")"}),e.jsx(s.span,{style:{color:"#032F62"},children:"}"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"    </div>"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"  </html>`"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/+onRenderClient.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Environment: browser"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { onRenderClient }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { hydrateDom, createElement } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'some-ui-framework'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" onRenderClient"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"Page"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"data"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" pageContext"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  await"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" hydrateDom"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // Pass pageContext.data to the <Page> component"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"    createElement"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(Page, data),"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    document."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"getElementById"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'view-root'"}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  )"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  /* JSX:"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  await hydrateDom(<Page {...data} />, document.getElementById('view-root'))"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  */"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/movies/+Page.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Environment: browser and server"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Page }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// In the onRenderHtml() and onRenderClient() hooks above,"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pageContext.data is passed to the <Page> component."})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Page"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#E36209"},children:"data"}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"movies"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" data"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // ..."})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/data-fetching"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/useData"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsxs(n,{href:"/pageContext#:~:text=pageContext.data,-%3A",children:["API > ",e.jsx(s.code,{children:"pageContext.data"})]}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/guard"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/onBeforeRender"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/pageContext.json"}),`
`]}),`
`]})]})}function h(a={}){const{wrapper:s}=a.components||{};return s?e.jsx(s,{...a,children:e.jsx(t,{...a})}):t(a)}const p=Object.freeze(Object.defineProperty({__proto__:null,default:h,pageSectionsExport:c},Symbol.toStringTag,{value:"Module"})),S={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:d}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/data/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:p}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:i}}};export{S as configValuesSerialized};
