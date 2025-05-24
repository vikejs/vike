import{j as e,i as a,L as r,o}from"../chunks/chunk-t9m0wbA9.js";import{L as l}from"../chunks/chunk-Cignjo9r.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-DMEDH6lL.js";import{P as i}from"../chunks/chunk-CdwYgMn7.js";/* empty css                      *//* empty css                      */import"../chunks/chunk-DTCQUPhb.js";/* empty css                      */const d=[{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function t(n){const s={a:"a",blockquote:"blockquote",br:"br",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...n.components};return e.jsxs(e.Fragment,{children:[e.jsxs(s.p,{children:["Type: ",e.jsx(s.code,{children:"'responsive' | number | null | ((pageContext) => 'responsive' | number | null | undefined)"}),e.jsx(s.br,{}),`
`,"Default: ",e.jsx(s.code,{children:"'responsive'"}),e.jsx(s.br,{}),`
`,"Environment: server",e.jsx(s.br,{}),`
`,"Cumulative: ",e.jsx(s.code,{children:"false"})]}),`
`,e.jsx(i,{noCustomGuide:!0}),`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.code,{children:"viewport"})," setting sets ",e.jsx(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag",children:"the page's shown width on mobile/tablet devices"}),"."]}),`
`,e.jsx(s.p,{children:"On mobile/tablet devices, you have the choice between two viewport settings:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"Responsive: the page's width corresponds to the device width's (it isn't zoomed out)."}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://stackoverflow.com/questions/14775195/is-the-viewport-meta-tag-really-necessary/14775557#14775557",children:"Zoomed out"}),"."]}),`
`]}),`
`,e.jsx(s.p,{children:"By default, Vike assumes your page to be responsive."}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["In other words, by default Vike injects the following ",e.jsx(s.code,{children:'<meta name="viewport">'})," tag:"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"html","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"html","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"<"}),e.jsx(s.span,{style:{color:"#22863A"},children:"head"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"meta"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" name"}),e.jsx(s.span,{style:{color:"#24292E"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"viewport"'}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" content"}),e.jsx(s.span,{style:{color:"#24292E"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"width=device-width,initial-scale=1"'}),e.jsx(s.span,{style:{color:"#24292E"},children:" />"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"head"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]})]})})}),`
`]}),`
`,e.jsx(s.p,{children:"If your page isn't responsive, then we recommend setting the initial page width shown to the user:"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/admin-panel/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // The admin panel pages start to look good starting from a width of 1200px"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  viewport: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"1200"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["If your page looks and works well only starting from 1200px then we recommend setting the value to ",e.jsx(s.code,{children:"1200"}),", so that the width shown to the user is 1200px (the virtual width), even on a mobile device with a real physical width of 600px: the browser will then zoom out the page by a factor of ",e.jsx(s.code,{children:"2x"})," in order to match 1200px."]}),`
`,e.jsx(s.p,{children:"The user will be able to manually change the viewport size with pinch gestures."}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:[`It adds
`,e.jsx(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag",children:e.jsx(s.code,{children:'<meta name="viewport">'})}),`
to `,e.jsx(s.code,{children:"<head>"}),"."]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"html","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"html","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"<"}),e.jsx(s.span,{style:{color:"#22863A"},children:"head"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"meta"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" name"}),e.jsx(s.span,{style:{color:"#24292E"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"viewport"'}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" content"}),e.jsx(s.span,{style:{color:"#24292E"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"width=1200"'}),e.jsx(s.span,{style:{color:"#24292E"},children:" />"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"head"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]})]})})}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.code,{children:"viewport"})," setting (and the ",e.jsx(s.code,{children:'<meta name="viewport">'})," tag in general) has an effect only on mobile/tablet devices: it's ignored on desktop devices."]}),`
`]}),`
`,e.jsxs(s.p,{children:["You can also set any arbitrary ",e.jsx(s.code,{children:'<meta name="viewport">'})," tag:"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:'  // Don\'t inject any `<meta name="viewport">` tag'})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  viewport: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"null"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+Head.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Same as Vike's default but adding `user-scalable=no` which makes sense for"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// highly interactive apps such as games."})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" () "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E"},children:" <>"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"meta"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" name"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"viewport"'}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" content"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"width=device-width,initial-scale=1,user-scalable=no"'}),e.jsx(s.span,{style:{color:"#24292E"},children:" />"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"</>"})})]})})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["If there isn't any ",e.jsx(s.code,{children:'<meta name="viewport">'})," tag, then the browser will fallback to its default. We don't recommend this (it's unpredictable) and instead consider always setting a ",e.jsx(s.code,{children:'<meta name="viewport">'})," tag."]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag",children:"MDN > Viewport meta tag"})}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://stackoverflow.com/questions/14775195/is-the-viewport-meta-tag-really-necessary/14775557#14775557",children:"StackOverflow > Is the viewport meta tag really necessary? > [Accepted Answer]"}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["Elaborate explanation of the ",e.jsx(s.code,{children:'<meta name="viewport">'})," tag."]}),`
`]}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{href:"/head-tags"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{href:"/settings#html-shell",doNotInferSectionTitle:!0}),`
`]}),`
`]})]})}function c(n={}){const{wrapper:s}=n.components||{};return s?e.jsx(s,{...n,children:e.jsx(t,{...n})}):t(n)}const h=Object.freeze(Object.defineProperty({__proto__:null,default:c,pageSectionsExport:d},Symbol.toStringTag,{value:"Module"})),D={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/viewport/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:h}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:r}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:a}}};export{D as configValuesSerialized};
