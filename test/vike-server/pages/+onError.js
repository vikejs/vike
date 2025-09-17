// https://vike.dev/onError
export { onError }

function onError(globalContext) {
  console.error('onError hook:', globalContext.errorWhileRendering.message)
}
