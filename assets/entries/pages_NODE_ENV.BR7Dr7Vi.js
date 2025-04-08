import{j as e,i as r,L as s,o as d}from"../chunks/chunk-CKzAuXwH.js";import{L as t}from"../chunks/chunk-DUsA13Od.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import"../chunks/chunk-VLiKoQz4.js";/* empty css                      */const l=[{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function i(o){const n={a:"a",blockquote:"blockquote",code:"code",li:"li",p:"p",ul:"ul",...o.components};return e.jsxs(e.Fragment,{children:[e.jsxs(n.p,{children:["Setting ",e.jsx(n.code,{children:"process.env.NODE_ENV"})," is a ",e.jsx(t,{href:"#see-also",children:"widespread convention"})," to tell tools whether your app is being run in development or production."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"It's important to respect the following convention: many tools run erroneously otherwise."}),`
`]}),`
`,e.jsx(n.p,{children:"In development:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Make sure ",e.jsx(n.code,{children:"process.env.NODE_ENV"})," is one of these values: ",e.jsx(n.code,{children:"['development', 'dev', '', undefined]"}),"."]}),`
`,e.jsxs(n.li,{children:["If you use a server, make sure to use ",e.jsx(t,{href:"/createDevMiddleware",children:e.jsx(n.code,{children:"createDevMiddleware()"})})," for adding the development middleware to your server."]}),`
`]}),`
`,e.jsx(n.p,{children:"In production (and staging):"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Make sure ",e.jsx(n.code,{children:"process.env.NODE_ENV"})," is a value different than ",e.jsx(n.code,{children:"['development', 'dev', '', undefined]"}),".",`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"Note that:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Upon starting your server in production, make sure to set ",e.jsx(n.code,{children:"process.env.NODE_ENV"}),". (E.g. ",e.jsx(n.code,{children:"$ NODE_ENV='production' node server/index.js"}),".)"]}),`
`,e.jsxs(n.li,{children:["Upon building (",e.jsx(n.code,{children:"$ vike build"}),"/",e.jsx(n.code,{children:"$ vike prerender"}),"), ",e.jsx(n.code,{children:"process.env.NODE_ENV"})," is automatically set to ",e.jsx(n.code,{children:"'production'"}),"."]}),`
`]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:["Make sure you don't call ",e.jsx(t,{href:"/createDevMiddleware",children:e.jsx(n.code,{children:"createDevMiddleware()"})})," in production: the development middleware isn't needed in production. (It would unnecessarily bloat your production server.)"]}),`
`,e.jsxs(n.li,{children:["Make sure you don't mistakenly load ",e.jsx(n.a,{href:"https://vitejs.dev",children:"Vite"})," in production. (It would significantly bloat your production server.)"]}),`
`]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"https://nodejs.org/en/learn/getting-started/nodejs-the-difference-between-development-and-production#:~:text=You%20can%20signal%20Node.js%20that%20you%20are%20running%20in%20production%20by%20setting%20the%20NODE_ENV%3Dproduction%20environment%20variable.",children:"Node.js Docs - The difference between development and production"}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["While the ",e.jsx(n.code,{children:"process.env.NODE_ENV"})," convention was introduced by Node.js, it's used by tools regardless of whether you use Node.js. Thus, make sure to follow the convention even in non-Node.js environments."]}),`
`]}),`
`]}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://stackoverflow.com/questions/16978256/what-is-node-env-and-how-to-use-it-in-express/16979503#16979503:~:text=NODE_ENV%20specifically%20is%20used%20(by%20convention)%20to%20state%20whether%20a%20particular%20environment%20is%20a%20production%20or%20a%20development%20environment.",children:"Stack Overflow - What is NODE_ENV and how to use it in Express?"})}),`
`]})]})}function a(o={}){const{wrapper:n}=o.components||{};return n?e.jsx(n,{...o,children:e.jsx(i,{...o})}):i(o)}const c=Object.freeze(Object.defineProperty({__proto__:null,default:a,pageSectionsExport:l},Symbol.toStringTag,{value:"Module"})),g={isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:d}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/NODE_ENV/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:c}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/Layout",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:s}},TopNavigation:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+TopNavigation.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:r}}};export{g as configValuesSerialized};
