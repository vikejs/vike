import React from 'react'
import { assert } from 'libframe-docs/utils'
import { P, Link, Info, ReadingRecommendation } from 'libframe-docs/components'

export { DataArchitecture }

function DataArchitecture({
  toolName,
  toolLink,
  isGeneric,
  toolType,
  toolDocs,
  skipPassToClient,
}: {
  toolName: string
  toolLink?: string
  isGeneric: boolean
  toolType: string
  toolDocs: JSX.Element
  skipPassToClient?: true
}) {
  const recommendation = <ReadingRecommendation tour={true} links={['/data-fetching']}/>
  return <>
    { skipPassToClient && recommendation }
    <DataRenderControl toolName={toolName} toolLink={toolLink} isGeneric={isGeneric} toolDocs={toolDocs} skipInfo={skipPassToClient}/>
    { !skipPassToClient && recommendation }
    { !skipPassToClient &&
    <DataPassToClient toolType={toolType} isGenericDoc={isGeneric}/>
    }
  </>
}

function DataRenderControl({
  toolName,
  toolLink,
  isGeneric,
  toolDocs,
  skipInfo,
}: {
  toolName: string
  toolLink?: string
  isGeneric: boolean
  toolDocs: JSX.Element
  skipInfo?: boolean
}) {
  assert([true, false].includes(isGeneric), { isGeneric, isGenericType: typeof isGeneric })
  assert(toolName)
  assert(isGeneric === toolName.startsWith('any '), { isGeneric, toolName, toolLink })
  assert(isGeneric === !toolLink, { isGeneric, toolName, toolLink })
  const toolEl = toolLink ? <a href={toolLink}>{toolName}</a> : toolName
  const content = <>
    With <code>vite-plugin-ssr</code> we keep control over our app architecture; we can
    integrate {toolEl}{isGeneric?' we want':''} simply by following its SSR docs.
    { toolDocs && <ul><li>{toolDocs}</li></ul> }
  </>
    if( skipInfo ) {
      return content
    } else {
  return (
    <Info>{
      content}
    </Info>
  )
    }
}
function DataPassToClient({ toolType, isGenericDoc }: { toolType: string; isGenericDoc?: boolean }) {
  assert(toolType === 'data-store' || toolType === 'data-fetching')
  assert(isGenericDoc === undefined || isGenericDoc === true || isGenericDoc===false)
  const dataName = toolType === 'data-store' ? 'state' : 'data'
  const pageContextName = toolType === 'data-store' ? 'initialStoreState' : 'initialData'
  return (
    <P>
      On a high-level, {isGenericDoc ? 'an' : 'the'} SSR integration {isGenericDoc ? 'usually ' : ''}works like this:
      <ol>
        <li>
          We {toolType === 'data-store' ? 'set the initial state of the store' : 'fetch the initial data'} on the
          server-side. (We need to do it on the server-side if we want its content to be rendered to HTML.)
        </li>
        <li>
          We make the initial {dataName} available as <code>pageContext.{pageContextName}</code>.
        </li>
        <li>
          We make <code>pageContext.{pageContextName}</code> available on the browser-side by using{' '}
          <Link href="/passToClient" text={<code>passToClient</code>} />.
        </li>
        <li>
          We initialize the store on the browser-side using <code>pageContext.{pageContextName}</code>.
        </li>
      </ol>
    </P>
  )
}
