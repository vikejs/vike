import{j as e,i as t,L as r,o as i}from"../chunks/chunk-BEm8bNjM.js";import{L as l}from"../chunks/chunk-Dpi7Xm_o.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-D66rUQXN.js";/* empty css                      */const o=[{pageSectionId:"basics",pageSectionLevel:2,pageSectionTitle:"Basics"},{pageSectionId:"advanced",pageSectionLevel:2,pageSectionTitle:"Advanced"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function a(s){const n={br:"br",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...s.components};return e.jsxs(e.Fragment,{children:[e.jsxs(n.p,{children:["Environment: client",e.jsx(n.br,{}),`
`,"Type: ",e.jsx(n.code,{children:"boolean | string | string[] | ((pageContext: PageContextClient) => boolean | string | string[])"}),e.jsx(n.br,{}),`
`,"Default value: ",e.jsx(n.code,{children:"false"})]}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"keepScrollPosition"})," setting enables you to control whether the page scrolls to the top upon navigation."]}),`
`,e.jsxs(n.p,{children:["It's commonly used for nested layouts such as tabs, see ",e.jsx(l,{href:"/Layout#nested"}),"."]}),`
`,e.jsxs(n.p,{children:["For a control on a link-by-link basis, see ",e.jsx(l,{href:"/clientRouting#settings",children:e.jsx(n.code,{children:'<a href="/some-url" keep-scroll-position />'})}),"."]}),`
`,e.jsx("h2",{id:"basics",children:"Basics"}),`
`,e.jsxs(n.p,{children:["By default, the page is scrolled to the top upon navigation. But if you set ",e.jsx(n.code,{children:"keepScrollPosition"})," to ",e.jsx(n.code,{children:"true"})," then the page's scroll position is preserved instead."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/product/@id/+config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // Don't scroll to top when navigating between the pages defined at pages/product/@id/**"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  keepScrollPosition: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"true"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`pages/product/@id/+config.js
pages/product/@id/pricing/+Page.js
pages/product/@id/reviews/+Page.js
`})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"bash","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"bash","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Scroll is preserved when navigating between:"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6F42C1"},children:"/product/42"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6F42C1"},children:"/product/42/pricing"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6F42C1"},children:"/product/42/reviews"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Scroll is preserved when navigating between:"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6F42C1"},children:"/product/1337"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6F42C1"},children:"/product/1337/pricing"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6F42C1"},children:"/product/1337/reviews"})})]})})}),`
`,e.jsxs(n.p,{children:["Note that the scroll isn't preserved (the page scrolls to the top) if the ",e.jsx(n.code,{children:"@id"})," parameter differs."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"bash","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"bash","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Scroll *isn't* preserved when navigating between:"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6F42C1"},children:"/product/42/pricing"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6F42C1"},children:"/product/1337/pricing"})})]})})}),`
`,e.jsxs(n.p,{children:["See ",e.jsx(l,{href:"#advanced"})," if this behavior doesn't fit your use case."]}),`
`,e.jsx("h2",{id:"advanced",children:"Advanced"}),`
`,e.jsx(n.p,{children:'You can preserve the scroll position between any arbitrary group of pages (the "scroll group").'}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/product/@id/+config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  keepScrollPosition: "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'name-of-the-scroll-group'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"bash","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"bash","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Scroll is preserved when navigating between:"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6F42C1"},children:"/product/42/pricing"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6F42C1"},children:"/product/1337/pricing"})})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/reviews/@id/+config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  keepScrollPosition: "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'name-of-the-scroll-group'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"bash","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"bash","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Scroll is preserved when navigating between:"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6F42C1"},children:"/product/42"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6F42C1"},children:"/reviews/1337"})})]})})}),`
`,e.jsx(n.p,{children:"If two URLs belong to the same scroll group, then the scroll position is preserved."}),`
`,e.jsx(n.p,{children:"You can also programmatically set the scroll group:"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// /pages/product/@id/+keepScrollPosition.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Environment: client"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" ("}),e.jsx(n.span,{style:{color:"#E36209"},children:"pageContext"}),e.jsx(n.span,{style:{color:"#24292E"},children:", { "}),e.jsx(n.span,{style:{color:"#E36209"},children:"configDefinedAt"}),e.jsx(n.span,{style:{color:"#24292E"},children:" }) "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  console."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"log"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(configDefinedAt) "}),e.jsx(n.span,{style:{color:"#6A737D"},children:"// Prints '/pages/product/@id/+keepScrollPosition.js'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // This is the value Vike sets by default:"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" [configDefinedAt, pageContext.routeParams["}),e.jsx(n.span,{style:{color:"#032F62"},children:"'id'"}),e.jsx(n.span,{style:{color:"#24292E"},children:"]]"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{href:"/Layout#nested"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{href:"/clientRouting#settings"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{href:"/navigate#options"}),`
`]}),`
`]})]})}function d(s={}){const{wrapper:n}=s.components||{};return n?e.jsx(n,{...s,children:e.jsx(a,{...s})}):a(s)}const c=Object.freeze(Object.defineProperty({__proto__:null,default:d,pageSectionsExport:o},Symbol.toStringTag,{value:"Module"})),S={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:i}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/keepScrollPosition/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:c}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:r}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:t}}};export{S as configValuesSerialized};
