import React from 'react'

export { HorizontalLine }

function HorizontalLine({ primary }: { primary?: true }) {
  return (
    <div className={'header-separator-line ' + (primary ? 'primary' : '')} style={{ textAlign: 'center' }}>
      <hr
        style={{
          display: 'inline-block',
          margin: 0,
          border: 0,
          borderTop: '1px solid #eee',
          maxWidth: 500,
          width: '80%'
        }}
      />
    </div>
  )
}
