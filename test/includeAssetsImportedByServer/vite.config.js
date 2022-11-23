import ssr from 'vite-plugin-ssr/plugin'

export default {
  plugins: [
    ssr({
      includeAssetsImportedByServer: true
    })
  ]
}
