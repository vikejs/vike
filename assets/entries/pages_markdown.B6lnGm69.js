import{j as e,b as a,i as r,L as i,o}from"../chunks/chunk-BqJz907Y.js";import{L as n}from"../chunks/chunk-BmkgW3tD.js";/* empty css                      */import{W as d}from"../chunks/chunk-DLLinNPN.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-drWBd06u.js";import{V as c}from"../chunks/chunk-CYpUOSQv.js";/* empty css                      *//* empty css                      *//* empty css                      */const h=[{pageSectionId:"installation",pageSectionLevel:2,pageSectionTitle:"Installation"},{pageSectionId:"vue",pageSectionLevel:3,pageSectionTitle:"Vue"},{pageSectionId:"react",pageSectionLevel:3,pageSectionTitle:"React"},{pageSectionId:"metadata",pageSectionLevel:2,pageSectionTitle:"Metadata"},{pageSectionId:"local-metadata",pageSectionLevel:4,pageSectionTitle:"Local metadata"},{pageSectionId:"global-metadata",pageSectionLevel:4,pageSectionTitle:"Global metadata"},{pageSectionId:"with-a-metadata-js-file",pageSectionLevel:3,pageSectionTitle:"With a `metadata.js` file"},{pageSectionId:"with-custom-settings",pageSectionLevel:3,pageSectionTitle:"With custom settings"},{pageSectionId:"with-frontmatter",pageSectionLevel:3,pageSectionTitle:"With frontmatter"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function t(l){const s={a:"a",blockquote:"blockquote",code:"code",em:"em",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...l.components};return e.jsxs(e.Fragment,{children:[e.jsx("h2",{id:"installation",children:"Installation"}),`
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
`,e.jsx(a,{path:"/examples/vue-full/vite.config.ts"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(a,{path:"/examples/vue-full/pages/markdown/+Page.md"}),`
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
`,e.jsx(a,{path:"/examples/react-full/vite.config.ts"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(a,{path:"/examples/react-full/pages/markdown/+Page.mdx"}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"metadata",children:"Metadata"}),`
`,e.jsx(s.p,{children:"There are several techniques for defining the metadata (title, publishing date, author, ...) of your markdown pages."}),`
`,e.jsx(s.p,{children:"The preferred technique depends on whether the metadata is global or local."}),`
`,e.jsx("h4",{id:"local-metadata",children:"Local metadata"}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"What is local metadata?"}),"  For example, if you want to show some detailed information below the blog post, such as the author's name and country. This metadata is only shown and only needed for that page."]}),`
`]}),`
`,e.jsx(s.p,{children:"For local metadata, we recommend:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"#with-custom-settings",children:"With custom settings"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"#with-frontmatter",children:"With frontmatter"})}),`
`]}),`
`,e.jsx("h4",{id:"global-metadata",children:"Global metadata"}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"What is global metadata?"})," For example, if you want to show a list of all your blog posts, and you want to always show that list on the left side of your website."]}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{children:`2024-01-01 New Year 2024 Resolution
2023-12-20 Wrapping up 2023
2023-06-15 My summer 2023
`})}),`
`,e.jsx(s.p,{children:"Because this list is shown in the sidebar of every page, the publishing date and the title of all blog posts is always needed regardless of which page is rendered. This metadata is needed for every page."}),`
`]}),`
`,e.jsx(s.p,{children:"For global metadata, we recommend:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"#with-a-metadata-js-file"}),`
`]}),`
`]}),`
`,e.jsx(d,{children:e.jsxs(s.p,{children:["You may be tempted to use ",e.jsx(s.a,{href:"https://vitejs.dev/guide/features.html#glob-import",children:e.jsx(s.code,{children:"import.meta.glob()"})})," to retrieve the metadata of all your pages, but we discourage this approach: loading all markdown files at once ",e.jsx(c,{}),"."]})}),`
`,e.jsxs("h3",{id:"with-a-metadata-js-file",children:["With a ",e.jsx("code",{children:"metadata.js"})," file"]}),`
`,e.jsxs(s.p,{children:["A simple way to define metadata is to define a ",e.jsx(s.code,{children:"metadata.js"})," file that contains ",e.jsx(n,{href:"#metadata:~:text=What%20is%20global%20metadata",children:"global metadata"}),"."]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/metadata.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This metadata is always available for every page"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" metadata"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" ["})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    url: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'/blog/introducing-vike'"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    title: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'Introducing Vike'"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    date: "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"new"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Date"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'2024-01-01'"}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  },"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    url: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'/blog/v1'"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    title: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'v1.0.0 release'"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    date: "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"new"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Date"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'2024-06-01'"}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"]"})})]})})}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"jsx","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"jsx","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+Layout.jsx"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { metadata } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" './metadata'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Layout"}),e.jsx(s.span,{style:{color:"#24292E"},children:"({ "}),e.jsx(s.span,{style:{color:"#E36209"},children:"children"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }) {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Current URL"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"urlPathname"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" usePageContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // The page's metadata"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"title"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" metadata."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"find"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(({ "}),e.jsx(s.span,{style:{color:"#E36209"},children:"url"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }) "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" url "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"==="}),e.jsx(s.span,{style:{color:"#24292E"},children:" pageContext.urlPathname)"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" <>"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    {"}),e.jsx(s.span,{style:{color:"#6A737D"},children:"/* Show the list of blog posts */"}),e.jsx(s.span,{style:{color:"#24292E"},children:"}"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    <"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"LeftSidebar"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"p"}),e.jsx(s.span,{style:{color:"#24292E"},children:">Blog posts:</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"p"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"ul"}),e.jsx(s.span,{style:{color:"#24292E"},children:">{"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        metadata."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"map"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(({ "}),e.jsx(s.span,{style:{color:"#E36209"},children:"title"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#E36209"},children:"url"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#E36209"},children:"date"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }) "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"          <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"li"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"            <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"a"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" href"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:"{url}>{data "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"+"}),e.jsx(s.span,{style:{color:"#24292E"},children:" title}</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"a"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"          </"}),e.jsx(s.span,{style:{color:"#22863A"},children:"li"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"        )"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      }</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"ul"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    </"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"LeftSidebar"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    {"}),e.jsx(s.span,{style:{color:"#6A737D"},children:"/* The page's content */"}),e.jsx(s.span,{style:{color:"#24292E"},children:"}"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    <"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"Content"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"h1"}),e.jsx(s.span,{style:{color:"#24292E"},children:">{ title }</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"h1"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      /* children is usually pageContext.Page which is the component defined by +Page.md */"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      { children }"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    </"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"Content"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  </>"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"md","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"md","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"// /pages/blog/introducing-vike/+Page.md"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"We're thrilled to officially introduce Vike."})})]})})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.code,{children:"<h1>"})," of each pages is already defined by ",e.jsx(s.code,{children:"/pages/+Layout.jsx"}),": you don't have to define it again in ",e.jsx(s.code,{children:"+Page.md"}),"."]}),`
`]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"md","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"md","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"// /pages/blog/v1/+Page.md"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"The "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"`v1.0.0`"}),e.jsx(s.span,{style:{color:"#24292E"},children:" release signals that Vike is ready for prime time: it now includes"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"all essentials you'd expect from a frontend framework with a robust design."})})]})})}),`
`,e.jsx("h3",{id:"with-custom-settings",children:"With custom settings"}),`
`,e.jsxs(s.p,{children:["You can use ",e.jsx(n,{href:"/meta",children:e.jsx(s.code,{children:"meta"})})," to create custom settings for defining ",e.jsx(n,{href:"#metadata:~:text=What%20is%20local%20metadata",children:"local metadata"}),"."]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"mdx","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"mdx","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"// /pages/2024-new-year/+Page.mdx"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" metadata"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  author: {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    firstName: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'John'"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    lastName: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'Doe'"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    country: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'England'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#005CC5",fontWeight:"bold"},children:"## Some Markdown"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"This page uses "}),e.jsx(s.span,{style:{color:"#032F62"},children:"["}),e.jsx(s.span,{style:{color:"#24292E"},children:"markdown"}),e.jsx(s.span,{style:{color:"#032F62"},children:"]("}),e.jsx(s.span,{style:{color:"#032F62",textDecoration:"underline"},children:"https://en.wikipedia.org/wiki/Markdown"}),e.jsx(s.span,{style:{color:"#032F62"},children:")"}),e.jsx(s.span,{style:{color:"#24292E"},children:"."})]})]})})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:[e.jsx(s.a,{href:"https://mdxjs.com/",children:"MDX"})," allows you to export JavaScript values in ",e.jsx(s.code,{children:".mdx"})," files."]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["Usually, Vike forbids ",e.jsx(s.code,{children:"+Page.js"}),' files to have "side exports": the ',e.jsx(s.code,{children:"+Page.js"})," should only export the value of the ",e.jsx(s.code,{children:"Page"}),` setting.
But, for improved DX, Vike allows markdown files such as `,e.jsx(s.code,{children:"+Page.mdx"})," to export the value of other settings."]}),`
`]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Define the custom settings `metadata`"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  meta: {"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    metadata: {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      env: { server: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:", client: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(s.p,{children:["See ",e.jsx(n,{href:"/meta"}),"."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["It's a common practice to use a ",e.jsxs(s.a,{href:"#with-a-metadata-js-file",children:[e.jsx(s.code,{children:"metadata.js"})," file"]})," for defining global metadata, as well as creating custom settings for defining local metadata."]}),`
`]}),`
`,e.jsx("h3",{id:"with-frontmatter",children:"With frontmatter"}),`
`,e.jsxs(s.p,{children:["Some markdown processors have support for a so-called ",e.jsx(s.em,{children:"frontmatter"})," to define the page's metadata."]}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{children:`---
title: A Markdown Page
description: Example of using markdown with some frontmatter data
---

## Some Markdown

This page uses [markdown](https://en.wikipedia.org/wiki/Markdown).
`})}),`
`,e.jsxs(s.p,{children:[`The frontmatter data is usually exposed as an export,
which you can access by making the export `,e.jsx(s.code,{children:"nameOfTheFrontmatterExport"})," a custom setting, see ",e.jsx(n,{href:"/meta"}),"."]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/head-tags"}),`
`]}),`
`]})]})}function p(l={}){const{wrapper:s}=l.components||{};return s?e.jsx(s,{...l,children:e.jsx(t,{...l})}):t(l)}const x=Object.freeze(Object.defineProperty({__proto__:null,default:p,pageSectionsExport:h},Symbol.toStringTag,{value:"Module"})),D={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/markdown/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:x}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:i}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:r}}};export{D as configValuesSerialized};
