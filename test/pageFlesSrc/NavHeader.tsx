import React from 'react'
import logoUrl from './images/icons/vite-plugin-ssr.svg'

export { NavHeader }
export { NavHeaderMobile }

function NavHeaderMobile() {
  const LOGO_SIZE = 40
  return (
    <>
      <img src={logoUrl} height={LOGO_SIZE} width={LOGO_SIZE} />
      <HeaderTitle fontSize={'1.25em'} marginLeft={5} />
    </>
  )
}

function NavHeader() {
  const LOGO_SIZE = 55
  return (
    <>
      <img src={logoUrl} height={LOGO_SIZE} width={LOGO_SIZE} />
      <HeaderTitle fontSize={'1.55em'} marginLeft={10} />
    </>
  )
}

function HeaderTitle({ fontSize, marginLeft }: { fontSize: string; marginLeft: number }) {
  return (
    <code
      style={{
        backgroundColor: '#f4f4f4',
        borderRadius: 4,
        fontSize,
        padding: '2px 5px',
        marginLeft
      }}
    >
      {'vite-plugin-ssr'}
    </code>
  )
}
