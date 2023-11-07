export default () => {
  return {
    pageContext: {
      pageProps: {
        timestamp: new Date().getTime()
      }
    }
  }
}
