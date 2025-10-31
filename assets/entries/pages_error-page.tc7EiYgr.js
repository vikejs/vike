import{o as t,a as c}from"../chunks/chunk-CRR3HCM0.js";import{j as e}from"../chunks/chunk-BVtPDciO.js";import{L as n}from"../chunks/chunk-UcDNXDXa.js";/* empty css                      *//* empty css                      *//* empty css                      */import{u as a,T as i}from"../chunks/chunk-BQoaMqtm.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{C as d}from"../chunks/chunk-DvHEUHhq.js";/* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-Ci3_D2xO.js";/* empty css                      */const p=[{pageSectionId:"pre-rendering",pageSectionLevel:2,pageSectionTitle:"Pre-rendering"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function o(l){const s={a:"a",blockquote:"blockquote",code:"code",figure:"figure",li:"li",ol:"ol",p:"p",pre:"pre",span:"span",ul:"ul",...a(),...l.components},{CodeSnippets:r}=s;return r||x("CodeSnippets"),e.jsxs(e.Fragment,{children:[e.jsx(d,{env:e.jsxs(e.Fragment,{children:["client, and server if ",e.jsx(n,{href:"/ssr",children:e.jsx(s.code,{children:"ssr: true"})})]}),global:!0}),`
`,e.jsxs(s.p,{children:["The error page, which is defined by ",e.jsx(s.code,{children:"/pages/_error/+Page.js"}),`, is rendered when an error occurs. It's also rendered when
you call `,e.jsx(n,{href:"/render",text:e.jsx(s.code,{children:"throw render(abortStatusCode)"})}),"."]}),`
`,e.jsxs(r,{children:[e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"jsx","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"jsx","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/_error/+Page.js"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Page }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { usePageContext } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike-react/usePageContext'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"/* Or:"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"import { usePageContext } from 'vike-vue/usePageContext'"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"import { usePageContext } from 'vike-solid/usePageContext'"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"*/"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Page"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" pageContext"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" usePageContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  let"}),e.jsx(s.span,{style:{color:"#24292E"},children:" msg "}),e.jsx(s.span,{style:{color:"#6A737D"},children:"// Message shown to the user"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"abortReason"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"abortStatusCode"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" pageContext"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(s.span,{style:{color:"#24292E"},children:" (abortReason?.notAdmin) {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // Handle `throw render(403, { notAdmin: true })`"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    msg "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:` "You cannot access this page because you aren't an administrator."`})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"else"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" if"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("}),e.jsx(s.span,{style:{color:"#D73A49"},children:"typeof"}),e.jsx(s.span,{style:{color:"#24292E"},children:" abortReason "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"==="}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'string'"}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // Handle `throw render(abortStatusCode, `You cannot access ${someCustomMessage}`)`"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    msg "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" abortReason"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"else"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" if"}),e.jsx(s.span,{style:{color:"#24292E"},children:" (abortStatusCode "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"==="}),e.jsx(s.span,{style:{color:"#005CC5"},children:" 403"}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // Handle `throw render(403)`"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    msg "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:` "You cannot access this page because you don't have enough privileges."`})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"else"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" if"}),e.jsx(s.span,{style:{color:"#24292E"},children:" (abortStatusCode "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"==="}),e.jsx(s.span,{style:{color:"#005CC5"},children:" 401"}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // Handle `throw render(401)`"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    msg "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:` "You cannot access this page because you aren't logged in. Please log in."`})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"else"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // Fallback error message"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    msg "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" pageContext.is404"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"      ?"}),e.jsx(s.span,{style:{color:"#032F62"},children:` "This page doesn't exist."`})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"      :"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'Something went wrong. Try again (later).'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"p"}),e.jsx(s.span,{style:{color:"#24292E"},children:">{msg}</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"p"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"tsx","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"tsx","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/_error/+Page.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { Page }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { usePageContext } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'vike-react/usePageContext'"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"/* Or:"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"import { usePageContext } from 'vike-vue/usePageContext'"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"import { usePageContext } from 'vike-solid/usePageContext'"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"*/"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Page"}),e.jsx(s.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" pageContext"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" usePageContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:"()"})]}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  let"}),e.jsx(s.span,{style:{color:"#24292E"},children:" msg"}),e.jsx(s.span,{style:{color:"#D73A49"},children:":"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" string"}),e.jsx(s.span,{style:{color:"#6A737D"},children:" // Message shown to the user"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  const"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"abortReason"}),e.jsx(s.span,{style:{color:"#24292E"},children:", "}),e.jsx(s.span,{style:{color:"#005CC5"},children:"abortStatusCode"}),e.jsx(s.span,{style:{color:"#24292E"},children:" } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" pageContext"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  if"}),e.jsx(s.span,{style:{color:"#24292E"},children:" (abortReason?.notAdmin) {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // Handle `throw render(403, { notAdmin: true })`"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    msg "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:` "You cannot access this page because you aren't an administrator."`})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"else"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" if"}),e.jsx(s.span,{style:{color:"#24292E"},children:" ("}),e.jsx(s.span,{style:{color:"#D73A49"},children:"typeof"}),e.jsx(s.span,{style:{color:"#24292E"},children:" abortReason "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"==="}),e.jsx(s.span,{style:{color:"#032F62"},children:" 'string'"}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // Handle `throw render(abortStatusCode, `You cannot access ${someCustomMessage}`)`"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    msg "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" abortReason"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"else"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" if"}),e.jsx(s.span,{style:{color:"#24292E"},children:" (abortStatusCode "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"==="}),e.jsx(s.span,{style:{color:"#005CC5"},children:" 403"}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // Handle `throw render(403)`"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    msg "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:` "You cannot access this page because you don't have enough privileges."`})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"else"}),e.jsx(s.span,{style:{color:"#D73A49"},children:" if"}),e.jsx(s.span,{style:{color:"#24292E"},children:" (abortStatusCode "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"==="}),e.jsx(s.span,{style:{color:"#005CC5"},children:" 401"}),e.jsx(s.span,{style:{color:"#24292E"},children:") {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // Handle `throw render(401)`"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    msg "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:` "You cannot access this page because you aren't logged in. Please log in."`})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"  } "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"else"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"    // Fallback error message"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#24292E"},children:"    msg "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#24292E"},children:" pageContext.is404"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"      ?"}),e.jsx(s.span,{style:{color:"#032F62"},children:` "This page doesn't exist."`})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"      :"}),e.jsx(s.span,{style:{color:"#032F62"},children:' "Something went wrong. Try again (later)."'})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  return"}),e.jsx(s.span,{style:{color:"#24292E"},children:" <"}),e.jsx(s.span,{style:{color:"#22863A"},children:"p"}),e.jsx(s.span,{style:{color:"#24292E"},children:">{msg}</"}),e.jsx(s.span,{style:{color:"#22863A"},children:"p"}),e.jsx(s.span,{style:{color:"#24292E"},children:">"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})]}),`
`,e.jsxs(i,{children:[e.jsxs(s.p,{children:["To define the type of ",e.jsx(s.code,{children:"pageContext.abortReason"}),":"]}),e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light","ts-only":"true",children:e.jsxs(s.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"// /pages/+config.ts"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"declare"}),e.jsx(s.span,{style:{color:"#24292E"},children:" global {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"  namespace"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" Vike"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"    interface"}),e.jsx(s.span,{style:{color:"#6F42C1"},children:" PageContext"}),e.jsx(s.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#E36209"},children:"      abortReason"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"?:"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"        |"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" string"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"        |"}),e.jsx(s.span,{style:{color:"#24292E"},children:" { "}),e.jsx(s.span,{style:{color:"#E36209"},children:"notAdmin"}),e.jsx(s.span,{style:{color:"#D73A49"},children:":"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" true"}),e.jsx(s.span,{style:{color:"#24292E"},children:" }"})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})})]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["The ",e.jsx(n,{href:"/usePageContext"})," UI component hook allows you to access ",e.jsx(n,{href:"/pageContext",noBreadcrumb:!0})," from any UI component."]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["The global interface ",e.jsx(s.code,{children:"Vike.PageContext"})," allows you to define ",e.jsx(s.code,{children:"pageContext"})," types in a global fashion, see ",e.jsx(n,{href:"/pageContext#typescript"}),"."]}),`
`]}),`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.code,{children:"pageContext.abortReason"})," and ",e.jsx(s.code,{children:"pageContext.abortStatusCode"})," values are set by ",e.jsx(n,{href:"/render",text:e.jsx(s.code,{children:"throw render(abortStatusCode, abortReason)"})}),", and ",e.jsx(s.code,{children:"pageContext.is404"})," is set by Vike."]}),`
`,e.jsx(s.p,{children:"The error page is rendered when:"}),`
`,e.jsxs(s.ol,{children:[`
`,e.jsxs(s.li,{children:["The URL didn't match the route of any of your pages (",e.jsx(s.code,{children:"404 Page Not Found"}),")."]}),`
`,e.jsxs(s.li,{children:["Your code has a bug (",e.jsx(s.code,{children:"500 Internal Error"}),"), technically speaking: one of your hooks threw an error."]}),`
`,e.jsxs(s.li,{children:["One of your hooks used ",e.jsx(n,{href:"/render",text:e.jsx(s.code,{children:"throw render(abortStatusCode)"})}),", for example: ",e.jsx(s.code,{children:`throw render(401, "You don't have the permission to access this page.")`}),"."]}),`
`]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"Currently, you can define only one error page. See also:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/vikejs/vike/issues/1038",children:"Feature Request #1038 — Allow multiple error pages"})}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"pre-rendering",children:"Pre-rendering"}),`
`,e.jsxs(s.p,{children:["If you use ",e.jsx(n,{text:"pre-rendering",href:"/pre-rendering"}),`, then Vike uses the error page to generate
`,e.jsx(s.code,{children:"/dist/client/404.html"}),"."]}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["Most Static Hosts follow the convention of using the file ",e.jsx(s.code,{children:"404.html"})," as 404 page."]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/error-tracking"}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(n,{href:"/pageContext#typescript"}),`
`]}),`
`]})]})}function h(l={}){const{wrapper:s}={...a(),...l.components};return s?e.jsx(s,{...l,children:e.jsx(o,{...l})}):o(l)}function x(l,s){throw new Error("Expected component `"+l+"` to be defined: you likely forgot to import, pass, or provide it.")}const j=Object.freeze(Object.defineProperty({__proto__:null,default:h,pageSectionsExport:p},Symbol.toStringTag,{value:"Module"})),M={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:c}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:t}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/error-page/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:j}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{M as configValuesSerialized};
