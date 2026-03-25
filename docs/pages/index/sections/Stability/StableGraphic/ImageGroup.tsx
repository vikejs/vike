import React from 'react'

const barIndexesDesktop = [0, 1, 2, 3, 4, 5, 6]
const barIndexesMobile = [0, 1, 2, 3]

const ImageGroup = () => {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-8 z-0 select-none md:top-10">
      <div className="hidden justify-center gap-10 md:flex">
        {barIndexesDesktop.map((barIndex) => (
          <span
            key={barIndex}
            className="block h-16 w-4 rounded-md bg-linear-to-b from-base-300/0 via-base-300/38 to-base-300/0"
          />
        ))}
      </div>
      <div className="flex justify-center gap-6 md:hidden">
        {barIndexesMobile.map((barIndex) => (
          <span
            key={barIndex}
            className="block h-14 w-3 rounded-md bg-linear-to-b from-base-300/0 via-base-300/34 to-base-300/0"
          />
        ))}
      </div>
    </div>
  )
}

export default ImageGroup
