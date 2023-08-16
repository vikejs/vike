export const errEsbuild = {
  errors: [
    {
      id: '',
      location: {
        column: 20,
        file: '/home/rom/code/vite-plugin-ssr/examples/react-full/renderer/PageShell.tsx',
        length: 1,
        line: 7,
        lineText: 'export { PageShell }}',
        namespace: '',
        suggestion: ''
      },
      notes: [],
      pluginName: '',
      text: 'Unexpected "}"'
    }
  ],
  warnings: [],
  frame:
    '\n\u001b[33mUnexpected "}"\u001b[39m\n5  |  import type { PageContext } from \'./types\'\n6  |  \n7  |  export { PageShell }}\n   |                      ^\n8  |  \n9  |  function PageShell({ pageContext, children }: { pageContext: PageContext; children: React.ReactNode }) {\n',
  loc: {
    column: 20,
    file: '/home/rom/code/vite-plugin-ssr/examples/react-full/renderer/PageShell.tsx',
    length: 1,
    line: 7,
    lineText: 'export { PageShell }}',
    namespace: '',
    suggestion: ''
  },
  plugin: 'vite:esbuild',
  id: '/home/rom/code/vite-plugin-ssr/examples/react-full/renderer/PageShell.tsx',
  pluginCode:
    "import React from 'react'\nimport logoUrl from './logo.svg'\nimport { PageContextProvider } from './usePageContext'\nimport { Link } from './Link'\nimport type { PageContext } from './types'\n\nexport { PageShell }}\n\nfunction PageShell({ pageContext, children }: { pageContext: PageContext; children: React.ReactNode }) {\n  return (\n    <React.StrictMode>\n      <PageContextProvider pageContext={pageContext}>\n        <Layout>\n          <Sidebar>\n            <Logo />\n            <Link href=\"/\">Welcome</Link>\n            <Link href=\"/markdown\">Markdown</Link>\n            <Link href=\"/star-wars\">Data Fetching</Link>\n            <Link href=\"/hello\">Routing</Link>\n          </Sidebar>\n          <Content>{children}</Content>\n        </Layout>\n      </PageContextProvider>\n    </React.StrictMode>\n  )\n}\n\nfunction Layout({ children }: { children: React.ReactNode }) {\n  return (\n    <div\n      style={{\n        display: 'flex',\n        maxWidth: 900,\n        margin: 'auto'\n      }}\n    >\n      {children}\n    </div>\n  )\n}\n\nfunction Sidebar({ children }: { children: React.ReactNode }) {\n  return (\n    <div\n      id=\"sidebar\"\n      style={{\n        padding: 20,\n        flexShrink: 0,\n        display: 'flex',\n        flexDirection: 'column',\n        lineHeight: '1.8em',\n        borderRight: '2px solid #eee'\n      }}\n    >\n      {children}\n    </div>\n  )\n}\n\nfunction Content({ children }: { children: React.ReactNode }) {\n  return (\n    <div id=\"page-container\">\n      <div\n        id=\"page-content\"\n        style={{\n          padding: 20,\n          paddingBottom: 50,\n          minHeight: '100vh.js'\n        }}\n      >\n        {children}\n      </div>\n    </div>\n  )\n}\n\nfunction Logo() {\n  return (\n    <div\n      style={{\n        marginTop: 20,\n        marginBottom: 10\n      }}\n    >\n      <a href=\"/\">\n        <img src={logoUrl} height={64} width={64} />\n      </a>\n    </div>\n  )\n}\n",
  message:
    'Transform failed with 1 error:\n/home/rom/code/vite-plugin-ssr/examples/react-full/renderer/PageShell.tsx:7:20: ERROR: Unexpected "}"',
  stack:
    'Error: Transform failed with 1 error:\n/home/rom/code/vite-plugin-ssr/examples/react-full/renderer/PageShell.tsx:7:20: ERROR: Unexpected "}"\n    at failureErrorWithLog (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/esbuild@0.17.18/node_modules/esbuild/lib/main.js:1636:15)\n    at /home/rom/code/vite-plugin-ssr/node_modules/.pnpm/esbuild@0.17.18/node_modules/esbuild/lib/main.js:837:29\n    at responseCallbacks.<computed> (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/esbuild@0.17.18/node_modules/esbuild/lib/main.js:697:9)\n    at handleIncomingPacket (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/esbuild@0.17.18/node_modules/esbuild/lib/main.js:752:9)\n    at Socket.readFromStdout (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/esbuild@0.17.18/node_modules/esbuild/lib/main.js:673:7)\n    at Socket.emit (node:events:513:28)\n    at addChunk (node:internal/streams/readable:324:12)\n    at readableAddChunk (node:internal/streams/readable:297:9)\n    at Socket.Readable.push (node:internal/streams/readable:234:10)\n    at Pipe.onStreamRead (node:internal/stream_base_commons:190:23)'
}
