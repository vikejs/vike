export default {
  NavHeader,
  navHeaderWrapperStyle: getWrapperStyle(),
  NavHeaderMobile
}

import React from 'react'
import vikeIcon from '../images/icons/vike-square-gradient.svg'

function NavHeaderMobile() {
  const LOGO_SIZE = 40
  return (
    <>
      <img src={vikeIcon} height={LOGO_SIZE} width={LOGO_SIZE} />
      <HeaderTitle fontSize={'1.55em'} marginLeft={6} />
    </>
  )
}

function NavHeader() {
  const LOGO_SIZE = 80
  return (
    <>
      <img src={vikeIcon} height={LOGO_SIZE} width={LOGO_SIZE} />
      <HeaderTitle fontSize={'3.3em'} marginLeft={14} />
    </>
  )
}
function getWrapperStyle() {
  const navHeaderWrapperStyle: React.CSSProperties = { paddingTop: 16, paddingBottom: 1 }
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
