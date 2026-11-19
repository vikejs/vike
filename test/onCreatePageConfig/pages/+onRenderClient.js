export { onRenderClient }

function onRenderClient(pageContext) {
  const root = document.getElementById('root')
  if (pageContext.isHydration) root.setAttribute('data-hydrated', '')
  else root.innerHTML = pageContext.Page()
}
