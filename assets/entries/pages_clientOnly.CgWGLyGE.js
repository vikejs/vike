import{j as e,i as r,L as i,o as a}from"../chunks/chunk-CvErnxde.js";import{L as s}from"../chunks/chunk-BEZ9F6sZ.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-Buxh7nqW.js";import{U as o}from"../chunks/chunk-CPiiyxDz.js";/* empty css                      *//* empty css                      *//* empty css                      */const c=[{pageSectionId:"react",pageSectionLevel:2,pageSectionTitle:"React"},{pageSectionId:"usage",pageSectionLevel:3,pageSectionTitle:"Usage"},{pageSectionId:"props",pageSectionLevel:4,pageSectionTitle:"Props"},{pageSectionId:"solid",pageSectionLevel:2,pageSectionTitle:"Solid"},{pageSectionId:"usage",pageSectionLevel:3,pageSectionTitle:"Usage"},{pageSectionId:"props",pageSectionLevel:4,pageSectionTitle:"Props"},{pageSectionId:"vue",pageSectionLevel:2,pageSectionTitle:"Vue"},{pageSectionId:"props",pageSectionLevel:4,pageSectionTitle:"Props"},{pageSectionId:"slots",pageSectionLevel:4,pageSectionTitle:"Slots"},{pageSectionId:"without-vike-react-vue-solid",pageSectionLevel:2,pageSectionTitle:"Without `vike-{react,vue,solid}`"}];function t(l){const n={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...l.components};return e.jsxs(e.Fragment,{children:[e.jsxs(n.p,{children:["Implemented by: ",e.jsx(o,{})," (or ",e.jsx(s,{href:"#without-vike-react-vue-solid",children:"yourself"}),")."]}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"clientOnly()"})," helper enables you to load and render a component only on the client-side."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Alternatively, you can set ",e.jsx(s,{href:"/ssr",children:e.jsx(n.code,{children:"ssr: false"})})," to load and render the entire page on the client-side only."]}),`
`]}),`
`,e.jsx(n.p,{children:"Common use cases:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Library components that don't support SSR"}),". A solution is to render and load the component only on the client-side.",`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Most component libraries nowadays support SSR but some don't. Some even crash when they're merely loaded on the server-side (for example if the library has a hard reference to browser-only APIs such as ",e.jsx(n.code,{children:"window"}),")."]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Performance"}),". ",e.jsx(n.code,{children:"clientOnly()"})," allows you to defer loading heavy components, such as a complex interactive map. That way, your users can already interact with your page before even the browser starts loading that heavy component.",`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Vite code-splits dynamic imports such as ",e.jsx(n.code,{children:"const { SomeComponent } = await import('./SomeComponent')"}),". In other words, the code of ",e.jsx(n.code,{children:"<SomeComponent />"})," isn't included in the initial JavaScript client bundle: it's loaded only when/if ",e.jsx(n.code,{children:"import()"})," is called."]}),`
`]}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"react",children:"React"}),`
`,e.jsx("h3",{id:"usage",children:"Usage"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"tsx","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"tsx","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { clientOnly } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike-react/clientOnly'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" SomeComponent"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" clientOnly"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(() "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" import"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#032F62"},children:'"./SomeComponent.jsx"'}),e.jsx(n.span,{style:{color:"#24292E"},children:"));"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"/* If the component isn't the default export:"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"const SomeComponent = clientOnly(async () => (await import('some-library')).SomeComponent)"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"*/"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" MyComponent"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"props"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" <"}),e.jsx(n.span,{style:{color:"#005CC5"},children:"SomeComponent"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" fallback"}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:"{<"}),e.jsx(n.span,{style:{color:"#005CC5"},children:"Loading"}),e.jsx(n.span,{style:{color:"#24292E"},children:" />} />"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h4",{id:"props",children:"Props"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"fallback"}),": Content shown while the component is being loaded."]}),`
`]}),`
`,e.jsx(n.p,{children:"All other props are passed to the loaded component."}),`
`,e.jsx("h2",{id:"solid",children:"Solid"}),`
`,e.jsx("h3",{id:"usage",children:"Usage"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"tsx","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"tsx","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { clientOnly } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike-solid/clientOnly'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" SomeComponent"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" clientOnly"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(() "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" import"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#032F62"},children:'"./SomeComponent.jsx"'}),e.jsx(n.span,{style:{color:"#24292E"},children:"));"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"/* If the component isn't the default export:"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"const SomeComponent = clientOnly(async () => (await import('some-library')).SomeComponent)"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"*/"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" MyComponent"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"props"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" <"}),e.jsx(n.span,{style:{color:"#005CC5"},children:"SomeComponent"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" fallback"}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:"{<"}),e.jsx(n.span,{style:{color:"#005CC5"},children:"Loading"}),e.jsx(n.span,{style:{color:"#24292E"},children:" />} />"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx("h4",{id:"props",children:"Props"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"fallback"}),": Content shown while the component is being loaded."]}),`
`]}),`
`,e.jsx(n.p,{children:"All other props are passed to the loaded component."}),`
`,e.jsx("h2",{id:"vue",children:"Vue"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"vue","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"vue","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"<"}),e.jsx(n.span,{style:{color:"#22863A"},children:"template"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  <"}),e.jsx(n.span,{style:{color:"#22863A"},children:"SomeComponent"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"    <"}),e.jsx(n.span,{style:{color:"#22863A"},children:"template"}),e.jsx(n.span,{style:{color:"#24292E"},children:" #"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"fallback"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"      <"}),e.jsx(n.span,{style:{color:"#22863A"},children:"p"}),e.jsx(n.span,{style:{color:"#24292E"},children:">Loading...</"}),e.jsx(n.span,{style:{color:"#22863A"},children:"p"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"    </"}),e.jsx(n.span,{style:{color:"#22863A"},children:"template"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  </"}),e.jsx(n.span,{style:{color:"#22863A"},children:"SomeComponent"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"</"}),e.jsx(n.span,{style:{color:"#22863A"},children:"template"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"<"}),e.jsx(n.span,{style:{color:"#22863A"},children:"script"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" setup"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" clientOnly "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike-vue/clientOnly'"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" SomeComponent"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" clientOnly"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(() "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" import"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#032F62"},children:"'./SomeComponent.vue'"}),e.jsx(n.span,{style:{color:"#24292E"},children:"))"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"/* If the component isn't the default export:"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"const SomeComponent = clientOnly(async () => (await import('some-library')).SomeComponent)"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"*/"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"</"}),e.jsx(n.span,{style:{color:"#22863A"},children:"script"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]})]})})}),`
`,e.jsx("h4",{id:"props",children:"Props"}),`
`,e.jsx(n.p,{children:"All props are passed to the loaded component."}),`
`,e.jsx("h4",{id:"slots",children:"Slots"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"fallback"}),": Content shown while the component is being loaded."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"client-only-fallback"}),": Use it instead of the ",e.jsx(n.code,{children:"#fallback"})," slot in case of conflicts."]}),`
`]}),`
`,e.jsx(n.p,{children:"All slots are passed to the loaded component."}),`
`,e.jsxs("h2",{id:"without-vike-react-vue-solid",children:["Without ",e.jsx("code",{children:"vike-{react,vue,solid}"})]}),`
`,e.jsxs(n.p,{children:["If you don't use a ",e.jsx(o,{}),", you can implement the ",e.jsx(n.code,{children:"clientOnly()"})," helper yourself."]}),`
`,e.jsx(n.p,{children:"See, for example, the source code at:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsxs(n.a,{href:"https://github.com/vikejs/vike-react",children:["GitHub > ",e.jsx(n.code,{children:"vikejs/vike-react"})]})}),`
`,e.jsx(n.li,{children:e.jsxs(n.a,{href:"https://github.com/vikejs/vike-vue",children:["GitHub > ",e.jsx(n.code,{children:"vikejs/vike-vue"})]})}),`
`,e.jsx(n.li,{children:e.jsxs(n.a,{href:"https://github.com/vikejs/vike-solid",children:["GitHub > ",e.jsx(n.code,{children:"vikejs/vike-solid"})]})}),`
`]})]})}function d(l={}){const{wrapper:n}=l.components||{};return n?e.jsx(n,{...l,children:e.jsx(t,{...l})}):t(l)}const p=Object.freeze(Object.defineProperty({__proto__:null,default:d,pageSectionsExport:c},Symbol.toStringTag,{value:"Module"})),D={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:a}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/clientOnly/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:p}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:i}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:r}}};export{D as configValuesSerialized};
