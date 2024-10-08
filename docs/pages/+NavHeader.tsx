export default {
  NavHeader,
  navHeaderWrapperStyle: getWrapperStyle(),
  NavHeaderMobile
}

import React from 'react'
import vikeIcon from '../images/icons/vike-nitedani_100x100.png'

function NavHeaderMobile() {
  const LOGO_SIZE = 20
  return (
    <>
      <img src={vikeIcon} height={LOGO_SIZE} width={LOGO_SIZE} />
      <HeaderTitle fontSize={'1.55em'} marginLeft={6} />
    </>
  )
}

function NavHeader() {
  const LOGO_SIZE = 50
  return (
    <>
      <img src={vikeIcon} height={LOGO_SIZE} width={LOGO_SIZE} />
      <HeaderTitle fontSize={'2.46em'} marginLeft={14} />
    </>
  )
}
function getWrapperStyle() {
  const navHeaderWrapperStyle: React.CSSProperties = { paddingTop: 13, paddingBottom: 1 }
  return navHeaderWrapperStyle
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
