import{o,a as i}from"../chunks/chunk-DsZpnZjS.js";import{j as s,b as r}from"../chunks/chunk-CiaJ2bI_.js";import{L as l}from"../chunks/chunk-BioMW-uj.js";/* empty css                      */import{W as d}from"../chunks/chunk-BUwrJw4V.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as c}from"../chunks/chunk-DebnAcp4.js";import{V as h}from"../chunks/chunk-DaagcknU.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */const p=[{pageSectionId:"installation",pageSectionLevel:2,pageSectionTitle:"Installation"},{pageSectionId:"vue",pageSectionLevel:3,pageSectionTitle:"Vue"},{pageSectionId:"react",pageSectionLevel:3,pageSectionTitle:"React"},{pageSectionId:"metadata",pageSectionLevel:2,pageSectionTitle:"Metadata"},{pageSectionId:"global-metadata",pageSectionLevel:4,pageSectionTitle:"Global metadata"},{pageSectionId:"local-metadata",pageSectionLevel:4,pageSectionTitle:"Local metadata"},{pageSectionId:"with-a-metadata-js-file",pageSectionLevel:3,pageSectionTitle:"With a `metadata.js` file"},{pageSectionId:"with-a-custom-setting-eager",pageSectionLevel:3,pageSectionTitle:"With a custom setting (eager)"},{pageSectionId:"with-a-custom-setting",pageSectionLevel:3,pageSectionTitle:"With a custom setting"},{pageSectionId:"with-frontmatter",pageSectionLevel:3,pageSectionTitle:"With frontmatter"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function t(a){const e={a:"a",blockquote:"blockquote",code:"code",em:"em",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...c(),...a.components},{CodeSnippets:n}=e;return n||j("CodeSnippets"),s.jsxs(s.Fragment,{children:[s.jsx("h2",{id:"installation",children:"Installation"}),`
`,s.jsxs(e.p,{children:["You can use ",s.jsx(e.a,{href:"https://en.wikipedia.org/wiki/Markdown",children:"Markdown"})," by adding one of the following ",s.jsx(e.a,{href:"https://vitejs.dev/plugins/",children:"Vite plugins"}),"."]}),`
`,s.jsx("h3",{id:"vue",children:"Vue"}),`
`,s.jsx(e.p,{children:"Markdown plugins compatible with Vue:"}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsx(e.li,{children:s.jsx(e.a,{href:"https://mdxjs.com/packages/rollup/",children:s.jsx(e.code,{children:"@mdx-js/rollup"})})}),`
`,s.jsx(e.li,{children:s.jsx(e.a,{href:"https://github.com/unplugin/unplugin-vue-markdown",children:s.jsx(e.code,{children:"unplugin-vue-markdown"})})}),`
`,s.jsx(e.li,{children:s.jsx(e.a,{href:"https://github.com/antfu/vite-plugin-md",children:s.jsx(e.code,{children:"vite-plugin-md"})})}),`
`]}),`
`,s.jsx(e.p,{children:"Example:"}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[`
`,s.jsx(r,{path:"/examples/vue-full/vite.config.ts"}),`
`]}),`
`,s.jsxs(e.li,{children:[`
`,s.jsx(r,{path:"/examples/vue-full/pages/markdown/+Page.md"}),`
`]}),`
`]}),`
`,s.jsx("h3",{id:"react",children:"React"}),`
`,s.jsx(e.p,{children:"Markdown plugins compatible with React:"}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsx(e.li,{children:s.jsx(e.a,{href:"https://github.com/cyco130/vite-plugin-mdx/",children:s.jsx(e.code,{children:"@cyco130/vite-plugin-mdx"})})}),`
`,s.jsx(e.li,{children:s.jsx(e.a,{href:"https://mdxjs.com/packages/rollup/",children:s.jsx(e.code,{children:"@mdx-js/rollup"})})}),`
`]}),`
`,s.jsx(e.p,{children:"Example:"}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[`
`,s.jsx(r,{path:"/examples/react-full/vite.config.ts"}),`
`]}),`
`,s.jsxs(e.li,{children:[`
`,s.jsx(r,{path:"/examples/react-full/pages/markdown/+Page.mdx"}),`
`]}),`
`]}),`
`,s.jsx("h2",{id:"metadata",children:"Metadata"}),`
`,s.jsx(e.p,{children:"There are several techniques for defining markdown metadata such as publishing date and author."}),`
`,s.jsx(e.p,{children:"The preferred technique depends on whether you want to define global or local metadata."}),`
`,s.jsx("h4",{id:"global-metadata",children:"Global metadata"}),`
`,s.jsxs(e.blockquote,{children:[`
`,s.jsxs(e.p,{children:[s.jsx(e.strong,{children:"What is global metadata?"})," For example, you want to show a list of all your blog posts always on the left side of your website."]}),`
`,s.jsx(e.pre,{children:s.jsx(e.code,{children:`2024-01-01 New Year 2024 Resolution
2023-12-20 Wrapping up 2023
2023-06-15 My summer 2023
`})}),`
`,s.jsxs(e.p,{children:["Because this list is shown on the left of every page, the publishing date and title of all blog posts is needed for rendering any page: the metadata needs to be accessible ",s.jsx(e.em,{children:"globally"}),"."]}),`
`]}),`
`,s.jsx(e.p,{children:"For global metadata, we recommend:"}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[`
`,s.jsx(l,{href:"#with-a-metadata-js-file"}),`
`]}),`
`,s.jsxs(e.li,{children:[`
`,s.jsx(l,{href:"#with-a-custom-setting-eager"}),`
`]}),`
`]}),`
`,s.jsx(d,{children:s.jsxs(e.p,{children:["You may be tempted to use ",s.jsx(e.a,{href:"https://vitejs.dev/guide/features.html#glob-import",children:s.jsx(e.code,{children:"import.meta.glob()"})})," to retrieve the metadata of all pages, but we discourage this approach: loading all markdown files at once ",s.jsx(h,{}),"."]})}),`
`,s.jsx("h4",{id:"local-metadata",children:"Local metadata"}),`
`,s.jsxs(e.blockquote,{children:[`
`,s.jsxs(e.p,{children:[s.jsx(e.strong,{children:"What is local metadata?"}),"  For example, you want to show detailed information below a blog post, such as the author's name. This metadata is shown only for that page and, therefore, needs to be accessible only ",s.jsx(e.em,{children:"locally"}),"."]}),`
`]}),`
`,s.jsx(e.p,{children:"For local metadata, we recommend:"}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[`
`,s.jsx(l,{href:"#with-a-custom-setting"}),`
`]}),`
`,s.jsxs(e.li,{children:[`
`,s.jsx(l,{href:"#with-frontmatter"}),`
`]}),`
`]}),`
`,s.jsxs("h3",{id:"with-a-metadata-js-file",children:["With a ",s.jsx("code",{children:"metadata.js"})," file"]}),`
`,s.jsxs(e.p,{children:["A simple way to define metadata is to define a ",s.jsx(e.code,{children:"metadata.js"})," file that contains ",s.jsx(l,{href:"#metadata:~:text=What%20is%20global%20metadata",children:"global metadata"}),"."]}),`
`,s.jsxs(n,{children:[s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// /pages/metadata.js"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// This metadata is available to every page"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"export"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" const"}),s.jsx(e.span,{style:{color:"#005CC5"},children:" metadata"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" ="}),s.jsx(e.span,{style:{color:"#24292E"},children:" ["})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  {"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"    url: "}),s.jsx(e.span,{style:{color:"#032F62"},children:"'/blog/introducing-vike'"}),s.jsx(e.span,{style:{color:"#24292E"},children:","})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"    title: "}),s.jsx(e.span,{style:{color:"#032F62"},children:"'Introducing Vike'"}),s.jsx(e.span,{style:{color:"#24292E"},children:","})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"    date: "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"new"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" Date"}),s.jsx(e.span,{style:{color:"#24292E"},children:"("}),s.jsx(e.span,{style:{color:"#032F62"},children:"'2024-01-01'"}),s.jsx(e.span,{style:{color:"#24292E"},children:")"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  },"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  {"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"    url: "}),s.jsx(e.span,{style:{color:"#032F62"},children:"'/blog/v1'"}),s.jsx(e.span,{style:{color:"#24292E"},children:","})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"    title: "}),s.jsx(e.span,{style:{color:"#032F62"},children:"'v1.0.0 release'"}),s.jsx(e.span,{style:{color:"#24292E"},children:","})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"    date: "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"new"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" Date"}),s.jsx(e.span,{style:{color:"#24292E"},children:"("}),s.jsx(e.span,{style:{color:"#032F62"},children:"'2025-07-01'"}),s.jsx(e.span,{style:{color:"#24292E"},children:")"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  }"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"]"})})]})})}),s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// /pages/metadata.ts"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// This metadata is available to every page"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"export"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" const"}),s.jsx(e.span,{style:{color:"#005CC5"},children:" metadata"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" ="}),s.jsx(e.span,{style:{color:"#24292E"},children:" ["})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  {"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"    url: "}),s.jsx(e.span,{style:{color:"#032F62"},children:"'/blog/introducing-vike'"}),s.jsx(e.span,{style:{color:"#24292E"},children:","})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"    title: "}),s.jsx(e.span,{style:{color:"#032F62"},children:"'Introducing Vike'"}),s.jsx(e.span,{style:{color:"#24292E"},children:","})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"    date: "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"new"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" Date"}),s.jsx(e.span,{style:{color:"#24292E"},children:"("}),s.jsx(e.span,{style:{color:"#032F62"},children:"'2024-01-01'"}),s.jsx(e.span,{style:{color:"#24292E"},children:")"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  },"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  {"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"    url: "}),s.jsx(e.span,{style:{color:"#032F62"},children:"'/blog/v1'"}),s.jsx(e.span,{style:{color:"#24292E"},children:","})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"    title: "}),s.jsx(e.span,{style:{color:"#032F62"},children:"'v1.0.0 release'"}),s.jsx(e.span,{style:{color:"#24292E"},children:","})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"    date: "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"new"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" Date"}),s.jsx(e.span,{style:{color:"#24292E"},children:"("}),s.jsx(e.span,{style:{color:"#032F62"},children:"'2025-07-01'"}),s.jsx(e.span,{style:{color:"#24292E"},children:")"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  }"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"]"})})]})})})]}),`
`,s.jsxs(n,{children:[s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"jsx","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"jsx","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// /pages/+Layout.jsx"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"import"}),s.jsx(e.span,{style:{color:"#24292E"},children:" React "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"from"}),s.jsx(e.span,{style:{color:"#032F62"},children:" 'react'"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"import"}),s.jsx(e.span,{style:{color:"#24292E"},children:" { metadata } "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"from"}),s.jsx(e.span,{style:{color:"#032F62"},children:" './metadata'"})]}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"export"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" function"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" Layout"}),s.jsx(e.span,{style:{color:"#24292E"},children:"({ "}),s.jsx(e.span,{style:{color:"#E36209"},children:"children"}),s.jsx(e.span,{style:{color:"#24292E"},children:" }) {"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"  // Current URL"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"  const"}),s.jsx(e.span,{style:{color:"#24292E"},children:" { "}),s.jsx(e.span,{style:{color:"#005CC5"},children:"urlPathname"}),s.jsx(e.span,{style:{color:"#24292E"},children:" } "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"="}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" usePageContext"}),s.jsx(e.span,{style:{color:"#24292E"},children:"()"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"  // The page's metadata"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"  const"}),s.jsx(e.span,{style:{color:"#24292E"},children:" { "}),s.jsx(e.span,{style:{color:"#005CC5"},children:"title"}),s.jsx(e.span,{style:{color:"#24292E"},children:" } "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"="}),s.jsx(e.span,{style:{color:"#24292E"},children:" metadata."}),s.jsx(e.span,{style:{color:"#6F42C1"},children:"find"}),s.jsx(e.span,{style:{color:"#24292E"},children:"(({ "}),s.jsx(e.span,{style:{color:"#E36209"},children:"url"}),s.jsx(e.span,{style:{color:"#24292E"},children:" }) "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"=>"}),s.jsx(e.span,{style:{color:"#24292E"},children:" url "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"==="}),s.jsx(e.span,{style:{color:"#24292E"},children:" urlPathname)"})]}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"  return"}),s.jsx(e.span,{style:{color:"#24292E"},children:" ("})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    <>"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      {"}),s.jsx(e.span,{style:{color:"#6A737D"},children:"/* Show the list of blog posts */"}),s.jsx(e.span,{style:{color:"#24292E"},children:"}"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      <"}),s.jsx(e.span,{style:{color:"#005CC5"},children:"LeftSidebar"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"p"}),s.jsx(e.span,{style:{color:"#24292E"},children:">Blog posts:</"}),s.jsx(e.span,{style:{color:"#22863A"},children:"p"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"ul"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"          {metadata."}),s.jsx(e.span,{style:{color:"#6F42C1"},children:"map"}),s.jsx(e.span,{style:{color:"#24292E"},children:"(({ "}),s.jsx(e.span,{style:{color:"#E36209"},children:"title"}),s.jsx(e.span,{style:{color:"#24292E"},children:", "}),s.jsx(e.span,{style:{color:"#E36209"},children:"url"}),s.jsx(e.span,{style:{color:"#24292E"},children:", "}),s.jsx(e.span,{style:{color:"#E36209"},children:"date"}),s.jsx(e.span,{style:{color:"#24292E"},children:" }) "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"=>"}),s.jsx(e.span,{style:{color:"#24292E"},children:" ("})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"            <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"li"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"              <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"a"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" href"}),s.jsx(e.span,{style:{color:"#D73A49"},children:"="}),s.jsx(e.span,{style:{color:"#24292E"},children:"{url}>{data "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"+"}),s.jsx(e.span,{style:{color:"#24292E"},children:" title}</"}),s.jsx(e.span,{style:{color:"#22863A"},children:"a"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"            </"}),s.jsx(e.span,{style:{color:"#22863A"},children:"li"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"          ))}"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        </"}),s.jsx(e.span,{style:{color:"#22863A"},children:"ul"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      </"}),s.jsx(e.span,{style:{color:"#005CC5"},children:"LeftSidebar"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      {"}),s.jsx(e.span,{style:{color:"#6A737D"},children:"/* The page's content */"}),s.jsx(e.span,{style:{color:"#24292E"},children:"}"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      <"}),s.jsx(e.span,{style:{color:"#005CC5"},children:"Content"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"h1"}),s.jsx(e.span,{style:{color:"#24292E"},children:">{title}</"}),s.jsx(e.span,{style:{color:"#22863A"},children:"h1"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        {"}),s.jsx(e.span,{style:{color:"#6A737D"},children:"/* children is pageContext.Page which is the component defined by +Page.md */"}),s.jsx(e.span,{style:{color:"#24292E"},children:"}"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"        {children}"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      </"}),s.jsx(e.span,{style:{color:"#005CC5"},children:"Content"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    </>"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  )"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"}"})})]})})}),s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"tsx","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"tsx","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// /pages/+Layout.tsx"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"import"}),s.jsx(e.span,{style:{color:"#24292E"},children:" React "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"from"}),s.jsx(e.span,{style:{color:"#032F62"},children:" 'react'"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"import"}),s.jsx(e.span,{style:{color:"#24292E"},children:" { metadata } "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"from"}),s.jsx(e.span,{style:{color:"#032F62"},children:" './metadata'"})]}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"export"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" function"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" Layout"}),s.jsx(e.span,{style:{color:"#24292E"},children:"({ "}),s.jsx(e.span,{style:{color:"#E36209"},children:"children"}),s.jsx(e.span,{style:{color:"#24292E"},children:" }"}),s.jsx(e.span,{style:{color:"#D73A49"},children:":"}),s.jsx(e.span,{style:{color:"#24292E"},children:" { "}),s.jsx(e.span,{style:{color:"#E36209"},children:"children"}),s.jsx(e.span,{style:{color:"#D73A49"},children:":"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" React"}),s.jsx(e.span,{style:{color:"#24292E"},children:"."}),s.jsx(e.span,{style:{color:"#6F42C1"},children:"ReactNode"}),s.jsx(e.span,{style:{color:"#24292E"},children:" }) {"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"  // Current URL"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"  const"}),s.jsx(e.span,{style:{color:"#24292E"},children:" { "}),s.jsx(e.span,{style:{color:"#005CC5"},children:"urlPathname"}),s.jsx(e.span,{style:{color:"#24292E"},children:" } "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"="}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" usePageContext"}),s.jsx(e.span,{style:{color:"#24292E"},children:"()"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"  // The page's metadata"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"  const"}),s.jsx(e.span,{style:{color:"#24292E"},children:" { "}),s.jsx(e.span,{style:{color:"#005CC5"},children:"title"}),s.jsx(e.span,{style:{color:"#24292E"},children:" } "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"="}),s.jsx(e.span,{style:{color:"#24292E"},children:" metadata."}),s.jsx(e.span,{style:{color:"#6F42C1"},children:"find"}),s.jsx(e.span,{style:{color:"#24292E"},children:"(({ "}),s.jsx(e.span,{style:{color:"#E36209"},children:"url"}),s.jsx(e.span,{style:{color:"#24292E"},children:" }) "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"=>"}),s.jsx(e.span,{style:{color:"#24292E"},children:" url "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"==="}),s.jsx(e.span,{style:{color:"#24292E"},children:" urlPathname)"})]}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"  return"}),s.jsx(e.span,{style:{color:"#24292E"},children:" ("})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    <>"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      {"}),s.jsx(e.span,{style:{color:"#6A737D"},children:"/* Show the list of blog posts */"}),s.jsx(e.span,{style:{color:"#24292E"},children:"}"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      <"}),s.jsx(e.span,{style:{color:"#005CC5"},children:"LeftSidebar"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"p"}),s.jsx(e.span,{style:{color:"#24292E"},children:">Blog posts:</"}),s.jsx(e.span,{style:{color:"#22863A"},children:"p"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"ul"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"          {metadata."}),s.jsx(e.span,{style:{color:"#6F42C1"},children:"map"}),s.jsx(e.span,{style:{color:"#24292E"},children:"(({ "}),s.jsx(e.span,{style:{color:"#E36209"},children:"title"}),s.jsx(e.span,{style:{color:"#24292E"},children:", "}),s.jsx(e.span,{style:{color:"#E36209"},children:"url"}),s.jsx(e.span,{style:{color:"#24292E"},children:", "}),s.jsx(e.span,{style:{color:"#E36209"},children:"date"}),s.jsx(e.span,{style:{color:"#24292E"},children:" }) "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"=>"}),s.jsx(e.span,{style:{color:"#24292E"},children:" ("})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"            <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"li"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"              <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"a"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" href"}),s.jsx(e.span,{style:{color:"#D73A49"},children:"="}),s.jsx(e.span,{style:{color:"#24292E"},children:"{url}>{data "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"+"}),s.jsx(e.span,{style:{color:"#24292E"},children:" title}</"}),s.jsx(e.span,{style:{color:"#22863A"},children:"a"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"            </"}),s.jsx(e.span,{style:{color:"#22863A"},children:"li"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"          ))}"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        </"}),s.jsx(e.span,{style:{color:"#22863A"},children:"ul"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      </"}),s.jsx(e.span,{style:{color:"#005CC5"},children:"LeftSidebar"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      {"}),s.jsx(e.span,{style:{color:"#6A737D"},children:"/* The page's content */"}),s.jsx(e.span,{style:{color:"#24292E"},children:"}"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      <"}),s.jsx(e.span,{style:{color:"#005CC5"},children:"Content"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"h1"}),s.jsx(e.span,{style:{color:"#24292E"},children:">{title}</"}),s.jsx(e.span,{style:{color:"#22863A"},children:"h1"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        {"}),s.jsx(e.span,{style:{color:"#6A737D"},children:"/* children is pageContext.Page which is the component defined by +Page.md */"}),s.jsx(e.span,{style:{color:"#24292E"},children:"}"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"        {children}"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      </"}),s.jsx(e.span,{style:{color:"#005CC5"},children:"Content"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    </>"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  )"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"}"})})]})})})]}),`
`,s.jsxs(e.blockquote,{children:[`
`,s.jsx(e.p,{children:"See also:"}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[`
`,s.jsx(l,{href:"/Layout"}),`
`]}),`
`,s.jsxs(e.li,{children:[`
`,s.jsx(l,{href:"/usePageContext"}),`
`]}),`
`]}),`
`]}),`
`,s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"md","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"md","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"// /pages/blog/introducing-vike/+Page.md"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"We're thrilled to officially introduce Vike."})})]})})}),`
`,s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"md","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"md","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"// /pages/blog/v1/+Page.md"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"The "}),s.jsx(e.span,{style:{color:"#005CC5"},children:"`v1.0.0`"}),s.jsx(e.span,{style:{color:"#24292E"},children:" release signals that Vike is ready for prime time: it now includes"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"all essentials you'd expect from a frontend framework with a robust design."})})]})})}),`
`,s.jsx("h3",{id:"with-a-custom-setting-eager",children:"With a custom setting (eager)"}),`
`,s.jsxs(e.p,{children:["You can use ",s.jsx(l,{href:"/meta",children:s.jsx(e.code,{children:"meta"})})," to create a custom setting for defining ",s.jsx(l,{href:"#metadata:~:text=What%20is%20local%20metadata",children:"global metadata"}),"."]}),`
`,s.jsxs(n,{children:[s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"yaml","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"yaml","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#032F62"},children:"/pages/+config.js"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#032F62"},children:"/pages/+onCreateGlobalContext.server.js"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#032F62"},children:"/pages/+Layout.jsx"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#032F62"},children:"/pages/2024-new-year/+Page.mdx"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#032F62"},children:"/pages/2024-new-year/+metadata.js"})})]})})}),s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"yaml","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"yaml","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#032F62"},children:"/pages/+config.ts"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#032F62"},children:"/pages/+onCreateGlobalContext.server.ts"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#032F62"},children:"/pages/+Layout.tsx"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#032F62"},children:"/pages/2024-new-year/+Page.mdx"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#032F62"},children:"/pages/2024-new-year/+metadata.ts"})})]})})})]}),`
`,s.jsxs(n,{children:[s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// /pages/+config.js"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"export"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" default"}),s.jsx(e.span,{style:{color:"#24292E"},children:" {"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  meta: {"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"    // Create +metadata setting"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    metadata: {"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"      // Make +metadata available to all pages"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      eager: "}),s.jsx(e.span,{style:{color:"#005CC5"},children:"true"}),s.jsx(e.span,{style:{color:"#24292E"},children:","})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"      env: {"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        server: "}),s.jsx(e.span,{style:{color:"#005CC5"},children:"true"}),s.jsx(e.span,{style:{color:"#24292E"},children:","})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"        // Instead of `client: true`, we use onCreateGlobalContext() with passToClient to"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"        // be able to determine exactly what metadata is sent to the client-side."})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        client: "}),s.jsx(e.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"      }"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    }"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  },"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  passToClient: ["})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"    // Make globalContext.posts available on the client-side"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#032F62"},children:"    'posts'"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  ]"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"}"})})]})})}),s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// /pages/+config.ts"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"import"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" type"}),s.jsx(e.span,{style:{color:"#24292E"},children:" { Config } "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"from"}),s.jsx(e.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"export"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" default"}),s.jsx(e.span,{style:{color:"#24292E"},children:" {"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  meta: {"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"    // Create +metadata setting"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    metadata: {"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"      // Make +metadata available to all pages"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      eager: "}),s.jsx(e.span,{style:{color:"#005CC5"},children:"true"}),s.jsx(e.span,{style:{color:"#24292E"},children:","})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"      env: {"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        server: "}),s.jsx(e.span,{style:{color:"#005CC5"},children:"true"}),s.jsx(e.span,{style:{color:"#24292E"},children:","})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"        // Instead of `client: true`, we use onCreateGlobalContext() with passToClient to"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"        // be able to determine exactly what metadata is sent to the client-side."})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        client: "}),s.jsx(e.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"      }"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    }"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  },"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  passToClient: ["})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"    // Make globalContext.posts available on the client-side"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#032F62"},children:"    'posts'"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  ]"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"} "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"satisfies"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})]}),`
`,s.jsxs(e.blockquote,{children:[`
`,s.jsxs(e.p,{children:["When setting ",s.jsx(e.code,{children:"eager: true"})," the setting is available globally to all pages."]}),`
`]}),`
`,s.jsxs(n,{children:[s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// /pages/2024-new-year/+metadata.js"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"export"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" const"}),s.jsx(e.span,{style:{color:"#005CC5"},children:" metadata"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" ="}),s.jsx(e.span,{style:{color:"#24292E"},children:" {"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"  title: "}),s.jsx(e.span,{style:{color:"#032F62"},children:"'New Year 2024 Resolution'"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"}"})})]})})}),s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// /pages/2024-new-year/+metadata.ts"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"export"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" const"}),s.jsx(e.span,{style:{color:"#005CC5"},children:" metadata"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" ="}),s.jsx(e.span,{style:{color:"#24292E"},children:" {"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"  title: "}),s.jsx(e.span,{style:{color:"#032F62"},children:"'New Year 2024 Resolution'"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"}"})})]})})})]}),`
`,s.jsxs(e.blockquote,{children:[`
`,s.jsxs(e.p,{children:["Unlike in the example ",s.jsx(l,{href:"#with-a-custom-setting",children:"below"})," you cannot define ",s.jsx(e.code,{children:"+metadata"})," inside ",s.jsx(e.code,{children:"+Page.mdx"}),", because ",s.jsx(e.code,{children:"+Page.mdx"})," is ",s.jsx(l,{href:"/lazy-transpiling",children:"only loaded when rendering that page"}),". Consequently, the content of ",s.jsx(e.code,{children:"+Page.mdx"})," isn't available when rendering another page."]}),`
`]}),`
`,s.jsxs(n,{children:[s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// /pages/+onCreateGlobalContext.server.js"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"export"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" async"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" function"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" onCreateGlobalContext"}),s.jsx(e.span,{style:{color:"#24292E"},children:"("}),s.jsx(e.span,{style:{color:"#E36209"},children:"globalContext"}),s.jsx(e.span,{style:{color:"#24292E"},children:") {"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"  const"}),s.jsx(e.span,{style:{color:"#005CC5"},children:" pages"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" ="}),s.jsx(e.span,{style:{color:"#24292E"},children:" globalContext.pages"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"  const"}),s.jsx(e.span,{style:{color:"#005CC5"},children:" posts"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" ="}),s.jsx(e.span,{style:{color:"#24292E"},children:" Object."}),s.jsx(e.span,{style:{color:"#6F42C1"},children:"values"}),s.jsx(e.span,{style:{color:"#24292E"},children:"(pages)."}),s.jsx(e.span,{style:{color:"#6F42C1"},children:"map"}),s.jsx(e.span,{style:{color:"#24292E"},children:"(("}),s.jsx(e.span,{style:{color:"#E36209"},children:"page"}),s.jsx(e.span,{style:{color:"#24292E"},children:") "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"=>"}),s.jsx(e.span,{style:{color:"#24292E"},children:" {"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"    const"}),s.jsx(e.span,{style:{color:"#24292E"},children:" { "}),s.jsx(e.span,{style:{color:"#005CC5"},children:"metadata"}),s.jsx(e.span,{style:{color:"#24292E"},children:" } "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"="}),s.jsx(e.span,{style:{color:"#24292E"},children:" page.config"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"    const"}),s.jsx(e.span,{style:{color:"#005CC5"},children:" post"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" ="}),s.jsx(e.span,{style:{color:"#24292E"},children:" {"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"      url: page.route,"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"      title: metadata.title"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    }"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"    return"}),s.jsx(e.span,{style:{color:"#24292E"},children:" post"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  })"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"  globalContext.posts "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"="}),s.jsx(e.span,{style:{color:"#24292E"},children:" posts"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"}"})})]})})}),s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// /pages/+onCreateGlobalContext.server.ts"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"import"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" type"}),s.jsx(e.span,{style:{color:"#24292E"},children:" { GlobalContextServer } "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"from"}),s.jsx(e.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"export"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" async"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" function"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" onCreateGlobalContext"}),s.jsx(e.span,{style:{color:"#24292E"},children:"("}),s.jsx(e.span,{style:{color:"#E36209"},children:"globalContext"}),s.jsx(e.span,{style:{color:"#D73A49"},children:":"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" GlobalContextServer"}),s.jsx(e.span,{style:{color:"#24292E"},children:") {"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"  const"}),s.jsx(e.span,{style:{color:"#005CC5"},children:" pages"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" ="}),s.jsx(e.span,{style:{color:"#24292E"},children:" globalContext.pages"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"  const"}),s.jsx(e.span,{style:{color:"#005CC5"},children:" posts"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" ="}),s.jsx(e.span,{style:{color:"#24292E"},children:" Object."}),s.jsx(e.span,{style:{color:"#6F42C1"},children:"values"}),s.jsx(e.span,{style:{color:"#24292E"},children:"(pages)."}),s.jsx(e.span,{style:{color:"#6F42C1"},children:"map"}),s.jsx(e.span,{style:{color:"#24292E"},children:"(("}),s.jsx(e.span,{style:{color:"#E36209"},children:"page"}),s.jsx(e.span,{style:{color:"#24292E"},children:") "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"=>"}),s.jsx(e.span,{style:{color:"#24292E"},children:" {"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"    const"}),s.jsx(e.span,{style:{color:"#24292E"},children:" { "}),s.jsx(e.span,{style:{color:"#005CC5"},children:"metadata"}),s.jsx(e.span,{style:{color:"#24292E"},children:" } "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"="}),s.jsx(e.span,{style:{color:"#24292E"},children:" page.config"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"    const"}),s.jsx(e.span,{style:{color:"#005CC5"},children:" post"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" ="}),s.jsx(e.span,{style:{color:"#24292E"},children:" {"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"      url: page.route,"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"      title: metadata.title"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    }"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"    return"}),s.jsx(e.span,{style:{color:"#24292E"},children:" post"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  })"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"  globalContext.posts "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"="}),s.jsx(e.span,{style:{color:"#24292E"},children:" posts"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"}"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"declare"}),s.jsx(e.span,{style:{color:"#24292E"},children:" global {"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"  namespace"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" Vike"}),s.jsx(e.span,{style:{color:"#24292E"},children:" {"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"    interface"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" GlobalContext"}),s.jsx(e.span,{style:{color:"#24292E"},children:" {"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#E36209"},children:"      posts"}),s.jsx(e.span,{style:{color:"#D73A49"},children:":"}),s.jsx(e.span,{style:{color:"#24292E"},children:" {"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#E36209"},children:"        url"}),s.jsx(e.span,{style:{color:"#D73A49"},children:":"}),s.jsx(e.span,{style:{color:"#005CC5"},children:" string"}),s.jsx(e.span,{style:{color:"#24292E"},children:","})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#E36209"},children:"        title"}),s.jsx(e.span,{style:{color:"#D73A49"},children:":"}),s.jsx(e.span,{style:{color:"#005CC5"},children:" string"}),s.jsx(e.span,{style:{color:"#24292E"},children:","})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"      }[]"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    }"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  }"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"}"})})]})})})]}),`
`,s.jsxs(e.blockquote,{children:[`
`,s.jsx(e.p,{children:"See also:"}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[`
`,s.jsxs(l,{href:"/globalContext#pages",children:["API > ",s.jsx(e.code,{children:"globalContext.pages"})]}),`
`]}),`
`,s.jsxs(e.li,{children:[`
`,s.jsx(l,{href:"/onCreateGlobalContext"}),`
`]}),`
`]}),`
`]}),`
`,s.jsxs(n,{children:[s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"export"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" default"}),s.jsx(e.span,{style:{color:"#24292E"},children:" {"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"  passToClient: ["}),s.jsx(e.span,{style:{color:"#032F62"},children:"'posts'"}),s.jsx(e.span,{style:{color:"#24292E"},children:"]"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"}"})})]})})}),s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"import"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" type"}),s.jsx(e.span,{style:{color:"#24292E"},children:" { Config } "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"from"}),s.jsx(e.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"export"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" default"}),s.jsx(e.span,{style:{color:"#24292E"},children:" {"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"   passToClient: ["}),s.jsx(e.span,{style:{color:"#032F62"},children:"'posts'"}),s.jsx(e.span,{style:{color:"#24292E"},children:"]"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"} "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"satisfies"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})]}),`
`,s.jsxs(n,{children:[s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"jsx","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"jsx","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// /pages/+Layout.jsx"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// Environment: server & client"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"import"}),s.jsx(e.span,{style:{color:"#24292E"},children:" React "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"from"}),s.jsx(e.span,{style:{color:"#032F62"},children:" 'react'"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"import"}),s.jsx(e.span,{style:{color:"#24292E"},children:" { usePageContext } "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"from"}),s.jsx(e.span,{style:{color:"#032F62"},children:" 'vike-react/usePageContext'"}),s.jsx(e.span,{style:{color:"#6A737D"},children:" // or vike-{vue,solid}"})]}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"export"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" function"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" Layout"}),s.jsx(e.span,{style:{color:"#24292E"},children:"({ "}),s.jsx(e.span,{style:{color:"#E36209"},children:"children"}),s.jsx(e.span,{style:{color:"#24292E"},children:" }) {"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"  const"}),s.jsx(e.span,{style:{color:"#005CC5"},children:" pageContext"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" ="}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" usePageContext"}),s.jsx(e.span,{style:{color:"#24292E"},children:"()"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"  const"}),s.jsx(e.span,{style:{color:"#24292E"},children:" { "}),s.jsx(e.span,{style:{color:"#005CC5"},children:"posts"}),s.jsx(e.span,{style:{color:"#24292E"},children:" } "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"="}),s.jsx(e.span,{style:{color:"#24292E"},children:" pageContext.globalContext"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"  return"}),s.jsx(e.span,{style:{color:"#24292E"},children:" ("})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    <>"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      {"}),s.jsx(e.span,{style:{color:"#6A737D"},children:"/* Show the list of blog posts */"}),s.jsx(e.span,{style:{color:"#24292E"},children:"}"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      <"}),s.jsx(e.span,{style:{color:"#005CC5"},children:"LeftSidebar"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"p"}),s.jsx(e.span,{style:{color:"#24292E"},children:">Blog posts:</"}),s.jsx(e.span,{style:{color:"#22863A"},children:"p"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"ul"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"          {posts."}),s.jsx(e.span,{style:{color:"#6F42C1"},children:"map"}),s.jsx(e.span,{style:{color:"#24292E"},children:"(("}),s.jsx(e.span,{style:{color:"#E36209"},children:"post"}),s.jsx(e.span,{style:{color:"#24292E"},children:") "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"=>"}),s.jsx(e.span,{style:{color:"#24292E"},children:" ("})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"            <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"li"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"              <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"a"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" href"}),s.jsx(e.span,{style:{color:"#D73A49"},children:"="}),s.jsx(e.span,{style:{color:"#24292E"},children:"{post.url}>{post.title}</"}),s.jsx(e.span,{style:{color:"#22863A"},children:"a"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"            </"}),s.jsx(e.span,{style:{color:"#22863A"},children:"li"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"          ))}"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        </"}),s.jsx(e.span,{style:{color:"#22863A"},children:"ul"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      </"}),s.jsx(e.span,{style:{color:"#005CC5"},children:"LeftSidebar"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      {"}),s.jsx(e.span,{style:{color:"#6A737D"},children:"/* The page's content */"}),s.jsx(e.span,{style:{color:"#24292E"},children:"}"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      <"}),s.jsx(e.span,{style:{color:"#005CC5"},children:"Content"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"h1"}),s.jsx(e.span,{style:{color:"#24292E"},children:">{title}</"}),s.jsx(e.span,{style:{color:"#22863A"},children:"h1"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        {"}),s.jsx(e.span,{style:{color:"#6A737D"},children:"/* children is pageContext.Page which is the component defined by +Page.mdx */"}),s.jsx(e.span,{style:{color:"#24292E"},children:"}"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"        {children}"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      </"}),s.jsx(e.span,{style:{color:"#005CC5"},children:"Content"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    </>"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  )"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"}"})})]})})}),s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"tsx","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"tsx","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// /pages/+Layout.tsx"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// Environment: server & client"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"import"}),s.jsx(e.span,{style:{color:"#24292E"},children:" React "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"from"}),s.jsx(e.span,{style:{color:"#032F62"},children:" 'react'"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"import"}),s.jsx(e.span,{style:{color:"#24292E"},children:" { usePageContext } "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"from"}),s.jsx(e.span,{style:{color:"#032F62"},children:" 'vike-react/usePageContext'"}),s.jsx(e.span,{style:{color:"#6A737D"},children:" // or vike-{vue,solid}"})]}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"export"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" function"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" Layout"}),s.jsx(e.span,{style:{color:"#24292E"},children:"({ "}),s.jsx(e.span,{style:{color:"#E36209"},children:"children"}),s.jsx(e.span,{style:{color:"#24292E"},children:" }"}),s.jsx(e.span,{style:{color:"#D73A49"},children:":"}),s.jsx(e.span,{style:{color:"#24292E"},children:" { "}),s.jsx(e.span,{style:{color:"#E36209"},children:"children"}),s.jsx(e.span,{style:{color:"#D73A49"},children:":"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" React"}),s.jsx(e.span,{style:{color:"#24292E"},children:"."}),s.jsx(e.span,{style:{color:"#6F42C1"},children:"ReactNode"}),s.jsx(e.span,{style:{color:"#24292E"},children:" }) {"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"  const"}),s.jsx(e.span,{style:{color:"#005CC5"},children:" pageContext"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" ="}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" usePageContext"}),s.jsx(e.span,{style:{color:"#24292E"},children:"()"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"  const"}),s.jsx(e.span,{style:{color:"#24292E"},children:" { "}),s.jsx(e.span,{style:{color:"#005CC5"},children:"posts"}),s.jsx(e.span,{style:{color:"#24292E"},children:" } "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"="}),s.jsx(e.span,{style:{color:"#24292E"},children:" pageContext.globalContext"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"  return"}),s.jsx(e.span,{style:{color:"#24292E"},children:" ("})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    <>"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      {"}),s.jsx(e.span,{style:{color:"#6A737D"},children:"/* Show the list of blog posts */"}),s.jsx(e.span,{style:{color:"#24292E"},children:"}"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      <"}),s.jsx(e.span,{style:{color:"#005CC5"},children:"LeftSidebar"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"p"}),s.jsx(e.span,{style:{color:"#24292E"},children:">Blog posts:</"}),s.jsx(e.span,{style:{color:"#22863A"},children:"p"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"ul"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"          {posts."}),s.jsx(e.span,{style:{color:"#6F42C1"},children:"map"}),s.jsx(e.span,{style:{color:"#24292E"},children:"(("}),s.jsx(e.span,{style:{color:"#E36209"},children:"post"}),s.jsx(e.span,{style:{color:"#24292E"},children:") "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"=>"}),s.jsx(e.span,{style:{color:"#24292E"},children:" ("})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"            <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"li"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"              <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"a"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" href"}),s.jsx(e.span,{style:{color:"#D73A49"},children:"="}),s.jsx(e.span,{style:{color:"#24292E"},children:"{post.url}>{post.title}</"}),s.jsx(e.span,{style:{color:"#22863A"},children:"a"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"            </"}),s.jsx(e.span,{style:{color:"#22863A"},children:"li"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"          ))}"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        </"}),s.jsx(e.span,{style:{color:"#22863A"},children:"ul"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      </"}),s.jsx(e.span,{style:{color:"#005CC5"},children:"LeftSidebar"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      {"}),s.jsx(e.span,{style:{color:"#6A737D"},children:"/* The page's content */"}),s.jsx(e.span,{style:{color:"#24292E"},children:"}"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      <"}),s.jsx(e.span,{style:{color:"#005CC5"},children:"Content"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"h1"}),s.jsx(e.span,{style:{color:"#24292E"},children:">{title}</"}),s.jsx(e.span,{style:{color:"#22863A"},children:"h1"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        {"}),s.jsx(e.span,{style:{color:"#6A737D"},children:"/* children is pageContext.Page which is the component defined by +Page.mdx */"}),s.jsx(e.span,{style:{color:"#24292E"},children:"}"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"        {children}"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      </"}),s.jsx(e.span,{style:{color:"#005CC5"},children:"Content"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    </>"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  )"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"}"})})]})})})]}),`
`,s.jsxs(e.blockquote,{children:[`
`,s.jsx(e.p,{children:"See also:"}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[`
`,s.jsx(l,{href:"/Layout"}),`
`]}),`
`,s.jsxs(e.li,{children:[`
`,s.jsx(l,{href:"/usePageContext"}),`
`]}),`
`,s.jsxs(e.li,{children:[`
`,s.jsxs(l,{href:"/pageContext#globalContext",children:["API > ",s.jsx(e.code,{children:"pageContext.globalContext"})]}),`
`]}),`
`]}),`
`]}),`
`,s.jsx("h3",{id:"with-a-custom-setting",children:"With a custom setting"}),`
`,s.jsxs(e.p,{children:["You can use ",s.jsx(l,{href:"/meta",children:s.jsx(e.code,{children:"meta"})})," to create a custom setting for defining ",s.jsx(l,{href:"#metadata:~:text=What%20is%20local%20metadata",children:"local metadata"}),"."]}),`
`,s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"mdx","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"mdx","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"// /pages/2024-new-year/+Page.mdx"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"export"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" const"}),s.jsx(e.span,{style:{color:"#005CC5"},children:" metadata"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" ="}),s.jsx(e.span,{style:{color:"#24292E"},children:" {"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  author: {"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"    firstName: "}),s.jsx(e.span,{style:{color:"#032F62"},children:"'John'"}),s.jsx(e.span,{style:{color:"#24292E"},children:","})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"    lastName: "}),s.jsx(e.span,{style:{color:"#032F62"},children:"'Smith'"}),s.jsx(e.span,{style:{color:"#24292E"},children:","})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"    country: "}),s.jsx(e.span,{style:{color:"#032F62"},children:"'England'"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  }"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"}"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#005CC5",fontWeight:"bold"},children:"## Some Markdown"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"This page uses "}),s.jsx(e.span,{style:{color:"#032F62"},children:"["}),s.jsx(e.span,{style:{color:"#24292E"},children:"markdown"}),s.jsx(e.span,{style:{color:"#032F62"},children:"]("}),s.jsx(e.span,{style:{color:"#032F62",textDecoration:"underline"},children:"https://en.wikipedia.org/wiki/Markdown"}),s.jsx(e.span,{style:{color:"#032F62"},children:")"}),s.jsx(e.span,{style:{color:"#24292E"},children:"."})]})]})})}),`
`,s.jsxs(e.blockquote,{children:[`
`,s.jsxs(e.p,{children:[s.jsx(e.a,{href:"https://mdxjs.com/",children:"MDX"})," allows you to export JavaScript values in ",s.jsx(e.code,{children:".mdx"})," files."]}),`
`]}),`
`,s.jsxs(e.blockquote,{children:[`
`,s.jsxs(e.p,{children:["Usually, Vike forbids ",s.jsx(e.code,{children:"+Page.js"}),' files to have "side exports": the ',s.jsx(e.code,{children:"+Page.js"})," should only export the value of the ",s.jsxs(l,{href:"/Page",children:[s.jsx(e.code,{children:"Page"})," setting"]}),`.
But, for improved DX, Vike allows markdown files (such as `,s.jsx(e.code,{children:"+Page.mdx"}),") to export the value of ",s.jsx(l,{href:"/settings",children:"other settings"}),"."]}),`
`]}),`
`,s.jsxs(n,{children:[s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// /pages/+config.js"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// Create +metadata setting"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"export"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" default"}),s.jsx(e.span,{style:{color:"#24292E"},children:" {"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  meta: {"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    metadata: {"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      env: { server: "}),s.jsx(e.span,{style:{color:"#005CC5"},children:"true"}),s.jsx(e.span,{style:{color:"#24292E"},children:", client: "}),s.jsx(e.span,{style:{color:"#005CC5"},children:"true"}),s.jsx(e.span,{style:{color:"#24292E"},children:" }"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    }"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  }"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"}"})})]})})}),s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// /pages/+config.ts"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"import"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" type"}),s.jsx(e.span,{style:{color:"#24292E"},children:" { Config } "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"from"}),s.jsx(e.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// Create +metadata setting"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"export"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" default"}),s.jsx(e.span,{style:{color:"#24292E"},children:" {"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  meta: {"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    metadata: {"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      env: { server: "}),s.jsx(e.span,{style:{color:"#005CC5"},children:"true"}),s.jsx(e.span,{style:{color:"#24292E"},children:", client: "}),s.jsx(e.span,{style:{color:"#005CC5"},children:"true"}),s.jsx(e.span,{style:{color:"#24292E"},children:" }"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    }"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  }"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"} "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"satisfies"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})]}),`
`,s.jsx("h3",{id:"with-frontmatter",children:"With frontmatter"}),`
`,s.jsxs(e.p,{children:["Some markdown processors have support for a so-called ",s.jsx(e.em,{children:"frontmatter"}),":"]}),`
`,s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"mdx","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"mdx","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#032F62"},children:"---"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#22863A"},children:"title"}),s.jsx(e.span,{style:{color:"#24292E"},children:": "}),s.jsx(e.span,{style:{color:"#032F62"},children:"A Markdown Page"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#22863A"},children:"author"}),s.jsx(e.span,{style:{color:"#24292E"},children:": "}),s.jsx(e.span,{style:{color:"#032F62"},children:"John Smith"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#032F62"},children:"---"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#005CC5",fontWeight:"bold"},children:"## Some Markdown"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"This page uses "}),s.jsx(e.span,{style:{color:"#032F62"},children:"["}),s.jsx(e.span,{style:{color:"#24292E"},children:"markdown"}),s.jsx(e.span,{style:{color:"#032F62"},children:"]("}),s.jsx(e.span,{style:{color:"#032F62",textDecoration:"underline"},children:"https://en.wikipedia.org/wiki/Markdown"}),s.jsx(e.span,{style:{color:"#032F62"},children:")"}),s.jsx(e.span,{style:{color:"#24292E"},children:"."})]})]})})}),`
`,s.jsxs(e.p,{children:["You can use such frontmatter to define ",s.jsx(l,{href:"#metadata:~:text=What%20is%20local%20metadata",children:"local metadata"}),"."]}),`
`,s.jsxs(e.p,{children:["The markdown processor exposes the data defined by the frontmatter as an export, for example ",s.jsx(e.code,{children:"export { frontmatter }"}),". You can access it by using ",s.jsx(l,{href:"/meta",children:s.jsx(e.code,{children:"meta"})})," to define a ",s.jsx(e.code,{children:"+frontmatter"})," setting (or whatever the name of the export is)."]}),`
`,s.jsxs(n,{children:[s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"export"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" default"}),s.jsx(e.span,{style:{color:"#24292E"},children:" {"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  meta: {"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"    // Create new setting +frontmatter"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    frontmatter: {"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      env: { server: "}),s.jsx(e.span,{style:{color:"#005CC5"},children:"true"}),s.jsx(e.span,{style:{color:"#24292E"},children:", client: "}),s.jsx(e.span,{style:{color:"#005CC5"},children:"true"}),s.jsx(e.span,{style:{color:"#24292E"},children:" }"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    }"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  }"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"}"})})]})})}),s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// pages/+config.ts"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"export"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" default"}),s.jsx(e.span,{style:{color:"#24292E"},children:" {"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  meta: {"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"    // Create new setting +frontmatter"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    frontmatter: {"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      env: { server: "}),s.jsx(e.span,{style:{color:"#005CC5"},children:"true"}),s.jsx(e.span,{style:{color:"#24292E"},children:", client: "}),s.jsx(e.span,{style:{color:"#005CC5"},children:"true"}),s.jsx(e.span,{style:{color:"#24292E"},children:" }"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    }"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  }"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"} "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"satisfies"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})]}),`
`,s.jsxs(e.p,{children:["You can then use ",s.jsx(l,{href:"/pageContext#config",children:s.jsx(e.code,{children:"pageContext.config"})})," to access it:"]}),`
`,s.jsxs(n,{children:[s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"jsx","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"jsx","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// /pages/+Layout.jsx"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"import"}),s.jsx(e.span,{style:{color:"#24292E"},children:" React "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"from"}),s.jsx(e.span,{style:{color:"#032F62"},children:" 'react'"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"import"}),s.jsx(e.span,{style:{color:"#24292E"},children:" { usePageContext } "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"from"}),s.jsx(e.span,{style:{color:"#032F62"},children:" 'vike-react/usePageContext'"}),s.jsx(e.span,{style:{color:"#6A737D"},children:" // or vike-{vue,solid}"})]}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"export"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" function"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" Layout"}),s.jsx(e.span,{style:{color:"#24292E"},children:"({ "}),s.jsx(e.span,{style:{color:"#E36209"},children:"children"}),s.jsx(e.span,{style:{color:"#24292E"},children:" }) {"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"  const"}),s.jsx(e.span,{style:{color:"#005CC5"},children:" pageContext"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" ="}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" usePageContext"}),s.jsx(e.span,{style:{color:"#24292E"},children:"()"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"  const"}),s.jsx(e.span,{style:{color:"#24292E"},children:" { "}),s.jsx(e.span,{style:{color:"#005CC5"},children:"frontmatter"}),s.jsx(e.span,{style:{color:"#24292E"},children:" } "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"="}),s.jsx(e.span,{style:{color:"#24292E"},children:" pageContext.config"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"  return"}),s.jsx(e.span,{style:{color:"#24292E"},children:" ("})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    <>"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"h1"}),s.jsx(e.span,{style:{color:"#24292E"},children:">{frontmatter.title}</"}),s.jsx(e.span,{style:{color:"#22863A"},children:"h1"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"      {children}"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"footer"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"p"}),s.jsx(e.span,{style:{color:"#24292E"},children:">Written by {frontmatter.author}.</"}),s.jsx(e.span,{style:{color:"#22863A"},children:"p"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      </"}),s.jsx(e.span,{style:{color:"#22863A"},children:"footer"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    </>"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  )"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"}"})})]})})}),s.jsx(e.figure,{"data-rehype-pretty-code-figure":"",children:s.jsx(e.pre,{tabIndex:"0","data-language":"tsx","data-theme":"github-light",children:s.jsxs(e.code,{"data-language":"tsx","data-theme":"github-light",style:{display:"grid"},children:[s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#6A737D"},children:"// /pages/+Layout.tsx"})}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"import"}),s.jsx(e.span,{style:{color:"#24292E"},children:" React "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"from"}),s.jsx(e.span,{style:{color:"#032F62"},children:" 'react'"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"import"}),s.jsx(e.span,{style:{color:"#24292E"},children:" { usePageContext } "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"from"}),s.jsx(e.span,{style:{color:"#032F62"},children:" 'vike-react/usePageContext'"}),s.jsx(e.span,{style:{color:"#6A737D"},children:" // or vike-{vue,solid}"})]}),`
`,s.jsx(e.span,{"data-line":"",children:" "}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"export"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" function"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" Layout"}),s.jsx(e.span,{style:{color:"#24292E"},children:"({ "}),s.jsx(e.span,{style:{color:"#E36209"},children:"children"}),s.jsx(e.span,{style:{color:"#24292E"},children:" }"}),s.jsx(e.span,{style:{color:"#D73A49"},children:":"}),s.jsx(e.span,{style:{color:"#24292E"},children:" { "}),s.jsx(e.span,{style:{color:"#E36209"},children:"children"}),s.jsx(e.span,{style:{color:"#D73A49"},children:":"}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" React"}),s.jsx(e.span,{style:{color:"#24292E"},children:"."}),s.jsx(e.span,{style:{color:"#6F42C1"},children:"ReactNode"}),s.jsx(e.span,{style:{color:"#24292E"},children:" }) {"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"  const"}),s.jsx(e.span,{style:{color:"#005CC5"},children:" pageContext"}),s.jsx(e.span,{style:{color:"#D73A49"},children:" ="}),s.jsx(e.span,{style:{color:"#6F42C1"},children:" usePageContext"}),s.jsx(e.span,{style:{color:"#24292E"},children:"()"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"  const"}),s.jsx(e.span,{style:{color:"#24292E"},children:" { "}),s.jsx(e.span,{style:{color:"#005CC5"},children:"frontmatter"}),s.jsx(e.span,{style:{color:"#24292E"},children:" } "}),s.jsx(e.span,{style:{color:"#D73A49"},children:"="}),s.jsx(e.span,{style:{color:"#24292E"},children:" pageContext.config"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#D73A49"},children:"  return"}),s.jsx(e.span,{style:{color:"#24292E"},children:" ("})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    <>"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"h1"}),s.jsx(e.span,{style:{color:"#24292E"},children:">{frontmatter.title}</"}),s.jsx(e.span,{style:{color:"#22863A"},children:"h1"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"      {children}"})}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"footer"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"        <"}),s.jsx(e.span,{style:{color:"#22863A"},children:"p"}),s.jsx(e.span,{style:{color:"#24292E"},children:">Written by {frontmatter.author}.</"}),s.jsx(e.span,{style:{color:"#22863A"},children:"p"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsxs(e.span,{"data-line":"",children:[s.jsx(e.span,{style:{color:"#24292E"},children:"      </"}),s.jsx(e.span,{style:{color:"#22863A"},children:"footer"}),s.jsx(e.span,{style:{color:"#24292E"},children:">"})]}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"    </>"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"  )"})}),`
`,s.jsx(e.span,{"data-line":"",children:s.jsx(e.span,{style:{color:"#24292E"},children:"}"})})]})})})]}),`
`,s.jsxs(e.blockquote,{children:[`
`,s.jsx(e.p,{children:"See also:"}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[`
`,s.jsx(l,{href:"/Layout"}),`
`]}),`
`,s.jsxs(e.li,{children:[`
`,s.jsx(l,{href:"/usePageContext"}),`
`]}),`
`]}),`
`]}),`
`,s.jsx("h2",{id:"see-also",children:"See also"}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[`
`,s.jsx(l,{href:"/head-tags"}),`
`]}),`
`]})]})}function x(a={}){const{wrapper:e}={...c(),...a.components};return e?s.jsx(e,{...a,children:s.jsx(t,{...a})}):t(a)}function j(a,e){throw new Error("Expected component `"+a+"` to be defined: you likely forgot to import, pass, or provide it.")}const y=Object.freeze(Object.defineProperty({__proto__:null,default:x,pageSectionsExport:p},Symbol.toStringTag,{value:"Module"})),I={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:i}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:o}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/markdown/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:y}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{I as configValuesSerialized};
