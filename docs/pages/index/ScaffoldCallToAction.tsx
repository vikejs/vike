import React from 'react'

export { ScaffoldCallToAction }
export { CallToActionDescription }
export { ScaffoldCallToActionTour }

function ScaffoldCallToActionTour() {
  const Code = ({children}: {children: string}) => <code style={{fontSize: '0.92em', padding: '1px 3px'}}>{children}</code>
  return (
    <div style={{ textAlign: 'center', marginTop: 40 }}>
      <div style={{ display: 'inline-block', alignItems: 'center', flexDirection: 'column', textAlign: 'left' }}>
        <div style={{ fontSize: '1.2em' }}>
          <ScaffoldCallToAction />
        </div>
        <div style={{ fontSize: '0.83rem', marginTop: 9, display: 'flex' }}>
          <div style={{ width: 0, flexGrow: 1, color: '#888' }}>
            Run <Code>$ npm init vite-plugin-ssr</Code> to scaffold a new Vite/<Code>vite-plugin-ssr</Code> app, or
            add <Code>vite-plugin-ssr</Code> to your existing app by following the instructions{' '}
            <a href="/install">here</a>.
          </div>
        </div>
      </div>
    </div>
  )
}

function ScaffoldCallToAction() {
  return (
    <>
      <div>
        <code
          id="npm-init-code-snippet"
          aria-label="Click to copy"
          data-balloon-pos="left"
          style={{
            fontSize: '1.55em',
            padding: '10px 20px',
            whiteSpace: 'nowrap',
            borderRadius: 5,
            display: 'inline-block',
            color: 'black',
            cursor: 'pointer'
          }}
        >
          <span style={{ color: '#bbb' }}>$</span> npm init vite-plugin-ssr
        </code>
      </div>
    </>
  )
}

function CallToActionDescription({
  children,
  style
}: {
  style?: React.CSSProperties
  children: (string | JSX.Element)[]
}) {
  return <p style={{ marginBottom: 5, color: 'inherit', opacity: 0.7, fontSize: '0.92em', ...style }}>{children}</p>
}
