export { injectHtmlTags }
export { createHtmlHeadIfMissing }

// Export for unit testing
export { injectAtOpeningTag }
export { injectAtClosingTag }
export { injectHtmlFragments }

import { assert, assertWarning, slice } from '../../../utils'
import type { HtmlTag } from './getHtmlTags'
import type { InjectToStream } from '../stream/react-streaming'

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

    const metaCharsetState = getMetaCharsetState(htmlString)

    assertWarning(
      metaCharsetState !== 'missing',
      'The <meta charset="${ENCODING}"> tag is missing from the html source. You may consider adding it as the first child tag of the head tag as it is a best practice to always include it in the HTML source. Not doing so could lead to a variety of issues. For further details see: https://github.com/brillout/vite-plugin-ssr/issues/638',
      {
        onlyOnce: true, showStackTrace: false
      }
    ) 

    assertWarning(
      metaCharsetState !== 'exists',
      'The <meta charset="${ENCODING}"> tag is not the first child tag of the head tag in the html source. The tag should occur as soon as possible inside the html source, to avoid running into a variety of issues. For further details see: https://github.com/brillout/vite-plugin-ssr/issues/638',
      {
        onlyOnce: true, showStackTrace: false
      }
    )

    let htmlBeginInjectAtTag: 'head' | 'meta' = 'head'
    let htmlBeginInjectAtAttribute: Attribute | '' = ''

    // Inject the html fragments targeted at head after the meta charset tag
    // if it the first child of the html head element.
    // Fixes: https://github.com/brillout/vite-plugin-ssr/issues/638
    if(metaCharsetState === 'first-tag') {
      htmlBeginInjectAtTag = 'meta'
      htmlBeginInjectAtAttribute = 'charset'
    }

    htmlString = injectAtOpeningTag(htmlBeginInjectAtTag, htmlBeginInjectAtAttribute, htmlString, htmlFragment)
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

function injectAtOpeningTag(
  tag: 'head' | 'meta' | 'html' | '!doctype',
  attribute: Attribute | '',
  htmlString: string, 
  htmlFragment: string
): string {
  const openingTag = attribute 
    ? getTagOpeningWithAttribute(tag, attribute)
    : getTagOpening(tag)
  const matches = htmlString.match(openingTag)
  assert(matches && matches.length >= 1)
  const tagInstance = matches[0]
  assert(tagInstance)
  const htmlParts = htmlString.split(tagInstance)
  assert(htmlParts.length >= 2)

  // Insert `htmlFragment` after first `tagInstance`
  const before = slice(htmlParts, 0, 1)[0]! + tagInstance
  const after = slice(htmlParts, 1, 0).join(tagInstance)

  htmlFragment = injectBreakLines(htmlFragment, isSelfClosing(tag), before, after)

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

  htmlFragment = injectBreakLines(htmlFragment, isSelfClosing(tag), before, after)

  return before + htmlFragment + after
}

function injectBreakLines(htmlFragment: string, selfClosingTag: boolean, before: string, after: string) {
  assert(htmlFragment.trim() === htmlFragment)

  const currentLineBefore = before.split('\n').slice(-1)[0]!
  let paddingParent: string = currentLineBefore.match(/\s*$/)![0]!
  let isBlankLine = !!paddingParent
  if (!paddingParent) {
    paddingParent = currentLineBefore!.match(/^\s*/)![0]!
  }
  if (!paddingParent) return htmlFragment

  const whitespaceExtra = paddingParent && !selfClosingTag ? '  ' : ''
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

  const htmlFragment = '<head><meta charset="utf-8"></head>'

  if (tagOpeningExists('html', htmlString)) {
    htmlString = injectAtOpeningTag('html', '', htmlString, htmlFragment)
    assertion()
    return htmlString
  }

  if (tagOpeningExists('!doctype', htmlString)) {
    htmlString = injectAtOpeningTag('!doctype', '', htmlString, htmlFragment)
    assertion()
    return htmlString
  }

  htmlString = htmlFragment + '\n' + htmlString
  assertion()
  return htmlString
}

type Tag = 'html' | 'head' | 'body' | '!doctype' | 'meta'
type Attribute = 'charset'
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
function getTagOpeningWithAttribute(tag: Tag, attribute: Attribute) {
  const tagWithAttribute = new RegExp(`<${tag} ${attribute}=['"].*['"](>| [^>]*>|\/>)(\\s*<\/[\\s]*${tag}>)?`, 'i')
  return tagWithAttribute
}
function isSelfClosing(tag: Tag) {
  const selfClosingTags: Tag[] = ['meta']
  return selfClosingTags.includes(tag)
}

function getMetaCharsetState(htmlString: string) {
  const metaCharsetExistsRE = /<head>([\s\S]*)<meta charset=/i
  const metaCharsetMatches = metaCharsetExistsRE.exec(htmlString)

  if(!metaCharsetMatches) {
    return 'missing'
  }

  const [, textBetweenHeadAndMetaCharset] = metaCharsetMatches
  const onlyWhitespaceRE = /^\s*$/

  // Capture group is always defined
  return onlyWhitespaceRE.test(textBetweenHeadAndMetaCharset as string)
    ? 'first-tag'
    : 'exists'
}
