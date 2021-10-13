export { isNotNewTabLink }

function isNotNewTabLink(linkTag: HTMLElement) {
  const target = linkTag.getAttribute('target')
  const rel = linkTag.getAttribute('rel')
  return target !== '_blank' && target !== '_external' && rel !== 'external' && !linkTag.hasAttribute('download')
}
