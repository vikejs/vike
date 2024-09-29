export { Layout }

import React, { useState } from 'react'
import { usePageContext } from 'vike-react/usePageContext'

function Layout({ children }) {
  const pageContext = usePageContext()
  const id = pageContext.routeParams['id']
  const idOther = id === '42' ? '1337' : '42'
  return (
    <>
      <h1>Nested Layout</h1>
      <p>
        This page uses the nested layout <code>/pages/nested-layout/@id/+Layout.jsx</code>.
      </p>
      <p>
        State is preserved upon navigating within the nested layout. Click on the counter then on the links below:
        observe how the counter state is preserved. <Counter />
      </p>
      <DummyText />
      <p>
        Route parameter <code>@id</code> value: <code>{id}</code>. Change to:
      </p>
      <p>
        <Link href={`/nested-layout/${id}`}>Overview</Link> <Link href={`/nested-layout/${id}/reviews`}>Reviews</Link>{' '}
        <Link href={`/nested-layout/${id}/pricing`}>Pricing</Link>
      </p>
      <div style={{ marginTop: 20, border: '1px solid black', padding: '10px 40px' }}>{children}</div>
      <br />
      <p>
        Scroll behavior defined by <code>+keepScrollPosition.js</code>:
      </p>
      <ul>
        <li>Preserved when navigating the nested layout.</li>
        <li>
          Scroll to top if route parameter <code>@id</code> changes. Try:
          <ul>
            <li>
              <Link2 href={`/nested-layout/${idOther}`} />
            </li>
            <li>
              <Link2 href={`/nested-layout/${idOther}/reviews`} />
            </li>
            <li>
              <Link2 href={`/nested-layout/${idOther}/pricing`} />
            </li>
          </ul>
        </li>
      </ul>
      <DummyText />
    </>
  )
}

function Link(props) {
  return <a style={{ marginRight: 10 }} {...props} />
}
function Link2(props) {
  return (
    <a {...props}>
      <code>{props.href}</code>
    </a>
  )
}

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button type="button" onClick={() => setCount((count) => count + 1)}>
      Counter {count}
    </button>
  )
}

function DummyText() {
  return (
    <div style={{ color: '#aaa', marginTop: 50, marginBottom: 50 }}>
      <h3>Some dummy text...</h3>
      <p>To be able to test scroll behavior.</p>
    </div>
  )
}
