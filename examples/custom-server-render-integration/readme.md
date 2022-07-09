Example showcasing:
 - Custom HTML delivering. For example, the (now deprecated) HTTP/2 Server Push, or the (work-in-progress) 103 Early Hints.
 - Custom HTML generation.
   ```js
   // We generate an HTML string without using the `escapeInject` template tag
   export function render(pageContext) {
     const pageHtml = renderToHtml(pageContext.Page)
     const htmlString = `<!DOCTYPE html>
       <html>
         <body>
           <div id="react-root">${pageHtml}</div>
         </body>
       </html>`
     return dangerouslySkipEscape(htmlString)
   }
   ```

```bash
git clone git@github.com:brillout/vite-plugin-ssr
cd vite-plugin-ssr/examples/custom-server-render-integration/
npm install
npm run dev
```
