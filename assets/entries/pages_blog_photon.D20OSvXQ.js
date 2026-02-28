import{o as i,a as l}from"../chunks/chunk-CxIOOiKX.js";import{j as e}from"../chunks/chunk-B35a6FX-.js";import{L as o}from"../chunks/chunk-BbfG-aTg.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as s}from"../chunks/chunk-CJvpbNqo.js";import{B as a}from"../chunks/chunk-DylnlQk-.js";/* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-DZhIF4jm.js";const d=[{pageSectionId:"features",pageSectionLevel:2,pageSectionTitle:"Features"},{pageSectionId:"cloudflare",pageSectionLevel:2,pageSectionTitle:"Cloudflare"},{pageSectionId:"why-photon",pageSectionLevel:2,pageSectionTitle:"Why Photon?"},{pageSectionId:"the-future",pageSectionLevel:2,pageSectionTitle:"The future"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function t(r){const n={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...s(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(a,{authors:["magne4000","brillout"],date:new Date("2025-10-28")}),`
`,e.jsxs(n.p,{children:["Today, we are thrilled to introduce ",e.jsx(n.a,{href:"https://photonjs.dev",children:"Photon"})," — a next-generation infrastructure for deploying any JavaScript server (Hono, Express.js, Fastify, ...) anywhere (self-hosting, Cloudflare, Vercel, Netlify, ...)."]}),`
`,e.jsxs(n.p,{children:["We've also released ",e.jsx(o,{href:"/vike-photon",children:e.jsx(n.code,{children:"vike-photon"})})," which replaces ",e.jsx(n.code,{children:"vike-server"}),"."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["If you use ",e.jsx(n.code,{children:"vike-server"}),", we recommend ",e.jsxs(o,{href:"/migration/vike-photon",children:["migrating to ",e.jsx(n.code,{children:"vike-photon"})]}),"."]}),`
`]}),`
`,e.jsxs(n.p,{children:["Photon is a step towards the future of JavaScript server integration and deployment. See ",e.jsx(o,{href:"#why-photon"})]}),`
`,e.jsxs(n.p,{children:["As a user, the most notable improvement over ",e.jsx(n.code,{children:"vike-server"})," is the ",e.jsx(o,{href:"#cloudflare",children:"Cloudflare integration"}),"."]}),`
`,e.jsx("h2",{id:"features",children:"Features"}),`
`,e.jsx(n.p,{children:"Photon is jam-packed with features:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Any server"}),": Hono, Express.js, Fastify, Elysia, H3, Srvx, Hattip."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Any deployment"}),": Cloudflare, Vercel, self-hosted, and more."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"HMR"}),": No more full server reload required."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Vite Environment API"}),": Develop against production runtimes (e.g. Cloudflare's ",e.jsx(n.code,{children:"workerd"}),")."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Code-splitting"}),": Per-route deployment to separate edge workers."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Zero-config"}),": Integrate your server and deployment with minimal configuration."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Built-in server"}),": Photon comes with a built-in server for zero-config use (users can use their own instead)."]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Learn more at ",e.jsxs(n.a,{href:"https://photonjs.dev/why#features",children:[e.jsx(n.code,{children:"photonjs.dev"})," > Why Photon > Features"]}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"cloudflare",children:"Cloudflare"}),`
`,e.jsxs(n.p,{children:["When using ",e.jsx(n.code,{children:"@photonjs/cloudflare"}),", the development environment runs inside Cloudflare's ",e.jsx(n.code,{children:"workerd"})," runtime (instead of Node.js). It's the same runtime Cloudflare uses in production, making the development environment a much more faithful representation of production."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"Vike is among the first frameworks to support this."}),`
`,e.jsxs(n.p,{children:["It's powered by ",e.jsx(o,{href:"/blog/vite-6",children:"Vite's Environment API"}),", which enables Vite to run in a Node.js process while running the user's server code in another (non-Node.js) process such as ",e.jsx(n.code,{children:"workerd"}),"."]}),`
`]}),`
`,e.jsxs(n.p,{children:["It also allows you to directly use Cloudflare's APIs in development. (This was already possible with ",e.jsx(n.code,{children:"getPlatformProxy()"})," but it was clunky to set up.)"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// This works in production, as well as in development!"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { env } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'cloudflare:workers'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Key-value store"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"env."}),e.jsx(n.span,{style:{color:"#005CC5"},children:"KV"}),e.jsx(n.span,{style:{color:"#24292E"},children:"."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"get"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#032F62"},children:"'my-key'"}),e.jsx(n.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment Variable"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"env."}),e.jsx(n.span,{style:{color:"#005CC5"},children:"LOG_LEVEL"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// ..."})})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Learn more at ",e.jsx(o,{href:"/cloudflare#cloudflare-apis",doNotInferSectionTitle:!0}),"."]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"With Miniflare, discrepancies between development and production led to poor DX, code duplication, and complicated architecture — integrating applications with Cloudflare was notoriously hard. These issues are now solved."}),`
`]}),`
`,e.jsx("h2",{id:"why-photon",children:"Why Photon?"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.a,{href:"https://vite.dev",children:"Vite"})," has become the de-facto standard infrastructure shared across many frameworks, and we believe the same will happen for JavaScript server deployment — in one form or another."]}),`
`,e.jsxs(n.p,{children:["Photon aims to be open and collaborative, which is paramount for the community as a whole to move in the right direction (see also ",e.jsxs(n.a,{href:"https://photonjs.dev/why#philosophy",children:[e.jsx(n.code,{children:"photonjs.dev"})," > Why Photon > Philosophy"]}),")."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["While developing ",e.jsx(n.code,{children:"vike-server"})," ",e.jsx(o,{href:"/blog/vike-server#sharing-with-other-frameworks",children:"we realized most code is agnostic to Vike"}),". So we decided to make Vike's deployment infrastructure fully agnostic."]}),`
`,e.jsxs(n.p,{children:["That's what Photon is: it's everything we learned while developing ",e.jsx(n.code,{children:"vike-server"}),", ",e.jsx(n.code,{children:"vike-cloudflare"}),", and ",e.jsx(n.code,{children:"vite-plugin-vercel"})," bundled in one cohesive and agnostic tool with improved DX and new features."]}),`
`]}),`
`,e.jsx(n.p,{children:"Other than Photon, there are two projects working towards a unified infrastructure:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://nitro.build",children:"Nitro"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://github.com/vitejs/vite/discussions/20907",children:"Netlify's RFC"})}),`
`]}),`
`,e.jsxs(n.p,{children:["We are eager to collaborate ",e.jsx(n.a,{href:"https://x.com/brillout/status/1977382732276617245",children:"with Nitro"})," as well as ",e.jsx(n.a,{href:"https://github.com/vitejs/vite/discussions/20907#discussioncomment-14739138",children:"with Netlify's RFC"})," — the more we collaborate the better!"]}),`
`,e.jsx(n.p,{children:"These collaboration efforts will take time to come to fruition. In the meantime, Photon is our answer to the shared deployment infrastructure problem and provides a concrete solution for our users."}),`
`,e.jsx("h2",{id:"the-future",children:"The future"}),`
`,e.jsxs(n.p,{children:["We don't know how shared deployment infrastructures will evolve. In our opinion, the best outcome is that we move some — ideally most — of Photon's logic to Vite and its ecosystem (see ",e.jsx(n.a,{href:"https://github.com/vitejs/vite/discussions/20907",children:"Netlify's RFC"}),")."]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsxs(n.a,{href:"https://photonjs.dev/why#philosophy",children:[e.jsx(n.code,{children:"photonjs.dev"})," > Why Photon > Philosophy"]})}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(o,{href:"/vike-photon"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(o,{href:"/migration/vike-photon"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(o,{href:"/blog/vike-server"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(o,{href:"/blog/vite-6"}),`
`]}),`
`]})]})}function h(r={}){const{wrapper:n}={...s(),...r.components};return n?e.jsx(n,{...r,children:e.jsx(t,{...r})}):t(r)}const c=Object.freeze(Object.defineProperty({__proto__:null,default:h,pageSectionsExport:d},Symbol.toStringTag,{value:"Module"})),E={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:l}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:i}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/blog/photon/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:c}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{E as configValuesSerialized};
