import{o as t,a as o}from"../chunks/chunk-CxIOOiKX.js";import{j as e}from"../chunks/chunk-B35a6FX-.js";import{L as a}from"../chunks/chunk-BbfG-aTg.js";/* empty css                      *//* empty css                      *//* empty css                      */import{F as i,a as r}from"../chunks/chunk--yGbUSu9.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as c}from"../chunks/chunk-CJvpbNqo.js";/* empty css                      *//* empty css                      *//* empty css                      */const h=[{pageSectionId:"main-migration",pageSectionLevel:2,pageSectionTitle:"Main migration"},{pageSectionId:"examples",pageSectionLevel:2,pageSectionTitle:"Examples"},{pageSectionId:"migration-scripts",pageSectionLevel:2,pageSectionTitle:"Migration scripts"},{pageSectionId:"renamed-hooks",pageSectionLevel:2,pageSectionTitle:"Renamed hooks"},{pageSectionId:"custom-hooks-exports",pageSectionLevel:2,pageSectionTitle:"Custom hooks/exports"},{pageSectionId:"onbeforerender-in-page-js",pageSectionLevel:2,pageSectionTitle:"`onBeforeRender` in `.page.js`"},{pageSectionId:"client-init-code",pageSectionLevel:2,pageSectionTitle:"Client init code"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function d(l){const s={a:"a",blockquote:"blockquote",code:"code",div:"div",em:"em",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...c(),...l.components},{ChoiceGroup:n}=s;return n||x("ChoiceGroup"),e.jsxs(e.Fragment,{children:[e.jsxs(s.p,{children:["Despite being a simple change, the V1 design introduces new foundational capabilities. If you're curious: ",e.jsx(a,{href:"/why-the-v1-design"})]}),`
`,e.jsxs(s.p,{children:["The overall architecture stays the same: the V1 design is mostly about replacing ",e.jsx(s.code,{children:".page.js"})," files with so-called ",e.jsx(s.em,{children:"plus files"}),": ",e.jsx(s.code,{children:"+Page.js"}),", ",e.jsx(s.code,{children:"+route.js"}),", ",e.jsx(s.code,{children:"+onBeforeRender.js"}),", ..."]}),`
`,e.jsx(s.p,{children:"The migration is straightforward and usually quick to implement. We encourage you to migrate sooner rather than later."}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"Don't hesitate to reach out if you run into any issue."}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"The old design is still supported but we recommend to migrate as the docs now showcase the V1 design."}),`
`]}),`
`,e.jsx("h2",{id:"main-migration",children:"Main migration"}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"Make sure to update Vike to its latest version."}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"You need to either fully use the V1 design, or fully use the old design. You cannot mix both."}),`
`]}),`
`,e.jsx(s.p,{children:"Most of the migration boils down to the following two steps."}),`
`,e.jsx(s.p,{children:e.jsxs(s.strong,{children:["1. Migrate ",e.jsx(s.code,{children:"/renderer/*.page.*"})]})}),`
`,e.jsxs(s.p,{children:["Move your ",e.jsx(s.code,{children:"renderer/"})," hooks to ",e.jsx(s.code,{children:"+"})," files:"]}),`
`,e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{className:"diff remove","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/_default.page.client.js"})}),`
`,e.jsx(s.span,{className:"diff add","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/+onRenderClient.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{className:"diff remove","data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { render } "})]}),`
`,e.jsxs(s.span,{className:"diff add","data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { render "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"as"}),e.jsx(s.span,{style:{color:"#24292E"},children:" onRenderClient } "})]})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{className:"diff remove","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/_default.page.client.ts"})}),`
`,e.jsx(s.span,{className:"diff add","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/+onRenderClient.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{className:"diff remove","data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { render } "})]}),`
`,e.jsxs(s.span,{className:"diff add","data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { render "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"as"}),e.jsx(s.span,{style:{color:"#24292E"},children:" onRenderClient } "})]})]})})})})]}),`
`,e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{className:"diff remove","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/_default.page.server.js"})}),`
`,e.jsx(s.span,{className:"diff add","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/+onRenderHtml.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{className:"diff remove","data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { render } "})]}),`
`,e.jsxs(s.span,{className:"diff add","data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { render "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"as"}),e.jsx(s.span,{style:{color:"#24292E"},children:" onRenderHtml } "})]})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{className:"diff remove","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/_default.page.server.ts"})}),`
`,e.jsx(s.span,{className:"diff add","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/+onRenderHtml.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{className:"diff remove","data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { render } "})]}),`
`,e.jsxs(s.span,{className:"diff add","data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { render "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"as"}),e.jsx(s.span,{style:{color:"#24292E"},children:" onRenderHtml } "})]})]})})})})]}),`
`,e.jsxs(s.p,{children:["If you've defined a global ",e.jsx(s.code,{children:"onBeforeRender()"})," hook and/or ",e.jsx(s.code,{children:"passToClient"}),":"]}),`
`,e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{className:"diff remove","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/_default.page.server.js"})}),`
`,e.jsx(s.span,{className:"diff add","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/+onBeforeRender.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { onBeforeRender }"})]}),`
`,e.jsxs(s.span,{className:"diff remove","data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" passToClient"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" ["}),e.jsx(s.span,{style:{color:"#032F62"},children:"'pageProps'"}),e.jsx(s.span,{style:{color:"#24292E"},children:"] "})]})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{className:"diff remove","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/_default.page.server.ts"})}),`
`,e.jsx(s.span,{className:"diff add","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/+onBeforeRender.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { onBeforeRender }"})]}),`
`,e.jsxs(s.span,{className:"diff remove","data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" passToClient"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" ["}),e.jsx(s.span,{style:{color:"#032F62"},children:"'pageProps'"}),e.jsx(s.span,{style:{color:"#24292E"},children:"] "})]})]})})})})]}),`
`,e.jsx(i,{children:e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  passToClient: ["}),e.jsx(s.span,{style:{color:"#032F62"},children:"'pageProps'"}),e.jsx(s.span,{style:{color:"#24292E"},children:"]"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  passToClient: ["}),e.jsx(s.span,{style:{color:"#032F62"},children:"'pageProps'"}),e.jsx(s.span,{style:{color:"#24292E"},children:"]"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["See ",e.jsx(a,{href:"/config"})," for more information about what ",e.jsx(s.code,{children:"+"})," and ",e.jsx(s.code,{children:".h.js"})," means."]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["The suffixes such as ",e.jsx(s.code,{children:".page.server.js"})," and ",e.jsx(s.code,{children:".page.client.js"})," don't exist anymore. After the feature request ",e.jsx(s.a,{href:"https://github.com/vikejs/vike/issues/744",children:"#744"})," is implemented, you'll be able to use ",e.jsx(s.code,{children:".server.js"})," and ",e.jsx(s.code,{children:".client.js"})," suffixes again but note that they'll serve another purpose."]}),`
`]}),`
`,e.jsxs(s.p,{children:["Move ",e.jsx(s.code,{children:"/renderer/"})," configurations to ",e.jsx(s.code,{children:"/renderer/+config.js"}),":"]}),`
`,e.jsx(r,{children:e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/_default.page.client.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { clientRouting }"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { hydrationCanBeAborted }"})]})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/_default.page.client.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { clientRouting }"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { hydrationCanBeAborted }"})]})]})})})})]})}),`
`,e.jsx(i,{children:e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  clientRouting: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  hydrationCanBeAborted: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  clientRouting: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  hydrationCanBeAborted: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]})}),`
`,e.jsx(s.p,{children:"Move your error page (if you defined one):"}),`
`,e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{className:"diff remove","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/_error.page.js"})}),`
`,e.jsx(s.span,{className:"diff add","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/_error/+Page.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Page }"})]})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{className:"diff remove","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/_error.page.ts"})}),`
`,e.jsx(s.span,{className:"diff add","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/_error/+Page.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Page }"})]})]})})})})]}),`
`,e.jsx(s.p,{children:e.jsxs(s.strong,{children:["2. Migrate ",e.jsx(s.code,{children:"/pages/**/*.page.*"})]})}),`
`,e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{className:"diff remove","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/some-page/index.page.js"})}),`
`,e.jsx(s.span,{className:"diff add","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/some-page/+Page.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Page }"})]})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{className:"diff remove","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/some-page/index.page.ts"})}),`
`,e.jsx(s.span,{className:"diff add","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/some-page/+Page.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Page }"})]})]})})})})]}),`
`,e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{className:"diff remove","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/some-page/index.page.server.js"})}),`
`,e.jsx(s.span,{className:"diff add","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/some-page/+onBeforeRender.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { onBeforeRender }"})]})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{className:"diff remove","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/some-page/index.page.server.ts"})}),`
`,e.jsx(s.span,{className:"diff add","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/some-page/+onBeforeRender.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { onBeforeRender }"})]})]})})})})]}),`
`,e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{className:"diff remove","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/some-page/index.page.route.js"})}),`
`,e.jsx(s.span,{className:"diff add","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/some-page/+route.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" route"})]})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{className:"diff remove","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/some-page/index.page.route.ts"})}),`
`,e.jsx(s.span,{className:"diff add","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/some-page/+route.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" route"})]})]})})})})]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"Each page now lives in its own directory."}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"yaml","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"yaml","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# ✅ V1 design"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"$ ls pages/**/*"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"/pages/some-page/+Page.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"/pages/some-other-page/+Page.js"})})]})})}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"yaml","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"yaml","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# ❌ This isn't possible anymore: each page now needs to create a new directory"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"$ ls pages/**/*"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"/pages/some.page.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"/pages/some-other.page.js"})})]})})}),`
`]}),`
`,e.jsx(s.p,{children:"Apply following additional steps if you've defined:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(a,{href:"#renamed-hooks"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(a,{text:"Custom hooks/exports",href:"#custom-hooks-exports"}),`
`]}),`
`,e.jsxs(s.li,{children:[e.jsxs(s.a,{href:"#onbeforerender-in-page-js",children:[e.jsx(s.code,{children:"onBeforeRender"})," in ",e.jsx(s.code,{children:".page.js"})]})," (instead of ",e.jsx(s.code,{children:".page.server.js"}),")"]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(a,{href:"#client-init-code"}),`
`]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["If you have many ",e.jsx(s.code,{children:"/pages/**/*.page.js"})," files then see ",e.jsx(a,{href:"#migration-scripts"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"examples",children:"Examples"}),`
`,e.jsxs(s.p,{children:["All official examples have been migrated, see ",e.jsx(s.a,{href:"https://github.com/vikejs/vike/tree/main/examples",children:e.jsx(s.code,{children:"examples/*"})}),"."]}),`
`,e.jsx(s.p,{children:"Notable migrations:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Basic apps:",`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/vikejs/vike/commit/428c1c6b0fb7c9a5fa2f2fe57ac3e4bb0a57ea54",children:"migrate /examples/react"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/vikejs/vike/commit/b87e6dc85462d74f16fdfd0eb4dee1c2c8d29325",children:"migrate /examples/vue"})}),`
`]}),`
`]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"onBeforeRender()"})," hook:",`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Defined by page in ",e.jsx(s.code,{children:"pages/"}),":",`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/vikejs/vike/commit/bfcd801419acd18c676b49d835c805ef6e89a607#diff-41adf2b043a30483759686ad913c5dba5dc4d0594d45913cf5a504f2205ce8a4",children:"migrate /examples/telefunc"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/vikejs/vike/commit/9dd3db3bb6f0c1fc16befa9f504e94ea732339e8#diff-c4d06dd7331553f9855baa90f752a40b51c379631574135f38e50c9da40fa1ee",children:"migrate /examples/i18n"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/vikejs/vike/commit/b612023a6b209424a75aacb2fde9b2305c44f3ee#diff-cad2d8171bf407df47ce02bd4110bd010a2beecf7e5f52e43892fba7c4c1123b",children:"migrate /examples/vue-full"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/vikejs/vike/commit/8e71e27802b1990fae360b4ce01935e12fc09237#diff-793fcad526e46c52916bab033cd16d35f05e1a6f18e4e43b45b3a28b8ba34f59",children:"migrate /examples/react-full"})}),`
`]}),`
`]}),`
`,e.jsxs(s.li,{children:["Defined globally in ",e.jsx(s.code,{children:"renderer/"}),":",`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/vikejs/vike/commit/69c06b03c5ce5199147eb0f2e574c626038d18a7#diff-a7cdea11336cb81f500e3509f6c26587c6cc765cc438e61760f1e89eeea6817a",children:"migrate /examples/redux"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/vikejs/vike/commit/aa2055f731f2ed8fc4f8763edcdc1f76ced7d061#diff-231c5dd641627a629961695a7502a3ac28cb782e48e6cb386aadd8d84b43c45d",children:"migrate /examples/graphql-apollo-vue/"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/vikejs/vike/commit/2b830d0db9a9cd2cb9b4402a00887cd840a16eda#diff-4324476edca4f275a3fcab4e7022e86df396235bdbb5f6632b5332c192e1acec",children:"migrate /examples/vue-pinia"})}),`
`]}),`
`]}),`
`]}),`
`]}),`
`,e.jsxs(s.li,{children:["Pre-rendered app (that uses ",e.jsx(s.code,{children:"prerender()"})," hooks):",`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/vikejs/vike/commit/8e71e27802b1990fae360b4ce01935e12fc09237#diff-4f57f0b913952581bf391a9cde442cb1e9f3e2a8e9b06d213fe1b450d58450f3",children:"migrate /examples/react-full"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/vikejs/vike/commit/b612023a6b209424a75aacb2fde9b2305c44f3ee#diff-a2b72a140b77af0c45a8692a277e3b5199a502249a43715af04d3255f23e6e37",children:"migrate /examples/vue-full"})}),`
`]}),`
`]}),`
`,e.jsxs(s.li,{children:["Custom exports to custom configs (see migration explanation at ",e.jsx(a,{href:"#custom-hooks-exports",doNotInferSectionTitle:!0}),"):",`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"pageContext.exports.documentProps"})," -> ",e.jsx(s.code,{children:"pageContext.config.title"}),":",`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/vikejs/vike/commit/b612023a6b209424a75aacb2fde9b2305c44f3ee#diff-a6e5f41440d58640eb9657abe90cedf2f41b01e34cd9d4dfc51d5c2757a85050",children:"migrate /examples/vue-full"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/vikejs/vike/commit/8e71e27802b1990fae360b4ce01935e12fc09237#diff-cef88db49c9c381b7c787a9ea464c4b9803253a51e0af23ba3fb78d4f50f970d",children:"migrate /examples/react-full"})}),`
`]}),`
`]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"pageContext.exports.Layout"})," -> ",e.jsx(s.code,{children:"pageContext.config.Layout"}),":",`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/vikejs/vike/commit/9b31b7497510d4add7c0e4aa4f19675b2f37fa94#diff-366cb44a235f430b996e8cfb4a0e2a65388e9ea23caf635363ee87e56666d52eL9-R9",children:"migrate /examples/layouts-react"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/vikejs/vike/commit/499ee0184c4a6331e399ded299f413fc1d1a46e3#diff-056c4a494c1d68ae12d195e6d2f050d6f205b50cfe3efde4703a2755da3e37c6L15-R16",children:"migrate /examples/layouts-vue"})}),`
`]}),`
`]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"pageContext.exports.preloadStrategy"})," -> ",e.jsx(s.code,{children:"pageContext.config.preloadStrategy"}),":",`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/vikejs/vike/commit/f28880b0b85cde12647aa0613c99dbdeadc467de#diff-f1f3a4c9f73f2c7ee1444e278cf4c6115efbee1cc294649e8f5a2a05a593f18dL15-R12",children:"migrate /examples/custom-preload"})}),`
`]}),`
`]}),`
`]}),`
`]}),`
`,e.jsxs(s.li,{children:["i18n (pre-rendered) app (that uses hooks ",e.jsx(s.code,{children:"onBeforeRoute()"}),", ",e.jsx(s.code,{children:"onBeforePrerender()"}),", ",e.jsx(s.code,{children:"prerender()"}),"):",`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/vikejs/vike/commit/9dd3db3bb6f0c1fc16befa9f504e94ea732339e8#diff-50a58ddbb03951878eebb954f765ff2406b04dad278c69c9ce03d9bff567ad76",children:"migrate /examples/i18n"})}),`
`]}),`
`]}),`
`,e.jsxs(s.li,{children:["Domain-driven file structure (that uses ",e.jsx(s.code,{children:"filesystemRoutingRoot"}),")",`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/vikejs/vike/commit/09c47412f94af825c0b48ad4553a42e6896363b3#diff-fb554213bca0ce54bf15ec3d058d4a214ec35fc797bda13ed877d767244b875bL1",children:"migrate /examples/file-structure-domain-driven/"})}),`
`]}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"migration-scripts",children:"Migration scripts"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Basic starting point: ",e.jsx(s.a,{href:"https://gist.github.com/brillout/ca4d166415704d2545eb5241bca8d76d",children:"v1-design-migration.js"})]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"PR welcome to add your migration script."}),`
`]}),`
`,e.jsx("h2",{id:"renamed-hooks",children:"Renamed hooks"}),`
`,e.jsxs(s.table,{children:[e.jsx(s.thead,{children:e.jsxs(s.tr,{children:[e.jsx(s.th,{children:"Old name"}),e.jsx(s.th,{children:"New name"})]})}),e.jsxs(s.tbody,{children:[e.jsxs(s.tr,{children:[e.jsxs(s.td,{children:[e.jsx(s.code,{children:"render()"})," in ",e.jsx(s.code,{children:".page.client.js"})]}),e.jsx(s.td,{children:e.jsx(s.code,{children:"onRenderClient()"})})]}),e.jsxs(s.tr,{children:[e.jsxs(s.td,{children:[e.jsx(s.code,{children:"render()"})," in ",e.jsx(s.code,{children:".page.server.js"})]}),e.jsx(s.td,{children:e.jsx(s.code,{children:"onRenderHtml()"})})]}),e.jsxs(s.tr,{children:[e.jsx(s.td,{children:e.jsx(s.code,{children:"prerender()"})}),e.jsx(s.td,{children:e.jsx(s.code,{children:"onBeforePrerenderStart()"})})]}),e.jsxs(s.tr,{children:[e.jsx(s.td,{children:e.jsx(s.code,{children:"onBeforePrerender()"})}),e.jsx(s.td,{children:e.jsx(s.code,{children:"onPrerenderStart()"})})]})]})]}),`
`,e.jsx(s.p,{children:"The hooks are equivalent: they just have a new name."}),`
`,e.jsxs(s.p,{children:["Also note that ",e.jsx(s.code,{children:"doNotPrerender"})," has been renamed:"]}),`
`,e.jsxs(s.table,{children:[e.jsx(s.thead,{children:e.jsxs(s.tr,{children:[e.jsx(s.th,{children:"Old name"}),e.jsx(s.th,{children:"New name"})]})}),e.jsx(s.tbody,{children:e.jsxs(s.tr,{children:[e.jsx(s.td,{children:e.jsx(s.code,{children:"doNotPrerender: true"})}),e.jsx(s.td,{children:e.jsx(s.code,{children:"prerender: false"})})]})})]}),`
`,e.jsx(r,{children:e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",hide:!0,children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/news.page.server.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" doNotPrerender"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#005CC5"},children:" true"})]})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/news.page.server.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" doNotPrerender"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#005CC5"},children:" true"})]})]})})})})]})}),`
`,e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/news/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{className:"diff add","data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/news/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{className:"diff add","data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsx("h2",{id:"custom-hooks-exports",children:"Custom hooks/exports"}),`
`,e.jsxs(s.p,{children:["If you use ",e.jsx(s.a,{href:"https://vite-plugin-ssr.com/exports",children:"custom hooks/exports"}),", then replace them with custom hooks/settings."]}),`
`,e.jsxs(s.p,{children:["You can create your own hooks and settings by using ",e.jsx(s.code,{children:"meta"}),":"]}),`
`,e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  meta: {"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // We create a new setting called `title`"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    title: {"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"      // The value of `title` should be loaded only on the server"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      env: { server: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  meta: {"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // We create a new setting called `title`"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    title: {"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"      // The value of `title` should be loaded only on the server"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      env: { server: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/+onRenderHtml.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { onRenderHtml }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" onRenderHtml"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Config values are available at pageContext.config"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"title"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" pageContext.config"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" escapeInject"}),e.jsx(s.span,{style:{color:"#032F62"},children:"`<html>"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"    <head>"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"      <title>${"}),e.jsx(s.span,{style:{color:"#24292E"},children:"title"}),e.jsx(s.span,{style:{color:"#032F62"},children:"}</title>"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"    </head>"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"    <!-- ... -->"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"  </html>`"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/+onRenderHtml.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { onRenderHtml }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { PageContextServer } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" onRenderHtml"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(s.span,{style:{color:"#D73A49"},children:":"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" PageContextServer"}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Config values are available at pageContext.config"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"title"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" pageContext.config"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" escapeInject"}),e.jsx(s.span,{style:{color:"#032F62"},children:"`<html>"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"    <head>"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"      <title>${"}),e.jsx(s.span,{style:{color:"#24292E"},children:"title"}),e.jsx(s.span,{style:{color:"#032F62"},children:"}</title>"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"    </head>"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"    <!-- ... -->"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"  </html>`"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})})]}),`
`,e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/about/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  title: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'Demo showcasing the V1 design'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/about/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  title: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'Demo showcasing the V1 design'"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsx(s.p,{children:"See:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(a,{href:"#examples"}),`
`]}),`
`,e.jsx(s.li,{children:e.jsxs(s.a,{href:"https://github.com/vikejs/vike/blob/43503a4829e4bb0171785bc8fa501c7ca096a150/examples/render-modes/renderer/+config.ts#L10-L24",children:["Advanced example of implementing ",e.jsx(s.code,{children:"config.renderMode"})]})}),`
`]}),`
`,e.jsxs("h2",{id:"onbeforerender-in-page-js",children:[e.jsx("code",{children:"onBeforeRender"})," in ",e.jsx("code",{children:".page.js"})]}),`
`,e.jsxs(s.p,{children:["If you've defined ",e.jsx(s.code,{children:"onBeforeRender()"})," hooks in ",e.jsx(s.code,{children:".page.js"})," (instead of ",e.jsx(s.code,{children:".page.server.js"}),"):"]}),`
`,e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  meta: {"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    onBeforeRender: {"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"      // We tell Vike to load and execute onBeforeRender()"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"      // not only on the server-side but also on the client-side."})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      env: { server: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:", client: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  meta: {"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    onBeforeRender: {"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"      // We tell Vike to load and execute onBeforeRender()"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"      // not only on the server-side but also on the client-side."})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      env: { server: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:", client: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsxs(s.p,{children:["For convenience, you can use ",e.jsx(a,{text:e.jsx(s.code,{children:"meta"}),href:"/meta"}),` in order to
`,e.jsxs(s.a,{href:"https://github.com/vikejs/vike/blob/43503a4829e4bb0171785bc8fa501c7ca096a150/examples/react-full/renderer/+config.ts#L14-L33",children:["create a new config ",e.jsx(s.code,{children:"dataIsomorph: boolean"})]}),` for a
`,e.jsx(s.a,{href:"https://github.com/vikejs/vike/blob/43503a4829e4bb0171785bc8fa501c7ca096a150/examples/react-full/pages/star-wars/@id/+dataIsomorph.ts",children:"page-per-page toggle"}),"."]}),`
`,e.jsx("h2",{id:"client-init-code",children:"Client init code"}),`
`,e.jsxs(s.p,{children:["The new config ",e.jsx(a,{text:e.jsx(s.code,{children:"client"}),href:"/client"})," allows you to define client-side initialization code."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["You can also keep using ",e.jsx(a,{text:e.jsx(s.code,{children:"onHydrationEnd()"}),href:"/onHydrationEnd"}),"."]}),`
`]}),`
`,e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// +config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  client: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'./some-client-code.js'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// +config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  client: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'./some-client-code.ts'"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",hide:!0,children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// some-client-code.js"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"console."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"log"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:`"I'm run when the client-side JavaScript is loaded."`}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// some-client-code.ts"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"console."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"log"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:`"I'm run when the client-side JavaScript is loaded."`}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]})]})})})})]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(a,{href:"/config"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(a,{href:"/meta"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(a,{href:"/client"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(a,{href:"/why-the-v1-design"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(a,{href:"/extensions"}),`
`]}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/vikejs/vike/issues/578",children:"#578 [RFC] V1 Design"})}),`
`]})]})}function p(l={}){const{wrapper:s}={...c(),...l.components};return s?e.jsx(s,{...l,children:e.jsx(d,{...l})}):d(l)}function x(l,s){throw new Error("Expected component `"+l+"` to be defined: you likely forgot to import, pass, or provide it.")}const j=Object.freeze(Object.defineProperty({__proto__:null,default:p,pageSectionsExport:h},Symbol.toStringTag,{value:"Module"})),I={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:t}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/migration/v1-design/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:j}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{I as configValuesSerialized};
