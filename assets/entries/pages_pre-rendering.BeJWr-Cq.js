import{o,a}from"../chunks/chunk-CuuRH9a_.js";import{j as e,b as t}from"../chunks/chunk-D3FsxVgn.js";import{L as n}from"../chunks/chunk-CKfDXA66.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{M as l}from"../chunks/chunk-CjrkYfqY.js";/* empty css                      */const d=[{pageSectionId:"what-is-pre-rendering",pageSectionLevel:2,pageSectionTitle:"What is pre-rendering?"},{pageSectionId:"should-i-pre-render",pageSectionLevel:2,pageSectionTitle:"Should I pre-render?"},{pageSectionId:"how-to-pre-render",pageSectionLevel:2,pageSectionTitle:"How to pre-render"},{pageSectionId:"ssg-vs-ssr",pageSectionLevel:2,pageSectionTitle:"SSG vs SSR"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function i(s){const r={a:"a",blockquote:"blockquote",code:"code",em:"em",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...s.components};return e.jsxs(e.Fragment,{children:[e.jsx("h2",{id:"what-is-pre-rendering",children:"What is pre-rendering?"}),`
`,e.jsxs(r.p,{children:["Pre-rendering means to render the HTML of pages at build-time (when running ",e.jsx(r.code,{children:"$ vike build"}),")."]}),`
`,e.jsx(r.p,{children:"Without pre-rendering, the HTML of a page is rendered at request-time (when the user goes to that page)."}),`
`,e.jsxs(r.p,{children:[`If you pre-render all of your pages, then you no longer need a production server: your app will consist only of static assets (HTML, JS, CSS, images, ...)
that you can deploy to so-called "static hosts" such as `,e.jsx(n,{href:"/github-pages",text:"GitHub Pages"}),", ",e.jsx(r.a,{href:"/cloudflare-pages",children:"Cloudflare Pages"}),", or ",e.jsx(r.a,{href:"/netlify",children:"Netlify"}),"."]}),`
`,e.jsxs(r.p,{children:["If you don't pre-render, then you need a production server in order to be able to dynamically render the HTML of your pages at request-time. (A Node.js production server, or a Node.js-like production environment such as ",e.jsx(n,{href:"/cloudflare",text:"Cloudflare Workers"})," or ",e.jsx(n,{href:"/vercel",text:"Vercel"}),".)"]}),`
`,e.jsxs(r.blockquote,{children:[`
`,e.jsx(r.p,{children:'Tools that pre-render pages are also known as "SSG" (Static-Site Generators).'}),`
`]}),`
`,e.jsx("h2",{id:"should-i-pre-render",children:"Should I pre-render?"}),`
`,e.jsx(r.p,{children:"In a nutshell: pre-render your pages whenever you can."}),`
`,e.jsx(r.p,{children:"Because pre-rendering removes the need for a production server and therefore makes deployment easy. It's also significantly more performant as the HTML isn't re-generated on every HTTP request."}),`
`,e.jsx(r.p,{children:"But pre-rendering cannot be used for every kind of website."}),`
`,e.jsxs(r.p,{children:["Pre-rendering cannot be used for websites with content that changes very frequently. For example, a social site such as ",e.jsx(r.a,{href:"https://news.ycombinator.com/",children:"Hacker News"})," or ",e.jsx(r.a,{href:"https://www.reddit.com/",children:"Reddit"}),": new content is created every time a user shares a link or writes a comment. Pre-rendering cannot be run again and again every other (milli)second whenever there is new content (Reddit has millions of pages which obviously cannot all be re-rendered every other millisecond). (In theory, it's possible to re-render only the subset of pages that are affected by new content, but it isn't practical and we recommend against this practice.)"]}),`
`,e.jsxs(r.p,{children:["Pre-rendering can be used for websites with content that changes only occasionally. For example, the content of ",e.jsx(r.code,{children:"https://vike.dev"})," changes only when a maintainer updates the documentation: all pages of ",e.jsx(r.code,{children:"https://vike.dev"})," can then be pre-rendered again. Thanks to pre-rendering, ",e.jsx(r.code,{children:"https://vike.dev"})," is deployed to the static host ",e.jsx(n,{href:"/github-pages",text:"GitHub Pages"}),", which is a lot easier (and more performant) than using a production server."]}),`
`,e.jsx("h2",{id:"how-to-pre-render",children:"How to pre-render"}),`
`,e.jsx(r.p,{children:"To opt into pre-rendering:"}),`
`,e.jsx(r.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(r.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(r.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(r.span,{"data-line":"",children:e.jsx(r.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,e.jsx(r.span,{"data-line":"",children:" "}),`
`,e.jsxs(r.span,{"data-line":"",children:[e.jsx(r.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(r.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(r.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(r.span,{"data-line":"",children:[e.jsx(r.span,{style:{color:"#24292E"},children:"  prerender: "}),e.jsx(r.span,{style:{color:"#005CC5"},children:"true"})]}),`
`,e.jsx(r.span,{"data-line":"",children:e.jsx(r.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(r.p,{children:["List of options: ",e.jsx(n,{href:"/prerender"}),"."]}),`
`,e.jsxs(r.p,{children:["Your pages' HTML will be rendered when you run ",e.jsx(r.code,{children:"$ vike build"})," and the generated HTML files are available at ",e.jsx(r.code,{children:"dist/client/"}),"."]}),`
`,e.jsxs(r.p,{children:["For a page with a parameterized route (e.g. ",e.jsx(r.code,{children:"/movie/@movieId"}),"), you have to use the ",e.jsxs(n,{href:"/onBeforePrerenderStart",children:[e.jsx(r.code,{children:"onBeforePrerenderStart()"})," hook"]})," in order to provide the list of URLs that are to be pre-rendered. The ",e.jsx(r.code,{children:"onBeforePrerenderStart()"})," hook can also be used to accelerate the pre-rendering process."]}),`
`,e.jsx(l,{}),`
`,e.jsxs(r.p,{children:["By default, all pages are pre-rendered. To pre-render only some pages, use the ",e.jsx(n,{href:"/prerender#partial",text:e.jsxs(e.Fragment,{children:[e.jsx(r.code,{children:"partial"})," option"]})})," with ",e.jsx(n,{href:"/prerender#toggle",text:e.jsx(r.code,{children:"prerender: false"})}),"."]}),`
`,e.jsxs(r.p,{children:["If you pre-render all your pages, then you can use Vike's CLI instead of a server (",e.jsx(r.code,{children:"$ vike dev"})," and ",e.jsx(r.code,{children:"$ vike preview"}),"). See linked examples below."]}),`
`,e.jsxs(r.p,{children:["You can programmatically invoke the pre-rendering process, see ",e.jsx(n,{href:"/api#prerender",doNotInferSectionTitle:!0}),"."]}),`
`,e.jsx(r.p,{children:"React Example:"}),`
`,e.jsxs(r.ul,{children:[`
`,e.jsxs(r.li,{children:[e.jsx(t,{path:"/examples/react-full/vite.config.ts"})," (see setting ",e.jsx("code",{children:"prerender"})," option to ",e.jsx(r.code,{children:"true"}),")"]}),`
`,e.jsxs(r.li,{children:[`
`,e.jsx(t,{path:"/examples/react-full/pages/hello/+onBeforePrerenderStart.ts"}),`
`]}),`
`,e.jsxs(r.li,{children:[`
`,e.jsx(t,{path:"/examples/react-full/pages/star-wars/index/+onBeforePrerenderStart.ts"}),`
`]}),`
`,e.jsxs(r.li,{children:[e.jsx(t,{path:"/examples/react-full/package.json"})," (see Vike CLI usage)"]}),`
`]}),`
`,e.jsx(r.p,{children:"Vue Example:"}),`
`,e.jsxs(r.ul,{children:[`
`,e.jsxs(r.li,{children:[e.jsx(t,{path:"/examples/vue-full/vite.config.ts"})," (see setting ",e.jsx("code",{children:"prerender"})," option to ",e.jsx(r.code,{children:"true"}),")"]}),`
`,e.jsxs(r.li,{children:[`
`,e.jsx(t,{path:"/examples/vue-full/pages/hello/+onBeforePrerenderStart.ts"}),`
`]}),`
`,e.jsxs(r.li,{children:[`
`,e.jsx(t,{path:"/examples/vue-full/pages/star-wars/index/+onBeforePrerenderStart.ts"}),`
`]}),`
`,e.jsxs(r.li,{children:[e.jsx(t,{path:"/examples/vue-full/package.json"})," (see Vike CLI usage)"]}),`
`]}),`
`,e.jsx("h2",{id:"ssg-vs-ssr",children:"SSG vs SSR"}),`
`,e.jsxs(r.p,{children:["The only difference between SSG and SSR is ",e.jsx(r.em,{children:"when"})," the HTML is rendered:"]}),`
`,e.jsxs(r.ul,{children:[`
`,e.jsxs(r.li,{children:["SSG: the HTML of pages is rendered at build-time (when calling ",e.jsx(r.code,{children:"$ vike build"}),")"]}),`
`,e.jsx(r.li,{children:"SSR: the HTML of pages is rendered at request-time (when the user goes to that page)"}),`
`]}),`
`,e.jsxs(r.blockquote,{children:[`
`,e.jsx(r.p,{children:"The client-side code of pages is loaded and executed in the user's browser and is therefore always executed at request-time."}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(r.ul,{children:[`
`,e.jsxs(r.li,{children:[`
`,e.jsx(n,{href:"/data-fetching#pre-rendering-ssg",doNotInferSectionTitle:!0}),`
`]}),`
`,e.jsxs(r.li,{children:[`
`,e.jsx(n,{href:"/static-hosts"}),`
`]}),`
`,e.jsxs(r.li,{children:[`
`,e.jsx(n,{href:"/ssr"}),`
`]}),`
`]}),`
`,e.jsx(r.p,{children:"Pre-rendering options:"}),`
`,e.jsxs(r.ul,{children:[`
`,e.jsxs(r.li,{children:[`
`,e.jsx(n,{href:"/prerender"}),`
`]}),`
`,e.jsxs(r.li,{children:[`
`,e.jsx(n,{href:"/onBeforePrerenderStart"}),`
`]}),`
`,e.jsxs(r.li,{children:[`
`,e.jsx(n,{href:"/onPrerenderStart"}),`
`]}),`
`,e.jsxs(r.li,{children:[`
`,e.jsx(n,{href:"/api#prerender",doNotInferSectionTitle:!0}),`
`]}),`
`,e.jsxs(r.li,{children:[`
`,e.jsx(n,{href:"/cli"}),`
`]}),`
`]})]})}function c(s={}){const{wrapper:r}=s.components||{};return r?e.jsx(r,{...s,children:e.jsx(i,{...s})}):i(s)}const h=Object.freeze(Object.defineProperty({__proto__:null,default:c,pageSectionsExport:d},Symbol.toStringTag,{value:"Module"})),T={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:a}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:o}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/pre-rendering/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:h}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{T as configValuesSerialized};
