export { prepareGlobalContextForPublicUsage }

// TO-DO/eventually: also wrap globalContext with a ES proxy
function prepareGlobalContextForPublicUsage(globalContext: Record<string, unknown>) {
  return globalContext
}
