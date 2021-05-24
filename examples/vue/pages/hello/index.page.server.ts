export { addContextProps }
export { prerender }

async function addContextProps({ contextProps }: { contextProps: { routeParams: { name: string } } }) {
  const { name } = contextProps.routeParams
  const pageProps = { name }
  return {
    pageProps
  }
}

function prerender() {
  const names = ['evan', 'rom', 'alice', 'jon', 'eli']
  const urls = names.map((name) => `/hello/${name}`)
  return urls
}
