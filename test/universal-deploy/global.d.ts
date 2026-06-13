declare global {
  namespace Vike {
    interface Server {
      // The server used by +server.ts (via @vikejs/express). It gives pageContext.runtime — and its pageContext.req/pageContext.res aliases — their types.
      server: 'express'
    }
  }
}

export {}
