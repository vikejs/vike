import React, { useState } from 'react'
import { locales } from '../../locales'
import { Link } from '../../renderer/Link'
import { LocaleText } from '../../renderer/LocaleText'

export { Page }

function Page() {
  return (
    <>
      <h1>
        <LocaleText>Welcome</LocaleText>
      </h1>
      <LocaleText>This page is</LocaleText>:
      <ul>
        <li>
          <LocaleText>Localized</LocaleText>. <LocaleText>Change language</LocaleText>:{' '}
          {locales.map((locale) => (
            <Link locale={locale} href="/" key={locale} style={{ marginLeft: 7 }}>
              {locale}
            </Link>
          ))}
        </li>
        <li>
          <LocaleText>Rendered to HTML</LocaleText>
        </li>
        <li>
          <LocaleText>Interactive</LocaleText> <Counter />
        </li>
      </ul>
    </>
  )
}

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button type="button" onClick={() => setCount((count) => count + 1)}>
      <LocaleText>Counter</LocaleText> {count}
    </button>
  )
}
