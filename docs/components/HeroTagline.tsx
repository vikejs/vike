export { HeroTagline }

import { Link } from '@brillout/docpress'
import React from 'react'

function HeroTagline({
  style,
  styleH1,
  taglineStyle,
  taglineSecondary,
  taglineSecondaryStyle,
}: {
  style?: React.CSSProperties
  styleH1?: React.CSSProperties
  taglineStyle?: React.CSSProperties
  taglineSecondary?: string
  taglineSecondaryStyle?: React.CSSProperties
} = {}) {
  return (
    <div style={style}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            color: '#000000',
            textAlign: 'center',
            width: '100%',
            marginBottom: 0,
            fontWeight: 580,
            ...styleH1,
          }}
        >
          <div
            style={{
              letterSpacing: 0.7,
              opacity: 0.9,
              ...taglineStyle,
            }}
          >
            <span style={{ whiteSpace: 'nowrap' }}>
              Build{' '}
              <span
                style={{
                  fontWeight: 700,
                  color: '#42d392',
                  background: '-webkit-linear-gradient(315deg, #FF8C00 25%, #FFFF00)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                fast
              </span>
              .
            </span>{' '}
            <span style={{ whiteSpace: 'nowrap' }}>
              Build{' '}
              <span
                style={{
                  fontWeight: 700,
                  color: '#42d392',
                  background: '-webkit-linear-gradient(315deg, #00C6FB 45%, #005BEA)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                right
              </span>
              .
            </span>
          </div>
          <div
            style={{
              textAlign: 'center',
              width: '100%',
              margin: 'auto',
              marginTop: 10,
              lineHeight: 1.35,
              fontWeight: 450,
              color: '#878787',
              maxWidth: 800,
              ...taglineSecondaryStyle,
            }}
          >
            {taglineSecondary ? (
              taglineSecondary
            ) : (
              <>
                Composable framework to build advanced applications, with blazing-fast{' '}
                <LinkTagline href="/new" color="#fe9618">
                  quick&nbsp;start
                </LinkTagline>
                , next-generation{' '}
                <LinkTagline href="#full-fledged" color="#fed518">
                  DX
                </LinkTagline>
                , unprecedented{' '}
                <LinkTagline href="#flexible" color="#18cbfa">
                  flexibility
                </LinkTagline>
                , and foundational{' '}
                <LinkTagline href="#stable" color="#1878ed">
                  stability
                </LinkTagline>
                .
              </>
            )}
          </div>
        </h1>
      </div>
    </div>
  )
}

function LinkTagline({
  color,
  href,
  ...props
}: {
  color: string
  href: string
  children: React.ReactNode
}) {
  return href.startsWith('#') ? (
    <a href={href} onClick={onClick} style={{ color, borderBottom: `2px dotted ${color}` }} {...props} />
  ) : (
    <Link href={href} style={{ color, borderBottom: `2px dotted ${color}` }} {...props} />
  )

  function onClick(ev: React.MouseEvent<HTMLAnchorElement>) {
    ev.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }
}
