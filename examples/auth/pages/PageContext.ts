// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      userFullName?: string
      user?: {
        isAdmin: boolean
      }
    }
  }
}

// Tell TypeScript that this file isn't an ambient module
export {}
