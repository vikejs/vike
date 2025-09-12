import{o as t,a as l}from"../chunks/chunk-eD_Oz-vE.js";import{j as e}from"../chunks/chunk-CC4ltPc3.js";import{L as r}from"../chunks/chunk-DFQUjVEP.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{C as i}from"../chunks/chunk-CvFcKlTK.js";/* empty css                      */import"../chunks/chunk-dnLs9nqY.js";/* empty css                      */const d=[{pageSectionId:"execution-order",pageSectionLevel:2,pageSectionTitle:"Execution order"},{pageSectionId:"environment",pageSectionLevel:2,pageSectionTitle:"Environment"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function o(s){const n={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(i,{env:e.jsxs(e.Fragment,{children:["server (",e.jsx(r,{href:"#environment",children:"configurable"}),")"]}),cumulative:!1}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"guard()"})," hook enables you to protect pages from unauthorized and unexpected access."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/admin/+guard.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { guard }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { PageContextServer } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { render } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/abort'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// This guard() hook protects all pages /pages/admin/**/+Page.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" guard"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#D73A49"},children:":"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" PageContextServer"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(n.span,{style:{color:"#24292E"},children:" ("}),e.jsx(n.span,{style:{color:"#D73A49"},children:"!"}),e.jsx(n.span,{style:{color:"#24292E"},children:"pageContext.user.isAdmin) {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"    throw"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" render"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#005CC5"},children:"401"}),e.jsx(n.span,{style:{color:"#24292E"},children:", "}),e.jsx(n.span,{style:{color:"#032F62"},children:`"You aren't allowed to access this page."`}),e.jsx(n.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.p,{children:"Note that:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["It can be asynchronous. (Unlike ",e.jsx(r,{href:"/route-function",children:"Route Functions"})," which are always synchronous.)"]}),`
`,e.jsxs(n.li,{children:["A single ",e.jsx(n.code,{children:"guard()"})," hook ",e.jsx(r,{href:"/config#inheritance",children:"can apply to one or multiple pages"}),"."]}),`
`,e.jsxs(n.li,{children:["It's always used together with ",e.jsx(r,{href:"/render",children:e.jsx(n.code,{children:"throw render()"})})," or ",e.jsx(r,{href:"/redirect",children:e.jsx(n.code,{children:"throw redirect()"})}),". (The ",e.jsx(n.code,{children:"guard()"})," hook doesn't accept any return value.)"]}),`
`]}),`
`,e.jsx("h2",{id:"execution-order",children:"Execution order"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"guard()"})," hook is the first hook called after the routing is evaluated. Most notably, it's always called before the ",e.jsxs(r,{href:"/data",children:[e.jsx(n.code,{children:"data()"})," hook"]}),". See ",e.jsx(r,{href:"/hooks#lifecycle"}),"."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["We recommend using ",e.jsx(n.code,{children:"throw render()"})," / ",e.jsx(n.code,{children:"throw redirect()"})," before fetching data, whenever possible. (Unauthorized/unexpected data fetching can be problematic.)"]}),`
`]}),`
`,e.jsxs(n.p,{children:["If you want to guard your pages after or during fetching data, then use ",e.jsx(r,{href:"/render",children:e.jsx(n.code,{children:"throw render()"})})," / ",e.jsx(r,{href:"/redirect",children:e.jsx(n.code,{children:"throw redirect()"})})," inside your ",e.jsx(n.code,{children:"data()"})," hook instead (or any another ",e.jsx(r,{href:"/hooks",children:"Vike hook"}),")."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["For being able to use ",e.jsx(n.code,{children:"throw render()"})," / ",e.jsx(n.code,{children:"throw redirect()"})," inside UI components, see ",e.jsxs(n.a,{href:"https://github.com/vikejs/vike/issues/1707",children:["#1707: Use ",e.jsx(n.code,{children:"throw render()"})," / ",e.jsx(n.code,{children:"throw redirect()"})," inside React/Vue/Solid components"]}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"environment",children:"Environment"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"guard()"})," hook is called in the same environment as ",e.jsx(r,{href:"/data",children:e.jsx(n.code,{children:"data()"})}),". In other words, it's always called on the server-side unless you ",e.jsxs(r,{href:"/data#environment",children:["configure ",e.jsx(n.code,{children:"data()"})," to run on the client-side"]}),"."]}),`
`,e.jsxs(n.p,{children:["If the page doesn't have any ",e.jsx(n.code,{children:"data()"})," hook, then ",e.jsx(n.code,{children:"guard()"})," executes in the environment where the routing is evaluated. See ",e.jsx(r,{href:"/hooks#lifecycle"}),"."]}),`
`,e.jsxs(n.p,{children:["For more control on where and when your guarding logic is executed, consider using ",e.jsx(r,{href:"/render",children:e.jsx(n.code,{children:"throw render()"})})," / ",e.jsx(r,{href:"/redirect",children:e.jsx(n.code,{children:"throw redirect()"})})," inside another hook than ",e.jsx(n.code,{children:"guard()"}),"."]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(r,{href:"/auth#login-flow"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(r,{href:"/render"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(r,{href:"/redirect"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(r,{href:"/data"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(r,{href:"/hooks"}),`
`]}),`
`]})]})}function a(s={}){const{wrapper:n}=s.components||{};return n?e.jsx(n,{...s,children:e.jsx(o,{...s})}):o(s)}const c=Object.freeze(Object.defineProperty({__proto__:null,default:a,pageSectionsExport:d},Symbol.toStringTag,{value:"Module"})),C={serverOnlyHooks:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:l}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:t}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/guard/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:c}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{C as configValuesSerialized};
