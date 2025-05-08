import{j as e,i as l,L as a,o as i}from"../chunks/chunk-CA25TqZK.js";import{L as s}from"../chunks/chunk-BjLQpSqv.js";/* empty css                      */import{C as o}from"../chunks/chunk-Dq2nKeNP.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-DQ1DQlqi.js";/* empty css                      *//* empty css                      */import{M as d}from"../chunks/chunk-DWXiTXsk.js";/* empty css                      *//* empty css                      */const c=[{pageSectionId:"ssr",pageSectionLevel:2,pageSectionTitle:"SSR"},{pageSectionId:"extensions",pageSectionLevel:3,pageSectionTitle:"Extensions"},{pageSectionId:"manual-integration",pageSectionLevel:3,pageSectionTitle:"Manual integration"}];function r(t){const n={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...t.components};return e.jsxs(e.Fragment,{children:[e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"What is a store?"})}),`
`,e.jsx(n.p,{children:"A store (aka state management) is a tool that helps you manage complex UI state."}),`
`,e.jsx(n.p,{children:"Not properly managing UI state is one of the most common causes of buggy user interfaces. A store enables you to get even the most complex UI state logic under control."}),`
`,e.jsx(n.p,{children:"A store works by representing state changes as atomic changes to an immutable data structure, enabling a fundamentally more robust state management."}),`
`]}),`
`,e.jsx(n.p,{children:"You can use Vike with any store."}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/redux"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/pinia"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/vuex"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/tools#stores",children:"... more"}),`
`]}),`
`]}),`
`,e.jsxs(n.p,{children:["If you don't use your store on the server-side, then you can use it independently of Vike — no integration is needed. If you do, see ",e.jsx(s,{href:"#ssr"}),"."]}),`
`,e.jsx("h2",{id:"ssr",children:"SSR"}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"When do I need to use my store on the server-side?"})}),`
`,e.jsx(n.p,{children:"In general, we recommend using a store only on the client-side. A store is used for highly interactive user interfaces — using it on the server-side is usually superfluous (there isn't any interactivity on the server-side)."}),`
`,e.jsx(n.p,{children:"That said, there are use cases where it can make sense, for example:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Dark-mode toggle"}),": While it's client-side state, it's needed during SSR to render the correct theme (e.g. by reading the user's preference from cookies). You could manage it only on the client, but that would cause a light/dark mode flash on load if the user's setting differs from the default."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"To-do list app using SSR"}),": the initial to-do list (",e.jsxs(s,{href:"/data-fetching#page-data-with-data",children:["fetched with ",e.jsx(n.code,{children:"+data"})]})," on the server) is expected to change — tasks can be added, removed, or updated. Therefore, it might make sense for components to access the data via the store rather than directly. In that case, you must initialize the store on the server so that components can access it during SSR."]}),`
`]}),`
`]}),`
`,e.jsxs(n.p,{children:["If you use your store on the server side and have ",e.jsx(s,{href:"/ssr",children:"SSR enabled"}),", you must integrate your store with SSR."]}),`
`,e.jsx("h3",{id:"extensions",children:"Extensions"}),`
`,e.jsxs(n.p,{children:["We recommend using a ",e.jsx(s,{href:"/extensions",children:"Vike extension"})," for automatically integrating your store with SSR."]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://github.com/vikejs/vike-vue/tree/main/packages/vike-vue-pinia",children:e.jsx(n.code,{children:"vike-vue-pinia"})})}),`
`]}),`
`,e.jsx(o,{children:e.jsxs(n.p,{children:["Contribution welcome to ",e.jsx(n.a,{href:"https://github.com/vikejs/vike/issues/1715",children:"create Vike extensions"})," integrating stores with SSR."]})}),`
`,e.jsx("h3",{id:"manual-integration",children:"Manual integration"}),`
`,e.jsx(d,{children:e.jsxs(n.p,{children:["Instead of manually integrating your store, we generally recommend ",e.jsx(s,{href:"#extensions",children:"using a Vike extension"})," instead."]})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(s,{href:"/faq#how-can-i-reach-out-for-help",children:"Feel free to reach out"})," if you want help integrating a store."]}),`
`]}),`
`,`
`,e.jsx(n.p,{children:"When using a store with SSR, the initial state of the store is determined on the server side (during SSR) and then passed to the client side."}),`
`,e.jsxs(n.p,{children:["You must ensure that the store's initial state is exactly the same on both the client- and the server-side (otherwise, you'll get a ",e.jsx(s,{href:"/hydration-mismatch",children:"hydration mismatch"}),")."]}),`
`,e.jsx(n.p,{children:"The integration can be broken down into three steps:"}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"1. SSR"})}),`
`,e.jsxs(n.p,{children:["Determine the store's initial state on the server-side (during SSR) and ",e.jsxs(s,{href:"/pageContext#custom",children:["make it available as ",e.jsx(n.code,{children:"pageContext.storeInitialState"})]}),"."]}),`
`,e.jsxs(n.p,{children:["To achieve that, you can create the store at ",e.jsx(s,{href:"/onCreatePageContext",children:e.jsx(n.code,{children:"+onCreatePageContext.server.js"})}),"  and then retrieve its initial sate at ",e.jsx(s,{href:"/onAfterRenderHtml",children:e.jsx(n.code,{children:"+onAfterRenderHtml.js"})}),":"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+onCreatePageContext.server.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { createStore } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'awesome-store'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onCreatePageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  pageContext.store "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" createStore"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+onAfterRenderHtml.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onAfterRenderHtml"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  pageContext.storeInitialState "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:" pageContext.store."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"getState"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.p,{children:["If you use React then you may also need to use ",e.jsx(s,{href:"/Wrapper",children:e.jsx(n.code,{children:"+Wrapper"})}),":"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+Wrapper.jsx"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: server, client"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { Provider } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'awesome-store/react'"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { usePageContext } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike-react/usePageContext'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" StoreProvider"}),e.jsx(n.span,{style:{color:"#24292E"},children:"({ "}),e.jsx(n.span,{style:{color:"#E36209"},children:"children"}),e.jsx(n.span,{style:{color:"#24292E"},children:" }) {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" pageContext"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" usePageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" <"}),e.jsx(n.span,{style:{color:"#005CC5"},children:"Provider"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" store"}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:"{pageContext.store}>{children}</"}),e.jsx(n.span,{style:{color:"#005CC5"},children:"Provider"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.p,{children:e.jsxs(n.strong,{children:["2. ",e.jsx(n.code,{children:"passToClient"})]})}),`
`,e.jsxs(n.p,{children:["Make ",e.jsx(n.code,{children:"pageContext.storeInitialState"})," available on the client-side by using ",e.jsx(s,{href:"/passToClient",children:e.jsx(n.code,{children:"passToClient"})}),":"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  passToClient: ["}),e.jsx(n.span,{style:{color:"#032F62"},children:"'storeInitialState'"}),e.jsx(n.span,{style:{color:"#24292E"},children:"]"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"3. Hydration"})}),`
`,e.jsxs(n.p,{children:["On the client-side, initialize the store with ",e.jsx(n.code,{children:"pageContext.storeInitialState"})," upon hydration, for example at ",e.jsx(s,{href:"/onBeforeRenderClient",children:e.jsx(n.code,{children:"+onBeforeRenderClient"})}),":"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+onBeforeRenderClient.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: client"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { createStore } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'awesome-store'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onBeforeRenderClient"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(n.span,{style:{color:"#24292E"},children:" (pageContext.isHydration) {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // Hydration. We must use the same state than on the server-side."})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"    pageContext.globalContext.store "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" createStore"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(pageContext.storeInitialState)"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"else"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // Client-side navigation. Nothing to do: the store was already initialized at hydration."})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"    assert"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(pageContext.globalContext.store)"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["You can also use ",e.jsx(s,{href:"/onCreateGlobalContext",children:e.jsx(n.code,{children:"+onCreateGlobalContext.client.js"})})," instead to create the store earlier."]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"See also:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(s,{href:"/pageContext#isHydration",children:["API > ",e.jsx(n.code,{children:"pageContext.isHydration"})]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(s,{href:"/pageContext#globalContext",children:["API > ",e.jsx(n.code,{children:"pageContext.globalContext"})]}),`
`]}),`
`]}),`
`]})]})}function h(t={}){const{wrapper:n}=t.components||{};return n?e.jsx(n,{...t,children:e.jsx(r,{...t})}):r(t)}const p=Object.freeze(Object.defineProperty({__proto__:null,default:h,pageSectionsExport:c},Symbol.toStringTag,{value:"Module"})),T={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:i}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/store/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:p}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:a}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:l}}};export{T as configValuesSerialized};
