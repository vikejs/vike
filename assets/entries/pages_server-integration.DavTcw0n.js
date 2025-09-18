import{o,a}from"../chunks/chunk-YrzSF-5M.js";import{j as e}from"../chunks/chunk-DylOdVSZ.js";import{L as r}from"../chunks/chunk-DnqwWAsR.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{I as t}from"../chunks/chunk-CqPOMFe6.js";import{M as l}from"../chunks/chunk-CiNNB8lO.js";/* empty css                      *//* empty css                      */import{V as d}from"../chunks/chunk-F78p90Pp.js";/* empty css                      */const c=[{pageSectionId:"manual-integration",pageSectionLevel:2,pageSectionTitle:"Manual integration"},{pageSectionId:"non-javascript-backend",pageSectionLevel:2,pageSectionTitle:"Non-JavaScript Backend"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function s(i){const n={a:"a",blockquote:"blockquote",code:"code",em:"em",li:"li",p:"p",ul:"ul",...i.components};return e.jsxs(e.Fragment,{children:[e.jsxs(n.p,{children:["To integrate Vike with a JavaScript server, we recommend using the ",e.jsxs(r,{href:"/vike-server",children:[e.jsx(n.code,{children:"vike-server"})," extension"]})," which ",e.jsx(d,{})]}),`
`,e.jsx(n.p,{children:"But you can also manually integrate Vike into your server for full control over your server and deployment."}),`
`,e.jsx("h2",{id:"manual-integration",children:"Manual integration"}),`
`,e.jsx(l,{}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Your server code won't be transpiled by ",e.jsx(n.a,{href:"https://vite.dev",children:"Vite"})," out of the box, see ",e.jsx(n.a,{href:"https://github.com/vikejs/vike/issues/562",children:"#562 - Transpile server code"})," for a list of tools to transpile server code (e.g. to support TypeScript)."]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["If you want to use HTTPS in development, ",e.jsx(n.a,{href:"https://vitejs.dev/config/server-options.html#server-https",children:"pass the HTTPS certificates to Vite's dev server"}),"."]}),`
`]}),`
`,e.jsx(n.p,{children:"You can use:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Any server framework (Express, Fastify, Hono, Nitro, Hattip, Koa, Hapi, ...)"}),`
`,e.jsx(n.li,{children:"Any authentication strategy/tool (email/password, OAuth, Auth.js, Passport.js, Grant, Keycloak, Auth0, ...)."}),`
`,e.jsx(n.li,{children:"Any serverless/edge environment (Cloudflare Workers, Vercel, Firebase, AWS Lambda, Google Cloud Functions, Deno Deploy, ...)"}),`
`,e.jsx(n.li,{children:"Any virtual private server (AWS EC2, Google Cloud, ...)"}),`
`,e.jsx(n.li,{children:"Any static host (Cloudflare Pages, GitHub Pages, Netlify, ...)"}),`
`,e.jsx(n.li,{children:"Any server utility (Docker, Nginx, PM2, ...)"}),`
`]}),`
`,e.jsx(n.p,{children:"Examples:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(r,{href:"/express"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(r,{href:"/hono"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(r,{href:"/fastify"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(r,{href:"/docker",noBreadcrumb:!0}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(r,{href:"/nginx"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(r,{href:"/tools#server",children:"... more"}),`
`]}),`
`]}),`
`,e.jsx(n.p,{children:"See also:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(r,{href:"/renderPage"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(r,{href:"/tools#server"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(r,{href:"/deploy"}),`
`]}),`
`]}),`
`,e.jsx(t,{}),`
`,e.jsx("h2",{id:"non-javascript-backend",children:"Non-JavaScript Backend"}),`
`,e.jsx(n.p,{children:"You can use Vike with any non-JavaScript backend using the following setup:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Your non-JavaScript backend implements all the backend business logic while exposing a REST/GraphQL API."}),`
`,e.jsxs(n.li,{children:["Your Vike app uses that REST/GraphQL API to ",e.jsx(r,{href:"/ssr",children:"render your pages to HTML with SSR or SSG"}),". (The client-side of your Vike app then ",e.jsx(r,{href:"/hydration",children:"hydrates"})," the HTML into a rich interactive user interface.)"]}),`
`]}),`
`,e.jsx(n.p,{children:"If want to use SSR then, in addition to your non-JavaScript server, you'll need to deploy a JavaScript SSR server (with Node.js/Deno/Bun, or with an edge worker). Since that JavaScript server is only responsible for server-side rendering your pages to HTML, you can simply deploy it to a serverless/edge platform such as Cloudflare which is inexpensive and scalable."}),`
`,e.jsxs(n.p,{children:["Alternatively, instead of using a JavaScript server, you can ",e.jsx(r,{href:"/pre-rendering",children:"pre-render"})," your pages (SSG) while ",e.jsx(r,{href:"/ssr",children:"disabling SSR"}),". In other words: you generate empty HTML shells that you statically deploy (using a ",e.jsx(r,{href:"/static-hosts",children:"static host"}),", or using your own static assets deployment)."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["The HTML must be generated by Vike because the UI is ",e.jsx(n.em,{children:"completely"})," owned by React/Vue/Solid. You cannot generate the HTML using your non-JavaScript backend: React/Vue/Solid would otherwise throw a ",e.jsx(r,{href:"/hydration-mismatch",children:"hydration mismatch"}),"."]}),`
`]}),`
`,e.jsx(n.p,{children:"That way, you can use Vike with any backend:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Java (Spring, Grails, ...)"}),`
`,e.jsx(n.li,{children:"PHP (Laravel, Symfony, CakePHP, ...)"}),`
`,e.jsx(n.li,{children:"Ruby on Rails"}),`
`,e.jsx(n.li,{children:"Python (Django, Flask, FastAPI, ...)"}),`
`,e.jsx(n.li,{children:"Elixir (Phoenix, ...)"}),`
`,e.jsx(n.li,{children:"Go (Gin, Echo, Fiber, ...)"}),`
`,e.jsx(n.li,{children:"Rust (Actix Web, Rocket, ...)"}),`
`,e.jsx(n.li,{children:"Backend-as-a-Service (Firebase, ..)"}),`
`,e.jsx(n.li,{children:"..."}),`
`]}),`
`,e.jsx(n.p,{children:"Example:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(r,{href:"/ruby-on-rails"}),`
`]}),`
`]}),`
`,e.jsx(t,{}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(r,{href:"/vike-server"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(r,{href:"/renderPage"}),`
`]}),`
`]})]})}function h(i={}){const{wrapper:n}=i.components||{};return n?e.jsx(n,{...i,children:e.jsx(s,{...i})}):s(i)}const p=Object.freeze(Object.defineProperty({__proto__:null,default:h,pageSectionsExport:c},Symbol.toStringTag,{value:"Module"})),R={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:a}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:o}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/server-integration/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:p}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{R as configValuesSerialized};
