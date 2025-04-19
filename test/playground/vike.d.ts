declare global {
  namespace Vike {
    interface PageContext {
      someWrapperObj: {
        neverPassedToClient?: 123
        staticUrls: string[]
      }
    }
    interface GlobalContext {
      // Pass to client-side
      setGloballyServer?: number
    }
    interface GlobalContextClient {
      setGloballyClient?: number
    }
    interface GlobalContextServer {
      setGloballyClient?: undefined
      notPassedToClient?: number
    }
  }
}

export {}
