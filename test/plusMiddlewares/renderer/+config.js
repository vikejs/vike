export default {
  passToClient: ['pageProps'],
  clientRouting: true,
  // Vike's built-in server passes the full URL as `urlOriginal`, whereas plain `$ vike dev` passes the URL's path
  ...(process.env.SERVER && { server: true }),
  redirects: {
    '/old-portal': '/portal',
  },
}
