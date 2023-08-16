export { getHttpResponseBody }
export { getHttpResponseBodyStreamHandlers }
export type { HttpResponseBody }

import {
  StreamPipeNode,
  StreamPipeWeb,
  StreamReadableNode,
  StreamReadableWeb,
  StreamWritableNode,
  StreamWritableWeb,
  isStream,
  getStreamName,
  inferStreamName,
  isStreamWritableWeb,
  isStreamWritableNode,
  isStreamReadableWeb,
  isStreamReadableNode,
  isStreamPipeWeb,
  isStreamPipeNode,
  getStreamReadableNode,
  getStreamReadableWeb,
  pipeToStreamWritableWeb,
  pipeToStreamWritableNode
} from '../html/stream.js'
import { assert, assertUsage, assertWarning } from '../utils.js'
import { getHtmlString, type HtmlRender } from '../html/renderHtml.js'
import type { RenderHook } from './executeOnRenderHtmlHook.js'

const streamDocs = 'See https://vite-plugin-ssr.com/stream for more information.'

type HttpResponseBody = {
  body: string
  getBody: () => Promise<string>
  getReadableWebStream: () => StreamReadableWeb
  pipe: (writable: StreamWritableWeb | StreamWritableNode) => void
  /** @deprecated */
  getNodeStream: () => Promise<StreamReadableNode>
  /** @deprecated */
  getWebStream: () => StreamReadableWeb
  /** @deprecated */
  pipeToNodeWritable: StreamPipeNode
  /** @deprecated */
  pipeToWebWritable: StreamPipeWeb
}

function getHttpResponseBody(htmlRender: HtmlRender, renderHook: null | RenderHook) {
  if (typeof htmlRender !== 'string') {
    assertUsage(
      false,
      getErrMsg(
        htmlRender,
        renderHook,
        'body',
        'Use `pageContext.httpResponse.pipe()` or `pageContext.httpResponse.getBody()` instead'
      )
    )
  }
  const body = htmlRender
  return body
}

