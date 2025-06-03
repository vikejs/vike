export const errPostcss = {
  name: 'CssSyntaxError',
  reason: 'Unexpected }',
  file: '/home/rom/code/vike/examples/react-full/renderer/css/links.css',
  source:
    'a {\n  text-decoration: none;\n}}\n#sidebar a {\n  padding: 2px 10px;\n  margin-left: -10px;\n}\n#sidebar a.is-active {\n  background-color: #eee;\n}\n',
  line: 3,
  column: 2,
  endLine: 3,
  endColumn: 3,
  input: {
    line: 3,
    column: 2,
    endLine: 3,
    endColumn: 3,
    source:
      'a {\n  text-decoration: none;\n}}\n#sidebar a {\n  padding: 2px 10px;\n  margin-left: -10px;\n}\n#sidebar a.is-active {\n  background-color: #eee;\n}\n',
    url: 'file:///home/rom/code/vike/examples/react-full/renderer/css/links.css',
    file: '/home/rom/code/vike/examples/react-full/renderer/css/links.css'
  },
  plugin: 'vite:css',
  code: "@import './reset.css';\n@import './links.css';\n@import './code.css';\n@import './page-transition-loading-animation.css';\n",
  loc: { column: 2, line: 3 },
  id: '/home/rom/code/vike/examples/react-full/renderer/css/links.css',
  pluginCode:
    "@import './reset.css';\n@import './links.css';\n@import './code.css';\n@import './page-transition-loading-animation.css';\n",
  frame:
    "1  |  @import './reset.css';\n2  |  @import './links.css';\n3  |  @import './code.css';\n   |    ^\n4  |  @import './page-transition-loading-animation.css';\n5  |  ",
  message: '[postcss] postcss-import: /home/rom/code/vike/examples/react-full/renderer/css/links.css:3:2: Unexpected }',
  stack:
    'CssSyntaxError: [postcss] postcss-import: /home/rom/code/vike/examples/react-full/renderer/css/links.css:3:2: Unexpected }\n    at Input.error (/home/rom/code/vike/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/input.js:148:16)\n    at Parser.unexpectedClose (/home/rom/code/vike/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/parser.js:548:22)\n    at Parser.end (/home/rom/code/vike/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/parser.js:379:12)\n    at Parser.parse (/home/rom/code/vike/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/parser.js:56:16)\n    at parse (/home/rom/code/vike/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/parse.js:11:12)\n    at new LazyResult (/home/rom/code/vike/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/lazy-result.js:133:16)\n    at Processor.process (/home/rom/code/vike/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/processor.js:28:14)\n    at runPostcss (file:///home/rom/code/vike/node_modules/.pnpm/vite@4.3.5_@types+node@17.0.45/node_modules/vite/dist/node/chunks/dep-5673ffe5.js:287:6)\n    at processContent (file:///home/rom/code/vike/node_modules/.pnpm/vite@4.3.5_@types+node@17.0.45/node_modules/vite/dist/node/chunks/dep-5673ffe5.js:281:10)\n    at file:///home/rom/code/vike/node_modules/.pnpm/vite@4.3.5_@types+node@17.0.45/node_modules/vite/dist/node/chunks/dep-5673ffe5.js:867:20\n    at async Promise.all (index 0)\n    at LazyResult.runAsync (/home/rom/code/vike/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/lazy-result.js:396:11)\n    at compileCSS (file:///home/rom/code/vike/node_modules/.pnpm/vite@4.3.5_@types+node@17.0.45/node_modules/vite/dist/node/chunks/dep-934dbc7c.js:38483:25)\n    at TransformContext.transform (file:///home/rom/code/vike/node_modules/.pnpm/vite@4.3.5_@types+node@17.0.45/node_modules/vite/dist/node/chunks/dep-934dbc7c.js:37919:56)\n    at Object.transform (file:///home/rom/code/vike/node_modules/.pnpm/vite@4.3.5_@types+node@17.0.45/node_modules/vite/dist/node/chunks/dep-934dbc7c.js:42884:30)\n    at loadAndTransform (file:///home/rom/code/vike/node_modules/.pnpm/vite@4.3.5_@types+node@17.0.45/node_modules/vite/dist/node/chunks/dep-934dbc7c.js:53350:29)'
}
