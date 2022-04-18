export { injectHtmlSnippet }
export { createHtmlHeadIfMissing }

import { assert, slice } from '../../utils'

function injectHtmlSnippet(
  position: 'HEAD_OPENING' | 'HEAD_CLOSING' | 'DOCUMENT_END',
  htmlSnippet: string,
  htmlString: string,
  streamInjectHtml: null | ((chunk: string) => void),
): string {
  if (position === 'HEAD_OPENING') {
    assert(tagOpeningExists('head', htmlString))
    htmlString = injectAtOpeningTag('head', htmlString, htmlSnippet)
    return htmlString
  }
  if (position === 'HEAD_CLOSING') {
    assert(tagClosingExists('head', htmlString))
    htmlString = injectAtClosingTag('head', htmlString, htmlSnippet)
    return htmlString
  }
  if (position === 'DOCUMENT_END') {
    if (streamInjectHtml) {
      streamInjectHtml(htmlSnippet)
      return htmlString
    }
    if (tagClosingExists('body', htmlString)) {
      return injectAtClosingTag('body', htmlString, htmlSnippet)
    }

    if (tagClosingExists('html', htmlString)) {
      return injectAtClosingTag('html', htmlString, htmlSnippet)
    }

    return htmlString + '\n' + htmlSnippet
  }
  assert(false)
}

function injectAtOpeningTag(tag: 'head' | 'html' | '!doctype', htmlString: string, htmlSnippet: string): string {
  assert(tagOpeningExists(tag, htmlString))

  const openingTag = getTagOpening(tag)
  const matches = htmlString.match(openingTag)
  assert(matches && matches.length >= 1)
  const tagInstance = matches[0]
  assert(tagInstance)
  const htmlParts = htmlString.split(tagInstance)
  assert(htmlParts.length >= 2)

  // Insert `htmlSnippet` after first `tagInstance`
  const before = slice(htmlParts, 0, 1)
  const after = slice(htmlParts, 1, 0).join(tagInstance)
  return before + tagInstance + htmlSnippet + after
}

function injectAtClosingTag(tag: 'head' | 'body' | 'html', htmlString: string, htmlSnippet: string): string {
  assert(tagClosingExists(tag, htmlString))

  const tagClosing = getTagClosing(tag)
  const htmlParts = htmlString.split(tagClosing)
  assert(htmlParts.length >= 2)

  // Insert `htmlSnippet` before last `tagClosing`
  const before = slice(htmlParts, 0, -1).join(tagClosing)
  const after = slice(htmlParts, -1, 0)
  return before + htmlSnippet + tagClosing + after
}

function createHtmlHeadIfMissing(htmlString: string): string {
  const assertion = () => assert(tagOpeningExists('head', htmlString) && tagClosingExists('head', htmlString))

  if (tagOpeningExists('head', htmlString) && tagClosingExists('head', htmlString)) {
    assertion()
    return htmlString
  }

  const htmlSnippet = '<head></head>'

  if (tagOpeningExists('html', htmlString)) {
    htmlString = injectAtOpeningTag('html', htmlString, htmlSnippet)
    assertion()
    return htmlString
  }

  if (tagOpeningExists('!doctype', htmlString)) {
    htmlString = injectAtOpeningTag('!doctype', htmlString, htmlSnippet)
    assertion()
    return htmlString
  }

  htmlString = htmlSnippet + '\n' + htmlString
  assertion()
  return htmlString
}

type Tag = 'html' | 'head' | 'body' | '!doctype'
function tagOpeningExists(tag: Tag, htmlString: string) {
  const tagOpeningRE = getTagOpening(tag)
  return tagOpeningRE.test(htmlString)
}
function tagClosingExists(tag: Tag, htmlString: string) {
  const tagClosing = getTagClosing(tag)
  return htmlString.toLowerCase().includes(tagClosing.toLowerCase())
}
function getTagOpening(tag: Tag) {
  const tagOpening = new RegExp(`<${tag}(>| [^>]*>)`, 'i')
  return tagOpening
}
function getTagClosing(tag: Tag) {
  const tagClosing = `</${tag}>`
  return tagClosing
}
