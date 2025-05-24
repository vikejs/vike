import{j as e,i as a,L as o,o as t}from"../chunks/chunk-C3m_FFP7.js";import{L as r}from"../chunks/chunk-BG2zU9R1.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-DzLEoW__.js";/* empty css                      */const i=[{pageSectionId:"getting-started",pageSectionLevel:2,pageSectionTitle:"Getting started"},{pageSectionId:"first-step",pageSectionLevel:3,pageSectionTitle:"First step"},{pageSectionId:"progressively-create-your-framework",pageSectionLevel:3,pageSectionTitle:"Progressively create your framework"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function l(n){const s={blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(s.p,{children:"Vike enables you to create your own framework tailored to your company's requirements."}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["It's a powerful way to scale your teams, and to ensure a cohesive stack throughout your company. See ",e.jsx(r,{href:"/why#build-your-own-framework"}),"."]}),`
`]}),`
`,e.jsx(s.p,{children:"Your framework can include everything (frontend, backend, data fetching, authentication, deployment, error tracking, analytics, ...) so that your Product Developers can focus on what they do best: building user interfaces."}),`
`,e.jsx("h2",{id:"getting-started",children:"Getting started"}),`
`,e.jsx("h3",{id:"first-step",children:"First step"}),`
`,e.jsxs(s.p,{children:["We recommend getting started by creating a regular Vike app. Once you are satisfied with your stack then progressively move code from the user-land (code inside the app's Git repository) to your framework (code inside ",e.jsx(s.code,{children:"node_modules/my-framework/"}),")."]}),`
`,e.jsx("h3",{id:"progressively-create-your-framework",children:"Progressively create your framework"}),`
`,e.jsx(s.p,{children:"Once you are satisfied wit the stack of your regular Vike app, progressively create your framework."}),`
`,e.jsx(s.p,{children:"You can achieve that by progressively applying one or more of the following steps:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Create your own Vike extension that contains all your configuration.",`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{className:"diff remove","data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" react "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike-react/config'"})]}),`
`,e.jsxs(s.span,{className:"diff remove","data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" apollo "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike-react-apollo/config'"})]}),`
`,e.jsxs(s.span,{className:"diff add","data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" myFramework "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'my-framework/config'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{className:"diff remove","data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "})]}),`
`,e.jsx(s.span,{className:"diff remove","data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  extends: [react, apollo] "})}),`
`,e.jsx(s.span,{className:"diff add","data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  extends: [myFramework] "})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`]}),`
`,e.jsxs(s.li,{children:[e.jsx(r,{href:"/meta",children:"Create custom settings"}),", so that your Product Developers can easily configure your framework.",`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" myFramework "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'my-framework/config'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  myCustomSetting: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  extends: [myFramework]"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`]}),`
`,e.jsxs(s.li,{children:["Create your own CLI.",`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"json","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"json","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// package.json"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"{"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#005CC5"},children:'  "scripts"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#005CC5"},children:'    "dev"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"my-framework"'}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#005CC5"},children:'    "build"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"my-framework build"'}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#005CC5"},children:'    "preview"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"my-framework preview"'})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["You can build your own CLI by using ",e.jsx(r,{href:"/api",children:"Vike's JavaScript API"}),"."]}),`
`]}),`
`]}),`
`,e.jsx(s.li,{children:"Move your server code to be built into your framework."}),`
`,e.jsxs(s.li,{children:["Move deployment logic to be built into your framework.",`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"json","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"json","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// package.json"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"{"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#005CC5"},children:'  "scripts"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#005CC5"},children:'    "dev"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"my-framework"'}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#005CC5"},children:'    "build"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"my-framework build"'}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#005CC5"},children:'    "preview"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"my-framework preview"'}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{className:"diff add","data-line":"",children:[e.jsx(s.span,{style:{color:"#005CC5"},children:'    "deploy"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"my-framework deploy"'})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`]}),`
`,e.jsx(s.li,{children:"Add utilities to your framework, such as error tracking or analytics."}),`
`]}),`
`,e.jsx(s.p,{children:"Feel free to reach out to the Vike team if you have any questions, and sponsorship is welcome for a tight-knit collaboration."}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(r,{href:"/api"}),`
`]}),`
`]})]})}function d(n={}){const{wrapper:s}=n.components||{};return s?e.jsx(s,{...n,children:e.jsx(l,{...n})}):l(n)}const c=Object.freeze(Object.defineProperty({__proto__:null,default:d,pageSectionsExport:i},Symbol.toStringTag,{value:"Module"})),v={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:t}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/build-your-own-framework/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:c}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:a}}};export{v as configValuesSerialized};
