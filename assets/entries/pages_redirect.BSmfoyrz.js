import{j as e,i as o,L as i,o as l}from"../chunks/chunk-CA25TqZK.js";import{L as n}from"../chunks/chunk-BjLQpSqv.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-DQ1DQlqi.js";/* empty css                      */const a=[{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function t(s){const r={a:"a",blockquote:"blockquote",code:"code",em:"em",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(r.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(r.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(r.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(r.span,{"data-line":"",children:e.jsx(r.span,{style:{color:"#6A737D"},children:"// Redirect the user to another URL"})}),`
`,e.jsxs(r.span,{"data-line":"",children:[e.jsx(r.span,{style:{color:"#6F42C1"},children:"redirect"}),e.jsx(r.span,{style:{color:"#24292E"},children:"(url: "}),e.jsx(r.span,{style:{color:"#032F62"},children:"`/${"}),e.jsx(r.span,{style:{color:"#24292E"},children:"string"}),e.jsx(r.span,{style:{color:"#032F62"},children:"}`"}),e.jsx(r.span,{style:{color:"#D73A49"},children:" |"}),e.jsx(r.span,{style:{color:"#032F62"},children:" `https://${"}),e.jsx(r.span,{style:{color:"#24292E"},children:"string"}),e.jsx(r.span,{style:{color:"#032F62"},children:"}`"}),e.jsx(r.span,{style:{color:"#D73A49"},children:" |"}),e.jsx(r.span,{style:{color:"#032F62"},children:" `http://${"}),e.jsx(r.span,{style:{color:"#24292E"},children:"string"}),e.jsx(r.span,{style:{color:"#032F62"},children:"}`"}),e.jsx(r.span,{style:{color:"#24292E"},children:")"})]})]})})}),`
`,e.jsx(r.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(r.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(r.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(r.span,{"data-line":"",children:e.jsx(r.span,{style:{color:"#6A737D"},children:"// /pages/some-page/+someHook.js"})}),`
`,e.jsx(r.span,{"data-line":"",children:" "}),`
`,e.jsxs(r.span,{"data-line":"",children:[e.jsx(r.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(r.span,{style:{color:"#24292E"},children:" { redirect } "}),e.jsx(r.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(r.span,{style:{color:"#032F62"},children:" 'vike/abort'"})]}),`
`,e.jsx(r.span,{"data-line":"",children:" "}),`
`,e.jsxs(r.span,{"data-line":"",children:[e.jsx(r.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(r.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(r.span,{style:{color:"#6F42C1"},children:" someHook"}),e.jsx(r.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(r.span,{"data-line":"",children:[e.jsx(r.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(r.span,{style:{color:"#24292E"},children:" (someCondition) {"})]}),`
`,e.jsxs(r.span,{"data-line":"",children:[e.jsx(r.span,{style:{color:"#D73A49"},children:"    throw"}),e.jsx(r.span,{style:{color:"#6F42C1"},children:" redirect"}),e.jsx(r.span,{style:{color:"#24292E"},children:"("}),e.jsx(r.span,{style:{color:"#032F62"},children:"'/some-url'"}),e.jsx(r.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(r.span,{"data-line":"",children:e.jsx(r.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(r.span,{"data-line":"",children:e.jsx(r.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(r.blockquote,{children:[`
`,e.jsxs(r.p,{children:[e.jsx(r.code,{children:"throw redirect()"})," is about ",e.jsx(r.em,{children:"aborting"})," a page from being rendered and redirecting to the user to another page instead. Use ",e.jsx(n,{href:"/navigate",children:e.jsx(r.code,{children:"navigate()"})})," if you want to redirect ",e.jsx(r.em,{children:"after"})," the page is already rendered. See ",e.jsx(n,{href:"/abort#throw-redirect-vs-throw-render-vs-navigate",doNotInferSectionTitle:!0}),"."]}),`
`]}),`
`,e.jsxs(r.blockquote,{children:[`
`,e.jsxs(r.p,{children:[e.jsx(r.code,{children:"throw redirect()"})," makes temporary redirections (HTTP status code ",e.jsx(r.code,{children:"302"}),"). For permanent redirections (HTTP status code ",e.jsx(r.code,{children:"301"}),"), use the ",e.jsxs(n,{href:"/redirects",children:[e.jsx(r.code,{children:"redirects"})," setting"]})," or pass a second argument ",e.jsx(r.code,{children:"throw redirect('/some-url', 301)"}),"."]}),`
`]}),`
`,e.jsx(r.p,{children:"Common use cases:"}),`
`,e.jsxs(r.ul,{children:[`
`,e.jsxs(r.li,{children:["Authentication and authorization, see ",e.jsx(n,{href:"/auth#login-flow"}),"."]}),`
`,e.jsxs(r.li,{children:["Data fetching error handling, see ",e.jsx(n,{href:"/data#error-handling"}),"."]}),`
`]}),`
`,e.jsxs(r.p,{children:["While it's most commonly used with ",e.jsx(r.a,{href:"/guard",children:e.jsx(r.code,{children:"guard()"})})," or ",e.jsx(r.a,{href:"/data",children:e.jsx(r.code,{children:"data()"})})," you can use it with any hook."]}),`
`,e.jsxs(r.blockquote,{children:[`
`,e.jsxs(r.p,{children:["For improved DX, consider using ",e.jsx(n,{href:"/render",children:e.jsx(r.code,{children:"throw render()"})})," instead of ",e.jsx(r.code,{children:"throw redirect()"}),". See ",e.jsx(n,{href:"/abort#throw-redirect-vs-throw-render-vs-navigate",doNotInferSectionTitle:!0}),"."]}),`
`]}),`
`,e.jsxs(r.p,{children:["If ",e.jsx(r.code,{children:"throw redirect()"})," doesn't work, see ",e.jsx(n,{href:"/abort#debug"})," and ",e.jsx(n,{href:"/abort#throw-redirect-vs-throw-render-vs-navigate"}),"."]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(r.ul,{children:[`
`,e.jsxs(r.li,{children:[`
`,e.jsx(n,{href:"/redirects"}),`
`]}),`
`,e.jsxs(r.li,{children:[`
`,e.jsx(n,{href:"/navigate"}),`
`]}),`
`,e.jsxs(r.li,{children:[`
`,e.jsx(n,{href:"/render"}),`
`]}),`
`,e.jsxs(r.li,{children:[`
`,e.jsx(n,{href:"/guard"}),`
`]}),`
`,e.jsxs(r.li,{children:[`
`,e.jsx(n,{href:"/abort#throw-redirect-vs-throw-render-vs-navigate",doNotInferSectionTitle:!0}),`
`]}),`
`,e.jsxs(r.li,{children:[`
`,e.jsx(n,{href:"/abort#debug"}),`
`]}),`
`]})]})}function d(s={}){const{wrapper:r}=s.components||{};return r?e.jsx(r,{...s,children:e.jsx(t,{...s})}):t(s)}const c=Object.freeze(Object.defineProperty({__proto__:null,default:d,pageSectionsExport:a},Symbol.toStringTag,{value:"Module"})),S={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:l}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/redirect/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:c}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:i}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:o}}};export{S as configValuesSerialized};
