export { Icon }
export { iconSizeDefault }

import React from 'react'

const iconSizeDefault = 28

function Icon({ icon, size, color }: { icon: JSX.Element; size: number; color: string }) {
  const margin = (iconSizeDefault - size) / 2
  return (
    <div
      style={{
        color,
        width: size,
        height: size,
        marginLeft: margin,
        marginRight: margin
      }}
    >
      {icon}
    </div>
  )
}
