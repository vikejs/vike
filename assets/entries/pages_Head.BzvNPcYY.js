import{j as e,i as a,L as c,o as i}from"../chunks/chunk-CW98EJ9W.js";import{L as n}from"../chunks/chunk-zM1tqlFQ.js";/* empty css                      */import{W as o}from"../chunks/chunk-CFmYZFtB.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-CEmQ5Muk.js";import{P as t}from"../chunks/chunk-DqaMlA9a.js";/* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-ClVVPkh0.js";/* empty css                      */const d=[{pageSectionId:"using-data",pageSectionLevel:2,pageSectionTitle:"Using data"},{pageSectionId:"head-inside-components",pageSectionLevel:3,pageSectionTitle:"`<Head>` inside components"},{pageSectionId:"useconfig-inside-data",pageSectionLevel:3,pageSectionTitle:"`useConfig()` inside `+data`"},{pageSectionId:"usedata-usepagecontext-inside-head",pageSectionLevel:3,pageSectionTitle:"`useData()`/`usePageContext()` inside `+Head`"},{pageSectionId:"only-html",pageSectionLevel:2,pageSectionTitle:"Only HTML"},{pageSectionId:"only-renders-for-the-first-page-s-html",pageSectionLevel:3,pageSectionTitle:"Only renders for the first page's HTML"},{pageSectionId:"limitation",pageSectionLevel:3,pageSectionTitle:"Limitation"},{pageSectionId:"a-small-limitation",pageSectionLevel:3,pageSectionTitle:"A small limitation"},{pageSectionId:"example",pageSectionLevel:3,pageSectionTitle:"Example"},{pageSectionId:"cumulative",pageSectionLevel:2,pageSectionTitle:"Cumulative"},{pageSectionId:"how-to-inject-raw-html",pageSectionLevel:2,pageSectionTitle:"How to inject raw HTML?"},{pageSectionId:"react",pageSectionLevel:3,pageSectionTitle:"React"},{pageSectionId:"vue",pageSectionLevel:3,pageSectionTitle:"Vue"},{pageSectionId:"solid",pageSectionLevel:3,pageSectionTitle:"Solid"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function r(l){const s={a:"a",blockquote:"blockquote",br:"br",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...l.components};return e.jsxs(e.Fragment,{children:[e.jsxs(s.p,{children:["Kind: cumulative.",e.jsx(s.br,{}),`
`,"Environment: server."]}),`
`,e.jsx(t,{noCustomGuide:!0}),`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.code,{children:"+Head"})," setting allows you to add ",e.jsx(s.code,{children:"<head>"})," tags to your pages."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["See ",e.jsx(n,{href:"/head-tags"})," for a general introduction and for other ways to add ",e.jsx(s.code,{children:"<head>"})," tags."]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["As explained ",e.jsx(n,{href:"#only-html",children:"below"}),", it's only used when rendering the HTML of the first page the user visits. Consequently, it usually cannot be used for setting the ",e.jsx(s.code,{children:"<title>"})," tag."]}),`
`]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"jsx","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"jsx","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+Head.jsx"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+Head.vue"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" previewImage "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" './previewImage.jpg'"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" favicon "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" './favicon.png'"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" iconMobile "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" './iconMobile.png'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Head"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" <>"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    {"}),e.jsx(s.span,{style:{color:"#6A737D"},children:"/* Adding a script tag */"}),e.jsx(s.span,{style:{color:"#24292E"},children:"}"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"script"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" type"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"text/javascript"'}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" src"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"https://example.com/some-script.js"'}),e.jsx(s.span,{style:{color:"#24292E"},children:"></"}),e.jsx(s.span,{style:{color:"#22863A"},children:"script"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    {"}),e.jsx(s.span,{style:{color:"#6A737D"},children:"/* Icon shown in the browser tab (aka favicon) */"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"link"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" rel"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"icon"'}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" href"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:"{favicon}>"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    {"}),e.jsx(s.span,{style:{color:"#6A737D"},children:"/* Icon shown on mobile homescreens (PWA) */"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"link"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" rel"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"apple-touch-icon"'}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" href"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:"{iconMobile}>"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    {"}),e.jsx(s.span,{style:{color:"#6A737D"},children:"/* Image shown when sharing on social sites (Twitter, WhatsApp, ...) */"}),e.jsx(s.span,{style:{color:"#24292E"},children:"}"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"meta"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" property"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"og:image"'}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" content"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:"{previewImage}>"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  </>"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h2",{id:"using-data",children:"Using data"}),`
`,e.jsxs(s.p,{children:["You can set ",e.jsx(s.code,{children:"<head>"})," tags based on ",e.jsx(n,{href:"/data-fetching",children:"fetched data"})," (or ",e.jsx(n,{href:"/pageContext",children:e.jsx(s.code,{children:"pageContext"})}),") by using:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsxs(n,{href:"#head-inside-components",children:[e.jsx(s.code,{children:"<Head>"})," inside components"]}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsxs(n,{href:"#useconfig-inside-data",children:[e.jsx(s.code,{children:"useConfig()"})," inside ",e.jsx(s.code,{children:"+data"})]}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsxs(n,{href:"#usedata-usepagecontext-inside-head",children:[e.jsx(s.code,{children:"useData()"}),"/",e.jsx(s.code,{children:"usePageContext()"})," inside ",e.jsx(s.code,{children:"+Head"})]}),`
`]}),`
`]}),`
`,e.jsxs("h3",{id:"head-inside-components",children:[e.jsx("code",{children:"<Head>"})," inside components"]}),`
`,e.jsxs(s.p,{children:["You can use the ",e.jsxs(n,{href:"/Head",children:[e.jsx(s.code,{children:"<Head>"})," component"]})," inside your components:"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"jsx","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"jsx","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Product.jsx"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Head } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike-react/Head'"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" // or vike-{vue,solid}"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Product"}),e.jsx(s.span,{style:{color:"#24292E"},children:"({ "}),e.jsx(s.span,{style:{color:"#E36209"},children:"data"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }) {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" <>"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    <"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"Head"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      {"}),e.jsx(s.span,{style:{color:"#6A737D"},children:"/* Image shown when sharing on social sites (Twitter, WhatsApp, ...) */"}),e.jsx(s.span,{style:{color:"#24292E"},children:"}"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"meta"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" property"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"og:image"'}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" content"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:"{data.product.image}>"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    </"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"Head"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"h1"}),e.jsx(s.span,{style:{color:"#24292E"},children:">{data.product.name}</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"h1"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"p"}),e.jsx(s.span,{style:{color:"#24292E"},children:">{data.product.description}</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"p"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  </>"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["Here ",e.jsx(s.code,{children:"data"})," comes from the props passed from the parent component, but it can also come from a data-fetching component hook such as ",e.jsx(s.a,{href:"https://github.com/vikejs/vike-react/tree/main/packages/vike-react-query#head-tags",children:e.jsx(s.code,{children:"const { data } = useSuspenseQuery()"})})," when using ",e.jsx(s.a,{href:"https://github.com/vikejs/vike-react/tree/main/packages/vike-react-query#readme",children:e.jsx(s.code,{children:"vike-react-query"})}),"."]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["It also works inside ",e.jsx(s.code,{children:".vue"})," files (when using ",e.jsx(n,{href:"/vike-vue",children:e.jsx(s.code,{children:"vike-vue"})}),")."]}),`
`]}),`
`,e.jsxs("h3",{id:"useconfig-inside-data",children:[e.jsx("code",{children:"useConfig()"})," inside ",e.jsx("code",{children:"+data"})]}),`
`,e.jsxs(s.p,{children:["You can use the ",e.jsxs(n,{href:"/useConfig",children:[e.jsx(s.code,{children:"useConfig()"})," universal hook"]})," inside your ",e.jsxs(n,{href:"/data",children:[e.jsx(s.code,{children:"+data"})," hook"]}),"."]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"jsx","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"jsx","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/product/@id/+data.jsx"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { useConfig } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike-react/useConfig'"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" // or vike-{vue,solid}"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" async"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" data"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" config"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" useConfig"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" data"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" fetchSomeData"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"  config"}),e.jsx(s.span,{style:{color:"#24292E"},children:"({"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    Head: <>"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      {"}),e.jsx(s.span,{style:{color:"#6A737D"},children:"/* Image shown when sharing on social sites (Twitter, WhatsApp, ...) */"}),e.jsx(s.span,{style:{color:"#24292E"},children:"}"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"meta"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" property"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"og:image"'}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" content"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:"{data.product.image}>"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    </>"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  })"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"For Vue you can use the following:"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { h } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vue'"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"config"}),e.jsx(s.span,{style:{color:"#24292E"},children:"({"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  Head: "}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"h"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'meta'"}),e.jsx(s.span,{style:{color:"#24292E"},children:", {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    property: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'og:image'"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    content: data.product.image"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  })"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"})"})})]})})}),`
`]}),`
`,e.jsxs("h3",{id:"usedata-usepagecontext-inside-head",children:[e.jsx("code",{children:"useData()"}),"/",e.jsx("code",{children:"usePageContext()"})," inside ",e.jsx("code",{children:"+Head"})]}),`
`,e.jsxs(s.p,{children:["The value defined by ",e.jsx(s.code,{children:"+Head"})," is a component and thus you can use ",e.jsx(n,{href:"/useData",children:e.jsx(s.code,{children:"useData()"})})," and ",e.jsx(n,{href:"/usePageContext",children:e.jsx(s.code,{children:"usePageContext()"})})," as usual:"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"jsx","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"jsx","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/product/@id/+Head.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { useData } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike-react/useData'"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" // or vike-{vue,solid}"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Head"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" data"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" useData"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" <>"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    {"}),e.jsx(s.span,{style:{color:"#6A737D"},children:"/* Image shown when sharing on social sites (Twitter, WhatsApp, ...) */"}),e.jsx(s.span,{style:{color:"#24292E"},children:"}"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"meta"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" property"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"og:image"'}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" content"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:"{data.product.image}>"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  </>"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h2",{id:"only-html",children:"Only HTML"}),`
`,e.jsx("h3",{id:"only-renders-for-the-first-page-s-html",children:"Only renders for the first page's HTML"}),`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.code,{children:"<Head>"})," component is only used when rendering the HTML of the first page the user visits: the tags set by ",e.jsx(s.code,{children:"<Head>"})," aren't updated upon ",e.jsx(n,{href:"/client-routing",children:"client-side page navigation"}),"."]}),`
`,e.jsx("h3",{id:"limitation",children:"Limitation"}),`
`,e.jsxs(s.p,{children:["The most notable limitation is that the ",e.jsx(s.code,{children:"+Head"})," setting cannot be used to set the ",e.jsx(s.code,{children:"<title>"})," value, because the title isn't updated when navigating to a page with a different title."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["See ",e.jsx(n,{href:"#example",children:"example below"})," for a more detailed explanation."]}),`
`]}),`
`,e.jsxs(s.p,{children:["Instead use the ",e.jsx(n,{href:"/title",children:e.jsx(s.code,{children:"+title"})})," setting."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["For use cases where the ",e.jsx(s.code,{children:"+Head"})," setting cannot be used, Vike offers tailored settings that update upon client-side navigation."]}),`
`]}),`
`,e.jsx("h3",{id:"a-small-limitation",children:"A small limitation"}),`
`,e.jsxs(s.p,{children:["This may seem like a major limitation but it actually isn't: you can use the ",e.jsx(s.code,{children:"+Head"})," setting for the vast majority of use cases."]}),`
`,e.jsxs(s.p,{children:["You can use ",e.jsx(s.code,{children:"+Head"})," for setting ",e.jsx(s.code,{children:"<head>"})," tags are read by HTML crawlers:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Tags for social sites (Twitter, Instagram, ...) such as ",e.jsx(s.code,{children:'<meta property="og:image">'})," (the preview image upon URL sharing).",`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"Social site bots navigate your website only by using HTML requests: they don't execute client-side JavaScript and don't do client-side navigation."}),`
`]}),`
`]}),`
`,e.jsxs(s.li,{children:["Tags for SEO such as ",e.jsx(s.code,{children:'<meta name="description">'}),".",`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["While Google can do client-side navigation, it still discovers ",e.jsx(s.code,{children:"<head>"})," tags by using its HTML crawler."]}),`
`]}),`
`]}),`
`]}),`
`,e.jsxs(s.p,{children:["You can use ",e.jsx(s.code,{children:"+Head"})," for setting ",e.jsx(s.code,{children:"<head>"})," tags that are global (they have the same value for all pages):"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Favicon.",`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["Assuming all your pages share the same favicon (",e.jsx(s.code,{children:'<link rel="icon">'}),"), there isn't any need to update the favicon upon client-side navigation."]}),`
`]}),`
`]}),`
`,e.jsxs(s.li,{children:["PWA settings.",`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"PWA settings are global and there isn't any need to update them upon client-side navigation."}),`
`]}),`
`]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"<script>"}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"Assuming the script applies to all your pages."}),`
`]}),`
`]}),`
`]}),`
`,e.jsx("h3",{id:"example",children:"Example"}),`
`,e.jsxs(s.p,{children:["The following example showcases that using ",e.jsx(s.code,{children:"+Head"})," for setting ",e.jsx(s.code,{children:"<title>"})," doesn't work, while it does work for setting ",e.jsx(s.code,{children:'<meta name="description">'}),"."]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/index/+Head.jsx"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Head"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" <>"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"title"}),e.jsx(s.span,{style:{color:"#24292E"},children:">AwesomeRockets</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"title"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"meta"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" name"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"description"'}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" content"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"The rocket company."'}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  </>"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/about/+Head.jsx"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Head"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" <>"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"title"}),e.jsx(s.span,{style:{color:"#24292E"},children:">About us</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"title"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"meta"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" name"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"description"'}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" content"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"We deliver payload to space."'}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  </>"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(s.p,{children:["If the first URL the user visits is ",e.jsx(s.code,{children:"/"})," then the rendered HTML is:"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"html","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"html","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"<!"}),e.jsx(s.span,{style:{color:"#22863A"},children:"DOCTYPE"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" html"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"<"}),e.jsx(s.span,{style:{color:"#22863A"},children:"html"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"head"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"title"}),e.jsx(s.span,{style:{color:"#24292E"},children:">AwesomeRockets</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"title"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"meta"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" name"}),e.jsx(s.span,{style:{color:"#24292E"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"description"'}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" content"}),e.jsx(s.span,{style:{color:"#24292E"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"The rocket company."'}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  </"}),e.jsx(s.span,{style:{color:"#22863A"},children:"head"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"html"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]})]})})}),`
`,e.jsxs(s.p,{children:["If the user then clicks on a link ",e.jsx(s.code,{children:'<a href="/about">About us</a>'}),", then Vike does client-side navigation and the page's title isn't updated: the browser sill shows ",e.jsx(s.code,{children:"Welcome"})," even though the URL is now ",e.jsx(s.code,{children:"/about"}),". That's because the ",e.jsx(n,{href:"/client-routing",children:"HTML isn't used upon client-side navigation (DOM manipulations are made instead)"})," while ",e.jsx(s.code,{children:"+Head"})," is only used when generating HTML."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.code,{children:"<Head>"})," component is only loaded on the server-side and only used when rendering HTML of the first page by design."]}),`
`]}),`
`,e.jsxs(s.p,{children:["This isn't an issue for ",e.jsx(s.code,{children:'<meta name="description">'}),` tag because it's meant for search engines bots which
crawl your website using HTML.`]}),`
`,e.jsx("h2",{id:"cumulative",children:"Cumulative"}),`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.code,{children:"+Head"})," setting is cumulative. For example:"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"jsx","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"jsx","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+Head.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" favicon "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" './favicon.png'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Head"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" () "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // This favicon applies to all pages"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"link"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" rel"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"icon"'}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" href"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:"{favicon}>"})]})]})})}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"jsx","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"jsx","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/about-us/+Head.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" previewImage "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" './previewImage.jpg'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Head"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" () "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Both the favicon above and this tag applies to /pages/about-us/+Page.js"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"meta"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" property"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"og:image"'}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" content"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:"{previewImage}>"})]})]})})}),`
`,e.jsxs(s.p,{children:["To apply different ",e.jsx(s.code,{children:"+Head"})," settings to different pages:"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"jsx","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"jsx","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/(marketing)/+Head.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" favicon "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" './favicon.png'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Applies to all marketing pages"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Head"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" () "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"link"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" rel"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"icon"'}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" href"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:"{favicon}>"})]})]})})}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"jsx","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"jsx","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/admin/+Head.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" favicon "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" './favicon.png'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Applies to all admin pages"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Head"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" () "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"link"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" rel"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"icon"'}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" href"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:"{favicon}>"})]})]})})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["See: ",e.jsx(n,{href:"/config#inheritance"})]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["If you have a need for overriding, then add a comment at: ",e.jsxs(s.a,{href:"https://github.com/vikejs/vike/issues/1692",children:["#1692 - Add ",e.jsx(s.code,{children:"override"})," and ",e.jsx(s.code,{children:"default"})," options for cumulative configs"]})]}),`
`]}),`
`,e.jsx("h2",{id:"how-to-inject-raw-html",children:"How to inject raw HTML?"}),`
`,e.jsxs(s.p,{children:["You can inject any arbitrary HTML string to the page's ",e.jsx(s.code,{children:"<head>"}),". Examples using:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"#react",children:"React"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"#vue",children:"Vue"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"#solid",children:"Solid"}),`
`]}),`
`]}),`
`,e.jsx(o,{children:e.jsxs(s.p,{children:["Be cautious about the security risk called ",e.jsx(s.a,{href:"https://en.wikipedia.org/wiki/Cross-site_scripting",children:"XSS injections"}),"."]})}),`
`,e.jsx("h3",{id:"react",children:"React"}),`
`,e.jsxs(s.p,{children:["You can use React's ",e.jsx(s.code,{children:"dangerouslySetInnerHTML"})," to add raw HTML, for example:"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" React "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'react'"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Head } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike-react/Head'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Image"}),e.jsx(s.span,{style:{color:"#24292E"},children:"({ "}),e.jsx(s.span,{style:{color:"#E36209"},children:"src"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#E36209"},children:"author"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }) {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#D73A49"},children:"    <>"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"      <"}),e.jsx(s.span,{style:{color:"#24292E"},children:"img src"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:"{src} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"/>"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      <"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"Head"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"        <"}),e.jsx(s.span,{style:{color:"#E36209"},children:"script"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"          type"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"application/ld+json"'})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"          dangerouslySetInnerHTML"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:"{{"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"            __html"}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"JSON"}),e.jsx(s.span,{style:{color:"#24292E"},children:"."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"stringify"}),e.jsx(s.span,{style:{color:"#24292E"},children:"({"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"              '@context'"}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'https://schema.org/'"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"              contentUrl: { src },"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"              creator: {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"                '@type'"}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'Person'"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"                name: author"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"              }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"            })"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"          }}"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"        >"}),e.jsx(s.span,{style:{color:"#24292E"},children:"</"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"script"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"      </"}),e.jsx(s.span,{style:{color:"#24292E"},children:"Head"}),e.jsx(s.span,{style:{color:"#D73A49"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#D73A49"},children:"    </>"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  )"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h3",{id:"vue",children:"Vue"}),`
`,e.jsxs(s.p,{children:["You can use ",e.jsx(s.code,{children:"innerHTML"})," to add raw HTML, for example:"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"vue","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"vue","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"<"}),e.jsx(s.span,{style:{color:"#22863A"},children:"template"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"img"}),e.jsx(s.span,{style:{color:"#24292E"},children:" :"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"src"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" v-bind"}),e.jsx(s.span,{style:{color:"#24292E"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"'}),e.jsx(s.span,{style:{color:"#24292E"},children:"otherAttrs"}),e.jsx(s.span,{style:{color:"#032F62"},children:'"'}),e.jsx(s.span,{style:{color:"#24292E"},children:" />"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"template"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"<"}),e.jsx(s.span,{style:{color:"#22863A"},children:"script"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" setup"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { useAttrs, h } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vue'"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { useConfig } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike-vue/useConfig'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"src"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"author"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"..."}),e.jsx(s.span,{style:{color:"#005CC5"},children:"otherAttrs"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" useAttrs"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" config"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" useConfig"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"config"}),e.jsx(s.span,{style:{color:"#24292E"},children:"({"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  Head: "}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"h"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'script'"}),e.jsx(s.span,{style:{color:"#24292E"},children:", {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    type: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'application/ld+json'"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    innerHTML: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"JSON"}),e.jsx(s.span,{style:{color:"#24292E"},children:"."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"stringify"}),e.jsx(s.span,{style:{color:"#24292E"},children:"({"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"      '@context'"}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'https://schema.org/'"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      contentUrl: { src },"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      creator: {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"        '@type'"}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'Person'"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"        name: author"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    })"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  })"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"})"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"script"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]})]})})}),`
`,e.jsx("h3",{id:"solid",children:"Solid"}),`
`,e.jsxs(s.p,{children:["You can use ",e.jsx(s.code,{children:"innerHTML"})," to add raw HTML, for example:"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"jsx","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"jsx","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Head } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:' "vike-solid/Head"'})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Image"}),e.jsx(s.span,{style:{color:"#24292E"},children:"({ "}),e.jsx(s.span,{style:{color:"#E36209"},children:"src"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#E36209"},children:"author"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }) {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    <>"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"img"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" src"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:"{src} />"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      <"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"Head"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"script"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"          type"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"application/ld+json"'})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"          innerHTML"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:"{"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"JSON"}),e.jsx(s.span,{style:{color:"#24292E"},children:"."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"stringify"}),e.jsx(s.span,{style:{color:"#24292E"},children:"({"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:'            "@context"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"https://schema.org/"'}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"            contentUrl: { src },"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"            creator: {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:'              "@type"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"Person"'}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"              name: author"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"            }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"          })}"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        ></"}),e.jsx(s.span,{style:{color:"#22863A"},children:"script"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      </"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"Head"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    </>"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  )"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/head-tags"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/settings#html",doNotInferSectionTitle:!0}),`
`]}),`
`]})]})}function h(l={}){const{wrapper:s}=l.components||{};return s?e.jsx(s,{...l,children:e.jsx(r,{...l})}):r(l)}const p=Object.freeze(Object.defineProperty({__proto__:null,default:h,pageSectionsExport:d},Symbol.toStringTag,{value:"Module"})),H={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:i}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/Head/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:p}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:c}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:a}}};export{H as configValuesSerialized};
