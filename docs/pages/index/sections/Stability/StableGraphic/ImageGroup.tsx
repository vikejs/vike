import React from 'react'

const barIndexesDesktop = [0, 1, 2, 3, 4, 5, 6]
const barIndexesMobile = [0, 1, 2, 3]

const ImageGroup = () => {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-3 z-0 select-none md:top-4">
      <div className="hidden justify-center gap-9 opacity-75 md:flex">
        {barIndexesDesktop.map((barIndex) => (
          <span
            key={barIndex}
            className="block h-16 w-3.5 rounded-b-full bg-linear-to-b from-base-300/90 via-base-300/55 to-base-300/0"
          />
        ))}
      </div>
      <div className="flex justify-center gap-6 opacity-70 md:hidden">
        {barIndexesMobile.map((barIndex) => (
          <span
            key={barIndex}
            className="block h-12 w-3 rounded-b-full bg-linear-to-b from-base-300/85 via-base-300/50 to-base-300/0"
          />
        ))}
      </div>
    </div>
  )
}

export default ImageGroup
