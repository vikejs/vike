import{o as t,a as d}from"../chunks/chunk-CxIOOiKX.js";import{j as e}from"../chunks/chunk-B35a6FX-.js";import{L as n}from"../chunks/chunk-BbfG-aTg.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as a}from"../chunks/chunk-CJvpbNqo.js";/* empty css                      *//* empty css                      *//* empty css                      */const o=[{pageSectionId:"vike-settings",pageSectionLevel:2,pageSectionTitle:"Vike settings"},{pageSectionId:"cli-options",pageSectionLevel:4,pageSectionTitle:"CLI options"},{pageSectionId:"vike-config",pageSectionLevel:4,pageSectionTitle:"`VIKE_CONFIG`"},{pageSectionId:"vite-settings",pageSectionLevel:2,pageSectionTitle:"Vite settings"},{pageSectionId:"cli-options",pageSectionLevel:4,pageSectionTitle:"CLI options"},{pageSectionId:"vite-config",pageSectionLevel:4,pageSectionTitle:"`VITE_CONFIG`"},{pageSectionId:"json5-syntax",pageSectionLevel:2,pageSectionTitle:"JSON5 syntax"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function i(l){const s={a:"a",blockquote:"blockquote",code:"code",div:"div",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...a(),...l.components},{ChoiceGroup:r}=s;return r||h("ChoiceGroup"),e.jsxs(e.Fragment,{children:[e.jsx(s.p,{children:"Usage:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"$ vike dev"})," Start development server."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"$ vike build"})," Build for production."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"$ vike preview"})," Start preview server using production build."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"$ vike prerender"})," ",e.jsx(n,{href:"/pre-rendering",children:"Pre-render"})," pages (only needed when ",e.jsx(n,{href:"/prerender#disableautorun",children:e.jsx(s.code,{children:"prerender.disableAutoRun"})})," is ",e.jsx(s.code,{children:"true"}),")."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"$ vike -v"})," Print Vike's version."]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:e.jsx(s.strong,{children:"Can I use Vite's CLI instead?"})}),`
`,e.jsx(s.p,{children:"Yes, you can — Vike has full-fledged support for third-party CLIs (Vite, Vitest, Storybook, ...)."}),`
`,e.jsxs(s.p,{children:["That said, we generally recommend using Vike's CLI for better DX. For example, you can pass Vike-specific settings like ",e.jsx(s.code,{children:"$ vike build --prerender false"})," which isn't supported by third-party CLIs."]}),`
`]}),`
`,e.jsx("h2",{id:"vike-settings",children:"Vike settings"}),`
`,e.jsx("h4",{id:"cli-options",children:"CLI options"}),`
`,e.jsxs(s.p,{children:["You can pass ",e.jsx(n,{href:"/settings",children:"any Vike setting"})," to the CLI, for example:"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"bash","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"bash","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Make development server available over LAN and public addresses"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(s.span,{style:{color:"#032F62"},children:" dev"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" --host"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Change port"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(s.span,{style:{color:"#032F62"},children:" preview"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" --port"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" 80"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Change mode"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(s.span,{style:{color:"#032F62"},children:" build"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" --mode"}),e.jsx(s.span,{style:{color:"#032F62"},children:" staging"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Change pre-render settings"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(s.span,{style:{color:"#032F62"},children:" build"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" --prerender"}),e.jsx(s.span,{style:{color:"#032F62"},children:' "{parallel:4,noExtraDir:true}"'})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Disable Vite's cache"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(s.span,{style:{color:"#032F62"},children:" dev"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" --force"})]})]})})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["These are Vike settings, see ",e.jsx(n,{href:"/host",noBreadcrumb:!0}),"/",e.jsx(n,{href:"/port",noBreadcrumb:!0}),"/",e.jsx(n,{href:"/mode",noBreadcrumb:!0}),"/",e.jsx(n,{href:"/prerender",noBreadcrumb:!0}),"/",e.jsx(n,{href:"/force",noBreadcrumb:!0}),". Note that that Vike aliases some Vite settings for convenience, see ",e.jsx(n,{href:"#vite-settings"}),"."]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["You can set values using JavaScript(-like) syntax (see ",e.jsx(n,{href:"#json5-syntax"}),")."]}),`
`]}),`
`,e.jsx("h4",{id:"vike-config",children:e.jsx("code",{children:"VIKE_CONFIG"})}),`
`,e.jsxs(s.p,{children:["You can also use the ",e.jsx(s.code,{children:"VIKE_CONFIG"})," environment variable, for example:"]}),`
`,e.jsxs(r,{choiceGroup:{name:"pkgManager",choices:["npm","pnpm","Bun","Yarn"],default:"npm",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"npm",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"shell","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"shell","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Make development server available over LAN and public addresses"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:' VIKE_CONFIG="{host:true}"'}),e.jsx(s.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(s.span,{style:{color:"#032F62"},children:" dev"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Also when running Vike's CLI over a package.json script"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:' VIKE_CONFIG="{prerender:{parallel:4,noExtraDir:true}}"'}),e.jsx(s.span,{style:{color:"#032F62"},children:" npm"}),e.jsx(s.span,{style:{color:"#032F62"},children:" run"}),e.jsx(s.span,{style:{color:"#032F62"},children:" build"})]})]})})})}),e.jsx(s.div,{"data-choice-value":"pnpm",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"shell","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"shell","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Make development server available over LAN and public addresses"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:' VIKE_CONFIG="{host:true}"'}),e.jsx(s.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(s.span,{style:{color:"#032F62"},children:" dev"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Also when running Vike's CLI over a package.json script"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:' VIKE_CONFIG="{prerender:{parallel:4,noExtraDir:true}}"'}),e.jsx(s.span,{style:{color:"#032F62"},children:" pnpm"}),e.jsx(s.span,{style:{color:"#032F62"},children:" run"}),e.jsx(s.span,{style:{color:"#032F62"},children:" build"})]})]})})})}),e.jsx(s.div,{"data-choice-value":"Bun",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"shell","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"shell","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Make development server available over LAN and public addresses"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:' VIKE_CONFIG="{host:true}"'}),e.jsx(s.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(s.span,{style:{color:"#032F62"},children:" dev"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Also when running Vike's CLI over a package.json script"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:' VIKE_CONFIG="{prerender:{parallel:4,noExtraDir:true}}"'}),e.jsx(s.span,{style:{color:"#032F62"},children:" bun"}),e.jsx(s.span,{style:{color:"#032F62"},children:" run"}),e.jsx(s.span,{style:{color:"#032F62"},children:" build"})]})]})})})}),e.jsx(s.div,{"data-choice-value":"Yarn",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"shell","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"shell","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Make development server available over LAN and public addresses"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:' VIKE_CONFIG="{host:true}"'}),e.jsx(s.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(s.span,{style:{color:"#032F62"},children:" dev"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Also when running Vike's CLI over a package.json script"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:' VIKE_CONFIG="{prerender:{parallel:4,noExtraDir:true}}"'}),e.jsx(s.span,{style:{color:"#032F62"},children:" yarn"}),e.jsx(s.span,{style:{color:"#032F62"},children:" build"})]})]})})})})]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["You can set ",e.jsx(s.code,{children:"VIKE_CONFIG"})," using JavaScript(-like) syntax (see ",e.jsx(n,{href:"#json5-syntax"}),")."]}),`
`]}),`
`,e.jsx("h2",{id:"vite-settings",children:"Vite settings"}),`
`,e.jsx("h4",{id:"cli-options",children:"CLI options"}),`
`,e.jsxs(s.p,{children:["Vike's CLI supports the following ",e.jsx(s.a,{href:"https://vite.dev/guide/cli#options",children:"Vite CLI options"}),":"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.code,{children:"--host"})}),`
`,e.jsx(s.li,{children:e.jsx(s.code,{children:"--mode"})}),`
`,e.jsx(s.li,{children:e.jsx(s.code,{children:"--port"})}),`
`,e.jsx(s.li,{children:e.jsx(s.code,{children:"--force"})}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["Each of these is a Vike setting that aliases a Vite setting (see ",e.jsx(n,{href:"/host",noBreadcrumb:!0}),"/",e.jsx(n,{href:"/mode",noBreadcrumb:!0}),"/",e.jsx(n,{href:"/port",noBreadcrumb:!0}),"/",e.jsx(n,{href:"/force",noBreadcrumb:!0}),"). Each Vike CLI option sets a ",e.jsx(n,{href:"/settings",children:"Vike setting"}),"."]}),`
`,e.jsx(s.p,{children:"Reach out if you believe some other Vite settings should also be aliased."}),`
`]}),`
`,e.jsxs(s.p,{children:["For other Vite settings, use ",e.jsx(s.code,{children:"vite.config.js"})," or ",e.jsx(s.code,{children:"VITE_CONFIG"}),"."]}),`
`,e.jsx("h4",{id:"vite-config",children:e.jsx("code",{children:"VITE_CONFIG"})}),`
`,e.jsxs(s.p,{children:["You can use the ",e.jsx(s.code,{children:"VITE_CONFIG"})," environment variable to pass ",e.jsx(s.a,{href:"https://vite.dev/config/",children:"Vite settings"}),", for example:"]}),`
`,e.jsxs(r,{choiceGroup:{name:"pkgManager",choices:["npm","pnpm","Bun","Yarn"],default:"npm",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"npm",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"shell","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"shell","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Set Vite's server.host setting to true"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:' VITE_CONFIG="{server:{host:true}}"'}),e.jsx(s.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(s.span,{style:{color:"#032F62"},children:" dev"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Also when running Vike's CLI over a package.json script"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:` VITE_CONFIG="{build:{outDir:'build'}}"`}),e.jsx(s.span,{style:{color:"#032F62"},children:" npm"}),e.jsx(s.span,{style:{color:"#032F62"},children:" run"}),e.jsx(s.span,{style:{color:"#032F62"},children:" build"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Also when running Vike's CLI over a package.json script"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:` VITE_CONFIG="{mode:'staging'}"`}),e.jsx(s.span,{style:{color:"#032F62"},children:" npm"}),e.jsx(s.span,{style:{color:"#032F62"},children:" run"}),e.jsx(s.span,{style:{color:"#032F62"},children:" preview"})]})]})})})}),e.jsx(s.div,{"data-choice-value":"pnpm",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"shell","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"shell","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Set Vite's server.host setting to true"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:' VITE_CONFIG="{server:{host:true}}"'}),e.jsx(s.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(s.span,{style:{color:"#032F62"},children:" dev"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Also when running Vike's CLI over a package.json script"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:` VITE_CONFIG="{build:{outDir:'build'}}"`}),e.jsx(s.span,{style:{color:"#032F62"},children:" pnpm"}),e.jsx(s.span,{style:{color:"#032F62"},children:" run"}),e.jsx(s.span,{style:{color:"#032F62"},children:" build"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Also when running Vike's CLI over a package.json script"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:` VITE_CONFIG="{mode:'staging'}"`}),e.jsx(s.span,{style:{color:"#032F62"},children:" pnpm"}),e.jsx(s.span,{style:{color:"#032F62"},children:" run"}),e.jsx(s.span,{style:{color:"#032F62"},children:" preview"})]})]})})})}),e.jsx(s.div,{"data-choice-value":"Bun",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"shell","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"shell","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Set Vite's server.host setting to true"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:' VITE_CONFIG="{server:{host:true}}"'}),e.jsx(s.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(s.span,{style:{color:"#032F62"},children:" dev"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Also when running Vike's CLI over a package.json script"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:` VITE_CONFIG="{build:{outDir:'build'}}"`}),e.jsx(s.span,{style:{color:"#032F62"},children:" bun"}),e.jsx(s.span,{style:{color:"#032F62"},children:" run"}),e.jsx(s.span,{style:{color:"#032F62"},children:" build"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Also when running Vike's CLI over a package.json script"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:` VITE_CONFIG="{mode:'staging'}"`}),e.jsx(s.span,{style:{color:"#032F62"},children:" bun"}),e.jsx(s.span,{style:{color:"#032F62"},children:" run"}),e.jsx(s.span,{style:{color:"#032F62"},children:" preview"})]})]})})})}),e.jsx(s.div,{"data-choice-value":"Yarn",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"shell","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"shell","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Set Vite's server.host setting to true"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:' VITE_CONFIG="{server:{host:true}}"'}),e.jsx(s.span,{style:{color:"#032F62"},children:" vike"}),e.jsx(s.span,{style:{color:"#032F62"},children:" dev"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Also when running Vike's CLI over a package.json script"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:` VITE_CONFIG="{build:{outDir:'build'}}"`}),e.jsx(s.span,{style:{color:"#032F62"},children:" yarn"}),e.jsx(s.span,{style:{color:"#032F62"},children:" build"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Also when running Vike's CLI over a package.json script"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:` VITE_CONFIG="{mode:'staging'}"`}),e.jsx(s.span,{style:{color:"#032F62"},children:" yarn"}),e.jsx(s.span,{style:{color:"#032F62"},children:" preview"})]})]})})})})]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["You can set ",e.jsx(s.code,{children:"VITE_CONFIG"})," using JavaScript(-like) syntax (see ",e.jsx(n,{href:"#json5-syntax"}),")."]}),`
`]}),`
`,e.jsx("h2",{id:"json5-syntax",children:"JSON5 syntax"}),`
`,e.jsxs(s.p,{children:["Vike uses ",e.jsx(s.a,{href:"https://json5.org",children:"JSON5"})," to parse the values of Vike's CLI options and the values of the environment variables ",e.jsx(s.code,{children:"VITE_CONFIG"})," and ",e.jsx(s.code,{children:"VIKE_CONFIG"}),"."]}),`
`,e.jsxs(s.p,{children:["It's a ",e.jsx(s.a,{href:"https://json.org",children:"JSON"})," extension that supports:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Standard ",e.jsx(s.a,{href:"https://json.org/example.html",children:"JSON syntax"})]}),`
`,e.jsxs(s.li,{children:["JavaScript-like syntax",`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["For example ",e.jsx(s.code,{children:"{someProp:'someVal'}"})," is valid JSON5 (it isn't valid ",e.jsx(s.code,{children:"JSON"}),")."]}),`
`]}),`
`]}),`
`,e.jsxs(s.li,{children:["Extra ",e.jsx(s.a,{href:"https://json5.org/#example",children:"JSON5 features"}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["For example comments — the following is valid JSON5 (it isn't valid ",e.jsx(s.code,{children:"JSON"}),"):"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"json5","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"json5","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// Some comment"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"{"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:'   "someProp"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"someVal"'})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`]}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/api"}),`
`]}),`
`]})]})}function c(l={}){const{wrapper:s}={...a(),...l.components};return s?e.jsx(s,{...l,children:e.jsx(i,{...l})}):i(l)}function h(l,s){throw new Error("Expected component `"+l+"` to be defined: you likely forgot to import, pass, or provide it.")}const p=Object.freeze(Object.defineProperty({__proto__:null,default:c,pageSectionsExport:o},Symbol.toStringTag,{value:"Module"})),A={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:d}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:t}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/cli/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:p}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{A as configValuesSerialized};
