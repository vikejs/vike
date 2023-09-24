import React from 'react'
import logoUrl from './images/icons/vike.png'

export { NavHeader }
export { NavHeaderMobile }

function NavHeaderMobile() {
  const LOGO_SIZE = 40
  return (
    <>
      <img src={logoUrl} height={LOGO_SIZE} width={LOGO_SIZE} />
      <HeaderTitle fontSize={'1.55em'} marginLeft={6} />
    </>
  )
}

function NavHeader() {
  const LOGO_SIZE = 55
  return (
    <>
      <img src={logoUrl} height={LOGO_SIZE} width={LOGO_SIZE} />
      <HeaderTitle fontSize={'2.55em'} marginLeft={10} />
    </>
  )
}

function HeaderTitle({ fontSize, marginLeft }: { fontSize: string; marginLeft: number }) {
  return (
    <span
      style={{
        fontSize,
        marginLeft,
        fontWeight: 600
      }}
    >
      Vike
    </span>
  )
}
