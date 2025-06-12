// https://vike.dev/onPageTransitionEnd
export { onPageTransitionEnd }

function onPageTransitionEnd() {
  console.log('Page transition end')
  document.querySelector('body').classList.remove('page-is-transitioning')
}
