declare global {
  namespace Vike {
    interface PageContext {
      someWrapperObj: {
        neverPassedToClient?: 123
        staticUrls: string[]
      }
    }
    interface GlobalContext {
      setGloballyServer?: number
      setGloballyClient?: number
      notPassedToClient?: number
    }
  }
}

export {}
