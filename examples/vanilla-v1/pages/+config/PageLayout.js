export { PageLayout }

import './PageLayout.css'

function PageLayout(children) {
  return Layout(
    [
      Sidebar(
        // prettier-ignore
        [
          '<a className="navitem" href="/">Home</a>',
          '<a className="navitem" href="/about">About</a>'
        ].join('\n')
      ),
      Content(children)
    ].join('\n')
  )
}

function Layout(children) {
  // prettier-ignore
  return (
`<div
  style="${[
    'display: flex',
    'max-width: 900px',
    'margin: auto'
  ].join(';')}"
>
  ${children}
</div>`
  )
}

function Sidebar(children) {
  // prettier-ignore
  return (
`<div
  style="${[
    'padding: 20px',
    'padding-top: 42px',
    'flex-shrink: 0',
    'display: flex',
    'flex-direction: column',
    'align-ttems: center',
    'line-height: 1.8em',
  ].join(';')}"
>
  ${children}
</div>`
  )
}

function Content(children) {
  // prettier-ignore
  return (
`<div
  style="${[
    'padding: 20px',
    'padding-bottom: 50px',
    'border-left: 2px solid #eee',
    'min-height: 100vh'
  ].join(';')}"
>
  ${children}
</div>`
  )
}
