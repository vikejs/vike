import { assert, determineSectionUrlHash } from '../../utils'

installSectionUrlHashs()
/* Let browser restore previous scroll
jumpToSection()
*/

function installSectionUrlHashs() {
  const docPage = document.getElementById('doc-page')
  if( !docPage ) {
    assert(window.location.pathname==='/')
    return;
  }
  const navigationEl = document.getElementById('navigation')
  assert(navigationEl)
  const docSections = Array.from(document.querySelectorAll('h2'))
  docSections.forEach((docSection) => {
    const docTitle = docSection.textContent
    assert(docTitle)
    const docSectionId = determineSectionUrlHash(docTitle)
    const urlHash = '#'+docSectionId
    const navLinks: HTMLElement[] = Array.from(navigationEl.querySelectorAll(`a[href="${urlHash}"]`))
    assert(navLinks.length===1, {urlHash})
    docSection.id = docSectionId
    docSection.onclick = () => {
      window.location.hash = urlHash
      // The browser doesn't jump if hash doesn't change
      jumpToSection()
    }
  })
}

function jumpToSection() {
  const { hash } = window.location
  if( hash==='' || hash==='#' ){
    return;
  }
  assert(hash.startsWith('#'))
  const target = document.getElementById(hash.slice(1))
  if( !target ) {
    return
  }
  target.scrollIntoView()
}
