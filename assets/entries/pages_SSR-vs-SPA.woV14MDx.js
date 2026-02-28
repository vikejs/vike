import{o,a as l}from"../chunks/chunk-CxIOOiKX.js";import{j as e}from"../chunks/chunk-B35a6FX-.js";import{L as s}from"../chunks/chunk-BbfG-aTg.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as t}from"../chunks/chunk-CJvpbNqo.js";/* empty css                      *//* empty css                      *//* empty css                      */const a=[{pageSectionId:"examples",pageSectionLevel:2,pageSectionTitle:"Examples"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function r(i){const n={a:"a",blockquote:"blockquote",code:"code",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...t(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Unfamiliar with SSR and SPA?"})," See ",e.jsx(s,{href:"/what-is-SSR-and-SPA"})]}),`
`]}),`
`,e.jsx(n.p,{children:"For each page, you can choose between:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"SSR"})," (",e.jsx(n.strong,{children:"S"}),"erver-",e.jsx(n.strong,{children:"S"}),"ide ",e.jsx(n.strong,{children:"R"}),"endering): The page is rendered to HTML on the server-side, and then ",e.jsx(s,{href:"/hydration",children:"hydrated"})," (made interactive) on the client-side.",`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["You can also pre-render your SSR pages, see ",e.jsx(s,{href:"/pre-rendering"}),"."]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"SPA"}),": The page is only rendered on the client-side — the page isn't rendered to HTML."]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["You can toggle between SSR and SPA on a per-page basis by using the ",e.jsxs(s,{href:"/ssr",children:[e.jsx(n.code,{children:"+ssr"})," setting"]}),"."]}),`
`]}),`
`,e.jsxs(n.p,{children:["The main motivation for choosing SSR is that ",e.jsx(n.strong,{children:"SSR makes your website's content available to the crawlers of search engines and AI"}),"."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["With SPA, a page is rendered only on the client-side. The HTML of an SPA page is just an empty shell that delivers the page's client-side JavaScript — the HTML doesn't include the page's content. Therefore, ",e.jsx(n.strong,{children:"with SPA, the page's content is invisible to the crawlers of search engines and AI"})," (crawlers navigate your website by reading HTML). For further explanation, see:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/what-is-SSR-and-SPA#crawlers"}),`
`]}),`
`]}),`
`]}),`
`,e.jsxs(n.p,{children:["This means that ",e.jsx(n.strong,{children:"SPA isn't an option if your page's content should appear in search engines (e.g. Google) and AI (e.g. ChatGPT)"}),". You must use SSR."]}),`
`,e.jsx(n.p,{children:"If SPA is an option, we generally recommend choosing SPA while considering the following trade-offs."}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"SPA disadvantage:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Slower initial page load, especially on mobile devices.",`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"SSR improves performance because the page's content is shown to the user via HTML before any client-side JavaScript loads. Depending on the app, this can make a significant difference, especially on mobile devices where loading and executing JavaScript is significantly slower. For further explanation, see:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/what-is-SSR-and-SPA#performance"}),`
`]}),`
`]}),`
`,e.jsx("p",{}),`
`,`
`]}),`
`]}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"SPA advantages:"})}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:"Your page's code doesn't run on the server-side. It's easier to write code that runs in only one environment. (E.g. some libraries have issues when run on the server-side.)"}),`
`,e.jsxs(n.li,{children:["SPA doesn't require a production server.",`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["You can ",e.jsx(s,{href:"/pre-rendering",children:"pre-render your SSR pages"})," to remove the need for a production server, but ",e.jsx(s,{href:"/pre-rendering#should-i-pre-render",children:"it doesn't always work"}),"."]}),`
`]}),`
`]}),`
`,e.jsx(n.li,{children:"Reduced backend workload."}),`
`]}),`
`,e.jsx("h2",{id:"examples",children:"Examples"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"SSR"})," usually makes sense for ",e.jsx(n.strong,{children:"content-focused websites"})," (the primary value is consuming content):"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Social site (",e.jsx(n.a,{href:"https://news.ycombinator.com",children:"Hacker News"}),", ",e.jsx(n.a,{href:"https://www.reddit.com",children:"Reddit"}),", ...)"]}),`
`,e.jsx(n.li,{children:"Newspaper"}),`
`,e.jsx(n.li,{children:"Blog"}),`
`,e.jsx(n.li,{children:"Documentation"}),`
`]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"SPA"})," usually makes sense for ",e.jsx(n.strong,{children:"interaction-focused apps"})," (the primary value is functionality):"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"To-do list app"}),`
`,e.jsx(n.li,{children:"Productivity tool"}),`
`,e.jsx(n.li,{children:"Online image editor"}),`
`,e.jsx(n.li,{children:"Calendar app"}),`
`]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"SPA"})," usually also makes sense for ",e.jsx(n.strong,{children:"private pages"}),":"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Dashboard interface"}),`
`,e.jsx(n.li,{children:"Admin panel"}),`
`,e.jsx(n.li,{children:"Company internal application"}),`
`,e.jsx(n.li,{children:"User account settings"}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/what-is-SSR-and-SPA"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/pre-rendering#ssg-vs-ssr"}),`
`]}),`
`]})]})}function d(i={}){const{wrapper:n}={...t(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(r,{...i})}):r(i)}const c=Object.freeze(Object.defineProperty({__proto__:null,default:d,pageSectionsExport:a},Symbol.toStringTag,{value:"Module"})),T={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:l}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:o}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/SSR-vs-SPA/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:c}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{T as configValuesSerialized};
