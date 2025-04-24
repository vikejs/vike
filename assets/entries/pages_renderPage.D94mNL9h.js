import{j as e,b as r,i as o,L as i,o as t}from"../chunks/chunk-CJHPM-rr.js";import{L as n}from"../chunks/chunk-VLbMSUNB.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-C6ukGykD.js";import{M as d}from"../chunks/chunk-CZ1OItmC.js";/* empty css                      *//* empty css                      */const c=[{pageSectionId:"examples",pageSectionLevel:2,pageSectionTitle:"Examples"},{pageSectionId:"usage",pageSectionLevel:2,pageSectionTitle:"Usage"},{pageSectionId:"optional",pageSectionLevel:2,pageSectionTitle:"Optional"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function a(l){const s={a:"a",blockquote:"blockquote",code:"code",em:"em",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...l.components};return e.jsxs(e.Fragment,{children:[e.jsx(s.p,{children:"Environment: server."}),`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.code,{children:"renderPage()"})," function enables you to embed Vike into any server."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["We recommend using ",e.jsx(s.code,{children:"vike-server"})," instead of directly using ",e.jsx(s.code,{children:"renderPage()"})," yourself, see ",e.jsx(n,{href:"/server"}),"."]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["You only need ",e.jsx(s.code,{children:"renderPage()"})," if you use SSR, see ",e.jsx(s.a,{href:"#optional",children:"Optional"}),"."]}),`
`]}),`
`,e.jsx(d,{noLink:!0}),`
`,e.jsx("h2",{id:"examples",children:"Examples"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(r,{text:"Express.js",path:"/boilerplates/boilerplate-react/server/index.js"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(r,{text:"Express.js + TypeScript",path:"/boilerplates/boilerplate-vue-ts/server/index.ts"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{text:"Cloudflare Workers",href:"/cloudflare-workers#examples"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{text:"Vercel",href:"/vercel#api-route"}),`
`]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://batijs.dev",children:"Bati"})," (make sure to select a server like Express.js, H3, ...)"]}),`
`]}),`
`,e.jsx("h2",{id:"usage",children:"Usage"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// server/index.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// In this example we use Express.js but we could use any other server framework"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" express "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'express'"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { renderPage, createDevMiddleware } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/server'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" isProduction"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" process.env."}),e.jsx(s.span,{style:{color:"#005CC5"},children:"NODE_ENV"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ==="}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'production'"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" root"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#032F62"},children:" `${"}),e.jsx(s.span,{style:{color:"#24292E"},children:"__dirname"}),e.jsx(s.span,{style:{color:"#032F62"},children:"}/..`"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"startServer"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" startServer"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Create an Express.js server"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" app"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" express"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Dev/prod middleware"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("}),e.jsx(s.span,{style:{color:"#D73A49"},children:"!"}),e.jsx(s.span,{style:{color:"#24292E"},children:"isProduction) {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"    const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"devMiddleware"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" createDevMiddleware"}),e.jsx(s.span,{style:{color:"#24292E"},children:"({ root })"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    app."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"use"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(devMiddleware)"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"else"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // In production, we need to serve our static assets ourselves."})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // (In dev, Vite's middleware serves our static assets.)"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    app."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"use"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(express."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"static"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"`${"}),e.jsx(s.span,{style:{color:"#24292E"},children:"root"}),e.jsx(s.span,{style:{color:"#032F62"},children:"}/${"}),e.jsx(s.span,{style:{color:"#24292E"},children:"outDir"}),e.jsx(s.span,{style:{color:"#032F62"},children:"}/client`"}),e.jsx(s.span,{style:{color:"#24292E"},children:"))"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // ..."})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Other middlewares (authentication, REST/GraphQL/RPC middleware, ...)"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // ..."})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // SSR middleware."})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Note: it should always be the last middleware, because it's a catch-all"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // middleware that supersedes any middleware placed after it."})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  app."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"get"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'*'"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("}),e.jsx(s.span,{style:{color:"#E36209"},children:"req"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#E36209"},children:"res"}),e.jsx(s.span,{style:{color:"#24292E"},children:") "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"    const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" pageContextInit"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"      // Required: the URL of the page"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      urlOriginal: req.originalUrl"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"      // Optional: the HTTP Headers"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      headersOriginal: req.headers,"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"      // Optional: information about the logged-in user (when using an"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"      // Express.js authentication middleware that defines `req.user`)."})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      user: req.user"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"      // ... we can provide any additional information about the request here ..."})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"    const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" pageContext"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" renderPage"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(pageContextInit)"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"    const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"body"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"statusCode"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"headers"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" pageContext.httpResponse"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    headers."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"forEach"}),e.jsx(s.span,{style:{color:"#24292E"},children:"((["}),e.jsx(s.span,{style:{color:"#E36209"},children:"name"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#E36209"},children:"value"}),e.jsx(s.span,{style:{color:"#24292E"},children:"]) "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" res."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"setHeader"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(name, value))"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    res."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"status"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(statusCode)."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"send"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(body)"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  })"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" port"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#005CC5"},children:" 3000"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  app."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"listen"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(port)"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  console."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"log"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"`Server running at http://localhost:${"}),e.jsx(s.span,{style:{color:"#24292E"},children:"port"}),e.jsx(s.span,{style:{color:"#032F62"},children:"}`"}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.code,{children:"pageContext.httpResponse.body"}),` value is the HTML string returned by the
`,e.jsx(n,{text:e.jsxs(e.Fragment,{children:[e.jsx(s.code,{children:"onRenderHtml()"})," hook"]}),href:"/onRenderHtml"})," with additional ",e.jsx(s.code,{children:"<script>"})," and ",e.jsx(s.code,{children:"<style>"}),` tags
automatically injected by Vike.`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["You can control where and what Vike injects using ",e.jsx(n,{href:"/injectFilter"}),"."]}),`
`]}),`
`,e.jsxs(s.p,{children:["For HTML streams use ",e.jsx(s.code,{children:"httpResponse.pipe()"})," instead of ",e.jsx(s.code,{children:"pageContext.httpResponse.body"}),", see ",e.jsx(n,{href:"/streaming"}),"."]}),`
`,e.jsxs(s.p,{children:["Optionally, you can use ",e.jsx(s.code,{children:"pageContext.httpResponse.earlyHints"})," for adding early hints (",e.jsx(s.code,{children:"103 Early Hint"}),"), see ",e.jsx(n,{href:"/preloading#early-hints"}),"."]}),`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.code,{children:"renderPage()"})," function doesn't depend on Node.js and you can use ",e.jsx(s.code,{children:"renderPage()"})," (and therefore embed Vike) anywhere:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"Any server environment (Express.js, HatTip, Deno, Fastify, Vite's development server, Node.js's HTTP server, ...)"}),`
`,e.jsx(s.li,{children:"Any deployment provider (AWS, Cloudflare Workers, Vercel, ...)"}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["When modifying your server, you may need to manually restart your server for your changes to take effect. See ",e.jsx(s.a,{href:"https://github.com/vikejs/vike/issues/562",children:"#562"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"optional",children:"Optional"}),`
`,e.jsxs(s.p,{children:["If you ",e.jsx(n,{text:"pre-render",href:"/pre-rendering"})," all your pages then you don't need to use ",e.jsx(s.code,{children:"renderPage()"}),", because:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Upon development (",e.jsx(s.code,{children:"$ vike dev"}),"), Vike automatically embeds itself into Vite's development server."]}),`
`,e.jsxs(s.li,{children:["Upon pre-rendering (",e.jsx(s.code,{children:"$ vike build"}),"/",e.jsx(s.code,{children:"$ vike prerender"}),"), Vike automatically renders all your pages."]}),`
`]}),`
`,e.jsxs(s.p,{children:["But, if you use Server-Side Rendering (SSR) and you don't pre-render ",e.jsx(s.em,{children:"all"})," your pages, then you need a production server and you need to use ",e.jsx(s.code,{children:"renderPage()"})," in order to embed Vike into your server. See ",e.jsx(n,{href:"/pre-rendering"}),"."]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/createDevMiddleware"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/headers"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/injectFilter"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/preloading#early-hints"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/onRenderHtml"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/NODE_ENV"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/pageContext"}),`
`]}),`
`]})]})}function p(l={}){const{wrapper:s}=l.components||{};return s?e.jsx(s,{...l,children:e.jsx(a,{...l})}):a(l)}const h=Object.freeze(Object.defineProperty({__proto__:null,default:p,pageSectionsExport:c},Symbol.toStringTag,{value:"Module"})),b={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:t}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/renderPage/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:h}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:i}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:o}}};export{b as configValuesSerialized};
