import { renderToString } from 'react-dom/server'
import { dangerouslySkipEscape } from 'vite-plugin-ssr'

export { render }

async function render(pageContext) {
  const { Page } = pageContext
  const pageHtml = renderToString(<Page />)

  // This is a plain string: we don't use the `escapeInject` template tag
  const htmlString = `<!DOCTYPE html>
    <html>
      <body>
        <div id="react-root">${pageHtml}</div>
      </body>
    </html>`

  return dangerouslySkipEscape(htmlString)
}
