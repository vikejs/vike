export { injectHtmlTagsToString }
export { injectHtmlTagsToStream }
export type { PageContextInjectAssets }

import { assert } from '../utils'
import type { PageAsset } from '../renderPage/getPageAssets'
import { assertPageContextProvidedByUser } from '../../shared/assertPageContextProvidedByUser'
import { createHtmlHeadIfMissing, injectHtmlSnippets } from './injectAssets/injectHtmlSnippet'
import type { ViteDevServer } from 'vite'
import type { InjectToStream } from 'react-streaming/server'
import { HtmlPart } from './renderHtml'
import { getHtmlTags, type PreloadFilter, type HtmlTag } from './injectAssets/getHtmlTags'

type PageContextInjectAssets = {
  urlPathname: string
  __getPageAssets: () => Promise<PageAsset[]>
  _pageId: string
  _passToClient: string[]
  _isHtmlOnly: boolean
  _pageContextPromise: Promise<unknown> | null
  _renderHook: { hookFilePath: string; hookName: 'render' }
  _isProduction: boolean
  _viteDevServer: null | ViteDevServer
  _baseUrl: string
  is404: null | boolean
}

async function injectHtmlTagsToString(
  htmlParts: HtmlPart[],
  pageContext: PageContextInjectAssets,
  disableAutoInjectPreloadTags: boolean,
  preloadFilter: PreloadFilter
): Promise<string> {
  const htmlTags = await getHtmlTags(pageContext, null, disableAutoInjectPreloadTags, preloadFilter)
  const pageAssets = await pageContext.__getPageAssets()
  let htmlString = htmlPartsToString(htmlParts, pageAssets)
  htmlString = injectToHtmlBegin(htmlString, htmlTags, null)
  htmlString = injectToHtmlEnd(htmlString, htmlTags)
  return htmlString
}

function injectHtmlTagsToStream(
  pageContext: PageContextInjectAssets,
  injectToStream: null | InjectToStream,
  preloadFilter: PreloadFilter
) {
  let htmlTags: HtmlTag[] | undefined

  return {
    injectAtStreamBegin,
    injectAtStreamEnd
  }

  async function injectAtStreamBegin(
    htmlPartsBegin: HtmlPart[],
    disableAutoInjectPreloadTags: boolean
  ): Promise<string> {
    htmlTags = await getHtmlTags(pageContext, injectToStream, disableAutoInjectPreloadTags, preloadFilter)

    const pageAssets = await pageContext.__getPageAssets()
    let htmlBegin = htmlPartsToString(htmlPartsBegin, pageAssets)

    htmlBegin = injectToHtmlBegin(htmlBegin, htmlTags, injectToStream)
    return htmlBegin
  }

  async function injectAtStreamEnd(htmlPartsEnd: HtmlPart[]): Promise<string> {
    assert(htmlTags)
    await resolvePageContextPromise(pageContext)
    const pageAssets = await pageContext.__getPageAssets()
    let htmlEnd = htmlPartsToString(htmlPartsEnd, pageAssets)
    htmlEnd = injectToHtmlEnd(htmlEnd, htmlTags)
    return htmlEnd
  }
}

function injectToHtmlBegin(htmlBegin: string, htmlTags: HtmlTag[], injectToStream: null | InjectToStream): string {
  const htmlSnippetsAtBegin = htmlTags.filter((snippet) => snippet.position !== 'DOCUMENT_END')

  // Ensure existence of `<head>`
  htmlBegin = createHtmlHeadIfMissing(htmlBegin)

  htmlBegin = injectHtmlSnippets(htmlBegin, htmlSnippetsAtBegin, injectToStream)

  return htmlBegin
}

function injectToHtmlEnd(htmlEnd: string, htmlTags: HtmlTag[]): string {
  const htmlSnippetsAtEnd = htmlTags.filter((snippet) => snippet.position === 'DOCUMENT_END')
  htmlEnd = injectHtmlSnippets(htmlEnd, htmlSnippetsAtEnd, null)
  return htmlEnd
}

// https://vite-plugin-ssr.com/stream#initial-data-after-streaming
async function resolvePageContextPromise(pageContext: {
  _pageContextPromise: null | Promise<unknown>
  _renderHook: { hookFilePath: string; hookName: 'render' }
}) {
  if (pageContext._pageContextPromise !== null) {
    const pageContextProvidedByUser = await pageContext._pageContextPromise
    assertPageContextProvidedByUser(pageContextProvidedByUser, { hook: pageContext._renderHook })
    Object.assign(pageContext, pageContextProvidedByUser)
  }
}

function htmlPartsToString(htmlParts: HtmlPart[], pageAssets: PageAsset[]): string {
  let htmlString = ''
  htmlParts.forEach((p) => {
    htmlString += typeof p === 'string' ? p : p(pageAssets)
  })
  return htmlString
}
