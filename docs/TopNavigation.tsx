export { TopNavigation }

import { iconGear, iconSeedling, iconMegaphone, iconCoin, MenuToggle } from '@brillout/docpress'
import React from 'react'

function TopNavigation() {
  return (
    <>
      <MenuToggle menuId={1}>
        <img
          src={iconGear}
          width={18}
          style={{ marginRight: 'calc(var(--icon-text-padding))' }}
          className="decolorize-8"
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
          padding: '0 var(--padding-side)',
        }}
      >
        <img
          src={iconSeedling}
          width={18}
          style={{ marginRight: 'calc(var(--icon-text-padding) - 1px)' }}
          className="decolorize-8"
        />
        Get Started
      </a>
      <MenuToggle menuId={2}>
        <img
          src={iconMegaphone}
          width={23}
          style={{ marginRight: 'calc(var(--icon-text-padding) + 1px)', position: 'relative', top: 1 }}
          className="decolorize-5"
        />
        Blog
      </MenuToggle>
      {/*
      <a
        className="colorize-on-hover"
        href="/pricing"
        style={{
          color: 'inherit',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          padding: '0 var(--padding-side)',
        }}
      >
        <img
          src={iconCoin}
          width={19}
          style={{ marginRight: 'calc(var(--icon-text-padding) - 1px)' }}
          className="decolorize-8"
        />
        Pricing
      </a>
      */}
    </>
  )
}
