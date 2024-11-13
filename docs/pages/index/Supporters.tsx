export { SupporterImg }

import React from 'react'

function SupporterImg({
  imgSrc, // has precedence over avatarUrl
  avatarUrl, // has precedence over username
  username,
  imgAlt,
  width,
  height,
  padding = 0
}: {
  imgSrc?: string
  avatarUrl?: string
  username?: string
  imgAlt?: string
  width: number
  height: number
  padding?: number
}) {
  const size = Math.max(width, height)
  if (avatarUrl) {
    imgSrc = imgSrc || `${avatarUrl}&size=${size}`
  }
  if (username) {
    imgSrc = imgSrc || `https://github.com/${username}.png?size=${size}`
    imgAlt = imgAlt || username
  }
  return (
    <img
      style={{ width: `calc(100% - ${padding}px)`, height: height - padding, zIndex: 2, objectFit: 'contain' }}
      src={imgSrc}
      alt={imgAlt}
    />
  )
}
