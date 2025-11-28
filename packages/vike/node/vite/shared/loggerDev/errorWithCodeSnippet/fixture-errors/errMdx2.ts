export const errMdx2 = {
  reason: 'Unexpected closing slash `/` in tag, expected an open tag first',
  line: 23,
  column: 450,
  position: {
    start: {
      line: 23,
      column: 450,
      offset: 1967,
      _index: 0,
      _bufferIndex: 444,
    },
    end: {
      line: 23,
      column: 451,
      offset: 1968,
      _index: 0,
      _bufferIndex: 445,
    },
  },
  source: 'mdast-util-mdx-jsx',
  ruleId: 'unexpected-closing-slash',
  plugin: '@mdx-js/rollup',
  id: '/home/rom/code/vike/docs/pages/abort/+Page.mdx',
  pluginCode:
    "import { Link } from '@brillout/docpress'\n" +
    '\n' +
    'By using <Link href="/render" text={<code>throw render()</code>}></Link> or <Link href="/redirect" text={<code>throw redirect()</code>}></Link> you abort the rendering of the current page and render something else instead.\n' +
    '\n' +
    `<h2 id="throw-redirect-vs-throw-render"><code>{'throw redirect()'}</code>{' VS '}<code>{'throw render()'}</code></h2>\n` +
    '\n' +
    'While `throw redirect()` changes the URL, `throw render()` preserves it:\n' +
    " - If a user goes to `/admin` and `throw redirect('/login')` is called, then the user will see the new URL `/login` in the browser's address bar.\n" +
    " - If a user goes to `/admin` and `throw render('/login')` is called, then the user keeps seeing the same URL `/admin` in the browser's address bar.\n" +
    '\n' +
    "In general, we recommend using `throw render('/login')` instead of `throw redirect('/login')` as it preserves the URL and, therefore, the user's intention. We further explain this techniue at <Link href=\"/auth#login-flow\" />.\n" +
    '\n' +
    '\n' +
    `<h2 id="debug">{'Debug'}</h2>\n` +
    '\n' +
    "If `throw redirect()` or `throw render()` doesn't work:\n" +
    " - **Make sure `throw redirect()` / `throw render()` isn't intercepted.**  \n" +
    "   In development, check your server logs for the following log. If this log is missing then it means that Vike didn't catch the `throw redirect()` / `throw render()` exception: some other code is intercepting it preventing Vike from catching it.\n" +
    '   ```\n' +
    "   10:00:00 AM [vike][request(42)] throw redirect('/some-url') intercepted while\n" +
    '   rendering /some-other-url\n' +
    '   ```\n' +
    '   > Most notably, using `throw redirect()` / `throw render()` inside a UI component usually doesn\'t work because most <Link href="/ui-framework">UI framework</Link> will intercept the exception and thus Vike won\'t be able to catch it. Instead, consider using `throw redirect()` / `throw render()` in a Vike hook such as <Link href="/guard">guard()</Link> or <Link href="/data">data()</Link>, or consider using <Link href="/navigate" />`navigate()`</Link>.\n' +
    ' - **Make sure to use `throw redirect()` / `throw render()` within a Vike hook.**  \n' +
    "   If you use `throw redirect()` / `throw render()` outside of Vike hooks, for example in some server middleware code then Vike won't be able to intercept it.\n" +
    '\n' +
    "If `throw redirect()` doesn't work:\n" +
    ' - **Make sure to add `pageContext.httpResponse.headers` to the HTTP response.**  \n' +
    '   If you\'ve embedded Vike into your server using <Link text={<code>renderPage()</code>} href="/renderPage" />, then inspect whether `pageContext.httpResponse.headers` contains the `Location` header and double check that you\'re correctly adding all the headers defined by `pageContext.httpResponse.headers` to the HTTP response.\n' +
    '\n' +
    '\n' +
    `<h2 id="see-also">{'See also'}</h2>\n` +
    '\n' +
    ' - <Link href="/redirect" />\n' +
    ' - <Link href="/render" />\n' +
    ' - <Link href="/navigate" />\n' +
    '\n' +
    '\n' +
    'export const headings = [{"headingId":"throw-redirect-vs-throw-render","headingLevel":2,"title":"`throw redirect()` VS `throw render()`"}, {"headingId":"debug","headingLevel":2,"title":"Debug"}, {"headingId":"see-also","headingLevel":2,"title":"See also"}];\n',
  loc: {
    file: '/home/rom/code/vike/docs/pages/abort/+Page.mdx',
    start: {
      line: 23,
      column: 450,
      offset: 1967,
      _index: 0,
      _bufferIndex: 444,
    },
    end: {
      line: 23,
      column: 451,
      offset: 1968,
      _index: 0,
      _bufferIndex: 445,
    },
  },
  frame: '',
}
