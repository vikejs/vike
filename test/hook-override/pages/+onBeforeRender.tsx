export default () => {
  return {
    pageContext: {
      onBeforeRender1WasCalled: true,
      onBeforeRenderEnv: typeof window === 'undefined' ? 'server' : 'client'
    }
  }
}
