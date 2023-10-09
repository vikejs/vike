import React from 'react'

export { ScaffoldCallToAction }
export { CallToActionDescription }
export { ScaffoldCallToActionTour }

function ScaffoldCallToActionTour() {
  const CodeInline = ({ children }: { children: string }) => (
    <code style={{ fontSize: '0.92em', padding: '1px 3px' }}>{children}</code>
  )
  return (
    <div id="tour-call-to-action" style={{ textAlign: 'center', marginTop: 40 }}>
      <div style={{ display: 'inline-block', alignItems: 'center', flexDirection: 'column', textAlign: 'left' }}>
        <div style={{ fontSize: '1.2em' }}>
          <ScaffoldCallToAction />
        </div>
        <div style={{ fontSize: '0.83rem', marginTop: 9, display: 'flex' }}>
          <div style={{ width: 0, flexGrow: 1, color: '#888' }}>
            Run <CodeInline>$ npm init vike</CodeInline> to scaffold a new Vite/
            <CodeInline>vike</CodeInline> app, or add <CodeInline>vike</CodeInline> to your existing app by following
            the instructions <a href="/add">here</a>.
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
            cursor: 'pointer',
            width: 352
          }}
        >
          <span style={{ color: '#bbb' }}>$</span> npm init vike
        </code>
      </div>
    </>
  )
}

function CallToActionDescription({ children, style }: { style?: React.CSSProperties; children: React.ReactNode }) {
  return <p style={{ marginBottom: 5, color: 'inherit', opacity: 0.7, fontSize: '0.92em', ...style }}>{children}</p>
}
