import{o as c,a as p}from"../chunks/chunk-C7R3qxFT.js";import{j as e}from"../chunks/chunk-DI-SWhZT.js";import{L as s}from"../chunks/chunk-CXfXKu0-.js";/* empty css                      */import{C as o}from"../chunks/chunk-BXP9DoAr.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */import{a as d}from"../chunks/chunk-BHB2b-yl.js";/* empty css                      *//* empty css                      *//* empty css                      *//* empty css                      */const h=[{pageSectionId:"workaround",pageSectionLevel:2,pageSectionTitle:"Workaround"},{pageSectionId:"ssr-noexternal",pageSectionLevel:3,pageSectionTitle:"`ssr.noExternal`"},{pageSectionId:"vite-plugin-cjs-interop",pageSectionLevel:3,pageSectionTitle:"`vite-plugin-cjs-interop`"},{pageSectionId:"ssr-opt-out",pageSectionLevel:3,pageSectionTitle:"SSR opt-out"},{pageSectionId:"why",pageSectionLevel:2,pageSectionTitle:"Why"},{pageSectionId:"common-errors",pageSectionLevel:2,pageSectionTitle:"Common errors"},{pageSectionId:"cannot-use-import-statement-outside-a-module",pageSectionLevel:3,pageSectionTitle:"Cannot use import statement outside a module"},{pageSectionId:"named-export-not-found",pageSectionLevel:3,pageSectionTitle:"Named export not found"},{pageSectionId:"err-module-not-found",pageSectionLevel:3,pageSectionTitle:"ERR_MODULE_NOT_FOUND"},{pageSectionId:"err-unsupported-dir-import",pageSectionLevel:3,pageSectionTitle:"ERR_UNSUPPORTED_DIR_IMPORT"},{pageSectionId:"err-unknown-file-extension",pageSectionLevel:3,pageSectionTitle:"ERR_UNKNOWN_FILE_EXTENSION"},{pageSectionId:"cannot-read-properties-of-undefined",pageSectionLevel:3,pageSectionTitle:"Cannot read properties of undefined"},{pageSectionId:"react-invalid-component",pageSectionLevel:3,pageSectionTitle:"React invalid component"}];function i(a){const n={a:"a",blockquote:"blockquote",code:"code",div:"div",figure:"figure",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...d(),...a.components},{ChoiceGroup:l,ChoiceGroupContainer:r}=n;return l||t("ChoiceGroup"),r||t("ChoiceGroupContainer"),e.jsxs(e.Fragment,{children:[e.jsx(n.p,{children:"Some npm packages contain invalid JavaScript code."}),`
`,e.jsxs(n.p,{children:["See ",e.jsx(s,{href:"#workaround"}),"."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["The reason why some npm packages contain invalid code is because the transpilation process of webpack-based frameworks, most notably Next.js, isn't strict and tolerates erroneous code: thus an npm package can work with Next.js while not work with Vite-based frameworks. You can learn more at ",e.jsx(s,{href:"#why"}),"."]}),`
`,e.jsx(n.p,{children:"The situation will improve and eventually be completely resolved as Vite-based frameworks gain popularity, which we can expect to happen quickly since all frameworks, except for Next.js, are using Vite nowadays."}),`
`]}),`
`,e.jsx("h2",{id:"workaround",children:"Workaround"}),`
`,e.jsx(n.p,{children:"You can workaround problematic npm packages by using on of the following:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"ssr.noExternal"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"vite-plugin-cjs-interop"})}),`
`,e.jsx(n.li,{children:"SSR opt-out"}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["The workarounds usually work. But if you struggle working around a broken npm package then feel free to ",e.jsx(s,{href:"/faq#how-can-i-reach-out-for-help",children:"reach out for help"}),"."]}),`
`]}),`
`,e.jsx("h3",{id:"ssr-noexternal",children:e.jsx("code",{children:"ssr.noExternal"})}),`
`,e.jsx(r,{choiceGroupAll:[{name:"codeLang",choices:[{name:"JavaScript",icon:"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-1 -1 130 130' preserveAspectRatio='xMidYMid meet'%3E%3Cpath fill='%23F0DB4F' d='M1.408 1.408h125.184v125.185H1.408z'/%3E%3Cpath fill='%23323330' d='M116.347 96.736c-.917-5.711-4.641-10.508-15.672-14.981-3.832-1.761-8.104-3.022-9.377-5.926-.452-1.69-.512-2.642-.226-3.665.821-3.32 4.784-4.355 7.925-3.403 2.023.678 3.938 2.237 5.093 4.724 5.402-3.498 5.391-3.475 9.163-5.879-1.381-2.141-2.118-3.129-3.022-4.045-3.249-3.629-7.676-5.498-14.756-5.355l-3.688.477c-3.534.893-6.902 2.748-8.877 5.235-5.926 6.724-4.236 18.492 2.975 23.335 7.104 5.332 17.54 6.545 18.873 11.531 1.297 6.104-4.486 8.08-10.234 7.378-4.236-.881-6.592-3.034-9.139-6.949-4.688 2.713-4.688 2.713-9.508 5.485 1.143 2.499 2.344 3.63 4.26 5.795 9.068 9.198 31.76 8.746 35.83-5.176.165-.478 1.261-3.666.38-8.581zM69.462 58.943H57.753l-.048 30.272c0 6.438.333 12.34-.714 14.149-1.713 3.558-6.152 3.117-8.175 2.427-2.059-1.012-3.106-2.451-4.319-4.485-.333-.584-.583-1.036-.667-1.071l-9.52 5.83c1.583 3.249 3.915 6.069 6.902 7.901 4.462 2.678 10.459 3.499 16.731 2.059 4.082-1.189 7.604-3.652 9.448-7.401 2.666-4.915 2.094-10.864 2.07-17.444.06-10.735.001-21.468.001-32.237z'/%3E%3C/svg%3E",iconStyle:{marginBottom:"0.5px",height:"11.5px"}},{name:"TypeScript",icon:"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-1 -1 130 130' preserveAspectRatio='xMidYMid meet'%3E%3Cpath fill='%23fff' d='M22.67 47h99.67v73.67H22.67z'/%3E%3Cpath data-name='original' fill='%23007acc' d='M1.5 63.91v62.5h125v-125H1.5zm100.73-5a15.56 15.56 0 017.82 4.5 20.58 20.58 0 013 4c0 .16-5.4 3.81-8.69 5.85-.12.08-.6-.44-1.13-1.23a7.09 7.09 0 00-5.87-3.53c-3.79-.26-6.23 1.73-6.21 5a4.58 4.58 0 00.54 2.34c.83 1.73 2.38 2.76 7.24 4.86 8.95 3.85 12.78 6.39 15.16 10 2.66 4 3.25 10.46 1.45 15.24-2 5.2-6.9 8.73-13.83 9.9a38.32 38.32 0 01-9.52-.1 23 23 0 01-12.72-6.63c-1.15-1.27-3.39-4.58-3.25-4.82a9.34 9.34 0 011.15-.73L82 101l3.59-2.08.75 1.11a16.78 16.78 0 004.74 4.54c4 2.1 9.46 1.81 12.16-.62a5.43 5.43 0 00.69-6.92c-1-1.39-3-2.56-8.59-5-6.45-2.78-9.23-4.5-11.77-7.24a16.48 16.48 0 01-3.43-6.25 25 25 0 01-.22-8c1.33-6.23 6-10.58 12.82-11.87a31.66 31.66 0 019.49.26zm-29.34 5.24v5.12H56.66v46.23H45.15V69.26H28.88v-5a49.19 49.19 0 01.12-5.17C29.08 59 39 59 51 59h21.83z'/%3E%3C/svg%3E",iconStyle:{marginBottom:"0.5px",height:"11.5px"}}],default:"JavaScript",emptyChoices:[],alwaysShow:!1,hidden:!1,lvl:0,isBuiltIn:!0}],children:e.jsxs(l,{choiceGroup:{name:"codeLang",choices:[{name:"JavaScript",icon:"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-1 -1 130 130' preserveAspectRatio='xMidYMid meet'%3E%3Cpath fill='%23F0DB4F' d='M1.408 1.408h125.184v125.185H1.408z'/%3E%3Cpath fill='%23323330' d='M116.347 96.736c-.917-5.711-4.641-10.508-15.672-14.981-3.832-1.761-8.104-3.022-9.377-5.926-.452-1.69-.512-2.642-.226-3.665.821-3.32 4.784-4.355 7.925-3.403 2.023.678 3.938 2.237 5.093 4.724 5.402-3.498 5.391-3.475 9.163-5.879-1.381-2.141-2.118-3.129-3.022-4.045-3.249-3.629-7.676-5.498-14.756-5.355l-3.688.477c-3.534.893-6.902 2.748-8.877 5.235-5.926 6.724-4.236 18.492 2.975 23.335 7.104 5.332 17.54 6.545 18.873 11.531 1.297 6.104-4.486 8.08-10.234 7.378-4.236-.881-6.592-3.034-9.139-6.949-4.688 2.713-4.688 2.713-9.508 5.485 1.143 2.499 2.344 3.63 4.26 5.795 9.068 9.198 31.76 8.746 35.83-5.176.165-.478 1.261-3.666.38-8.581zM69.462 58.943H57.753l-.048 30.272c0 6.438.333 12.34-.714 14.149-1.713 3.558-6.152 3.117-8.175 2.427-2.059-1.012-3.106-2.451-4.319-4.485-.333-.584-.583-1.036-.667-1.071l-9.52 5.83c1.583 3.249 3.915 6.069 6.902 7.901 4.462 2.678 10.459 3.499 16.731 2.059 4.082-1.189 7.604-3.652 9.448-7.401 2.666-4.915 2.094-10.864 2.07-17.444.06-10.735.001-21.468.001-32.237z'/%3E%3C/svg%3E",iconStyle:{marginBottom:"0.5px",height:"11.5px"}},{name:"TypeScript",icon:"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-1 -1 130 130' preserveAspectRatio='xMidYMid meet'%3E%3Cpath fill='%23fff' d='M22.67 47h99.67v73.67H22.67z'/%3E%3Cpath data-name='original' fill='%23007acc' d='M1.5 63.91v62.5h125v-125H1.5zm100.73-5a15.56 15.56 0 017.82 4.5 20.58 20.58 0 013 4c0 .16-5.4 3.81-8.69 5.85-.12.08-.6-.44-1.13-1.23a7.09 7.09 0 00-5.87-3.53c-3.79-.26-6.23 1.73-6.21 5a4.58 4.58 0 00.54 2.34c.83 1.73 2.38 2.76 7.24 4.86 8.95 3.85 12.78 6.39 15.16 10 2.66 4 3.25 10.46 1.45 15.24-2 5.2-6.9 8.73-13.83 9.9a38.32 38.32 0 01-9.52-.1 23 23 0 01-12.72-6.63c-1.15-1.27-3.39-4.58-3.25-4.82a9.34 9.34 0 011.15-.73L82 101l3.59-2.08.75 1.11a16.78 16.78 0 004.74 4.54c4 2.1 9.46 1.81 12.16-.62a5.43 5.43 0 00.69-6.92c-1-1.39-3-2.56-8.59-5-6.45-2.78-9.23-4.5-11.77-7.24a16.48 16.48 0 01-3.43-6.25 25 25 0 01-.22-8c1.33-6.23 6-10.58 12.82-11.87a31.66 31.66 0 019.49.26zm-29.34 5.24v5.12H56.66v46.23H45.15V69.26H28.88v-5a49.19 49.19 0 01.12-5.17C29.08 59 39 59 51 59h21.83z'/%3E%3C/svg%3E",iconStyle:{marginBottom:"0.5px",height:"11.5px"}}],default:"JavaScript",emptyChoices:[],alwaysShow:!1,hidden:!1,lvl:0,isBuiltIn:!0},children:[e.jsx(n.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// vite.config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  ssr: {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // Add problematic npm package here:"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"    noExternal: ["}),e.jsx(n.span,{style:{color:"#032F62"},children:"'some-npm-package'"}),e.jsx(n.span,{style:{color:"#24292E"},children:"]"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(n.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// vite.config.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { UserConfig } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vite'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  ssr: {"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"    // Add problematic npm package here:"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"    noExternal: ["}),e.jsx(n.span,{style:{color:"#032F62"},children:"'some-npm-package'"}),e.jsx(n.span,{style:{color:"#24292E"},children:"]"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"} "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" UserConfig"})]})]})})})})]})}),`
`,e.jsxs(n.p,{children:["See ",e.jsxs(n.a,{href:"https://vitejs.dev/config/ssr-options.html#ssr-noexternal",children:["Vite > ",e.jsx(n.code,{children:"ssr.noExternal"})]}),"."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["You may need to add nested npm packages to ",e.jsx(n.code,{children:"ssr.noExternal"}),', because CJS/ESM issues sometimes cascade down along the "',e.jsx(n.code,{children:"noExternal"}),' boundary" as you add npm packages to ',e.jsx(n.code,{children:"ssr.noExternal"}),"."]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["The section ",e.jsx(s,{href:"#why"})," explains why ",e.jsx(n.code,{children:"ssr.noExternal"})," is a workaround."]}),`
`]}),`
`,e.jsx("h3",{id:"vite-plugin-cjs-interop",children:e.jsx("code",{children:"vite-plugin-cjs-interop"})}),`
`,e.jsx(r,{choiceGroupAll:[{name:"codeLang",choices:[{name:"JavaScript",icon:"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-1 -1 130 130' preserveAspectRatio='xMidYMid meet'%3E%3Cpath fill='%23F0DB4F' d='M1.408 1.408h125.184v125.185H1.408z'/%3E%3Cpath fill='%23323330' d='M116.347 96.736c-.917-5.711-4.641-10.508-15.672-14.981-3.832-1.761-8.104-3.022-9.377-5.926-.452-1.69-.512-2.642-.226-3.665.821-3.32 4.784-4.355 7.925-3.403 2.023.678 3.938 2.237 5.093 4.724 5.402-3.498 5.391-3.475 9.163-5.879-1.381-2.141-2.118-3.129-3.022-4.045-3.249-3.629-7.676-5.498-14.756-5.355l-3.688.477c-3.534.893-6.902 2.748-8.877 5.235-5.926 6.724-4.236 18.492 2.975 23.335 7.104 5.332 17.54 6.545 18.873 11.531 1.297 6.104-4.486 8.08-10.234 7.378-4.236-.881-6.592-3.034-9.139-6.949-4.688 2.713-4.688 2.713-9.508 5.485 1.143 2.499 2.344 3.63 4.26 5.795 9.068 9.198 31.76 8.746 35.83-5.176.165-.478 1.261-3.666.38-8.581zM69.462 58.943H57.753l-.048 30.272c0 6.438.333 12.34-.714 14.149-1.713 3.558-6.152 3.117-8.175 2.427-2.059-1.012-3.106-2.451-4.319-4.485-.333-.584-.583-1.036-.667-1.071l-9.52 5.83c1.583 3.249 3.915 6.069 6.902 7.901 4.462 2.678 10.459 3.499 16.731 2.059 4.082-1.189 7.604-3.652 9.448-7.401 2.666-4.915 2.094-10.864 2.07-17.444.06-10.735.001-21.468.001-32.237z'/%3E%3C/svg%3E",iconStyle:{marginBottom:"0.5px",height:"11.5px"}},{name:"TypeScript",icon:"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-1 -1 130 130' preserveAspectRatio='xMidYMid meet'%3E%3Cpath fill='%23fff' d='M22.67 47h99.67v73.67H22.67z'/%3E%3Cpath data-name='original' fill='%23007acc' d='M1.5 63.91v62.5h125v-125H1.5zm100.73-5a15.56 15.56 0 017.82 4.5 20.58 20.58 0 013 4c0 .16-5.4 3.81-8.69 5.85-.12.08-.6-.44-1.13-1.23a7.09 7.09 0 00-5.87-3.53c-3.79-.26-6.23 1.73-6.21 5a4.58 4.58 0 00.54 2.34c.83 1.73 2.38 2.76 7.24 4.86 8.95 3.85 12.78 6.39 15.16 10 2.66 4 3.25 10.46 1.45 15.24-2 5.2-6.9 8.73-13.83 9.9a38.32 38.32 0 01-9.52-.1 23 23 0 01-12.72-6.63c-1.15-1.27-3.39-4.58-3.25-4.82a9.34 9.34 0 011.15-.73L82 101l3.59-2.08.75 1.11a16.78 16.78 0 004.74 4.54c4 2.1 9.46 1.81 12.16-.62a5.43 5.43 0 00.69-6.92c-1-1.39-3-2.56-8.59-5-6.45-2.78-9.23-4.5-11.77-7.24a16.48 16.48 0 01-3.43-6.25 25 25 0 01-.22-8c1.33-6.23 6-10.58 12.82-11.87a31.66 31.66 0 019.49.26zm-29.34 5.24v5.12H56.66v46.23H45.15V69.26H28.88v-5a49.19 49.19 0 01.12-5.17C29.08 59 39 59 51 59h21.83z'/%3E%3C/svg%3E",iconStyle:{marginBottom:"0.5px",height:"11.5px"}}],default:"JavaScript",emptyChoices:[],alwaysShow:!1,hidden:!1,lvl:0,isBuiltIn:!0}],children:e.jsxs(l,{choiceGroup:{name:"codeLang",choices:[{name:"JavaScript",icon:"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-1 -1 130 130' preserveAspectRatio='xMidYMid meet'%3E%3Cpath fill='%23F0DB4F' d='M1.408 1.408h125.184v125.185H1.408z'/%3E%3Cpath fill='%23323330' d='M116.347 96.736c-.917-5.711-4.641-10.508-15.672-14.981-3.832-1.761-8.104-3.022-9.377-5.926-.452-1.69-.512-2.642-.226-3.665.821-3.32 4.784-4.355 7.925-3.403 2.023.678 3.938 2.237 5.093 4.724 5.402-3.498 5.391-3.475 9.163-5.879-1.381-2.141-2.118-3.129-3.022-4.045-3.249-3.629-7.676-5.498-14.756-5.355l-3.688.477c-3.534.893-6.902 2.748-8.877 5.235-5.926 6.724-4.236 18.492 2.975 23.335 7.104 5.332 17.54 6.545 18.873 11.531 1.297 6.104-4.486 8.08-10.234 7.378-4.236-.881-6.592-3.034-9.139-6.949-4.688 2.713-4.688 2.713-9.508 5.485 1.143 2.499 2.344 3.63 4.26 5.795 9.068 9.198 31.76 8.746 35.83-5.176.165-.478 1.261-3.666.38-8.581zM69.462 58.943H57.753l-.048 30.272c0 6.438.333 12.34-.714 14.149-1.713 3.558-6.152 3.117-8.175 2.427-2.059-1.012-3.106-2.451-4.319-4.485-.333-.584-.583-1.036-.667-1.071l-9.52 5.83c1.583 3.249 3.915 6.069 6.902 7.901 4.462 2.678 10.459 3.499 16.731 2.059 4.082-1.189 7.604-3.652 9.448-7.401 2.666-4.915 2.094-10.864 2.07-17.444.06-10.735.001-21.468.001-32.237z'/%3E%3C/svg%3E",iconStyle:{marginBottom:"0.5px",height:"11.5px"}},{name:"TypeScript",icon:"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-1 -1 130 130' preserveAspectRatio='xMidYMid meet'%3E%3Cpath fill='%23fff' d='M22.67 47h99.67v73.67H22.67z'/%3E%3Cpath data-name='original' fill='%23007acc' d='M1.5 63.91v62.5h125v-125H1.5zm100.73-5a15.56 15.56 0 017.82 4.5 20.58 20.58 0 013 4c0 .16-5.4 3.81-8.69 5.85-.12.08-.6-.44-1.13-1.23a7.09 7.09 0 00-5.87-3.53c-3.79-.26-6.23 1.73-6.21 5a4.58 4.58 0 00.54 2.34c.83 1.73 2.38 2.76 7.24 4.86 8.95 3.85 12.78 6.39 15.16 10 2.66 4 3.25 10.46 1.45 15.24-2 5.2-6.9 8.73-13.83 9.9a38.32 38.32 0 01-9.52-.1 23 23 0 01-12.72-6.63c-1.15-1.27-3.39-4.58-3.25-4.82a9.34 9.34 0 011.15-.73L82 101l3.59-2.08.75 1.11a16.78 16.78 0 004.74 4.54c4 2.1 9.46 1.81 12.16-.62a5.43 5.43 0 00.69-6.92c-1-1.39-3-2.56-8.59-5-6.45-2.78-9.23-4.5-11.77-7.24a16.48 16.48 0 01-3.43-6.25 25 25 0 01-.22-8c1.33-6.23 6-10.58 12.82-11.87a31.66 31.66 0 019.49.26zm-29.34 5.24v5.12H56.66v46.23H45.15V69.26H28.88v-5a49.19 49.19 0 01.12-5.17C29.08 59 39 59 51 59h21.83z'/%3E%3C/svg%3E",iconStyle:{marginBottom:"0.5px",height:"11.5px"}}],default:"JavaScript",emptyChoices:[],alwaysShow:!1,hidden:!1,lvl:0,isBuiltIn:!0},children:[e.jsx(n.div,{"data-choice-value":"JavaScript",className:"choice",children:e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// vite.config.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { cjsInterop } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vite-plugin-cjs-interop'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  plugins: ["})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"    cjsInterop"}),e.jsx(n.span,{style:{color:"#24292E"},children:"({"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"      // Add broken npm package here"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"      dependencies: ["})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"        // Apply patch to root import:"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"        //   import someImport from 'some-package'"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#032F62"},children:"        'some-package'"}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"        // Apply patch to all sub imports:"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"        //   import someImport from 'some-package/path'"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"        //   import someImport from 'some-package/sub/path'"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"        //   ..."})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#032F62"},children:"        'some-package/**'"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"      ]"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    })"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  ]"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})})}),e.jsx(n.div,{"data-choice-value":"TypeScript",className:"choice",children:e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"ts","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"ts","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// vite.config.ts"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" type"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { UserConfig } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'vite'"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { cjsInterop } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:' "vite-plugin-cjs-interop"'})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"export"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" default"}),e.jsx(n.span,{style:{color:"#24292E"},children:" {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  plugins: ["})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"    cjsInterop"}),e.jsx(n.span,{style:{color:"#24292E"},children:"({"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"      // Add broken npm package here"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"      dependencies: ["})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"        // Apply patch to root import:"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"        //   import someImport from 'some-package'"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#032F62"},children:'        "some-package"'}),e.jsx(n.span,{style:{color:"#24292E"},children:","})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"        // Apply patch to all sub imports:"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"        //   import someImport from 'some-package/path'"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"        //   import someImport from 'some-package/sub/path'"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"        //   ..."})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#032F62"},children:'        "some-package/**"'})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"      ]"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    })"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  ]"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#24292E"},children:"} "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"satisfies"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" UserConfig"})]})]})})})})]})}),`
`,e.jsxs(n.p,{children:["See ",e.jsxs(n.a,{href:"https://github.com/cyco130/vite-plugin-cjs-interop",children:["GitHub > ",e.jsx(n.code,{children:"cyco130/vite-plugin-cjs-interop"})]}),"."]}),`
`,e.jsxs(n.p,{children:["For the following errors, we recommend trying ",e.jsx(n.code,{children:"vite-plugin-cjs-interop"})," before trying ",e.jsx(n.code,{children:"ssr.noExternal"}),":"]}),`
`,e.jsx(s,{href:"#react-invalid-component",children:e.jsx(n.strong,{children:"React invalid component"})}),`
`,e.jsx(o,{lineBreak:"white-space",children:e.jsx(n.pre,{children:e.jsx(n.code,{children:`Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: something-else.
`})})}),`
`,e.jsx(s,{href:"#named-export-not-found",children:e.jsx(n.strong,{children:"Named export not found"})}),`
`,e.jsx(o,{lineBreak:"white-space",children:e.jsx(n.pre,{children:e.jsx(n.code,{children:`SyntaxError: Named export 'SomeImport' not found. The requested module 'some-library' is a CommonJS module, which may not support all module.exports as named exports.
`})})}),`
`,e.jsx("h3",{id:"ssr-opt-out",children:"SSR opt-out"}),`
`,e.jsxs(n.p,{children:["As a last resort, if both ",e.jsx(n.code,{children:"ssr.noExternal"})," and ",e.jsx(n.code,{children:"vite-plugin-cjs-interop"})," doesn't work, you can opt out of SSR:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/ClientOnly"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"/ssr"}),`
`]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Opting out of SSR almost always works, see explanation at ",e.jsx(s,{href:"#why"}),"."]}),`
`]}),`
`,e.jsx("h2",{id:"why",children:"Why"}),`
`,e.jsx(n.p,{children:"You may ask yourself how it's possible that an npm package can publish invalid JavaScript code that doesn't get fixed for months."}),`
`,e.jsxs(n.p,{children:["The main reason is that some frameworks such as Next.js transpile the server-side code of npm packages, whereas Vite transpiles only the client-side code of npm packages. When server-side code contains invalid JavaScript then Node.js crashes and throws one of ",e.jsx(s,{href:"#common-errors",children:"these errors"}),", while transpilers are more tolerant and transform invalid JavaScript (that Node.js isn't able to execute) into valid JavaScript (that Node.js is able to execute)."]}),`
`,e.jsx(n.p,{children:"By default, Vite doesn't transpile the server-side code of npm packages for a much faster DX, so that Node.js directly executes the server-side code without involving a slow transpilation process."}),`
`,e.jsxs(n.p,{children:["That's why ",e.jsxs(s,{href:"#workaround",children:["adding an npm package to ",e.jsx(n.code,{children:"ssr.noExternal"})]}),` is usually a workaround when the npm package contains invalid JavaScript.
By adding an npm package to `,e.jsx(n.code,{children:"ssr.noExternal"}),", you replicate the behavior of frameworks like Next.js."]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"The issue is most widespread in the React ecosystem because of Next.js's prevalence, but this is going to less and less of an issue as Vite-based React frameworks gain popularity. All frameworks other than Next.js are now Vite-based (e.g. Remix), thus the situation will quickly improve."}),`
`]}),`
`,e.jsx("h2",{id:"common-errors",children:"Common errors"}),`
`,e.jsx(n.p,{children:"Common invalid JavaScript code published by npm packages."}),`
`,e.jsx("h3",{id:"cannot-use-import-statement-outside-a-module",children:"Cannot use import statement outside a module"}),`
`,e.jsx(o,{lineBreak:"white-space",children:e.jsx(n.pre,{children:e.jsx(n.code,{children:`(node:30335) Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.
node_modules/some-library/dist/index.js:1
SyntaxError: Cannot use import statement outside a module
    at Object.compileFunction (node:vm:352:18)
    at wrapSafe (node:internal/modules/cjs/loader:1033:15)
    at Module._compile (node:internal/modules/cjs/loader:1069:27)
    at Module._extensions..js (node:internal/modules/cjs/loader:1159:10)
    at Module.load (node:internal/modules/cjs/loader:981:32)
    at Module._load (node:internal/modules/cjs/loader:827:12)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/translators:170:29)
    at ModuleJob.run (node:internal/modules/esm/module_job:198:25)
    at async Promise.all (index 0)
    at async ESMLoader.import (node:internal/modules/esm/loader:409:24)

