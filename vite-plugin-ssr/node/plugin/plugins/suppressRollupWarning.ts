// Suppress Rollup warnings `Generated an empty chunk: "index.page.server"`

export { suppressRollupWarning }

import type { Plugin } from 'vite'
import type { RollupWarning } from 'rollup'

function suppressRollupWarning(): Plugin {
  return {
    name: 'vite-plugin-ssr:suppressRollupWarning',
    apply: 'build',
    enforce: 'post',
    async configResolved(config) {
      const onWarnOriginal = config.build.rollupOptions.onwarn
      config.build.rollupOptions.onwarn = function (warning, warn) {
        // Suppress
        if (suppressUselessUnusedWarning(warning)) return
        if (warning.code === 'EMPTY_BUNDLE') return

        // Pass through
        if (onWarnOriginal) {
          onWarnOriginal.apply(this, arguments as any)
        } else {
          warn(warning)
        }
      }
    }
  }
}

function suppressUselessUnusedWarning(warning: RollupWarning & { ids?: string[] }): boolean {
  if (warning.code !== 'UNUSED_EXTERNAL_IMPORT') return false
  // I guess it's expected that JSX contains unsused `import React from 'react'`?
  if (warning.exporter === 'react' && warning.names?.includes('default')) return true
  // If some library does something unexpected, that mostly isn't actionable
  if (warning.ids?.some((id) => id.includes('/node_modules/'))) return true
  return false
  /* Original warning:
  warning {
    code: 'UNUSED_EXTERNAL_IMPORT',
    exporter: 'react',
    ids: [
      '/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@apollo+client@3.7.10_gdcq4dv6opitr3wbfwyjmanyra/node_modules/@apollo/client/react/ssr/getDataFromTree.js',
      '/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@apollo+client@3.7.10_gdcq4dv6opitr3wbfwyjmanyra/node_modules/@apollo/client/react/context/ApolloContext.js',
      '/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@apollo+client@3.7.10_gdcq4dv6opitr3wbfwyjmanyra/node_modules/@apollo/client/react/context/ApolloProvider.js',
      '/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@apollo+client@3.7.10_gdcq4dv6opitr3wbfwyjmanyra/node_modules/@apollo/client/react/hooks/useApolloClient.js',
      '/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@apollo+client@3.7.10_gdcq4dv6opitr3wbfwyjmanyra/node_modules/@apollo/client/react/hooks/useMutation.js',
      '/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@apollo+client@3.7.10_gdcq4dv6opitr3wbfwyjmanyra/node_modules/@apollo/client/react/hooks/useLazyQuery.js',
      '/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@apollo+client@3.7.10_gdcq4dv6opitr3wbfwyjmanyra/node_modules/@apollo/client/react/hooks/useSubscription.js',
      '/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@apollo+client@3.7.10_gdcq4dv6opitr3wbfwyjmanyra/node_modules/@apollo/client/react/hooks/useReactiveVar.js',
      '/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@apollo+client@3.7.10_gdcq4dv6opitr3wbfwyjmanyra/node_modules/@apollo/client/react/context/ApolloConsumer.js',
      '/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@apollo+client@3.7.10_gdcq4dv6opitr3wbfwyjmanyra/node_modules/@apollo/client/react/hooks/useFragment.js',
      '/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@apollo+client@3.7.10_gdcq4dv6opitr3wbfwyjmanyra/node_modules/@apollo/client/react/hooks/useSyncExternalStore.js',
      '/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@apollo+client@3.7.10_gdcq4dv6opitr3wbfwyjmanyra/node_modules/@apollo/client/react/hooks/useQuery.js',
      '/home/rom/code/vite-plugin-ssr/examples/graphql-apollo-react/pages/index.page.jsx',
      '/home/rom/code/vite-plugin-ssr/examples/graphql-apollo-react/renderer/App.jsx',
      '/home/rom/code/vite-plugin-ssr/examples/graphql-apollo-react/renderer/_default.page.server.jsx'
    ],
    message: '"default" is imported from external module "react" but never used in "../../node_modules/.pnpm/@apollo+client@3.7.10_gdcq4dv6opitr3wbfwyjmanyra/node_modules/@apollo/client/react/ssr/getDataFromTree.js", "../../node_modules/.pnpm/@apollo+client@3.7.10_gdcq4dv6opitr3wbfwyjmanyra/node_modules/@apollo/client/react/context/ApolloContext.js", "../../node_modules/.pnpm/@apollo+client@3.7.10_gdcq4dv6opitr3wbfwyjmanyra/node_modules/@apollo/client/react/context/ApolloProvider.js", "../../node_modules/.pnpm/@apollo+client@3.7.10_gdcq4dv6opitr3wbfwyjmanyra/node_modules/@apollo/client/react/hooks/useApolloClient.js", "../../node_modules/.pnpm/@apollo+client@3.7.10_gdcq4dv6opitr3wbfwyjmanyra/node_modules/@apollo/client/react/hooks/useMutation.js", "../../node_modules/.pnpm/@apollo+client@3.7.10_gdcq4dv6opitr3wbfwyjmanyra/node_modules/@apollo/client/react/hooks/useLazyQuery.js", "../../node_modules/.pnpm/@apollo+client@3.7.10_gdcq4dv6opitr3wbfwyjmanyra/node_modules/@apollo/client/react/hooks/useSubscription.js", "../../node_modules/.pnpm/@apollo+client@3.7.10_gdcq4dv6opitr3wbfwyjmanyra/node_modules/@apollo/client/react/hooks/useReactiveVar.js", "../../node_modules/.pnpm/@apollo+client@3.7.10_gdcq4dv6opitr3wbfwyjmanyra/node_modules/@apollo/client/react/context/ApolloConsumer.js", "../../node_modules/.pnpm/@apollo+client@3.7.10_gdcq4dv6opitr3wbfwyjmanyra/node_modules/@apollo/client/react/hooks/useFragment.js", "../../node_modules/.pnpm/@apollo+client@3.7.10_gdcq4dv6opitr3wbfwyjmanyra/node_modules/@apollo/client/react/hooks/useSyncExternalStore.js", "../../node_modules/.pnpm/@apollo+client@3.7.10_gdcq4dv6opitr3wbfwyjmanyra/node_modules/@apollo/client/react/hooks/useQuery.js", "pages/index.page.jsx", "renderer/App.jsx" and "renderer/_default.page.server.jsx".',
    names: [ 'default' ],
    toString: [Function (anonymous)]
  }
  */
}
