import{o as r,a}from"../chunks/chunk-CxIOOiKX.js";import{j as e}from"../chunks/chunk-B35a6FX-.js";import{L as n}from"../chunks/chunk-BbfG-aTg.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as s}from"../chunks/chunk-CJvpbNqo.js";import{U as l}from"../chunks/chunk-DuyKlQcD.js";import{M as d}from"../chunks/chunk-B0T-pq49.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */const p=[{pageSectionId:"which-one-to-choose",pageSectionLevel:2,pageSectionTitle:"Which one to choose?"},{pageSectionId:"simple-websites",pageSectionLevel:3,pageSectionTitle:"Simple Websites"},{pageSectionId:"mvps",pageSectionLevel:3,pageSectionTitle:"MVPs"},{pageSectionId:"highly-polished-apps",pageSectionLevel:3,pageSectionTitle:"Highly polished apps"},{pageSectionId:"client-side-state-preserved-across-navigation",pageSectionLevel:3,pageSectionTitle:"Client-side state preserved across navigation"},{pageSectionId:"nested-layouts",pageSectionLevel:3,pageSectionTitle:"Nested Layouts"},{pageSectionId:"third-party-api",pageSectionLevel:3,pageSectionTitle:"Third-party API"}];function o(i){const t={em:"em",li:"li",p:"p",ul:"ul",...s(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(t.p,{children:"Vike has first-class support for both:"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(n,{href:"/server-routing",children:"Server(-side) Routing"}),", and"]}),`
`,e.jsxs(t.li,{children:[e.jsx(n,{href:"/client-routing",children:"Client(-side) Routing"}),"."]}),`
`]}),`
`,e.jsx(d,{}),`
`,e.jsx("h2",{id:"which-one-to-choose",children:"Which one to choose?"}),`
`,e.jsxs(t.p,{children:["If you don't use a ",e.jsx(l,{}),", then we recommend to use Server Routing by default as it leads to a simpler architecture."]}),`
`,e.jsx(t.p,{children:"In general, there are two things to consider:"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsx(t.li,{children:"There is a trade-off between simplicity (Server Routing) and performance (Client Routing)."}),`
`,e.jsx(t.li,{children:"If client-side state needs to be preserved across navigation (e.g. the state of a music player component), then Client-side Routing is required."}),`
`]}),`
`,e.jsx(t.p,{children:"Ultimately, which one to use depends on your use case."}),`
`,e.jsx("h3",{id:"simple-websites",children:"Simple Websites"}),`
`,e.jsx(t.p,{children:`Apps with a simple architecture, such as portfolio or marketing websites, can afford the added complexity of Client Routing.
Client-side Routing can be worth it for having smooth page navigations giving such website a polished touch.`}),`
`,e.jsx(t.p,{children:e.jsx(t.em,{children:"Recommendation: Client-side Routing."})}),`
`,e.jsx("h3",{id:"mvps",children:"MVPs"}),`
`,e.jsx(t.p,{children:"As a startup that wants to deliver an MVP as quickly as possible, Server Routing is a sensible default choice. A simple architecture leads to higher development speed which means more features for your users."}),`
`,e.jsx(t.p,{children:e.jsx(t.em,{children:"Recommendation: Server-side Routing."})}),`
`,e.jsx("h3",{id:"highly-polished-apps",children:"Highly polished apps"}),`
`,e.jsx(t.p,{children:"For example Netflix's web app: Netflix pushes for delightful user experiences, and has the budget and man-power to do it. For entertainment apps, the highly polished user experience can be worth the added complexity."}),`
`,e.jsx(t.p,{children:e.jsx(t.em,{children:"Recommendation: Client-side Routing."})}),`
`,e.jsx("h3",{id:"client-side-state-preserved-across-navigation",children:"Client-side state preserved across navigation"}),`
`,e.jsx(t.p,{children:"For example, on music players such as Spotify, the currently listened song should not be interrupted when the user navigates to a new page. Server Routing cannot preserve client-side state and, therefore, Client Routing is needed."}),`
`,e.jsx(t.p,{children:e.jsx(t.em,{children:"Requirement: Client-side Routing."})}),`
`,e.jsx("h3",{id:"nested-layouts",children:"Nested Layouts"}),`
`,e.jsxs(t.p,{children:["Similarly to the previous section, when using ",e.jsx(n,{text:"Nested Layouts",href:"/Layout#nested"}),", the state of the outer page is preserved, which means Nested Layouts cannot be implemented using Server Routing."]}),`
`,e.jsx(t.p,{children:e.jsx(t.em,{children:"Requirement: Client-side Routing."})}),`
`,e.jsx("h3",{id:"third-party-api",children:"Third-party API"}),`
`,e.jsx(t.p,{children:`For example, if you use Shopify's or Facebook's GraphQL API,
then Client Routing enables page navigation without doing any request to your Node.js server:
when the user navigates to a new page,
the user's browser directly communicates with the Shopify/Facebook GraphQL API and your Node.js server isn't involved at all.`}),`
`,e.jsx(t.p,{children:"The Shopify/Facebook GraphQL API may geographically live significantly closer to your user than your Node.js server; you may want to involve your Node.js server has less as possible."}),`
`,e.jsx(t.p,{children:e.jsx(t.em,{children:"Recommendation: Client-side Routing."})})]})}function h(i={}){const{wrapper:t}={...s(),...i.components};return t?e.jsx(t,{...i,children:e.jsx(o,{...i})}):o(i)}const c=Object.freeze(Object.defineProperty({__proto__:null,default:h,pageSectionsExport:p},Symbol.toStringTag,{value:"Module"})),D={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:a}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:r}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/server-routing-vs-client-routing/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:c}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{D as configValuesSerialized};
