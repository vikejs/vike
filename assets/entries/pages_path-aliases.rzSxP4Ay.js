import{j as e,b as l,i as t,L as i,o as r}from"../chunks/chunk-DPnJaC06.js";import"../chunks/chunk-BmA8r6FG.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */const o=[{pageSectionId:"vite",pageSectionLevel:2,pageSectionTitle:"Vite"},{pageSectionId:"node-js",pageSectionLevel:2,pageSectionTitle:"Node.js"},{pageSectionId:"typescript",pageSectionLevel:2,pageSectionTitle:"TypeScript"}];function a(n){const s={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(s.p,{children:`Instead of using relative import paths,
which can be cumbersome,
you can use path aliases:`}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(s.span,{className:"diff remove","data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Counter } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" '../../../../components/Counter'"})]}),`
`,e.jsxs(s.span,{className:"diff add","data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Counter } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" '#root/components/Counter'"})]})]})})}),`
`,e.jsxs(s.p,{children:["Where ",e.jsx(s.code,{children:"#root/"})," denotes your project's root directory."]}),`
`,e.jsx(s.p,{children:"You may need to define your path aliases at up to three different places:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"vite.config.js#resolve.alias"})," (for files processed by Vite)"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"package.json#imports"})," (for Node.js files that aren't processed by Vite)"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"tsconfig.json#compilerOptions.paths"})," (for TypeScript)"]}),`
`]}),`
`,e.jsx(s.p,{children:"Example:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{path:"/examples/path-aliases"}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"vite",children:"Vite"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// vite.config.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  resolve: {"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    alias: {"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#032F62"},children:'     "#root"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": __dirname,"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["The Vite config ",e.jsx(s.code,{children:"resolve.alias"}),` only applies to files that are processed by Vite.
Note that some of your server files may not be processed by Vite,
see the `,e.jsx(s.a,{href:"#node-js",children:"Node.js section below"}),"."]}),`
`]}),`
`,e.jsxs(s.p,{children:["We recommend following the ",e.jsx(s.a,{href:"https://nodejs.org/api/packages.html#subpath-imports:~:text=must%20always%20start%20with%20%23%20to%20ensure%20they%20are%20disambiguated%20from%20external%20package%20specifiers",children:"Node.js convention"})," to prefix path aliases with the special character ",e.jsx(s.code,{children:"#"}),"."]}),`
`,e.jsx(s.p,{children:"See also:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsxs(s.a,{href:"https://vitejs.dev/config/shared-options.html#resolve-alias",children:["Vite > ",e.jsx(s.code,{children:"resolve.alias"})]})}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{path:"/examples/path-aliases/vite.config.ts"}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"node-js",children:"Node.js"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"json","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"json","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// package.json"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"{"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#005CC5"},children:'  "imports"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // JavaScript:"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#005CC5"},children:'    "#root/*"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"./*.js"'}),e.jsx(s.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // TypeScript:"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#005CC5"},children:'    "#root/*"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"./*.ts"'})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsx(s.p,{children:"See also:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://nodejs.org/api/packages.html#subpath-imports",children:"NodeJS > Subpath imports"})}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{path:"/examples/path-aliases/package.json"}),`
`]}),`
`]}),`
`,e.jsxs(s.p,{children:["Vite's ",e.jsx(s.code,{children:"vite.config.js#resolve.alias"}),` only applies to files that are processed by Vite.
(In other words: the `,e.jsx(s.code,{children:"+*.js"})," files and their imports.)"]}),`
`,e.jsxs(s.p,{children:[`Browser files are always processed by Vite,
but this isn't always the case for Node.js server files,
for example `,e.jsx(l,{path:"/boilerplates/boilerplate-react/server/index.js",text:"Express.js server code"}),"."]}),`
`,e.jsxs(s.p,{children:["You can use Node.js's built-in support ",e.jsx(s.code,{children:"package.json#imports"})," or, alternatively, you can use one of many npm packages such as ",e.jsx(s.a,{href:"https://github.com/ilearnio/module-alias",children:e.jsx(s.code,{children:"module-alias"})}),". (Example of using ",e.jsx(s.code,{children:"module-alias"}),": ",e.jsx(s.a,{href:"https://github.com/vikejs/vike/tree/c914dade5f0809ff330478c3531928055abdadef/examples/path-aliases",children:"/examples/path-aliases (@c914dad)"}),".)"]}),`
`,e.jsx("h2",{id:"typescript",children:"TypeScript"}),`
`,e.jsx(s.p,{children:"If you use TypeScript, then TypeScript needs to know about your path aliases."}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{style:{backgroundColor:"#fff",color:"#24292e"},tabIndex:"0","data-language":"json","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"json","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// tsconfig.json"})}),`
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
`,e.jsxs(s.li,{children:[`
`,e.jsx(l,{path:"/examples/path-aliases/tsconfig.json"}),`
`]}),`
`]})]})}function d(n={}){const{wrapper:s}=n.components||{};return s?e.jsx(s,{...n,children:e.jsx(a,{...n})}):a(n)}const c=Object.freeze(Object.defineProperty({__proto__:null,default:d,pageSectionsExport:o},Symbol.toStringTag,{value:"Module"})),v={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:r}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/path-aliases/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:c}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:i}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:t}}};export{v as configValuesSerialized};
