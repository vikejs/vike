import{j as e,i,L as a,o}from"../chunks/chunk-DDglp-1g.js";import{U as c}from"../chunks/chunk-C72AEKOl.js";import{L as l}from"../chunks/chunk-26hgBjwh.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-DKx9YHKN.js";import{C as d}from"../chunks/chunk-Caj0TBth.js";import{E as r}from"../chunks/chunk-wAfF80uR.js";/* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-CRzYtoSB.js";const p=[{pageSectionId:"manual-integration",pageSectionLevel:2,pageSectionTitle:"Manual integration"},{pageSectionId:"without-vike-react",pageSectionLevel:2,pageSectionTitle:"Without `vike-react`"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function t(n){const s={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",ol:"ol",p:"p",pre:"pre",span:"span",ul:"ul",...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(d,{tool:"styled-jsx",url:"https://github.com/vercel/styled-jsx",hasExtension:"react"}),`
`,e.jsx("h2",{id:"manual-integration",children:"Manual integration"}),`
`,e.jsxs(s.p,{children:["If you use ",e.jsx(l,{href:"/vike-react",children:e.jsx(s.code,{children:"vike-react"})}),", you can manually integrate ",e.jsx(s.code,{children:"styled-jsx"})," by using:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{href:"/onBeforeRenderHtml",doNotInferSectionTitle:!0}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{href:"/Wrapper",doNotInferSectionTitle:!0}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{href:"/onAfterRenderHtml",doNotInferSectionTitle:!0}),`
`]}),`
`]}),`
`,e.jsx(s.p,{children:"Example:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(r,{timestamp:"2024.12",repo:"phonzammi/vike-react-styled-jsx-example"}),`
`]}),`
`]}),`
`,e.jsxs("h2",{id:"without-vike-react",children:["Without ",e.jsx("code",{children:"vike-react"})]}),`
`,e.jsxs(s.p,{children:["To use Vike with ",e.jsx(s.code,{children:"styled-jsx"})," without ",e.jsx(c,{name:!0,list:["vike-react"]}),":"]}),`
`,e.jsxs(s.ol,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(s.p,{children:"Install:"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"shell","data-theme":"github-light",children:e.jsx(s.code,{"data-language":"shell","data-theme":"github-light",style:{display:"grid"},children:e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"npm"}),e.jsx(s.span,{style:{color:"#032F62"},children:" install"}),e.jsx(s.span,{style:{color:"#032F62"},children:" styled-jsx"})]})})})}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsxs(s.p,{children:["Add ",e.jsx(s.code,{children:"styled-jsx"})," to ",e.jsx(s.code,{children:"vite.config.js"}),":"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// vite.config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" react "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" '@vitejs/plugin-react'"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" vike "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/plugin'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  plugins: ["}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"react"}),e.jsx(s.span,{style:{color:"#24292E"},children:"({ babel: { plugins: ["}),e.jsx(s.span,{style:{color:"#032F62"},children:"'styled-jsx/babel'"}),e.jsx(s.span,{style:{color:"#24292E"},children:"] } }), "}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"vike"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()]"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(s.p,{children:"Collect and inject styles."}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["When using a CSS-in-JS tool, like ",e.jsx(s.code,{children:"styled-jsx"}),", you always need to collect the page's styles upon SSR in order ",e.jsx(l,{href:"/css-in-js",children:"to avoid FOUC"}),"."]}),`
`]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/+onRenderHtml.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { onRenderHtml }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" React "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'react'"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { renderToString, renderToStaticMarkup } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'react-dom/server'"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { escapeInject, dangerouslySkipEscape } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/server'"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Layout } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" './Layout'"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { createStyleRegistry, StyleRegistry } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'styled-jsx'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" registry"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" createStyleRegistry"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" onRenderHtml"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // flush styles to support the possibility of concurrent rendering"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  registry."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"flush"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"Page"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" pageContext"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // include the styleregistry in the app render to inject the styles"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" viewHtml"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" dangerouslySkipEscape"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"    renderToString"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      <"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"StyleRegistry"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" registry"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:"{registry}>"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        <"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"Layout"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"          <"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"Page"}),e.jsx(s.span,{style:{color:"#24292E"},children:" />"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"        </"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"Layout"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      </"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"StyleRegistry"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    )"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  )"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // extract the styles to add as head tags to the server markup"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" headTags"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" renderToStaticMarkup"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(<>{registry."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"styles"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()}</>)"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" escapeInject"}),e.jsx(s.span,{style:{color:"#032F62"},children:"`<!DOCTYPE html>"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"    <html>"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"      <head>"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"        ${"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"dangerouslySkipEscape"}),e.jsx(s.span,{style:{color:"#032F62"},children:"("}),e.jsx(s.span,{style:{color:"#24292E"},children:"headTags"}),e.jsx(s.span,{style:{color:"#032F62"},children:")"}),e.jsx(s.span,{style:{color:"#032F62"},children:"}"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"      </head>"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"      <body>"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:'        <div id="root">${'}),e.jsx(s.span,{style:{color:"#24292E"},children:"viewHtml"}),e.jsx(s.span,{style:{color:"#032F62"},children:"}</div>"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"      </body>"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#032F62"},children:"    </html>`"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`]}),`
`]}),`
`,e.jsx(s.p,{children:"Example:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(r,{timestamp:"2023.07",repo:"jeremypress/vite-ssr-styled-jsx"}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["vite-plugin-ssr was the ",e.jsx(s.a,{href:"https://vite-plugin-ssr.com/vike",children:"previous name of Vike"}),"."]}),`
`]}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{href:"/css-in-js",doNotInferSectionTitle:!0}),`
`]}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/vercel/styled-jsx#server-side-rendering",children:"styled-jsx README > Server Side Rendering"})}),`
`]})]})}function h(n={}){const{wrapper:s}=n.components||{};return s?e.jsx(s,{...n,children:e.jsx(t,{...n})}):t(n)}const x=Object.freeze(Object.defineProperty({__proto__:null,default:h,pageSectionsExport:p},Symbol.toStringTag,{value:"Module"})),R={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/styled-jsx/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:x}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:a}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:i}}};export{R as configValuesSerialized};
