import{j as e,i as a,L as r,o}from"../chunks/chunk-Bj9zA6kl.js";import{L as l}from"../chunks/chunk-BpwOkvfL.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-CPC0fyli.js";import{I as i}from"../chunks/chunk-Bcxw4o1Q.js";/* empty css                      *//* empty css                      */import"../chunks/chunk-k_T5lyzD.js";/* empty css                      */const d=[{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function t(s){const n={a:"a",blockquote:"blockquote",br:"br",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...s.components};return e.jsxs(e.Fragment,{children:[e.jsxs(n.p,{children:["Type: ",e.jsx(n.code,{children:"'responsive' | number | null | ((pageContext) => 'responsive' | number | null | undefined)"}),e.jsx(n.br,{}),`
`,"Default: ",e.jsx(n.code,{children:"'responsive'"}),e.jsx(n.br,{}),`
`,"Environment: server."]}),`
`,e.jsx(i,{noCustomGuide:!0}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"viewport"})," setting sets ",e.jsx(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag",children:"the page's shown width on mobile/tablet devices"}),"."]}),`
`,e.jsx(n.p,{children:"On mobile/tablet devices, you have the choice between two viewport settings:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Responsive: the page's width corresponds to the device width's (it isn't zoomed out)."}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"https://stackoverflow.com/questions/14775195/is-the-viewport-meta-tag-really-necessary/14775557#14775557",children:"Zoomed out"}),"."]}),`
`]}),`
`,e.jsx(n.p,{children:"By default, Vike assumes your page to be responsive."}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["In other words, by default Vike injects the following ",e.jsx(n.code,{children:'<meta name="viewport">'})," tag:"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"html","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"html","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"<"}),e.jsx(n.span,{style:{color:"#22863A"},children:"head"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  <"}),e.jsx(n.span,{style:{color:"#22863A"},children:"meta"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" name"}),e.jsx(n.span,{style:{color:"#24292E"},children:"="}),e.jsx(n.span,{style:{color:"#032F62"},children:'"viewport"'}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" content"}),e.jsx(n.span,{style:{color:"#24292E"},children:"="}),e.jsx(n.span,{style:{color:"#032F62"},children:'"width=device-width,initial-scale=1"'}),e.jsx(n.span,{style:{color:"#24292E"},children:" />"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"</"}),e.jsx(n.span,{style:{color:"#22863A"},children:"head"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]})]})})}),`
`]}),`
`,e.jsx(n.p,{children:"If your page isn't responsive, then we recommend setting the initial page width shown to the user:"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/admin-panel/+config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // The admin panel pages start to look good starting from a width of 1200px"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  viewport: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"1200"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["If your page looks and works well only starting from 1200px then we recommend setting the value to ",e.jsx(n.code,{children:"1200"}),", so that the width shown to the user is 1200px (the virtual width), even on a mobile device with a real physical width of 600px: the browser will then zoom out the page by a factor of ",e.jsx(n.code,{children:"2x"})," in order to match 1200px."]}),`
`,e.jsx(n.p,{children:"The user will be able to manually change the viewport size with pinch gestures."}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["If ",e.jsx(n.code,{children:"viewport"})," is a number, for example ",e.jsx(n.code,{children:"1200"}),", then Vike injects the following:"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"html","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"html","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"<"}),e.jsx(n.span,{style:{color:"#22863A"},children:"head"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  <"}),e.jsx(n.span,{style:{color:"#22863A"},children:"meta"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" name"}),e.jsx(n.span,{style:{color:"#24292E"},children:"="}),e.jsx(n.span,{style:{color:"#032F62"},children:'"viewport"'}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" content"}),e.jsx(n.span,{style:{color:"#24292E"},children:"="}),e.jsx(n.span,{style:{color:"#032F62"},children:'"width=1200"'}),e.jsx(n.span,{style:{color:"#24292E"},children:" />"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"</"}),e.jsx(n.span,{style:{color:"#22863A"},children:"head"}),e.jsx(n.span,{style:{color:"#24292E"},children:">"})]})]})})}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"viewport"})," setting (and the ",e.jsx(n.code,{children:'<meta name="viewport">'})," tag in general) has an effect only on mobile/tablet devices: it's ignored on desktop devices."]}),`
`]}),`
`,e.jsxs(n.p,{children:["You can also set any arbitrary ",e.jsx(n.code,{children:'<meta name="viewport">'})," tag:"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:'  // Don\'t inject any `<meta name="viewport">` tag'})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  viewport: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"null"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+Head.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Same as Vike's default but adding `user-scalable=no` which makes sense for"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// highly interactive apps such as games."})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" () "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(n.span,{style:{color:"#24292E"},children:" <>"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  <"}),e.jsx(n.span,{style:{color:"#22863A"},children:"meta"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" name"}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#032F62"},children:'"viewport"'}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" content"}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#032F62"},children:'"width=device-width,initial-scale=1,user-scalable=no"'}),e.jsx(n.span,{style:{color:"#24292E"},children:" />"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"</>"})})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["If there isn't any ",e.jsx(n.code,{children:'<meta name="viewport">'})," tag, then the browser will fallback to its default. We don't recommend this (it's unpredictable) and instead consider always setting a ",e.jsx(n.code,{children:'<meta name="viewport">'})," tag."]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag",children:"MDN > Viewport meta tag"})}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"https://stackoverflow.com/questions/14775195/is-the-viewport-meta-tag-really-necessary/14775557#14775557",children:"StackOverflow > Is the viewport meta tag really necessary? > [Accepted Answer]"}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Elaborate explanation of the ",e.jsx(n.code,{children:'<meta name="viewport">'})," tag."]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{href:"/head-tags"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{href:"/settings#html",doNotInferSectionTitle:!0}),`
`]}),`
`]})]})}function c(s={}){const{wrapper:n}=s.components||{};return n?e.jsx(n,{...s,children:e.jsx(t,{...s})}):t(s)}const h=Object.freeze(Object.defineProperty({__proto__:null,default:c,pageSectionsExport:d},Symbol.toStringTag,{value:"Module"})),D={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/viewport/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:h}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:r}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:a}}};export{D as configValuesSerialized};