Node.js v18.0.0
`})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Node.js's message ",e.jsx(n.code,{children:'set "type": "module" in package.json or use the .mjs extension'})," is misleading because it means the library's ",e.jsx(n.code,{children:"node_modules/some-library/package.json"}),", not your ",e.jsx(n.code,{children:"package.json"}),". It isn't really actionable (unless you patch the library)."]}),`
`]}),`
`,e.jsx(n.p,{children:"Recommended workaround:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(s,{href:"#ssr-noexternal"}),`
`]}),`
`]}),`
`,e.jsx(n.p,{children:"Alternatively, you can try to patch the broken npm package with:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://pnpm.io/package_json#pnpmpackageextensions",children:"pnpm.packageExtensions"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://pnpm.io/cli/patch",children:"pnpm patch"})}),`
`]}),`
`,e.jsx("h3",{id:"named-export-not-found",children:"Named export not found"}),`
`,e.jsx(o,{lineBreak:"white-space",children:e.jsx(n.pre,{children:e.jsx(n.code,{children:`import { SomeImport } from "some-library";
         ^^^^^^^^^^
SyntaxError: Named export 'SomeImport' not found. The requested module 'some-library' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from 'some-library';
const { SomeImport } = pkg;

    at ModuleJob._instantiate (node:internal/modules/esm/module_job:124:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:190:5)

