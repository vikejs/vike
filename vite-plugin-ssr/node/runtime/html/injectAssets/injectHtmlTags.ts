// Unit tests at ./injectHtmlTags.spec.ts

export { injectHtmlTags }
export { createHtmlHeadIfMissing }

// Only needed for unit tests
export { injectAtOpeningTag }
export { injectAtClosingTag }

import { assert, assertUsage, slice } from '../../utils.js'
import type { HtmlTag } from './getHtmlTags.js'
import type { InjectToStream } from '../stream/react-streaming.js'

type Position = 'HTML_BEGIN' | 'HTML_END' | 'STREAM'
const POSITIONS = ['HTML_BEGIN' as const, 'HTML_END' as const, 'STREAM' as const]

function injectHtmlTags(htmlString: string, htmlTags: HtmlTag[], injectToStream: null | InjectToStream): string {
  POSITIONS.forEach((position) => {
    const htmlFragment = htmlTags
      .filter((h) => h.position === position)
      .map((h) => resolveHtmlTag(h.htmlTag))
      .join('')
    if (htmlFragment) {
      htmlString = injectHtmlFragment(position, htmlFragment, htmlString, injectToStream)
    }
  })
  return htmlString
}

function injectHtmlFragment(
  position: Position,
  htmlFragment: string,
  htmlString: string,
  injectToStream: null | InjectToStream
): string {
  if (position === 'HTML_BEGIN') {
    {
      const res = injectAtPaceholder(htmlFragment, htmlString, true)
      if (res) return res
    }
    assert(tagOpeningExists('head', htmlString))
    htmlString = injectAtOpeningTag('head', htmlString, htmlFragment)
    return htmlString
  }
  if (position === 'HTML_END') {
    {
      const res = injectAtPaceholder(htmlFragment, htmlString, false)
      if (res) return res
    }
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
  const before = slice(htmlParts, 0, 1)[0]! + tagInstance
  const after = slice(htmlParts, 1, 0).join(tagInstance)

  htmlFragment = injectBreakLines(htmlFragment, before, after)

  return before + htmlFragment + after
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
  const after = tagInstance + slice(htmlParts, -1, 0)

  htmlFragment = injectBreakLines(htmlFragment, before, after)

  return before + htmlFragment + after
}

function injectBreakLines(htmlFragment: string, before: string, after: string) {
  assert(htmlFragment.trim() === htmlFragment)

  const currentLineBefore = before.split('\n').slice(-1)[0]!
  let paddingParent: string = currentLineBefore.match(/\s*$/)![0]!
  let isBlankLine = !!paddingParent
  if (!paddingParent) {
    paddingParent = currentLineBefore!.match(/^\s*/)![0]!
  }
  if (!paddingParent) return htmlFragment

  const whitespaceExtra = paddingParent ? '  ' : ''
  const whitespace = `${paddingParent}${whitespaceExtra}`
  const padding = `\n${whitespace}`

  htmlFragment = htmlFragment.split(/<(?=[^\/])/).join(`${padding}<`)
  if (isBlankLine) {
    assert(htmlFragment.startsWith(padding), { htmlFragment })
    htmlFragment = whitespaceExtra + htmlFragment.slice(padding.length)
  }

  const currentLineAfter = after.split('\n')[0]!
  if (currentLineAfter.trim().length > 0) {
    htmlFragment += '\n' + paddingParent
  }

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

function injectAtPaceholder(htmlFragment: string, htmlString: string, isFirst: boolean): null | string {
  const placeholder = isFirst ? '__VITE_PLUGIN_SSR__ASSETS_FIRST__' : '__VITE_PLUGIN__SSR_ASSETS_LAST__'
  const parts = htmlString.split(placeholder)
  if (parts.length === 1) return null
  assertUsage(parts.length === 2, "You're inserting assets twice into your HTML", { showStackTrace: true })
  return [parts[0], htmlFragment, parts[1]].join('')
}
