// https://vike.dev/onError
export { onError }

function onError(pageContext) {
  console.error('onError hook:', pageContext.errorWhileRendering.message)
}
