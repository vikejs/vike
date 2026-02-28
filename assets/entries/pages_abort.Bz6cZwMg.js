import{o,a as s}from"../chunks/chunk-CxIOOiKX.js";import{j as e}from"../chunks/chunk-B35a6FX-.js";import{L as n}from"../chunks/chunk-BbfG-aTg.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as d}from"../chunks/chunk-CJvpbNqo.js";/* empty css                      *//* empty css                      *//* empty css                      */const c=[{pageSectionId:"throw-redirect-vs-throw-render-vs-navigate",pageSectionLevel:2,pageSectionTitle:"`throw redirect()` VS `throw render()` VS `navigate()`"},{pageSectionId:"debug",pageSectionLevel:2,pageSectionTitle:"Debug"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function i(t){const r={a:"a",blockquote:"blockquote",br:"br",code:"code",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...d(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsxs(r.p,{children:["You can use ",e.jsx(n,{href:"/render",children:e.jsx(r.code,{children:"throw render()"})})," or ",e.jsx(n,{href:"/redirect",children:e.jsx(r.code,{children:"throw redirect()"})})," in order to abort rendering the current page and render something else instead."]}),`
`,e.jsxs("h2",{id:"throw-redirect-vs-throw-render-vs-navigate",children:[e.jsx("code",{children:"throw redirect()"})," VS ",e.jsx("code",{children:"throw render()"})," VS ",e.jsx("code",{children:"navigate()"})]}),`
`,e.jsx(r.p,{children:e.jsxs(r.strong,{children:[e.jsx(r.code,{children:"throw redirect()"})," VS ",e.jsx(r.code,{children:"throw render()"})]})}),`
`,e.jsxs(r.p,{children:["While ",e.jsx(n,{href:"/redirect",children:e.jsx(r.code,{children:"throw redirect()"})})," changes the URL, ",e.jsx(n,{href:"/render",children:e.jsx(r.code,{children:"throw render()"})})," preserves it:"]}),`
`,e.jsxs(r.ul,{children:[`
`,e.jsxs(r.li,{children:["If a user goes to ",e.jsx(r.code,{children:"/admin"})," and ",e.jsx(r.code,{children:"throw redirect('/login')"})," is called, then the ",e.jsx(r.code,{children:"/login"})," page is rendered and the user sees a new URL ",e.jsx(r.code,{children:"/login"})," in the address bar of his browser."]}),`
`,e.jsxs(r.li,{children:["If a user goes to ",e.jsx(r.code,{children:"/admin"})," and ",e.jsx(r.code,{children:"throw render('/login')"})," is called, then the ",e.jsx(r.code,{children:"/login"})," page is rendered but the user keeps seeing the same URL ",e.jsx(r.code,{children:"/admin"})," in the address bar of his browser (even though the ",e.jsx(r.code,{children:"/login"})," page is rendered)."]}),`
`]}),`
`,e.jsxs(r.blockquote,{children:[`
`,e.jsxs(r.p,{children:["We usually recommend using ",e.jsx(r.code,{children:"throw render()"})," instead of ",e.jsx(r.code,{children:"throw redirect()"})," as it preserves the URL and, therefore, the user's intention. We further explain this technique at ",e.jsx(n,{href:"/auth#login-flow"}),"."]}),`
`]}),`
`,e.jsx(r.p,{children:e.jsxs(r.strong,{children:[e.jsx(r.code,{children:"throw redirect()"})," VS ",e.jsx(r.code,{children:"navigate()"})]})}),`
`,e.jsxs(r.p,{children:["Difference between ",e.jsx(r.code,{children:"throw redirect()"})," and ",e.jsx(n,{href:"/navigate",children:e.jsx(r.code,{children:"navigate()"})}),":"]}),`
`,e.jsxs(r.ul,{children:[`
`,e.jsxs(r.li,{children:[e.jsx(r.code,{children:"navigate()"})," only works on the client-side and shouldn't be called during the rendering of a page."]}),`
`,e.jsxs(r.li,{children:[e.jsx(r.code,{children:"throw redirect()"})," works on both client- and server-side but only works during the rendering a page."]}),`
`]}),`
`,e.jsxs(r.p,{children:["In a nutshell: if you want to abort the rendering of a page then use ",e.jsx(r.code,{children:"throw redirect()"}),", otherwise use ",e.jsx(r.code,{children:"navigate()"}),"."]}),`
`,e.jsx(r.p,{children:"For example:"}),`
`,e.jsxs(r.ul,{children:[`
`,e.jsxs(r.li,{children:["For redirecting the user upon a form submit action, use ",e.jsx(r.code,{children:"navigate()"}),". (Since the page is already rendered and thus ",e.jsx(r.code,{children:"throw redirect()"})," doesn't make sense as there is no pending page rendering to abort.)"]}),`
`,e.jsxs(r.li,{children:["For protecting a page from unprivileged access, such as a normal user trying to access an admin page, use ",e.jsx(r.code,{children:"throw redirect()"})," in order to abort (on both server- and client-side) the rendering of the admin page and redirect the user to another page instead (for example the login page)."]}),`
`]}),`
`,e.jsx("h2",{id:"debug",children:"Debug"}),`
`,e.jsxs(r.p,{children:["If ",e.jsx(r.code,{children:"throw redirect()"})," or ",e.jsx(r.code,{children:"throw render()"})," doesn't work:"]}),`
`,e.jsxs(r.ul,{children:[`
`,e.jsxs(r.li,{children:[e.jsxs(r.strong,{children:["Make sure ",e.jsx(r.code,{children:"throw redirect()"})," / ",e.jsx(r.code,{children:"throw render()"})," isn't intercepted."]}),e.jsx(r.br,{}),`
`,"In development, check your server logs for the following log. If this log is missing then it means that Vike didn't catch the ",e.jsx(r.code,{children:"throw redirect()"})," / ",e.jsx(r.code,{children:"throw render()"})," exception: some other code is intercepting it and thus prevents Vike from catching it.",`
`,e.jsx(r.pre,{children:e.jsx(r.code,{children:`10:00:00 AM [vike][request(42)] throw redirect('/some-url') intercepted while
rendering /some-other-url
`})}),`
`,e.jsxs(r.blockquote,{children:[`
`,e.jsxs(r.p,{children:["Most notably, using ",e.jsx(r.code,{children:"throw redirect()"})," / ",e.jsx(r.code,{children:"throw render()"})," inside a UI component usually doesn't work because most ",e.jsx(n,{href:"/ui-frameworks",children:"UI frameworks"})," intercept the exception, and thus Vike doesn't catch it. Instead, consider using ",e.jsx(r.code,{children:"throw redirect()"})," / ",e.jsx(r.code,{children:"throw render()"})," in a Vike hook such as ",e.jsx(n,{href:"/guard",children:e.jsx(r.code,{children:"guard()"})})," or ",e.jsx(n,{href:"/data",children:e.jsx(r.code,{children:"data()"})}),", or use ",e.jsx(n,{href:"/navigate",children:e.jsx(r.code,{children:"navigate()"})}),"."]}),`
`]}),`
`]}),`
`,e.jsxs(r.li,{children:[e.jsxs(r.strong,{children:["Make sure to use ",e.jsx(r.code,{children:"throw redirect()"})," / ",e.jsx(r.code,{children:"throw render()"})," within a Vike hook."]}),e.jsx(r.br,{}),`
`,"If you use ",e.jsx(r.code,{children:"throw redirect()"})," / ",e.jsx(r.code,{children:"throw render()"})," outside of Vike hooks, for example in some server middleware code, then Vike won't be able to intercept it."]}),`
`]}),`
`,e.jsxs(r.p,{children:["If ",e.jsx(r.code,{children:"throw redirect()"})," doesn't work:"]}),`
`,e.jsxs(r.ul,{children:[`
`,e.jsxs(r.li,{children:[e.jsxs(r.strong,{children:["Make sure to add ",e.jsx(r.code,{children:"pageContext.httpResponse.headers"})," to the HTTP response."]}),e.jsx(r.br,{}),`
`,"If you've embedded Vike into your server using ",e.jsx(n,{text:e.jsx(r.code,{children:"renderPage()"}),href:"/renderPage"}),", inspect whether ",e.jsx(r.code,{children:"pageContext.httpResponse.headers"})," contains ",e.jsxs(r.a,{href:"https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Location",children:["the ",e.jsx(r.code,{children:"Location"})," header"]})," and then double check whether you're correctly adding ",e.jsx(r.code,{children:"pageContext.httpResponse.headers"})," to the HTTP response."]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(r.ul,{children:[`
`,e.jsxs(r.li,{children:[`
`,e.jsx(n,{href:"/redirect"}),`
`]}),`
`,e.jsxs(r.li,{children:[`
`,e.jsx(n,{href:"/render"}),`
`]}),`
`,e.jsxs(r.li,{children:[`
`,e.jsx(n,{href:"/navigate"}),`
`]}),`
`]})]})}function l(t={}){const{wrapper:r}={...d(),...t.components};return r?e.jsx(r,{...t,children:e.jsx(i,{...t})}):i(t)}const h=Object.freeze(Object.defineProperty({__proto__:null,default:l,pageSectionsExport:c},Symbol.toStringTag,{value:"Module"})),P={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:s}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:o}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/abort/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:h}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{P as configValuesSerialized};
