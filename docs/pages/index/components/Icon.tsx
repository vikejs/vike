export { Icon }
export { iconSizeDefault }

import React from 'react'

const iconSizeDefault = 28

function Icon({
  icon,
  size,
  color,
  style,
}: { icon: React.JSX.Element; size: number; color: string; style?: React.CSSProperties }) {
  const margin = (iconSizeDefault - size) / 2
  return (
    <div
      style={{
        color,
        width: size,
        height: size,
        margin,
        ...style,
      }}
    >
      {icon}
    </div>
  )
}
