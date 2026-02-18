export default onBeforeRender

function onBeforeRender() {
  // Private env variables are allowed in files that are loaded only on the server-side, which by default is the case for +onBeforeRender.js files
  const data = `begin-${import.meta.env.SOME_THIRD_ENV}-end`
  return {
    pageContext: {
      pageProps: { data },
    },
  }
}
