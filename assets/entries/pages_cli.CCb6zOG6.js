import{o as r,a as t}from"../chunks/chunk-BQuxccGo.js";import{j as e}from"../chunks/chunk-COSJmPUs.js";import{L as s}from"../chunks/chunk-BCHPCi_P.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */const a=[{pageSectionId:"vike-settings",pageSectionLevel:2,pageSectionTitle:"Vike settings"},{pageSectionId:"cli-options",pageSectionLevel:4,pageSectionTitle:"CLI options"},{pageSectionId:"vike-config-environment-variable",pageSectionLevel:4,pageSectionTitle:"`VIKE_CONFIG` environment variable"},{pageSectionId:"vite-settings",pageSectionLevel:2,pageSectionTitle:"Vite settings"},{pageSectionId:"cli-options",pageSectionLevel:4,pageSectionTitle:"CLI options"},{pageSectionId:"vite-config-environment-variable",pageSectionLevel:4,pageSectionTitle:"`VITE_CONFIG` environment variable"},{pageSectionId:"json5-syntax",pageSectionLevel:2,pageSectionTitle:"JSON5 syntax"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function l(i){const n={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.p,{children:"Usage:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"$ vike dev"})," Start development server."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"$ vike build"})," Build for production."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"$ vike preview"})," Start preview server using production build (only works for ",e.jsx(s,{href:"/glossary#ssg",children:"SSG apps"}),")."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"$ vike prerender"})," ",e.jsx(s,{href:"/pre-rendering",children:"Pre-render"})," pages (only needed when ",e.jsx(s,{href:"/prerender#disableautorun",children:e.jsx(n.code,{children:"prerender.disableAutoRun"})})," is ",e.jsx(n.code,{children:"true"}),")."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"$ vike -v"})," Print Vike's installed version."]}),`
`]}),`
`,e.jsx("h2",{id:"vike-settings",children:"Vike settings"}),`
`,e.jsx("h4",{id:"cli-options",children:"CLI options"}),`
`,e.jsxs(n.p,{children:["You can pass ",e.jsx(s,{href:"/settings",children:"any Vike setting"})," as CLI option, for example:"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"bash","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"bash","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Make development server available over LAN and public addresses"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(n.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(n.span,{style:{color:"#032F62"},children:" dev"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" --host"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Change port"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(n.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(n.span,{style:{color:"#032F62"},children:" preview"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" --port"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" 80"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Change mode"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(n.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(n.span,{style:{color:"#032F62"},children:" build"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" --mode"}),e.jsx(n.span,{style:{color:"#032F62"},children:" staging"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Change pre-render settings"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(n.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(n.span,{style:{color:"#032F62"},children:" build"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" --prerender"}),e.jsx(n.span,{style:{color:"#032F62"},children:' "{parallel:4,noExtraDir:true}"'})]})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["These are all Vike settings: ",e.jsx(s,{href:"/host",noBreadcrumb:!0})," / ",e.jsx(s,{href:"/port",noBreadcrumb:!0})," / ",e.jsx(s,{href:"/mode",noBreadcrumb:!0})," / ",e.jsx(s,{href:"/prerender",noBreadcrumb:!0}),". (Vike aliases some Vite settings for convenience.)"]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["The CLI option value syntax is JavaScript-like, see ",e.jsx(s,{href:"#json5-syntax"}),"."]}),`
`]}),`
`,e.jsxs("h4",{id:"vike-config-environment-variable",children:[e.jsx("code",{children:"VIKE_CONFIG"})," environment variable"]}),`
`,e.jsxs(n.p,{children:["You can also use the ",e.jsx(n.code,{children:"VIKE_CONFIG"})," environment variable, for example:"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"bash","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"bash","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Make development server available over LAN and public addresses"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(n.span,{style:{color:"#032F62"},children:' VIKE_CONFIG="{host:true}"'}),e.jsx(n.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(n.span,{style:{color:"#032F62"},children:" dev"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Also when running Vike's CLI over a package.json script"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(n.span,{style:{color:"#032F62"},children:' VIKE_CONFIG="{prerender:{parallel:4,noExtraDir:true}}"'}),e.jsx(n.span,{style:{color:"#032F62"},children:" npm"}),e.jsx(n.span,{style:{color:"#032F62"},children:" run"}),e.jsx(n.span,{style:{color:"#032F62"},children:" build"})]})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"VIKE_CONFIG"})," value syntax is JavaScript-like, see ",e.jsx(s,{href:"#json5-syntax"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"vite-settings",children:"Vite settings"}),`
`,e.jsx("h4",{id:"cli-options",children:"CLI options"}),`
`,e.jsxs(n.p,{children:["The following ",e.jsx(n.a,{href:"https://vite.dev/guide/cli#options",children:"Vite CLI options"})," are supported:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"--host"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"--mode"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"--port"})}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["These are actually all Vike settings, which alias Vite settings. See: ",e.jsx(s,{href:"/host",noBreadcrumb:!0})," / ",e.jsx(s,{href:"/port",noBreadcrumb:!0})," / ",e.jsx(s,{href:"/mode",noBreadcrumb:!0}),"."]}),`
`]}),`
`,e.jsxs(n.p,{children:["For other Vite settings, use ",e.jsx(n.code,{children:"vite.config.js"})," or ",e.jsx(n.code,{children:"VITE_CONFIG"}),"."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"Reach out if you believe some other Vite setting should also be added the list of CLI options."}),`
`]}),`
`,e.jsxs("h4",{id:"vite-config-environment-variable",children:[e.jsx("code",{children:"VITE_CONFIG"})," environment variable"]}),`
`,e.jsxs(n.p,{children:["You can use the ",e.jsx(n.code,{children:"VITE_CONFIG"})," environment variable to pass ",e.jsx(n.a,{href:"https://vite.dev/config/",children:"any Vite setting"}),", for example:"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"bash","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"bash","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Set Vite's server.host setting to true"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(n.span,{style:{color:"#032F62"},children:' VITE_CONFIG="{server:{host:true}}"'}),e.jsx(n.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(n.span,{style:{color:"#032F62"},children:" dev"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Also when running Vike's CLI over a package.json script"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(n.span,{style:{color:"#032F62"},children:` VITE_CONFIG="{build:{outDir:'build'}}"`}),e.jsx(n.span,{style:{color:"#032F62"},children:" npm"}),e.jsx(n.span,{style:{color:"#032F62"},children:" run"}),e.jsx(n.span,{style:{color:"#032F62"},children:" build"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Also when running Vike's CLI over a package.json script"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(n.span,{style:{color:"#032F62"},children:` VITE_CONFIG="{mode:'staging'}"`}),e.jsx(n.span,{style:{color:"#032F62"},children:" npm"}),e.jsx(n.span,{style:{color:"#032F62"},children:" run"}),e.jsx(n.span,{style:{color:"#032F62"},children:" preview"})]})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"VITE_CONFIG"})," value syntax is JavaScript-like, see ",e.jsx(s,{href:"#json5-syntax"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"json5-syntax",children:"JSON5 syntax"}),`
`,e.jsxs(n.p,{children:["You can set the value of CLI options, ",e.jsx(n.code,{children:"VITE_CONFIG"}),", and ",e.jsx(n.code,{children:"VIKE_CONFIG"})," using JavaScript-like syntax, ",e.jsx(n.a,{href:"https://json.org/example.html",children:"JSON syntax"}),", or ",e.jsx(n.a,{href:"https://json5.org/#example",children:"JSON5 syntax"}),". (Vike uses ",e.jsx(n.a,{href:"https://json5.org",children:"JSON5"})," to parse the values.)"]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/api"}),`
`]}),`
`]})]})}function o(i={}){const{wrapper:n}=i.components||{};return n?e.jsx(n,{...i,children:e.jsx(l,{...i})}):l(i)}const d=Object.freeze(Object.defineProperty({__proto__:null,default:o,pageSectionsExport:a},Symbol.toStringTag,{value:"Module"})),b={serverOnlyHooks:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:t}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:r}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/cli/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:d}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{b as configValuesSerialized};