Node.js v18.0.0
`})})}),`
`,e.jsx(n.p,{children:"For default exports, the workaround proposed by Node.js may not work and you may need to do this instead:"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{className:"has-diff",tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(n.span,{className:"diff remove","data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" DefaultImport "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:' "some-library"'}),e.jsx(n.span,{style:{color:"#24292E"},children:"; "})]}),`
`,e.jsxs(n.span,{className:"diff add","data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" pkg "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'some-library'"}),e.jsx(n.span,{style:{color:"#24292E"},children:"; "})]}),`
`,e.jsxs(n.span,{className:"diff add","data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" DefaultImport"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#24292E"},children:" pkg.default "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"??"}),e.jsx(n.span,{style:{color:"#24292E"},children:" pkg; "})]})]})})}),`
`,e.jsxs(n.p,{children:["For a workaround that is global (and TypeScript friendly), see ",e.jsx(s,{href:"#vite-plugin-cjs-interop"}),"."]}),`
`,e.jsx("h3",{id:"err-module-not-found",children:"ERR_MODULE_NOT_FOUND"}),`
`,e.jsx(o,{lineBreak:"white-space",children:e.jsx(n.pre,{children:e.jsx(n.code,{children:`node:internal/process/esm_loader:91
    internalBinding('errors').triggerUncaughtException(
                              ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'node_modules/some-library/dist/some-file' imported from node_modules/some-library/dist/index.js
Did you mean to import some-file.js?
    at new NodeError (node:internal/errors:372:5)
    at finalizeResolution (node:internal/modules/esm/resolve:405:11)
    at moduleResolve (node:internal/modules/esm/resolve:966:10)
    at defaultResolve (node:internal/modules/esm/resolve:1176:11)
    at ESMLoader.resolve (node:internal/modules/esm/loader:605:30)
    at ESMLoader.getModuleJob (node:internal/modules/esm/loader:318:18)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:80:40)
    at link (node:internal/modules/esm/module_job:78:36) {
  code: 'ERR_MODULE_NOT_FOUND'
}

