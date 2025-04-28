import{j as e,b as i,i as t,L as r,o}from"../chunks/chunk-DDglp-1g.js";import{L as s}from"../chunks/chunk-26hgBjwh.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-DKx9YHKN.js";import{U as d}from"../chunks/chunk-C72AEKOl.js";import{U as c}from"../chunks/chunk-C8RGYTKV.js";/* empty css                      *//* empty css                      *//* empty css                      */const h=[{pageSectionId:"examples",pageSectionLevel:2,pageSectionTitle:"Examples"},{pageSectionId:"getting-started",pageSectionLevel:2,pageSectionTitle:"Getting started"},{pageSectionId:"links-intercepting",pageSectionLevel:2,pageSectionTitle:"Links intercepting"},{pageSectionId:"hooks",pageSectionLevel:2,pageSectionTitle:"Hooks"},{pageSectionId:"settings",pageSectionLevel:2,pageSectionTitle:"Settings"},{pageSectionId:"programmatic-navigation",pageSectionLevel:2,pageSectionTitle:"Programmatic navigation"},{pageSectionId:"state-initialization",pageSectionLevel:2,pageSectionTitle:"State initialization"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function a(l){const n={a:"a",blockquote:"blockquote",code:"code",em:"em",figure:"figure",li:"li",ol:"ol",p:"p",pre:"pre",span:"span",ul:"ul",...l.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.p,{children:"Environment: client."}),`
`,e.jsxs(n.p,{children:["If you don't use a ",e.jsx(d,{})," then Vike does ",e.jsx(s,{text:"Server Routing",href:"/server-routing"})," by default."]}),`
`,e.jsxs(n.p,{children:["You can opt into ",e.jsx(s,{text:"Client Routing",href:"/client-routing"})," by using the ",e.jsx(n.code,{children:"clientRouting"})," setting, see ",e.jsx(s,{href:"#getting-started"}),"."]}),`
`,e.jsx(c,{featureName:"Client Routing"}),`
`,e.jsx("h2",{id:"examples",children:"Examples"}),`
`,e.jsx(n.p,{children:"React example:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{path:"/boilerplates/boilerplate-react-ts/renderer/+onRenderClient.tsx"}),`
`]}),`
`]}),`
`,e.jsx(n.p,{children:"Vue example:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{path:"/boilerplates/boilerplate-vue-ts/renderer/+onRenderClient.ts"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(i,{path:"/boilerplates/boilerplate-vue-ts/renderer/app.ts"}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"getting-started",children:"Getting started"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:["Set ",e.jsx(n.code,{children:"clientRouting"})," to ",e.jsx(n.code,{children:"true"}),":"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/+config.js"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  clientRouting: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"true"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:["Adapt your ",e.jsx(s,{text:e.jsx(e.Fragment,{children:e.jsx(n.code,{children:"onRenderClient()"})}),href:"/onRenderClient"})," hook:"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /renderer/+onRenderClient.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: browser"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { onRenderClient }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { renderToDom, hydrateDom } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'some-ui-framework'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onRenderClient"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // `pageContext.isHydration` is set by Vike and is `true` when the page"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // is already rendered to HTML."})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(n.span,{style:{color:"#24292E"},children:" (pageContext.isHydration) {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // We hydrate the first page. (Since we do SSR, the first page is already"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // rendered to HTML and we merely have to hydrate it.)"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"    await"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" hydrateDom"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(pageContext.Page)"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"else"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // We render a new page. (When the user navigates to a new page.)"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"    await"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" renderToDom"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(pageContext.Page)"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Note that ",e.jsx(n.code,{children:"pageContext"}),` is completely discarded and created anew upon page navigation.
That's why it's called `,e.jsx(n.em,{children:"page"}),"Context (and not ",e.jsx(n.em,{children:"app"}),"Context)."]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["See ",e.jsx(n.a,{href:"/render-modes",children:"Render Modes"})," for another illustration of conditional DOM hydration."]}),`
`]}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"links-intercepting",children:"Links intercepting"}),`
`,e.jsxs(n.p,{children:["You can keep using ",e.jsx(n.code,{children:'<a href="/some-url">'})," links: the Client Router automatically intercepts clicks on ",e.jsx(n.code,{children:"<a>"})," elements."]}),`
`,e.jsxs(n.p,{children:["You can skip the Client Router for individual ",e.jsx(n.code,{children:"<a>"})," links by adding the ",e.jsx(n.code,{children:'rel="external"'})," attribute, e.g. ",e.jsx(n.code,{children:`<a rel="external" href="/some/url">The Client Router won't intercept me</a>`}),"."]}),`
`,e.jsx("h2",{id:"hooks",children:"Hooks"}),`
`,e.jsxs(n.p,{children:["You can use the following hook to implement initialization after the ",e.jsx(s,{href:"/hydration",children:"hydration"})," has finished:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/onHydrationEnd",noBreadcrumb:!0}),`
`]}),`
`]}),`
`,e.jsx(n.p,{children:"And following hooks to implement page transition animations:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/onPageTransitionStart",noBreadcrumb:!0}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/onPageTransitionEnd",noBreadcrumb:!0}),`
`]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"These hooks are only available if you use Client Routing."}),`
`]}),`
`,e.jsx("h2",{id:"settings",children:"Settings"}),`
`,e.jsx(n.p,{children:"Page settings:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"prefetchStaticAssets"}),": Link prefetching settings, see ",e.jsx(s,{href:"/prefetchStaticAssets"}),"."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"hydrationCanBeAborted"}),": Whether the ",e.jsx(s,{text:"UI framework",href:"/ui-frameworks"})," allows the ",e.jsx(s,{href:"/hydration",children:"hydration"})," to be aborted, see ",e.jsx(s,{href:"/hydrationCanBeAborted"}),"."]}),`
`]}),`
`,e.jsx(n.p,{children:"Anchor link options:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:'<a href="/some/url" keep-scroll-position>'}),": Don't scroll to the top of the page, preserve the scroll position instead. See also:",`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/keepScrollPosition"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/navigate#options",children:e.jsx(n.code,{children:"navigate('/some-url', { keepScrollPosition: true })"})}),`
`]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:'<a href="/some/url" rel="external">'}),": Skip Client Routing, see ",e.jsx(s,{href:"#links-intercepting"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"programmatic-navigation",children:"Programmatic navigation"}),`
`,e.jsxs(n.p,{children:["You can use the function ",e.jsx(n.code,{children:"navigate('/some/url')"})," to programmatically navigate the user to a new page."]}),`
`,e.jsxs(n.p,{children:["See ",e.jsx(s,{href:"/navigate"}),"."]}),`
`,e.jsx("h2",{id:"state-initialization",children:"State initialization"}),`
`,e.jsx(n.p,{children:"Usually, when using tools such as Apollo GraphQL, Redux or Vuex, you determine the initial state of your UI on the server-side while rendering HTML, and then initialize the client-side with that initial state."}),`
`,e.jsx(n.p,{children:"Depending on the tool, you do either one of the following:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"You initialize the state once."}),`
`,e.jsx(n.li,{children:"You re-initialize the state on every page navigation."}),`
`]}),`
`,e.jsx(n.p,{children:"To initialize once:"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /renderer/+onRenderHtml.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { onRenderHtml }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { escapeInject, dangerouslySkipEscape } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/server'"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { renderToHtml } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'some-ui-framework'"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { getInitialState } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" './getInitialState'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// The `onRenderHtml()` hook is called only for the first page."})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// (Whereas `onBeforeRender()` is called as well upon page navigation.)"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onRenderHtml"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" initialState"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" getInitialState"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // We use `initialState` for rendering the HTML, so that the HTML contains"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // the content of `initialState`."})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" pageHtml"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" renderToHtml"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(pageContext.Page, initialState)"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" documentHtml"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" escapeInject"}),e.jsx(n.span,{style:{color:"#032F62"},children:"`<!DOCTYPE html>"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#032F62"},children:"    <html>"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#032F62"},children:"      <body>"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#032F62"},children:"        <div>${"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"dangerouslySkipEscape"}),e.jsx(n.span,{style:{color:"#032F62"},children:"("}),e.jsx(n.span,{style:{color:"#24292E"},children:"pageHtml"}),e.jsx(n.span,{style:{color:"#032F62"},children:")"}),e.jsx(n.span,{style:{color:"#032F62"},children:"}</div>"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#032F62"},children:"      </body>"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#032F62"},children:"    </html>`"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    documentHtml,"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    pageContext: {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"      initialState"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /renderer/+config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: config"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  passToClient: ["}),e.jsx(n.span,{style:{color:"#032F62"},children:"'initialState'"}),e.jsx(n.span,{style:{color:"#24292E"},children:"]"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /renderer/+onRenderClient.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: browser"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { onRenderClient }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { initClientSide } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" './initClientSide'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onRenderClient"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // The first page is rendered to HTML and `pageContext.isHydration === true`"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(n.span,{style:{color:"#24292E"},children:" (pageContext.isHydration) {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // `pageContext.initialState` is available here"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"    initClientSide"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(pageContext.initialState)"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"else"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // Note that `pageContext.initialState` isn't available here,"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // since our `onRenderHtml()` hook is only called for the first page."})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // ..."})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.p,{children:"To initialize on every page navigation:"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /renderer/+onBeforeRender.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: server"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { onBeforeRender }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { getInitialState } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" './getInitialState'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// The `onBeforeRender()` hook is called for the first page as well as upon page navigation."})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// (Whereas `onRenderHtml()` is called only for the first page.)"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onBeforeRender"}),e.jsx(n.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" initialState"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#D73A49"},children:" await"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" getInitialState"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    pageContext: {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"      initialState"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /renderer/+onRenderClient.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: browser"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { onRenderClient }"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { initClientSide } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" './initClientSide'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"async"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" onRenderClient"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // We initialize the state for every page rendering. So not only"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // the first page but also any subsequent page navigation."})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"  initClientSide"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(pageContext.initialState)"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // ..."})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/client-routing"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/navigate"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/onHydrationEnd"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/onPageTransitionStart"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/onPageTransitionEnd"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/prefetchStaticAssets"}),`
`]}),`
`]})]})}function p(l={}){const{wrapper:n}=l.components||{};return n?e.jsx(n,{...l,children:e.jsx(a,{...l})}):a(l)}const x=Object.freeze(Object.defineProperty({__proto__:null,default:p,pageSectionsExport:h},Symbol.toStringTag,{value:"Module"})),R={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/clientRouting/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:x}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:r}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:t}}};export{R as configValuesSerialized};
