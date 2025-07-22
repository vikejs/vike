import{o as r,a as i}from"../chunks/chunk-CuuRH9a_.js";import{j as e}from"../chunks/chunk-D3FsxVgn.js";import{L as n}from"../chunks/chunk-CKfDXA66.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{V as a}from"../chunks/chunk-DBuWiGSU.js";/* empty css                      *//* empty css                      *//* empty css                      */const o=[{pageSectionId:"override-for-individual-links",pageSectionLevel:2,pageSectionTitle:"Override for individual links"},{pageSectionId:"programmatic-prefetch",pageSectionLevel:2,pageSectionTitle:"Programmatic `prefetch()`"},{pageSectionId:"different-settings-for-mobile-desktop",pageSectionLevel:2,pageSectionTitle:"Different settings for mobile/desktop"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function l(t){const s={a:"a",blockquote:"blockquote",br:"br",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...t.components};return e.jsxs(e.Fragment,{children:[e.jsxs(s.p,{children:["Environment: client",e.jsx(s.br,{}),`
`,e.jsx(n,{href:"/config#cumulative",children:"Cumulative"}),": false",e.jsx(s.br,{}),`
`,e.jsx(n,{href:"/config#global",children:"Global"}),": false"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// +config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Default value: 'hover'"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prefetchStaticAssets: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'viewport'"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(s.p,{children:[`By default,
the static assets of `,e.jsx(s.code,{children:"/some-url"})," are loaded as soon as the user hovers his mouse over a link ",e.jsx(s.code,{children:'<a href="/some-url">'}),`.
This means that static assets are often already loaded before even the user clicks on the link.`]}),`
`,e.jsx(s.p,{children:"You can prefetch even more eagerly by using viewport prefetching: the links are then prefetched as soon as they appear in the viewport of the user's browser."}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /renderer/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Environment: config"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Prefetch links as soon as they enter the viewport"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prefetchStaticAssets: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'viewport'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Prefetch links when the user's mouse hovers a link"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prefetchStaticAssets: "}),e.jsx(s.span,{style:{color:"#032F62"},children:"'hover'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // Disable prefetching"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  prefetchStaticAssets: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["Viewport prefetching is disabled in development. (Because preloading pages that early ",e.jsx(a,{}),".)"]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["Only static assets are prefetched: the ",e.jsx(s.code,{children:"pageContext"})," of pages isn't prefetched, see ",e.jsx(s.a,{href:"https://github.com/vikejs/vike/issues/246",children:"#246"}),"."]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.code,{children:"prefetchStaticAssets"})," setting requires ",e.jsx(n,{href:"/client-routing",children:"Client Routing"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"override-for-individual-links",children:"Override for individual links"}),`
`,e.jsxs(s.p,{children:["You can override the ",e.jsx(s.code,{children:"prefetchStaticAssets"})," setting for individual links:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.code,{children:'<a href="/some-url" data-prefetch-static-assets="hover" />'})}),`
`,e.jsx(s.li,{children:e.jsx(s.code,{children:'<a href="/some-url" data-prefetch-static-assets="viewport" />'})}),`
`,e.jsx(s.li,{children:e.jsx(s.code,{children:'<a href="/some-url" data-prefetch-static-assets="false" />'})}),`
`]}),`
`,e.jsxs("h2",{id:"programmatic-prefetch",children:["Programmatic ",e.jsx("code",{children:"prefetch()"})]}),`
`,e.jsxs(s.p,{children:["You can programmatically call ",e.jsx("code",{children:"prefetch('/some/url')"}),", see ",e.jsx(n,{href:"/prefetch"}),"."]}),`
`,e.jsx("h2",{id:"different-settings-for-mobile-desktop",children:"Different settings for mobile/desktop"}),`
`,e.jsx(s.p,{children:"You can viewport prefetch for mobile users while only hover prefetch for desktop users:"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+prefetchStaticAssets.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// For small screens, such as mobile, viewport prefetching can be a sensible strategy"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" prefetchStaticAssets"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  window."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"matchMedia"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'(max-width: 600px)'"}),e.jsx(s.span,{style:{color:"#24292E"},children:").matches "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"?"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'viewport'"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" :"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'hover'"})]})]})})}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+prefetchStaticAssets.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Or we enable viewport prefetching for any device without a mouse: mobile and tablets (but"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// not laptops that have a touch display)."})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" prefetchStaticAssets"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  window."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"matchMedia"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'(any-hover: none)'"}),e.jsx(s.span,{style:{color:"#24292E"},children:").matches "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"?"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'viewport'"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" :"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'hover'"})]})]})})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["Make sure to define such dynamic/runtime code in a ",e.jsx(s.code,{children:"+prefetchStaticAssets.js"})," file."]}),`
`,e.jsxs(s.p,{children:["(Don't define it inside a ",e.jsx(s.code,{children:"+config.js"})," file because ",e.jsx(s.code,{children:"window.matchMedia()"})," only exists in the browser and it would ",e.jsxs(n,{href:"/config#pointer-imports",children:["prevent Vike from loading ",e.jsx(s.code,{children:"+config.js"})," files"]}),".)"]}),`
`]}),`
`,e.jsx(s.p,{children:"See also:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia",children:"MDN > Web API > Window > matchMedia()"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://stackoverflow.com/questions/7838680/detecting-that-the-browser-has-no-mouse-and-is-touch-only/52854585#52854585",children:"Stack Overflow > Detecting that the browser has no mouse and is touch-only"})}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/prefetch"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/preloading"}),`
`]}),`
`]})]})}function c(t={}){const{wrapper:s}=t.components||{};return s?e.jsx(s,{...t,children:e.jsx(l,{...t})}):l(t)}const d=Object.freeze(Object.defineProperty({__proto__:null,default:c,pageSectionsExport:o},Symbol.toStringTag,{value:"Module"})),w={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:i}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:r}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/prefetchStaticAssets/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:d}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{w as configValuesSerialized};
