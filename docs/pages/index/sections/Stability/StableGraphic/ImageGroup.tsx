import React from 'react'

const barIndexesDesktop = [0, 1, 2, 3, 4, 5, 6]
const barIndexesMobile = [0, 1, 2, 3]

const ImageGroup = () => {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-0 select-none">
      <div className="hidden justify-center gap-8 md:flex">
        {barIndexesDesktop.map((barIndex) => (
          <span key={barIndex} className="block h-9 w-4 rounded-b-full bg-base-300/80" />
        ))}
      </div>
      <div className="flex justify-center gap-5 md:hidden">
        {barIndexesMobile.map((barIndex) => (
          <span key={barIndex} className="block h-7 w-3 rounded-b-full bg-base-300/80" />
        ))}
      </div>
    </div>
  )
}

export default ImageGroup
