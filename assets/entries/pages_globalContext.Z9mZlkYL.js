import{j as e,i as r,L as o,o as a}from"../chunks/chunk-C6tSgyWW.js";import{L as s}from"../chunks/chunk-DZ1FswhG.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-Dxvr955I.js";/* empty css                      */import{P as t}from"../chunks/chunk-BBafyIdy.js";/* empty css                      */const d=[{pageSectionId:"built-in",pageSectionLevel:2,pageSectionTitle:"Built-in"},{pageSectionId:"custom",pageSectionLevel:2,pageSectionTitle:"Custom"},{pageSectionId:"lifecycle",pageSectionLevel:2,pageSectionTitle:"Lifecycle"},{pageSectionId:"server-side",pageSectionLevel:3,pageSectionTitle:"Server-side"},{pageSectionId:"client-side",pageSectionLevel:3,pageSectionTitle:"Client-side"},{pageSectionId:"pre-rendering",pageSectionLevel:3,pageSectionTitle:"Pre-rendering"},{pageSectionId:"typescript",pageSectionLevel:2,pageSectionTitle:"TypeScript"},{pageSectionId:"basics",pageSectionLevel:3,pageSectionTitle:"Basics"},{pageSectionId:"narrowing-down",pageSectionLevel:3,pageSectionTitle:"Narrowing down"},{pageSectionId:"extend",pageSectionLevel:3,pageSectionTitle:"Extend"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function l(i){const n={blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...i.components};return e.jsxs(e.Fragment,{children:[e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"globalContext"})," object is used for storing global information (typically used by all/many pages)."]}),`
`,e.jsxs(n.p,{children:["For example, it can be used to hold a list of URLs for generating a navigation menu, such as the list of links of ",e.jsx(n.code,{children:"vike.dev"}),"'s navigation menu."]}),`
`,e.jsxs(n.p,{children:["It's commonly used for storing custom properties, see ",e.jsx(s,{href:"#custom"}),"."]}),`
`,e.jsxs(n.p,{children:["Each process (either a server process or a browser tab) has exactly one and unique ",e.jsx(n.code,{children:"globalContext"})," object which is created when the process starts, see ",e.jsx(s,{href:"#lifecycle"}),"."]}),`
`,e.jsxs(n.p,{children:["If you store information (e.g. ",e.jsx(n.code,{children:"globalContext.someData = 42"}),") then it's available anywhere in your app until the process is terminated. You can acess ",e.jsx(n.code,{children:"globalContext"})," anywhere by using ",e.jsx(s,{href:"/getGlobalContext",noBreadcrumb:!0})," and ",e.jsx(s,{href:"/pageContext#globalContext",children:e.jsx(n.code,{children:"pageContext.globalContext"})}),"."]}),`
`,e.jsxs(n.p,{children:["See also: ",e.jsx(s,{href:"/pageContext"}),"."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["It only provides information at runtime. To get information loaded at build-time, see ",e.jsx(s,{href:"/getVikeConfig"})," instead."]}),`
`]}),`
`,e.jsx("h2",{id:"built-in",children:"Built-in"}),`
`,e.jsxs(n.p,{children:["While ",e.jsx(n.code,{children:"globalContext"})," has some built-in properties, it's mostly used to store ",e.jsx(s,{href:"#custom",children:"custom properties"}),"."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"globalContext"})," object also contains many internals (they are prefixed with ",e.jsx(n.code,{children:"_"}),", e.g. ",e.jsx(n.code,{children:"globalContext._viteDevServer"}),"). You should use them only if strictly needed and, if you do, then let us know so that we can add official support for your use case (otherwise you'll expose yourself to breaking changes upon any version update)."]}),`
`]}),`
`,e.jsx(t,{name:"pages"}),`
`,e.jsx(n.p,{children:"Environment: server, client"}),`
`,e.jsxs(n.p,{children:["All runtime information about your ",e.jsx(s,{href:"/config",children:"pages's configuration"})," (for example each page's route)."]}),`
`,e.jsx(t,{name:"config"}),`
`,e.jsx(n.p,{children:"Environment: server, client"}),`
`,e.jsxs(n.p,{children:["All runtime information about your ",e.jsx(s,{href:"/config",children:"app configuration"}),"."]}),`
`,e.jsx(t,{name:"isClientSide"}),`
`,e.jsx(n.p,{children:"Environment: server, client"}),`
`,e.jsxs(n.p,{children:["Same as ",e.jsx(s,{href:"/pageContext#isClientSide",children:e.jsx(n.code,{children:"pageContext.isClientSide"})}),"."]}),`
`,e.jsx(t,{name:"isGlobalContext"}),`
`,e.jsx(n.p,{children:"Environment: server, client"}),`
`,e.jsxs(n.p,{children:["Like ",e.jsx(s,{href:"/pageContext#isPageContext",children:e.jsx(n.code,{children:"pageContext.isPageContext"})}),"."]}),`
`,e.jsx(t,{name:"assetsManifest"}),`
`,e.jsx(n.p,{children:"Environment: server"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(s,{href:"/preloading#assets-manifest",children:"assets manifest"}),"."]}),`
`,e.jsx(t,{name:"viteConfig"}),`
`,e.jsx(n.p,{children:"Environment: server"}),`
`,e.jsxs(n.p,{children:["The entire Vite's config, only available at development and during ",e.jsx(s,{href:"/pre-rendering",children:"pre-rendering"}),"."]}),`
`,e.jsx(t,{name:"viteConfigRuntime"}),`
`,e.jsx(n.p,{children:"Environment: server"}),`
`,e.jsx(n.p,{children:"A tiny subset of Vite's config that is also available in production."}),`
`,e.jsx(t,{name:"baseAssets"}),`
`,e.jsx(n.p,{children:"Environment: server"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(s,{href:"/base-url#baseassets",children:"assets Base URL"}),"."]}),`
`,e.jsx(t,{name:"baseServer"}),`
`,e.jsx(n.p,{children:"Environment: server"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(s,{href:"/base-url#baseserver",children:"server Base URL"}),"."]}),`
`,e.jsx("h2",{id:"custom",children:"Custom"}),`
`,e.jsxs(n.p,{children:["Custom properties are usually initialized using ",e.jsxs(s,{href:"/onCreateGlobalContext",children:[e.jsx(n.code,{children:"onCreateGlobalContext()"})," hooks"]}),"."]}),`
`,e.jsxs(n.p,{children:["You can also initialize new and modify existing ",e.jsx(n.code,{children:"globalContext"})," properties at any time and anywhere in your app, for example using ",e.jsx(s,{href:"/pageContext#globalContext",children:e.jsx(n.code,{children:"pageContext.globalContext"})}),"."]}),`
`,e.jsx("h2",{id:"lifecycle",children:"Lifecycle"}),`
`,e.jsxs(n.p,{children:["The lifecycle of the ",e.jsx(n.code,{children:"globalContext"})," object is completely different between the client- and server-side."]}),`
`,e.jsx("h3",{id:"server-side",children:"Server-side"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"globalContext"})," is created when the server starts and lives until the server process is shut down."]}),`
`,e.jsxs(n.p,{children:["If your JavaScript server runs in a single process, then you have a single ",e.jsx(n.code,{children:"globalContext"})," object for your entire server-side. If that server process stays alive for many days at a time, then the ",e.jsx(n.code,{children:"globalContext"})," object does too."]}),`
`,e.jsxs(n.p,{children:["On edge environments, where there can be multiple server processes/workers, you can have multiple server-side ",e.jsx(n.code,{children:"globalContext"})," object — one per process/worker."]}),`
`,e.jsx("h3",{id:"client-side",children:"Client-side"}),`
`,e.jsxs(n.p,{children:["When a user starts visting your website, a new ",e.jsx(n.code,{children:"globalContext"})," object is created that lives until the user closes your website. If the user opens your website in multiple tabs, there is one ",e.jsx(n.code,{children:"globalContext"})," per tab."]}),`
`,e.jsxs(n.p,{children:["Given multiple users visiting your website, there can be a lot of client-side ",e.jsx(n.code,{children:"globalContext"})," objects, which are, by their very nature, ephemeral."]}),`
`,e.jsx("h3",{id:"pre-rendering",children:"Pre-rendering"}),`
`,e.jsxs(n.p,{children:["Upon ",e.jsx(s,{href:"/pre-rendering",children:"pre-rendering"}),", there is exactly one ",e.jsx(n.code,{children:"globalContext"})," object that lives from the beginning until the end of the pre-rendering process."]}),`
`,e.jsx("h2",{id:"typescript",children:"TypeScript"}),`
`,e.jsx("h3",{id:"basics",children:"Basics"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // For code loaded in client and server"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  GlobalContext,"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // For code loaded in client only"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  GlobalContextClient,"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // For code loaded in server only"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  GlobalContextServer"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"} "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/types'"})]})]})})}),`
`,e.jsx("h3",{id:"narrowing-down",children:"Narrowing down"}),`
`,e.jsxs(n.p,{children:["You can use ",e.jsx(n.code,{children:"globalContext.isClientSide"})," and ",e.jsx(n.code,{children:"globalContext.isGlobalContext"})," to narrow down TypeScript unions, see ",e.jsx(s,{href:"/pageContext#narrowing-down"}),"."]}),`
`,e.jsx("h3",{id:"extend",children:"Extend"}),`
`,e.jsxs(n.p,{children:["To extend ",e.jsx(n.code,{children:"GlobalContext"}),"/",e.jsx(n.code,{children:"GlobalContextServer"}),"/",e.jsx(n.code,{children:"GlobalContextClient"}),", use the global interface ",e.jsx(n.code,{children:"Vike.GlobalContext"}),":"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"declare"}),e.jsx(n.span,{style:{color:"#24292E"},children:" global {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  namespace"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Vike"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"    interface"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" GlobalContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"      // Type of globalContext.user"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#E36209"},children:"      user"}),e.jsx(n.span,{style:{color:"#D73A49"},children:"?:"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#E36209"},children:"        name"}),e.jsx(n.span,{style:{color:"#D73A49"},children:":"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" string"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#E36209"},children:"        id"}),e.jsx(n.span,{style:{color:"#D73A49"},children:":"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" string"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#E36209"},children:"        isAdmin"}),e.jsx(n.span,{style:{color:"#D73A49"},children:":"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" boolean"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"      }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// If you define Vike.GlobalContext in a .d.ts file then"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// make sure there is at least one export/import statement."})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Tell TypeScript this file isn't an ambient module:"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {}"})]})]})})}),`
`,e.jsxs(n.p,{children:["To define properties only for the server-/client-side, use the interfaces ",e.jsx(n.code,{children:"Vike.GlobalContextServer"})," and ",e.jsx(n.code,{children:"Vike.GlobalContextClient"})," instead."]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/pageContext"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/getGlobalContext"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/onCreateGlobalContext"}),`
`]}),`
`]})]})}function c(i={}){const{wrapper:n}=i.components||{};return n?e.jsx(n,{...i,children:e.jsx(l,{...i})}):l(i)}const h=Object.freeze(Object.defineProperty({__proto__:null,default:c,pageSectionsExport:d},Symbol.toStringTag,{value:"Module"})),w={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:a}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/globalContext/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:h}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:r}}};export{w as configValuesSerialized};
