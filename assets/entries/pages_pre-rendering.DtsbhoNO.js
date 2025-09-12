import{o as i,a as t}from"../chunks/chunk-eD_Oz-vE.js";import{j as e,b as r}from"../chunks/chunk-CC4ltPc3.js";import{L as n}from"../chunks/chunk-DFQUjVEP.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{M as d}from"../chunks/chunk-FQMQvJAL.js";/* empty css                      */const o=[{pageSectionId:"what-is-pre-rendering",pageSectionLevel:2,pageSectionTitle:"What is pre-rendering?"},{pageSectionId:"should-i-pre-render",pageSectionLevel:2,pageSectionTitle:"Should I pre-render?"},{pageSectionId:"how-to-pre-render",pageSectionLevel:2,pageSectionTitle:"How to pre-render"},{pageSectionId:"ssg-vs-ssr",pageSectionLevel:2,pageSectionTitle:"SSG vs SSR"},{pageSectionId:"can-i-use-ssg-spa",pageSectionLevel:2,pageSectionTitle:"Can I use SSG + SPA?"},{pageSectionId:"can-i-use-ssg-ssr",pageSectionLevel:2,pageSectionTitle:"Can I use SSG + SSR?"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function a(l){const s={a:"a",blockquote:"blockquote",code:"code",em:"em",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...l.components};return e.jsxs(e.Fragment,{children:[e.jsx("h2",{id:"what-is-pre-rendering",children:"What is pre-rendering?"}),`
`,e.jsxs(s.p,{children:["Pre-rendering means to render the HTML of pages at build-time (when running ",e.jsx(n,{href:"/cli",children:e.jsx(s.code,{children:"$ vike build"})}),")."]}),`
`,e.jsx(s.p,{children:"Without pre-rendering, the HTML of a page is rendered at request-time (when the user goes to that page)."}),`
`,e.jsxs(s.p,{children:["If you pre-render all your pages, you don't need a production server: your app consists only of a static assets (HTML, JS, CSS, images, ...) that can be deployed to a static host (",e.jsx(n,{href:"/github-pages",text:"GitHub Pages"}),", ",e.jsx(n,{href:"/cloudflare-pages",children:"Cloudflare Pages"}),", ",e.jsx(n,{href:"/netlify",children:"Netlify"}),", ...)."]}),`
`,e.jsxs(s.p,{children:["If you don't pre-render, you need a production server to dynamically render your pages' HTML at request-time. (Deploying a ",e.jsx(s.a,{href:"https://nodejs.org",children:"Node.js"})," server to ",e.jsx(s.a,{href:"https://aws.amazon.com",children:"AWS"}),", ",e.jsx(n,{href:"/cloudflare",text:"Cloudflare Workers"}),", ",e.jsx(n,{href:"/vercel",text:"Vercel"}),"...)"]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:'Tools that pre-render pages are also known as "SSG" (Static-Site Generators).'}),`
`]}),`
`,e.jsx("h2",{id:"should-i-pre-render",children:"Should I pre-render?"}),`
`,e.jsxs(s.p,{children:["In a nutshell: ",e.jsx(s.strong,{children:"pre-render your pages whenever you can"}),"."]}),`
`,e.jsx(s.p,{children:"Because pre-rendering removes the need for a production server and makes deployment very easy and very cheap (usually free). It's also significantly more performant as the HTML isn't re-generated on every HTTP request."}),`
`,e.jsxs(s.p,{children:["But ",e.jsx(s.strong,{children:"pre-rendering cannot be used for websites with content that changes very frequently"}),". For example ",e.jsx(s.a,{href:"https://news.ycombinator.com",children:"Hacker News"})," or ",e.jsx(s.a,{href:"https://www.reddit.com",children:"Reddit"}),": users are constantly creating new posts, which would require pre-rendering to run again each time — pre-rendering the entire website (millions of pages) every millisecond isn't possible."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"In theory, it's possible to re-render only the subset of pages that are affected by new content, but it isn't practical (it has been tried before) and we recommend against this practice."}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"Technically, the bottom line is: how frequently does the HTML of your pages change? See:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"#ssg-vs-ssr"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/SSR-vs-SPA"}),`
`]}),`
`]}),`
`]}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Pre-rendering can be used for websites with content that changes only occasionally"}),". For example, the content of ",e.jsx(s.code,{children:"https://vike.dev"})," changes only when a maintainer updates the documentation — the entire website ",e.jsx(s.code,{children:"https://vike.dev"})," can then be pre-rendered again every time there is change."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["This website ",e.jsx(s.code,{children:"https://vike.dev"})," uses pre-rendering and is deployed to ",e.jsx(n,{href:"/github-pages",text:"GitHub Pages"})," — a static host that is completely free, ",e.jsx(s.a,{href:"https://github.com/vikejs/vike/blob/main/.github/workflows/website.yml",children:"easy to use"}),", and performant."]}),`
`]}),`
`,e.jsx("h2",{id:"how-to-pre-render",children:"How to pre-render"}),`
`,e.jsx(s.p,{children:"To opt into pre-rendering:"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})}),`
`,e.jsxs(s.p,{children:["List of options: ",e.jsx(n,{href:"/prerender"}),"."]}),`
`,e.jsxs(s.p,{children:["Your pages' HTML are rendered when you run ",e.jsx(n,{href:"/cli",children:e.jsx(s.code,{children:"$ vike build"})})," and the generated HTML files are available at ",e.jsx(s.code,{children:"dist/client/"}),"."]}),`
`,e.jsxs(s.p,{children:["For a page with a parameterized route (e.g. ",e.jsx(s.code,{children:"/movie/@movieId"}),"), you have to use the ",e.jsxs(n,{href:"/onBeforePrerenderStart",children:[e.jsx(s.code,{children:"onBeforePrerenderStart()"})," hook"]})," in order to provide the list of URLs that are to be pre-rendered. The ",e.jsx(s.code,{children:"onBeforePrerenderStart()"})," hook can also be used to accelerate the pre-rendering process."]}),`
`,e.jsx(d,{}),`
`,e.jsxs(s.p,{children:["By default, all pages are pre-rendered. To pre-render only some pages, use the ",e.jsx(n,{href:"/prerender#partial",text:e.jsxs(e.Fragment,{children:[e.jsx(s.code,{children:"partial"})," option"]})})," with ",e.jsx(n,{href:"/prerender#toggle",text:e.jsx(s.code,{children:"prerender: false"})}),"."]}),`
`,e.jsxs(s.p,{children:["If you pre-render all your pages, then you can use ",e.jsxs(n,{href:"/cli",children:[e.jsx(s.code,{children:"$ vike dev"})," and ",e.jsx(s.code,{children:"$ vike preview"})]})," instead of using development/preview server."]}),`
`,e.jsxs(s.p,{children:["You can programmatically invoke the pre-rendering process, see ",e.jsx(n,{href:"/api#prerender",doNotInferSectionTitle:!0}),"."]}),`
`,e.jsx(s.p,{children:"React Example:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(r,{path:"/examples/react-full/vite.config.ts"})," (see setting ",e.jsx("code",{children:"prerender"})," option to ",e.jsx(s.code,{children:"true"}),")"]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(r,{path:"/examples/react-full/pages/hello/+onBeforePrerenderStart.ts"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(r,{path:"/examples/react-full/pages/star-wars/index/+onBeforePrerenderStart.ts"}),`
`]}),`
`,e.jsxs(s.li,{children:[e.jsx(r,{path:"/examples/react-full/package.json"})," (see Vike CLI usage)"]}),`
`]}),`
`,e.jsx(s.p,{children:"Vue Example:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(r,{path:"/examples/vue-full/vite.config.ts"})," (see setting ",e.jsx("code",{children:"prerender"})," option to ",e.jsx(s.code,{children:"true"}),")"]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(r,{path:"/examples/vue-full/pages/hello/+onBeforePrerenderStart.ts"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(r,{path:"/examples/vue-full/pages/star-wars/index/+onBeforePrerenderStart.ts"}),`
`]}),`
`,e.jsxs(s.li,{children:[e.jsx(r,{path:"/examples/vue-full/package.json"})," (see Vike CLI usage)"]}),`
`]}),`
`,e.jsx("h2",{id:"ssg-vs-ssr",children:"SSG vs SSR"}),`
`,e.jsxs(s.p,{children:["The only difference between SSG and SSR is ",e.jsx(s.em,{children:"when"})," the HTML is rendered:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"SSG"}),": the HTML of the page is rendered at build-time (when calling ",e.jsx(n,{href:"/cli",children:e.jsx(s.code,{children:"$ vike build"})}),")."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"SSR"}),": the HTML of the page is rendered at request-time (when the user goes to the page)."]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.strong,{children:"client-side code"})," of the page is always loaded and executed in the user's browser at request-time (regardless of SSG and SSR)."]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:`If you pre-render all your pages, there's no server — all "server-side code" runs at build-time. Calling it "server-side code" is technically a misnomer, but we keep the term for simplicity. One way to think about pre-rendering is that it essentially means "pre-rendered SSR (Server-Side Rendering)".`}),`
`]}),`
`,e.jsx(s.p,{children:"Essentially, and technically, SSG means SSR + pre-rendering:"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// SSG"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" // (optional: `ssr` is true by default)"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})}),`
`,e.jsx(s.p,{children:"See also:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/prerender"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/ssr"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/SSR-vs-SPA"}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"can-i-use-ssg-spa",children:"Can I use SSG + SPA?"}),`
`,e.jsx(s.p,{children:"Yes, you can have SPA pages while others are SSG."}),`
`,e.jsx(s.p,{children:"You usually still pre-render all your pages, including SPA pages. (See explanation below.)"}),`
`,e.jsx(s.p,{children:"For example:"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"yaml","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"yaml","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"pages/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"pages/(marketing)/+config.js"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"pages/(marketing)/index/+Page.js"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" # SSR"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"pages/(marketing)/about/+Page.js"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" # SSR"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"pages/admin-panel/+config.js"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"pages/admin-panel/index/+Page.js"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" # SPA"})]})]})})}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Pre-render *all* pages (including SPA pages)"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/admin-panel/about/+Page.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // SPA"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/(marketing)/about/+Page.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // SSG"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" // (optional: `ssr` is true by default)"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["SPA means the page is rendered only on the client-side (see ",e.jsx(n,{href:"/what-is-SSR-and-SPA"}),"). In other words, ",e.jsx(n,{href:"/ssr",children:"no SSR"}),":"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// SPA"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})}),`
`,e.jsx(s.p,{children:"But when the user visits an SPA page, the browser still needs an HTML response to kick off client-side rendering. This HTML is just an empty shell (it doesn't contain the content of the page). If you want to avoid the need for a production server, you can pre-render this empty shell:"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// SPA"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})}),`
`,e.jsxs(s.p,{children:["That's why the common practice is to set ",e.jsx(s.code,{children:"ssr: false"})," together with ",e.jsx(s.code,{children:"prerender: true"}),"."]}),`
`,e.jsx(s.p,{children:"In a nutshell: the only difference is that the content of your SSG pages is included in the HTML, while the content of your SPA pages isn't."}),`
`,e.jsxs(s.p,{children:["Even though the content of SPA pages is missing, meta information (title, description, social image, ...) is still included in the pre-rendered HTML. See ",e.jsx(n,{href:"/head-tags#spa"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"can-i-use-ssg-ssr",children:"Can I use SSG + SSR?"}),`
`,e.jsx(s.p,{children:"Yes, you can have SSR pages while others are SSG."}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:['SSG is basically "pre-rendered SSR", see ',e.jsx(n,{href:"#ssg-vs-ssr"}),"."]}),`
`]}),`
`,e.jsx(s.p,{children:"For example:"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"yaml","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"yaml","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"pages/+config.js"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"pages/user/@id/+Page.js"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" # SSR"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"pages/(marketing)/+config.js"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"pages/(marketing)/index/+Page.js"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" # SSG"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"pages/(marketing)/about/+Page.js"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" # SSG"})]})]})})}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// SSR"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" // (optional: `ssr` is true by default)"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/(marketing)/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// SSG"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" // (optional: `ssr` is inherited by pages/+config.js)"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"See also:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/ssr"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"#ssg-vs-ssr"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/config#inheritance"}),`
`]}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/data-fetching#pre-rendering-ssg",doNotInferSectionTitle:!0}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/static-hosts"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/SSR-vs-SPA"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/ssr"}),`
`]}),`
`]}),`
`,e.jsx(s.p,{children:"Pre-rendering options:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/prerender"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/onBeforePrerenderStart"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/onPrerenderStart"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/api#prerender",doNotInferSectionTitle:!0}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/cli"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/ssr"}),`
`]}),`
`]})]})}function c(l={}){const{wrapper:s}=l.components||{};return s?e.jsx(s,{...l,children:e.jsx(a,{...l})}):a(l)}const h=Object.freeze(Object.defineProperty({__proto__:null,default:c,pageSectionsExport:o},Symbol.toStringTag,{value:"Module"})),C={serverOnlyHooks:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:t}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:i}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/pre-rendering/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:h}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{C as configValuesSerialized};
