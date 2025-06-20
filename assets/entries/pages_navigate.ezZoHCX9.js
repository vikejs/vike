import{o,a as i}from"../chunks/chunk-BA4CnQw4.js";import{j as e}from"../chunks/chunk-DJHPrgEG.js";import{L as s}from"../chunks/chunk-BVg2-x2q.js";/* empty css                      */import{W as a}from"../chunks/chunk-D62Yvjsi.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{U as r}from"../chunks/chunk-Do2MZoeZ.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */const c=[{pageSectionId:"options",pageSectionLevel:2,pageSectionTitle:"Options"},{pageSectionId:"history-pushstate",pageSectionLevel:2,pageSectionTitle:"`history.pushState()`"},{pageSectionId:"without-vike-react-vue-solid",pageSectionLevel:2,pageSectionTitle:"Without `vike-{react,vue,solid}`"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function t(l){const n={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...l.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.p,{children:"Environment: client."}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"navigate('/some/url')"})," function enables you to programmatically switch pages without requiring the user to click a link."]}),`
`,e.jsx(n.p,{children:"For example, to redirect the user after a successful form submission:"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"jsx","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"jsx","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { navigate } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/client/router'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Form"}),e.jsx(n.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"   return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" ("})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"     <"}),e.jsx(n.span,{style:{color:"#22863A"},children:"form"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onSubmit"}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:"{onSubmit}>"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"       {"}),e.jsx(n.span,{style:{color:"#6A737D"},children:"/* ... */"}),e.jsx(n.span,{style:{color:"#24292E"},children:"}"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"     </"}),e.jsx(n.span,{style:{color:"#22863A"},children:"form"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"   )"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onSubmit"}),e.jsx(n.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" navigationPromise"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" navigate"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#032F62"},children:"'/form/success'"}),e.jsx(n.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  console."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"log"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#032F62"},children:`"The URL changed but the new page hasn't rendered yet."`}),e.jsx(n.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  await"}),e.jsx(n.span,{style:{color:"#24292E"},children:" navigationPromise"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  console."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"log"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#032F62"},children:"'The new page has finished rendering.'"}),e.jsx(n.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["If you want to redirect the user while rendering a page then use ",e.jsx(s,{href:"/redirect",children:e.jsx(n.code,{children:"throw redirect()"})})," instead. For example, when redirecting a non-authenticated user to a login page. See ",e.jsx(s,{href:"/abort#throw-redirect-vs-throw-render-vs-navigate",doNotInferSectionTitle:!0}),"."]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["If you want to programmatically navigate back then use ",e.jsx(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/History/back",children:e.jsx(n.code,{children:"window.history.back()"})}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"options",children:"Options"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"navigate('/some-url', { keepScrollPosition: true })"}),": Don't scroll to the top of the page, preserve the scroll position instead. See also:",`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/keepScrollPosition"}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(s,{href:"/clientRouting#settings",children:e.jsx(n.code,{children:'<a href="/some-url" keep-scroll-position />'})}),"."]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"navigate('/some-url', { overwriteLastHistoryEntry: true })"}),": Let the new URL replace the current URL in the browser history (instead of creating a new entry in the browser history). This effectively removes the current URL from the browser history. (Technically speaking: tell Vike to use ",e.jsx(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState",children:e.jsx(n.code,{children:"history.replaceState()"})})," instead of ",e.jsx(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/History/pushState",children:e.jsx(n.code,{children:"history.pushState"})}),"..)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"navigate('/some-url', { pageContext })"}),": Pass extra ",e.jsx(s,{href:"/pageContext",children:e.jsx(n.code,{children:"pageContext"})})," values to the next page."]}),`
`]}),`
`,e.jsx("h2",{id:"history-pushstate",children:e.jsx("code",{children:"history.pushState()"})}),`
`,e.jsxs(n.p,{children:["If you want to change the URL completely independently of Vike then use ",e.jsx(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/History/pushState",children:e.jsx(n.code,{children:"history.pushState()"})})," instead of ",e.jsx(n.code,{children:"navigate()"}),"."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Somewhere in your client-side code"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"window.history."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"pushState"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#005CC5"},children:"null"}),e.jsx(n.span,{style:{color:"#24292E"},children:", "}),e.jsx(n.span,{style:{color:"#032F62"},children:"''"}),e.jsx(n.span,{style:{color:"#24292E"},children:", "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'/some-url'"}),e.jsx(n.span,{style:{color:"#24292E"},children:")"})]})]})})}),`
`,e.jsxs(n.p,{children:["You can then implement your navigation handling by listening to the ",e.jsxs(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event",children:[e.jsx(n.code,{children:"popstate"})," event"]}),"."]}),`
`,e.jsxs(a,{children:[e.jsxs(n.strong,{children:["You must handle the ",e.jsx(n.code,{children:"popstate"})," event"]}),", otherwise you'll break the browser's back- and forward history button."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"window."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"addEventListener"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#032F62"},children:"'popstate'"}),e.jsx(n.span,{style:{color:"#24292E"},children:", () "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Vike sets triggeredBy to 'vike' | 'browser' | 'user'"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // https://vike.dev/navigate#history-pushstate"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"triggeredBy"}),e.jsx(n.span,{style:{color:"#24292E"},children:" } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:" window.history.state"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Navigation triggered by Vike or the browser"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(n.span,{style:{color:"#24292E"},children:" (triggeredBy "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"==="}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike'"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ||"}),e.jsx(n.span,{style:{color:"#24292E"},children:" triggeredBy "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"==="}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'browser'"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // Abort: let Vike handle the navigation"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#D73A49"},children:"    return"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Navigation triggered by our history.pushState() call"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(n.span,{style:{color:"#24292E"},children:" (triggeredBy "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"==="}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'user'"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // TODO"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"})"})})]})})}),`
`,e.jsxs("h2",{id:"without-vike-react-vue-solid",children:["Without ",e.jsx("code",{children:"vike-{react,vue,solid}"})]}),`
`,e.jsxs(n.p,{children:["If you don't use a ",e.jsx(r,{})," and if you use ",e.jsx(s,{text:"Server Routing",href:"/server-routing"})," then use ",e.jsx(n.code,{children:"window.location.href = '/some/url'"})," instead of ",e.jsx(n.code,{children:"navigate()"})," (because ",e.jsx(n.code,{children:"navigate()"})," requires ",e.jsx(s,{text:"Client Routing",href:"/client-routing"}),")."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["The ",e.jsx(r,{plural:!0,noLink:!0})," use Client Routing."]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/redirect"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/redirects"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/abort#throw-redirect-vs-throw-render-vs-navigate",doNotInferSectionTitle:!0}),`
`]}),`
`]})]})}function d(l={}){const{wrapper:n}=l.components||{};return n?e.jsx(n,{...l,children:e.jsx(t,{...l})}):t(l)}const h=Object.freeze(Object.defineProperty({__proto__:null,default:d,pageSectionsExport:c},Symbol.toStringTag,{value:"Module"})),C={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:i}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:o}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/navigate/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:h}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{C as configValuesSerialized};
