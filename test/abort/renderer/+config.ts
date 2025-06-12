export default {
  clientRouting: true,
  hydrationCanBeAborted: true,
  passToClient: ['user'],
  redirects: {
    '/permanent-redirect': '/',
    '/star-wars-api/*': 'https://brillout.github.io/star-wars/api/*',
  },
}
