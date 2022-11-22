export { injectHtmlTags }
export { createHtmlHeadIfMissing }

import { assert, slice } from '../../utils'
import type { InjectToStream } from 'react-streaming/server'
import type { HtmlTag } from './getHtmlTags'

type Position = 'HTML_BEGIN' | 'HTML_END' | 'STREAM'
const POSITIONS = ['HTML_BEGIN' as const, 'HTML_END' as const, 'STREAM' as const]

type HtmlFragment = {
  htmlFragment: string
  position: Position
}
function injectHtmlTags(htmlString: string, htmlTags: HtmlTag[], injectToStream: null | InjectToStream): string {
  let htmlFragments: HtmlFragment[] = []
  htmlTags.forEach(({ htmlTag, position }) => {
    htmlFragments.push({
      htmlFragment: resolveHtmlTag(htmlTag),
      position
    })
  })
  htmlFragments = bundleTags(htmlFragments)
  htmlFragments.forEach((htmlFragment) => {
    htmlString = injectHtmlFragments(htmlFragment.position, htmlFragment.htmlFragment, htmlString, injectToStream)
  })
  return htmlString
}

function injectHtmlFragments(
  position: Position,
  htmlFragment: string,
  htmlString: string,
  injectToStream: null | InjectToStream
): string {
  if (position === 'HTML_BEGIN') {
    assert(tagOpeningExists('head', htmlString))
    htmlString = injectAtOpeningTag('head', htmlString, htmlFragment)
    return htmlString
  }
  if (position === 'HTML_END') {
    if (tagClosingExists('body', htmlString)) {
      return injectAtClosingTag('body', htmlString, htmlFragment)
    }

    if (tagClosingExists('html', htmlString)) {
      return injectAtClosingTag('html', htmlString, htmlFragment)
    }

    return htmlString + '\n' + htmlFragment
  }
  if (position === 'STREAM') {
    assert(injectToStream)
    injectToStream(htmlFragment, { flush: true })
    return htmlString
  }
  assert(false)
}

// Is this really needed?
function bundleTags(htmlFragments: HtmlFragment[]): HtmlFragment[] {
  const htmlFragmentsBundled: HtmlFragment[] = []
  POSITIONS.forEach((position) => {
    const fragments: string[] = htmlFragments.filter((h) => h.position === position).map((h) => h.htmlFragment)
    if (fragments.length > 0) {
      const bundle = fragments.join('')
      htmlFragmentsBundled.push({
        htmlFragment: bundle,
        position
      })
    }
  })
  return htmlFragmentsBundled
}

function resolveHtmlTag(htmlTag: HtmlTag['htmlTag']) {
  return typeof htmlTag !== 'string' ? htmlTag() : htmlTag
}

function injectAtOpeningTag(tag: 'head' | 'html' | '!doctype', htmlString: string, htmlFragment: string): string {
  const openingTag = getTagOpening(tag)
  const matches = htmlString.match(openingTag)
  assert(matches && matches.length >= 1)
  const tagInstance = matches[0]
  assert(tagInstance)
  const htmlParts = htmlString.split(tagInstance)
  assert(htmlParts.length >= 2)

  // Insert `htmlFragment` after first `tagInstance`
  const before = slice(htmlParts, 0, 1)
  const after = slice(htmlParts, 1, 0).join(tagInstance)
  return before + tagInstance + htmlFragment + after
}

function injectAtClosingTag(tag: 'body' | 'html', htmlString: string, htmlFragment: string): string {
  const tagClosing = getTagClosing(tag)
  const matches = htmlString.match(tagClosing)
  assert(matches && matches.length >= 1)
  const tagInstance = matches[0]
  assert(tagInstance)
  const htmlParts = htmlString.split(tagInstance)
  assert(htmlParts.length >= 2)

  // Insert `htmlFragment` before last `tagClosing`
  const before = slice(htmlParts, 0, -1).join(tagInstance)
  const after = slice(htmlParts, -1, 0)

  htmlFragment = injectBreakLines(htmlFragment, before)

  return before + htmlFragment + tagInstance + after
}

function injectBreakLines(htmlFragment: string, before: string ) {
  const whitespaceOriginal: string = before.match(/\s*$/)![0]!
  const whitespaceExtra = whitespaceOriginal ? '  ' : ''
  const whitespace = `${whitespaceOriginal}${whitespaceExtra}`
  htmlFragment = htmlFragment.split(/<(?=[^\/])/).join(`${whitespace}<`) + whitespaceOriginal
  assert(htmlFragment.startsWith(whitespace))
  htmlFragment = whitespaceExtra + htmlFragment.slice(whitespace.length)
  return htmlFragment
}

function createHtmlHeadIfMissing(htmlString: string): string {
  const assertion = () => assert(tagOpeningExists('head', htmlString) && tagClosingExists('head', htmlString))

  if (tagOpeningExists('head', htmlString) && tagClosingExists('head', htmlString)) {
    assertion()
    return htmlString
  }

  const htmlFragment = '<head></head>'

  if (tagOpeningExists('html', htmlString)) {
    htmlString = injectAtOpeningTag('html', htmlString, htmlFragment)
    assertion()
    return htmlString
  }

  if (tagOpeningExists('!doctype', htmlString)) {
    htmlString = injectAtOpeningTag('!doctype', htmlString, htmlFragment)
    assertion()
    return htmlString
  }

  htmlString = htmlFragment + '\n' + htmlString
  assertion()
  return htmlString
}

type Tag = 'html' | 'head' | 'body' | '!doctype'
// Pay attention to performance when searching for tags
// Use the most effective way to test or match tag existence
// Use tag existence checking with caution as it is costly operation
function tagOpeningExists(tag: Tag, htmlString: string) {
  const tagOpeningRE = getTagOpening(tag)
  return tagOpeningRE.test(htmlString)
}
function tagClosingExists(tag: Tag, htmlString: string) {
  const tagClosingRE = getTagClosing(tag)
  return tagClosingRE.test(htmlString)
}
function getTagOpening(tag: Tag) {
  const tagOpening = new RegExp(`<${tag}(>| [^>]*>)`, 'i')
  return tagOpening
}
function getTagClosing(tag: Tag) {
  const tagClosing = new RegExp(`</${tag}>`, 'i')
  return tagClosing
}
