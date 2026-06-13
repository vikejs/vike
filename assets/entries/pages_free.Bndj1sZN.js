import{o as T,a as C}from"../chunks/chunk-Cgz1GdgB.js";import{j as e,r as c}from"../chunks/chunk-Dn-Xi2p3.js";import{L as d}from"../chunks/chunk-Be1bryip.js";/* empty css                      */import{D as E}from"../chunks/chunk-r8IY6BSZ.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{u as S}from"../chunks/chunk-IMAl7YcV.js";import{T as z,a as D,b as g,c as b}from"../chunks/chunk-Zz2kK_Am.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */function R(t){const n=[{text:"export default {",license:!1},{text:"  license: {",license:!0}];for(const[s,i]of Object.entries(t)){const r=typeof i=="string"?`    '${s}': '${i}',`:`    '${s}': { expires: '${i.expires}', key: '${i.key}' },`;n.push({text:r,license:!0})}return n.push({text:"  },",license:!0},{text:"}",license:!1}),n}function L(t){const n=[];return t.split(/('[^']*')/g).forEach((s,i)=>{if(i%2===1){n.push(e.jsx("span",{className:"tok-str",children:s},i));return}s.split(/\b(export|default)\b/g).forEach((r,o)=>{r&&(o%2===1?n.push(e.jsx("span",{className:"tok-kw",children:r},`${i}-${o}`)):n.push(r))})}),n}function U({license:t}){const[n,s]=c.useState(!1),i=[{text:"// pages/+config.js",license:!1},{text:"",license:!1},...R(t)];async function r(){try{await navigator.clipboard.writeText(i.filter(o=>o.license).map(o=>o.text).join(`
`)),s(!0),setTimeout(()=>s(!1),1500)}catch{}}return e.jsxs("div",{style:P,children:[e.jsx("style",{children:F}),e.jsx("div",{className:"license-snippet",children:e.jsx("div",{className:"license-snippet-code",children:i.map((o,l)=>e.jsx("div",{className:`line${o.license?" add":""}${o.text.startsWith("//")?" comment":""}`,children:o.text===""?" ":L(o.text)},l))})}),e.jsx("button",{type:"button",onClick:r,style:q,children:n?"Copied":"Copy"})]})}const P={position:"relative",margin:"8px 0"},q={position:"absolute",top:6,right:6,padding:"4px 8px",fontSize:12,background:"#fff",border:"1px solid #ddd",borderRadius:4,cursor:"pointer",color:"#333"},F=`
.license-snippet { margin: 0; border: 1px solid #e2e4e8; border-radius: 6px; overflow-x: auto; background: #f4f4f4; font-size: 13px; line-height: 1.6; }
.license-snippet .license-snippet-code { display: inline-block; min-width: 100%; box-sizing: border-box; padding: 16px 0; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace; color: #24292e; }
.license-snippet .line { display: block; position: relative; padding: 0 16px; white-space: pre; }
.license-snippet .line.add { background: #d7ecdf; }
.license-snippet .line.add::before { content: '+'; position: absolute; top: -1px; left: 4px; color: #89d189; font-size: 1.2em; font-weight: 500; }
.license-snippet .line.comment { color: #6a737d; }
.license-snippet .tok-kw { color: #d73a49; }
.license-snippet .tok-str { color: #032f62; }
`;function N(){return`${typeof window<"u"&&window.location.port==="3001"?"http://localhost:3000":"https://dash.vike.dev"}/api/free-trial/get-license-key`}function A({className:t,labelClassName:n,inputClassName:s,buttonClassName:i}={}){const[r,o]=c.useState(""),[l,a]=c.useState({kind:"idle"});async function w(u){if(u.preventDefault(),!r.trim()){a({kind:"error",message:"Enter at least one domain."});return}a({kind:"loading"});try{const h=await fetch(N(),{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({domainsInput:r})});if(h.status===200){a({kind:"success",data:await h.json()});return}a({kind:"error",message:await W(h)})}catch{a({kind:"error",message:"Couldn't reach the server. Check your connection and try again."})}}return e.jsxs("div",{className:t,children:[e.jsxs("form",{onSubmit:w,style:O,children:[e.jsxs("label",{style:Y,children:[e.jsxs("div",{className:n,children:["Domains ",e.jsx("span",{children:"(comma or space-separated)"})]}),e.jsx("input",{type:"text",value:r,onChange:u=>o(u.target.value),placeholder:"example.com",className:s})]}),e.jsx("button",{type:"submit",disabled:l.kind==="loading",className:i,children:l.kind==="loading"?"Submitting…":"Get license key"})]}),e.jsx(I,{result:l})]})}function I({result:t}){if(t.kind==="idle"||t.kind==="loading")return null;if(t.kind==="error")return e.jsxs("section",{style:H,children:[e.jsx("strong",{style:m,children:"Error"}),e.jsx("p",{style:{margin:0},children:t.message})]});const{license:n,requested:s,unavailable:i}=t.data,r=Object.entries(n);return e.jsxs(e.Fragment,{children:[r.length>0&&e.jsxs("section",{style:_,children:[e.jsx("strong",{style:m,children:"License key"}),e.jsxs("p",{style:V,children:["Set"," ",e.jsx("a",{href:"https://vike.dev/license",style:X,children:e.jsx("code",{children:"+license"})})," ","in your ",e.jsx("code",{children:"+config.js"})," file:"]}),e.jsx(U,{license:n}),e.jsx($,{entries:r,requested:s})]}),i.length>0&&e.jsx(B,{items:i})]})}function $({entries:t,requested:n}){return e.jsxs("div",{style:J,children:[e.jsx("div",{style:x,children:"Domain"}),e.jsx("div",{style:x,children:"Expires"}),e.jsx("div",{style:x,children:"Requested"}),t.map(([s,i])=>{const r=typeof i=="string"?null:i.expires,o=n[s];return e.jsxs(c.Fragment,{children:[e.jsx("div",{style:f,children:s}),e.jsx("div",{style:f,children:r===null?"never":p(r)}),e.jsx("div",{style:f,children:o?p(o):"—"})]},s)})]})}function B({items:t}){return e.jsxs("section",{style:G,children:[e.jsx("strong",{style:m,children:"We can't cover these domains"}),e.jsxs("p",{style:{margin:"0 0 8px"},children:["Don't add these to your ",e.jsx("code",{children:"+config.js"})," — they won't verify. To get a working key,"," ",e.jsx("a",{href:"https://vike.dev/pricing",children:"purchase a license"})," or"," ",e.jsx("a",{href:"https://vike.dev/free",children:"request a maintainer grant"}),"."]}),e.jsx("ul",{style:{margin:"6px 0 0",paddingLeft:20},children:t.map(n=>e.jsx("li",{children:M(n)},n.domain))})]})}async function W(t){return t.status===429?"Too many requests — please wait a minute and try again.":t.status===400?(await t.text()).trim()||"Please check the domains you entered and try again.":"Something went wrong on our end. Please try again, or email support@vike.dev."}function M(t){return t.reason==="grant-expired"?`${t.domain} — its maintainer grant expired ${p(t.expiresAt)}; purchase a license or request a new grant.`:`${t.domain} — previous free trial expired ${p(t.expiresAt)}; the per-domain trial quota is used up.`}function p(t){const n=new Date(t);return Number.isNaN(n.getTime())?t:n.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric",timeZone:"UTC"})}const O={display:"flex",alignItems:"flex-end",gap:12,flexWrap:"wrap"},Y={flex:"1 1 280px",minWidth:0},j={padding:20,borderRadius:6,marginTop:16},m={display:"block",marginBottom:8},_={...j,background:"#eceef1",color:"#1f2328"},G={...j,background:"#fff3cd",color:"#7a5b00"},H={...j,background:"#fde2e1",color:"#9d2222"},V={margin:"0 0 4px"},X={color:"#4747ff",textDecoration:"none"},J={display:"grid",gridTemplateColumns:"auto auto 1fr",margin:"16px 0 0",fontSize:13},x={fontWeight:600,padding:"10px 50px 10px 0",borderBottom:"1px solid #c8ccd2",whiteSpace:"nowrap"},f={padding:"10px 50px 10px 0",borderBottom:"1px solid #d8dbdf"},y=`== URL

[Your app's URL]

== Reason

[Why your organization has limited financial resources]`,k=`${y}

== Duration

Two years`,Z=[{pageSectionId:"free-trial",pageSectionLevel:2,pageSectionTitle:"Free trial"},{pageSectionId:"grant",pageSectionLevel:2,pageSectionTitle:"Grant"},{pageSectionId:"who-s-eligible",pageSectionLevel:3,pageSectionTitle:"Who's eligible?"},{pageSectionId:"how-to-apply",pageSectionLevel:3,pageSectionTitle:"How to apply?"},{pageSectionId:"see-also",pageSectionLevel:2,pageSectionTitle:"See also"}];function v(t){const n={blockquote:"blockquote",code:"code",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...S(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.p,{children:"The free access program ensures everyone can use Vike."}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(d,{href:"#free-trial"})," — free for 3 months"]}),`
`,e.jsxs(n.li,{children:[e.jsx(d,{href:"#grant"}),":",`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"Extended free trial"})," — free for longer than 3 months"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"Free forever"})," — free indefinitely"]}),`
`]}),`
`]}),`
`]}),`
`,e.jsx("h2",{id:"free-trial",children:"Free trial"}),`
`,e.jsx(n.p,{children:"Get your 3-month free trial."}),`
`,e.jsx(A,{buttonClassName:"free-trial-button",inputClassName:"free-trial-input",labelClassName:"free-trial-label"}),`
`,e.jsx(E,{children:e.jsx(n.p,{children:"Don't use it for now: this is under construction 🚧"})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Enter ",e.jsx(n.strong,{children:"root domains"}),": subdomains are included — a key for ",e.jsx(n.code,{children:"example.com"})," also covers ",e.jsx(n.code,{children:"foo.example.com"}),", ",e.jsx(n.code,{children:"bar.example.com"}),", etc."]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["You can re-request your key at any time (e.g. if you lose it) — but ",e.jsx(n.strong,{children:"the 3 months start from your first request"}),", so re-requesting won't extend the trial. To extend your free trial, see ",e.jsx(d,{href:"#grant"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"grant",children:"Grant"}),`
`,e.jsx(n.p,{children:"If a license is too expensive for your organization, apply for a free grant:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"Extended free trial"})," (free for a set period), or"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"Free forever"})," (free indefinitely)."]}),`
`]}),`
`,e.jsx("h3",{id:"who-s-eligible",children:"Who's eligible?"}),`
`,e.jsx(n.p,{children:"Your organization is eligible if it has limited financial resources and purchasing a license would be too expensive."}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["In general, we consider an organization to have limited financial resources if it has ",e.jsx(n.strong,{children:"fewer than 10 employees"}),", though organizations in ",e.jsx(n.strong,{children:"lower-income countries can exceed this threshold"}),"."]}),`
`,e.jsx(n.p,{children:"You can still apply if you have more than 10 employees — financial constraints matter more than headcount. However, apply only if you genuinely cannot afford a license, not simply to reduce costs."}),`
`]}),`
`,e.jsx(n.p,{children:"Apply for:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"Extended free trial"})," if you expect more financial resources in the future"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"Free forever"})," otherwise"]}),`
`]}),`
`,e.jsx("p",{}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"Examples:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Startup => ",e.jsx(n.code,{children:"Extended free trial"})]}),`
`,e.jsxs(n.li,{children:["Open Source (without much revenue) => ",e.jsx(n.code,{children:"Free forever"})]}),`
`,e.jsxs(n.li,{children:["Amateur sports club => ",e.jsx(n.code,{children:"Free forever"})]}),`
`]}),`
`]}),`
`,e.jsxs(n.p,{children:["You can also apply for ",e.jsx(n.code,{children:"Extended free trial"})," for other reasons (e.g. pending clearance from your company's finance department)."]}),`
`,e.jsx(n.p,{children:"We tend to be generous, so don't hesitate to apply — it's easy and quick."}),`
`,e.jsx("h3",{id:"how-to-apply",children:"How to apply?"}),`
`,e.jsx(n.p,{children:"Contact us to apply."}),`
`,e.jsxs(z,{children:[e.jsxs(D,{children:[e.jsx(g,{children:e.jsx(n.code,{children:"Extended free trial"})}),e.jsx(g,{children:e.jsx(n.code,{children:"Free forever"})})]}),e.jsxs(b,{children:[e.jsx("span",{children:"Email: "}),e.jsx("a",{href:"mailto:support@vike.dev?subject="+encodeURIComponent("Extended free trial")+"&body="+encodeURIComponent(k),children:"support@vike.dev (prefilled subject & body)"}),e.jsx(n.p,{children:"Subject:"}),e.jsx(n.pre,{children:e.jsx(n.code,{children:`Extended free trial
`})}),e.jsx(n.p,{children:"Body:"}),e.jsx(n.pre,{children:e.jsx(n.code,{children:`== URL

[Your app's URL]

== Reason

[Why your organization has limited financial resources]

== Duration

Two years. [Can be modified: for example, you can set it to the duration after which you
expect to easily afford a license. You can apply again after the extended period ends.]
`})})]}),e.jsxs(b,{children:[e.jsx("span",{children:"Email: "}),e.jsx("a",{href:"mailto:support@vike.dev?subject="+encodeURIComponent("Free forever")+"&body="+encodeURIComponent(y),children:"support@vike.dev (prefilled subject & body)"}),e.jsx(n.p,{children:"Subject:"}),e.jsx(n.pre,{children:e.jsx(n.code,{children:`Free forever
`})}),e.jsx(n.p,{children:"Body:"}),e.jsx(n.pre,{children:e.jsx(n.code,{children:`== URL

[Your app's URL]

== Reason

[Why your organization has limited financial resources]
`})})]})]}),`
`,e.jsx("h2",{id:"see-also",children:"See also"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(d,{href:"/pricing"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(d,{href:"/license"}),`
`]}),`
`]})]})}function K(t={}){const{wrapper:n}={...S(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(v,{...t})}):v(t)}const Q=Object.freeze(Object.defineProperty({__proto__:null,default:K,extendedBody:k,freeForeverBody:y,pageSectionsExport:Z},Symbol.toStringTag,{value:"Module"})),be={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:C}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:T}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/free/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:Q}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{be as configValuesSerialized};
