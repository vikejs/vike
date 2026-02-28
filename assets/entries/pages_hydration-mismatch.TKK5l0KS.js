import{o as i,a as l}from"../chunks/chunk-CxIOOiKX.js";import{j as e}from"../chunks/chunk-B35a6FX-.js";import{L as t}from"../chunks/chunk-BbfG-aTg.js";/* empty css                      */import{W as o}from"../chunks/chunk-4VEk4LmV.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as a}from"../chunks/chunk-CJvpbNqo.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */const d=[{pageSectionId:"hydration-mismatch",pageSectionLevel:2,pageSectionTitle:"Hydration mismatch"},{pageSectionId:"vue",pageSectionLevel:3,pageSectionTitle:"Vue"},{pageSectionId:"react",pageSectionLevel:3,pageSectionTitle:"React"},{pageSectionId:"example",pageSectionLevel:2,pageSectionTitle:"Example"},{pageSectionId:"common-causes-solutions",pageSectionLevel:2,pageSectionTitle:"Common causes & solutions"},{pageSectionId:"suppress-hydration-mismatch",pageSectionLevel:2,pageSectionTitle:"Suppress Hydration Mismatch"},{pageSectionId:"react",pageSectionLevel:3,pageSectionTitle:"React"},{pageSectionId:"vue",pageSectionLevel:3,pageSectionTitle:"Vue"}];function r(s){const n={a:"a",blockquote:"blockquote",code:"code",em:"em",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...a(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsxs(n.p,{children:["A recurring problem when doing ",e.jsx(t,{href:"/ssr",children:"SSR"})," are so-called ",e.jsx(n.em,{children:"hydration mismatches"}),"."]}),`
`,e.jsx("h2",{id:"hydration-mismatch",children:"Hydration mismatch"}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["What hydration means is explained at ",e.jsx(t,{href:"/hydration"})]}),`
`]}),`
`,e.jsx(n.p,{children:"A hydration mismatch is when the content rendered to HTML on the server isn't the same as the content rendered in the browser."}),`
`,e.jsx(n.p,{children:"Hydration mismatches can induce performance degradations and bugs and should therefore be avoided."}),`
`,e.jsx("h3",{id:"vue",children:"Vue"}),`
`,e.jsx(n.p,{children:"Upon a hydration mismatch, Vue throws following errors in the browser:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`[Vue warn]: Hydration text mismatch:
 - Client: "some content"
 - Server: "some other content"
   at <SomeComponent>
   at <App>
`})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`Hydration completed but contains mismatches.
`})}),`
`,e.jsx("h3",{id:"react",children:"React"}),`
`,e.jsx(n.p,{children:"Upon a hydration mismatch, React throws following errors in the browser:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`Warning: Text content did not match. Server: "some content" Client: "some other content"
`})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`An error occurred during hydration. The server HTML was replaced with client content in <SomeComponent>.
`})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`Text content does not match server-rendered HTML.
`})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`Hydration failed because the initial UI does not match what was rendered on the server.
`})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering.
`})}),`
`,e.jsx("h2",{id:"example",children:"Example"}),`
`,e.jsxs(n.p,{children:["This component causes a hydration mismatch because the milliseconds rendered to HTML (e.g. ",e.jsx(n.code,{children:"<span>123</span>"}),") won't match the milliseconds rendered in the browser (e.g. ",e.jsx(n.code,{children:"<span>167</span>"}),")."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"jsx","data-theme":"github-light",children:e.jsx(n.code,{"data-language":"jsx","data-theme":"github-light",style:{display:"grid"},children:e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"<"}),e.jsx(n.span,{style:{color:"#22863A"},children:"span"}),e.jsx(n.span,{style:{color:"#24292E"},children:">{ "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"new"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Date"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"getMilliseconds"}),e.jsx(n.span,{style:{color:"#24292E"},children:"() }</"}),e.jsx(n.span,{style:{color:"#22863A"},children:"span"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]})})})}),`
`,e.jsx(n.p,{children:"Instead, to prevent the hydration mismatch:"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { onBeforeRender }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onBeforeRender"}),e.jsx(n.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" milliseconds"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#D73A49"},children:" new"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Date"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"getMilliseconds"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    pageContext: {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"      milliseconds"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"jsx","data-theme":"github-light",children:e.jsx(n.code,{"data-language":"jsx","data-theme":"github-light",style:{display:"grid"},children:e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"<"}),e.jsx(n.span,{style:{color:"#22863A"},children:"span"}),e.jsx(n.span,{style:{color:"#24292E"},children:">{ pageContext.milliseconds }</"}),e.jsx(n.span,{style:{color:"#22863A"},children:"span"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]})})})}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"pageContext.milliseconds"})," value is set exactly once, which means that the milliseconds value is the same when rendered to HTML on the server-side and when hydrated in the browser."]}),`
`,e.jsx("h2",{id:"common-causes-solutions",children:"Common causes & solutions"}),`
`,e.jsx(n.p,{children:"Common causes:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Rendered content is actually different"}),". Make sure your components render the same content when rendered to HTML on the server-side and when rendered/hydrated on the client-side.",`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["See ",e.jsx(n.a,{href:"#example",children:"example"})," above."]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Proxies"}),": Make sure your proxies don't apply problematic HTML transformations. For example, most HTML minifiers cause hydration mismatches and have to be disabled.",`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"If you use Cloudflare, you have to disable Cloudflare's automatic HTML minifier."}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Browser cache"}),": Your browser's cache may load cached & outdated JavaScript, which may cause hydration mismatches if a component is outdated on the client-side and renders something else than the up-to-date component on the server-side. Clear your browser cache and try again.",`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"In principle, this shouldn't happen since Vite always busts the browser cache whenever a file is changed. If you get issues with hydration mismatches related to browser caching, then let us know and we'll look into it."}),`
`]}),`
`]}),`
`]}),`
`,e.jsx(n.p,{children:"With React:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Old React versions"})," are buggy around stitching text segments leading to ",e.jsx(n.code,{children:"Warning: Text content did not match"}),". Update to ",e.jsx(n.code,{children:"react@18.2.0"})," or above."]}),`
`]}),`
`,e.jsx("h2",{id:"suppress-hydration-mismatch",children:"Suppress Hydration Mismatch"}),`
`,e.jsx(n.p,{children:"For situations where mismatches are inevitable or difficult to avoid, you can silence the hydration mismatch warning."}),`
`,e.jsx(o,{children:"Don’t overuse it: for less potential bugs and for (slightly or significant) better performance, it's best to avoid hydration mismatches if you can."}),`
`,e.jsx("h3",{id:"react",children:"React"}),`
`,e.jsxs(n.p,{children:["Use the ",e.jsx(n.code,{children:"suppressHydrationWarning"})," attribute:"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"jsx","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"jsx","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" SomeComponent"}),e.jsx(n.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" ("})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"    <"}),e.jsx(n.span,{style:{color:"#22863A"},children:"span"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" suppressHydrationWarning"}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:"{"}),e.jsx(n.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(n.span,{style:{color:"#24292E"},children:"}>"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"      Current Date: {"}),e.jsx(n.span,{style:{color:"#D73A49"},children:"new"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Date"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"toLocaleDateString"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()}"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"    </"}),e.jsx(n.span,{style:{color:"#22863A"},children:"span"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  )"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.p,{children:"See:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://react.dev/reference/react-dom/hydrate#suppressing-unavoidable-hydration-mismatch-errors",children:"React Docs > hydrate > Suppressing unavoidable hydration mismatch errors"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://stackoverflow.com/questions/53959948/is-there-any-way-to-avoid-text-content-did-not-match-warning-in-ssr-with-react/68438131",children:'StackOverflow > Is there any way to avoid "Text content did not match" warning in SSR with React?'})}),`
`]}),`
`,e.jsx("h3",{id:"vue",children:"Vue"}),`
`,e.jsxs(n.p,{children:["Use the ",e.jsx(n.code,{children:"data-allow-mismatch"})," attribute:"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"vue","data-theme":"github-light",children:e.jsx(n.code,{"data-language":"vue","data-theme":"github-light",style:{display:"grid"},children:e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"<"}),e.jsx(n.span,{style:{color:"#22863A"},children:"div"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" data-allow-mismatch"}),e.jsx(n.span,{style:{color:"#24292E"},children:"="}),e.jsx(n.span,{style:{color:"#032F62"},children:'"text"'}),e.jsx(n.span,{style:{color:"#24292E"},children:">{{ data.toLocaleString() }}</"}),e.jsx(n.span,{style:{color:"#22863A"},children:"div"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]})})})}),`
`,e.jsx(n.p,{children:"See:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsxs(n.a,{href:"https://vuejs.org/api/ssr.html#data-allow-mismatch",children:["Vue Docs > Server-Side Rendering API > ",e.jsx(n.code,{children:"data-allow-mismatch"})]})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://stackoverflow.com/questions/68438016/vuessr-suppress-hydration-mismatch-warning/68438108",children:"StackOverflow > [Vue][SSR] Suppress hydration mismatch warning"})}),`
`]})]})}function c(s={}){const{wrapper:n}={...a(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(r,{...s})}):r(s)}const h=Object.freeze(Object.defineProperty({__proto__:null,default:c,pageSectionsExport:d},Symbol.toStringTag,{value:"Module"})),D={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:l}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:i}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/hydration-mismatch/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:h}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{D as configValuesSerialized};
