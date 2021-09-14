import { escapeInject } from 'vite-plugin-ssr'

export { render }

function render() {
  // Note how `<b>` is (not) escaped
  const htmlFragment = escapeInject`<b>I was defined by an HTML Fragment</b>`
  const htmlWithoutFragment = `<b>I was defined without an HTML Fragment</b>`

  // Some supported edge cases that are useful to implement conditional HTML Fragments
  const emptyFragment1 = escapeInject``
  const emptyFragment2 = ''

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <h1>Hello</h1>
        <div id="1">${htmlFragment}</div>
        <div id="2">${htmlWithoutFragment}</div>
        <div>Empty Fragments: 0${emptyFragment1}${emptyFragment2}1</div>
      </body>
    </html>`
}
