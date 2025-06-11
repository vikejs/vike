export { Layout }

import { createSignal, FlowProps } from 'solid-js'

function Layout(props: FlowProps) {
  return (
    <>
      <h1>Star Dust ✨</h1>
      <p>
        <b>
          This page uses the layout <code>/pages/+Layout.tsx</code> with a nested layout{' '}
          <code>/pages/stardust/+Layout.tsx</code>.
        </b>
      </p>
      <p>This merely tests if Solid detects a "change" in the layout array despite being the same length.</p>
      <p>
        <b>State is preserved upon navigating within the nested layout.</b> <Counter />
      </p>
      <br />
      <div
        style={{
          'margin-top': '20px',
          border: '1px solid black',
          padding: '10px 40px',
        }}
      >
        {props.children}
      </div>
    </>
  )
}

function Counter() {
  const [count, setCount] = createSignal(0)
  return (
    <button type="button" onClick={() => setCount((count) => count + 1)}>
      Counter {count()}
    </button>
  )
}
