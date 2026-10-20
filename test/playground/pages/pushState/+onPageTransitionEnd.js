export { onPageTransitionEnd }

function onPageTransitionEnd() {
  window.pageTransitionHooks ??= []
  window.pageTransitionHooks.push('end')
}
