export { Layout }

import './Layout.css'

function Layout(children) {
  return Frame(
    [
      Sidebar(
        // prettier-ignore
        // biome-ignore format:
        [
          '<a class="navitem" href="/">Home</a>',
          '<a class="navitem" href="/about">About</a>'
        ].join('\n')
      ),
      Content(children)
    ].join('\n')
  )
}

function Frame(children) {
  // prettier-ignore
  // biome-ignore format:
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
  // biome-ignore format:
  return (
`<div
  style="${[
    'padding: 20px',
    'padding-top: 42px',
    'flex-shrink: 0',
    'display: flex',
    'flex-direction: column',
    'align-items: center',
    'line-height: 1.8em',
  ].join(';')}"
>
  ${children}
</div>`
  )
}

function Content(children) {
  // prettier-ignore
  // biome-ignore format:
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
