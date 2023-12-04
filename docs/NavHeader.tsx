import React from 'react'
import vikeIcon from './images/icons/vike-square-gradient.svg'

export { NavHeader }
export { navHeaderWrapperStyle }
export { NavHeaderMobile }

function NavHeaderMobile() {
  const LOGO_SIZE = 40
  return (
    <>
      <img src={vikeIcon} height={LOGO_SIZE} width={LOGO_SIZE} />
      <HeaderTitle fontSize={'1.55em'} marginLeft={6} />
    </>
  )
}

const navHeaderWrapperStyle: React.CSSProperties = { paddingTop: 16, paddingBottom: 1 }
function NavHeader() {
  const LOGO_SIZE = 80
  return (
    <>
      <img src={vikeIcon} height={LOGO_SIZE} width={LOGO_SIZE} />
      <HeaderTitle fontSize={'3.3em'} marginLeft={14} />
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
