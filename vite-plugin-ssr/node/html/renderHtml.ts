import { assert, assertUsage, assertWarning, checkType, hasProp, isPromise, objectAssign, isObject } from '../utils'
import { injectHtmlTagsToString, injectHtmlTagsToStream } from './injectAssets'
import type { PageContextInjectAssets } from './injectAssets'
import { processStream, isStream, Stream, streamToString, StreamTypePatch } from './stream'
import { isStreamReactStreaming } from './stream/react-streaming'
import type { InjectToStream } from 'react-streaming/server'
import type { PageAsset } from '../renderPage/getPageAssets'
import { inferPreloadTag, inferAssetTag } from './injectAssets/inferHtmlTags'

// Public
export { escapeInject }
export type { TemplateWrapped } // https://github.com/brillout/vite-plugin-ssr/issues/511
export { dangerouslySkipEscape }
export { injectPreloadTags }
export { injectAssetTags }

// Private
export { renderDocumentHtml }
export { isDocumentHtml }
export { getHtmlString }
export type { HtmlRender }
export type { PageAssetPublic }

type DocumentHtml = TemplateWrapped | EscapedString | Stream
type HtmlRender = string | Stream

type PageAssetPublic = {
  src: PageAsset['src']
  assetType: PageAsset['assetType']
  mediaType: PageAsset['mediaType']
}
type InjectPreloadTags = { _injectPreloadTags: true | ((filter: PageAssetPublic[]) => PageAssetPublic[]) }
type InjectAssetTags = { _injectAssetTags: true | ((filter: PageAssetPublic[]) => PageAssetPublic[]) }

type TemplateStrings = TemplateStringsArray
type TemplateVariable = string | EscapedString | Stream | TemplateWrapped | InjectPreloadTags | InjectAssetTags
type TemplateWrapped = {
  _template: TemplateContent
}
type TemplateContent = {
  templateStrings: TemplateStrings
  templateVariables: TemplateVariable[]
}

function isDocumentHtml(something: unknown): something is DocumentHtml {
  if (isTemplateWrapped(something) || isEscapedString(something) || isStream(something)) {
    checkType<DocumentHtml>(something)
    return true
  }
  return false
}

async function renderDocumentHtml(
  documentHtml: DocumentHtml,
  pageContext: PageContextInjectAssets & {
    _isProduction: boolean
  },
  renderFilePath: string,
  onErrorWhileStreaming: (err: unknown) => void
): Promise<HtmlRender> {
  if (isEscapedString(documentHtml)) {
    let htmlString = getEscapedString(documentHtml)
    htmlString = await injectHtmlTagsToString(htmlString, pageContext, false)
    return htmlString
  }
  if (isStream(documentHtml)) {
    const stream = documentHtml
    const streamWrapper = await renderHtmlStream(stream, null, pageContext, onErrorWhileStreaming, false)
    return streamWrapper
  }
  if (isTemplateWrapped(documentHtml)) {
    const templateContent = documentHtml._template
    const render = await renderTemplate(templateContent, renderFilePath, pageContext)
    if ('htmlString' in render) {
      let { htmlString, disableAutoInjectPreloadTags } = render
      htmlString = await injectHtmlTagsToString(htmlString, pageContext, disableAutoInjectPreloadTags)
      return htmlString
    } else {
      const { htmlStream, disableAutoInjectPreloadTags } = render
      const streamWrapper = await renderHtmlStream(
        htmlStream,
        {
          htmlPartsBegin: render.htmlPartsBegin,
          htmlPartsEnd: render.htmlPartsEnd
        },
        pageContext,
        onErrorWhileStreaming,
        disableAutoInjectPreloadTags
      )
      return streamWrapper
    }
  }
  checkType<never>(documentHtml)
  assert(false)
}

async function renderHtmlStream(
  streamOriginal: Stream & { injectionBuffer?: string[] },
  injectString: null | { htmlPartsBegin: HtmlPart[]; htmlPartsEnd: HtmlPart[] },
  pageContext: PageContextInjectAssets & { enableEagerStreaming?: boolean; _isProduction: boolean },
  onErrorWhileStreaming: (err: unknown) => void,
  disableAutoInjectPreloadTags: boolean
) {
  const opts = {
    onErrorWhileStreaming,
    enableEagerStreaming: pageContext.enableEagerStreaming
  }
  if (injectString) {
    let injectToStream: null | InjectToStream = null
    if (isStreamReactStreaming(streamOriginal) && !streamOriginal.disabled) {
      injectToStream = streamOriginal.injectToStream
    }
    const { injectAtStreamBegin, injectAtStreamEnd } = injectHtmlTagsToStream(pageContext, injectToStream)
    objectAssign(opts, {
      injectStringAtBegin: async () => {
        const htmlBegin = htmlPartsToString(injectString.htmlPartsBegin)
        return await injectAtStreamBegin(htmlBegin, disableAutoInjectPreloadTags)
      },
      injectStringAtEnd: async () => {
        const htmlEnd = htmlPartsToString(injectString.htmlPartsEnd)
        return await injectAtStreamEnd(htmlEnd)
      }
    })
  }
  const streamWrapper = await processStream(streamOriginal, opts)
  return streamWrapper
}

