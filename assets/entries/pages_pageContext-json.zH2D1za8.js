import{j as e,i as r,L as t,o}from"../chunks/chunk-Bk-4JIbo.js";import{L as s}from"../chunks/chunk-BQ8eiXkO.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-BuumvMGq.js";/* empty css                      */const i=[{pageSectionId:"example",pageSectionLevel:2,pageSectionTitle:"Example"},{pageSectionId:"avoid-pagecontext-json-requests",pageSectionLevel:2,pageSectionTitle:"Avoid `pageContext.json` requests"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function a(l){const n={blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...l.components};return e.jsxs(e.Fragment,{children:[e.jsxs(n.p,{children:["Upon ",e.jsx(s,{href:"/client-routing",children:"client-side navigation"}),`,
Vike retrieves certain server-side `,e.jsx(n.code,{children:"pageContext"})," properties by sending an HTTP request to your server."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"shell","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"shell","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Retrieve data fetched on the server-side"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"HTTP"}),e.jsx(n.span,{style:{color:"#032F62"},children:" GET"}),e.jsx(n.span,{style:{color:"#032F62"},children:" /product/42/index.pageContext.json"})]})]})})}),`
`,e.jsxs(n.p,{children:["Most notably, the returned ",e.jsx(n.code,{children:"pageContext"})," object includes data fetched via ",e.jsxs(s,{href:"/data#environment",children:[e.jsx(n.code,{children:"+data"})," on the server-side"]}),"."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["If the server-side doesn't fetch data, then the client-side skips making a ",e.jsx(n.code,{children:"pageContext.json"})," request, see ",e.jsx(s,{href:"#avoid-pagecontext-json-requests"}),"."]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["See also: ",e.jsx(s,{href:"/pageContext#lifecycle"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"example",children:"Example"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/star-wars/+data.server.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// This data() hook is always called on the server-side. But, upon page navigation, the data"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// needs to be available on the client-side thus Vike makes a /star-wars/index.pageContext.json"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// request in order to pass the data from the server to the client."})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" data"}),e.jsx(n.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" response"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" fetch"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#032F62"},children:"'https://star-wars.brillout.com/api/films.json'"}),e.jsx(n.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" movies"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(n.span,{style:{color:"#24292E"},children:" response."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"json"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { movies }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.p,{children:["The request ",e.jsx(n.code,{children:"/star-wars/index.pageContext.json"})," returns the data fetched by the ",e.jsx(n.code,{children:"data()"})," hook."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"bash","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"bash","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(n.span,{style:{color:"#032F62"},children:" curl"}),e.jsx(n.span,{style:{color:"#032F62"},children:" /star-wars/index.pageContext.json"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"{"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:'  "data"'}),e.jsx(n.span,{style:{color:"#005CC5"},children:":"}),e.jsx(n.span,{style:{color:"#032F62"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:'    "movies"'}),e.jsx(n.span,{style:{color:"#005CC5"},children:":"}),e.jsx(n.span,{style:{color:"#24292E"},children:" ["})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"      {"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:'        "title"'}),e.jsx(n.span,{style:{color:"#005CC5"},children:":"}),e.jsx(n.span,{style:{color:"#032F62"},children:' "A New Hope",'})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:'        "release_date"'}),e.jsx(n.span,{style:{color:"#005CC5"},children:":"}),e.jsx(n.span,{style:{color:"#032F62"},children:' "1977-05-25"'})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"      },"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"      {"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:'        "title"'}),e.jsx(n.span,{style:{color:"#005CC5"},children:":"}),e.jsx(n.span,{style:{color:"#032F62"},children:' "The Empire Strikes Back",'})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:'        "release_date"'}),e.jsx(n.span,{style:{color:"#005CC5"},children:":"}),e.jsx(n.span,{style:{color:"#032F62"},children:' "1980-05-17"'})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"      },"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"      {"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:'        "title"'}),e.jsx(n.span,{style:{color:"#005CC5"},children:":"}),e.jsx(n.span,{style:{color:"#032F62"},children:' "Return of the Jedi",'})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:'        "release_date"'}),e.jsx(n.span,{style:{color:"#005CC5"},children:":"}),e.jsx(n.span,{style:{color:"#032F62"},children:' "1983-05-25"'})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"      }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    ]"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs("h2",{id:"avoid-pagecontext-json-requests",children:["Avoid ",e.jsx("code",{children:"pageContext.json"})," requests"]}),`
`,e.jsxs(n.p,{children:["If you want to minimize requests made to your server, then you may want Vike to stop making ",e.jsx(n.code,{children:"pageContext.json"})," requests."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"Most commonly, if the data you fetch comes from another server, then you typically don't want to make an unnecessary detour over your JavaScript/SSR server."}),`
`]}),`
`,e.jsxs(n.p,{children:["Vike makes a ",e.jsx(n.code,{children:"pageContext.json"})," request for a page if and only if one of the two following conditions is true:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["The page has a server-only ",e.jsx(n.code,{children:"data()"})," or ",e.jsx(n.code,{children:"onBeforeRender()"})," hook.",`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"See:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/data#environment"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/onBeforeRender#environment"}),`
`]}),`
`]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:["The ",e.jsx(n.code,{children:"pageContextInit"})," at ",e.jsx(s,{href:"/renderPage",children:e.jsx(n.code,{children:"renderPage()"})})," contains a property that is included in ",e.jsx(s,{href:"/passToClient",children:e.jsx(n.code,{children:"passToClient"})}),".",`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Vike server middleware"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(n.span,{style:{color:"#24292E"},children:" ("}),e.jsx(n.span,{style:{color:"#E36209"},children:"req"}),e.jsx(n.span,{style:{color:"#24292E"},children:", "}),e.jsx(n.span,{style:{color:"#E36209"},children:"res"}),e.jsx(n.span,{style:{color:"#24292E"},children:") "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" pageContextInit"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    urlOriginal: req.originalUrl,"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // If passToClient contains 'user' then Vike makes a pageContext.json request"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // upon page navigation in order the retrieve the pageContextInit.user value."})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    user: req.user"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" pageContext"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" renderPage"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(pageContextInit)"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" pageContext.httpResponse"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`]}),`
`]}),`
`,e.jsxs(n.p,{children:["If both conditions are false, then Vike won't make any ",e.jsx(n.code,{children:"pageContext.json"})," request."]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/passToClient"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/pageContext#lifecycle"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/data#environment"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/onBeforeRender#environment"}),`
`]}),`
`]})]})}function d(l={}){const{wrapper:n}=l.components||{};return n?e.jsx(n,{...l,children:e.jsx(a,{...l})}):a(l)}const c=Object.freeze(Object.defineProperty({__proto__:null,default:d,pageSectionsExport:i},Symbol.toStringTag,{value:"Module"})),E={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/pageContext-json/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:c}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:t}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:r}}};export{E as configValuesSerialized};
