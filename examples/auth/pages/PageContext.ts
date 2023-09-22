declare global {
  namespace Vike {
    export interface PageContext {
      userFullName?: string
      user?: {
        isAdmin: boolean
      }
    }
  }
}

// Tell TypeScript that this file isn't an ambient module
export {}
