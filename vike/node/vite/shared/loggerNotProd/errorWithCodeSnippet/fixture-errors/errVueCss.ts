export const errVueCss = {
  name: 'CssSyntaxError',
  reason: 'Unexpected }',
  file: '/home/rom/code/vike/examples/vue-full/renderer/Layout.vue',
  source:
    '\n.layout {\n  display: flex;\n  max-width: 900px;\n  margin: auto;\n}}\n.content {\n  padding: 20px;\n  padding-bottom: 50px;\n  min-height: 100vh;\n}\n.navigation {\n  padding: 20px;\n  flex-shrink: 0;\n  display: flex;\n  flex-direction: column;\n  line-height: 1.8em;\n  border-right: 2px solid #eee;\n}\n.logo {\n  margin-top: 20px;\n  margin-bottom: 10px;\n}\n.content {\n  transition: opacity 0.1s ease-in;\n}\n.content.page-transition {\n  opacity: 0;\n}\n',
  line: 6,
  column: 2,
  endLine: 6,
  endColumn: 3,
  input: {
    line: 6,
    column: 2,
    endLine: 6,
    endColumn: 3,
    source:
      '\n.layout {\n  display: flex;\n  max-width: 900px;\n  margin: auto;\n}}\n.content {\n  padding: 20px;\n  padding-bottom: 50px;\n  min-height: 100vh;\n}\n.navigation {\n  padding: 20px;\n  flex-shrink: 0;\n  display: flex;\n  flex-direction: column;\n  line-height: 1.8em;\n  border-right: 2px solid #eee;\n}\n.logo {\n  margin-top: 20px;\n  margin-bottom: 10px;\n}\n.content {\n  transition: opacity 0.1s ease-in;\n}\n.content.page-transition {\n  opacity: 0;\n}\n',
    url: 'file:///home/rom/code/vike/examples/vue-full/renderer/Layout.vue',
    file: '/home/rom/code/vike/examples/vue-full/renderer/Layout.vue'
  },
  loc: { file: '/home/rom/code/vike/examples/vue-full/renderer/Layout.vue', line: 45, column: 2 },
  id: '/home/rom/code/vike/examples/vue-full/renderer/Layout.vue',
  plugin: 'vite:vue',
  pluginCode:
    '\n.layout {\n  display: flex;\n  max-width: 900px;\n  margin: auto;\n}}\n.content {\n  padding: 20px;\n  padding-bottom: 50px;\n  min-height: 100vh;\n}\n.navigation {\n  padding: 20px;\n  flex-shrink: 0;\n  display: flex;\n  flex-direction: column;\n  line-height: 1.8em;\n  border-right: 2px solid #eee;\n}\n.logo {\n  margin-top: 20px;\n  margin-bottom: 10px;\n}\n.content {\n  transition: opacity 0.1s ease-in;\n}\n.content.page-transition {\n  opacity: 0;\n}\n',
  frame:
    '43 |    margin: auto;\n44 |  }}\n45 |  .content {\n   |    ^\n46 |    padding: 20px;\n47 |    padding-bottom: 50px;',
  message: '/home/rom/code/vike/examples/vue-full/renderer/Layout.vue:6:2: Unexpected }',
  stack:
    'CssSyntaxError: /home/rom/code/vike/examples/vue-full/renderer/Layout.vue:6:2: Unexpected }\n    at Input.error (/home/rom/code/vike/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/input.js:148:16)\n    at Parser.unexpectedClose (/home/rom/code/vike/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/parser.js:548:22)\n    at Parser.end (/home/rom/code/vike/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/parser.js:379:12)\n    at Parser.parse (/home/rom/code/vike/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/parser.js:56:16)\n    at parse (/home/rom/code/vike/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/parse.js:11:12)\n    at new LazyResult (/home/rom/code/vike/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/lazy-result.js:133:16)\n    at Processor.process (/home/rom/code/vike/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/processor.js:28:14)\n    at doCompileStyle (/home/rom/code/vike/node_modules/.pnpm/@vue+compiler-sfc@3.2.33/node_modules/@vue/compiler-sfc/dist/compiler-sfc.cjs.js:17246:45)\n    at Object.compileStyleAsync (/home/rom/code/vike/node_modules/.pnpm/@vue+compiler-sfc@3.2.33/node_modules/@vue/compiler-sfc/dist/compiler-sfc.cjs.js:17188:12)\n    at transformStyle (/home/rom/code/vike/node_modules/.pnpm/@vitejs+plugin-vue@4.2.1_vite@4.3.5_vue@3.2.33/node_modules/@vitejs/plugin-vue/dist/index.cjs:2622:41)'
}