function getHttpResponseBodyStreamHandlers(htmlRender: HtmlRender, renderHook: null | RenderHook) {
  return {
    async getBody(): Promise<string> {
      const body = await getHtmlString(htmlRender)
      return body
    },
    async getNodeStream() {
      assertWarning(
        false,
        '`pageContext.httpResponse.getNodeStream()` is outdated, use `pageContext.httpResponse.pipe()` instead. ' +
          streamDocs,
        { onlyOnce: true, showStackTrace: true }
      )
      const nodeStream = await getStreamReadableNode(htmlRender)
      if (nodeStream === null) {
        assertUsage(false, getErrMsg(htmlRender, renderHook, 'getNodeStream()', getFixMsg('readable', 'node')))
      }
      return nodeStream
    },
    getWebStream() {
      assertWarning(
        false,
        '`pageContext.httpResponse.getWebStream(res)` is outdated, use `pageContext.httpResponse.getReadableWebStream(res)` instead. ' +
          streamDocs,
        { onlyOnce: true, showStackTrace: true }
      )
      const webStream = getStreamReadableWeb(htmlRender)
      if (webStream === null) {
        assertUsage(false, getErrMsg(htmlRender, renderHook, 'getWebStream()', getFixMsg('readable', 'web')))
      }
      return webStream
    },
    getReadableWebStream() {
      const webStream = getStreamReadableWeb(htmlRender)
      if (webStream === null) {
        assertUsage(false, getErrMsg(htmlRender, renderHook, 'getReadableWebStream()', getFixMsg('readable', 'web')))
      }
      return webStream
    },
    pipeToWebWritable(writable: StreamWritableWeb) {
      assertWarning(
        false,
        '`pageContext.httpResponse.pipeToWebWritable(res)` is outdated, use `pageContext.httpResponse.pipe(res)` instead. ' +
          streamDocs,
        { onlyOnce: true, showStackTrace: true }
      )
      const success = pipeToStreamWritableWeb(htmlRender, writable)
      if (!success) {
        assertUsage(false, getErrMsg(htmlRender, renderHook, 'pipeToWebWritable()'))
      }
    },
    pipeToNodeWritable(writable: StreamWritableNode) {
      assertWarning(
        false,
        '`pageContext.httpResponse.pipeToNodeWritable(res)` is outdated, use `pageContext.httpResponse.pipe(res)` instead. ' +
          streamDocs,
        { onlyOnce: true, showStackTrace: true }
      )
      const success = pipeToStreamWritableNode(htmlRender, writable)
      if (!success) {
        assertUsage(false, getErrMsg(htmlRender, renderHook, 'pipeToNodeWritable()'))
      }
    },
    pipe(writable: StreamWritableNode | StreamWritableWeb) {
      const getErrMsgMixingStreamTypes = (writableType: 'Web Writable' | 'Node.js Writable') =>
        `The ${getErrMsgBody(htmlRender, renderHook)} while a ${
          writableType as string
        } was passed to pageContext.httpResponse.pipe() which is contradictory. You cannot mix a Web Stream with a Node.js Stream.` as const
      if (isStreamWritableWeb(writable)) {
        const success = pipeToStreamWritableWeb(htmlRender, writable)
        if (success) {
          return
        } else {
          assert(isStreamReadableWeb(htmlRender) || isStreamPipeWeb(htmlRender))
          assertUsage(false, getErrMsgMixingStreamTypes('Web Writable'))
        }
      }
      if (isStreamWritableNode(writable)) {
        const success = pipeToStreamWritableNode(htmlRender, writable)
        if (success) {
          return
        } else {
          assert(isStreamReadableNode(htmlRender) || isStreamPipeNode(htmlRender))
          assertUsage(false, getErrMsgMixingStreamTypes('Node.js Writable'))
        }
      }
      assertUsage(
        false,
        `The argument \`writable\` passed to \`pageContext.httpResponse.pipe(writable)\` doesn't seem to be ${getStreamName(
          'writable',
          'web'
        )} nor ${getStreamName('writable', 'node')}.`
      )
    }
  }

  function getFixMsg(type: 'pipe' | 'readable', standard: 'web' | 'node') {
    const streamName = getStreamName(type, standard)
    assert(['a ', 'an ', 'the '].some((s) => streamName.startsWith(s)))
    assert(renderHook)
    const { hookFilePath, hookName } = renderHook
    return `Make sure the ${hookName}() defined by ${hookFilePath} hook provides ${streamName} instead`
  }
}

function getErrMsg(htmlRender: HtmlRender, renderHook: null | RenderHook, method: string, msgAddendum?: string) {
  assert(!msgAddendum || !msgAddendum.endsWith('.'))
  const errMsgBody = getErrMsgBody(htmlRender, renderHook)
  return [`pageContext.httpResponse.${method} can't be used because the ${errMsgBody}`, msgAddendum, streamDocs]
    .filter(Boolean)
    .join('. ')
}
function getErrMsgBody(htmlRender: HtmlRender, renderHook: null | RenderHook) {
  assert(renderHook)
  const { hookFilePath, hookName } = renderHook
  const hookReturnType = getHookReturnType(htmlRender)
  assert(['a ', 'an ', 'the '].some((s) => hookReturnType.startsWith(s)))
  const errMsgBody = `${hookName as string}()\ hook defined by ${hookFilePath} provides ${
    hookReturnType as string
  }` as const
  assert(!errMsgBody.endsWith(' '))
  return errMsgBody
}
function getHookReturnType(htmlRender: HtmlRender) {
  if (typeof htmlRender === 'string') {
    return 'an HTML string'
  } else if (isStream(htmlRender)) {
    return inferStreamName(htmlRender)
  } else {
    assert(false)
  }
}
