import{o as a,a as o}from"../chunks/chunk-CD9QEe8_.js";import{j as e}from"../chunks/chunk-Douv1U2N.js";import{L as r}from"../chunks/chunk-CFMsqHiR.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */const t=[{pageSectionId:"getting-started",pageSectionLevel:2,pageSectionTitle:"Getting started"},{pageSectionId:"first-step",pageSectionLevel:3,pageSectionTitle:"First step"},{pageSectionId:"progressively-create-your-framework",pageSectionLevel:3,pageSectionTitle:"Progressively create your framework"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function l(s){const n={blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.p,{children:"Vike enables you to create your own framework tailored to your company's requirements."}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["It's a powerful way to scale your teams, and to ensure a cohesive stack throughout your company. See ",e.jsx(r,{href:"/why#build-your-own-framework"}),"."]}),`
`]}),`
`,e.jsx(n.p,{children:"Your framework can include everything (frontend, backend, data fetching, authentication, deployment, error tracking, analytics, ...) so that your Product Developers can focus on what they do best: building user interfaces."}),`
`,e.jsx("h2",{id:"getting-started",children:"Getting started"}),`
`,e.jsx("h3",{id:"first-step",children:"First step"}),`
`,e.jsxs(n.p,{children:["We recommend getting started by creating a regular Vike app. Once you are satisfied with your stack then progressively move code from the user-land (code inside the app's Git repository) to your framework (code inside ",e.jsx(n.code,{children:"node_modules/my-framework/"}),")."]}),`
`,e.jsx("h3",{id:"progressively-create-your-framework",children:"Progressively create your framework"}),`
`,e.jsx(n.p,{children:"Once you are satisfied wit the stack of your regular Vike app, progressively create your framework."}),`
`,e.jsx(n.p,{children:"You can achieve that by progressively applying one or more of the following steps:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Create your own Vike extension that contains all your configuration.",`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{className:"has-diff",style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{className:"diff remove","data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" react "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike-react/config'"})]}),`
`,e.jsxs(n.span,{className:"diff remove","data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" apollo "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike-react-apollo/config'"})]}),`
`,e.jsxs(n.span,{className:"diff add","data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" myFramework "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'my-framework/config'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{className:"diff remove","data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  ssr: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"false"}),e.jsx(n.span,{style:{color:"#24292E"},children:", "})]}),`
`,e.jsx(n.span,{className:"diff remove","data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  extends: [react, apollo] "})}),`
`,e.jsx(n.span,{className:"diff add","data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  extends: [myFramework] "})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(r,{href:"/meta",children:"Create custom settings"}),", so that your Product Developers can easily configure your framework.",`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// pages/+config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" myFramework "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'my-framework/config'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  myCustomSetting: "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"true"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  extends: [myFramework]"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`]}),`
`,e.jsxs(n.li,{children:["Create your own CLI.",`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"json","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"json","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// package.json"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"{"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#005CC5"},children:'  "scripts"'}),e.jsx(n.span,{style:{color:"#24292E"},children:": {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#005CC5"},children:'    "dev"'}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#032F62"},children:'"my-framework"'}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#005CC5"},children:'    "build"'}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#032F62"},children:'"my-framework build"'}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#005CC5"},children:'    "preview"'}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#032F62"},children:'"my-framework preview"'})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["You can build your own CLI by using ",e.jsx(r,{href:"/api",children:"Vike's JavaScript API"}),"."]}),`
`]}),`
`]}),`
`,e.jsx(n.li,{children:"Move your server code to be built into your framework."}),`
`,e.jsxs(n.li,{children:["Move deployment logic to be built into your framework.",`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{className:"has-diff",style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"json","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"json","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// package.json"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"{"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#005CC5"},children:'  "scripts"'}),e.jsx(n.span,{style:{color:"#24292E"},children:": {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#005CC5"},children:'    "dev"'}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#032F62"},children:'"my-framework"'}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#005CC5"},children:'    "build"'}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#032F62"},children:'"my-framework build"'}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#005CC5"},children:'    "preview"'}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#032F62"},children:'"my-framework preview"'}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(n.span,{className:"diff add","data-line":"",children:[e.jsx(n.span,{style:{color:"#005CC5"},children:'    "deploy"'}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#032F62"},children:'"my-framework deploy"'})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`]}),`
`,e.jsx(n.li,{children:"Add utilities to your framework, such as error tracking or analytics."}),`
`]}),`
`,e.jsx(n.p,{children:"Feel free to reach out to the Vike team if you have any questions, and sponsorship is welcome for a tight-knit collaboration."}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(r,{href:"/api"}),`
`]}),`
`]})]})}function i(s={}){const{wrapper:n}=s.components||{};return n?e.jsx(n,{...s,children:e.jsx(l,{...s})}):l(s)}const d=Object.freeze(Object.defineProperty({__proto__:null,default:i,pageSectionsExport:t},Symbol.toStringTag,{value:"Module"})),k={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:a}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/build-your-own-framework/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:d}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{k as configValuesSerialized};
