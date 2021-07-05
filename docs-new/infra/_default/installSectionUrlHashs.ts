import { assert, determineSectionUrlHash } from '../../utils'

installSectionUrlHashs()

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
    }
  })
}
