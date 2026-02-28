import{o as d,a as h}from"../chunks/chunk-CxIOOiKX.js";import{j as e,d as r}from"../chunks/chunk-B35a6FX-.js";import{L as l}from"../chunks/chunk-BbfG-aTg.js";/* empty css                      */import{W as c}from"../chunks/chunk-4VEk4LmV.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as o}from"../chunks/chunk-CJvpbNqo.js";import{V as t}from"../chunks/chunk-47iUe6jq.js";import{G as p}from"../chunks/chunk-C63C6Qu-.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */const x=[{pageSectionId:"installation",pageSectionLevel:2,pageSectionTitle:"Installation"},{pageSectionId:"vue",pageSectionLevel:3,pageSectionTitle:"Vue"},{pageSectionId:"react",pageSectionLevel:3,pageSectionTitle:"React"},{pageSectionId:"metadata",pageSectionLevel:2,pageSectionTitle:"Metadata"},{pageSectionId:"global-metadata",pageSectionLevel:4,pageSectionTitle:"Global metadata"},{pageSectionId:"page-metadata",pageSectionLevel:4,pageSectionTitle:"Page metadata"},{pageSectionId:"with-a-metadata-js-file",pageSectionLevel:3,pageSectionTitle:"With a `metadata.js` file"},{pageSectionId:"with-a-custom-setting-eager",pageSectionLevel:3,pageSectionTitle:"With a custom setting (eager)"},{pageSectionId:"with-a-custom-setting",pageSectionLevel:3,pageSectionTitle:"With a custom setting"},{pageSectionId:"with-frontmatter",pageSectionLevel:3,pageSectionTitle:"With frontmatter"},{pageSectionId:"examples",pageSectionLevel:2,pageSectionTitle:"Examples"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function i(a){const s={a:"a",blockquote:"blockquote",code:"code",div:"div",em:"em",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...o(),...a.components},{ChoiceGroup:n}=s;return n||y("ChoiceGroup"),e.jsxs(e.Fragment,{children:[e.jsx("h2",{id:"installation",children:"Installation"}),`
`,e.jsxs(s.p,{children:["You can use ",e.jsx(s.a,{href:"https://en.wikipedia.org/wiki/Markdown",children:"Markdown"})," by adding one of the following ",e.jsx(s.a,{href:"https://vitejs.dev/plugins/",children:"Vite plugins"}),"."]}),`
`,e.jsx("h3",{id:"vue",children:"Vue"}),`
`,e.jsx(s.p,{children:"Markdown plugins compatible with Vue:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://mdxjs.com/packages/rollup/",children:e.jsx(s.code,{children:"@mdx-js/rollup"})})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/unplugin/unplugin-vue-markdown",children:e.jsx(s.code,{children:"unplugin-vue-markdown"})})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/antfu/vite-plugin-md",children:e.jsx(s.code,{children:"vite-plugin-md"})})}),`
`]}),`
`,e.jsx(s.p,{children:"Example:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(r,{path:"/examples/vue-full/vite.config.ts"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(r,{path:"/examples/vue-full/pages/markdown/+Page.md"}),`
`]}),`
`]}),`
`,e.jsx("h3",{id:"react",children:"React"}),`
`,e.jsx(s.p,{children:"Markdown plugins compatible with React:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/cyco130/vite-plugin-mdx/",children:e.jsx(s.code,{children:"@cyco130/vite-plugin-mdx"})})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://mdxjs.com/packages/rollup/",children:e.jsx(s.code,{children:"@mdx-js/rollup"})})}),`
`]}),`
`,e.jsx(s.p,{children:"Example:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(r,{path:"/examples/react-full/vite.config.ts"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(r,{path:"/examples/react-full/pages/markdown/+Page.mdx"}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"metadata",children:"Metadata"}),`
`,e.jsx(s.p,{children:"There are several techniques for defining metadata (e.g. the date and author of a page)."}),`
`,e.jsx(s.p,{children:"The preferred technique depends on whether you want to define global or page metadata."}),`
`,e.jsx("h4",{id:"global-metadata",children:"Global metadata"}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"What is global metadata?"})," For example, you want to show a list of all your blog posts always on the left side of your website."]}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{children:`2024-01-01 New Year 2024 Resolution
2023-12-20 Wrapping up 2023
2023-06-15 My summer 2023
`})}),`
`,e.jsxs(s.p,{children:["Because this list is shown on the left of every page, the publishing date and title of all blog posts is needed for rendering any page: the metadata needs to be accessible ",e.jsx(s.em,{children:"globally"}),"."]}),`
`]}),`
`,e.jsx(s.p,{children:"For global metadata, we recommend:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{href:"#with-a-metadata-js-file"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{href:"#with-a-custom-setting-eager"}),`
`]}),`
`]}),`
`,e.jsx(c,{children:e.jsxs(s.p,{children:["You may be tempted to use ",e.jsx(s.a,{href:"https://vitejs.dev/guide/features.html#glob-import",children:e.jsx(s.code,{children:"import.meta.glob()"})})," to retrieve metadata defined inside all ",e.jsx(s.code,{children:"+Page.md"})," files, but we discourage this approach: loading all ",e.jsx(s.code,{children:"+Page.md"})," files at once ",e.jsx(t,{}),"."]})}),`
`,e.jsx("h4",{id:"page-metadata",children:"Page metadata"}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"What is page metadata?"}),"  For example, you want to show detailed information below a blog post, such as the author's name. This metadata is shown only for that page."]}),`
`]}),`
`,e.jsx(s.p,{children:"For page metadata, we recommend:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{href:"#with-a-custom-setting"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{href:"#with-frontmatter"}),`
`]}),`
`]}),`
`,e.jsxs("h3",{id:"with-a-metadata-js-file",children:["With a ",e.jsx("code",{children:"metadata.js"})," file"]}),`
`,e.jsxs(s.p,{children:["A simple way to define metadata is to define a ",e.jsx(s.code,{children:"metadata.js"})," file that contains ",e.jsx(l,{href:"#global-metadata",children:"global metadata"}),"."]}),`
`,e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",hide:!0,children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/metadata.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This metadata is available to every page"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" metadata"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" ["})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    url: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'/blog/introducing-vike'"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    title: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'Introducing Vike'"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    date: "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"new"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Date"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'2024-01-01'"}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  },"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    url: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'/blog/v1'"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    title: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'v1.0.0 release'"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    date: "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"new"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Date"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'2025-07-01'"}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"]"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/metadata.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This metadata is available to every page"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" metadata"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" ["})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    url: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'/blog/introducing-vike'"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    title: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'Introducing Vike'"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    date: "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"new"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Date"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'2024-01-01'"}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  },"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    url: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'/blog/v1'"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    title: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'v1.0.0 release'"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    date: "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"new"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Date"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'2025-07-01'"}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"]"})})]})})})})]}),`
`,e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"jsx","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"jsx","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+Layout.jsx"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" React "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'react'"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { metadata } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" './metadata'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Layout"}),e.jsx(s.span,{style:{color:"#24292E"},children:"({ "}),e.jsx(s.span,{style:{color:"#E36209"},children:"children"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }) {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Current URL"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"urlPathname"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" usePageContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // The page's metadata"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"title"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" metadata."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"find"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(({ "}),e.jsx(s.span,{style:{color:"#E36209"},children:"url"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }) "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" url "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"==="}),e.jsx(s.span,{style:{color:"#24292E"},children:" urlPathname)"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    <>"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      {"}),e.jsx(s.span,{style:{color:"#6A737D"},children:"/* Show the list of blog posts */"}),e.jsx(s.span,{style:{color:"#24292E"},children:"}"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      <"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"LeftSidebar"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"p"}),e.jsx(s.span,{style:{color:"#24292E"},children:">Blog posts:</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"p"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"ul"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"          {metadata."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"map"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(({ "}),e.jsx(s.span,{style:{color:"#E36209"},children:"title"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#E36209"},children:"url"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#E36209"},children:"date"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }) "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"            <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"li"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"              <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"a"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" href"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:"{url}>{data "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"+"}),e.jsx(s.span,{style:{color:"#24292E"},children:" title}</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"a"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"            </"}),e.jsx(s.span,{style:{color:"#22863A"},children:"li"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"          ))}"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        </"}),e.jsx(s.span,{style:{color:"#22863A"},children:"ul"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      </"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"LeftSidebar"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      {"}),e.jsx(s.span,{style:{color:"#6A737D"},children:"/* The page's content */"}),e.jsx(s.span,{style:{color:"#24292E"},children:"}"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      <"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"Content"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"h1"}),e.jsx(s.span,{style:{color:"#24292E"},children:">{title}</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"h1"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        {"}),e.jsx(s.span,{style:{color:"#6A737D"},children:"/* children is pageContext.Page which is the component defined by +Page.md */"}),e.jsx(s.span,{style:{color:"#24292E"},children:"}"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"        {children}"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      </"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"Content"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    </>"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  )"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"tsx","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"tsx","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+Layout.tsx"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" React "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'react'"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { metadata } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" './metadata'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Layout"}),e.jsx(s.span,{style:{color:"#24292E"},children:"({ "}),e.jsx(s.span,{style:{color:"#E36209"},children:"children"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }"}),e.jsx(s.span,{style:{color:"#D73A49"},children:":"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#E36209"},children:"children"}),e.jsx(s.span,{style:{color:"#D73A49"},children:":"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" React"}),e.jsx(s.span,{style:{color:"#24292E"},children:"."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"ReactNode"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }) {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Current URL"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"urlPathname"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" usePageContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // The page's metadata"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"title"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" metadata."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"find"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(({ "}),e.jsx(s.span,{style:{color:"#E36209"},children:"url"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }) "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" url "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"==="}),e.jsx(s.span,{style:{color:"#24292E"},children:" urlPathname)"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    <>"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      {"}),e.jsx(s.span,{style:{color:"#6A737D"},children:"/* Show the list of blog posts */"}),e.jsx(s.span,{style:{color:"#24292E"},children:"}"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      <"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"LeftSidebar"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"p"}),e.jsx(s.span,{style:{color:"#24292E"},children:">Blog posts:</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"p"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"ul"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"          {metadata."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"map"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(({ "}),e.jsx(s.span,{style:{color:"#E36209"},children:"title"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#E36209"},children:"url"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#E36209"},children:"date"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }) "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"            <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"li"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"              <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"a"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" href"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:"{url}>{data "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"+"}),e.jsx(s.span,{style:{color:"#24292E"},children:" title}</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"a"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"            </"}),e.jsx(s.span,{style:{color:"#22863A"},children:"li"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"          ))}"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        </"}),e.jsx(s.span,{style:{color:"#22863A"},children:"ul"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      </"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"LeftSidebar"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      {"}),e.jsx(s.span,{style:{color:"#6A737D"},children:"/* The page's content */"}),e.jsx(s.span,{style:{color:"#24292E"},children:"}"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      <"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"Content"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"h1"}),e.jsx(s.span,{style:{color:"#24292E"},children:">{title}</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"h1"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        {"}),e.jsx(s.span,{style:{color:"#6A737D"},children:"/* children is pageContext.Page which is the component defined by +Page.md */"}),e.jsx(s.span,{style:{color:"#24292E"},children:"}"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"        {children}"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      </"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"Content"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    </>"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  )"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})})]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"See also:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{href:"/Layout"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{href:"/usePageContext"}),`
`]}),`
`]}),`
`]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"md","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"md","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"// /pages/blog/introducing-vike/+Page.md"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"We're thrilled to officially introduce Vike."})})]})})}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"md","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"md","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"// /pages/blog/v1/+Page.md"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"The "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"`v1.0.0`"}),e.jsx(s.span,{style:{color:"#24292E"},children:" release signals that Vike is ready for prime time: it now includes"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"all essentials you'd expect from a frontend framework with a robust design."})})]})})}),`
`,e.jsx("h3",{id:"with-a-custom-setting-eager",children:"With a custom setting (eager)"}),`
`,e.jsxs(s.p,{children:["You can use ",e.jsx(l,{href:"/meta",children:e.jsx(s.code,{children:"meta"})})," to create a custom setting for defining ",e.jsx(l,{href:"#global-metadata",children:"global metadata"}),"."]}),`
`,e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",hide:!0,children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"yaml","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"yaml","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"/pages/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"/pages/+onCreateGlobalContext.server.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"/pages/+Layout.jsx"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"/pages/2024-new-year/+Page.md"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"/pages/2024-new-year/+metadata.js"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"yaml","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"yaml","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"/pages/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"/pages/+onCreateGlobalContext.server.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"/pages/+Layout.tsx"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"/pages/2024-new-year/+Page.md"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"/pages/2024-new-year/+metadata.ts"})})]})})})})]}),`
`,e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  meta: {"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // Create +metadata setting"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    metadata: {"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"      // Make +metadata available to all pages"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      eager: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      env: {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        server: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"        // Instead of `client: true`, we use +onCreateGlobalContext with +passToClient to"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"        // be able to determine exactly what metadata is sent to the client-side."})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        client: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  },"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  passToClient: ["})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // Make globalContext.posts available on the client-side"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"    'posts'"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  ]"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  meta: {"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // Create +metadata setting"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    metadata: {"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"      // Make +metadata available to all pages"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      eager: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      env: {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        server: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"        // Instead of `client: true`, we use +onCreateGlobalContext with +passToClient to"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"        // be able to determine exactly what metadata is sent to the client-side."})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        client: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  },"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  passToClient: ["})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // Make globalContext.posts available on the client-side"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"    'posts'"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  ]"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["When setting ",e.jsx(s.code,{children:"eager: true"})," the setting is available globally to all pages."]}),`
`]}),`
`,e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",hide:!0,children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/2024-new-year/+metadata.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" metadata"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  title: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'New Year 2024 Resolution'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/2024-new-year/+metadata.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" metadata"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  title: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'New Year 2024 Resolution'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})})]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["Unlike in the example ",e.jsx(l,{href:"#with-a-custom-setting",children:"below"})," you cannot define ",e.jsx(s.code,{children:"+metadata"})," inside ",e.jsx(s.code,{children:"+Page.md"}),", because ",e.jsx(s.code,{children:"+Page.md"})," is ",e.jsx(l,{href:"/lazy-transpiling",children:"only loaded when rendering that page"}),". Consequently, the content of ",e.jsx(s.code,{children:"+Page.md"})," isn't available when rendering another page."]}),`
`]}),`
`,e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+onCreateGlobalContext.server.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" async"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" onCreateGlobalContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#E36209"},children:"globalContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" pages"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" globalContext.pages"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" posts"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" Object."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"values"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(pages)."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"map"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(("}),e.jsx(s.span,{style:{color:"#E36209"},children:"page"}),e.jsx(s.span,{style:{color:"#24292E"},children:") "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"    const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"metadata"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" page.config"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"    const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" post"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      url: page.route,"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      title: metadata.title"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"    return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" post"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  })"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  globalContext.posts "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" posts"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+onCreateGlobalContext.server.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { GlobalContextServer } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" async"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" onCreateGlobalContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#E36209"},children:"globalContext"}),e.jsx(s.span,{style:{color:"#D73A49"},children:":"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" GlobalContextServer"}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" pages"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" globalContext.pages"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" posts"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" Object."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"values"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(pages)."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"map"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(("}),e.jsx(s.span,{style:{color:"#E36209"},children:"page"}),e.jsx(s.span,{style:{color:"#24292E"},children:") "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"    const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"metadata"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" page.config"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"    const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" post"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      url: page.route,"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      title: metadata.title"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"    return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" post"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  })"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  globalContext.posts "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" posts"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"declare"}),e.jsx(s.span,{style:{color:"#24292E"},children:" global {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  namespace"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Vike"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"    interface"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" GlobalContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#E36209"},children:"      posts"}),e.jsx(s.span,{style:{color:"#D73A49"},children:":"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#E36209"},children:"        url"}),e.jsx(s.span,{style:{color:"#D73A49"},children:":"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" string"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#E36209"},children:"        title"}),e.jsx(s.span,{style:{color:"#D73A49"},children:":"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" string"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      }[]"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})})]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"See also:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsxs(l,{href:"/globalContext#pages",children:["API > ",e.jsx(s.code,{children:"globalContext.pages"})]}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{href:"/onCreateGlobalContext"}),`
`]}),`
`]}),`
`]}),`
`,e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  passToClient: ["}),e.jsx(s.span,{style:{color:"#032F62"},children:"'posts'"}),e.jsx(s.span,{style:{color:"#24292E"},children:"]"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"   passToClient: ["}),e.jsx(s.span,{style:{color:"#032F62"},children:"'posts'"}),e.jsx(s.span,{style:{color:"#24292E"},children:"]"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"jsx","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"jsx","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+Layout.jsx"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Environment: server & client"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" React "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'react'"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { usePageContext } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike-react/usePageContext'"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" // or vike-{vue,solid}"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Layout"}),e.jsx(s.span,{style:{color:"#24292E"},children:"({ "}),e.jsx(s.span,{style:{color:"#E36209"},children:"children"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }) {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" pageContext"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" usePageContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"posts"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" pageContext.globalContext"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    <>"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      {"}),e.jsx(s.span,{style:{color:"#6A737D"},children:"/* Show the list of blog posts */"}),e.jsx(s.span,{style:{color:"#24292E"},children:"}"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      <"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"LeftSidebar"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"p"}),e.jsx(s.span,{style:{color:"#24292E"},children:">Blog posts:</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"p"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"ul"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"          {posts."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"map"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(("}),e.jsx(s.span,{style:{color:"#E36209"},children:"post"}),e.jsx(s.span,{style:{color:"#24292E"},children:") "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"            <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"li"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"              <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"a"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" href"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:"{post.url}>{post.title}</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"a"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"            </"}),e.jsx(s.span,{style:{color:"#22863A"},children:"li"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"          ))}"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        </"}),e.jsx(s.span,{style:{color:"#22863A"},children:"ul"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      </"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"LeftSidebar"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      {"}),e.jsx(s.span,{style:{color:"#6A737D"},children:"/* The page's content */"}),e.jsx(s.span,{style:{color:"#24292E"},children:"}"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      <"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"Content"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"h1"}),e.jsx(s.span,{style:{color:"#24292E"},children:">{title}</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"h1"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        {"}),e.jsx(s.span,{style:{color:"#6A737D"},children:"/* children is pageContext.Page which is the component defined by +Page.md */"}),e.jsx(s.span,{style:{color:"#24292E"},children:"}"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"        {children}"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      </"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"Content"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    </>"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  )"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"tsx","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"tsx","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+Layout.tsx"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Environment: server & client"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" React "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'react'"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { usePageContext } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike-react/usePageContext'"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" // or vike-{vue,solid}"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Layout"}),e.jsx(s.span,{style:{color:"#24292E"},children:"({ "}),e.jsx(s.span,{style:{color:"#E36209"},children:"children"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }"}),e.jsx(s.span,{style:{color:"#D73A49"},children:":"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#E36209"},children:"children"}),e.jsx(s.span,{style:{color:"#D73A49"},children:":"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" React"}),e.jsx(s.span,{style:{color:"#24292E"},children:"."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"ReactNode"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }) {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" pageContext"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" usePageContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"posts"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" pageContext.globalContext"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    <>"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      {"}),e.jsx(s.span,{style:{color:"#6A737D"},children:"/* Show the list of blog posts */"}),e.jsx(s.span,{style:{color:"#24292E"},children:"}"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      <"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"LeftSidebar"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"p"}),e.jsx(s.span,{style:{color:"#24292E"},children:">Blog posts:</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"p"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"ul"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"          {posts."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"map"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(("}),e.jsx(s.span,{style:{color:"#E36209"},children:"post"}),e.jsx(s.span,{style:{color:"#24292E"},children:") "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"            <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"li"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"              <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"a"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" href"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:"{post.url}>{post.title}</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"a"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"            </"}),e.jsx(s.span,{style:{color:"#22863A"},children:"li"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"          ))}"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        </"}),e.jsx(s.span,{style:{color:"#22863A"},children:"ul"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      </"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"LeftSidebar"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      {"}),e.jsx(s.span,{style:{color:"#6A737D"},children:"/* The page's content */"}),e.jsx(s.span,{style:{color:"#24292E"},children:"}"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      <"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"Content"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"h1"}),e.jsx(s.span,{style:{color:"#24292E"},children:">{title}</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"h1"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        {"}),e.jsx(s.span,{style:{color:"#6A737D"},children:"/* children is pageContext.Page which is the component defined by +Page.md */"}),e.jsx(s.span,{style:{color:"#24292E"},children:"}"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"        {children}"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      </"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"Content"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    </>"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  )"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})})]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"See also:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{href:"/Layout"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{href:"/usePageContext"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsxs(l,{href:"/pageContext#globalContext",children:["API > ",e.jsx(s.code,{children:"pageContext.globalContext"})]}),`
`]}),`
`]}),`
`]}),`
`,e.jsx("h3",{id:"with-a-custom-setting",children:"With a custom setting"}),`
`,e.jsxs(s.p,{children:["You can use ",e.jsx(l,{href:"/meta",children:e.jsx(s.code,{children:"meta"})})," to create a custom setting for defining ",e.jsx(l,{href:"#page-metadata",children:"page metadata"}),"."]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"mdx","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"mdx","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"// /pages/2024-new-year/+Page.mdx"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" metadata"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  author: {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    firstName: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'John'"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    lastName: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'Smith'"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    country: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'England'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#005CC5",fontWeight:"bold"},children:"## Some Markdown"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"This page uses "}),e.jsx(s.span,{style:{color:"#032F62"},children:"["}),e.jsx(s.span,{style:{color:"#24292E"},children:"markdown"}),e.jsx(s.span,{style:{color:"#032F62"},children:"]("}),e.jsx(s.span,{style:{color:"#032F62",textDecoration:"underline"},children:e.jsx(s.a,{href:"https://en.wikipedia.org/wiki/Markdown",children:"https://en.wikipedia.org/wiki/Markdown"})}),e.jsx(s.span,{style:{color:"#032F62"},children:")"}),e.jsx(s.span,{style:{color:"#24292E"},children:"."})]})]})})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:[e.jsx(s.a,{href:"https://mdxjs.com/",children:"MDX"})," allows you to export JavaScript values in ",e.jsx(s.code,{children:".mdx"})," files."]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["Usually, Vike forbids ",e.jsx(s.code,{children:"+Page.js"}),' files to have "side exports": the ',e.jsx(s.code,{children:"+Page.js"})," should only export the value of the ",e.jsxs(l,{href:"/Page",children:[e.jsx(s.code,{children:"Page"})," setting"]}),`.
But, for improved DX, Vike allows markdown files (such as `,e.jsx(s.code,{children:"+Page.mdx"}),") to export the value of ",e.jsx(l,{href:"/settings",children:"other settings"}),"."]}),`
`]}),`
`,e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Create +metadata setting"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  meta: {"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    metadata: {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      env: { server: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:", client: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Create +metadata setting"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  meta: {"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    metadata: {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      env: { server: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:", client: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsx("h3",{id:"with-frontmatter",children:"With frontmatter"}),`
`,e.jsxs(s.p,{children:["Some markdown processors have support for a so-called ",e.jsx(s.em,{children:"frontmatter"}),":"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"mdx","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"mdx","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"---"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#22863A"},children:"title"}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:"A Markdown Page"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#22863A"},children:"author"}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:"John Smith"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"---"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#005CC5",fontWeight:"bold"},children:"## Some Markdown"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"This page uses "}),e.jsx(s.span,{style:{color:"#032F62"},children:"["}),e.jsx(s.span,{style:{color:"#24292E"},children:"markdown"}),e.jsx(s.span,{style:{color:"#032F62"},children:"]("}),e.jsx(s.span,{style:{color:"#032F62",textDecoration:"underline"},children:e.jsx(s.a,{href:"https://en.wikipedia.org/wiki/Markdown",children:"https://en.wikipedia.org/wiki/Markdown"})}),e.jsx(s.span,{style:{color:"#032F62"},children:")"}),e.jsx(s.span,{style:{color:"#24292E"},children:"."})]})]})})}),`
`,e.jsxs(s.p,{children:["You can use such frontmatter to define ",e.jsx(l,{href:"#page-metadata",children:"page metadata"}),"."]}),`
`,e.jsx(c,{children:e.jsxs(s.p,{children:["We discourage using frontmatter for defining ",e.jsx(l,{href:"#global-metadata",children:"global metadata"}),", because loading all ",e.jsx(s.code,{children:"+Page.md"})," files at once ",e.jsx(t,{}),"."]})}),`
`,e.jsxs(s.p,{children:["The markdown processor exposes the data defined by the frontmatter as an export, for example ",e.jsx(s.code,{children:"export { frontmatter }"}),". You can access it by using ",e.jsx(l,{href:"/meta",children:e.jsx(s.code,{children:"meta"})})," to define a ",e.jsx(s.code,{children:"+frontmatter"})," setting (or whatever the name of the export is)."]}),`
`,e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  meta: {"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // Create new setting +frontmatter"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    frontmatter: {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      env: { server: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:", client: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  meta: {"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // Create new setting +frontmatter"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    frontmatter: {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      env: { server: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:", client: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`,e.jsxs(s.p,{children:["You can then use ",e.jsx(l,{href:"/pageContext#config",children:e.jsx(s.code,{children:"pageContext.config"})})," to access it:"]}),`
`,e.jsxs(n,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"jsx","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"jsx","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+Layout.jsx"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" React "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'react'"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { usePageContext } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike-react/usePageContext'"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" // or vike-{vue,solid}"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Layout"}),e.jsx(s.span,{style:{color:"#24292E"},children:"({ "}),e.jsx(s.span,{style:{color:"#E36209"},children:"children"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }) {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" pageContext"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" usePageContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"frontmatter"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" pageContext.config"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    <>"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"h1"}),e.jsx(s.span,{style:{color:"#24292E"},children:">{frontmatter.title}</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"h1"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      {children}"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"footer"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"p"}),e.jsx(s.span,{style:{color:"#24292E"},children:">Written by {frontmatter.author}.</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"p"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      </"}),e.jsx(s.span,{style:{color:"#22863A"},children:"footer"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    </>"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  )"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"tsx","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"tsx","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+Layout.tsx"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" React "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'react'"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { usePageContext } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike-react/usePageContext'"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" // or vike-{vue,solid}"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Layout"}),e.jsx(s.span,{style:{color:"#24292E"},children:"({ "}),e.jsx(s.span,{style:{color:"#E36209"},children:"children"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }"}),e.jsx(s.span,{style:{color:"#D73A49"},children:":"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#E36209"},children:"children"}),e.jsx(s.span,{style:{color:"#D73A49"},children:":"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" React"}),e.jsx(s.span,{style:{color:"#24292E"},children:"."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"ReactNode"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }) {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" pageContext"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" usePageContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"frontmatter"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" pageContext.config"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    <>"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"h1"}),e.jsx(s.span,{style:{color:"#24292E"},children:">{frontmatter.title}</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"h1"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      {children}"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"footer"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"p"}),e.jsx(s.span,{style:{color:"#24292E"},children:">Written by {frontmatter.author}.</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"p"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      </"}),e.jsx(s.span,{style:{color:"#22863A"},children:"footer"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    </>"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  )"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})})]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"See also:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{href:"/Layout"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{href:"/usePageContext"}),`
`]}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"examples",children:"Examples"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(p,{repo:"blankeos/gittydocs"})," - Documentation builder."]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{href:"/head-tags"}),`
`]}),`
`]})]})}function j(a={}){const{wrapper:s}={...o(),...a.components};return s?e.jsx(s,{...a,children:e.jsx(i,{...a})}):i(a)}function y(a,s){throw new Error("Expected component `"+a+"` to be defined: you likely forgot to import, pass, or provide it.")}const g=Object.freeze(Object.defineProperty({__proto__:null,default:j,pageSectionsExport:x},Symbol.toStringTag,{value:"Module"})),R={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:h}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:d}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/markdown/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:g}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{R as configValuesSerialized};
