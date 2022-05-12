import React, { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'

export { Page }

function Page() {
  return (
    <>
      <b>
        <i>
          Time elapsed: <TimeElapsed />
        </i>
        <Counter />
      </b>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
      <hr />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  )
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <p>Example of client-side routing with React Router and SSR.</p>
      <p>
        This page is rendered to HTML, see <Code>view-source:http://localhost:3000</Code>.
      </p>
    </div>
  )
}

function About() {
  return (
    <>
      <h2>About</h2>
      <p>
        Note how the elapsed time above didn't reset when you switched to the <Code>/about</Code> page.
      </p>
      <p>
        This page is rendered to HTML, see <Code>view-source:http://localhost:3000/about</Code>.
      </p>
    </>
  )
}

function Code(props) {
  const style = {
    backgroundColor: '#eaeaea',
    padding: '1px 4px',
    borderRadius: '3px',
    ...props.style,
  }
  return <code {...props} style={style} />
}

function TimeElapsed() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timeout = setInterval(() => {
      setCount((c) => c + 1)
    }, 1000)
    return () => clearTimeout(timeout)
  }, [])

  return <>{count}</>
}

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount((count) => count + 1)} style={{ marginLeft: 10 }}>
      Count: <span>{count}</span>
    </button>
  )
}
