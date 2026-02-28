import{o as t,a as c}from"../chunks/chunk-CxIOOiKX.js";import{j as e}from"../chunks/chunk-B35a6FX-.js";import{L as s}from"../chunks/chunk-BbfG-aTg.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as a}from"../chunks/chunk-CJvpbNqo.js";import{U as d}from"../chunks/chunk-DuyKlQcD.js";/* empty css                      */import{b as o}from"../chunks/chunk-BLfhGi7M.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */const h=[{pageSectionId:"scaffold-new-vike-react-app",pageSectionLevel:2,pageSectionTitle:"Scaffold new `vike-react` app"},{pageSectionId:"add-vike-react-to-existing-vike-app",pageSectionLevel:2,pageSectionTitle:"Add `vike-react` to existing Vike app"},{pageSectionId:"under-the-hood",pageSectionLevel:2,pageSectionTitle:"Under the hood"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function l(i){const n={a:"a",blockquote:"blockquote",br:"br",code:"code",div:"div",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...a(),...i.components},{ChoiceGroup:r}=n;return r||j("ChoiceGroup"),e.jsxs(e.Fragment,{children:[e.jsx(o,{children:e.jsxs(n.p,{children:["Version history: ",e.jsx(n.a,{href:"https://github.com/vikejs/vike-react/blob/main/packages/vike-react/CHANGELOG.md",children:e.jsx(n.code,{children:"CHANGELOG.md"})}),e.jsx(n.br,{}),`
`,"Examples: ",e.jsx(s,{href:"/new",children:"vike.dev/new"})," and ",e.jsx(n.a,{href:"https://github.com/vikejs/vike-react/tree/main/examples",children:e.jsx(n.code,{children:"examples/"})}),e.jsx(n.br,{}),`
`,"Source code: ",e.jsxs(n.a,{href:"https://github.com/vikejs/vike-react",children:["GitHub > ",e.jsx(n.code,{children:"vikejs/vike-react"})]})]})}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(s,{href:"/extensions",children:"Vike extension"})," ",e.jsx(n.code,{children:"vike-react"})," is a full-fledged ",e.jsx(n.a,{href:"https://react.dev",children:"React"})," integration, with a high-level DX like a conventional framework such as Next.js or React Router."]}),`
`,e.jsxs(n.p,{children:["The documentation for using ",e.jsx(n.code,{children:"vike-react"})," can be found throughout this website (",e.jsx(n.code,{children:"vike.dev"}),")."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Guides, such as ",e.jsx(s,{href:"/data-fetching"}),", assume you're using Vike with ",e.jsx(d,{name:!0,noLink:!0,comma:!0}),". If you aren't then see the sections ",e.jsx(n.code,{children:"Without vike-{react,vue,solid}"})," such as ",e.jsx(s,{href:"/useData#without-vike-react-vue-solid"}),"."]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["You can integrate React yourself instead of using ",e.jsx(n.code,{children:"vike-react"}),", see ",e.jsx(s,{href:"/react#custom-integration"}),"."]}),`
`]}),`
`,e.jsx(n.p,{children:"See also:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/react#react-server-components",doNotInferSectionTitle:!0}),`
`]}),`
`]}),`
`,e.jsxs("h2",{id:"scaffold-new-vike-react-app",children:["Scaffold new ",e.jsx("code",{children:"vike-react"})," app"]}),`
`,e.jsxs(n.p,{children:["Use ",e.jsx(s,{href:"/new",children:"vike.dev/new"})," for creating a new ",e.jsx(n.code,{children:"vike-react"})," app."]}),`
`,e.jsxs("h2",{id:"add-vike-react-to-existing-vike-app",children:["Add ",e.jsx("code",{children:"vike-react"})," to existing Vike app"]}),`
`,e.jsxs(n.p,{children:["To add ",e.jsx(n.code,{children:"vike-react"})," to an existing Vike app: install the ",e.jsx(n.code,{children:"vike-react"})," npm package (e.g. ",e.jsx(n.code,{children:"$ npm install vike-react"}),") then extend your existing ",e.jsx(n.code,{children:"+config.js"})," file (or create one) with ",e.jsx(n.code,{children:"vike-react"}),":"]}),`
`,e.jsxs(r,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(n.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{className:"has-diff",tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/+config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{className:"diff add","data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" vikeReact "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike-react/config'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // ..."})}),`
`,e.jsx(n.span,{className:"diff add","data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  extends: [vikeReact] "})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(n.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{className:"has-diff",tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/+config.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsxs(n.span,{className:"diff add","data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" vikeReact "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike-react/config'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // ..."})}),`
`,e.jsx(n.span,{className:"diff add","data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  extends: [vikeReact] "})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"} "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsxs(n.p,{children:["You can then use ",e.jsxs(s,{href:"#under-the-hood",children:["new settings introduced by ",e.jsx(n.code,{children:"vike-react"})]}),":"]}),`
`,e.jsxs(r,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(n.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{className:"has-diff",tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/+config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" vikeReact "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike-react/config'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // ..."})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{className:"diff add","data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Setting to toggle SSR"})}),`
`,e.jsxs(n.span,{className:"diff add","data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"false"}),e.jsx(n.span,{style:{color:"#24292E"},children:", "})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  extends: [vikeReact]"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(n.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{className:"has-diff",tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/+config.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" vikeReact "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike-react/config'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // ..."})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{className:"diff add","data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Setting to toggle SSR"})}),`
`,e.jsxs(n.span,{className:"diff add","data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"false"}),e.jsx(n.span,{style:{color:"#24292E"},children:", "})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  extends: [vikeReact]"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"} "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsx(n.p,{children:"See also:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/add"}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"under-the-hood",children:"Under the hood"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"vike-react"})," extension is only ",e.jsx(n.a,{href:"https://gist.github.com/brillout/6267ecb8c996fb4a401985106cc81936",children:"around 1k lines of code"}),`.
It's simple, readable, and highly polished.`]}),`
`,e.jsxs(n.p,{children:["Reading the ",e.jsxs(n.a,{href:"https://github.com/vikejs/vike-react",children:["source code of ",e.jsx(n.code,{children:"vike-react"})]})," is very much an option for understanding, debugging, and/or contributing."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Contributions are welcome! See ",e.jsx(n.a,{href:"https://github.com/vikejs/vike-react/blob/main/CONTRIBUTING.md",children:"CONTRIBUTING.md"})," to get started."]}),`
`]}),`
`,e.jsxs(n.p,{children:["What ",e.jsx(n.code,{children:"vike-react"})," does is essentially this:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Sets ",e.jsx(s,{href:"/hooks",children:"Vike hooks"})," and ",e.jsx(s,{href:"/settings",children:"Vike settings"})," on your behalf.",`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"Most notably:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(s,{href:"/onRenderHtml",children:e.jsx(n.code,{children:"onRenderHtml()"})}),`
(see `,e.jsx(n.a,{href:"https://github.com/vikejs/vike-react/blob/main/packages/vike-react/src/integration/onRenderHtml.tsx",children:"integration/onRenderHtml.tsx"}),")"]}),`
`,e.jsxs(n.li,{children:[e.jsx(s,{href:"/onRenderClient",children:e.jsx(n.code,{children:"onRenderClient()"})}),`
(see `,e.jsx(n.a,{href:"https://github.com/vikejs/vike-react/blob/main/packages/vike-react/src/integration/onRenderClient.tsx",children:"integration/onRenderClient.tsx"}),")"]}),`
`]}),`
`,e.jsx("p",{}),`
`,`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:["Creates new Vike settings and new Vike hooks. (By using ",e.jsx(s,{href:"/meta"}),".)",`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["For example ",e.jsx(s,{href:"/Layout",children:e.jsx(n.code,{children:"<Layout>"})})," and ",e.jsx(s,{href:"/ssr",children:e.jsx(n.code,{children:"ssr"})}),"."]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:["Implements React component hooks.",`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["For example ",e.jsx(s,{href:"/useData",children:e.jsx(n.code,{children:"useData()"})})," and ",e.jsx(s,{href:"/usePageContext",children:e.jsx(n.code,{children:"usePageContext()"})}),"."]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:["Uses ",e.jsx(n.a,{href:"https://github.com/brillout/react-streaming",children:e.jsx(n.code,{children:"react-streaming"})})," for ",e.jsx(s,{href:"/streaming",children:"HTML Streaming"}),"."]}),`
`]}),`
`,e.jsx(n.p,{children:"It implements the following:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{noBreadcrumb:!0,href:"/useData"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{noBreadcrumb:!0,href:"/usePageContext"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{noBreadcrumb:!0,href:"/Layout"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{noBreadcrumb:!0,href:"/Wrapper"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{noBreadcrumb:!0,href:"/ssr"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{noBreadcrumb:!0,href:"/stream"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{noBreadcrumb:!0,href:"/ClientOnly"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{noBreadcrumb:!0,href:"/reactStrictMode"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{noBreadcrumb:!0,href:"/onBeforeRenderClient"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{noBreadcrumb:!0,href:"/onAfterRenderClient"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{noBreadcrumb:!0,href:"/Head"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{noBreadcrumb:!0,href:"/title"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{noBreadcrumb:!0,href:"/description"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{noBreadcrumb:!0,href:"/image"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{noBreadcrumb:!0,href:"/favicon"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{noBreadcrumb:!0,href:"/viewport"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{noBreadcrumb:!0,href:"/lang"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{noBreadcrumb:!0,href:"/htmlAttributes"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{noBreadcrumb:!0,href:"/bodyAttributes"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{noBreadcrumb:!0,href:"/headHtmlBegin"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{noBreadcrumb:!0,href:"/headHtmlEnd"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{noBreadcrumb:!0,href:"/bodyHtmlBegin"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{noBreadcrumb:!0,href:"/bodyHtmlEnd"}),`
`]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["For a better overview, see the following lists instead. (They also include all settings and hooks created by ",e.jsx(n.code,{children:"vike-react"}),".)"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/settings"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/hooks"}),`
`]}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsxs(n.a,{href:"https://github.com/vikejs/vike-react",children:["GitHub > ",e.jsx(n.code,{children:"vikejs/vike-react"})]})}),`
`,e.jsx(n.li,{children:e.jsxs(n.a,{href:"https://github.com/vikejs/vike-react/blob/main/packages/vike-react/CHANGELOG.md",children:["GitHub > ",e.jsx(n.code,{children:"vikejs/vike-react"})," > ",e.jsx(n.code,{children:"CHANGELOG.md"})]})}),`
`,e.jsx(n.li,{children:e.jsxs(n.a,{href:"https://github.com/vikejs/vike-react/tree/main/examples",children:["GitHub > ",e.jsx(n.code,{children:"vikejs/vike-react"})," > ",e.jsx(n.code,{children:"examples/"})]})}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/react"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/vike-vue"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/vike-solid"}),`
`]}),`
`]})]})}function x(i={}){const{wrapper:n}={...a(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(l,{...i})}):l(i)}function j(i,n){throw new Error("Expected component `"+i+"` to be defined: you likely forgot to import, pass, or provide it.")}const p=Object.freeze(Object.defineProperty({__proto__:null,default:x,pageSectionsExport:h},Symbol.toStringTag,{value:"Module"})),G={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:c}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:t}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/vike-react/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:p}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{G as configValuesSerialized};
