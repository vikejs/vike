export default onPageTransitionEnd

function onPageTransitionEnd() {
  document.body.dataset.pageTransition = 'end'
}
