export const errSwc = {
  stack:
    "Error: \n  \u001b[38;2;255;30;30m×\u001b[0m Expected ';', '}' or <eof>\n   ╭─[\u001b[38;2;92;157;255;1;4m/home/rom/code/vike/examples/react-full/pages/hello/+Page.tsx\u001b[0m:1:1]\n \u001b[2m1\u001b[0m │ export default Page\n \u001b[2m2\u001b[0m │ \n \u001b[2m3\u001b[0m │ impeort React from 'react'\n   · \u001b[38;2;246;87;248m───┬───\u001b[0m\u001b[38;2;30;201;212m ─────\u001b[0m\n   ·    \u001b[38;2;246;87;248m╰── \u001b[38;2;246;87;248mThis is the expression part of an expression statement\u001b[0m\u001b[0m\n \u001b[2m4\u001b[0m │ \n \u001b[2m5\u001b[0m │ function Page({ name }: { name: string }) {\n \u001b[2m6\u001b[0m │   return (\n   ╰────\n\n\nCaused by:\n    Syntax Error",
  code: 'GenericFailure',
  line: '1',
  column: '1',
  plugin: 'vite:react-swc',
  id: '/home/rom/code/vike/examples/react-full/pages/hello/+Page.tsx',
  pluginCode:
    'export default Page\n\nimpeort React from \'react\'\n\nfunction Page({ name }: { name: string }) {\n  return (\n    <>\n      <h1>Hello</h1>\n      <p>\n        Hi <b>{name}</b>.\n      </p>\n      <ul>\n        <li>\n          <a href="/hello/eli">/hello/eli</a>\n        </li>\n        <li>\n          <a href="/hello/jon">/hello/jon</a>\n        </li>\n      </ul>\n      <p>\n        Parameterized routes can be defined by exporting a route string in <code>*.page.route.js</code>.\n      </p>\n    </>\n  )\n}\n',
  loc: {
    file: '/home/rom/code/vike/examples/react-full/pages/hello/+Page.tsx',
    line: '1',
    column: '1'
  },
  frame: '1  |  /home/rom/code/vike/examples/react-full/pages/hello/+Page.tsx\n   |   ^',
  message:
    "\n  \u001b[38;2;255;30;30m×\u001b[0m Expected ';', '}' or <eof>\n   ╭─[\u001b[38;2;92;157;255;1;4m/home/rom/code/vike/examples/react-full/pages/hello/+Page.tsx\u001b[0m:1:1]\n \u001b[2m1\u001b[0m │ export default Page\n \u001b[2m2\u001b[0m │ \n \u001b[2m3\u001b[0m │ impeort React from 'react'\n   · \u001b[38;2;246;87;248m───┬───\u001b[0m\u001b[38;2;30;201;212m ─────\u001b[0m\n   ·    \u001b[38;2;246;87;248m╰── \u001b[38;2;246;87;248mThis is the expression part of an expression statement\u001b[0m\u001b[0m\n \u001b[2m4\u001b[0m │ \n \u001b[2m5\u001b[0m │ function Page({ name }: { name: string }) {\n \u001b[2m6\u001b[0m │   return (\n   ╰────\n\n\nCaused by:\n    Syntax Error"
}
