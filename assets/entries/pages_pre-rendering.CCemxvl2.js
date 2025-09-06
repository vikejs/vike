import{o as a,a as i}from"../chunks/chunk-BQuxccGo.js";import{j as e,b as r}from"../chunks/chunk-COSJmPUs.js";import{L as s}from"../chunks/chunk-BCHPCi_P.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{M as o}from"../chunks/chunk-BpLmmFTj.js";/* empty css                      */const d=[{pageSectionId:"what-is-pre-rendering",pageSectionLevel:2,pageSectionTitle:"What is pre-rendering?"},{pageSectionId:"should-i-pre-render",pageSectionLevel:2,pageSectionTitle:"Should I pre-render?"},{pageSectionId:"how-to-pre-render",pageSectionLevel:2,pageSectionTitle:"How to pre-render"},{pageSectionId:"ssg-vs-ssr",pageSectionLevel:2,pageSectionTitle:"SSG vs SSR"},{pageSectionId:"spa",pageSectionLevel:2,pageSectionTitle:"SPA"},{pageSectionId:"can-i-use-ssg-spa",pageSectionLevel:2,pageSectionTitle:"Can I use SSG + SPA?"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function t(l){const n={a:"a",blockquote:"blockquote",code:"code",em:"em",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...l.components};return e.jsxs(e.Fragment,{children:[e.jsx("h2",{id:"what-is-pre-rendering",children:"What is pre-rendering?"}),`
`,e.jsxs(n.p,{children:["Pre-rendering means to render the HTML of pages at build-time (when running ",e.jsx(n.code,{children:"$ vike build"}),")."]}),`
`,e.jsx(n.p,{children:"Without pre-rendering, the HTML of a page is rendered at request-time (when the user goes to that page)."}),`
`,e.jsxs(n.p,{children:[`If you pre-render all of your pages, then you no longer need a production server: your app will consist only of static assets (HTML, JS, CSS, images, ...)
that you can deploy to so-called "static hosts" such as `,e.jsx(s,{href:"/github-pages",text:"GitHub Pages"}),", ",e.jsx(n.a,{href:"/cloudflare-pages",children:"Cloudflare Pages"}),", or ",e.jsx(n.a,{href:"/netlify",children:"Netlify"}),"."]}),`
`,e.jsxs(n.p,{children:["If you don't pre-render, then you need a production server in order to be able to dynamically render the HTML of your pages at request-time. (A Node.js production server, or a Node.js-like production environment such as ",e.jsx(s,{href:"/cloudflare",text:"Cloudflare Workers"})," or ",e.jsx(s,{href:"/vercel",text:"Vercel"}),".)"]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:'Tools that pre-render pages are also known as "SSG" (Static-Site Generators).'}),`
`]}),`
`,e.jsx("h2",{id:"should-i-pre-render",children:"Should I pre-render?"}),`
`,e.jsxs(n.p,{children:["In a nutshell: ",e.jsx(n.strong,{children:"pre-render your pages whenever you can"}),"."]}),`
`,e.jsx(n.p,{children:"Because pre-rendering removes the need for a production server and makes deployment very easy and very cheap (mostly free). It's also significantly more performant as the HTML isn't re-generated on every HTTP request."}),`
`,e.jsxs(n.p,{children:["But ",e.jsx(n.strong,{children:"pre-rendering cannot be used for websites with content that changes very frequently"}),". For example ",e.jsx(n.a,{href:"https://news.ycombinator.com",children:"Hacker News"})," or ",e.jsx(n.a,{href:"https://www.reddit.com",children:"Reddit"}),": new content is created every time a user posts something new. Pre-rendering cannot be run again every (milli)second whenever there is new content (Reddit has millions of pages that cannot be re-rendered every (milli)second)."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"In theory, it's possible to re-render only the subset of pages that are affected by new content, but it isn't practical (it has been tried before) and we recommend against this practice."}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"Technically speaking, what matters is how frequent the HTML of pages changes, see also:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"#ssg-vs-ssr"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/SSR-vs-SPA"}),`
`]}),`
`]}),`
`]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Pre-rendering can be used for websites with content that changes only occasionally"}),". For example, the content of ",e.jsx(n.code,{children:"https://vike.dev"})," changes only when a maintainer updates the documentation: all pages of ",e.jsx(n.code,{children:"https://vike.dev"})," can then be pre-rendered again."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Thanks to pre-rendering, ",e.jsx(n.code,{children:"https://vike.dev"})," is deployed to ",e.jsx(s,{href:"/github-pages",text:"GitHub Pages"}),", a static host which is completely free, ",e.jsx(n.a,{href:"https://github.com/vikejs/vike/blob/main/.github/workflows/website.yml",children:"easy to use"}),", and very performant."]}),`
`]}),`
`,e.jsx("h2",{id:"how-to-pre-render",children:"How to pre-render"}),`
`,e.jsx(n.p,{children:"To opt into pre-rendering:"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"true"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"} "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})}),`
`,e.jsxs(n.p,{children:["List of options: ",e.jsx(s,{href:"/prerender"}),"."]}),`
`,e.jsxs(n.p,{children:["Your pages' HTML will be rendered when you run ",e.jsx(n.code,{children:"$ vike build"})," and the generated HTML files are available at ",e.jsx(n.code,{children:"dist/client/"}),"."]}),`
`,e.jsxs(n.p,{children:["For a page with a parameterized route (e.g. ",e.jsx(n.code,{children:"/movie/@movieId"}),"), you have to use the ",e.jsxs(s,{href:"/onBeforePrerenderStart",children:[e.jsx(n.code,{children:"onBeforePrerenderStart()"})," hook"]})," in order to provide the list of URLs that are to be pre-rendered. The ",e.jsx(n.code,{children:"onBeforePrerenderStart()"})," hook can also be used to accelerate the pre-rendering process."]}),`
`,e.jsx(o,{}),`
`,e.jsxs(n.p,{children:["By default, all pages are pre-rendered. To pre-render only some pages, use the ",e.jsx(s,{href:"/prerender#partial",text:e.jsxs(e.Fragment,{children:[e.jsx(n.code,{children:"partial"})," option"]})})," with ",e.jsx(s,{href:"/prerender#toggle",text:e.jsx(n.code,{children:"prerender: false"})}),"."]}),`
`,e.jsxs(n.p,{children:["If you pre-render all your pages, then you can use Vike's CLI instead of a server (",e.jsx(n.code,{children:"$ vike dev"})," and ",e.jsx(n.code,{children:"$ vike preview"}),"). See linked examples below."]}),`
`,e.jsxs(n.p,{children:["You can programmatically invoke the pre-rendering process, see ",e.jsx(s,{href:"/api#prerender",doNotInferSectionTitle:!0}),"."]}),`
`,e.jsx(n.p,{children:"React Example:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(r,{path:"/examples/react-full/vite.config.ts"})," (see setting ",e.jsx("code",{children:"prerender"})," option to ",e.jsx(n.code,{children:"true"}),")"]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(r,{path:"/examples/react-full/pages/hello/+onBeforePrerenderStart.ts"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(r,{path:"/examples/react-full/pages/star-wars/index/+onBeforePrerenderStart.ts"}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(r,{path:"/examples/react-full/package.json"})," (see Vike CLI usage)"]}),`
`]}),`
`,e.jsx(n.p,{children:"Vue Example:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(r,{path:"/examples/vue-full/vite.config.ts"})," (see setting ",e.jsx("code",{children:"prerender"})," option to ",e.jsx(n.code,{children:"true"}),")"]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(r,{path:"/examples/vue-full/pages/hello/+onBeforePrerenderStart.ts"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(r,{path:"/examples/vue-full/pages/star-wars/index/+onBeforePrerenderStart.ts"}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(r,{path:"/examples/vue-full/package.json"})," (see Vike CLI usage)"]}),`
`]}),`
`,e.jsx("h2",{id:"ssg-vs-ssr",children:"SSG vs SSR"}),`
`,e.jsxs(n.p,{children:["The only difference between SSG and SSR is ",e.jsx(n.em,{children:"when"})," the HTML is rendered:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"SSG"}),": the HTML of the page is rendered at build-time (when calling ",e.jsx(n.code,{children:"$ vike build"}),")."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"SSR"}),": the HTML of the page is rendered at request-time (when the user goes to the page)."]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"client-side code"})," of pages is loaded and executed in the user's browser and, therefore, always runs at request-time."]}),`
`,e.jsxs(n.p,{children:["If you pre-render all your pages, then there isn't any ",e.jsx(n.strong,{children:"server-side code"}),', because all the "server code" runs at build-time.']}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["With pre-rendering ",e.jsx(n.strong,{children:`it's a misnomer but we still call it "server-side code"`}),' to keep the docs simple. One way to think about it is that pre-rendering means "pre-rendered server-side code".']}),`
`]}),`
`,e.jsx(n.p,{children:"Essentially, and technically, SSG means SSR + pre-rendering:"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// SSG"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(n.span,{style:{color:"#6A737D"},children:" // (optional: `ssr` is true by default)"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"} "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})}),`
`,e.jsx(n.p,{children:"See also:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/prerender"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/ssr"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/SSR-vs-SPA"}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"spa",children:"SPA"}),`
`,e.jsx(n.p,{children:"SPA means the page is rendered only on the client-side."}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["See also: ",e.jsx(s,{href:"/what-is-SSR-and-SPA"})]}),`
`]}),`
`,e.jsx(n.p,{children:"In other words, no SSR:"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// SPA"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"} "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})}),`
`,e.jsx(n.p,{children:"But when the user visits an SPA page, the browser still needs an HTML response to kick off client-side rendering. This HTML is just an empty shell (it doesn't contain the content of the page). If you want to avoid the need for a production server, you can pre-render this empty shell:"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// SPA"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"} "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})}),`
`,e.jsxs(n.p,{children:["That's why it's a common practice to set ",e.jsx(n.code,{children:"ssr: false"})," together with ",e.jsx(n.code,{children:"prerender: true"}),"."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["You can also add meta page information (title, description, social image, ...) to the pre-rendered HTML of SPA pages, see ",e.jsx(s,{href:"/head-tags"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"can-i-use-ssg-spa",children:"Can I use SSG + SPA?"}),`
`,e.jsx(n.p,{children:"Yes, you can have some pages be SSG while other pages are SPA."}),`
`,e.jsxs(n.p,{children:["Technically, you still pre-render ",e.jsx(n.em,{children:"all"})," your pages, it's just that the content of some pages are rendered to HTML (SSG) while the content of others pages aren't rendered to HTML (SPA)."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["See explanation in the ",e.jsx(s,{href:"#spa"})," section above."]}),`
`]}),`
`,e.jsx(n.p,{children:"For example:"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"yaml","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"yaml","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#032F62"},children:"pages/+config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#032F62"},children:"pages/(marketing)/+config.js"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#032F62"},children:"pages/(marketing)/index/+Page.js"}),e.jsx(n.span,{style:{color:"#6A737D"},children:" # SSR"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#032F62"},children:"pages/(marketing)/about/+Page.js"}),e.jsx(n.span,{style:{color:"#6A737D"},children:" # SSR"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#032F62"},children:"pages/admin-panel/+config.js"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#032F62"},children:"pages/admin-panel/index/+Page.js"}),e.jsx(n.span,{style:{color:"#6A737D"},children:" # SPA"})]})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Pre-render *all* pages"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"true"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"} "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/admin-panel/about/+Page.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // SPA"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"} "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/(marketing)/about/+Page.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // SSG"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(n.span,{style:{color:"#6A737D"},children:" // (optional: `ssr` is true by default)"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"} "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})}),`
`,e.jsx(n.p,{children:"See also:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/prerender"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/ssr"}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/data-fetching#pre-rendering-ssg",doNotInferSectionTitle:!0}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/static-hosts"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/SSR-vs-SPA"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/ssr"}),`
`]}),`
`]}),`
`,e.jsx(n.p,{children:"Pre-rendering options:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/prerender"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/onBeforePrerenderStart"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/onPrerenderStart"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/api#prerender",doNotInferSectionTitle:!0}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/cli"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/ssr"}),`
`]}),`
`]})]})}function c(l={}){const{wrapper:n}=l.components||{};return n?e.jsx(n,{...l,children:e.jsx(t,{...l})}):t(l)}const h=Object.freeze(Object.defineProperty({__proto__:null,default:c,pageSectionsExport:d},Symbol.toStringTag,{value:"Module"})),C={serverOnlyHooks:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:i}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:a}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/pre-rendering/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:h}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{C as configValuesSerialized};
