import{o as t,a as d}from"../chunks/chunk-CxIOOiKX.js";import{j as e}from"../chunks/chunk-B35a6FX-.js";import{L as n}from"../chunks/chunk-BbfG-aTg.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as i}from"../chunks/chunk-CJvpbNqo.js";import{M as c}from"../chunks/chunk-BtaBDJbX.js";/* empty css                      *//* empty css                      *//* empty css                      */const o=[{pageSectionId:"what-is-pre-rendering",pageSectionLevel:2,pageSectionTitle:"What is pre-rendering?"},{pageSectionId:"should-i-pre-render",pageSectionLevel:2,pageSectionTitle:"Should I pre-render?"},{pageSectionId:"get-started",pageSectionLevel:2,pageSectionTitle:"Get started"},{pageSectionId:"cli-instead-of-server",pageSectionLevel:3,pageSectionTitle:"CLI instead of server"},{pageSectionId:"parameterized-routes",pageSectionLevel:3,pageSectionTitle:"Parameterized routes"},{pageSectionId:"configuration",pageSectionLevel:2,pageSectionTitle:"Configuration"},{pageSectionId:"partial",pageSectionLevel:2,pageSectionTitle:"Partial"},{pageSectionId:"opt-out",pageSectionLevel:3,pageSectionTitle:"Opt-out"},{pageSectionId:"opt-in-instead-of-opt-out",pageSectionLevel:3,pageSectionTitle:"Opt-in instead of opt-out"},{pageSectionId:"dynamic-condition",pageSectionLevel:3,pageSectionTitle:"Dynamic condition"},{pageSectionId:"ssg-vs-ssr",pageSectionLevel:2,pageSectionTitle:"SSG vs SSR"},{pageSectionId:"can-i-use-ssg-spa",pageSectionLevel:2,pageSectionTitle:"Can I use SSG + SPA?"},{pageSectionId:"can-i-use-ssg-ssr",pageSectionLevel:2,pageSectionTitle:"Can I use SSG + SSR?"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function r(a){const s={a:"a",blockquote:"blockquote",code:"code",div:"div",em:"em",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...i(),...a.components},{ChoiceGroup:l}=s;return l||p("ChoiceGroup"),e.jsxs(e.Fragment,{children:[e.jsx("h2",{id:"what-is-pre-rendering",children:"What is pre-rendering?"}),`
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
`,e.jsx("h2",{id:"get-started",children:"Get started"}),`
`,e.jsx(s.p,{children:"To enable pre-rendering:"}),`
`,e.jsxs(l,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsxs(s.p,{children:["Your pages' HTML are now rendered at build-time (when you run ",e.jsx(n,{href:"/cli",children:e.jsx(s.code,{children:"$ vike build"})}),") instead of request-time."]}),`
`,e.jsxs(s.p,{children:["The generated ",e.jsx(s.code,{children:".html"})," files are written to ",e.jsx(s.code,{children:"dist/client/"}),"."]}),`
`,e.jsx("h3",{id:"cli-instead-of-server",children:"CLI instead of server"}),`
`,e.jsxs(s.p,{children:["With pre-rendering, you don't need a JavaScript server — you can use ",e.jsxs(n,{href:"/cli",children:[e.jsx(s.code,{children:"$ vike dev"})," and ",e.jsx(s.code,{children:"$ vike preview"})]})," instead. (You do, however, need a JavaScript server if ",e.jsx(n,{href:"#partial",children:"you skip pre-rendering some pages"}),".)"]}),`
`,e.jsx("h3",{id:"parameterized-routes",children:"Parameterized routes"}),`
`,e.jsxs(s.p,{children:["For a page with a parameterized route (e.g. ",e.jsx(s.code,{children:"/movie/@id"}),"), you must use the ",e.jsxs(n,{href:"/onBeforePrerenderStart",children:[e.jsx(s.code,{children:"onBeforePrerenderStart()"})," hook"]})," to provide the list of URLs to be pre-rendered."]}),`
`,e.jsx(c,{}),`
`,e.jsx("h2",{id:"configuration",children:"Configuration"}),`
`,e.jsxs(s.p,{children:["Common ",e.jsx(s.code,{children:"+prerender"})," options:"]}),`
`,e.jsxs(l,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  prerender: {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    noExtraDir: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#6A737D"},children:"// Don't create a new directory for each HTML file"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    parallel: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" // Disable concurrency — pre-render pages sequentially (one by one)"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // ..."})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  prerender: {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    noExtraDir: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#6A737D"},children:"// Don't create a new directory for each HTML file"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    parallel: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" // Disable concurrency — pre-render pages sequentially (one by one)"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // ..."})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["See ",e.jsx(n,{href:"/prerender"})," for the list of all options."]}),`
`]}),`
`,e.jsx(s.p,{children:"You can also:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Pre-render only some pages (instead of pre-rendering all pages), see ",e.jsx(n,{href:"#partial"}),"."]}),`
`,e.jsxs(s.li,{children:["Define redirections, see ",e.jsx(n,{href:"/prerender#redirects"}),"."]}),`
`,e.jsxs(s.li,{children:["Use  ",e.jsxs(n,{href:"/api#prerender",children:["Vike's ",e.jsx(s.code,{children:"prerender()"})," API"]})," to invoke the pre-rendering process programmatically (instead of being run automatically on ",e.jsx(s.code,{children:"$ vike build"}),")."]}),`
`,e.jsxs(s.li,{children:["Accelerate the pre-rendering process by using the ",e.jsxs(n,{href:"/onBeforePrerenderStart",children:[e.jsx(s.code,{children:"onBeforePrerenderStart()"})," hook"]}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"partial",children:"Partial"}),`
`,e.jsx(s.p,{children:"By default, all pages are pre-rendered, but you can also pre-render only some pages."}),`
`,e.jsx("h3",{id:"opt-out",children:"Opt-out"}),`
`,e.jsxs(s.p,{children:["You can set ",e.jsx(s.code,{children:"prerender: false"})," to skip a page from pre-rendering:"]}),`
`,e.jsxs(l,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Pre-render all pages by default"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Pre-render all pages by default"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsxs(l,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/news/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Skip pre-rendering for /pages/news/+Page.js"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/news/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Skip pre-rendering for /pages/news/+Page.ts"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"For example, a news page that displays the latest news fetched from a database should be rendered at request-time (not at build-time)."}),`
`,e.jsxs(s.p,{children:["See also: ",e.jsx(n,{href:"/pre-rendering#should-i-pre-render",doNotInferSectionTitle:!0})]}),`
`]}),`
`,e.jsx(s.p,{children:"You can also disable pre-rendering for a group of pages:"}),`
`,e.jsxs(l,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",hide:!0,children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/products/+prerender.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Applies to all /pages/products/**/+Page.js"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" prerender"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#005CC5"},children:" false"})]})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/products/+prerender.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Applies to all /pages/products/**/+Page.ts"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" prerender"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#005CC5"},children:" false"})]})]})})})})]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["See also: ",e.jsx(n,{href:"/config#inheritance"})]}),`
`]}),`
`,e.jsx("h3",{id:"opt-in-instead-of-opt-out",children:"Opt-in instead of opt-out"}),`
`,e.jsx(s.p,{children:"You can make pre-rendering opt-in instead of opt-out:"}),`
`,e.jsxs(l,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // By default, pages aren't pre-rendered"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // By default, pages aren't pre-rendered"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsxs(l,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",hide:!0,children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/(marketing)/+prerender.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Applies to all marketing pages /pages/(marketing)/**/+Page.js"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" prerender"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#005CC5"},children:" true"})]})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/(marketing)/+prerender.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Applies to all marketing pages /pages/(marketing)/**/+Page.ts"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" prerender"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#005CC5"},children:" true"})]})]})})})})]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["The directory ",e.jsx(s.code,{children:"(marketing)"})," is ignored by Filesystem Routing, see ",e.jsx(n,{href:"/routing#groups"}),"."]}),`
`]}),`
`,e.jsx("h3",{id:"dynamic-condition",children:"Dynamic condition"}),`
`,e.jsx(s.p,{children:"You can dynamically disable/enable pre-rendering:"}),`
`,e.jsxs(l,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",hide:!0,children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+prerender.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" prerender"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" someCondition"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"?"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" false"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" :"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" true"})]})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+prerender.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" prerender"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" someCondition"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"?"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" false"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" :"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" true"})]})]})})})})]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"For example, to disable pre-rendering when previewing CMS changes:"}),`
`,e.jsxs(l,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",hide:!0,children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+prerender.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" prerender"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" process.env."}),e.jsx(s.span,{style:{color:"#005CC5"},children:"MODE"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" !=="}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'preview'"})]})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+prerender.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" prerender"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" process.env."}),e.jsx(s.span,{style:{color:"#005CC5"},children:"MODE"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" !=="}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'preview'"})]})]})})})})]}),`
`]}),`
`,e.jsxs(s.p,{children:["Note that ",e.jsxs(n,{href:"/onBeforePrerenderStart",children:[e.jsx(s.code,{children:"onBeforePrerenderStart()"})," hooks"]})," are always called, even if ",e.jsx(s.code,{children:"prerender"})," is ",e.jsx(s.code,{children:"false"}),`.
If you want to define `,e.jsx(s.code,{children:"onBeforePrerenderStart()"})," conditionally:"]}),`
`,e.jsxs(l,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",hide:!0,children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/movie/+prerender.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { prerender }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { someCondition } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" './someCondition'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" prerender"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" someCondition"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/movie/+prerender.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { prerender }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { someCondition } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" './someCondition'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" prerender"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" someCondition"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]})]})})})})]}),`
`,e.jsxs(l,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",hide:!0,children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/movie/+onBeforePrerenderStart.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { onBeforePrerenderStart }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { someCondition } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" './someCondition'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" onBeforePrerenderStart"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" someCondition"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  ?"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" async"}),e.jsx(s.span,{style:{color:"#24292E"},children:" () "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"      // ..."})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  :"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" null"})]})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/movie/+onBeforePrerenderStart.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { onBeforePrerenderStart }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { someCondition } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" './someCondition'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" onBeforePrerenderStart"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" someCondition"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  ?"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" async"}),e.jsx(s.span,{style:{color:"#24292E"},children:" () "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"      // ..."})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  :"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" null"})]})]})})})})]}),`
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
`,e.jsxs(l,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// SSG"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" // (optional: `ssr` is true by default)"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// SSG"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" // (optional: `ssr` is true by default)"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
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
`,e.jsxs(l,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",hide:!0,children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"yaml","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"yaml","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"pages/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"pages/(marketing)/+config.js"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"pages/(marketing)/index/+Page.js"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" # SSR"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"pages/(marketing)/about/+Page.js"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" # SSR"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"pages/admin-panel/+config.js"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"pages/admin-panel/index/+Page.js"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" # SPA"})]})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"yaml","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"yaml","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"pages/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"pages/(marketing)/+config.ts"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"pages/(marketing)/index/+Page.ts"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" # SSR"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"pages/(marketing)/about/+Page.ts"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" # SSR"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"pages/admin-panel/+config.ts"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"pages/admin-panel/index/+Page.ts"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" # SPA"})]})]})})})})]}),`
`,e.jsxs(l,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Pre-render *all* pages (including SPA pages)"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Pre-render *all* pages (including SPA pages)"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsxs(l,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/admin-panel/about/+Page.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // SPA"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/admin-panel/about/+Page.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // SPA"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsxs(l,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/(marketing)/about/+Page.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // SSG"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" // (optional: `ssr` is true by default)"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/(marketing)/about/+Page.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // SSG"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" // (optional: `ssr` is true by default)"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["SPA means the page is rendered only on the client-side (see ",e.jsx(n,{href:"/what-is-SSR-and-SPA"}),"). In other words, ",e.jsx(n,{href:"/ssr",children:"no SSR"}),":"]}),`
`,e.jsxs(l,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// SPA"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// SPA"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsx(s.p,{children:"But when the user visits an SPA page, the browser still needs an HTML response to kick off client-side rendering. This HTML is just an empty shell (it doesn't contain the content of the page). If you want to avoid the need for a production server, you can pre-render this empty shell:"}),`
`,e.jsxs(l,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// SPA"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// SPA"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
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
`,e.jsxs(l,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",hide:!0,children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"yaml","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"yaml","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"pages/+config.js"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"pages/user/@id/+Page.js"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" # SSR"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"pages/(marketing)/+config.js"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"pages/(marketing)/index/+Page.js"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" # SSG"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"pages/(marketing)/about/+Page.js"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" # SSG"})]})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"yaml","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"yaml","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"pages/+config.ts"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"pages/user/@id/+Page.ts"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" # SSR"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"pages/(marketing)/+config.ts"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"pages/(marketing)/index/+Page.ts"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" # SSG"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"pages/(marketing)/about/+Page.ts"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" # SSG"})]})]})})})})]}),`
`,e.jsxs(l,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// SSR"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" // (optional: `ssr` is true by default)"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// SSR"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" // (optional: `ssr` is true by default)"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsxs(l,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/(marketing)/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// SSG"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" // (optional: `ssr` is inherited by pages/+config.js)"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/(marketing)/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// SSG"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" // (optional: `ssr` is inherited by pages/+config.ts)"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
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
`]})]})}function h(a={}){const{wrapper:s}={...i(),...a.components};return s?e.jsx(s,{...a,children:e.jsx(r,{...a})}):r(a)}function p(a,s){throw new Error("Expected component `"+a+"` to be defined: you likely forgot to import, pass, or provide it.")}const x=Object.freeze(Object.defineProperty({__proto__:null,default:h,pageSectionsExport:o},Symbol.toStringTag,{value:"Module"})),w={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:d}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:t}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/pre-rendering/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:x}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{w as configValuesSerialized};
