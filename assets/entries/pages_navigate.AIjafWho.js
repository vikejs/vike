import{o as i,a}from"../chunks/chunk-CxIOOiKX.js";import{j as e}from"../chunks/chunk-B35a6FX-.js";import{L as n}from"../chunks/chunk-BbfG-aTg.js";/* empty css                      */import{W as d}from"../chunks/chunk-4VEk4LmV.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as o}from"../chunks/chunk-CJvpbNqo.js";import{U as l}from"../chunks/chunk-DuyKlQcD.js";/* empty css                      */import{C as c}from"../chunks/chunk-BLfhGi7M.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */const h=[{pageSectionId:"options",pageSectionLevel:2,pageSectionTitle:"Options"},{pageSectionId:"history-pushstate",pageSectionLevel:2,pageSectionTitle:"`history.pushState()`"},{pageSectionId:"without-vike-react-vue-solid",pageSectionLevel:2,pageSectionTitle:"Without `vike-{react,vue,solid}`"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function t(r){const s={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...o(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(c,{env:"client (server can import but not call it)",global:null}),`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.code,{children:"navigate('/some/url')"})," function enables you to programmatically switch pages without requiring the user to click a link."]}),`
`,e.jsx(s.p,{children:"For example, to redirect the user after a successful form submission:"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"tsx","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"tsx","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { navigate } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/client/router'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Form"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"form"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" onSubmit"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:"{onSubmit}>{"}),e.jsx(s.span,{style:{color:"#6A737D"},children:"/* ... */"}),e.jsx(s.span,{style:{color:"#24292E"},children:"}</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"form"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" onSubmit"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" navigationPromise"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" navigate"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'/form/success'"}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  console."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"log"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:`"The URL changed but the new page hasn't rendered yet."`}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  await"}),e.jsx(s.span,{style:{color:"#24292E"},children:" navigationPromise"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  console."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"log"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'The new page has finished rendering.'"}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["If you want to redirect the user before the page has fully rendered (e.g. redirecting a non-authenticated user), then use ",e.jsx(n,{href:"/redirect",children:e.jsx(s.code,{children:"throw redirect()"})})," instead. See: ",e.jsx(n,{href:"/abort#throw-redirect-vs-throw-render-vs-navigate",doNotInferSectionTitle:!0,noBreadcrumb:!0}),"."]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["To navigate back or forward in the user's browser history, use the ",e.jsx(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/History",children:"History API"})," instead:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["To go back, use ",e.jsx(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/History/back",children:e.jsx(s.code,{children:"window.history.back()"})}),"."]}),`
`,e.jsxs(s.li,{children:["To go forward, use ",e.jsx(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/History/forward",children:e.jsx(s.code,{children:"window.history.forward()"})}),"."]}),`
`]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["For reloading the current page, use ",e.jsx(n,{href:"/reload",children:e.jsx(s.code,{children:"reload()"})})," instead."]}),`
`]}),`
`,e.jsx("h2",{id:"options",children:"Options"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"navigate('/some-url', { keepScrollPosition: true })"}),": Don't scroll to the top of the page, preserve the scroll position instead. See also:",`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/keepScrollPosition"}),`
`]}),`
`,e.jsxs(s.li,{children:[e.jsx(n,{href:"/clientRouting#settings",children:e.jsx(s.code,{children:'<a href="/some-url" keep-scroll-position />'})}),"."]}),`
`]}),`
`]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"navigate('/some-url', { overwriteLastHistoryEntry: true })"}),": Let the new URL replace the current URL in the browser history (instead of creating a new entry in the browser history). This effectively removes the current URL from the browser history. (Technically speaking: tell Vike to use ",e.jsx(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState",children:e.jsx(s.code,{children:"history.replaceState()"})})," instead of ",e.jsx(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/History/pushState",children:e.jsx(s.code,{children:"history.pushState"})}),"..)"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"navigate('/some-url', { pageContext })"}),": Pass extra ",e.jsx(n,{href:"/pageContext",children:e.jsx(s.code,{children:"pageContext"})})," values to the next page."]}),`
`]}),`
`,e.jsx("h2",{id:"history-pushstate",children:e.jsx("code",{children:"history.pushState()"})}),`
`,e.jsxs(s.p,{children:["If you want to change the URL completely independently of Vike then use ",e.jsx(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/History/pushState",children:e.jsx(s.code,{children:"history.pushState()"})})," instead of ",e.jsx(s.code,{children:"navigate()"}),"."]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Somewhere in your client-side code"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"window.history."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"pushState"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#005CC5"},children:"null"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#032F62"},children:"''"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'/some-url'"}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]})]})})}),`
`,e.jsxs(s.p,{children:["You can then implement your navigation handling by listening to the ",e.jsxs(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event",children:[e.jsx(s.code,{children:"popstate"})," event"]}),"."]}),`
`,e.jsxs(d,{children:[e.jsxs(s.strong,{children:["You must handle the ",e.jsx(s.code,{children:"popstate"})," event"]}),", otherwise you'll break the browser's back- and forward history button."]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"window."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"addEventListener"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'popstate'"}),e.jsx(s.span,{style:{color:"#24292E"},children:", () "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Vike sets triggeredBy to 'vike' | 'browser' | 'user'"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsxs(s.span,{style:{color:"#6A737D"},children:["  // ",e.jsx(s.a,{href:"https://vike.dev/navigate#history-pushstate",children:"https://vike.dev/navigate#history-pushstate"})]})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"triggeredBy"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" window.history.state?.vike"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Navigation triggered by Vike or the browser"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(s.span,{style:{color:"#24292E"},children:" (triggeredBy "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"==="}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike'"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ||"}),e.jsx(s.span,{style:{color:"#24292E"},children:" triggeredBy "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"==="}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'browser'"}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // Abort: let Vike handle the navigation"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#D73A49"},children:"    return"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Navigation triggered by our history.pushState() call"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(s.span,{style:{color:"#24292E"},children:" (triggeredBy "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"==="}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'user'"}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // To Do: implement back- and forward navigation"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"})"})})]})})}),`
`,e.jsxs("h2",{id:"without-vike-react-vue-solid",children:["Without ",e.jsx("code",{children:"vike-{react,vue,solid}"})]}),`
`,e.jsxs(s.p,{children:["If you don't use a ",e.jsx(l,{})," and if you use ",e.jsx(n,{text:"Server Routing",href:"/server-routing"})," then use ",e.jsx(s.code,{children:"window.location.href = '/some/url'"})," instead of ",e.jsx(s.code,{children:"navigate()"})," (because ",e.jsx(s.code,{children:"navigate()"})," requires ",e.jsx(n,{text:"Client Routing",href:"/client-routing"}),")."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["The ",e.jsx(l,{plural:!0,noLink:!0})," use Client Routing."]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/reload"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/redirect"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/redirects"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/abort#throw-redirect-vs-throw-render-vs-navigate",doNotInferSectionTitle:!0}),`
`]}),`
`]})]})}function p(r={}){const{wrapper:s}={...o(),...r.components};return s?e.jsx(s,{...r,children:e.jsx(t,{...r})}):t(r)}const x=Object.freeze(Object.defineProperty({__proto__:null,default:p,pageSectionsExport:h},Symbol.toStringTag,{value:"Module"})),I={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:a}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:i}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/navigate/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:x}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{I as configValuesSerialized};