function isTemplateWrapped(something: unknown): something is TemplateWrapped {
  return hasProp(something, '_template')
}
function isEscapedString(something: unknown): something is EscapedString {
  const result = hasProp(something, '_escaped')
  if (result) {
    assert(hasProp(something, '_escaped', 'string'))
    checkType<EscapedString>(something)
  }
  return result
}

function getEscapedString(escapedString: EscapedString): string {
  let htmlString: string
  assert(hasProp(escapedString, '_escaped'))
  htmlString = escapedString._escaped
  assert(typeof htmlString === 'string')
  return htmlString
}

function escapeInject(
  templateStrings: TemplateStrings,
  ...templateVariables: (TemplateVariable | StreamTypePatch)[]
): TemplateWrapped {
  assertUsage(
    templateStrings.length === templateVariables.length + 1 && templateStrings.every((str) => typeof str === 'string'),
    'You seem to use `escapeInject` as a function, but `escapeInject` is a string template tag, see https://vite-plugin-ssr.com/escapeInject'
  )
  return {
    _template: {
      templateStrings,
      templateVariables: templateVariables as TemplateVariable[]
    }
  }
}
type EscapedString = { _escaped: string }
function dangerouslySkipEscape(alreadyEscapedString: string): EscapedString {
  return _dangerouslySkipEscape(alreadyEscapedString)
}
function _dangerouslySkipEscape(arg: unknown): EscapedString {
  if (hasProp(arg, '_escaped')) {
    assert(isEscapedString(arg))
    return arg
  }
  assertUsage(
    !isPromise(arg),
    `[dangerouslySkipEscape(str)] Argument \`str\` is a promise. It should be a string instead. Make sure to \`await str\`.`
  )
  assertUsage(
    typeof arg === 'string',
    `[dangerouslySkipEscape(str)] Argument \`str\` should be a string but we got \`typeof str === "${typeof arg}"\`.`
  )
  return { _escaped: arg }
}

type HtmlPart = string | (() => string)

async function renderTemplate(
  templateContent: TemplateContent,
  renderFilePath: string,
  pageContext: PageContextInjectAssets
): Promise<
  ({ htmlString: string } | { htmlStream: Stream; htmlPartsBegin: HtmlPart[]; htmlPartsEnd: HtmlPart[] }) & {
    disableAutoInjectPreloadTags: boolean
    disableAutoInjectAssetTags: boolean
  }
