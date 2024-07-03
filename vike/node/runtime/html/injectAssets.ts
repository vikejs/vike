export { injectHtmlTagsToString }
export { injectHtmlTagsToStream }
export type { PageContextInjectAssets }
export type { PageContextPromise }

import { assert, isCallable, isPromise } from '../utils.js'
import type { PageAsset } from '../renderPage/getPageAssets.js'
import { assertPageContextProvidedByUser } from '../../../shared/assertPageContextProvidedByUser.js'
import { injectHtmlTags, createHtmlHeadIfMissing } from './injectAssets/injectHtmlTags.js'
import type { HtmlPart } from './renderHtml.js'
import { getHtmlTags, type PreloadFilter, type HtmlTag } from './injectAssets/getHtmlTags.js'
import type { InjectToStream } from 'react-streaming/server'
import type { PageConfigRuntime } from '../../../shared/page-configs/PageConfig.js'
import type { PageContextSerialization } from './serializePageContextClientSide.js'
import { getViteDevScript } from './injectAssets/getViteDevScript.js'

type PageContextInjectAssets = {
  urlPathname: string
  __getPageAssets: () => Promise<PageAsset[]>
  _pageId: string
  _isHtmlOnly: boolean
  _pageContextPromise: PageContextPromise
  _renderHook: {
    hookFilePath: string
    hookName: 'onRenderHtml' | 'render'
  }
  _baseServer: string
  _pageConfigs: PageConfigRuntime[]
  is404: null | boolean
} & PageContextSerialization

async function injectHtmlTagsToString(
  htmlParts: HtmlPart[],
  pageContext: PageContextInjectAssets & { _isStream: false },
  injectFilter: PreloadFilter
): Promise<string> {
  const pageAssets = await pageContext.__getPageAssets()
  const viteDevScript = await getViteDevScript()
  const htmlTags = getHtmlTags(pageContext, null, injectFilter, pageAssets, viteDevScript)
  let htmlString = htmlPartsToString(htmlParts, pageAssets)
  htmlString = await injectToHtmlBegin(htmlString, htmlTags, null)
  htmlString = await injectToHtmlEnd(htmlString, htmlTags)
  return htmlString
}

function injectHtmlTagsToStream(
  pageContext: PageContextInjectAssets & { _isStream: true },
  injectToStream: null | InjectToStream,
  injectFilter: PreloadFilter
) {
  let htmlTags: HtmlTag[] | undefined

  return {
    injectAtStreamBegin,
    injectAtStreamEnd
  }

  async function injectAtStreamBegin(htmlPartsBegin: HtmlPart[]): Promise<string> {
    const pageAssets = await pageContext.__getPageAssets()
    const viteDevScript = await getViteDevScript()
    htmlTags = getHtmlTags(pageContext, injectToStream, injectFilter, pageAssets, viteDevScript)

    let htmlBegin = htmlPartsToString(htmlPartsBegin, pageAssets)

    htmlBegin = await injectToHtmlBegin(htmlBegin, htmlTags, injectToStream)
    return htmlBegin
  }

  async function injectAtStreamEnd(htmlPartsEnd: HtmlPart[]): Promise<string> {
    assert(htmlTags)
    await resolvePageContextPromise(pageContext)
    const pageAssets = await pageContext.__getPageAssets()
    let htmlEnd = htmlPartsToString(htmlPartsEnd, pageAssets)
    htmlEnd = await injectToHtmlEnd(htmlEnd, htmlTags)
    return htmlEnd
  }
}

async function injectToHtmlBegin(
  htmlBegin: string,
  htmlTags: HtmlTag[],
  injectToStream: null | InjectToStream
): Promise<string> {
  const htmlTagsAtBegin = htmlTags.filter((snippet) => snippet.position !== 'HTML_END')

  // Ensure existence of `<head>`
  htmlBegin = createHtmlHeadIfMissing(htmlBegin)

  htmlBegin = await injectHtmlTags(htmlBegin, htmlTagsAtBegin, injectToStream)

  return htmlBegin
}

async function injectToHtmlEnd(htmlEnd: string, htmlTags: HtmlTag[]): Promise<string> {
  const htmlTagsAtEnd = htmlTags.filter((snippet) => snippet.position === 'HTML_END')
  htmlEnd = await injectHtmlTags(htmlEnd, htmlTagsAtEnd, null)
  return htmlEnd
}

// https://vike.dev/streaming#initial-data-after-stream-end
type PageContextPromise = null | Promise<unknown> | (() => void | Promise<unknown>)
async function resolvePageContextPromise(pageContext: {
  _pageContextPromise: PageContextPromise
  _renderHook: {
    hookFilePath: string
    hookName: 'onRenderHtml' | 'render'
  }
}) {
  const pageContextPromise = pageContext._pageContextPromise
  if (!pageContextPromise) {
    return
  }
  let pageContextProvidedByUser: unknown
  if (isCallable(pageContextPromise)) {
    pageContextProvidedByUser = await pageContextPromise()
  } else if (isPromise(pageContextPromise)) {
    pageContextProvidedByUser = await pageContextPromise
  } else {
    assert(false)
  }
  assertPageContextProvidedByUser(pageContextProvidedByUser, pageContext._renderHook)
  Object.assign(pageContext, pageContextProvidedByUser)
}

function htmlPartsToString(htmlParts: HtmlPart[], pageAssets: PageAsset[]): string {
  let htmlString = ''
  htmlParts.forEach((p) => {
    htmlString += typeof p === 'string' ? p : p(pageAssets)
  })
  return htmlString
}
