import{o as r,a as t}from"../chunks/chunk-CxIOOiKX.js";import{j as e}from"../chunks/chunk-B35a6FX-.js";import{L as n}from"../chunks/chunk-BbfG-aTg.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as o}from"../chunks/chunk-CJvpbNqo.js";/* empty css                      *//* empty css                      *//* empty css                      */const d=[{pageSectionId:"vite-config-js",pageSectionLevel:2,pageSectionTitle:"`vite.config.js`"},{pageSectionId:"tsconfig-json",pageSectionLevel:2,pageSectionTitle:"`tsconfig.json`"},{pageSectionId:"package-json",pageSectionLevel:2,pageSectionTitle:"`package.json`"},{pageSectionId:"config-files",pageSectionLevel:2,pageSectionTitle:"Config files"}];function a(i){const s={a:"a",blockquote:"blockquote",code:"code",div:"div",em:"em",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...o(),...i.components},{ChoiceGroup:l}=s;return l||h("ChoiceGroup"),e.jsxs(e.Fragment,{children:[e.jsx(s.p,{children:"Instead of using relative import paths, which can be cumbersome, you can use path aliases. For example:"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(s.span,{className:"diff remove","data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Counter } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" '../../../../components/Counter'"})]}),`
`,e.jsxs(s.span,{className:"diff add","data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Counter } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" '#root/components/Counter'"})]})]})})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["We recommend following ",e.jsx(s.a,{href:"https://nodejs.org/api/packages.html#subpath-imports:~:text=must%20always%20start%20with%20%23%20to%20ensure%20they%20are%20disambiguated%20from%20external%20package%20specifiers",children:"the Node.js convention"})," to always prefix path aliases with the special character ",e.jsx(s.code,{children:"#"}),"."]}),`
`]}),`
`,e.jsxs(s.p,{children:["If you use ",e.jsx(s.strong,{children:"JavaScript"}),", define your path aliases at:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsxs(n,{href:"#vite-config-js",children:[e.jsx(s.code,{children:"vite.config.ts"})," > ",e.jsx(s.code,{children:"resolve.alias"})]}),`
`]}),`
`]}),`
`,e.jsxs(s.p,{children:["If you use ",e.jsx(s.strong,{children:"TypeScript"}),", you must define your path aliases also at:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsxs(n,{href:"#tsconfig-json",children:[e.jsx(s.code,{children:"tsconfig.json"})," > ",e.jsx(s.code,{children:"compilerOptions.paths"})]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["You must define them twice — inside ",e.jsx(s.code,{children:"vite.config.js"})," ",e.jsx(s.em,{children:"and"})," ",e.jsx(s.code,{children:"tsconfig.json"}),". (It's temporary: ",e.jsxs(s.a,{href:"https://github.com/vikejs/vike/issues/1547#issuecomment-3085232187",children:["Vite will soon support path aliases set in ",e.jsx(s.code,{children:"tsconfig.json"})]}),".)"]}),`
`]}),`
`]}),`
`]}),`
`,e.jsxs(s.p,{children:["If you use a custom server integration (",e.jsxs(s.strong,{children:["you don't use ",e.jsx(s.code,{children:"vike-photon"})]}),"), also define them at:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsxs(n,{href:"#package-json",children:[e.jsx(s.code,{children:"package.json"})," > ",e.jsx(s.code,{children:"imports"})]}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"vite-config-js",children:e.jsx("code",{children:"vite.config.js"})}),`
`,e.jsxs(l,{choiceGroup:{name:"codeLang",choices:["JavaScript","TypeScript"],default:"JavaScript",disabled:[]},lvl:"0",children:[e.jsx(s.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// vite.config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  resolve: {"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    alias: {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:"      '#root'"}),e.jsx(s.span,{style:{color:"#24292E"},children:": __dirname"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(s.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// vite.config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { UserConfig } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vite'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  resolve: {"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    alias: {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:'     "#root"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": __dirname,"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" UserConfig"})]})]})})})})]}),`
`,e.jsx(s.p,{children:"See also:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsxs(s.a,{href:"https://vitejs.dev/config/shared-options.html#resolve-alias",children:["Vite > ",e.jsx(s.code,{children:"resolve.alias"})]})}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["The Vite config ",e.jsx(s.code,{children:"resolve.alias"})," only applies to files that are processed by Vite."]}),`
`,e.jsx(s.p,{children:"The following are processed by Vite:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"All client-side code."}),`
`,e.jsxs(s.li,{children:["All ",e.jsxs(n,{href:"/config#files",children:[e.jsx(s.code,{children:"+"})," files"]})," loaded at runtime (client or server)."]}),`
`,e.jsxs(s.li,{children:["Your server code if you use ",e.jsx(n,{href:"/vike-photon",children:e.jsx(s.code,{children:"vike-photon"})}),"."]}),`
`]}),`
`,e.jsxs(s.p,{children:["Config files, such as ",e.jsx(s.code,{children:"vite.config.js"})," or ",e.jsx(s.code,{children:"+config.js"})," aren't processed by Vite. See ",e.jsx(n,{href:"#config-files"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"tsconfig-json",children:e.jsx("code",{children:"tsconfig.json"})}),`
`,e.jsx(s.p,{children:"If you use TypeScript, then TypeScript needs to know about your path aliases."}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"json","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"json","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// tsconfig.json"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"{"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#005CC5"},children:'  "compilerOptions"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#005CC5"},children:'    "paths"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#005CC5"},children:'      "#root/*"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": ["}),e.jsx(s.span,{style:{color:"#032F62"},children:'"./*"'}),e.jsx(s.span,{style:{color:"#24292E"},children:"]"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(s.p,{children:"See also:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsxs(s.a,{href:"https://www.typescriptlang.org/tsconfig#paths",children:["TypeScript > ",e.jsx(s.code,{children:"tsconfig.json#compilerOptions.paths"})]})}),`
`]}),`
`,e.jsx("h2",{id:"package-json",children:e.jsx("code",{children:"package.json"})}),`
`,e.jsxs(s.p,{children:["If you use a JavaScript server, with a ",e.jsx(n,{href:"/server-integration#manual-integration",children:"custom integration"})," instead of using ",e.jsx(n,{href:"/vike-photon",children:e.jsx(s.code,{children:"vike-photon"})}),", then also define your path aliases at:"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"json","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"json","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// package.json"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"{"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#005CC5"},children:'  "imports"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // JavaScript:"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#005CC5"},children:'    "#root/*"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"./*.js"'}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // TypeScript:"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#005CC5"},children:'    "#root/*"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"./*.ts"'})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(s.p,{children:["This tells Node.js how to resolve path aliases (Node.js doesn't know about ",e.jsx(s.code,{children:"vite.config.js"}),")."]}),`
`,e.jsx(s.p,{children:"See also:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://nodejs.org/api/packages.html#subpath-imports",children:"NodeJS > Subpath imports"})}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["If you use ",e.jsx(n,{href:"/vike-photon",children:e.jsx(s.code,{children:"vike-photon"})}),", all your server code is transpiled by Vite. Defining path aliases at ",e.jsx(s.code,{children:"vite.config.js"})," is enough because Vite already resolves all path aliases and Node.js doesn't see any path alias."]}),`
`,e.jsxs(s.p,{children:["If you don't use ",e.jsx(s.code,{children:"vike-photon"}),", your server code isn't processed by ",e.jsx(s.a,{href:"https://vite.dev",children:"Vite"})," out of the box. Instead, Node.js directly executes your server code and, therefore, you must configure Node.js to resolve your path aliases. See also: ",e.jsx(s.a,{href:"https://github.com/vikejs/vike/issues/562",children:"#562 - Transpile server code"}),"."]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["Alternatively, instead of using Node.js's built-in support over ",e.jsx(s.code,{children:"package.json#imports"}),", you can use an npm package such as ",e.jsx(s.a,{href:"https://github.com/ilearnio/module-alias",children:e.jsx(s.code,{children:"module-alias"})}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"config-files",children:"Config files"}),`
`,e.jsxs(s.p,{children:["To make path aliases work in config files, such as  ",e.jsx(s.code,{children:"+config.js"})," and ",e.jsx(s.code,{children:"vite.config.js"}),", define them at ",e.jsx(s.code,{children:"tsconfig.json"})," or ",e.jsx(s.code,{children:"package.json"})," (defining them in ",e.jsx(s.code,{children:"vite.config.js"})," doesn't work for config files)."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["Config files are transpiled by ",e.jsx(s.a,{href:"https://esbuild.github.io",children:"esbuild"})," instead of Vite — esbuild supports path aliases defined over ",e.jsx(s.code,{children:"tsconfig.json"})," and ",e.jsx(s.code,{children:"package.json"})," (esbuild doesn't know about ",e.jsx(s.code,{children:"vite.config.js"}),")."]}),`
`]})]})}function c(i={}){const{wrapper:s}={...o(),...i.components};return s?e.jsx(s,{...i,children:e.jsx(a,{...i})}):a(i)}function h(i,s){throw new Error("Expected component `"+i+"` to be defined: you likely forgot to import, pass, or provide it.")}const p=Object.freeze(Object.defineProperty({__proto__:null,default:c,pageSectionsExport:d},Symbol.toStringTag,{value:"Module"})),D={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:t}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:r}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/path-aliases/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:p}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{D as configValuesSerialized};
