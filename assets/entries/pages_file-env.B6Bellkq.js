import{o as t,a as d}from"../chunks/chunk-CxIOOiKX.js";import{j as e}from"../chunks/chunk-B35a6FX-.js";import{L as n}from"../chunks/chunk-BbfG-aTg.js";/* empty css                      *//* empty css                      */import{C as c}from"../chunks/chunk-c7K6czYj.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as a}from"../chunks/chunk-CJvpbNqo.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */const o=[{pageSectionId:"for-all-files",pageSectionLevel:2,pageSectionTitle:"For all files"},{pageSectionId:"server-js",pageSectionLevel:3,pageSectionTitle:"`.server.js`"},{pageSectionId:"client-js",pageSectionLevel:3,pageSectionTitle:"`.client.js`"},{pageSectionId:"for-files",pageSectionLevel:2,pageSectionTitle:"For `+` files"},{pageSectionId:"ssr-js",pageSectionLevel:3,pageSectionTitle:"`.ssr.js`"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function i(l){const s={blockquote:"blockquote",code:"code",div:"div",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...a(),...l.components},{ChoiceGroup:r}=s;return r||p("ChoiceGroup"),e.jsxs(e.Fragment,{children:[e.jsxs(s.p,{children:["For any file, adding ",e.jsx(s.code,{children:".server.js"})," / ",e.jsx(s.code,{children:".client.js"})," ",e.jsx(s.strong,{children:"guarantees"})," the environment in which it's loaded."]}),`
`,e.jsxs(s.p,{children:["For ",e.jsxs(n,{href:"/config#files",children:[e.jsx(s.code,{children:"+"})," files"]}),", adding ",e.jsx(s.code,{children:".server.js"})," / ",e.jsx(s.code,{children:".client.js"})," / ",e.jsx(s.code,{children:".shared.js"})," / ",e.jsx(s.code,{children:".ssr.js"})," ",e.jsx(s.strong,{children:"modifies"})," the environment."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"See also:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/config#clear-js",doNotInferSectionTitle:!0,noBreadcrumb:!0}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/config#default-js",doNotInferSectionTitle:!0,noBreadcrumb:!0}),`
`]}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"for-all-files",children:"For all files"}),`
`,e.jsx("h3",{id:"server-js",children:e.jsx("code",{children:".server.js"})}),`
`,e.jsxs(s.p,{children:["The most common use case for ",e.jsx(s.code,{children:".server.js"})," is to ensure that a file that contains secret information is never accidentally leaked to the client-side (and thus made public)."]}),`
`,e.jsxs(r,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",hide:!0,children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /server/database/credentials.server.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This file should *never* be imported by client-side code."})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// We use .server.js to guarantee that."})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  password: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'WLa!9HW?E10a'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /server/database/credentials.server.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This file should *never* be imported by client-side code."})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// We use .server.ts to guarantee that."})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  password: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'WLa!9HW?E10a'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})})]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["In this example, it's crucial that ",e.jsx(s.code,{children:"credentials.server.js"})," is never loaded by the client-side: otherwise, because client-side JavaScript is public, everyone could read the password defined in ",e.jsx(s.code,{children:"credentials.server.js"}),"."]}),`
`]}),`
`,e.jsxs(s.p,{children:["If some client-side code does load ",e.jsx(s.code,{children:"credentials.server.js"})," then Vike throws an error and aborts any attempt to build for production. (In development Vike shows a warning.)"]}),`
`,e.jsx(c,{lineBreak:"white-space",children:e.jsx(s.pre,{children:e.jsx(s.code,{children:`[vike][Wrong Usage] Server-only module /server/database/credentials.server.js (https://vike.dev/file-env) imported on the client-side by /pages/product/@id/+Page.js
`})})}),`
`,e.jsx("h3",{id:"client-js",children:e.jsx("code",{children:".client.js"})}),`
`,e.jsxs(s.p,{children:["You can use ",e.jsx(s.code,{children:".client.js"})," to ensure that a file always runs on the client-side."]}),`
`,e.jsxs(r,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",hide:!0,children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /utils/someClientCode.client.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This code only works in the browser; we use .client.js to assert that this file is"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// never loaded on the server-side."})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"window."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"onclick"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" () "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // ..."})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /utils/someClientCode.client.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This code only works in the browser; we use .client.ts to assert that this file is"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// never loaded on the server-side."})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"window."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"onclick"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" () "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // ..."})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})})]}),`
`,e.jsxs("h2",{id:"for-files",children:["For ",e.jsx("code",{children:"+"})," files"]}),`
`,e.jsxs(s.p,{children:["For ",e.jsxs(n,{href:"/config#files",children:[e.jsx(s.code,{children:"+"})," files"]}),", the most common use case is to change the environment of ",e.jsx(n,{href:"/hooks",children:"Vike hooks"}),". Most notably the ",e.jsxs(n,{href:"/data",children:[e.jsx(s.code,{children:"data()"})," hook"]}),"."]}),`
`,e.jsxs(s.p,{children:["For example, by renaming ",e.jsx(s.code,{children:"+data.js"})," to ",e.jsx(s.code,{children:"+data.shared.js"}),"/",e.jsx(s.code,{children:"+data.server.js"}),"/",e.jsx(s.code,{children:"+data.client.js"})," you tell Vike in which environment ",e.jsx(s.code,{children:"data()"})," should be loaded and executed, see ",e.jsx(n,{href:"/data#environment"}),"."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["Essentially, it's a simpler way to set the ",e.jsxs(n,{href:"/meta#example-modify-data-env",children:[e.jsx(s.code,{children:"meta.env"})," setting"]})," of a ",e.jsx(s.code,{children:"+"}),` file.
Adding `,e.jsx(s.code,{children:".server.js"}),"/",e.jsx(s.code,{children:".client.js"}),"/",e.jsx(s.code,{children:".shared"})," to a ",e.jsx(s.code,{children:"+"})," file, for example ",e.jsx(s.code,{children:"/pages/product/@id/+data.js"}),", is equivalent to:"]}),`
`,e.jsxs(r,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/product/@id/+config.js"})}),`
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
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/product/@id/+config.ts"})}),`
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
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Config"})]})]})})})})]}),`
`]}),`
`,e.jsx("h3",{id:"ssr-js",children:e.jsx("code",{children:".ssr.js"})}),`
`,e.jsxs(s.p,{children:["Hooks with ",e.jsx(s.code,{children:".ssr.js"})," behave like ",e.jsx(s.code,{children:".server.js"})," but ",e.jsx(s.strong,{children:"run only during SSR"})," (initial page load on the server) — not during client-side navigation (",e.jsxs(n,{href:"/pageContext.json",children:[e.jsx(s.code,{children:"pageContext.json"})," requests"]}),")."]}),`
`,e.jsxs(s.p,{children:["It's commonly used to initialize stores during SSR (e.g. Pinia and Redux), see: ",e.jsx(n,{href:"/onCreatePageContext#use-case-store",doNotInferSectionTitle:!0}),"."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["Using ",e.jsx(s.code,{children:".ssr.js"})," instead of ",e.jsx(s.code,{children:".server.js"})," prevents unnecessary ",e.jsxs(n,{href:"/pageContext.json",children:[e.jsx(s.code,{children:"pageContext.json"})," requests"]})," during client-side navigation."]}),`
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
`]})]})}function h(l={}){const{wrapper:s}={...a(),...l.components};return s?e.jsx(s,{...l,children:e.jsx(i,{...l})}):i(l)}function p(l,s){throw new Error("Expected component `"+l+"` to be defined: you likely forgot to import, pass, or provide it.")}const j=Object.freeze(Object.defineProperty({__proto__:null,default:h,pageSectionsExport:o},Symbol.toStringTag,{value:"Module"})),I={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:d}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:t}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/file-env/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:j}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{I as configValuesSerialized};
