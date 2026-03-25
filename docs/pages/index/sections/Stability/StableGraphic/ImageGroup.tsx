import React from 'react'

const barIndexesDesktop = [0, 1, 2, 3, 4, 5, 6]
const barIndexesMobile = [0, 1, 2, 3]

const ImageGroup = () => {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-0 select-none">
      <div className="hidden translate-y-[-14px] justify-center gap-8 opacity-55 md:flex">
        {barIndexesDesktop.map((barIndex) => (
          <span
            key={barIndex}
            className="block h-12 w-3 rounded-b-full bg-linear-to-b from-base-300/85 via-base-300/45 to-base-300/0"
          />
        ))}
      </div>
      <div className="flex translate-y-[-10px] justify-center gap-5 opacity-50 md:hidden">
        {barIndexesMobile.map((barIndex) => (
          <span
            key={barIndex}
            className="block h-10 w-2.5 rounded-b-full bg-linear-to-b from-base-300/80 via-base-300/40 to-base-300/0"
          />
        ))}
      </div>
    </div>
  )
}

export default ImageGroup
