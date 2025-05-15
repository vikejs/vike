import{j as e,i as r,L as i,o as a}from"../chunks/chunk-X87llDnF.js";import{L as t}from"../chunks/chunk-BO_pGV8P.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-DoYOumgL.js";import{V as o}from"../chunks/chunk-BaKblS_m.js";/* empty css                      *//* empty css                      *//* empty css                      */const d=[{pageSectionId:"override-for-individual-links",pageSectionLevel:2,pageSectionTitle:"Override for individual links"},{pageSectionId:"programmatic-prefetch",pageSectionLevel:2,pageSectionTitle:"Programmatic `prefetch()`"},{pageSectionId:"different-settings-for-mobile-desktop",pageSectionLevel:2,pageSectionTitle:"Different settings for mobile/desktop"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function l(n){const s={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// +config.js"})}),`
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
`,e.jsxs(s.p,{children:["Viewport prefetching is disabled in development. (Because preloading pages that early ",e.jsx(o,{}),".)"]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["Only static assets are prefetched: the ",e.jsx(s.code,{children:"pageContext"})," of pages isn't prefetched, see ",e.jsx(s.a,{href:"https://github.com/vikejs/vike/issues/246",children:"#246"}),"."]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.code,{children:"prefetchStaticAssets"})," setting requires ",e.jsx(t,{href:"/client-routing",children:"Client Routing"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"override-for-individual-links",children:"Override for individual links"}),`
`,e.jsxs(s.p,{children:["You can override the ",e.jsx(s.code,{children:"prefetchStaticAssets"})," setting for individual links:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.code,{children:'<a href="/some-url" data-prefetch-static-assets="hover" />'})}),`
`,e.jsx(s.li,{children:e.jsx(s.code,{children:'<a href="/some-url" data-prefetch-static-assets="viewport" />'})}),`
`,e.jsx(s.li,{children:e.jsx(s.code,{children:'<a href="/some-url" data-prefetch-static-assets="false" />'})}),`
`]}),`
`,e.jsxs("h2",{id:"programmatic-prefetch",children:["Programmatic ",e.jsx("code",{children:"prefetch()"})]}),`
`,e.jsxs(s.p,{children:["You can programmatically call ",e.jsx("code",{children:"prefetch('/some/url')"}),", see ",e.jsx(t,{href:"/prefetch"}),"."]}),`
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
`,e.jsxs(s.p,{children:["(Don't define it inside a ",e.jsx(s.code,{children:"+config.js"})," file because ",e.jsx(s.code,{children:"window.matchMedia()"})," only exists in the browser and it would ",e.jsxs(t,{href:"/config#pointer-imports",children:["prevent Vike from loading ",e.jsx(s.code,{children:"+config.js"})," files"]}),".)"]}),`
`]}),`
`,e.jsx(s.p,{children:"See also:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia",children:"MDN > Web API > Window > matchMedia()"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://stackoverflow.com/questions/7838680/detecting-that-the-browser-has-no-mouse-and-is-touch-only/52854585#52854585",children:"Stack Overflow > Detecting that the browser has no mouse and is touch-only"})}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(t,{href:"/prefetch"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(t,{href:"/preloading"}),`
`]}),`
`]})]})}function c(n={}){const{wrapper:s}=n.components||{};return s?e.jsx(s,{...n,children:e.jsx(l,{...n})}):l(n)}const h=Object.freeze(Object.defineProperty({__proto__:null,default:c,pageSectionsExport:d},Symbol.toStringTag,{value:"Module"})),k={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:a}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/prefetchStaticAssets/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:h}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:i}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:r}}};export{k as configValuesSerialized};
