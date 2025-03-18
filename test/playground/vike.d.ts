declare global {
  namespace Vike {
    interface PageContext {
      someWrapperObj: {
        neverPassedToClient?: 123
        staticUrls: string[]
      }
    }
  }
}

export {}