Node.js v18.0.0
`})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["The error is usually thrown when the library's ESM code contains ",e.jsx(n.code,{children:"import './some-file'"}),". (It should be ",e.jsx(n.code,{children:"import './some-file.js'"})," instead, as imports in ESM code are required to include the file extension.)"]}),`
`]}),`
`,e.jsxs(n.p,{children:["Recommended workaround: ",e.jsx(s,{href:"#ssr-noexternal"}),"."]}),`
`,e.jsx("h3",{id:"err-unsupported-dir-import",children:"ERR_UNSUPPORTED_DIR_IMPORT"}),`
`,e.jsx(o,{lineBreak:"white-space",children:e.jsx(n.pre,{children:e.jsx(n.code,{children:`Error [ERR_UNSUPPORTED_DIR_IMPORT]: Directory import 'node_modules/some-library/dist/some-dir/' is not supported resolving ES modules imported from node_modules/some-library/dist/index.js
Did you mean to import ./some-dir/index.js?
    at finalizeResolution (node:internal/modules/esm/resolve:412:17)
`})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"ESM doesn't allow directory imports: all import paths need to point to a filename instead."}),`
`]}),`
`,e.jsxs(n.p,{children:["Recommended workaround: ",e.jsx(s,{href:"#ssr-noexternal"}),"."]}),`
`,e.jsx("h3",{id:"err-unknown-file-extension",children:"ERR_UNKNOWN_FILE_EXTENSION"}),`
`,e.jsxs(n.p,{children:["Another common problem is code importing ",e.jsx(n.code,{children:".css"})," or ",e.jsx(n.code,{children:".ts"})," files which make Node.js crash:"]}),`
`,e.jsx(o,{lineBreak:"white-space",children:e.jsx(n.pre,{children:e.jsx(n.code,{children:`Error: ERR_UNKNOWN_FILE_EXTENSION .css node_modules/some-library/dist/main.css
    at someFunction (node_modules/some-library/dist/main.js)
    at nextLoad (node:internal/modules/esm/loader:163:28)
    at ESMLoader.load (node:internal/modules/esm/loader:605:26)
