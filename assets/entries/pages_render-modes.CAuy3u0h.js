import{j as e,b as s,i,L as o,o as d}from"../chunks/chunk-COY9qe_3.js";import{L as l}from"../chunks/chunk-C7hDb96N.js";/* empty css                      */import{W as t}from"../chunks/chunk-BacCsst4.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-BzWTU9BF.js";import{U as c}from"../chunks/chunk-gSV-n0UB.js";/* empty css                      *//* empty css                      */import{M as h}from"../chunks/chunk-XJhFIYfO.js";/* empty css                      *//* empty css                      */import"../chunks/chunk-spwfmPb6.js";const p=[{pageSectionId:"spa",pageSectionLevel:2,pageSectionTitle:"SPA"},{pageSectionId:"ssr",pageSectionLevel:2,pageSectionTitle:"SSR"},{pageSectionId:"pre-rendering-ssg",pageSectionLevel:2,pageSectionTitle:"Pre-rendering (SSG)"},{pageSectionId:"html-only",pageSectionLevel:2,pageSectionTitle:"HTML-only"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function a(r){const n={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",ol:"ol",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(h,{children:e.jsxs(n.p,{children:["This page documents how to implement render modes yourself. It's an advanced task and we generally recommend simply using the ",e.jsx(l,{href:"/ssr",children:e.jsx(n.code,{children:"ssr"})})," and ",e.jsx(l,{href:"/pre-rendering#how-to-pre-render",children:e.jsx(n.code,{children:"prerender"})})," settings instead."]})}),`
`,e.jsx(n.p,{children:"For each page, you can choose a different render mode:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"SPA"}),`
`,e.jsx(n.li,{children:"SSR"}),`
`,e.jsx(n.li,{children:"HTML-only"}),`
`,e.jsx(n.li,{children:"Pre-rendering (SSG)"}),`
`]}),`
`,e.jsx(n.p,{children:"For example, you can render an admin panel as SPA while rendering marketing pages with SSR."}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:['What "SPA", "SSR", "HTML-only" and "SSG" mean, and which one should be used, is explained at ',e.jsx(l,{href:"/SPA-vs-SSR"}),"."]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"The Vike boilerplates do SSR by default, which is a sensible default that works for most apps."}),`
`]}),`
`,e.jsx(c,{featureName:"Render Modes"}),`
`,e.jsx("h2",{id:"spa",children:"SPA"}),`
`,e.jsx(n.p,{children:"Rendering a page as SPA means that the page is loaded and rendered only in the browser."}),`
`,e.jsx(n.p,{children:"To achieve that:"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:["We set ",e.jsx(n.code,{children:"Page"}),"'s ",e.jsx(l,{href:"/meta",children:"meta config"})," ",e.jsx(n.code,{children:"env"})," to ",e.jsx(n.code,{children:"{ server: false, client: true }"})," instead of ",e.jsx(n.code,{children:"{ server: true, client: true }"}),"."]}),`
`,e.jsxs(n.li,{children:["We adapt our ",e.jsx(n.code,{children:"onRenderHtml()"})," and ",e.jsx(n.code,{children:"onRenderClient()"})," hooks."]}),`
`]}),`
`,e.jsx(n.p,{children:e.jsxs(n.strong,{children:["1. ",e.jsx(n.code,{children:"Page"})," meta config"]})}),`
`,e.jsxs(n.p,{children:["By setting ",e.jsx(n.code,{children:"Page"}),"'s meta config ",e.jsx(n.code,{children:"env"})," to ",e.jsx(n.code,{children:"{ client: true, server: false }"})," we tell Vike to load ",e.jsx(n.code,{children:"+Page.js"})," only in the browser."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /renderer/+config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: config"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  meta: {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    Page: {"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"      env: { server: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"false"}),e.jsx(n.span,{style:{color:"#24292E"},children:", client: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(n.span,{style:{color:"#24292E"},children:" } "}),e.jsx(n.span,{style:{color:"#6A737D"},children:"// SPA for all pages"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.p,{children:"React example (SPA + SSR):"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Custom ",e.jsx(n.code,{children:"renderMode"})," config: ",e.jsx(s,{path:"/examples/render-modes/renderer/+config.ts"})]}),`
`,e.jsxs(n.li,{children:["SPA page: ",e.jsx(s,{path:"/examples/render-modes/pages/spa/+Page.jsx"})]}),`
`,e.jsxs(n.li,{children:["SPA page's ",e.jsx(n.code,{children:"renderMode"})," config value: ",e.jsx(s,{path:"/examples/render-modes/pages/spa/+renderMode.js"})]}),`
`,e.jsxs(n.li,{children:["SSR page: ",e.jsx(s,{path:"/examples/render-modes/pages/ssr/+Page.jsx"})]}),`
`,e.jsxs(n.li,{children:["SSR page's ",e.jsx(n.code,{children:"renderMode"})," config value: ",e.jsx(s,{path:"/examples/render-modes/pages/ssr/+renderMode.js"})]}),`
`]}),`
`,e.jsxs(n.p,{children:["Vue example: ",e.jsxs(n.a,{href:"https://github.com/AaronBeaudoin/vite-plugin-ssr-example/blob/main/pages/spa.page.client.vue",children:["GitHub > ",e.jsx(n.code,{children:"AaronBeaudoin/vite-plugin-ssr-example"})," > ",e.jsx(n.code,{children:"/pages/spa.page.client.vue"})]})]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["vite-plugin-ssr was the ",e.jsx(n.a,{href:"https://vite-plugin-ssr.com/vike",children:"previous name of Vike"}),". Contributions welcome to fork and update the Vue example."]}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"2. Render hooks (SPA only)"})}),`
`,e.jsxs(n.p,{children:["If we only have SPA pages, then we adapt our ",e.jsx(n.code,{children:"onRenderHtml()"})," and ",e.jsx(n.code,{children:"onRenderClient()"})," hooks like the following."]}),`
`,e.jsxs(n.p,{children:["Client-side ",e.jsx(n.code,{children:"onRenderClient()"})," hook:"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /renderer/+onRenderClient.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: browser"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { renderToDom } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'some-ui-framework'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { onRenderClient }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onRenderClient"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"Page"}),e.jsx(n.span,{style:{color:"#24292E"},children:" } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:" pageContext"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // UI frameworks usually have two methods, such as `renderToDom()` and `hydrateDom()`."})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Note how we use `renderToDom()` and not `hydrateDom()`."})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  await"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" renderToDom"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(document."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"getElementById"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#032F62"},children:"'root'"}),e.jsx(n.span,{style:{color:"#24292E"},children:"), Page)"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["See ",e.jsx(l,{href:"/hydration"}),' for understanding the difference between "rendering to the DOM" and "hydrating the DOM".']}),`
`]}),`
`,e.jsxs(n.p,{children:["We also adapt our server-side ",e.jsx(n.code,{children:"onRenderHtml()"})," hook:"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /renderer/+onRenderHtml.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { escapeInject } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/server'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { onRenderHtml }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onRenderHtml"}),e.jsx(n.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Note that `div#root` is empty"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" escapeInject"}),e.jsx(n.span,{style:{color:"#032F62"},children:"`<html>"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#032F62"},children:"    <body>"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#032F62"},children:'      <div id="root"></div>'})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#032F62"},children:"    </body>"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#032F62"},children:"  </html>`"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.p,{children:["This is the key difference between SPA and SSR: in SPA ",e.jsx(n.code,{children:"div#root"})," is empty, whereas with SSR ",e.jsx(n.code,{children:"div#root"})," contains our Page's root component ",e.jsx(n.code,{children:"pageContext.Page"})," rendered to HTML."]}),`
`,e.jsxs(n.p,{children:["This means that, with SPA, we use our server-side ",e.jsx(n.code,{children:"onRenderHtml()"}),` hook to generate HTML that is just an empty shell:
the HTML doesn't contain the page's content.`]}),`
`,e.jsxs(n.p,{children:["For production, we usually want to ",e.jsx(l,{text:"pre-render",href:"/pre-rendering"})," the HTML of our SPA pages in order to remove the need for a production Node.js server."]}),`
`,e.jsxs(n.p,{children:["We can also use our server-side ",e.jsx(n.code,{children:"onRenderHtml()"})," hook to render ",e.jsx(n.code,{children:"<head>"}),":"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /renderer/+onRenderHtml.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { escapeInject } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/server'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { onRenderHtml }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onRenderHtml"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"title"}),e.jsx(n.span,{style:{color:"#24292E"},children:", "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"description"}),e.jsx(n.span,{style:{color:"#24292E"},children:" } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:" pageContext.config"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Even though we load and render our page's components only in the browser,"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:'  // we define our page\'s `<title>` and `<meta name="description">` on the server-side.'})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" escapeInject"}),e.jsx(n.span,{style:{color:"#032F62"},children:"`<html>"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#032F62"},children:"    <head>"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#032F62"},children:"      <title>${"}),e.jsx(n.span,{style:{color:"#24292E"},children:"title"}),e.jsx(n.span,{style:{color:"#032F62"},children:"}</title>"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#032F62"},children:'      <meta name="description" content="${'}),e.jsx(n.span,{style:{color:"#24292E"},children:"description"}),e.jsx(n.span,{style:{color:"#032F62"},children:'}" />'})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#032F62"},children:"    </head>"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#032F62"},children:"    <body>"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#032F62"},children:'      <div id="root"></div>'})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#032F62"},children:"    </body>"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#032F62"},children:"  </html>`"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"pageContext.config.title"})," and ",e.jsx(n.code,{children:"pageContext.config.description"})," are custom settings, see ",e.jsx(l,{href:"/meta#example-title-and-description",doNotInferSectionTitle:!0}),"."]}),`
`]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/about/+title.js"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" title"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'About | My App'"})]})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/about/+description.js"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" description"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'My App is ...'"})]})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /renderer/+config.js"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  meta: {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    Page: {"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"      env: { server: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"false"}),e.jsx(n.span,{style:{color:"#24292E"},children:", client: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(n.span,{style:{color:"#24292E"},children:" } "}),e.jsx(n.span,{style:{color:"#6A737D"},children:"// SPA for all pages"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    },"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    title: {"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"      env: { server: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(n.span,{style:{color:"#24292E"},children:", client: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"false"}),e.jsx(n.span,{style:{color:"#24292E"},children:" }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    },"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    description: {"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"      env: { server: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(n.span,{style:{color:"#24292E"},children:", client: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"false"}),e.jsx(n.span,{style:{color:"#24292E"},children:" }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"2. Render hooks (SPA + SSR)"})}),`
`,e.jsxs(n.p,{children:["If we have both SPA and SSR pages, then we adapt our ",e.jsx(n.code,{children:"onRenderHtml()"})," and ",e.jsx(n.code,{children:"onRenderClient()"})," hooks like this:"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /renderer/+onRenderHtml.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { escapeInject, dangerouslySkipEscape } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/server'"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { renderToHtml } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'some-ui-framework'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { onRenderHtml }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onRenderHtml"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  let"}),e.jsx(n.span,{style:{color:"#24292E"},children:" pageHtml"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(n.span,{style:{color:"#24292E"},children:" (pageContext.Page) {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // For SSR pages"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"    pageHtml "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" renderToHtml"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(pageContext.Page)"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"else"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // For SPA pages"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"    pageHtml "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#032F62"},children:" ''"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" escapeInject"}),e.jsx(n.span,{style:{color:"#032F62"},children:"`<html>"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#032F62"},children:"    <body>"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#032F62"},children:'      <div id="root">${'}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"dangerouslySkipEscape"}),e.jsx(n.span,{style:{color:"#032F62"},children:"("}),e.jsx(n.span,{style:{color:"#24292E"},children:"pageHtml"}),e.jsx(n.span,{style:{color:"#032F62"},children:")"}),e.jsx(n.span,{style:{color:"#032F62"},children:"}</div>"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#032F62"},children:"    </body>"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#032F62"},children:"  </html>`"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["If we set the ",e.jsx(n.code,{children:"Page"})," meta config ",e.jsx(n.code,{children:"env"})," to ",e.jsx(n.code,{children:"{ server: false, client: true }"}),` instead of
`,e.jsx(n.code,{children:"{ server: true, client: true }"})," in ",e.jsx(n.code,{children:"config.js"}),", then ",e.jsx(n.code,{children:"pageContext.Page"}),` is
only defined in the browser.`]}),`
`]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /renderer/+onRenderClient.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: browser"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { renderToDom, hydrateDom } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'some-ui-framework'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { onRenderClient }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onRenderClient"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"Page"}),e.jsx(n.span,{style:{color:"#24292E"},children:" } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:" pageContext"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" root"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#24292E"},children:" document."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"getElementById"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#032F62"},children:"'root'"}),e.jsx(n.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(n.span,{style:{color:"#24292E"},children:" ("})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // We detect SPAs by using the fact that `innerHTML === ''` for the first render of an SPA"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"    root.innerHTML "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"==="}),e.jsx(n.span,{style:{color:"#032F62"},children:" ''"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ||"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // Upon Client Routing page navigation, Vike sets `pageContext.isHydration`"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // to `false`."})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"    !"}),e.jsx(n.span,{style:{color:"#24292E"},children:"pageContext.isHydration"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  ) {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // - SPA pages don't have any hydration steps: they need to be fully rendered."})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // - Page navigation of SSR pages also need to be fully rendered (if we use Client Routing)"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"    await"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" renderToDom"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(root, Page)"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"else"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // The first render of SSR pages is merely a hydration (instead of a full render)"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"    await"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" hydrateDom"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(root, Page)"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.p,{children:["React example: ",e.jsx(s,{path:"/examples/render-modes/"}),"."]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Server-side hook: ",e.jsx(s,{path:"/examples/render-modes/renderer/+onRenderHtml.jsx"})]}),`
`,e.jsxs(n.li,{children:["Client-side hook: ",e.jsx(s,{path:"/examples/render-modes/renderer/+onRenderClient.jsx"})]}),`
`,e.jsxs(n.li,{children:["Custom ",e.jsx(n.code,{children:"renderMode"})," config: ",e.jsx(s,{path:"/examples/render-modes/renderer/+config.ts"})]}),`
`,e.jsxs(n.li,{children:["SPA page: ",e.jsx(s,{path:"/examples/render-modes/pages/spa/+Page.jsx"})]}),`
`,e.jsxs(n.li,{children:["SPA page's ",e.jsx(n.code,{children:"renderMode"})," config value: ",e.jsx(s,{path:"/examples/render-modes/pages/spa/+renderMode.js"})]}),`
`,e.jsxs(n.li,{children:["SSR page: ",e.jsx(s,{path:"/examples/render-modes/pages/ssr/+Page.jsx"})]}),`
`,e.jsxs(n.li,{children:["SSR page's ",e.jsx(n.code,{children:"renderMode"})," config value: ",e.jsx(s,{path:"/examples/render-modes/pages/ssr/+renderMode.js"})]}),`
`]}),`
`,e.jsxs(n.p,{children:["Vue Example: ",e.jsxs(n.a,{href:"https://github.com/AaronBeaudoin/vite-plugin-ssr-example",children:["GitHub > ",e.jsx(n.code,{children:"AaronBeaudoin/vite-plugin-ssr-example"})]}),"."]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Server-side hook: ",e.jsx(n.a,{href:"https://github.com/AaronBeaudoin/vite-plugin-ssr-example/blob/main/pages/_default/_default.page.server.ts",children:"/pages/_default/_default.page.server.ts"})]}),`
`,e.jsxs(n.li,{children:["Client-side hook: ",e.jsx(n.a,{href:"https://github.com/AaronBeaudoin/vite-plugin-ssr-example/blob/main/pages/_default/_default.page.client.ts",children:"/pages/_default/_default.page.client.ts"})]}),`
`,e.jsxs(n.li,{children:["SPA page: ",e.jsx(n.a,{href:"https://github.com/AaronBeaudoin/vite-plugin-ssr-example/blob/main/pages/spa.page.client.vue",children:"/pages/spa.page.client.vue"})]}),`
`,e.jsxs(n.li,{children:["SSR page: ",e.jsx(n.a,{href:"https://github.com/AaronBeaudoin/vite-plugin-ssr-example/blob/main/pages/ssr.page.vue",children:"/pages/ssr.page.vue"})]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["vite-plugin-ssr was the ",e.jsx(n.a,{href:"https://vite-plugin-ssr.com/vike",children:"previous name of Vike"}),". Contributions welcome to fork and update the Vue example."]}),`
`]}),`
`,e.jsx("h2",{id:"ssr",children:"SSR"}),`
`,e.jsx(n.p,{children:"The Vike boilerplates and documentation use SSR by default."}),`
`,e.jsx(n.p,{children:"So, if we only have SSR pages, then there is nothing for us to do: we simply follow the boilerplates/docs."}),`
`,e.jsxs(n.p,{children:["If we want to have both SSR and SPA pages, then see ",e.jsx(n.a,{href:"#spa",children:"the SPA section"}),"."]}),`
`,e.jsx("h2",{id:"pre-rendering-ssg",children:"Pre-rendering (SSG)"}),`
`,e.jsxs(n.p,{children:["See ",e.jsx(l,{href:"/pre-rendering"}),"."]}),`
`,e.jsx("h2",{id:"html-only",children:"HTML-only"}),`
`,e.jsx(t,{children:"Using modern UI frameworks (React/Vue/...) to render pages only to HTML is a novel technique and should be considered experimental."}),`
`,e.jsx(n.p,{children:"To render a page to HTML-only:"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:["We set ",e.jsx(n.code,{children:"Page"}),"'s ",e.jsx(l,{href:"/meta",children:"meta config"})," ",e.jsx(n.code,{children:"env"})," to ",e.jsx(n.code,{children:"{ server: true, client: false }"})," instead of ",e.jsx(n.code,{children:"{ server: true, client: true }"}),"."]}),`
`,e.jsxs(n.li,{children:["(Optional) We define ",e.jsx(l,{href:"/client",children:e.jsx(n.code,{children:"+client.js"})})," (e.g. to add a minimal amount of JavaScript surgically injecting bits of interactivity)."]}),`
`]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /renderer/+config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: config"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  meta: {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    Page: {"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"      env: { server: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(n.span,{style:{color:"#24292E"},children:", client: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"false"}),e.jsx(n.span,{style:{color:"#24292E"},children:" } "}),e.jsx(n.span,{style:{color:"#6A737D"},children:"// HTML-only for all pages"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/about/+Page.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { Page }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Page"}),e.jsx(n.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" <>"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"    <"}),e.jsx(n.span,{style:{color:"#22863A"},children:"h1"}),e.jsx(n.span,{style:{color:"#24292E"},children:">HTML-only page</"}),e.jsx(n.span,{style:{color:"#22863A"},children:"h1"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"    <"}),e.jsx(n.span,{style:{color:"#22863A"},children:"p"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"      This page is rendered only to HTML. (It's not loaded/rendered in the browser-side.)"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"    </"}),e.jsx(n.span,{style:{color:"#22863A"},children:"p"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  </>"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/about/+client.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: browser"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// This file represents the entire browser-side JavaScript."})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// We can omit defining `+client.js` in which case the page has zero browser-side JavaScript."})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"console."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"log"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#032F62"},children:`"I'm the page's only browser-side JavaScript line."`}),e.jsx(n.span,{style:{color:"#24292E"},children:")"})]})]})})}),`
`,e.jsx(n.p,{children:"React example:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Zero JavaScript: ",e.jsx(s,{path:"/examples/render-modes/pages/html-only/"})]}),`
`,e.jsxs(n.li,{children:["Minimal JavaScript: ",e.jsx(s,{path:"/examples/render-modes/pages/html-js/"})]}),`
`]}),`
`,e.jsxs(n.p,{children:["Vue Example: ",e.jsxs(n.a,{href:"https://github.com/AaronBeaudoin/vite-plugin-ssr-example/blob/main/pages/html.page.server.vue",children:["GitHub > ",e.jsx(n.code,{children:"AaronBeaudoin/vite-plugin-ssr-example"})," > ",e.jsx(n.code,{children:"/pages/html.page.server.vue"})]})]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["vite-plugin-ssr was the ",e.jsx(n.a,{href:"https://vite-plugin-ssr.com/vike",children:"previous name of Vike"}),". Contributions welcome to fork and update the Vue example."]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{href:"/clientHooks"}),`
`]}),`
`]})]})}function x(r={}){const{wrapper:n}=r.components||{};return n?e.jsx(n,{...r,children:e.jsx(a,{...r})}):a(r)}const j=Object.freeze(Object.defineProperty({__proto__:null,default:x,pageSectionsExport:p},Symbol.toStringTag,{value:"Module"})),F={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:d}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/render-modes/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:j}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:i}}};export{F as configValuesSerialized};
