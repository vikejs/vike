import{o,a}from"../chunks/chunk-CxIOOiKX.js";import{j as e}from"../chunks/chunk-B35a6FX-.js";import{L as s}from"../chunks/chunk-BbfG-aTg.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as r}from"../chunks/chunk-CJvpbNqo.js";import{P as t}from"../chunks/chunk-CXTQ_f3W.js";/* empty css                      */import{C as d}from"../chunks/chunk-BLfhGi7M.js";/* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-DuyKlQcD.js";/* empty css                      */const c=[{pageSectionId:"built-in",pageSectionLevel:2,pageSectionTitle:"Built-in"},{pageSectionId:"custom",pageSectionLevel:2,pageSectionTitle:"Custom"},{pageSectionId:"lifecycle",pageSectionLevel:2,pageSectionTitle:"Lifecycle"},{pageSectionId:"server-side",pageSectionLevel:3,pageSectionTitle:"Server-side"},{pageSectionId:"client-side",pageSectionLevel:3,pageSectionTitle:"Client-side"},{pageSectionId:"pre-rendering",pageSectionLevel:3,pageSectionTitle:"Pre-rendering"},{pageSectionId:"typescript",pageSectionLevel:2,pageSectionTitle:"TypeScript"},{pageSectionId:"basics",pageSectionLevel:3,pageSectionTitle:"Basics"},{pageSectionId:"narrowing-down",pageSectionLevel:3,pageSectionTitle:"Narrowing down"},{pageSectionId:"extend",pageSectionLevel:3,pageSectionTitle:"Extend"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function i(l){const n={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...r(),...l.components};return e.jsxs(e.Fragment,{children:[e.jsx(d,{env:"client, server",global:null}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"globalContext"})," object is used for storing global information (i.e. information shared by multiple pages)."]}),`
`,e.jsxs(n.p,{children:["It has ",e.jsx(s,{href:"#built-in",children:"built-in properties"})," set by Vike, and you can define ",e.jsx(s,{href:"#custom",children:"custom properties"}),"."]}),`
`,e.jsxs(n.p,{children:["For example, you can use ",e.jsx(n.code,{children:"globalContext"})," to save the list of URLs for a navigation menu."]}),`
`,e.jsxs(n.p,{children:["Each environment has a single, unique ",e.jsx(n.code,{children:"globalContext"})," object created when it starts — see ",e.jsx(s,{href:"#lifecycle"}),". An environment can be either a server-side process (Node.js, Bun, Deno, or a worker) or a browser session."]}),`
`,e.jsxs(n.p,{children:["If you store information (e.g. ",e.jsx(n.code,{children:"globalContext.someData = 42"}),") then it's available anywhere in your app until the process is terminated. You can access ",e.jsx(n.code,{children:"globalContext"})," anywhere by using ",e.jsx(s,{href:"/getGlobalContext",noBreadcrumb:!0})," and ",e.jsx(s,{href:"/pageContext#globalContext",children:e.jsx(n.code,{children:"pageContext.globalContext"})}),". You can define ",e.jsx(n.code,{children:"globalContext"})," properties on the server-side while using ",e.jsx(s,{href:"/passToClient",children:e.jsx(n.code,{children:"+passToClient"})})," for accessing them on the client-side."]}),`
`,e.jsxs(n.p,{children:["See also: ",e.jsx(s,{href:"/pageContext"}),"."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["It only provides information at runtime. To get information at build-time, see ",e.jsx(s,{href:"/getVikeConfig"})," instead."]}),`
`]}),`
`,e.jsx("h2",{id:"built-in",children:"Built-in"}),`
`,e.jsxs(n.p,{children:["While ",e.jsx(n.code,{children:"globalContext"})," has some built-in properties, it's mostly used to store ",e.jsx(s,{href:"#custom",children:"custom properties"}),"."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"globalContext"})," object also contains many internals (they are prefixed with ",e.jsx(n.code,{children:"_"}),", e.g. ",e.jsx(n.code,{children:"globalContext._viteDevServer"}),"). You should use them only if strictly needed and, if you do, then let us know so that we can add official support for your use case (otherwise you'll expose yourself to breaking changes upon any version update)."]}),`
`]}),`
`,e.jsx(t,{name:"pages"}),`
`,e.jsx(n.p,{children:"Environment: server, client"}),`
`,e.jsxs(n.p,{children:["Eagerly loaded runtime ",e.jsx(s,{href:"/config",children:"configurations"})," of all pages."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Most configurations of a page aren't eagerly loaded: they're only loaded when rendering that page and, consequently, aren't available to other pages. Only a few configurations are eagerly loaded — the notable ones being ",e.jsx(s,{href:"/route",children:"the page's route"})," and ",e.jsx(s,{href:"/prefetchStaticAssets",children:"the page's prefetch setting"}),"."]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"Some page configurations aren't available at runtime; they are only available at config-time."}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["See also: ",e.jsx(n.a,{href:"#config",children:e.jsx(n.code,{children:"globalContext.config"})})]}),`
`]}),`
`,e.jsx(t,{name:"config"}),`
`,e.jsx(n.p,{children:"Environment: server, client"}),`
`,e.jsxs(n.p,{children:["The app's global runtime ",e.jsx(s,{href:"/config",children:"configuration"})," (such as ",e.jsx(s,{href:"/base-url",children:"the base URL setting"}),")."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"Most global configurations aren't available at runtime; they are only available at config-time."}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"See also:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/pageContext#config",children:e.jsx(n.code,{children:"pageContext.config"})}),`
`]}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"#pages",children:e.jsx(n.code,{children:"globalContext.pages"})})}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/getVikeConfig"}),`
`]}),`
`]}),`
`]}),`
`,e.jsx(t,{name:"prerenderContext"}),`
`,e.jsx(n.p,{children:"Environment: config (build-time)"}),`
`,e.jsxs(n.p,{children:["If you use ",e.jsx(s,{href:"/pre-rendering",children:"pre-rendering"}),", you can access:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"globalContext.prerenderContext.pageContexts"})," — the list of all pre-rendered URLs."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"globalContext.prerenderContext.output"})," — the list of all written files."]}),`
`]}),`
`,e.jsxs(n.p,{children:["See also: ",e.jsx(s,{href:"/getVikeConfig"})]}),`
`,e.jsx(t,{name:"isClientSide"}),`
`,e.jsx(n.p,{children:"Environment: server, client"}),`
`,e.jsxs(n.p,{children:["Same as ",e.jsx(s,{href:"/pageContext#isClientSide",children:e.jsx(n.code,{children:"pageContext.isClientSide"})}),"."]}),`
`,e.jsxs(n.p,{children:["It can also be used to narrow down the ",e.jsx(n.code,{children:"GlobalContext"})," type to either ",e.jsx(n.code,{children:"GlobalContextClient"})," or ",e.jsx(n.code,{children:"GlobalContextServer"}),", see ",e.jsx(s,{href:"#narrowing-down"}),"."]}),`
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
`,e.jsxs(n.p,{children:["You can define custom ",e.jsx(n.code,{children:"globalContext"})," properties."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsx(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"globalContext.myCustomProp "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:" someValue "}),e.jsx(n.span,{style:{color:"#6A737D"},children:"// Add or modify"})]})})})}),`
`,e.jsxs(n.p,{children:["Custom properties are typically initialized using one or several ",e.jsxs(s,{href:"/onCreateGlobalContext",children:[e.jsx(n.code,{children:"onCreateGlobalContext()"})," hooks"]}),"."]}),`
`,e.jsxs(n.p,{children:["You can also create and modify ",e.jsx(n.code,{children:"globalContext"})," properties at any time and anywhere in your app — for example, in your UI components, using ",e.jsx(s,{href:"/pageContext#globalContext",children:e.jsx(n.code,{children:"pageContext.globalContext"})}),"."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["See the section ",e.jsx(s,{href:"#extend",children:"TypeScript > Extend"})," for how to define the type of ",e.jsx(n.code,{children:"globalContext.myCustomProp"}),"."]}),`
`]}),`
`,e.jsxs(n.p,{children:["See also: ",e.jsx(s,{href:"/pageContext#custom"}),"."]}),`
`,e.jsx("h2",{id:"lifecycle",children:"Lifecycle"}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"See also:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/pageContext#lifecycle"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/hooks#lifecycle"}),`
`]}),`
`]}),`
`]}),`
`,e.jsxs(n.p,{children:["The lifecycle of the ",e.jsx(n.code,{children:"globalContext"})," object is completely different between the client- and server-side."]}),`
`,e.jsx("h3",{id:"server-side",children:"Server-side"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"globalContext"})," is created when the server starts, and lives until the server process shuts down. For example, if your server process runs for 5 days, then the ",e.jsx(n.code,{children:"globalContext"})," object lives for 5 days."]}),`
`,e.jsxs(n.p,{children:["If your JavaScript server runs as a single process, then you have only one ",e.jsx(n.code,{children:"globalContext"})," object for your entire server-side."]}),`
`,e.jsxs(n.p,{children:["On edge environments, there are typically multiple server processes/workers, so you get multiple server-side ",e.jsx(n.code,{children:"globalContext"})," objects — one per process/worker."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["In development, the ",e.jsx(n.code,{children:"globalContext"})," object is re-initialized if you make a file change that triggers a full page reload (i.e. a change that isn't covered by HMR)."]}),`
`]}),`
`,e.jsx("h3",{id:"client-side",children:"Client-side"}),`
`,e.jsxs(n.p,{children:["When a user starts visiting your website, a new ",e.jsx(n.code,{children:"globalContext"})," object is created that lives until the user closes your website. If the user opens your website in multiple tabs, then there is one ",e.jsx(n.code,{children:"globalContext"})," per tab."]}),`
`,e.jsxs(n.p,{children:["For example, if 3 users are simultaneously visiting your website — two users with 1 tab and one user with 3 tabs — then there are 5 (",e.jsx(n.code,{children:"1 + 1 + 3 = 5"}),") client-side ",e.jsx(n.code,{children:"globalContext"})," objects."]}),`
`,e.jsx("h3",{id:"pre-rendering",children:"Pre-rendering"}),`
`,e.jsxs(n.p,{children:["Upon ",e.jsx(s,{href:"/pre-rendering",children:"pre-rendering"}),", there is exactly one ",e.jsx(n.code,{children:"globalContext"})," object that lives from the beginning until the end of the pre-rendering process."]}),`
`,e.jsx("h2",{id:"typescript",children:"TypeScript"}),`
`,e.jsx("h3",{id:"basics",children:"Basics"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light","ts-only":"true",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
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
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light","ts-only":"true",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"declare"}),e.jsx(n.span,{style:{color:"#24292E"},children:" global {"})]}),`
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
`,e.jsxs(s,{href:"/getVikeConfig",children:["API > ",e.jsx(n.code,{children:"getVikeConfig()"})]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/onCreateGlobalContext"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/passToClient"}),`
`]}),`
`]})]})}function h(l={}){const{wrapper:n}={...r(),...l.components};return n?e.jsx(n,{...l,children:e.jsx(i,{...l})}):i(l)}const x=Object.freeze(Object.defineProperty({__proto__:null,default:h,pageSectionsExport:c},Symbol.toStringTag,{value:"Module"})),G={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:a}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:o}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/globalContext/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:x}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{G as configValuesSerialized};
