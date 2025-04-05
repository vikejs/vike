import{j as e,i as o,L as i,o as a}from"../chunks/chunk-BqJz907Y.js";import{L as n}from"../chunks/chunk-BmkgW3tD.js";/* empty css                      */import{W as c}from"../chunks/chunk-DLLinNPN.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-drWBd06u.js";import{U as r}from"../chunks/chunk-DDIrE_tc.js";/* empty css                      *//* empty css                      *//* empty css                      */const d=[{pageSectionId:"options",pageSectionLevel:2,pageSectionTitle:"Options"},{pageSectionId:"history-pushstate",pageSectionLevel:2,pageSectionTitle:"`history.pushState()`"},{pageSectionId:"without-vike-react-vue-solid",pageSectionLevel:2,pageSectionTitle:"Without `vike-{react,vue,solid}`"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function t(l){const s={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...l.components};return e.jsxs(e.Fragment,{children:[e.jsx(s.p,{children:"Environment: client."}),`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.code,{children:"navigate('/some/url')"})," function enables you to programmatically switch pages without requiring the user to click a link."]}),`
`,e.jsx(s.p,{children:"For example, to redirect the user after a successful form submission:"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"jsx","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"jsx","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { navigate } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike/client/router'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Form"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"   return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"     <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"form"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" onSubmit"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:"{onSubmit}>"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"       {"}),e.jsx(s.span,{style:{color:"#6A737D"},children:"/* ... */"}),e.jsx(s.span,{style:{color:"#24292E"},children:"}"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"     </"}),e.jsx(s.span,{style:{color:"#22863A"},children:"form"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"   )"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" onSubmit"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" navigationPromise"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" navigate"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'/form/success'"}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  console."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"log"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:`"The URL changed but the new page hasn't rendered yet."`}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  await"}),e.jsx(s.span,{style:{color:"#24292E"},children:" navigationPromise"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  console."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"log"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'The new page has finished rendering.'"}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["If you want to redirect the user while rendering a page then use ",e.jsx(n,{href:"/redirect",children:e.jsx(s.code,{children:"throw redirect()"})})," instead. For example, when redirecting a non-authenticated user to a login page. See ",e.jsx(n,{href:"/abort#throw-redirect-vs-throw-render-vs-navigate",doNotInferSectionTitle:!0}),"."]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["If you want to programmatically navigate back then use ",e.jsx(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/History/back",children:e.jsx(s.code,{children:"window.history.back()"})}),"."]}),`
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
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Somewhere in your client-side code"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"window.history."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"pushState"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#005CC5"},children:"null"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#032F62"},children:"''"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'/some-url'"}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]})]})})}),`
`,e.jsxs(s.p,{children:["You can then implement your navigation handling by listening to the ",e.jsxs(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event",children:[e.jsx(s.code,{children:"popstate"})," event"]}),"."]}),`
`,e.jsxs(c,{children:[e.jsxs(s.strong,{children:["You must handle the ",e.jsx(s.code,{children:"popstate"})," event"]}),", otherwise you'll break the browser's back- and forward history button."]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"window."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"addEventListener"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'popstate'"}),e.jsx(s.span,{style:{color:"#24292E"},children:", () "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Vike sets triggeredBy to 'vike' | 'browser' | 'user'"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // https://vike.dev/navigate#history-pushstate"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"triggeredBy"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" window.history.state"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Navigation triggered by Vike or the browser"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(s.span,{style:{color:"#24292E"},children:" (triggeredBy "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"==="}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike'"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ||"}),e.jsx(s.span,{style:{color:"#24292E"},children:" triggeredBy "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"==="}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'browser'"}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // Abort: let Vike handle the navigation"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#D73A49"},children:"    return"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Navigation triggered by our history.pushState() call"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(s.span,{style:{color:"#24292E"},children:" (triggeredBy "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"==="}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'user'"}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // TODO"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"})"})})]})})}),`
`,e.jsxs("h2",{id:"without-vike-react-vue-solid",children:["Without ",e.jsx("code",{children:"vike-{react,vue,solid}"})]}),`
`,e.jsxs(s.p,{children:["If you don't use a ",e.jsx(r,{})," and if you use ",e.jsx(n,{text:"Server Routing",href:"/server-routing"})," then use ",e.jsx(s.code,{children:"window.location.href = '/some/url'"})," instead of ",e.jsx(s.code,{children:"navigate()"})," (because ",e.jsx(s.code,{children:"navigate()"})," requires ",e.jsx(n,{text:"Client Routing",href:"/client-routing"}),")."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["The ",e.jsx(r,{plural:!0,noLink:!0})," use Client Routing."]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/redirect"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/redirects"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/abort#throw-redirect-vs-throw-render-vs-navigate",doNotInferSectionTitle:!0}),`
`]}),`
`]})]})}function h(l={}){const{wrapper:s}=l.components||{};return s?e.jsx(s,{...l,children:e.jsx(t,{...l})}):t(l)}const p=Object.freeze(Object.defineProperty({__proto__:null,default:h,pageSectionsExport:d},Symbol.toStringTag,{value:"Module"})),T={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:a}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/navigate/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:p}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:i}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:o}}};export{T as configValuesSerialized};
