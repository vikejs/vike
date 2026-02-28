import{o as t,a as d}from"../chunks/chunk-CxIOOiKX.js";import{j as e}from"../chunks/chunk-B35a6FX-.js";import{L as l}from"../chunks/chunk-BbfG-aTg.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as i}from"../chunks/chunk-CJvpbNqo.js";/* empty css                      *//* empty css                      *//* empty css                      */const o=[{pageSectionId:"getpage",pageSectionLevel:2,pageSectionTitle:"`getPage()`"},{pageSectionId:"useclientrouter",pageSectionLevel:2,pageSectionTitle:"`useClientRouter()`"},{pageSectionId:"pre-render-cli",pageSectionLevel:2,pageSectionTitle:"Pre-render CLI"},{pageSectionId:"base-url",pageSectionLevel:2,pageSectionTitle:"Base URL"},{pageSectionId:"export-default-page",pageSectionLevel:2,pageSectionTitle:"`export default Page`"},{pageSectionId:"multiple-onbeforerender",pageSectionLevel:2,pageSectionTitle:"Multiple `onBeforeRender()`"}];function a(s){const n={a:"a",blockquote:"blockquote",code:"code",div:"div",figure:"figure",li:"li",ol:"ol",p:"p",pre:"pre",span:"span",...i(),...s.components},{ChoiceGroup:r}=n;return r||h("ChoiceGroup"),e.jsxs(e.Fragment,{children:[e.jsxs(n.p,{children:["Guide for migrating from ",e.jsx(n.code,{children:"0.3.x"})," to ",e.jsx(n.code,{children:"0.4.x"}),". See ",e.jsx(l,{href:"/migration"})," for other breaking updates."]}),`
`,e.jsxs(n.p,{children:["Most changes are non-breaking: follow the warnings to progressively update to the new ",e.jsx(n.code,{children:"0.4"})," interface."]}),`
`,e.jsx(n.p,{children:"Breaking changes:"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:["Use Vite ",e.jsx(n.code,{children:">=2.9.10"})," or Vite ",e.jsx(n.code,{children:">=3.0.0-beta.7"}),"."]}),`
`,e.jsxs(n.li,{children:[e.jsxs(n.a,{href:"#getpage",children:["Deprecated: ",e.jsx(n.code,{children:"getPage()"})," (Server Routing)"]}),"."]}),`
`,e.jsxs(n.li,{children:[e.jsxs(n.a,{href:"#useclientrouter",children:["Deprecated: ",e.jsx(n.code,{children:"useClientRouter()"})," (Client Routing)"]}),"."]}),`
`,e.jsxs(n.li,{children:[e.jsxs(n.a,{href:"#pre-render-cli",children:["Deprecated: pre-render CLI ",e.jsx(n.code,{children:"$ vike prerender"})]}),"."]}),`
`,e.jsxs(n.li,{children:[e.jsxs(n.a,{href:"#base-url",children:["Base URL options ",e.jsx(n.code,{children:"base"})," and ",e.jsx(n.code,{children:"baseAsset"})," are now defined as ",e.jsx(n.code,{children:"vite.config.js#base"})]}),"."]}),`
`,e.jsxs(n.li,{children:[e.jsxs(n.a,{href:"#export-default-page",children:[e.jsx(n.code,{children:"export default Page"})," deprecated: use ",e.jsx(n.code,{children:"export { Page }"})," instead"]}),"."]}),`
`,e.jsxs(n.li,{children:[e.jsxs(n.a,{href:"#multiple-onbeforerender",children:["Deprecated: Multiple ",e.jsx(n.code,{children:"onBeforeRender()"})," hooks"]}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"getpage",children:e.jsx("code",{children:"getPage()"})}),`
`,e.jsxs(n.p,{children:["If you use ",e.jsx(l,{href:"/server-routing",noBreadcrumb:!0}),":"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"diff","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"diff","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  // /renderer/_default.page.client.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#B31D28"},children:"- import { getPage } from 'vike/client'"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+ export { render }"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#B31D28"},children:"- const pageContext = await getPage()"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+ async function render(pageContext) {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+   /* ... */"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+ }"})})]})})}),`
`,e.jsx("h2",{id:"useclientrouter",children:e.jsx("code",{children:"useClientRouter()"})}),`
`,e.jsxs(n.p,{children:["If you use ",e.jsx(l,{href:"/client-routing",noBreadcrumb:!0}),":"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"diff","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"diff","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  // renderer/_default.page.client.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#B31D28"},children:"- import { useClientRouter } from 'vike/client'"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+ export { render }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+ export const clientRouting = true"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#B31D28"},children:"- useClientRouter({"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#B31D28"},children:"-   render: (pageContext) => {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#B31D28"},children:"-     /* ... */"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#B31D28"},children:"-   }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#B31D28"},children:"- })"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+ async function render(pageContext) {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+   /* ... */"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+ }"})})]})})}),`
`,e.jsxs(n.p,{children:["All ",e.jsx(n.code,{children:"useClientRouter()"})," options are now exports:"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// renderer/_default.page.client.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { render }"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { onHydrationEnd }"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { onPageTransitionStart }"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { onPageTransitionEnd }"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" prefetchStaticAssets"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#24292E"},children:" { when: "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'VIEWPORT'"}),e.jsx(n.span,{style:{color:"#24292E"},children:" } "}),e.jsx(n.span,{style:{color:"#6A737D"},children:"// (instead of `prefetchLinks`)"})]})]})})}),`
`,e.jsx("h2",{id:"pre-render-cli",children:"Pre-render CLI"}),`
`,e.jsxs(n.p,{children:["The pre-render CLI ",e.jsx(n.code,{children:"$ vike prerender"})," is deprecated in favor of setting the ",e.jsx(n.code,{children:"prerender"})," option to ",e.jsx(n.code,{children:"true"})," in ",e.jsx(n.code,{children:"vite.config.js"}),"."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"diff","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"diff","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#B31D28"},children:"- $ vite build && vike prerender"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+ $ vite build"})})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"diff","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"diff","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  // vite.config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  import vike from 'vike/plugin'"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  export config {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    plugins: ["})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#B31D28"},children:"-     vike()"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+     vike({ prerender: true })"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    ]"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["The CLI command ",e.jsx(n.code,{children:"$ vite build"})," will then automatically run the pre-rendering process."]}),`
`]}),`
`,e.jsxs(n.p,{children:["All pre-render options are now defined in ",e.jsx(n.code,{children:"vite.config.js"}),":"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"diff","data-theme":"github-light",children:e.jsx(n.code,{"data-language":"diff","data-theme":"github-light",style:{display:"grid"},children:e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#B31D28"},children:"- $ vike prerender --partial -- noExtraDir --root src/ --outDir build/ --parallel 1"})})})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"diff","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"diff","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  // vite.config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  import vike from 'vike/plugin'"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  export config {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+   root: 'src/',"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+   build: {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+     outDir: 'build/"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+   },"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    plugins: ["})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"      vike({"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+       prerender: {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+         partial: true,"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+         noExtraDir: true,"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+         parallel: 1 // Can be `number` or `boolean`"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+       }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"      })"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    ]"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})})]})})}),`
`,e.jsx("h2",{id:"base-url",children:"Base URL"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:["With ",e.jsx(n.code,{children:"0.3"}),", we defined ",e.jsx(n.code,{children:"base"})," in both ",e.jsx(n.code,{children:"createPageRenderer()"})," and ",e.jsx(n.code,{children:"vite.config.js"}),". With ",e.jsx(n.code,{children:"0.4"}),", we define it only in ",e.jsx(n.code,{children:"vite.config.js"}),"."]}),`
`,e.jsxs(n.li,{children:["The ",e.jsx(n.code,{children:"baseAsset"})," option is removed: set ",e.jsx(n.code,{children:"base"})," to an absolute URL instead. (A URL that starts with ",e.jsx(n.code,{children:"http://"})," or ",e.jsx(n.code,{children:"https://"}),".)"]}),`
`]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"diff","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"diff","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  // server.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#B31D28"},children:"- import { createPageRenderer } from 'vike'"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#B31D28"},children:"- const renderPage = createPageRenderer({ base })"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+ import { renderPage } from 'vike/server'"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+ // We don't need to set `base` here anymore."})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  const pageContext = await renderPage({ url })"})})]})})}),`
`,e.jsxs(r,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(n.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// vite.config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  base: "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'/some/base/url/'"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Or, if you used `baseAsset`:"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  base: "}),e.jsxs(n.span,{style:{color:"#032F62"},children:["'",e.jsx(n.a,{href:"https://cdn.example.org/",children:"https://cdn.example.org/"}),"'"]})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(n.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// vite.config.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { UserConfig } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vite'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  base: "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'/some/base/url/'"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Or, if you used `baseAsset`:"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  base: "}),e.jsxs(n.span,{style:{color:"#032F62"},children:["'",e.jsx(n.a,{href:"https://cdn.example.org/",children:"https://cdn.example.org/"}),"'"]})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"} "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" UserConfig"})]})]})})})})]}),`
`,e.jsx("h2",{id:"export-default-page",children:e.jsx("code",{children:"export default Page"})}),`
`,e.jsxs(n.p,{children:["Most users already ",e.jsx(n.code,{children:"export { Page }"})," in ",e.jsx(n.code,{children:".page.js"})," files, but some users use the default export instead (",e.jsx(n.code,{children:"export default Page"}),") which isn't supported anymore."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"diff","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"diff","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  // /pages/index.page.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#B31D28"},children:"- export default Page"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+ export { Page }"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  function Page() {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    /* ... */"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Single File Components (",e.jsx(n.code,{children:".vue"}),", ",e.jsx(n.code,{children:".svelte"}),", ...) still work."]}),`
`]}),`
`,e.jsxs("h2",{id:"multiple-onbeforerender",children:["Multiple ",e.jsx("code",{children:"onBeforeRender()"})]}),`
`,e.jsxs(n.p,{children:[e.jsx(l,{text:e.jsxs(e.Fragment,{children:["Multiple ",e.jsx(n.code,{children:"onBeforeRender()"})," hooks"]}),href:"/onBeforeRender-multiple"})," are deprecated in favor of ",e.jsx(l,{href:"/exports",text:"Custom Hooks/Exports"}),"."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Having one ",e.jsx(n.code,{children:"onBeforeRender()"})," hook per page is still supported and hasn't changed."]}),`
`]})]})}function c(s={}){const{wrapper:n}={...i(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(a,{...s})}):a(s)}function h(s,n){throw new Error("Expected component `"+s+"` to be defined: you likely forgot to import, pass, or provide it.")}const p=Object.freeze(Object.defineProperty({__proto__:null,default:c,pageSectionsExport:o},Symbol.toStringTag,{value:"Module"})),k={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:d}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:t}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/migration/0.4/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:p}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{k as configValuesSerialized};
