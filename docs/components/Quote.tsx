export { Quote }

import { getMaintainerAvatar, maintainersList } from '../pages/team/maintainersList'
import React from 'react'

function Quote({ children }: { children: React.ReactNode }) {
  const avatarSize = 25
  return (
    <div id="hero-quote" style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <QuoteIcon
          style={{
            width: 26,
            alignSelf: 'flex-start',
            position: 'relative',
            top: -6,
            opacity: 0.2,
            marginRight: 12,
            flexShrink: 0
          }}
        />
        <span style={{ maxWidth: 550 }}>{children}</span>
      </span>
      <a
        id="hero-quote-author"
        href="/team"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexShrink: 0,
          lineHeight: 1.2,
          color: 'inherit',
          position: 'relative',
          top: -3
        }}
      >
        <div>
          {maintainersList
            .filter((m) => m.isCoreTeam)
            .map((maintainer, i) => (
              <img
                style={{
                  width: avatarSize,
                  height: avatarSize,
                  verticalAlign: 'middle',
                  borderRadius: '50%',
                  marginLeft: i !== 0 ? -7 : 0,
                  position: 'relative',
                  zIndex: Math.abs(8 - i)
                }}
                src={getMaintainerAvatar(maintainer, avatarSize)}
                key={i}
              />
            ))}
        </div>
        <div style={{ opacity: 0.6, fontSize: '0.94em', marginTop: 4, marginBottom: -7 }}>Vike Team</div>
      </a>
    </div>
  )
}
function QuoteIcon(props: { style: React.CSSProperties }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 58.092 51" {...props}>
      <g fill="currentColor">
        <path d="M16.488 1.941A27.8 27.8 0 0 1 26.709 0v13.717c-1.62 0-3.226.305-4.723.897a12.4 12.4 0 0 0-4.004 2.554c-1.146 1.094-2.055 2.393-2.676 3.823s-.94 2.962-.94 4.51h2.122c3.13-.016 9.388 2.003 9.388 10.205V51H0V25.5c0-3.348.69-6.664 2.033-9.758s3.31-5.905 5.79-8.273a26.8 26.8 0 0 1 8.665-5.528zM47.87 1.941A27.8 27.8 0 0 1 58.091 0v13.717c-1.62 0-3.225.305-4.723.897a12.4 12.4 0 0 0-4.004 2.554c-1.146 1.094-2.055 2.393-2.675 3.823s-.94 2.962-.94 4.51h2.121c3.13-.016 9.388 2.003 9.388 10.205V51H31.382V25.5c0-3.348.691-6.664 2.033-9.758a25.5 25.5 0 0 1 5.79-8.273 26.8 26.8 0 0 1 8.665-5.528z"></path>
      </g>
    </svg>
  )
}