`})})}),`
`,e.jsxs(n.p,{children:["Recommended workaround: ",e.jsx(s,{href:"#ssr-noexternal"}),"."]}),`
`,e.jsx("h3",{id:"cannot-read-properties-of-undefined",children:"Cannot read properties of undefined"}),`
`,e.jsxs(n.p,{children:["The error ",e.jsx(n.code,{children:"Cannot read properties of undefined"})," is often caused by ESM/CJS issues."]}),`
`,e.jsx(o,{lineBreak:"white-space",children:e.jsx(n.pre,{children:e.jsx(n.code,{children:`TypeError: Cannot read properties of undefined (reading 'someProp')
    at someFunction (node_modules/some-good-lib/dist/index.js:1000:3)
    at someHook (renderer/+someHook.js:13:37)
`})})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"The underlying issue is often this:"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// node_modules/some-good-lib/dist/index.js"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Because of CJS/ESM issues, someImport is undefined"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { someImport } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:" 'some-broken-lib'"})]}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// ..."})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"function"}),e.jsx(n.span,{style:{color:"#6F42C1"},children:" someFunction"}),e.jsx(n.span,{style:{color:"#24292E"},children:"() {"})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"  // TypeError: Cannot read properties of undefined (reading 'someProp')"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  someImport.someProp"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.p,{children:["Sometimes, when dependency injection is used, the ",e.jsx(n.code,{children:"import"})," to ",e.jsx(n.code,{children:"some-broken-lib"}),` isn't in the file in which the
exception is being raised, making it harder to understand which library is broken. See
`,e.jsx(n.a,{href:"https://github.com/vikejs/vike/discussions/1235",children:"here"})," an example of this."]}),`
`]}),`
`,e.jsxs(n.p,{children:["Adding ",e.jsx(n.code,{children:"some-broken-lib"})," to ",e.jsx(s,{href:"#ssr-noexternal",children:e.jsx(n.code,{children:"ssr.noExternal"})})," usually solves the issue."]}),`
`,e.jsxs(n.p,{children:["Alternatively, you can add ",e.jsx(n.code,{children:"some-good-lib"})," to ",e.jsx(n.code,{children:"ssr.noExternal"})," while adding ",e.jsx(n.code,{children:"some-broken-lib"})," to ",e.jsx(s,{href:"#vite-plugin-cjs-interop",children:e.jsx(n.code,{children:"vite-plugin-cjs-interop"})}),"."]}),`
`,e.jsx("h3",{id:"react-invalid-component",children:"React invalid component"}),`
`,e.jsx(n.p,{children:"The following is a common React error and the root cause is usually a CJS/ESM issue."}),`
`,e.jsx(o,{lineBreak:"white-space",children:e.jsx(n.pre,{children:e.jsx(n.code,{children:`Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined.
    at renderElement (node_modules/react-dom/...)
    at renderNodeDestructiveImpl (node_modules/react-dom/...)
    at renderNodeDestructive (node_modules/react-dom/...)
    ...
