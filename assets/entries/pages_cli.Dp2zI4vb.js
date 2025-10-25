import{o as t,a}from"../chunks/chunk-C8N046DI.js";import{j as e}from"../chunks/chunk-Ch0sRy5R.js";import{L as s}from"../chunks/chunk-cySdRfqv.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as r}from"../chunks/chunk-CRr9echR.js";/* empty css                      *//* empty css                      */const o=[{pageSectionId:"vike-settings",pageSectionLevel:2,pageSectionTitle:"Vike settings"},{pageSectionId:"cli-options",pageSectionLevel:4,pageSectionTitle:"CLI options"},{pageSectionId:"vike-config",pageSectionLevel:4,pageSectionTitle:"`VIKE_CONFIG`"},{pageSectionId:"vite-settings",pageSectionLevel:2,pageSectionTitle:"Vite settings"},{pageSectionId:"cli-options",pageSectionLevel:4,pageSectionTitle:"CLI options"},{pageSectionId:"vite-config",pageSectionLevel:4,pageSectionTitle:"`VITE_CONFIG`"},{pageSectionId:"json5-syntax",pageSectionLevel:2,pageSectionTitle:"JSON5 syntax"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function l(i){const n={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...r(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.p,{children:"Usage:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"$ vike dev"})," Start development server."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"$ vike build"})," Build for production."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"$ vike preview"})," Start preview server using production build."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"$ vike prerender"})," ",e.jsx(s,{href:"/pre-rendering",children:"Pre-render"})," pages (only needed when ",e.jsx(s,{href:"/prerender#disableautorun",children:e.jsx(n.code,{children:"prerender.disableAutoRun"})})," is ",e.jsx(n.code,{children:"true"}),")."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"$ vike -v"})," Print Vike's version."]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Can I use Vite's CLI instead?"})}),`
`,e.jsx(n.p,{children:"Yes, you can — Vike has full-fledged support for third-party CLIs (Vite, Vitest, Storybook, ...)."}),`
`,e.jsxs(n.p,{children:["That said, we generally recommend using Vike's CLI for better DX. For example, you can pass Vike-specific settings like ",e.jsx(n.code,{children:"$ vike build --prerender false"})," which isn't supported by third-party CLIs."]}),`
`]}),`
`,e.jsx("h2",{id:"vike-settings",children:"Vike settings"}),`
`,e.jsx("h4",{id:"cli-options",children:"CLI options"}),`
`,e.jsxs(n.p,{children:["You can pass ",e.jsx(s,{href:"/settings",children:"any Vike setting"})," to the CLI, for example:"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"bash","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"bash","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Make development server available over LAN and public addresses"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(n.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(n.span,{style:{color:"#032F62"},children:" dev"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" --host"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Change port"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(n.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(n.span,{style:{color:"#032F62"},children:" preview"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" --port"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" 80"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Change mode"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(n.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(n.span,{style:{color:"#032F62"},children:" build"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" --mode"}),e.jsx(n.span,{style:{color:"#032F62"},children:" staging"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Change pre-render settings"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(n.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(n.span,{style:{color:"#032F62"},children:" build"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" --prerender"}),e.jsx(n.span,{style:{color:"#032F62"},children:' "{parallel:4,noExtraDir:true}"'})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Disable Vite's cache"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(n.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(n.span,{style:{color:"#032F62"},children:" dev"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" --force"})]})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["These are all Vike settings: ",e.jsx(s,{href:"/host",noBreadcrumb:!0}),"/",e.jsx(s,{href:"/port",noBreadcrumb:!0}),"/",e.jsx(s,{href:"/mode",noBreadcrumb:!0}),"/",e.jsx(s,{href:"/prerender",noBreadcrumb:!0}),"/",e.jsx(s,{href:"/force",noBreadcrumb:!0})," — note that Vike aliases some Vite settings for convenience, see ",e.jsx(s,{href:"#vite-settings"}),"."]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["You can set values using JavaScript(-like) syntax (see ",e.jsx(s,{href:"#json5-syntax"}),")."]}),`
`]}),`
`,e.jsx("h4",{id:"vike-config",children:e.jsx("code",{children:"VIKE_CONFIG"})}),`
`,e.jsxs(n.p,{children:["You can also use the ",e.jsx(n.code,{children:"VIKE_CONFIG"})," environment variable, for example:"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"bash","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"bash","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Make development server available over LAN and public addresses"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(n.span,{style:{color:"#032F62"},children:' VIKE_CONFIG="{host:true}"'}),e.jsx(n.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(n.span,{style:{color:"#032F62"},children:" dev"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Also when running Vike's CLI over a package.json script"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(n.span,{style:{color:"#032F62"},children:' VIKE_CONFIG="{prerender:{parallel:4,noExtraDir:true}}"'}),e.jsx(n.span,{style:{color:"#032F62"},children:" npm"}),e.jsx(n.span,{style:{color:"#032F62"},children:" run"}),e.jsx(n.span,{style:{color:"#032F62"},children:" build"})]})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["You can set ",e.jsx(n.code,{children:"VIKE_CONFIG"})," using JavaScript(-like) syntax (see ",e.jsx(s,{href:"#json5-syntax"}),")."]}),`
`]}),`
`,e.jsx("h2",{id:"vite-settings",children:"Vite settings"}),`
`,e.jsx("h4",{id:"cli-options",children:"CLI options"}),`
`,e.jsxs(n.p,{children:["Vike's CLI supports following ",e.jsx(n.a,{href:"https://vite.dev/guide/cli#options",children:"Vite CLI options"}),":"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"--host"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"--mode"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"--port"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"--force"})}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["These are Vike settings that alias Vite settings (see ",e.jsx(s,{href:"/host",noBreadcrumb:!0}),"/",e.jsx(s,{href:"/mode",noBreadcrumb:!0}),"/",e.jsx(s,{href:"/port",noBreadcrumb:!0}),"/",e.jsx(s,{href:"/force",noBreadcrumb:!0}),"). Each Vike CLI option corresponds to a ",e.jsx(s,{href:"/settings",children:"Vike setting"}),"."]}),`
`,e.jsx(n.p,{children:"Reach out if you believe some other Vite settings should also be aliased."}),`
`]}),`
`,e.jsxs(n.p,{children:["For other Vite settings, use ",e.jsx(n.code,{children:"vite.config.js"})," or ",e.jsx(n.code,{children:"VITE_CONFIG"}),"."]}),`
`,e.jsx("h4",{id:"vite-config",children:e.jsx("code",{children:"VITE_CONFIG"})}),`
`,e.jsxs(n.p,{children:["You can use the ",e.jsx(n.code,{children:"VITE_CONFIG"})," environment variable to pass ",e.jsx(n.a,{href:"https://vite.dev/config/",children:"Vite settings"}),", for example:"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"bash","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"bash","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Set Vite's server.host setting to true"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(n.span,{style:{color:"#032F62"},children:' VITE_CONFIG="{server:{host:true}}"'}),e.jsx(n.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(n.span,{style:{color:"#032F62"},children:" dev"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Also when running Vike's CLI over a package.json script"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(n.span,{style:{color:"#032F62"},children:` VITE_CONFIG="{build:{outDir:'build'}}"`}),e.jsx(n.span,{style:{color:"#032F62"},children:" npm"}),e.jsx(n.span,{style:{color:"#032F62"},children:" run"}),e.jsx(n.span,{style:{color:"#032F62"},children:" build"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Also when running Vike's CLI over a package.json script"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(n.span,{style:{color:"#032F62"},children:` VITE_CONFIG="{mode:'staging'}"`}),e.jsx(n.span,{style:{color:"#032F62"},children:" npm"}),e.jsx(n.span,{style:{color:"#032F62"},children:" run"}),e.jsx(n.span,{style:{color:"#032F62"},children:" preview"})]})]})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["You can set ",e.jsx(n.code,{children:"VITE_CONFIG"})," using JavaScript(-like) syntax (see ",e.jsx(s,{href:"#json5-syntax"}),")."]}),`
`]}),`
`,e.jsx("h2",{id:"json5-syntax",children:"JSON5 syntax"}),`
`,e.jsxs(n.p,{children:["Vike uses ",e.jsx(n.a,{href:"https://json5.org",children:"JSON5"})," to parse the values of Vike's CLI options and the values of the environment variables ",e.jsx(n.code,{children:"VITE_CONFIG"})," and ",e.jsx(n.code,{children:"VIKE_CONFIG"}),"."]}),`
`,e.jsxs(n.p,{children:["It's a ",e.jsx(n.a,{href:"https://json.org",children:"JSON"})," extension that supports:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Standard ",e.jsx(n.a,{href:"https://json.org/example.html",children:"JSON syntax"})]}),`
`,e.jsxs(n.li,{children:["JavaScript-like syntax",`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["For example ",e.jsx(n.code,{children:"{someProp:'someVal'}"})," is valid JSON5 (it isn't valid ",e.jsx(n.code,{children:"JSON"}),")."]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:["Extra ",e.jsx(n.a,{href:"https://json5.org/#example",children:"JSON5 features"}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["For example comments — the following is valid JSON5 (it isn't valid ",e.jsx(n.code,{children:"JSON"}),"):"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"json5","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"json5","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Some comment"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"{"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#032F62"},children:'   "someProp"'}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#032F62"},children:'"someVal"'})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`]}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/api"}),`
`]}),`
`]})]})}function d(i={}){const{wrapper:n}={...r(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(l,{...i})}):l(i)}const c=Object.freeze(Object.defineProperty({__proto__:null,default:d,pageSectionsExport:o},Symbol.toStringTag,{value:"Module"})),I={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:a}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:t}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/cli/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:c}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{I as configValuesSerialized};
