import{o as t,a as d}from"../chunks/chunk-CxIOOiKX.js";import{j as e}from"../chunks/chunk-B35a6FX-.js";import{L as s}from"../chunks/chunk-BbfG-aTg.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as i}from"../chunks/chunk-CJvpbNqo.js";/* empty css                      */import{C as c}from"../chunks/chunk-BLfhGi7M.js";/* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-DuyKlQcD.js";/* empty css                      */const o=[{pageSectionId:"partial",pageSectionLevel:2,pageSectionTitle:"`partial`"},{pageSectionId:"redirects",pageSectionLevel:2,pageSectionTitle:"`redirects`"},{pageSectionId:"noextradir",pageSectionLevel:2,pageSectionTitle:"`noExtraDir`"},{pageSectionId:"parallel",pageSectionLevel:2,pageSectionTitle:"`parallel`"},{pageSectionId:"disableautorun",pageSectionLevel:2,pageSectionTitle:"`disableAutoRun`"},{pageSectionId:"enable",pageSectionLevel:2,pageSectionTitle:"`enable`"},{pageSectionId:"keepdistserver",pageSectionLevel:2,pageSectionTitle:"`keepDistServer`"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function a(l){const n={a:"a",blockquote:"blockquote",code:"code",div:"div",em:"em",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...i(),...l.components},{ChoiceGroup:r}=n;return r||p("ChoiceGroup"),e.jsxs(e.Fragment,{children:[e.jsx(c,{env:"config (build)",global:null,children:e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light","ts-only":"true","hide-menu":"true",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Toggle pre-rendering (globally, or per page)"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"type"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" PageSetting"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#005CC5"},children:" boolean"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"type"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" GlobalSetting"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" PageSetting"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" |"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Allow only some pages to be pre-rendered"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#E36209"},children:"  partial"}),e.jsx(n.span,{style:{color:"#D73A49"},children:"?:"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" boolean"}),e.jsx(n.span,{style:{color:"#6A737D"},children:" // Default: `false`"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Whether +redirects should be pre-rendered to redirecting HTML documents"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#E36209"},children:"  redirects"}),e.jsx(n.span,{style:{color:"#D73A49"},children:"?:"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" boolean"}),e.jsx(n.span,{style:{color:"#6A737D"},children:" // Default: `true` if all pages are pre-rendered"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Don't create a new directory for each HTML file"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#E36209"},children:"  noExtraDir"}),e.jsx(n.span,{style:{color:"#D73A49"},children:"?:"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" boolean"}),e.jsx(n.span,{style:{color:"#6A737D"},children:" // Default: `false`"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Number of concurrent pre-render jobs"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#E36209"},children:"  parallel"}),e.jsx(n.span,{style:{color:"#D73A49"},children:"?:"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" boolean"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" |"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" number"}),e.jsx(n.span,{style:{color:"#6A737D"},children:" // Default: `os.cpus.length` (number of CPUs)"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Don't automatically run the pre-rendering process upon `$ vike build`"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#E36209"},children:"  disableAutoRun"}),e.jsx(n.span,{style:{color:"#D73A49"},children:"?:"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" boolean"}),e.jsx(n.span,{style:{color:"#6A737D"},children:" // Default: `false`"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Change settings without enabling pre-rendering"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#E36209"},children:"  enable"}),e.jsx(n.span,{style:{color:"#D73A49"},children:"?:"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" null"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" |"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" boolean"}),e.jsx(n.span,{style:{color:"#6A737D"},children:" // Default: `true`"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Don't remove dist/server/"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#E36209"},children:"  keepDistServer"}),e.jsx(n.span,{style:{color:"#D73A49"},children:"?:"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" boolean"}),e.jsx(n.span,{style:{color:"#6A737D"},children:" // Default: `false` if all pages are pre-rendered"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+prerender.js"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"type"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" PrerenderConfigGlobal"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" GlobalSetting"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" |"}),e.jsx(n.span,{style:{color:"#24292E"},children:" (() "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" GlobalSetting"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" |"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Promise"}),e.jsx(n.span,{style:{color:"#24292E"},children:"<"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"GlobalSetting"}),e.jsx(n.span,{style:{color:"#24292E"},children:">)"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/some-page/+prerender.js"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"type"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" PrerenderConfigPage"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" PageSetting"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" |"}),e.jsx(n.span,{style:{color:"#24292E"},children:" (() "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" PageSetting"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" |"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Promise"}),e.jsx(n.span,{style:{color:"#24292E"},children:"<"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"PageSetting"}),e.jsx(n.span,{style:{color:"#24292E"},children:">)"})]})]})})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(s,{href:"/pre-rendering"})," explains what pre-rendering is and how to use it."]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"Note that:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Global settings (",e.jsx(n.code,{children:"GlobalSetting"})," above) must be defined in a global config file."]}),`
`,e.jsxs(n.li,{children:["Page settings (",e.jsx(n.code,{children:"PageSetting"})," above) can be defined in a page config file."]}),`
`]}),`
`,e.jsxs(r,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(n.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// 👉 Page config file"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/movies/@id/+config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // ❌ Global settings cannot be defined here"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  prerender: { parallel: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"false"}),e.jsx(n.span,{style:{color:"#24292E"},children:" },"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // ✅ Can be define here (toggle per page)"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(n.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// 👉 Page config file"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/movies/@id/+config.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // ❌ Global settings cannot be defined here"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  prerender: { parallel: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"false"}),e.jsx(n.span,{style:{color:"#24292E"},children:" },"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // ✅ Can be define here (toggle per page)"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"} "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsxs(r,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(n.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// 👉 Global config file (i.e. applies to all pages)"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // ✅ Global settings can be define here"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  prerender: { parallel: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"false"}),e.jsx(n.span,{style:{color:"#24292E"},children:" },"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // ✅ Can also be define here (toggle globally)"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(n.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// 👉 Global config file (i.e. applies to all pages)"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // ✅ Global settings can be define here"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  prerender: { parallel: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"false"}),e.jsx(n.span,{style:{color:"#24292E"},children:" },"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // ✅ Can also be define here (toggle globally)"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"} "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsx(n.p,{children:"See also:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/config#inheritance"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/config#global"}),`
`]}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"partial",children:e.jsx("code",{children:"partial"})}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"boolean"})," (default: ",e.jsx(n.code,{children:"false"}),")"]}),`
`,e.jsx(n.p,{children:"Stop showing a warning when pages cannot be pre-rendered."}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Vike shows a warning when a page has a parameterized route (e.g. ",e.jsx(s,{text:"Route String",href:"/route-string"})," ",e.jsx(n.code,{children:"/movie/@movieId"}),") while there isn't any ",e.jsx(s,{text:e.jsxs(e.Fragment,{children:[e.jsx(n.code,{children:"onBeforePrerenderStart()"})," hook"]}),href:"/onBeforePrerenderStart"})," that provides at least one URL matching the page's route (e.g. ",e.jsx(n.code,{children:"/movie/42"}),`).
This setting doesn't affect the pre-rendering process: it only suppresses the warning.`]}),`
`]}),`
`,e.jsxs(n.p,{children:["Alternatively, set ",e.jsx(n.code,{children:"+prerender"})," to ",e.jsx(n.code,{children:"false"})," for the pages that cannot be pre-rendered — this also suppresses the warning. See ",e.jsx(s,{href:"/pre-rendering#partial"}),"."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["As explained in ",e.jsx(s,{href:"/pre-rendering"}),", if you don't pre-render ",e.jsx(n.em,{children:"all"})," your pages then you need a production server."]}),`
`,e.jsxs(n.p,{children:["That said, if you cannot or don't want to pre-render all your pages while still deploying to a ",e.jsx(s,{href:"/static-hosts",children:"static host"}),", then see the workaround at ",e.jsx(n.a,{href:"https://github.com/vikejs/vike/issues/1476",children:"#1476 - Pre-rendered dynamic routes (static host deployment)"}),"."]}),`
`,e.jsxs(n.p,{children:["With ",e.jsx(s,{text:e.jsx(n.code,{children:"vite-plugin-vercel"}),href:"/vercel#vite-plugin-vercel"}),", you can statically deploy your pre-rendered pages while using a production server for your non-pre-rendered pages."]}),`
`]}),`
`,e.jsx("h2",{id:"redirects",children:e.jsx("code",{children:"redirects"})}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"boolean"})," (default: ",e.jsx(n.code,{children:"true"})," if your app is fully-prerendered)"]}),`
`,e.jsxs(n.p,{children:["Whether ",e.jsx(s,{href:"/redirects",children:e.jsx(n.code,{children:"+redirects"})})," should be pre-rendered to following HTML:"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"html","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"html","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"<!-- HTML redirecting user to /some/path -->"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"<"}),e.jsx(n.span,{style:{color:"#22863A"},children:"html"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"<"}),e.jsx(n.span,{style:{color:"#22863A"},children:"head"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  <!-- Tell browser to redirect user -->"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  <"}),e.jsx(n.span,{style:{color:"#22863A"},children:"meta"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" http-equiv"}),e.jsx(n.span,{style:{color:"#24292E"},children:"="}),e.jsx(n.span,{style:{color:"#032F62"},children:'"refresh"'}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" content"}),e.jsx(n.span,{style:{color:"#24292E"},children:"="}),e.jsx(n.span,{style:{color:"#032F62"},children:'"0;url=/some/path"'}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"</"}),e.jsx(n.span,{style:{color:"#22863A"},children:"head"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"<"}),e.jsx(n.span,{style:{color:"#22863A"},children:"body"}),e.jsx(n.span,{style:{color:"#24292E"},children:"></"}),e.jsx(n.span,{style:{color:"#22863A"},children:"body"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"</"}),e.jsx(n.span,{style:{color:"#22863A"},children:"html"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]})]})})}),`
`,e.jsx("h2",{id:"noextradir",children:e.jsx("code",{children:"noExtraDir"})}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"boolean"})," (default: ",e.jsx(n.code,{children:"false"}),")"]}),`
`,e.jsx(n.p,{children:"Don't create a new directory for each HTML file."}),`
`,e.jsxs(n.p,{children:["For example, generate ",e.jsx(n.code,{children:"dist/client/about.html"})," instead of ",e.jsx(n.code,{children:"dist/client/about/index.html"}),"."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:`Generating a directory for each HTML file is the most reliable way for telling Static Hosts the static URL of each static HTML.
But some static hosts prefer the other way.`}),`
`]}),`
`,e.jsx("h2",{id:"parallel",children:e.jsx("code",{children:"parallel"})}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"boolean | number"})," (default: ",e.jsx(n.a,{href:"https://nodejs.org/api/os.html#os_os_cpus",children:e.jsx(n.code,{children:"os.cpus().length"})}),")"]}),`
`,e.jsx(n.p,{children:"Number of concurrent pre-render jobs."}),`
`,e.jsxs(n.p,{children:["Set to ",e.jsx(n.code,{children:"false"})," (or ",e.jsx(n.code,{children:"1"}),") to disable concurrency."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"The default value is the fastest, but it may induce high spikes of memory usage."}),`
`,e.jsx(n.p,{children:"Disable concurrency if:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["You encounter ",e.jsx(n.code,{children:"JavaScript heap out of memory"})," errors."]}),`
`,e.jsx(n.li,{children:"If pre-rendering takes an abnormal high amount of time. (Caused by the very slow process of memory swapping that kicks-in when memory starts to saturate)."}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"disableautorun",children:e.jsx("code",{children:"disableAutoRun"})}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"boolean"})," (default: ",e.jsx(n.code,{children:"false"}),")"]}),`
`,e.jsxs(n.p,{children:["When running ",e.jsx(n.code,{children:"$ vike build"}),", Vike automatically triggers ",e.jsx(s,{href:"/pre-rendering",children:"pre-rendering"}),". (If you ",e.jsx(s,{text:"enabled it",href:"/pre-rendering#get-started"}),".)"]}),`
`,e.jsx(n.p,{children:"You can disable the automatic triggering:"}),`
`,e.jsxs(r,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(n.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  prerender: {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // Stop `$ vike build` from initiating pre-rendering"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"    disableAutoRun: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"true"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(n.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  prerender: {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // Stop `$ vike build` from initiating pre-rendering"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"    disableAutoRun: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"true"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"} "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsx(n.p,{children:"You can then manually trigger pre-rendering using:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/cli"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/api#prerender",doNotInferSectionTitle:!0}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"enable",children:e.jsx("code",{children:"enable"})}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"boolean | null"})," (default: ",e.jsx(n.code,{children:"true"}),")"]}),`
`,e.jsxs(n.p,{children:["When you set ",e.jsx(n.code,{children:"prerender"})," to an object then you also enable pre-rendering. In other words:"]}),`
`,e.jsxs(r,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(n.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Setting it to an empty object:"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  prerender: {},"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Is equivalent to:"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"true"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(n.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Setting it to an empty object:"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  prerender: {},"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Is equivalent to:"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"true"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"} "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsxs(n.p,{children:["By setting ",e.jsx(n.code,{children:"prerender.enable"})," to ",e.jsx(n.code,{children:"null"})," you opt-out from this. In other words:"]}),`
`,e.jsxs(r,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(n.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // This:"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  prerender: { enable: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"null"}),e.jsx(n.span,{style:{color:"#24292E"},children:" },"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Is equivalent to:"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"null"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(n.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // This:"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  prerender: { enable: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"null"}),e.jsx(n.span,{style:{color:"#24292E"},children:" },"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Is equivalent to:"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"null"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"} "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsx(n.p,{children:"This is useful, for example, if you want pre-rendering to stay opt-in instead of opt-out while setting pre-render settings globally."}),`
`,e.jsxs(n.p,{children:["It's also often used by ",e.jsx(s,{href:"/extensions",children:"Vike extensions"})," to change pre-rendering settings without enabling pre-rendering on behalf of the user."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// node_modules/some-vike-extension/+config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  prerender: {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // Change pre-rendering setting:"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"    partial: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // Without enabling pre-rendering:"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"    enable: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"null"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h2",{id:"keepdistserver",children:e.jsx("code",{children:"keepDistServer"})}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"boolean"})," (default: ",e.jsx(n.code,{children:"false"})," if your app is fully-prerendered)"]}),`
`,e.jsxs(n.p,{children:["If you pre-render all your pages (i.e. you didn't set ",e.jsx(s,{href:"#partial",children:e.jsx(n.code,{children:"partial"})})," to ",e.jsx(n.code,{children:"true"}),") then Vike removes the ",e.jsx(n.code,{children:"dist/server/"})," directory (or ",e.jsx(n.code,{children:"path.join(build.outDir, 'server/')"})," if you changed ",e.jsx(n.a,{href:"https://vitejs.dev/config/build-options.html#build-outdir",children:e.jsx(n.code,{children:"build.outDir"})}),") after pre-rendering has finished."]}),`
`,e.jsxs(n.p,{children:["If you set ",e.jsx(n.code,{children:"prerender.keepDistServer"})," to ",e.jsx(n.code,{children:"true"})," then Vike doesn't remove the ",e.jsx(n.code,{children:"dist/server/"})," directory."]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/pre-rendering"}),`
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
`,e.jsx(s,{href:"/ssr"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/stream"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/streaming"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/settings"}),`
`]}),`
`]})]})}function h(l={}){const{wrapper:n}={...i(),...l.components};return n?e.jsx(n,{...l,children:e.jsx(a,{...l})}):a(l)}function p(l,n){throw new Error("Expected component `"+l+"` to be defined: you likely forgot to import, pass, or provide it.")}const x=Object.freeze(Object.defineProperty({__proto__:null,default:h,pageSectionsExport:o},Symbol.toStringTag,{value:"Module"})),L={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:d}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:t}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/prerender/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:x}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{L as configValuesSerialized};
