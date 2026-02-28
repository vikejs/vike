import{o as t,a as s}from"../chunks/chunk-CxIOOiKX.js";import{j as e}from"../chunks/chunk-B35a6FX-.js";import{L as i}from"../chunks/chunk-BbfG-aTg.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as a}from"../chunks/chunk-CJvpbNqo.js";/* empty css                      *//* empty css                      *//* empty css                      */const d=[{pageSectionId:"renderpage",pageSectionLevel:2,pageSectionTitle:"`renderPage()`"},{pageSectionId:"route-functions",pageSectionLevel:2,pageSectionTitle:"Route Functions"},{pageSectionId:"onbeforeroute",pageSectionLevel:2,pageSectionTitle:"`onBeforeRoute()`"},{pageSectionId:"onbeforeprerender",pageSectionLevel:2,pageSectionTitle:"`onBeforePrerender()`"}];function r(l){const n={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...a(),...l.components};return e.jsxs(e.Fragment,{children:[e.jsxs(n.p,{children:[e.jsx(n.code,{children:"0.4.23"})," renames ",e.jsx(n.code,{children:"pageContext.url"})," to ",e.jsx(n.code,{children:"pageContext.urlOriginal"}),"."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["This is a soft breaking change: the ",e.jsx(n.code,{children:"0.4.22"})," interface is still supported, i.e. most apps should still work without any change."]}),`
`]}),`
`,e.jsx(n.p,{children:"Most notable relevant places:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsxs(n.a,{href:"#renderpage",children:[e.jsx(n.code,{children:"renderPage()"}),": provide ",e.jsx(n.code,{children:"pageContext.urlOriginal"})," instead of ",e.jsx(n.code,{children:"pageContext.url"}),"."]})}),`
`,e.jsx(n.li,{children:e.jsxs(n.a,{href:"#route-functions",children:["Route Functions: use ",e.jsx(n.code,{children:"pageContext.urlPathname"})," instead of ",e.jsx(n.code,{children:"pageContext.url"}),"."]})}),`
`,e.jsx(n.li,{children:e.jsxs(n.a,{href:"#onbeforeroute",children:["If using ",e.jsx(n.code,{children:"onBeforeRoute()"}),": use and provide ",e.jsx(n.code,{children:"pageContext.urlOriginal"})," instead of ",e.jsx(n.code,{children:"pageContext.url"}),"."]})}),`
`,e.jsx(n.li,{children:e.jsxs(n.a,{href:"#onbeforeprerender",children:["If using ",e.jsx(n.code,{children:"onBeforePrerender()"}),": use and provide ",e.jsx(n.code,{children:"pageContext.urlOriginal"})," instead of ",e.jsx(n.code,{children:"pageContext.url"}),"."]})}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"onBeforeRoute()"})," and ",e.jsx(n.code,{children:"onBeforePrerender()"})," hooks are usually only used for i18n, see ",e.jsx(i,{href:"/i18n"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"renderpage",children:e.jsx("code",{children:"renderPage()"})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"diff","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"diff","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  // server.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  // Vike server middleware (e.g. Express.js)"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  app.get('*', async (req, res) => {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    const pageContextInit = {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#B31D28"},children:"-     url: req.url"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+     urlOriginal: req.url"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    const result = await renderPage(pageContextInit)"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    /* ... */"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  })"})})]})})}),`
`,e.jsx("h2",{id:"route-functions",children:"Route Functions"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"diff","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"diff","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  // /pages/**/*.page.route.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  export default pageContext => {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#B31D28"},children:"-   const url = pageContext.url"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+   const url = pageContext.urlPathname"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    /* ... */"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})})]})})}),`
`,e.jsx("h2",{id:"onbeforeroute",children:e.jsx("code",{children:"onBeforeRoute()"})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"diff","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"diff","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  // /renderer/_default.page.route.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  export function onBeforeRoute(pageContext) {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#B31D28"},children:"-   let urlMod = pageContext.url"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+   let urlMod = pageContext.urlOriginal"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    urlMod = changeUrl(urlMod)"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    return {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"      pageContext: {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#B31D28"},children:"-       url: urlMod,"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+       urlOriginal: urlMod,"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"      }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})})]})})}),`
`,e.jsx("h2",{id:"onbeforeprerender",children:e.jsx("code",{children:"onBeforePrerender()"})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"diff","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"diff","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  // /renderer/_default.page.server.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  export function onBeforePrerender(globalContext) {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    const prerenderPageContexts = []"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    globalContext.prerenderPageContexts.forEach((pageContext) => {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"      ['en-US', 'fr-FR', 'de-DE'].forEach((locale) => {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"        prerenderPageContexts.push({"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"          ...pageContext,"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#B31D28"},children:"-         url: `/${locale}${pageContext.url}`,"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#22863A"},children:"+         urlOriginal: `/${locale}${pageContext.urlOriginal}`,"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"          locale"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"        })"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"      })"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    })"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    return {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"      globalContext: {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"        prerenderPageContexts,"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"      }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})})]})})})]})}function o(l={}){const{wrapper:n}={...a(),...l.components};return n?e.jsx(n,{...l,children:e.jsx(r,{...l})}):r(l)}const c=Object.freeze(Object.defineProperty({__proto__:null,default:o,pageSectionsExport:d},Symbol.toStringTag,{value:"Module"})),T={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:s}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:t}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/migration/0.4.23/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:c}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{T as configValuesSerialized};