> {
  const htmlPartsBegin: HtmlPart[] = []
  const htmlPartsEnd: HtmlPart[] = []
  let htmlStream: null | Stream = null
  let disableAutoInjectPreloadTags = false
  let disableAutoInjectAssetTags = false

  const addHtmlPart = (htmlPart: HtmlPart) => {
    if (htmlStream === null) {
      htmlPartsBegin.push(htmlPart)
    } else {
      htmlPartsEnd.push(htmlPart)
    }
  }

  const setStream = (stream: Stream) => {
    assertUsage(
      !htmlStream,
      `Injecting two streams in \`escapeInject\` template tag of render() hook of ${renderFilePath}. Inject only one stream instead.`
    )
    htmlStream = stream
  }

  const { templateStrings, templateVariables } = templateContent
  for (let i = 0; i < templateVariables.length; i++) {
    addHtmlPart(templateStrings[i]!)
    const templateVar = templateVariables[i]

    // Process `dangerouslySkipEscape()`
    if (isEscapedString(templateVar)) {
      const htmlString = getEscapedString(templateVar)
      // User used `dangerouslySkipEscape()` so we assume the string to be safe
      addHtmlPart(htmlString)
      continue
    }

    // Process `escapeInject` fragments
    if (isTemplateWrapped(templateVar)) {
      const templateContentInner = templateVar._template
      const result = await renderTemplate(templateContentInner, renderFilePath, pageContext)
      if ('htmlString' in result) {
        addHtmlPart(result.htmlString)
      } else {
        result.htmlPartsBegin.forEach(addHtmlPart)
        setStream(result.htmlStream)
        result.htmlPartsEnd.forEach(addHtmlPart)
      }
      continue
    }

    if (isStream(templateVar)) {
      setStream(templateVar)
      continue
    }

    const getErrMsg = (typeText: string, end: null | string) => {
      const nth: string = (i === 0 && '1st') || (i === 1 && '2nd') || (i === 2 && '3rd') || `${i}-th`
      return [`The ${nth} HTML variable is ${typeText}, see render() hook of ${renderFilePath}.`, end]
        .filter(Boolean)
        .join(' ')
    }

    assertUsage(!isPromise(templateVar), getErrMsg('a promise', 'Did you forget to `await` the promise?'))

    if (templateVar === null) {
      addHtmlPart('')
      continue
    }

    if (templateVar === undefined) {
      assertWarning(false, getErrMsg(`\`${templateVar}\``, ''), { onlyOnce: false })
      addHtmlPart('')
      continue
    }

    if (isObject(templateVar) && '_injectPreloadTags' in templateVar) {
      const pageAssets = await pageContext.__getPageAssets()
      let pageAssetsToInject = pageAssets.filter(({ isPreload }) => isPreload)
      const userFilter = templateVar._injectPreloadTags === true ? null : templateVar._injectPreloadTags
      if (userFilter) {
        const pageAssetsPublic = pageAssetsToInject.map((p) => {
          return {
            src: p.src,
            assetType: p.assetType,
            mediaType: p.mediaType
          }
        })
        pageAssetsToInject = userFilter(pageAssetsPublic).map((pageAssetPublic: PageAssetPublic) => {
          const pageAsset: PageAsset = { ...pageAssetPublic, isPreload: true }
          return pageAsset
        })
      }
      pageAssetsToInject.forEach((pageAsset) => {
        addHtmlPart(inferPreloadTag(pageAsset))
      })
      disableAutoInjectPreloadTags = true
      disableAutoInjectAssetTags = true
      continue
    }

    if (isObject(templateVar) && '_injectAssetTags' in templateVar) {
      continue // TODO
      /*
      if (!pageContext._isProduction) {
        continue
      }
      const pageAssets = await pageContext.__getPageAssets()
      let pageAssetsToInject = pageAssets.filter(({ isPreload }) => !isPreload)
      const userFilter = templateVar._injectAssetTags === true ? null : templateVar._injectAssetTags
      if (userFilter) {
        const pageAssetsPublic = pageAssetsToInject.map((p) => {
          return {
            src: p.src,
            assetType: p.assetType,
            mediaType: p.mediaType
          }
        })
        pageAssetsToInject = userFilter(pageAssetsPublic).map((pageAssetPublic: PageAssetPublic) => {
          const pageAsset: PageAsset = { ...pageAssetPublic, isPreload: false }
          return pageAsset
        })
      }
      pageAssetsToInject.forEach((pageAsset) => {
        addHtmlPart(inferAssetTag(pageAsset))
      })
      continue
      */
    }

    {
      const varType = typeof templateVar
      const streamNote = ['boolean', 'number', 'bigint', 'symbol'].includes(varType)
        ? null
        : '(See https://vite-plugin-ssr.com/stream for HTML streaming.)'
      assertUsage(varType === 'string', getErrMsg(`\`typeof htmlVar === "${varType}"\``, streamNote))
    }

    // Escape untrusted template variable
    addHtmlPart(escapeHtml(templateVar))
  }

  assert(templateStrings.length === templateVariables.length + 1)
  addHtmlPart(templateStrings[templateStrings.length - 1]!)

  if (htmlStream === null) {
    assert(htmlPartsEnd.length === 0)
    return {
      htmlString: htmlPartsToString(htmlPartsBegin),
      disableAutoInjectPreloadTags,
      disableAutoInjectAssetTags
    }
  }

  return {
    htmlStream,
    htmlPartsBegin,
    htmlPartsEnd,
    disableAutoInjectPreloadTags,
    disableAutoInjectAssetTags
  }
}

function escapeHtml(unsafeString: string): string {
  // Source: https://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript/6234804#6234804
  const safe = unsafeString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
  return safe
}

async function getHtmlString(htmlRender: HtmlRender): Promise<string> {
  if (typeof htmlRender === 'string') {
    return htmlRender
  }
  if (isStream(htmlRender)) {
    return streamToString(htmlRender)
  }
  checkType<never>(htmlRender)
  assert(false)
}

function injectPreloadTags(filter?: (filter: PageAssetPublic[]) => PageAssetPublic[]): InjectPreloadTags {
  return { _injectPreloadTags: filter ?? true }
}
function injectAssetTags(filter?: (filter: PageAssetPublic[]) => PageAssetPublic[]): InjectAssetTags {
  return { _injectAssetTags: filter ?? true }
}

function htmlPartsToString(htmlParts: HtmlPart[]): string {
  let htmlString = ''
  htmlParts.forEach((p) => {
    htmlString += typeof p === 'string' ? p : p()
  })
  return htmlString
}
