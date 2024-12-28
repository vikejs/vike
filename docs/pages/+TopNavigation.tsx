export { TopNavigation }

import { iconGear, iconSeedling, MenuToggle } from '@brillout/docpress'
import React from 'react'

function TopNavigation() {
  return (
    <>
      <MenuToggle menuId={1}>
        <img
          src={iconGear}
          width={21}
          style={{ marginRight: 'calc(var(--icon-text-padding))' }}
          className="decolorize-8 desktop-fade"
        />{' '}
        API
      </MenuToggle>
      <a
        className="colorize-on-hover"
        href="/new"
        style={{
          color: 'inherit',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          padding: '0 var(--padding-side)'
        }}
      >
        <img
          src={iconSeedling}
          width={21}
          style={{ marginRight: 'calc(var(--icon-text-padding) - 1px)', position: 'relative', top: -1 }}
          className="decolorize-8 desktop-fade"
        />
        Get Started
      </a>
    </>
  )
}
