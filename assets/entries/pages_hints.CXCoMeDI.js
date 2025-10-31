import{o as d,a as o}from"../chunks/chunk-CRR3HCM0.js";import{j as e}from"../chunks/chunk-BVtPDciO.js";import{L as a}from"../chunks/chunk-UcDNXDXa.js";/* empty css                      */import{W as t}from"../chunks/chunk-CtmF0dnF.js";import{C as c}from"../chunks/chunk-BjH-d7SG.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as r}from"../chunks/chunk-BQoaMqtm.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */const h=[{pageSectionId:"window-is-not-defined",pageSectionLevel:2,pageSectionTitle:"`window is not defined`"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function i(n){const s={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",ol:"ol",p:"p",pre:"pre",span:"span",ul:"ul",...r(),...n.components},{CodeSnippets:l}=s;return l||j("CodeSnippets"),e.jsxs(e.Fragment,{children:[e.jsx(s.p,{children:"Hints for how to resolve common issues."}),`
`,e.jsx("h2",{id:"window-is-not-defined",children:e.jsx("code",{children:"window is not defined"})}),`
`,e.jsx(s.p,{children:"The following error usually means that client-side code is wrongfully executed on the server-side."}),`
`,e.jsx(c,{lineBreak:"white-space",children:e.jsx(s.pre,{children:e.jsx(s.code,{children:`ReferenceError: window is not defined
    at someFunction (~/my-app/some/file.js:5:3)
    at someCallerFn (~/my-app/some/other-file.js:7:3)
`})})}),`
`,e.jsxs(l,{hideToggle:!0,children:[e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// ~/my-app/some/file.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This file should be loaded only on the client-side"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" someFunction"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  window."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"alert"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'hello'"}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// ~/my-app/some/file.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This file should be loaded only on the client-side"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" someFunction"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  window."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"alert"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'hello'"}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})]}),`
`,e.jsxs(l,{hideToggle:!0,children:[e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// ~/my-app/some/other-file.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This file is loaded on both client- and server-side"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { someFunction } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" './file.js'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" someCallerFn"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"  someFunction"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// ~/my-app/some/other-file.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This file is loaded on both client- and server-side"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { someFunction } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" './file.js'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" someCallerFn"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"  someFunction"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})]}),`
`,e.jsxs(s.p,{children:["The error, which is thrown by Node.js(/Bun/Deno), is that ",e.jsxs(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/Window",children:["the ",e.jsx(s.code,{children:"window"})," object"]})," is defined on the client-side only: Node.js doesn't know about ",e.jsx(s.code,{children:"window"})," and therefore throws an error."]}),`
`,e.jsx(s.p,{children:"The solution is typically one of the following:"}),`
`,e.jsxs(s.ol,{children:[`
`,e.jsxs(s.li,{children:["Make sure ",e.jsx(s.code,{children:"someFunction()"})," is called only on the client-side:",`
`,e.jsxs(l,{children:[e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// ~/my-app/some/other-file.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This file is loaded on both client- and server-side"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { someFunction } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" './file.js'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" someCallerFn"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{className:"diff remove","data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"  someFunction"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() "})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// ~/my-app/some/other-file.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This file is loaded on both client- and server-side"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { someFunction } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" './file.js'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" someCallerFn"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{className:"diff remove","data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"  someFunction"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})]}),`
`,e.jsxs(l,{children:[e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// ~/my-app/somewhere/else.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This file is loaded on the client-side only."})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" someThirdFn"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsx(s.span,{className:"diff add","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // We can call someFunction() here."})}),`
`,e.jsxs(s.span,{className:"diff add","data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"  someFunction"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() "})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// ~/my-app/somewhere/else.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This file is loaded on the client-side only."})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" someThirdFn"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsx(s.span,{className:"diff add","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"  // We can call someFunction() here."})}),`
`,e.jsxs(s.span,{className:"diff add","data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"  someFunction"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})]}),`
`]}),`
`,e.jsxs(s.li,{children:["Or make ",e.jsx(s.code,{children:"someFunction()"})," ",e.jsx(a,{href:"/glossary#isomorphic",children:"isomorphic"}),":",`
`,e.jsxs(l,{children:[e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// ~/my-app/some/file.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{className:"diff remove","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This file should be loaded only on the client-side"})}),`
`,e.jsx(s.span,{className:"diff add","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This file can be loaded on both client- and server-side"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" someFunction"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{className:"diff remove","data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  window."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"alert"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'hello'"}),e.jsx(s.span,{style:{color:"#24292E"},children:") "})]}),`
`,e.jsxs(s.span,{className:"diff add","data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"isBrowser"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()) window."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"alert"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'hello'"}),e.jsx(s.span,{style:{color:"#24292E"},children:") "})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})}),`
`,e.jsxs(s.span,{className:"diff add","data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" isBrowser"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{className:"diff add","data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" typeof"}),e.jsx(s.span,{style:{color:"#24292E"},children:" window "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"!=="}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'undefined'"})]}),`
`,e.jsx(s.span,{className:"diff add","data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"} "})})]})})}),e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{className:"has-diff",tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// ~/my-app/some/file.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{className:"diff remove","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This file should be loaded only on the client-side"})}),`
`,e.jsx(s.span,{className:"diff add","data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// This file can be loaded on both client- and server-side"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" someFunction"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{className:"diff remove","data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  window."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"alert"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'hello'"}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsxs(s.span,{className:"diff add","data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"isBrowser"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()) window."}),e.jsx(s.span,{style:{color:"#6F42C1"},children:"alert"}),e.jsx(s.span,{style:{color:"#24292E"},children:"("}),e.jsx(s.span,{style:{color:"#032F62"},children:"'hello'"}),e.jsx(s.span,{style:{color:"#24292E"},children:")"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})}),`
`,e.jsxs(s.span,{className:"diff add","data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" isBrowser"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{className:"diff add","data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" typeof"}),e.jsx(s.span,{style:{color:"#24292E"},children:" window "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"!=="}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'undefined'"})]}),`
`,e.jsx(s.span,{className:"diff add","data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})]}),`
`]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"We recommend the first approach whenever possible, because it's best to minimize isomorphic code to a strict minimum, for cleaner code and to avoid client-side bloat (loading server-side code on the client-side increases client bundle sizes and therefore slows down your app)."}),`
`]}),`
`,e.jsx(t,{children:e.jsxs(s.p,{children:["Another common technique is to define the ",e.jsx(s.code,{children:"window"})," object on the server-side, for example with ",e.jsx(s.a,{href:"https://www.npmjs.com/package/ssr-window",children:e.jsx(s.code,{children:"ssr-window"})}),", but we recommend against this approach because it may break a library that relies on ",e.jsx(s.code,{children:"typeof window !== 'undefined'"})," to test whether the code is running on the client or server-side."]})}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["You can use ",e.jsx(a,{href:"/file-env",children:e.jsx(s.code,{children:".client.js"})})," to structure and clarify where your files are loaded."]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(a,{href:"/broken-npm-package"}),`
`]}),`
`]})]})}function p(n={}){const{wrapper:s}={...r(),...n.components};return s?e.jsx(s,{...n,children:e.jsx(i,{...n})}):i(n)}function j(n,s){throw new Error("Expected component `"+n+"` to be defined: you likely forgot to import, pass, or provide it.")}const x=Object.freeze(Object.defineProperty({__proto__:null,default:p,pageSectionsExport:h},Symbol.toStringTag,{value:"Module"})),k={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:d}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/hints/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:x}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{k as configValuesSerialized};
