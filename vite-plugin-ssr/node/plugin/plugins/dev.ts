import type { Plugin } from 'vite'

export { dev }

function dev(): Plugin {
  return {
    name: 'vite-plugin-ssr:dev',
    apply: 'serve',
    config: () => ({
      ssr: { external: ['vite-plugin-ssr'] },
      optimizeDeps: {
        entries: ['**/*.page.*([a-zA-Z0-9])', '**/*.page.client.*([a-zA-Z0-9])'],
        exclude: [
          // We exclude the client code to support `import.meta.glob()`
          'vite-plugin-ssr/client',
          'vite-plugin-ssr/client/router',
          // We cannot add these to `optimizeDeps.include` because of `pnpm`
          '@brillout/libassert',
          '@brillout/json-s',
          '@brillout/json-s/parse',
          '@brillout/json-s/stringify',
        ],
      },
    }),
  }
}
