import { Show } from 'solid-js'
import { usePageContext } from 'vike-solid/usePageContext'
import { Counter } from './Counter.js'

export default function Page() {
  const ctx = usePageContext()

  return (
    <>
      <h1>My Vike app</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <Show when={typeof ctx?.ctx?.waitUntil === 'function'}>
          <li>SSR running on Cloudflare</li>
        </Show>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
      <p>
        <code>process.env.NODE_ENV === {JSON.stringify(process.env.NODE_ENV)}</code>
      </p>
    </>
  )
}
