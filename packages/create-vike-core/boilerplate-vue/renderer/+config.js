export { config as default }

// https://vike.dev/config
const config = {
  // https://vike.dev/clientRouting
  clientRouting: true,
  hydrationCanBeAborted: false,

  // https://vike.dev/meta
  meta: {
    // Define new setting 'title'
    title: {
      env: { server: true, client: true },
    },
    // Define new setting 'description'
    description: {
      env: { server: true },
    },
  },
}
