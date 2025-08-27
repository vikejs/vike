export default {
  passToClient: ['pageProps'],
  meta: {
    preloadStrategy: {
      env: { server: true },
    },
  },
  csp: {
    nonce: true,
  },
}
