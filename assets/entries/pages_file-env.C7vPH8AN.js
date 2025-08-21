import{o as i,a as t}from"../chunks/chunk-BublKjzk.js";import{j as e}from"../chunks/chunk-CJTbNtwT.js";import{L as n}from"../chunks/chunk-BveX4gYU.js";/* empty css                      *//* empty css                      */import{C as a}from"../chunks/chunk-CYt7vs6b.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */const d=[{pageSectionId:"for-all-files",pageSectionLevel:2,pageSectionTitle:"For all files"},{pageSectionId:"server-js",pageSectionLevel:3,pageSectionTitle:"`.server.js`"},{pageSectionId:"client-js",pageSectionLevel:3,pageSectionTitle:"`.client.js`"},{pageSectionId:"shared-js",pageSectionLevel:3,pageSectionTitle:"`.shared.js`"},{pageSectionId:"for-files",pageSectionLevel:2,pageSectionTitle:"For `+` files"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function r(l){const s={blockquote:"blockquote",code:"code",em:"em",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...l.components};return e.jsxs(e.Fragment,{children:[e.jsxs(s.p,{children:["Adding a filename suffix ",e.jsx(s.code,{children:".server.js"})," / ",e.jsx(s.code,{children:".client.js"})," / ",e.jsx(s.code,{children:".shared.js"})," to a file has following effect:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["For all files, it ",e.jsx(s.em,{children:"guarantees"})," in which environment the file is loaded."]}),`
`,e.jsxs(s.li,{children:["For ",e.jsxs(n,{href:"/config#files",children:[e.jsx(s.code,{children:"+"})," files"]}),", it ",e.jsx(s.em,{children:"determines"})," in which environment the file is loaded."]}),`
`]}),`
`,e.jsxs(s.p,{children:["See also ",e.jsx(n,{href:"/config#clear-js",doNotInferSectionTitle:!0,noBreadcrumb:!0})," and ",e.jsx(n,{href:"/config#default-js",doNotInferSectionTitle:!0,noBreadcrumb:!0}),"."]}),`
`,e.jsx("h2",{id:"for-all-files",children:"For all files"}),`
`,e.jsx("h3",{id:"server-js",children:e.jsx("code",{children:".server.js"})}),`
`,e.jsxs(s.p,{children:["The most common use case for ",e.jsx(s.code,{children:".server.js"})," is to ensure that a file that contains secret information is never accidentally leaked to the client-side (and thus made public)."]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /server/database/credentials.server.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This file should *never* be imported by client-side code."})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// We use .server.ts to guarantee that."})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  password: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'WLa!9HW?E10a'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["In this example, it's crucial that ",e.jsx(s.code,{children:"credentials.server.js"})," is never loaded by the client-side: otherwise, because client-side JavaScript is public, everyone could read the password defined in ",e.jsx(s.code,{children:"credentials.server.js"}),"."]}),`
`]}),`
`,e.jsxs(s.p,{children:["If some client-side code does load ",e.jsx(s.code,{children:"credentials.server.js"})," then Vike throws an error and aborts any attempt to build for production. (In development Vike shows a warning.)"]}),`
`,e.jsx(a,{lineBreak:"white-space",children:e.jsx(s.pre,{children:e.jsx(s.code,{children:`[vike][Wrong Usage] Server-only module /server/database/credentials.server.js (https://vike.dev/file-env) imported on the client-side by /pages/product/@id/+Page.js
`})})}),`
`,e.jsx("h3",{id:"client-js",children:e.jsx("code",{children:".client.js"})}),`
`,e.jsxs(s.p,{children:["You can use ",e.jsx(s.code,{children:".client.js"})," to ensure that a file always runs on the client-side."]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /utils/someClientCode.client.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This code only works in the browser; we use .client.ts to assert that this file is"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// never loaded on the server-side."})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"window."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"onclick"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" () "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // ..."})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h3",{id:"shared-js",children:e.jsx("code",{children:".shared.js"})}),`
`,e.jsxs(s.p,{children:["The file extension ",e.jsx(s.code,{children:".shared.js"})," has an effect only for ",e.jsx(s.code,{children:"+"})," files (see section below): it's useless for other files."]}),`
`,e.jsxs("h2",{id:"for-files",children:["For ",e.jsx("code",{children:"+"})," files"]}),`
`,e.jsxs(s.p,{children:["For ",e.jsxs(n,{href:"/config#files",children:[e.jsx(s.code,{children:"+"})," files"]}),", the most common use case is to change the environment of the ",e.jsxs(n,{href:"/data",children:[e.jsx(s.code,{children:"data()"})," hook"]}),": by renaming ",e.jsx(s.code,{children:"+data.js"})," to ",e.jsx(s.code,{children:"+data.shared.js"}),"/",e.jsx(s.code,{children:"+data.server.js"}),"/",e.jsx(s.code,{children:"+data.client.js"})," you tell Vike in which environment ",e.jsx(s.code,{children:"data()"})," should be loaded and executed, see ",e.jsx(n,{href:"/data#environment"}),"."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["Essentially, it's a simpler way to set the ",e.jsxs(n,{href:"/meta#example-modify-data-env",children:[e.jsx(s.code,{children:"meta.env"})," setting"]})," of a ",e.jsx(s.code,{children:"+"}),` file.
Adding `,e.jsx(s.code,{children:".server.js"}),"/",e.jsx(s.code,{children:".client.js"}),"/",e.jsx(s.code,{children:".shared"})," to a ",e.jsx(s.code,{children:"+"})," file, for example ",e.jsx(s.code,{children:"/pages/product/@id/+data.js"}),", is equivalent to:"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/product/@id/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Config } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/types'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  meta: {"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    data: {"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"      // .shared.js"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      env: { server: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:", client: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:" },"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"      // .server.js"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      env: { server: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:", client: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"}),e.jsx(s.span,{style:{color:"#24292E"},children:" },"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"      // .client.js"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      env: { server: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"}),e.jsx(s.span,{style:{color:"#24292E"},children:", client: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/config#clear-js",doNotInferSectionTitle:!0}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/config#default-js",doNotInferSectionTitle:!0}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/meta"}),`
`]}),`
`]})]})}function o(l={}){const{wrapper:s}=l.components||{};return s?e.jsx(s,{...l,children:e.jsx(r,{...l})}):r(l)}const c=Object.freeze(Object.defineProperty({__proto__:null,default:o,pageSectionsExport:d},Symbol.toStringTag,{value:"Module"})),C={serverOnlyHooks:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:t}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:i}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/file-env/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:c}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{C as configValuesSerialized};
