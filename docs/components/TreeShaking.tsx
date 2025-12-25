export { TreeShaking }

import { NoteWithCustomIcon } from '@brillout/docpress'
import iconScissors from '../assets/icons/scissors.svg'
import React from 'react'

function TreeShaking({ children, description }: { children?: React.ReactNode; description?: string }) {
  return (
    <NoteWithCustomIcon icon={<IconTreeShaking />}>
      <p>
        <b>Features automatic code removal</b>.
      </p>
      <p>
        {description ?? (
          <>
            Code meant only for the server (or client) is automatically removed and never loaded on the client (or
            server). (It's a widespread technique{' '}
            <a href="https://vite.dev/guide/ssr.html#conditional-logic">commonly</a> called{' '}
            <a href="https://rollupjs.org/faqs/#what-is-tree-shaking">tree-shaking</a>.)
          </>
        )}
      </p>
      {children}
    </NoteWithCustomIcon>
  )
}

function IconTreeShaking() {
  return (
    <img
      src={iconScissors}
      width="22"
      style={{ display: 'inline-block', position: 'relative', top: 6, marginTop: -50 }}
    />
  )
}
