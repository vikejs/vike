import{j as e,i as o,L as c,o as t}from"../chunks/chunk-D3NY1Dio.js";import{L as r}from"../chunks/chunk-BxIOGfCD.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-CPa_GF1m.js";import{U as h}from"../chunks/chunk-57Q1M_m9.js";/* empty css                      *//* empty css                      *//* empty css                      */function l({children:d,style:n}){return e.jsx("span",{style:{color:"#888",fontSize:"0.94em",verticalAlign:"middle",...n},children:d})}function i({children:d}){return e.jsx(l,{style:{fontWeight:600},children:d})}const a=[{pageSectionId:"basic",pageSectionLevel:2,pageSectionTitle:"Basic"},{pageSectionId:"advanced",pageSectionLevel:2,pageSectionTitle:"Advanced"},{pageSectionId:"upcoming",pageSectionLevel:2,pageSectionTitle:"Upcoming"},{pageSectionId:"order",pageSectionLevel:2,pageSectionTitle:"Order"},{pageSectionId:"default",pageSectionLevel:3,pageSectionTitle:"Default"},{pageSectionId:"client-side-only-data",pageSectionLevel:3,pageSectionTitle:"Client-side only `data()`"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function s(d){const n={a:"a",blockquote:"blockquote",code:"code",em:"em",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...d.components};return e.jsxs(e.Fragment,{children:[e.jsxs(n.p,{children:["List of built-in hooks. (You can also ",e.jsx(r,{href:"/meta",children:"create your own"}),".)"]}),`
`,e.jsxs(n.p,{children:["See also: ",e.jsx(r,{href:"/settings"}),"."]}),`
`,e.jsx("h2",{id:"basic",children:"Basic"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/data",children:e.jsx(n.strong,{children:e.jsx(n.code,{children:"data()"})})}),": ",e.jsx(l,{children:"server (configurable)"})," Called before the page is rendered, for fetching data."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/guard",children:e.jsx(n.strong,{children:e.jsx(n.code,{children:"guard()"})})}),": ",e.jsx(l,{children:"server (configurable)"})," Protect pages from unprivileged access."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/onCreatePageContext",children:e.jsx(n.strong,{children:e.jsx(n.code,{children:"onCreatePageContext()"})})}),": ",e.jsx(l,{children:"server & client"})," Hook called when a ",e.jsxs(r,{href:"/pageContext",children:[e.jsx(n.code,{children:"pageContext"})," object"]})," is created."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/onCreateGlobalContext",children:e.jsx(n.strong,{children:e.jsx(n.code,{children:"onCreateGlobalContext()"})})}),": ",e.jsx(l,{children:"server & client"})," Hook called when the ",e.jsxs(r,{href:"/globalContext",children:[e.jsx(n.code,{children:"globalContext"})," object"]})," is created."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/onHydrationEnd",children:e.jsx(n.strong,{children:e.jsx(n.code,{children:"onHydrationEnd()"})})}),": ",e.jsx(l,{children:"client"})," Called after the page is ",e.jsx(r,{href:"/hydration",children:"hydrated"}),"."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/onPageTransitionStart",children:e.jsx(n.strong,{children:e.jsx(n.code,{children:"onPageTransitionStart()"})})}),": ",e.jsx(l,{children:"client"})," Called upon page navigation, before the new page starts rendering."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/onPageTransitionEnd",children:e.jsx(n.strong,{children:e.jsx(n.code,{children:"onPageTransitionEnd()"})})}),": ",e.jsx(l,{children:"client"})," Called upon page navigation, after the new page has finished rendering."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/onBeforePrerenderStart",children:e.jsx(n.strong,{children:e.jsx(n.code,{children:"onBeforePrerenderStart()"})})}),": ",e.jsx(l,{children:"server"})," Called before the whole pre-rendering process starts."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/onPrerenderStart",children:e.jsx(n.strong,{children:e.jsx(n.code,{children:"onPrerenderStart()"})})}),": ",e.jsx(l,{children:"server"})," Global hook called when pre-rendering starts."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/onCreateApp",children:e.jsx(n.strong,{children:e.jsx(n.code,{children:"onCreateApp()"})})}),": ",e.jsx(l,{children:"server & client"})," ",e.jsx(n.code,{children:"vike-vue"})," Called after creating Vue's ",e.jsx(n.code,{children:"app"})," instance."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/onData",children:e.jsx(n.strong,{children:e.jsx(n.code,{children:"onData()"})})}),": ",e.jsx(l,{children:"server & client"})," Called as soon as ",e.jsx(r,{href:"/pageContext#data",children:e.jsx(n.code,{children:"pageContext.data"})})," is available."]}),`
`]}),`
`,e.jsx("h2",{id:"advanced",children:"Advanced"}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"Most users don't need to know about these hooks."}),`
`]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/onBeforeRender",children:e.jsx(n.strong,{children:e.jsx(n.code,{children:"onBeforeRender()"})})}),": ",e.jsx(l,{children:"server (configurable)"})," Called before the page is rendered, lower-level and usually for advanced integrations with data fetching tools."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/onRenderHtml",children:e.jsx(n.strong,{children:e.jsx(n.code,{children:"onRenderHtml()"})})}),": ",e.jsx(l,{children:"server"})," Called when a page is rendered to HTML on the server-side."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/onRenderClient",children:e.jsx(n.strong,{children:e.jsx(n.code,{children:"onRenderClient()"})})}),": ",e.jsx(l,{children:"client"})," Called when a page is rendered on the client-side."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/onBeforeRoute",children:e.jsx(n.strong,{children:e.jsx(n.code,{children:"onBeforeRoute()"})})}),": ",e.jsx(l,{children:"server & client"})," Called before the URL is routed to a page."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/onBeforeRenderClient",children:e.jsx(n.strong,{children:e.jsx(n.code,{children:"onBeforeRenderClient()"})})}),": ",e.jsx(l,{children:"client"})," Called at the beginning of ",e.jsx(r,{href:"/onRenderClient",children:e.jsx(n.code,{children:"onRenderClient()"})}),"."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/onAfterRenderClient",children:e.jsx(n.strong,{children:e.jsx(n.code,{children:"onAfterRenderClient()"})})}),": ",e.jsx(l,{children:"client"})," Called at the end of ",e.jsx(r,{href:"/onRenderClient",children:e.jsx(n.code,{children:"onRenderClient()"})}),"."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/onBeforeRenderHtml",children:e.jsx(n.strong,{children:e.jsx(n.code,{children:"onBeforeRenderHtml()"})})}),": ",e.jsx(l,{children:"server"})," Called at the beginning of ",e.jsx(r,{href:"/onRenderHtml",children:e.jsx(n.code,{children:"onRenderHtml()"})}),"."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/onAfterRenderHtml",children:e.jsx(n.strong,{children:e.jsx(n.code,{children:"onAfterRenderHtml()"})})}),": ",e.jsx(l,{children:"server"})," Called at the end of ",e.jsx(r,{href:"/onRenderHtml",children:e.jsx(n.code,{children:"onRenderHtml()"})}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"upcoming",children:"Upcoming"}),`
`,e.jsx(n.p,{children:"Potentially upcoming hooks:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsxs(n.a,{href:"https://github.com/vikejs/vike/issues/1438",children:["New hook ",e.jsx(n.code,{children:"onLog()"})]})}),`
`,e.jsx(n.li,{children:e.jsxs(n.a,{href:"https://github.com/vikejs/vike/issues/1525",children:["New hook ",e.jsx(n.code,{children:"onRenderContent()"}),": generate non-HTML files with arbitrary content"]})}),`
`]}),`
`,e.jsx("h2",{id:"order",children:"Order"}),`
`,e.jsx(n.p,{children:"The order in which the hooks are called."}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["The following doesn't contain the hooks of the Vike extensions ",e.jsx(h,{name:!0})," such as ",e.jsx(r,{href:"/onAfterRenderHtml",children:e.jsx(n.code,{children:"onAfterRenderHtml()"})})," or ",e.jsx(r,{href:"/onAfterRenderClient",children:e.jsx(n.code,{children:"onAfterRenderClient()"})}),"."]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["The ",e.jsxs(r,{href:"/onCreateGlobalContext",children:[e.jsx(n.code,{children:"onCreateGlobalContext()"})," hook"]})," is called when the ",e.jsx(n.code,{children:"globalContext"})," object is created, see ",e.jsx(r,{href:"/globalContext#lifecycle"}),"."]}),`
`]}),`
`,e.jsx("h3",{id:"default",children:"Default"}),`
`,e.jsxs(n.p,{children:["If you didn't change the environment of ",e.jsx(n.code,{children:"data()"})," nor ",e.jsx(n.code,{children:"onBeforeRender()"}),":"]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"First render"})}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"server"}),`
`,e.jsx(r,{href:"/renderPage",children:e.jsx(n.code,{children:"renderPage()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"server"}),`
`,e.jsx(r,{href:"/onCreatePageContext",children:e.jsx(n.code,{children:"onCreatePageContext()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"server"}),`
`,e.jsx(r,{href:"/onBeforeRoute",children:e.jsx(n.code,{children:"onBeforeRoute()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"server"}),`
`,e.jsx(r,{href:"/routing",children:"Routing"}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["The routing executes your ",e.jsx(r,{href:"/route-function",children:"Route Functions"})," (of all your pages)."]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"server"}),`
`,e.jsx(r,{href:"/guard",children:e.jsx(n.code,{children:"guard()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"server"}),`
`,e.jsx(r,{href:"/data",children:e.jsx(n.code,{children:"data()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"server"}),`
`,e.jsx(r,{href:"/onData",children:e.jsx(n.code,{children:"onData()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"server"}),`
`,e.jsx(r,{href:"/onBeforeRender",children:e.jsx(n.code,{children:"onBeforeRender()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"server"}),`
`,e.jsx(r,{href:"/onRenderHtml",children:e.jsx(n.code,{children:"onRenderHtml()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"client"}),`
`,e.jsx(r,{href:"/onRenderClient",children:e.jsx(n.code,{children:"onRenderClient()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"client"}),`
`,e.jsx(r,{href:"/onHydrationEnd",children:e.jsx(n.code,{children:"onHydrationEnd()"})}),`
`]}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Client-side navigation"})}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"client"}),`
`,e.jsx(r,{href:"/onCreatePageContext",children:e.jsx(n.code,{children:"onCreatePageContext()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"client"}),`
`,e.jsx(r,{href:"/onPageTransitionStart",children:e.jsx(n.code,{children:"onPageTransitionStart()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"client"}),`
`,e.jsx(r,{href:"/onBeforeRoute",children:e.jsx(n.code,{children:"onBeforeRoute()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"client"}),`
`,e.jsx(r,{href:"/routing",children:"Routing"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"server"}),`
`,e.jsx(r,{href:"/onBeforeRoute",children:e.jsx(n.code,{children:"onBeforeRoute()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"server"}),`
`,e.jsx(r,{href:"/routing",children:"Routing"}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"The routing is executed twice: once for the client and once for the server."}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"server"}),`
`,e.jsx(r,{href:"/guard",children:e.jsx(n.code,{children:"guard()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"server"}),`
`,e.jsx(r,{href:"/data",children:e.jsx(n.code,{children:"data()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"server"}),`
`,e.jsx(r,{href:"/onBeforeRender",children:e.jsx(n.code,{children:"onBeforeRender()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"client"}),`
`,e.jsx(r,{href:"/onData",children:e.jsx(n.code,{children:"onData()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"client"}),`
`,e.jsx(r,{href:"/onRenderClient",children:e.jsx(n.code,{children:"onRenderClient()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"client"}),`
`,e.jsx(r,{href:"/onPageTransitionEnd",children:e.jsx(n.code,{children:"onPageTransitionEnd()"})}),`
`]}),`
`]}),`
`,e.jsxs("h3",{id:"client-side-only-data",children:["Client-side only ",e.jsx("code",{children:"data()"})]}),`
`,e.jsxs(n.p,{children:["If you ",e.jsxs(r,{href:"/data#environment",children:["configured ",e.jsx(n.code,{children:"data()"})]})," and ",e.jsxs(r,{href:"/onBeforeRender#environment",children:[e.jsx(n.code,{children:"onBeforeRender()"})," as well"]})," to run ",e.jsx(n.em,{children:"only"})," on the client-side:"]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"First render"})}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"server"}),`
`,e.jsx(r,{href:"/renderPage",children:e.jsx(n.code,{children:"renderPage()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"server"}),`
`,e.jsx(r,{href:"/onCreatePageContext",children:e.jsx(n.code,{children:"onCreatePageContext()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"server"}),`
`,e.jsx(r,{href:"/onBeforeRoute",children:e.jsx(n.code,{children:"onBeforeRoute()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"server"}),`
`,e.jsx(r,{href:"/routing",children:"Routing"}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["The routing executes your ",e.jsx(r,{href:"/route-function",children:"Route Functions"})," (of all your pages)."]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"server"}),`
`,e.jsx(r,{href:"/onRenderHtml",children:e.jsx(n.code,{children:"onRenderHtml()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"client"}),`
`,e.jsx(r,{href:"/guard",children:e.jsx(n.code,{children:"guard()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"client"}),`
`,e.jsx(r,{href:"/data",children:e.jsx(n.code,{children:"data()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"client"}),`
`,e.jsx(r,{href:"/onData",children:e.jsx(n.code,{children:"onData()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"client"}),`
`,e.jsx(r,{href:"/onBeforeRender",children:e.jsx(n.code,{children:"onBeforeRender()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"client"}),`
`,e.jsx(r,{href:"/onRenderClient",children:e.jsx(n.code,{children:"onRenderClient()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"client"}),`
`,e.jsx(r,{href:"/onHydrationEnd",children:e.jsx(n.code,{children:"onHydrationEnd()"})}),`
`]}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Client-side navigation"})}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"client"}),`
`,e.jsx(r,{href:"/onCreatePageContext",children:e.jsx(n.code,{children:"onCreatePageContext()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"client"}),`
`,e.jsx(r,{href:"/onPageTransitionStart",children:e.jsx(n.code,{children:"onPageTransitionStart()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"client"}),`
`,e.jsx(r,{href:"/onBeforeRoute",children:e.jsx(n.code,{children:"onBeforeRoute()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"client"}),`
`,e.jsx(r,{href:"/routing",children:"Routing"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"client"}),`
`,e.jsx(r,{href:"/guard",children:e.jsx(n.code,{children:"guard()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"client"}),`
`,e.jsx(r,{href:"/data",children:e.jsx(n.code,{children:"data()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"client"}),`
`,e.jsx(r,{href:"/onData",children:e.jsx(n.code,{children:"onData()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"client"}),`
`,e.jsx(r,{href:"/onBeforeRender",children:e.jsx(n.code,{children:"onBeforeRender()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"client"}),`
`,e.jsx(r,{href:"/onRenderClient",children:e.jsx(n.code,{children:"onRenderClient()"})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{children:"client"}),`
`,e.jsx(r,{href:"/onPageTransitionEnd",children:e.jsx(n.code,{children:"onPageTransitionEnd()"})}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(r,{href:"/settings"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(r,{href:"/config"}),`
`]}),`
`]})]})}function x(d={}){const{wrapper:n}=d.components||{};return n?e.jsx(n,{...d,children:e.jsx(s,{...d})}):s(d)}const j=Object.freeze(Object.defineProperty({__proto__:null,default:x,pageSectionsExport:a},Symbol.toStringTag,{value:"Module"})),w={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:t}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/hooks/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:j}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:c}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:o}}};export{w as configValuesSerialized};
