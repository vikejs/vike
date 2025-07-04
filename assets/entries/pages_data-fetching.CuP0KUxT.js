import{o as i,a as r}from"../chunks/chunk-q7pFrboB.js";import{j as e}from"../chunks/chunk-BCGrQNKY.js";import{L as s}from"../chunks/chunk-BvbVecdL.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{U as t}from"../chunks/chunk-Cj5hnubj.js";/* empty css                      *//* empty css                      *//* empty css                      */const o=[{pageSectionId:"page-data-with-data",pageSectionLevel:2,pageSectionTitle:"Page data with `+data`"},{pageSectionId:"page-data-with-tools",pageSectionLevel:2,pageSectionTitle:"Page data with tools"},{pageSectionId:"data-mutation-subsequent-data",pageSectionLevel:2,pageSectionTitle:"Data mutation & subsequent data"},{pageSectionId:"rpc",pageSectionLevel:3,pageSectionTitle:"RPC"},{pageSectionId:"api-routes",pageSectionLevel:3,pageSectionTitle:"API routes"},{pageSectionId:"graphql",pageSectionLevel:3,pageSectionTitle:"GraphQL"},{pageSectionId:"pre-rendering-ssg",pageSectionLevel:2,pageSectionTitle:"Pre-rendering (SSG)"},{pageSectionId:"global-data",pageSectionLevel:2,pageSectionTitle:"Global data"},{pageSectionId:"state-management",pageSectionLevel:2,pageSectionTitle:"State management"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function l(a){const n={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...a.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.p,{children:"The usual recommendation is:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["For fetching a page's initial data, use Vike's ",e.jsx(n.code,{children:"+data"})," hook. See ",e.jsx(s,{href:"#page-data-with-data"}),"."]}),`
`,e.jsxs(n.li,{children:["For data mutations and subsequent data (e.g. pagination), use a tool like tRPC or TanStack Query. See ",e.jsx(s,{href:"#data-mutation-subsequent-data"}),"."]}),`
`]}),`
`,e.jsxs("h2",{id:"page-data-with-data",children:["Page data with ",e.jsx("code",{children:"+data"})]}),`
`,e.jsxs(n.p,{children:["You can fetch the initial data of a page by using ",e.jsxs(s,{href:"/data",children:["Vike's ",e.jsx(n.code,{children:"+data"})," hook"]}),", then access it by using the ",e.jsxs(s,{href:"/useData",children:["component hook ",e.jsx(n.code,{children:"useData()"})]}),"."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/movies/@id/+data.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { data }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" fetch "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'node-fetch'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" data"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"id"}),e.jsx(n.span,{style:{color:"#24292E"},children:" } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:" pageContext.routeParams"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" response"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" fetch"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#032F62"},children:"`https://star-wars.brillout.com/api/films/${"}),e.jsx(n.span,{style:{color:"#24292E"},children:"id"}),e.jsx(n.span,{style:{color:"#032F62"},children:"}.json`"}),e.jsx(n.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  let"}),e.jsx(n.span,{style:{color:"#24292E"},children:" movie "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(n.span,{style:{color:"#24292E"},children:" response."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"json"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // `movie` is serialized and passed to the client. Therefore, we pick only the"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // data the client needs in order to minimize what is sent over the network."})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  movie "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:" { title: movie.title, release_date: movie.release_date }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // data() runs only on the server-side by default, we can therefore use ORM/SQL queries."})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  /* With an ORM:"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  const movies = await Movie.findAll({ select: ['title', 'release_date'] }) */"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  /* With SQL:"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  const movies = await sql.run('SELECT { title, release_date } FROM movies;') */"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    movies"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"pageContext"})," holds contextual information, see ",e.jsx(s,{href:"/pageContext"}),"."]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"@id"})," in the file path ",e.jsx(n.code,{children:"/pages/movie/@id/+data.js"})," denotes a route parameter which value is available at ",e.jsx(s,{href:"/pageContext#routeParams",children:e.jsx(n.code,{children:"pageContext.routeParams.id"})}),", see ",e.jsx(s,{href:"/routing"}),"."]}),`
`]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// SomeComponent.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: server, client"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { useData } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike-react/useData'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"/* Or:"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"import { useData } from 'vike-vue/useData'"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"import { useData } from 'vike-solid/useData'"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"*/"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Inside a UI component"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" data"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" useData"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"name"}),e.jsx(n.span,{style:{color:"#24292E"},children:", "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"price"}),e.jsx(n.span,{style:{color:"#24292E"},children:" } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:" data"})]})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"useData()"})," is implemented by the ",e.jsx(t,{name:!0}),". If you don't use ",e.jsx(t,{name:!0,noLink:!0})," then see ",e.jsx(s,{href:"/useData#without-vike-react-vue-solid",doNotInferSectionTitle:!0}),"."]}),`
`]}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"+data"})," hook can only be used for fetching the initial data of the page. For other use cases, see ",e.jsx(s,{href:"#data-mutation-subsequent-data"}),"."]}),`
`,e.jsx("h2",{id:"page-data-with-tools",children:"Page data with tools"}),`
`,e.jsx(n.p,{children:"Some data-fetching tools have Vike extensions that enable your components to fetch initial data:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"https://github.com/vikejs/vike-react/tree/main/packages/vike-react-query#readme",children:e.jsx(n.code,{children:"vike-react-query"})})," - ",e.jsx(n.a,{href:"https://tanstack.com/query",children:"TanStack Query"})," integration for ",e.jsx(s,{href:"/vike-react",children:e.jsx(n.code,{children:"vike-react"})})]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"https://github.com/vikejs/vike-vue/tree/main/packages/vike-vue-query#readme",children:e.jsx(n.code,{children:"vike-vue-query"})})," - ",e.jsx(n.a,{href:"https://tanstack.com/query",children:"TanStack Query"})," integration for ",e.jsx(s,{href:"/vike-vue",children:e.jsx(n.code,{children:"vike-vue"})})]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"https://github.com/vikejs/vike-solid/tree/main/packages/vike-solid-query#readme",children:e.jsx(n.code,{children:"vike-solid-query"})})," - ",e.jsx(n.a,{href:"https://tanstack.com/query",children:"TanStack Query"})," integration for ",e.jsx(s,{href:"/vike-solid",children:e.jsx(n.code,{children:"vike-solid"})})]}),`
`,e.jsxs(n.li,{children:["🚧 ",e.jsx(n.code,{children:"vike-react-telefunc"})," - ",e.jsx(n.a,{href:"https://telefunc.com/",children:"Telefunc"})," integration for ",e.jsx(s,{href:"/vike-react",children:e.jsx(n.code,{children:"vike-react"})})]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["With these tools, instead of using Vike's ",e.jsx(n.code,{children:"+data"})," hook, you can directly fetch data in components, including your ",e.jsxs(s,{href:"/Layout",children:[e.jsx(n.code,{children:"<Layout>"})," components"]}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"data-mutation-subsequent-data",children:"Data mutation & subsequent data"}),`
`,e.jsx(n.p,{children:"For data mutation and subsequent data fetching (such as pagination data), use a data tool."}),`
`,e.jsx("h3",{id:"rpc",children:"RPC"}),`
`,e.jsx(n.p,{children:"We generally recommend using RPC. It's simple, flexible, and performant."}),`
`,e.jsxs(n.p,{children:["For a list of RPC tools, see ",e.jsx(s,{href:"/RPC"}),"."]}),`
`,e.jsx("h3",{id:"api-routes",children:"API routes"}),`
`,e.jsxs(n.p,{children:["A common alternative to RPC is to use API routes, see ",e.jsx(s,{href:"/api-routes"}),"."]}),`
`,e.jsx("h3",{id:"graphql",children:"GraphQL"}),`
`,e.jsx(n.p,{children:"For large teams, it may make sense to use GraphQL instead of RPC."}),`
`,e.jsx(n.p,{children:"With Vike, you can manually integrate GraphQL tools yourself, giving you complete control over integration:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/apollo-graphql"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/relay"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/urql"}),`
`]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["In addition to manual integration, ",e.jsx(n.a,{href:"https://github.com/vikejs/vike/issues/1715",children:"you will soon"})," have the option to use ",e.jsx(s,{href:"/extensions",children:"Vike extensions"})," for automatic integration."]}),`
`]}),`
`,e.jsx("h2",{id:"pre-rendering-ssg",children:"Pre-rendering (SSG)"}),`
`,e.jsxs(n.p,{children:["For ",e.jsx(s,{href:"/pre-rendering",children:"pre-rendered pages / SSG apps"}),", in order to fetch dynamic data from an external server, make sure to load and execute ",e.jsx(n.code,{children:"data()"})," only on the client-side, see ",e.jsx(s,{href:"/data#environment"}),"."]}),`
`,e.jsx("h2",{id:"global-data",children:"Global data"}),`
`,e.jsxs(n.p,{children:["A common use case is fetching global initial data needed by all or several pages — for example, ",e.jsx(s,{href:"/auth",children:"information about the logged-in user"})," or ",e.jsx(s,{href:"/i18n",children:"i18n data"}),"."]}),`
`,e.jsxs(n.p,{children:["You can store such data in ",e.jsx(n.code,{children:"globalContext"})," and/or ",e.jsx(n.code,{children:"pageContext"}),", and fetch it in ",e.jsx(n.code,{children:"+onCreateGlobalContext()"})," and/or ",e.jsx(n.code,{children:"+onCreatePageContext()"}),"."]}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"globalContext"})," object is accessible anywhere, while ",e.jsx(n.code,{children:"pageContext"})," is accessible from any ",e.jsx(s,{href:"/hooks",children:"Vike hook"})," or UI component."]}),`
`,e.jsx(n.p,{children:"See:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/pageContext"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/globalContext"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/onCreatePageContext"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/onCreateGlobalContext"}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"state-management",children:"State management"}),`
`,e.jsxs(n.p,{children:["See ",e.jsx(s,{href:"/store"}),"."]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/data"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/useData"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/RPC"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/api-routes"}),`
`]}),`
`]})]})}function d(a={}){const{wrapper:n}=a.components||{};return n?e.jsx(n,{...a,children:e.jsx(l,{...a})}):l(a)}const c=Object.freeze(Object.defineProperty({__proto__:null,default:d,pageSectionsExport:o},Symbol.toStringTag,{value:"Module"})),b={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:r}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:i}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/data-fetching/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:c}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{b as configValuesSerialized};
