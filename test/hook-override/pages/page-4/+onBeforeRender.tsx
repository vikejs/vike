export default () => {
  return {
    pageContext: {
      onBeforeRender2WasCalled: 42,
      onBeforeRenderEnv: typeof window === 'undefined' ? 'server' : 'client'
    }
  }
}
