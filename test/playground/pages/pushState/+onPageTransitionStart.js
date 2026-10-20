export { onPageTransitionStart }

function onPageTransitionStart() {
  window.pageTransitionHooks ??= []
  window.pageTransitionHooks.push('start')
}
