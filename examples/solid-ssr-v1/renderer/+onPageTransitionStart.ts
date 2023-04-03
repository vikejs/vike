function onPageTransitionEnd() {
  document.querySelector("body")?.classList.remove("page-is-transitioning");
}

export default onPageTransitionEnd;
