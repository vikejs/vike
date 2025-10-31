import{o as a,a as t}from"../chunks/chunk-CRR3HCM0.js";import{j as e}from"../chunks/chunk-BVtPDciO.js";import{L as l}from"../chunks/chunk-UcDNXDXa.js";/* empty css                      */import{W as c}from"../chunks/chunk-CtmF0dnF.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as i}from"../chunks/chunk-BQoaMqtm.js";/* empty css                      */import{C as d}from"../chunks/chunk-DvHEUHhq.js";/* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-Ci3_D2xO.js";/* empty css                      */const p=[{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function r(s){const n={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...i(),...s.components},{CodeSnippets:o}=n;return o||x("CodeSnippets"),e.jsxs(e.Fragment,{children:[e.jsx(d,{env:"Vite (development & build-time)",global:null}),`
`,e.jsxs(n.p,{children:["Get the app's ",e.jsx(l,{href:"/config",children:"configurations"})," that are available at config-time."]}),`
`,e.jsx(c,{children:"It's a beta feature: expect breaking changes in any minor version update."}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["It only returns configurations that are available at config-time (i.e. at build- and dev-time). To get configurations at (production) runtime use ",e.jsx(l,{href:"/globalContext#config",children:e.jsx(n.code,{children:"globalContext.config"})})," and ",e.jsx(l,{href:"/globalContext#pages",children:e.jsx(n.code,{children:"globalContext.pages"})})," instead."]}),`
`]}),`
`,e.jsxs(o,{children:[e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// vite.config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { getVikeConfig } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/plugin'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  plugins: ["}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"myVitePlugin"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()]"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" myVitePlugin"}),e.jsx(n.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"    name: "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'myVitePlugin'"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"    configResolved"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"config"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"      const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" vike"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" getVikeConfig"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(config)"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"      console."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"log"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(vike.config.prerender)"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"      console."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"log"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(vike.config.baseAssets)"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"      console."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"log"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(vike.config.baseServer)"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"      console."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"log"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(vike.pages["}),e.jsx(n.span,{style:{color:"#032F62"},children:"'/pages/index'"}),e.jsx(n.span,{style:{color:"#24292E"},children:"].config)"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"      console."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"log"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(vike.pages["}),e.jsx(n.span,{style:{color:"#032F62"},children:"'/pages/product'"}),e.jsx(n.span,{style:{color:"#24292E"},children:"].route)"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"      // If you pre-render pages"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"      console."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"log"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(vike.prerenderContext.pageContexts)"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"      console."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"log"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(vike.prerenderContext.output)"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    },"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"    config"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"config"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"      // Also available here"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"      const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" vike"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" getVikeConfig"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(config)"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// vite.config.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { UserConfig, Plugin } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vite'"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { getVikeConfig } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vike/plugin'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"  plugins: ["}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"myVitePlugin"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()]"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"} "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" UserConfig"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" myVitePlugin"}),e.jsx(n.span,{style:{color:"#24292E"},children:"()"}),e.jsx(n.span,{style:{color:"#D73A49"},children:":"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" Plugin"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"    name: "}),e.jsx(n.span,{style:{color:"#032F62"},children:"'myVitePlugin'"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"    configResolved"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"config"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"      const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" vike"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" getVikeConfig"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(config)"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"      console."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"log"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(vike.config.prerender)"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"      console."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"log"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(vike.config.baseAssets)"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"      console."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"log"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(vike.config.baseServer)"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"      console."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"log"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(vike.pages["}),e.jsx(n.span,{style:{color:"#032F62"},children:"'/pages/index'"}),e.jsx(n.span,{style:{color:"#24292E"},children:"].config)"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"      console."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"log"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(vike.pages["}),e.jsx(n.span,{style:{color:"#032F62"},children:"'/pages/product'"}),e.jsx(n.span,{style:{color:"#24292E"},children:"].route)"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"      // If you pre-render pages"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"      console."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"log"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(vike.prerenderContext.pageContexts)"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"      console."}),e.jsx(n.span,{style:{color:"#6F42C1"},children:"log"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(vike.prerenderContext.output)"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    },"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"    config"}),e.jsx(n.span,{style:{color:"#24292E"},children:"("}),e.jsx(n.span,{style:{color:"#E36209"},children:"config"}),e.jsx(n.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"      // Also available here"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"      const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" vike"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" getVikeConfig"}),e.jsx(n.span,{style:{color:"#24292E"},children:"(config)"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})})]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{href:"/config#files"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(l,{href:"/getGlobalContext"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(l,{href:"/globalContext#config",children:["API > ",e.jsx(n.code,{children:"globalContext.config"})]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(l,{href:"/globalContext#pages",children:["API > ",e.jsx(n.code,{children:"globalContext.pages"})]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(l,{href:"/globalContext#prerenderContext",children:["API > ",e.jsx(n.code,{children:"globalContext.prerenderContext"})]}),`
`]}),`
`,e.jsx(n.li,{children:e.jsxs(n.a,{href:"https://vite.dev/guide/api-plugin.html#configresolved",children:["Vite > Plugin API > ",e.jsx(n.code,{children:"configResolved"})]})}),`
`,e.jsx(n.li,{children:e.jsxs(n.a,{href:"https://vite.dev/guide/api-plugin.html#config",children:["Vite > Plugin API > ",e.jsx(n.code,{children:"config"})]})}),`
`]})]})}function h(s={}){const{wrapper:n}={...i(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(r,{...s})}):r(s)}function x(s,n){throw new Error("Expected component `"+s+"` to be defined: you likely forgot to import, pass, or provide it.")}const j=Object.freeze(Object.defineProperty({__proto__:null,default:h,pageSectionsExport:p},Symbol.toStringTag,{value:"Module"})),R={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:t}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:a}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/getVikeConfig/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:j}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{R as configValuesSerialized};
