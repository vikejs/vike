import React from 'react'

import linesTop from '../../../assets/stability/lines-top.png'
import linesTopMobile from '../../../assets/stability/lines-top@0.5.png'
import linesRight from '../../../assets/stability/lines-right.png'
import linesLeft from '../../../assets/stability/lines-left.png'

const ImageGroup = () => (
  <div className="absolute inset-0 pointer-events-none select-none">
    <img
      suppressHydrationWarning
      loading="lazy"
      src={linesTop}
      data-speed="0.96"
      alt=""
      className="ml-[2.5%] w-[95%] object-fill absolute -top-30 h-30 left-0 md:block hidden"
    />
    <img
      suppressHydrationWarning
      loading="lazy"
      src={linesTopMobile}
      data-speed="0.96"
      alt=""
      className="ml-[5%] w-[90%] object-fill absolute -top-20 h-20 left-0 md:hidden block"
    />
    <img
      suppressHydrationWarning
      loading="lazy"
      src={linesRight}
      data-speed="0.96"
      alt=""
      className="-right-30 top-8 w-30 object-fill sm:block hidden absolute h-30"
    />
    <img
      suppressHydrationWarning
      loading="lazy"
      src={linesLeft}
      data-speed="0.96"
      alt=""
      className="-left-30 top-8 w-30 object-fill sm:block hidden absolute h-30"
    />
  </div>
)

export default ImageGroup
