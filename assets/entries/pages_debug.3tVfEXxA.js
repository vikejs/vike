import{o as i,a as o}from"../chunks/chunk-CuuRH9a_.js";import{j as e}from"../chunks/chunk-D3FsxVgn.js";import{L as l}from"../chunks/chunk-CKfDXA66.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */const a=[{pageSectionId:"verbose-errors",pageSectionLevel:2,pageSectionTitle:"Verbose errors"},{pageSectionId:"digging-into-node-modules",pageSectionLevel:2,pageSectionTitle:"Digging into `node_modules/`"},{pageSectionId:"digging-into-dist-client",pageSectionLevel:2,pageSectionTitle:"Digging into `dist/client/`"},{pageSectionId:"debug-flags",pageSectionLevel:2,pageSectionTitle:"Debug flags"},{pageSectionId:"vike-flags",pageSectionLevel:3,pageSectionTitle:"Vike flags"},{pageSectionId:"vite-flags",pageSectionLevel:3,pageSectionTitle:"Vite flags"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function r(n){const s={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...n.components};return e.jsxs(e.Fragment,{children:[e.jsxs(s.p,{children:["In general, if you run into any issues with Vike, we recommend that you ",e.jsx(l,{href:"/faq#how-can-i-reach-out-for-help",children:"reach out to us"}),"."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"If you report a Vike bug, then we quickly fix it (usually within 24 hours)."}),`
`]}),`
`,e.jsx(s.p,{children:"That said, you can also dig into issues yourself."}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"In some situations, you may want to dig into a problem yourself. For example, in the rare case we ask you to provide a minimal reproduction, it might actually be quicker to dig into Vike's source code instead."}),`
`]}),`
`,e.jsx("h2",{id:"verbose-errors",children:"Verbose errors"}),`
`,e.jsxs(s.p,{children:["Vike prettifies transpilation errors, such as errors thrown by ",e.jsx(s.a,{href:"https://esbuild.github.io/",children:"esbuild"})," and ",e.jsx(s.a,{href:"https://babeljs.io/",children:"Babel"}),"."]}),`
`,e.jsxs(s.p,{children:["While Vike is careful about not removing relevant information, it may mistakenly do so. In that case ",e.jsx(s.a,{href:"https://github.com/vikejs/vike/issues/new",children:"create a new GitHub issue"}),". Until a Vike maintainer fixes the issue you can use the debug flag ",e.jsx(s.code,{children:"DEBUG=vike:error"}),"."]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"shell","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"shell","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# - Show verbose original errors"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# - Show infinite stack traces (`Error.stackTraceLimit = Infinity`)"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"DEBUG"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:"vike:error"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" npm"}),e.jsx(s.span,{style:{color:"#032F62"},children:" run"}),e.jsx(s.span,{style:{color:"#032F62"},children:" dev"})]})]})})}),`
`,e.jsx(s.p,{children:"For even more information:"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"shell","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"shell","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Usually only used by Vike maintainers"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"DEBUG"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:"vike:error,vike:log"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" npm"}),e.jsx(s.span,{style:{color:"#032F62"},children:" run"}),e.jsx(s.span,{style:{color:"#032F62"},children:" dev"})]})]})})}),`
`,e.jsxs("h2",{id:"digging-into-node-modules",children:["Digging into ",e.jsx("code",{children:"node_modules/"})]}),`
`,e.jsx(s.p,{children:"The quickest way to dig into Vike is by:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Directly modifying the built code at ",e.jsx(s.code,{children:"node_modules/vike/dist/esm/**/*.js"}),", for example to:",`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Inject ",e.jsx(s.code,{children:"console.log()"})," to gather insights."]}),`
`,e.jsx(s.li,{children:"Try to fix the bug."}),`
`]}),`
`]}),`
`,e.jsxs(s.li,{children:["Reading the TypeScript source code (",e.jsx(s.code,{children:"$ git clone git@github.com:vikejs/vike"}),"), to understand how the code works."]}),`
`]}),`
`,e.jsxs(s.p,{children:["The trick here is to directly modify the built code at ",e.jsx(s.code,{children:"node_modules/"}),", while using the TypeScript source code to navigate and read code."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["We recommend directly manipulating ",e.jsx(s.code,{children:"node_modules/vike/dist/esm/**/*.js"})," because it's simpler and quicker than building Vike. That said, you can also build and then link Vike:"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"bash","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"bash","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:" git"}),e.jsx(s.span,{style:{color:"#032F62"},children:" clone"}),e.jsx(s.span,{style:{color:"#032F62"},children:" git@github.com:vikejs/vike"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:" cd"}),e.jsx(s.span,{style:{color:"#032F62"},children:" vike/"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:" pnpm"}),e.jsx(s.span,{style:{color:"#032F62"},children:" install"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:" pnpm"}),e.jsx(s.span,{style:{color:"#032F62"},children:" run"}),e.jsx(s.span,{style:{color:"#032F62"},children:" dev"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:" cd"}),e.jsx(s.span,{style:{color:"#032F62"},children:" ../my-app/"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"$"}),e.jsx(s.span,{style:{color:"#032F62"},children:" pnpm"}),e.jsx(s.span,{style:{color:"#032F62"},children:" link"}),e.jsx(s.span,{style:{color:"#032F62"},children:" ../vike/packages/vike/"})]})]})})}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"It may sound scary to dig into foreign source code, but it's sometimes quicker to find the root cause of your problem than treating Vike as a black box. Also:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"It's more interesting. (Open Source is usually well-written and pleasurable to read.)"}),`
`,e.jsx(s.li,{children:"You may end up being able to make a PR solving your problem and help the whole community."}),`
`]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"We recommend this practice not only for Vike, but also for other tools such as Vite."}),`
`]}),`
`,e.jsxs("h2",{id:"digging-into-dist-client",children:["Digging into ",e.jsx("code",{children:"dist/client/"})]}),`
`,e.jsxs(s.p,{children:["By default, the client-side code in ",e.jsx(s.code,{children:"dist/client/"})," is minified, which makes debugging difficult. You can temporarily disable minification:"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// vite.config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  build: { minify: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"false"}),e.jsx(s.span,{style:{color:"#24292E"},children:" },"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // ..."})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(s.p,{children:["You can then easily trace back where code in ",e.jsx(s.code,{children:"dist/client/"})," originates from:"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// dist/client/assets/entries/pages_about.DrVcZv1W.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { j "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"as"}),e.jsx(s.span,{style:{color:"#24292E"},children:" jsxRuntimeExports } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:' "../chunks/chunk-BXiwBnjM.js"'}),e.jsx(s.span,{style:{color:"#24292E"},children:";"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { i "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"as"}),e.jsx(s.span,{style:{color:"#24292E"},children:" isBrowser, a "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"as"}),e.jsx(s.span,{style:{color:"#24292E"},children:" assertClientRouting } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:' "../chunks/chunk-CSn_bGv_.js"'}),e.jsx(s.span,{style:{color:"#24292E"},children:";"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"/*! /home/rom/code/vike/packages/vike/dist/esm/shared/route/utils.js [vike:pluginModuleBanner] */"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"if"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"isBrowser"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()) {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"  assertClientRouting"}),e.jsx(s.span,{style:{color:"#24292E"},children:"();"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"/*! pages/about/+Page.jsx [vike:pluginModuleBanner] */"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Page"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" /* @__PURE__ */"}),e.jsx(s.span,{style:{color:"#24292E"},children:" jsxRuntimeExports."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"jsxs"}),e.jsx(s.span,{style:{color:"#24292E"},children:"(jsxRuntimeExports.Fragment, { children: ["})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6A737D"},children:"    /* @__PURE__ */"}),e.jsx(s.span,{style:{color:"#24292E"},children:" jsxRuntimeExports."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"jsx"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:'"h1"'}),e.jsx(s.span,{style:{color:"#24292E"},children:", { children: "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"About"'}),e.jsx(s.span,{style:{color:"#24292E"},children:" }),"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6A737D"},children:"    /* @__PURE__ */"}),e.jsx(s.span,{style:{color:"#24292E"},children:" jsxRuntimeExports."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"jsx"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:'"p"'}),e.jsx(s.span,{style:{color:"#24292E"},children:", { children: "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"Example of using Vike."'}),e.jsx(s.span,{style:{color:"#24292E"},children:" })"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  ] });"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" import2"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#6A737D"},children:" /* @__PURE__ */"}),e.jsx(s.span,{style:{color:"#24292E"},children:" Object."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"freeze"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#6A737D"},children:"/* @__PURE__ */"}),e.jsx(s.span,{style:{color:"#24292E"},children:" Object."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"defineProperty"}),e.jsx(s.span,{style:{color:"#24292E"},children:"({"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  __proto__: "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"null"}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  default: Page"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"}, Symbol.toStringTag, { value: "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"Module"'}),e.jsx(s.span,{style:{color:"#24292E"},children:" }));"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"/*! virtual:vike:pageConfigValuesAll:client:/pages/about [vike:pluginModuleBanner] */"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" configValuesSerialized"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  ["}),e.jsx(s.span,{style:{color:"#032F62"},children:'"Page"'}),e.jsx(s.span,{style:{color:"#24292E"},children:"]: {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    type: "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"standard"'}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    definedAtData: { "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"filePathToShowToUser"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"/pages/about/+Page.jsx"'}),e.jsx(s.span,{style:{color:"#24292E"},children:" },"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    valueSerialized: {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"      type: "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"plus-file"'}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"      exportValues: import2"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"};"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  configValuesSerialized"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"};"})})]})})}),`
`,e.jsx("h2",{id:"debug-flags",children:"Debug flags"}),`
`,e.jsx("h3",{id:"vike-flags",children:"Vike flags"}),`
`,e.jsx(s.p,{children:"You can use Vike's debug flags to gather insights."}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"shell","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"shell","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Verbose errors"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"DEBUG"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:"vike:error"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" npm"}),e.jsx(s.span,{style:{color:"#032F62"},children:" run"}),e.jsx(s.span,{style:{color:"#032F62"},children:" dev"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Inspect where logs come from (also non-Vike logs)"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"DEBUG"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:"vike:log"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" npm"}),e.jsx(s.span,{style:{color:"#032F62"},children:" run"}),e.jsx(s.span,{style:{color:"#032F62"},children:" dev"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Inspect Vike's routing"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"DEBUG"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:"vike:routing"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" npm"}),e.jsx(s.span,{style:{color:"#032F62"},children:" run"}),e.jsx(s.span,{style:{color:"#032F62"},children:" dev"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Inspect HTTP Streaming"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"DEBUG"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:"vike:stream"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" npm"}),e.jsx(s.span,{style:{color:"#032F62"},children:" run"}),e.jsx(s.span,{style:{color:"#032F62"},children:" dev"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Inspect Vike's crawling of + files"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"DEBUG"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:"vike:crawl"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" npm"}),e.jsx(s.span,{style:{color:"#032F62"},children:" run"}),e.jsx(s.span,{style:{color:"#032F62"},children:" dev"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# Enabling multiple debug flags"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"DEBUG"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:"vike:log,vike:error"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" npm"}),e.jsx(s.span,{style:{color:"#032F62"},children:" run"}),e.jsx(s.span,{style:{color:"#032F62"},children:" dev"})]})]})})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["Most debug flags also work for build (e.g. ",e.jsx(s.code,{children:"$ DEBUG=vike:error npm run build"}),") and production (e.g. ",e.jsx(s.code,{children:"$ DEBUG=vike:log node dist/server/index.mjs"}),")."]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["There are ",e.jsx(s.a,{href:"https://github.com/vikejs/vike/blob/main/packages/vike/utils/debug.ts",children:"more debug flags"})," but note that they are meant for Vike maintainers. Feel free to reach out if you want more debug logs."]}),`
`]}),`
`,e.jsx("h3",{id:"vite-flags",children:"Vite flags"}),`
`,e.jsx(s.p,{children:"Enable and discover all Vite debug flags:"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"shell","data-theme":"github-light",children:e.jsx(s.code,{"data-language":"shell","data-theme":"github-light",style:{display:"grid"},children:e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"DEBUG"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:"vite:"}),e.jsx(s.span,{style:{color:"#005CC5"},children:"*"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" npm"}),e.jsx(s.span,{style:{color:"#032F62"},children:" run"}),e.jsx(s.span,{style:{color:"#032F62"},children:" dev"})]})})})}),`
`,e.jsxs(s.p,{children:["You can then cherry-pick a debug flag e.g. ",e.jsx(s.code,{children:"$ DEBUG=vite:deps npm run dev"}),"."]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{href:"/error-tracking"}),`
`]}),`
`]})]})}function t(n={}){const{wrapper:s}=n.components||{};return s?e.jsx(s,{...n,children:e.jsx(r,{...n})}):r(n)}const c=Object.freeze(Object.defineProperty({__proto__:null,default:t,pageSectionsExport:a},Symbol.toStringTag,{value:"Module"})),k={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:i}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/debug/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:c}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{k as configValuesSerialized};
