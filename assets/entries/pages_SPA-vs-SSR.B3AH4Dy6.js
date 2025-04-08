import{j as e,i as o,L as s,o as a}from"../chunks/chunk-CKzAuXwH.js";import{L as r}from"../chunks/chunk-DUsA13Od.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-VLiKoQz4.js";/* empty css                      */const d=[{pageSectionId:"technical-overview",pageSectionLevel:2,pageSectionTitle:"Technical Overview"},{pageSectionId:"spa",pageSectionLevel:2,pageSectionTitle:"SPA"},{pageSectionId:"ssr",pageSectionLevel:2,pageSectionTitle:"SSR"},{pageSectionId:"pre-rendering",pageSectionLevel:2,pageSectionTitle:"Pre-rendering"},{pageSectionId:"html-only",pageSectionLevel:2,pageSectionTitle:"HTML-only"},{pageSectionId:"ssg",pageSectionLevel:2,pageSectionTitle:"SSG"}];function t(i){const n={a:"a",blockquote:"blockquote",code:"code",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.p,{children:"Modern UI frameworks (React/Vue/...) enable a wide range of render modes:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"SPA"}),`
`,e.jsx(n.li,{children:"SSR"}),`
`,e.jsx(n.li,{children:"Pre-rendering (aka SSG)"}),`
`,e.jsx(n.li,{children:"HTML-only"}),`
`]}),`
`,e.jsx(n.p,{children:"We compare render modes and explain when to use each mode."}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["See ",e.jsx(r,{href:"/render-modes"})," for how to use render modes with your Vike app."]}),`
`]}),`
`,e.jsx("h2",{id:"technical-overview",children:"Technical Overview"}),`
`,e.jsx(n.p,{children:"Technically and precisely speaking, the difference between each render mode is the following."}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"SSR"}),": the page is rendered twice. It's rendered to HTML on the server-side as well as rendered (hydrated) on the browser-side. (The page is loaded both in Node.js and in the browser.)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"SPA"}),": the page is only rendered in the browser. The page's content isn't rendered to HTML. (The page is loaded only in the browser.)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"HTML-only"}),": the page is rendered only on the server-side (to HTML). It's not rendered in the browser and has zero/minimal browser-side JavaScript. (The page is loaded only in Node.js.)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Pre-rendering"})," (aka SSG): the page is rendered to HTML at build-time (instead of request-time)."]}),`
`]}),`
`,e.jsx("h2",{id:"spa",children:"SPA"}),`
`,e.jsx(n.p,{children:"SPA means that the page is loaded & rendered only in the browser."}),`
`,e.jsx(n.p,{children:"In general, if our page:"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:"doesn't need SEO (e.g. an Admin Panel doesn't need to appear in Google searches), and"}),`
`,e.jsx(n.li,{children:"mobile performance isn't crucial (e.g. the user is expected to use the Admin Panel on a desktop device)."}),`
`]}),`
`,e.jsx(n.p,{children:"then SPA is an option."}),`
`,e.jsx(n.p,{children:"SPA advantages:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Our page's code doesn't need to be able to run in Node.js. For example, SPA is the only option for UI libraries that don't work with SSR.",`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"Most libraries nowadays support SSR (or have workarounds)."}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:["SPA doesn't enforce the usage of a production Node.js server: ",e.jsx(r,{text:"SPAs can be deployed to a static host",href:"/pre-rendering#should-i-pre-render"}),".",`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"We can remove the need for a production Node.js server for SSR apps by using pre-rendering."}),`
`]}),`
`]}),`
`,e.jsx(n.li,{children:"Decreased backend workload."}),`
`]}),`
`,e.jsx(n.p,{children:"While for certain types of pages, such as an Admin Panel where there is a clear choice in favor of SPA, there often isn't a clear-cut whether we should use SPA or SSR."}),`
`,e.jsx("h2",{id:"ssr",children:"SSR"}),`
`,e.jsxs(n.p,{children:["With ",e.jsx(r,{href:"/server-side-rendering",children:"SSR"}),", the page is rendered to HTML on the server-side ",e.jsx(r,{href:"/hydration",children:"as well as interactive"})," on the client-side rendered."]}),`
`,e.jsx(n.p,{children:"It is the most capable mode as it enables:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Improved SEO (e.g. high ranking on Google)"}),`
`,e.jsx(n.li,{children:"Improved mobile performance"}),`
`]}),`
`,e.jsx(n.p,{children:"For example, social news websites need SSR. (They are interactive while needing both SEO and mobile performance.)"}),`
`,e.jsx(n.p,{children:"SSR improves mobile performance in the sense that the page's content is rendered to HTML and can already be shown to the user before the browser-side JavaScript even starts loading. (Loading & executing JavaScript is usually very slow on mobile.)"}),`
`,e.jsxs(n.p,{children:["For pages that are not ",e.jsx(r,{text:"content centric",href:"/content-vs-interactive"})," (e.g. a to-do list app) and don't need SEO, we can consider ",e.jsx(n.a,{href:"#spa",children:"SPA"})," instead of SSR."]}),`
`,e.jsx("h2",{id:"pre-rendering",children:"Pre-rendering"}),`
`,e.jsx(n.p,{children:"Pre-rendering means to render the page's HTML at build-time instead of request-time."}),`
`,e.jsx(n.p,{children:"We should use pre-rendering whenever we can, as it allows us to deploy our app to a Static Host."}),`
`,e.jsxs(n.p,{children:["For example, ",e.jsx(n.code,{children:"https://vike.dev"})," is pre-rendered and deployed to ",e.jsx(n.a,{href:"/github-pages",children:"GitHub Pages"}),"."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["See ",e.jsx(r,{href:"/pre-rendering"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"html-only",children:"HTML-only"}),`
`,e.jsx(n.p,{children:"HTML-only means that the page is only loaded & rendered on the server-side."}),`
`,e.jsxs(n.p,{children:["For ",e.jsx(r,{text:"content centric",href:"/content-vs-interactive"})," pages with no/little interactivity (the page has no/few stateful components), then using HTML-only is an option."]}),`
`,e.jsx(n.p,{children:"Examples:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Blog"}),`
`,e.jsx(n.li,{children:"Portfolio/homepage"}),`
`,e.jsx(n.li,{children:"Marketing pages"}),`
`,e.jsxs(n.li,{children:["Software Documentation (e.g. ",e.jsx(n.code,{children:"https://vike.dev"}),")"]}),`
`]}),`
`,e.jsx(n.p,{children:"The advantage of HTML-only is that the page has no/little browser-side JavaScript, which leads to considerably faster loading times (especially on mobile)."}),`
`,e.jsxs(n.p,{children:[`For the few bits of interactivity (such as an image carousel or a collapsible section),
the page can load a couple of vanilla browser-side JavaScript libraries to surgically implement these few bits of interactivity.
This is what `,e.jsx(n.code,{children:"https://vike.dev"})," does: if we inspect the browser-side JavaScript of this page, we'll see only around 1-2KB of JavaScript."]}),`
`,e.jsx("h2",{id:"ssg",children:"SSG"}),`
`,e.jsx(n.p,{children:'Tools that pre-render pages are also known as "SSG" (Static-Site Generators).'}),`
`,e.jsx(n.p,{children:'In the context of Vike, we use the terms "SSG" and "pre-rendering" interchangeably.'}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["See ",e.jsx(r,{href:"/pre-rendering"}),"."]}),`
`]})]})}function l(i={}){const{wrapper:n}=i.components||{};return n?e.jsx(n,{...i,children:e.jsx(t,{...i})}):t(i)}const h=Object.freeze(Object.defineProperty({__proto__:null,default:l,pageSectionsExport:d},Symbol.toStringTag,{value:"Module"})),y={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:a}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/SPA-vs-SSR/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:h}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:s}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:o}}};export{y as configValuesSerialized};
