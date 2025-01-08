export { IntegrationHelp }

import React from 'react'
import { Link } from '@brillout/docpress'

function IntegrationHelp({ what, noQuote }: { what?: string; noQuote?: true }) {
  what ??= 'a tool'
  const content = (
    <>
      <Link href="/faq#i-can-t-achieve-what-i-want-can-i-get-help">Feel free to reach out</Link> if you run into any
      issues integrating {what}.
    </>
  )
  if (noQuote) return content
  return (
    <blockquote>
      <p>{content}</p>
    </blockquote>
  )
}
