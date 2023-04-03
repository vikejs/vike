export default {
  passToClient: ['pageProps', 'documentProps'],
  clientRouting: true,
  hydrationCanBeAborted: true,
  meta: {
    Head: {
      env: 'server-only'
    },
    Layout: {
      env: 'server-and-client'
    },
    lang: {
      env: 'server-only'
    }
  }
}
