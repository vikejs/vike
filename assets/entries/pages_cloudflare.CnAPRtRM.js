import{o as h,a as p}from"../chunks/chunk-CD9QEe8_.js";import{j as e,b as r}from"../chunks/chunk-Douv1U2N.js";import{L as n}from"../chunks/chunk-CFMsqHiR.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{U as x}from"../chunks/chunk-DlqzfnMJ.js";import{E as o}from"../chunks/chunk-BoSh0lwY.js";/* empty css                      *//* empty css                      */import{T as j,a as u,b as a,c as i}from"../chunks/chunk-BqFa1YnK.js";/* empty css                      *//* empty css                      */function t(l){const s={li:"li",p:"p",ul:"ul",...l.components};return e.jsxs(e.Fragment,{children:[e.jsx(s.p,{children:"Examples:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["React: ",e.jsx(r,{path:"/examples/cloudflare-workers-react/"})]}),`
`,e.jsxs(s.li,{children:["React + SSR Streaming: ",e.jsx(r,{path:"/examples/cloudflare-workers-react-full/"})]}),`
`,e.jsxs(s.li,{children:["Vue: ",e.jsx(r,{path:"/examples/cloudflare-workers-vue/"})]}),`
`]})]})}function c(l={}){const{wrapper:s}=l.components||{};return s?e.jsx(s,{...l,children:e.jsx(t,{...l})}):t(l)}const y=[{pageSectionId:"vike-cloudflare",pageSectionLevel:2,pageSectionTitle:"`vike-cloudflare`"},{pageSectionId:"without-a-server",pageSectionLevel:3,pageSectionTitle:"Without a server"},{pageSectionId:"with-a-server",pageSectionLevel:3,pageSectionTitle:"With a server"},{pageSectionId:"accessing-cloudflare-apis-in-development",pageSectionLevel:2,pageSectionTitle:"Accessing Cloudflare APIs in development"},{pageSectionId:"extend-3mb-limit",pageSectionLevel:2,pageSectionTitle:"Extend 3MB limit"},{pageSectionId:"manual-integration",pageSectionLevel:2,pageSectionTitle:"Manual integration"},{pageSectionId:"cloudflare-pages",pageSectionLevel:3,pageSectionTitle:"Cloudflare Pages"},{pageSectionId:"wrangler",pageSectionLevel:3,pageSectionTitle:"Wrangler"},{pageSectionId:"development",pageSectionLevel:3,pageSectionTitle:"Development"},{pageSectionId:"universal-fetch",pageSectionLevel:4,pageSectionTitle:"Universal `fetch()`"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function d(l){const s={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...l.components};return e.jsxs(e.Fragment,{children:[e.jsxs(s.p,{children:["We recommend using the ",e.jsx(n,{href:"#vike-cloudflare"})," extension to deploy your app to ",e.jsx(s.a,{href:"https://www.cloudflare.com",children:"Cloudflare"}),"."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(x,{children:e.jsx(s.code,{children:"vike-cloudflare"})}),`
`]}),`
`,e.jsx("h2",{id:"vike-cloudflare",children:e.jsx("code",{children:"vike-cloudflare"})}),`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.a,{href:"https://github.com/vikejs/vike-cloudflare",children:e.jsx(s.code,{children:"vike-cloudflare"})})," extension enables zero-configuration deployment to"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://workers.cloudflare.com",children:"Cloudflare Workers"})," for the server-side (if you have any), and"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://pages.cloudflare.com",children:"Cloudflare Pages"})," for static assets."]}),`
`]}),`
`,e.jsxs(s.p,{children:[e.jsx(n,{href:"/pre-rendering",children:"Pre-rendered pages"})," are deployed as static files, and ",e.jsx(n,{href:"/ssr",children:"SSR"}),"'d pages as ",e.jsx(s.a,{href:"https://developers.cloudflare.com/pages/functions/advanced-mode/",children:"Pages Functions"})," (which use Cloudflare Workers under the hood)."]}),`
`,e.jsx("h3",{id:"without-a-server",children:"Without a server"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// +config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" vikeCloudflare "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:' "vike-cloudflare/config"'}),e.jsx(s.span,{style:{color:"#24292E"},children:";"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  plugins: [vikeCloudflare]"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h3",{id:"with-a-server",children:"With a server"}),`
`,e.jsxs(s.p,{children:[e.jsx(s.code,{children:"vike-cloudflare"})," currently supports ",e.jsx(n,{href:"/hono"})," and ",e.jsx(n,{href:"/hattip"}),"."]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// +config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" vikeCloudflare "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:' "vike-cloudflare/config"'}),e.jsx(s.span,{style:{color:"#24292E"},children:";"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  plugins: [vikeCloudflare],"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  server: {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    entry: "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"server/index.js"'})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(j,{children:[e.jsxs(u,{children:[e.jsx(a,{children:"Hono"}),e.jsx(a,{children:"Hattip"})]}),e.jsx(i,{children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// server/index.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Hono } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:' "hono"'}),e.jsx(s.span,{style:{color:"#24292E"},children:";"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { apply } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:' "vike-cloudflare/hono"'}),e.jsx(s.span,{style:{color:"#24292E"},children:";"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { serve } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:' "vike-cloudflare/hono/serve"'}),e.jsx(s.span,{style:{color:"#24292E"},children:";"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" startServer"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" app"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49"},children:" new"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Hono"}),e.jsx(s.span,{style:{color:"#24292E"},children:"();"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" port"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" process.env."}),e.jsx(s.span,{style:{color:"#005CC5"},children:"PORT"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ||"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" 3000"}),e.jsx(s.span,{style:{color:"#24292E"},children:";"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"  apply"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(app);"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" serve"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(app, { port: "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"+"}),e.jsx(s.span,{style:{color:"#24292E"},children:"port });"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" startServer"}),e.jsx(s.span,{style:{color:"#24292E"},children:"();"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "})]})})})}),e.jsx(i,{children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// server/index.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { createRouter } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:' "@hattip/router"'}),e.jsx(s.span,{style:{color:"#24292E"},children:";"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { apply } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:' "vike-cloudflare/hattip"'}),e.jsx(s.span,{style:{color:"#24292E"},children:";"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { serve } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:' "vike-cloudflare/hattip/serve"'}),e.jsx(s.span,{style:{color:"#24292E"},children:";"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" startServer"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" router"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" createRouter"}),e.jsx(s.span,{style:{color:"#24292E"},children:"();"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" port"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" process.env."}),e.jsx(s.span,{style:{color:"#005CC5"},children:"PORT"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ||"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" 3000"}),e.jsx(s.span,{style:{color:"#24292E"},children:";"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"  apply"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(router);"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" serve"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(router, { port: "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"+"}),e.jsx(s.span,{style:{color:"#24292E"},children:"port });"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" startServer"}),e.jsx(s.span,{style:{color:"#24292E"},children:"();"})]})]})})})})]}),`
`,e.jsx("h2",{id:"accessing-cloudflare-apis-in-development",children:"Accessing Cloudflare APIs in development"}),`
`,e.jsxs(s.p,{children:["You can use ",e.jsx(s.code,{children:"wrangler"}),"'s ",e.jsx(s.a,{href:"https://developers.cloudflare.com/workers/wrangler/api/#getplatformproxy",children:e.jsx(s.code,{children:"getPlatformProxy()"})})," to access Cloudflare APIs (such as D1 and KV) in development."]}),`
`,e.jsxs(s.p,{children:["For example, this is what ",e.jsx(n,{href:"/new",children:e.jsx(s.code,{children:"pnpm create vike@latest --react --hono --drizzle --cloudflare"})})," uses to access ",e.jsx(s.a,{href:"https://developers.cloudflare.com/d1/",children:"Cloudflare D1"})," during development:"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { D1Database } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:' "@cloudflare/workers-types"'}),e.jsx(s.span,{style:{color:"#24292E"},children:";"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { RuntimeAdapter } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:' "@universal-middleware/core"'}),e.jsx(s.span,{style:{color:"#24292E"},children:";"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"/**"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:" * Retrieve Cloudflare `env.DB` from `universal-middleware` runtime"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:" */"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" async"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" getDbFromRuntime"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#E36209"},children:"runtime"}),e.jsx(s.span,{style:{color:"#D73A49"},children:":"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" RuntimeAdapter"}),e.jsx(s.span,{style:{color:"#24292E"},children:")"}),e.jsx(s.span,{style:{color:"#D73A49"},children:":"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Promise"}),e.jsx(s.span,{style:{color:"#24292E"},children:"<"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"D1Database"}),e.jsx(s.span,{style:{color:"#24292E"},children:"> {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(s.span,{style:{color:"#24292E"},children:" (runtime.runtime "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"==="}),e.jsx(s.span,{style:{color:"#032F62"},children:' "workerd"'}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"    return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" runtime.env"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"!"}),e.jsx(s.span,{style:{color:"#24292E"},children:"."}),e.jsx(s.span,{style:{color:"#005CC5"},children:"DB"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" as"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" D1Database"}),e.jsx(s.span,{style:{color:"#24292E"},children:";"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:'  // When running on node, simulate Cloudflare environment with "wrangler"'})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"getPlatformProxy"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" import"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:'"wrangler"'}),e.jsx(s.span,{style:{color:"#24292E"},children:");"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"env"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" getPlatformProxy"}),e.jsx(s.span,{style:{color:"#24292E"},children:"();"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" env."}),e.jsx(s.span,{style:{color:"#005CC5"},children:"DB"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" as"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" D1Database"}),e.jsx(s.span,{style:{color:"#24292E"},children:";"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h2",{id:"extend-3mb-limit",children:"Extend 3MB limit"}),`
`,e.jsx(s.p,{children:"By default the bundle size of your worker cannot exceed 3MB, but you can request sizes of up to 100MB and beyond."}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://www.cloudflare.com/larger-scripts-on-workers-early-access/",children:"Cloudflare Workers > Larger Scripts"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://developers.cloudflare.com/workers/platform/limits/#worker-size",children:"Cloudflare Workers > Limits > Worker Size"})}),`
`]}),`
`,e.jsx("h2",{id:"manual-integration",children:"Manual integration"}),`
`,e.jsxs(s.p,{children:["Instead of using ",e.jsx(s.code,{children:"vike-cloudflare"}),", you can manually integrate your app with Cloudflare yourself."]}),`
`,e.jsx("h3",{id:"cloudflare-pages",children:"Cloudflare Pages"}),`
`,e.jsx(s.p,{children:"For a manual integration, we generally recommend using:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://developers.cloudflare.com/pages/",children:"Cloudflare Pages"})," for static assets and ",e.jsx(n,{href:"/pre-rendering",children:"pre-rendered pages"}),", and"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://developers.cloudflare.com/pages/platform/functions/",children:"Pages Functions"})," for ",e.jsx(n,{href:"/ssr",children:"SSR'd pages"}),"."]}),`
`]}),`
`,e.jsx(s.p,{children:"Examples:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(o,{timestamp:"2024.01",repo:"travis-r6s/vike-cf-pages"})," - Advanced demo showcasing a lot of integrations such as REST, tRPC, GraphQL, Sentry, and Thumbprint."]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(o,{timestamp:"2022.04",repo:"Immortalin/vite-plugin-ssr-cloudflare-pages-demo"}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["vite-plugin-ssr was the ",e.jsx(s.a,{href:"https://vite-plugin-ssr.com/vike",children:"previous name of Vike"}),"."]}),`
`]}),`
`]}),`
`]}),`
`,e.jsx("h3",{id:"wrangler",children:"Wrangler"}),`
`,e.jsxs(s.p,{children:["You can also directly use ",e.jsx(s.a,{href:"https://workers.cloudflare.com",children:"Cloudflare Workers"})," instead of using Cloudflare Pages."]}),`
`,e.jsxs(s.p,{children:["Cloudflare Workers requires your entire worker code to be bundled into a single file — you can use ",e.jsx(s.a,{href:"https://github.com/cloudflare/workers-sdk",children:"Wrangler"})," to achieve that (it uses ",e.jsx(s.a,{href:"https://esbuild.github.io/",children:"esbuild"})," under the hood)."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:'Cloudflare uses the term "worker code" to denote server code that is run on its edge infrastructure.'}),`
`]}),`
`,e.jsx(c,{}),`
`,e.jsx("h3",{id:"development",children:"Development"}),`
`,e.jsxs(s.p,{children:["For a significantly faster development experience we recommend, whenever possible, using Vite's development server (or a server such as ",e.jsx(n,{href:"/express",children:"Express.js"})," or ",e.jsx(n,{href:"/hono",children:"Hono"}),") instead of Wrangler."]}),`
`,e.jsx(s.p,{children:"In other words:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Skip ",e.jsx(s.code,{children:"wrangler"})," / Cloudflare Workers altogether while developing your app."]}),`
`,e.jsxs(s.li,{children:["Use ",e.jsx(s.code,{children:"wrangler dev"})," to preview your worker."]}),`
`,e.jsxs(s.li,{children:["Use ",e.jsx(s.code,{children:"wrangler publish"})," to deploy your worker to Cloudflare Workers."]}),`
`]}),`
`,e.jsx(c,{}),`
`,e.jsxs("h4",{id:"universal-fetch",children:["Universal ",e.jsx("code",{children:"fetch()"})]}),`
`,e.jsxs(s.p,{children:["When using Node.js(/Bun/Deno) for development and Cloudflare Workers for production, you may need a ",e.jsx(s.code,{children:"fetch()"})," function that works in both environments."]}),`
`,e.jsxs(s.p,{children:["You can define a fetch function at ",e.jsx(s.code,{children:"pageContext.fetch"}),` that works in all environments.
The trick is to add a different `,e.jsx(s.code,{children:"fetch()"})," implementation to ",e.jsx(s.code,{children:"pageContextInit"})," at ",e.jsx(n,{text:e.jsx(s.code,{children:"renderPage(pageContextInit)"}),href:"/renderPage"}),"."]}),`
`,e.jsxs(s.p,{children:["Example: ",e.jsx(r,{path:"/examples/cloudflare-workers-react-full#universal-fetch"}),"."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["Libraries such as ",e.jsx(s.code,{children:"node-fetch"})," or ",e.jsx(s.code,{children:"cross-fetch"})," typically don't work with Cloudflare Workers."]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/cloudflare-pages"}),`
`]}),`
`]})]})}function f(l={}){const{wrapper:s}=l.components||{};return s?e.jsx(s,{...l,children:e.jsx(d,{...l})}):d(l)}const g=Object.freeze(Object.defineProperty({__proto__:null,default:f,pageSectionsExport:y},Symbol.toStringTag,{value:"Module"})),z={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:p}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:h}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/cloudflare/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:g}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{z as configValuesSerialized};
