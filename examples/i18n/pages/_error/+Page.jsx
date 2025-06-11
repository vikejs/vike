export { Page }

import React from 'react'
import { usePageContext } from '../../renderer/usePageContext'
import { LocaleText } from '../../renderer/LocaleText'

function Page() {
  const pageContext = usePageContext()
  let { is404, abortReason } = pageContext
  if (!abortReason) {
    abortReason = is404 ? 'Page not found' : 'Something went wrong'
  }
  return (
    <Center>
      <p style={{ fontSize: '1.3em' }}>
        <LocaleText>{abortReason}</LocaleText>
      </p>
    </Center>
  )
}

function Center({ style, ...props }) {
  return (
    <div
      style={{
        height: 'calc(100vh - 100px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}
      {...props}
    ></div>
  )
}
