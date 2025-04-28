import{j as e,i as t,L as l,o as a}from"../chunks/chunk-BHFR-i-w.js";import{L as s}from"../chunks/chunk-CTkFNqbg.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-C-_bLe2s.js";import{U as d}from"../chunks/chunk-BILJyih3.js";/* empty css                      *//* empty css                      *//* empty css                      */const c=[{pageSectionId:"scaffold-new-vike-react-app",pageSectionLevel:2,pageSectionTitle:"Scaffold new `vike-react` app"},{pageSectionId:"add-vike-react-to-existing-vike-app",pageSectionLevel:2,pageSectionTitle:"Add `vike-react` to existing Vike app"},{pageSectionId:"under-the-hood",pageSectionLevel:2,pageSectionTitle:"Under the hood"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function i(r){const n={a:"a",blockquote:"blockquote",br:"br",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...r.components};return e.jsxs(e.Fragment,{children:[e.jsxs(n.p,{children:["The ",e.jsx(s,{href:"/extensions",children:"Vike extension"})," ",e.jsx(n.code,{children:"vike-react"})," integrates ",e.jsx(n.a,{href:"https://react.dev",children:"React"})," in a full-fledged manner, providing a DX like a regular frontend framework like Next.js and Remix."]}),`
`,e.jsxs(n.p,{children:["Version history: ",e.jsx(n.a,{href:"https://github.com/vikejs/vike-react/blob/main/packages/vike-react/CHANGELOG.md",children:e.jsx(n.code,{children:"CHANGELOG.md"})}),e.jsx(n.br,{}),`
`,"Examples: ",e.jsx(n.a,{href:"https://batijs.dev",children:"Bati"})," and ",e.jsx(n.a,{href:"https://github.com/vikejs/vike-react/tree/main/examples",children:e.jsx(n.code,{children:"examples/"})}),e.jsx(n.br,{}),`
`,"Source code: ",e.jsxs(n.a,{href:"https://github.com/vikejs/vike-react",children:["GitHub > ",e.jsx(n.code,{children:"vikejs/vike-react"})]})]}),`
`,e.jsxs(n.p,{children:["The documentation for using ",e.jsx(n.code,{children:"vike-react"})," can be found throughout this website (",e.jsx(n.code,{children:"vike.dev"}),")."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["The guides, such as ",e.jsx(s,{href:"/data-fetching"}),", assume you're using Vike with ",e.jsx(d,{name:!0,noLink:!0,comma:!0}),". If you aren't then see the sections ",e.jsx(n.code,{children:"Without vike-{react,vue,solid}"})," such as ",e.jsx(s,{href:"/useData#without-vike-react-vue-solid"}),"."]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["You can integrate React yourself instead of using ",e.jsx(n.code,{children:"vike-react"}),", see ",e.jsx(s,{href:"/react#custom-integration"}),"."]}),`
`]}),`
`,e.jsxs(n.p,{children:["Notes about ",e.jsx(n.a,{href:"https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components",children:"RSC"}),":"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/react#react-server-components",doNotInferSectionTitle:!0}),`
`]}),`
`]}),`
`,e.jsxs("h2",{id:"scaffold-new-vike-react-app",children:["Scaffold new ",e.jsx("code",{children:"vike-react"})," app"]}),`
`,e.jsxs(n.p,{children:["Use ",e.jsx(n.a,{href:"https://batijs.dev",children:"Bati"})," for creating new apps."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["If you select React then Bati scaffolds a Vike + ",e.jsx(n.code,{children:"vike-react"})," app."]}),`
`]}),`
`,e.jsxs("h2",{id:"add-vike-react-to-existing-vike-app",children:["Add ",e.jsx("code",{children:"vike-react"})," to existing Vike app"]}),`
`,e.jsxs(n.p,{children:["To add ",e.jsx(n.code,{children:"vike-react"})," to an existing Vike app: install the ",e.jsx(n.code,{children:"vike-react"})," npm package (e.g. ",e.jsx(n.code,{children:"$ npm install vike-react"}),") then extend your existing ",e.jsx(n.code,{children:"+config.js"})," file (or create one) with ",e.jsx(n.code,{children:"vike-react"}),":"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{className:"has-diff",style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/+config.js"})}),`
`,e.jsxs(n.span,{className:"diff add","data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" vikeReact "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike-react/config'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // ..."})}),`
`,e.jsx(n.span,{className:"diff add","data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  extends: [vikeReact] "})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.p,{children:["You can then use ",e.jsxs(s,{href:"#under-the-hood",children:["new settings introduced by ",e.jsx(n.code,{children:"vike-react"})]}),":"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{className:"has-diff",style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/+config.js"})}),`
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
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h2",{id:"under-the-hood",children:"Under the hood"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"vike-react"})," extension is only ",e.jsx(n.a,{href:"https://gist.github.com/brillout/6267ecb8c996fb4a401985106cc81936",children:"around 1k lines of code"}),`.
It's simple, readable, and highly polished.`]}),`
`,e.jsxs(n.p,{children:["Reading the ",e.jsxs(n.a,{href:"https://github.com/vikejs/vike-react",children:["source code of ",e.jsx(n.code,{children:"vike-react"})]})," is very much an option for understanding, debugging, and/or contributing."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Contributions are welcome! See ",e.jsx(n.a,{href:"https://github.com/vikejs/vike-react/blob/main/CONTRIBUTING.md",children:"CONTRIBUTING.md"})," to get started."]}),`
`]}),`
`,e.jsxs(n.p,{children:["Essentially ",e.jsx(n.code,{children:"vike-react"})," does this:"]}),`
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
`,e.jsx(s,{noBreadcrumb:!0,href:"/clientOnly"}),`
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
`,e.jsxs(n.li,{children:[e.jsx(s,{href:"/react#react-server-components",doNotInferSectionTitle:!0}),"."]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/vike-vue"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/vike-solid"}),`
`]}),`
`]})]})}function o(r={}){const{wrapper:n}=r.components||{};return n?e.jsx(n,{...r,children:e.jsx(i,{...r})}):i(r)}const h=Object.freeze(Object.defineProperty({__proto__:null,default:o,pageSectionsExport:c},Symbol.toStringTag,{value:"Module"})),A={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:a}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/vike-react/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:h}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:l}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:t}}};export{A as configValuesSerialized};