`})})}),`
`,e.jsxs(n.p,{children:["Or ",e.jsx(n.code,{children:"got: object"}),"."]}),`
`,e.jsx(o,{lineBreak:"white-space",children:e.jsx(n.pre,{children:e.jsx(n.code,{children:`Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.
`})})}),`
`,e.jsx(n.p,{children:"React usually logs a component trace before throwing the error:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`Check your code at +Page.tsx:26.
    at Page
    at div
    at div
    at Layout (/pages/+Layout.tsx:66:19)
`})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["Sometimes React doesn't log a component trace. In that case you can use ",e.jsx(n.a,{href:"https://gist.github.com/brillout/c27b780f009d141acec7bda29d136e6e",children:"this temporary patch"})," to get a component trace."]}),`
`,e.jsxs(n.p,{children:["You can also use the temporary patch to get a more precise component trace. (For example the component trace above says ",e.jsx(n.code,{children:"Check your code at +Page.tsx:26"})," but there can be hundreds of ",e.jsx(n.code,{children:"+Page.tsx"})," files.)"]}),`
`]}),`
`,e.jsxs(n.p,{children:["Use the component trace to find out which component is ",e.jsx(n.code,{children:"undefined"})," / an ",e.jsx(n.code,{children:"object"}),". You'll likely see that the component is imported and that the import value is ",e.jsx(n.code,{children:"undefined"})," / an ",e.jsx(n.code,{children:"object"})," (instead of a React component) because of CJS/ESM interoperability quirks."]}),`
`,e.jsx(n.p,{children:"A local workaround is usually this:"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{className:"has-diff",tabIndex:"0","data-language":"js","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"js","data-theme":"github-light",style:{display:"grid"},children:[e.jsxs(n.span,{className:"diff remove","data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" SomeComponent "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:' "some-npm-package"'})]}),`
`,e.jsxs(n.span,{className:"diff add","data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E"},children:" pkg "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62"},children:' "some-npm-package"'})]}),`
`,e.jsx(n.span,{className:"diff add","data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// This:"})}),`
`,e.jsxs(n.span,{className:"diff add","data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(n.span,{style:{color:"#24292E"},children:" { "}),e.jsx(n.span,{style:{color:"#005CC5"},children:"SomeComponent"}),e.jsx(n.span,{style:{color:"#24292E"},children:" } "}),e.jsx(n.span,{style:{color:"#D73A49"},children:"="}),e.jsx(n.span,{style:{color:"#24292E"},children:" pkg "})]}),`
`,e.jsx(n.span,{className:"diff add","data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"// Or that:"})}),`
`,e.jsxs(n.span,{className:"diff add","data-line":"",children:[e.jsx(n.span,{style:{color:"#D73A49"},children:"const"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" SomeComponent"}),e.jsx(n.span,{style:{color:"#D73A49"},children:" ="}),e.jsx(n.span,{style:{color:"#24292E"},children:" pkg.default "})]})]})})}),`
`,e.jsxs(n.p,{children:["For a workaround that is global (and TypeScript friendly), see ",e.jsx(s,{href:"#vite-plugin-cjs-interop"}),"."]})]})}function x(a={}){const{wrapper:n}={...d(),...a.components};return n?e.jsx(n,{...a,children:e.jsx(i,{...a})}):i(a)}function t(a,n){throw new Error("Expected component `"+a+"` to be defined: you likely forgot to import, pass, or provide it.")}const m=Object.freeze(Object.defineProperty({__proto__:null,default:x,pageSectionsExport:h},Symbol.toStringTag,{value:"Module"})),R={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/renderer/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:p}},onCreatePageContext:{type:"cumulative",definedAtData:[{filePathToShowToUser:"@brillout/docpress/renderer/onCreatePageContext",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"pointer-import",value:c}]},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/broken-npm-package/+Page.mdx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:m}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"@brillout/docpress/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}}};export{R as configValuesSerialized};
