import{o as d,a as c}from"../chunks/chunk-LIYbvL8s.js";import{j as e}from"../chunks/chunk-DwiNVRgZ.js";import{L as s}from"../chunks/chunk-By4aeIEZ.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as a}from"../chunks/chunk-J_XZ44Ks.js";import{B as h}from"../chunks/chunk-BCS5_uZy.js";/* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-DGftYatD.js";const p=[{pageSectionId:"what-changes-for-users",pageSectionLevel:2,pageSectionTitle:"What changes for users"},{pageSectionId:"what-is-universal-deploy",pageSectionLevel:2,pageSectionTitle:"What is Universal Deploy?"},{pageSectionId:"why-we-built-it-a-short-history",pageSectionLevel:2,pageSectionTitle:"Why we built it (a short history)"},{pageSectionId:"collaborating-with-the-vite-team",pageSectionLevel:2,pageSectionTitle:"Collaborating with the Vite team"},{pageSectionId:"collaborating-with-tencent-edgeone",pageSectionLevel:2,pageSectionTitle:"Collaborating with Tencent EdgeOne"},{pageSectionId:"try-it-out",pageSectionLevel:2,pageSectionTitle:"Try it out"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function o(r){const n={a:"a",blockquote:"blockquote",code:"code",div:"div",em:"em",figure:"figure",li:"li",ol:"ol",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...a(),...r.components},{ChoiceGroup:t,CustomSelectsContainer:i}=n;return t||l("ChoiceGroup"),i||l("CustomSelectsContainer"),e.jsxs(e.Fragment,{children:[e.jsx(h,{authors:["magne4000","brillout"],date:new Date("2026-04-21"),social:{bluesky:"https://bsky.app/profile/brillout.com/post/3mjz3riomr22r",twitter:"https://x.com/brillout/status/2046580791493156891",linkedin:"https://www.linkedin.com/posts/brillout_vike-share-7452349887070760961-O2DT"}}),`
`,e.jsxs(n.p,{children:["Today, we are thrilled to introduce ",e.jsx(n.a,{href:"https://github.com/universal-deploy/universal-deploy",children:"Universal Deploy"})," — a new infrastructure to deploy Vite apps (not only Vike apps) anywhere with zero configuration."]}),`
`,e.jsxs(n.p,{children:["We're also thrilled to announce ",e.jsx(s,{href:"#collaborating-with-tencent-edgeone",children:"a collaboration with Tencent EdgeOne"}),"."]}),`
`,e.jsxs(n.p,{children:["Alongside Universal Deploy, we're releasing ",e.jsxs(n.strong,{children:["built-in ",e.jsx(s,{href:"/server",children:e.jsx(n.code,{children:"+server.js"})})," support in Vike"]}),", powered by Universal Deploy."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:[e.jsxs(n.strong,{children:["This means ",e.jsx(n.code,{children:"vike-photon"})," is now deprecated"]}),": everything it did is now part of Vike core and Universal Deploy, with a simpler DX and no extra packages to install."]}),`
`,e.jsxs(n.p,{children:["If you use ",e.jsx(n.code,{children:"vike-photon"})," (or still ",e.jsx(n.code,{children:"vike-server"}),"), we recommend ",e.jsxs(s,{href:"/migration/server",children:["migrating to ",e.jsx(n.code,{children:"+server.js"})]}),"."]}),`
`]}),`
`,e.jsxs(n.p,{children:["Universal Deploy supersedes ",e.jsx(s,{href:"/blog/photon",children:"Photon"}),". It's the next — and we believe final — step in a journey that started with ",e.jsx(n.code,{children:"vike-server"})," and continued with Photon. This is a big deal not just for Vike, but for the whole Vite ecosystem."]}),`
`,e.jsx("h2",{id:"what-changes-for-users",children:"What changes for users"}),`
`,e.jsx(n.p,{children:"For Vike users, the story is now refreshingly simple:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Define your server"})," with ",e.jsx(n.code,{children:"+server.js"}),". Use any server framework you like — Hono, Express.js, Fastify, Elysia, H3. For example with Hono:"]}),`
`,e.jsx(i,{children:e.jsxs(t,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[],hidden:!1,lvl:0},children:[e.jsx(n.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// +server.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { Hono } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'hono'"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" vike "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" '@vikejs/hono'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" app"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#D73A49"},children:" new"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Hono"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"vike"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(app) "}),e.jsx(n.span,{style:{color:"#6A737D"},children:"// Attaches Vike"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  fetch: app.fetch"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(n.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// +server.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { Hono } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'hono'"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" vike "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" '@vikejs/hono'"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { Server } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" app"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#D73A49"},children:" new"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Hono"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"vike"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(app) "}),e.jsx(n.span,{style:{color:"#6A737D"},children:"// Attaches Vike"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  fetch: app.fetch"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"} "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Server"})]})]})})})})]})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Pick a deployment target"})," by installing its official Vite plugin: ",e.jsx(n.code,{children:"@edgeone/vite"}),", ",e.jsx(n.code,{children:"@netlify/vite-plugin"}),", ",e.jsx(n.code,{children:"@cloudflare/vite-plugin"}),", ",e.jsx(n.code,{children:"vite-plugin-vercel"}),", or nothing at all to self-host with Node.js / Bun / Deno."]}),`
`]}),`
`]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"That's it."})," No ",e.jsx(n.code,{children:"vike-photon"}),", no ",e.jsx(n.code,{children:"vike-server"}),", no ",e.jsx(n.code,{children:"vike-cloudflare"}),", no glue packages. Vike and your deployment provider talk to each other directly through Universal Deploy."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Manual integration via ",e.jsx(s,{href:"/renderPage",children:e.jsx(n.code,{children:"renderPage()"})})," is still supported and remains unchanged. We care equally about manual integrations — both workflows are fully supported and maintained."]}),`
`]}),`
`,e.jsx("h2",{id:"what-is-universal-deploy",children:"What is Universal Deploy?"}),`
`,e.jsxs(n.p,{children:["Universal Deploy is ",e.jsx(n.strong,{children:"not a user-facing tool"}),". It's a low-level toolkit that frameworks and deployment providers use behind the scenes to talk to each other."]}),`
`,e.jsx(n.p,{children:"In concrete terms, Universal Deploy provides:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"A shared store"})," (",e.jsx(n.code,{children:"@universal-deploy/store"}),") where frameworks register their server entries and routing metadata."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"A common routing format"})," that every participant understands."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Minimal Vite plugins"})," that deployment Vite plugins can use to automatically integrate with frameworks."]}),`
`]}),`
`,e.jsxs(n.p,{children:["The idea: instead of every framework writing custom integration code for every deployment provider (and vice versa), everyone agrees on a small, low-level convention. Frameworks register what they want to deploy; providers read it and deploy it. Say goodbye to ",e.jsx(n.a,{href:"https://github.com/vitejs/vite/discussions/20907",children:"N×M glue code"})," 👋"]}),`
`,e.jsx(n.p,{children:"For framework authors, registering an entry looks like this:"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { addEntry } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" '@universal-deploy/store'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"addEntry"}),e.jsx(n.span,{style:{color:"#24292E"},children:"({"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  id: "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'./src/server/api.ts'"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  route: "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'/api/*'"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  method: "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'GET'"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"})"})})]})})}),`
`,e.jsx(n.p,{children:"While deployment providers read from the store."}),`
`,e.jsx("h2",{id:"why-we-built-it-a-short-history",children:"Why we built it (a short history)"}),`
`,e.jsx(n.p,{children:"Universal Deploy is the third — and we hope last — iteration."}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:e.jsx(n.a,{href:"/blog/vike-server",children:e.jsx(n.code,{children:"vike-server"})})})," ",e.jsx(n.em,{children:"(March 2025)"})," was a Vike extension that integrated Vite with any JavaScript server (Express.js, Hono, Fastify, …) and any deployment target. While building it, we realized that ",e.jsx(n.strong,{children:"most of the code wasn't actually Vike-specific"}),"."]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:e.jsx(n.a,{href:"/blog/photon",children:"Photon"})})," ",e.jsx(n.em,{children:"(October 2025)"})," was our answer to that observation: we extracted everything we learned from ",e.jsx(n.code,{children:"vike-server"}),", ",e.jsx(n.code,{children:"vike-cloudflare"}),", and ",e.jsx(n.code,{children:"vite-plugin-vercel"})," into a fully framework-agnostic project. Photon brought first-class Cloudflare support (with the dev server running inside ",e.jsx(n.code,{children:"workerd"}),", the same runtime as production), HMR for server code, and zero-config deployment."]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Universal Deploy"})," ",e.jsx(n.em,{children:"(April 2026)"})," takes that one step further. Photon was framework-agnostic, but it was still its own somewhat opinionated stack. Conversations sparked by ",e.jsx(n.a,{href:"https://github.com/vitejs/vite/discussions/20907",children:"Netlify's Vite RFC"})," made it clear that what the ecosystem really needed was something even smaller and even more neutral: a tiny convention layer that ",e.jsx(n.em,{children:"everyone"})," — frameworks, deployment providers, and Vite itself — could adopt without buying into a particular implementation."]}),`
`,e.jsx(n.p,{children:"That's what Universal Deploy is. It's an unopinionated and flexible infrastructure to solve the deployment fragmentation problem."}),`
`,e.jsx("h2",{id:"collaborating-with-the-vite-team",children:"Collaborating with the Vite team"}),`
`,e.jsxs(n.p,{children:["Universal Deploy is a direct response to ",e.jsx(n.a,{href:"https://github.com/vitejs/vite/discussions/20907",children:"Netlify's Vite RFC"}),". Specifically, it tackles two of the issues raised in the RFC:"]}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Server entry point location"})," — how does a deployment provider find the server entries that a framework wants to deploy?"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Routing metadata"})," — how does the deployment provider know which routes go where, and which methods they handle?"]}),`
`]}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"@universal-deploy/*"})," packages are a direct answer to those questions, and we're working with the Vite team to bring new conventions to the Vite and JavaScript ecosystem."]}),`
`,e.jsx("h2",{id:"collaborating-with-tencent-edgeone",children:"Collaborating with Tencent EdgeOne"}),`
`,e.jsxs(n.p,{children:["The EdgeOne team were the first to adopt and work on integrating Universal Deploy into ",e.jsx(n.code,{children:"@edgeone/vite"}),". This means any UD-aware Vite framework, including Vike, can now deploy to EdgeOne Pages with zero glue code — just add ",e.jsx(n.code,{children:"@edgeone/vite"})," to your Vite config."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Tencent's ",e.jsx(n.a,{href:"https://edgeone.ai/products/pages",children:"EdgeOne Pages"})," is an edge-first platform for deploying full-stack web apps. With its global edge network, your Vike app's SSR routes are rendered at the edge node closest to each user, pre-rendered pages are served directly from CDN cache, and streaming responses start delivering content immediately — all without managing any infrastructure."]}),`
`,e.jsxs(n.p,{children:["You can try it out at ",e.jsx(n.a,{href:"https://vike.dev/new",children:"vike.dev/new"})," then select ",e.jsx(n.code,{children:"EdgeOne Pages"}),"."]}),`
`]}),`
`,e.jsx(n.p,{children:"It's just the beginning of our collaboration and we're looking forward to what's next 🚀"}),`
`,e.jsx("h2",{id:"try-it-out",children:"Try it out"}),`
`,e.jsxs(n.p,{children:["You can try it today by going to ",e.jsx(n.a,{href:"https://vike.dev/new",children:e.jsx(n.strong,{children:"vike.dev/new"})})," and selecting a server (e.g. Hono) along with a deployment provider (e.g. EdgeOne, Netlify, Cloudflare, or Vercel)."]}),`
`,e.jsxs(n.p,{children:["If you're migrating from ",e.jsx(n.code,{children:"vike-photon"})," or ",e.jsx(n.code,{children:"vike-server"}),", head over to ",e.jsx(s,{href:"/migration/server",children:"the migration guide"}),"."]}),`
`,e.jsxs(n.p,{children:["If you're a framework or deployment provider author curious about adopting Universal Deploy, ",e.jsx(n.a,{href:"https://github.com/universal-deploy/universal-deploy/discussions",children:"reach out"}),"."]}),`
`,e.jsxs(n.p,{children:["Huge thanks to everyone who's contributed to ",e.jsx(n.code,{children:"vike-server"}),", Photon, the Netlify RFC discussions, the Tencent EdgeOne team, and the broader Vite ecosystem. Universal Deploy wouldn't exist without that collective effort."]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Let's deploy Vite apps anywhere"})," 🚀"]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/server"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/migration/server"}),`
`]}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://github.com/universal-deploy/universal-deploy",children:"Universal Deploy on GitHub"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://github.com/vitejs/vite/discussions/20907",children:"Netlify's Vite RFC"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://github.com/vitejs/ecosystem/issues/3",children:"Vite RFC: Align on Vite's intended scope to allow for framework-agnostic provider plugins"})}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/blog/photon"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/blog/vike-server"}),`
`]}),`
`]})]})}function j(r={}){const{wrapper:n}={...a(),...r.components};return n?e.jsx(n,{...r,children:e.jsx(o,{...r})}):o(r)}function l(r,n){throw new Error("Expected component `"+r+"` to be defined: you likely forgot to import, pass, or provide it.")}const x=Object.freeze(Object.defineProperty({__proto__:null,default:j,pageSectionsExport:p},Symbol.toStringTag,{value:"Module"})),U={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:c}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:d}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/blog/universal-deploy/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:x}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{U as configValuesSerialized};
