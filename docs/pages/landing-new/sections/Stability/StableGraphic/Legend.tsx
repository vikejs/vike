import React from 'react'
import LayoutComponent from '../../../components/LayoutComponent'
import { BoxOrange } from './EcoComponents'
import { BoxBlue } from './VikeComponents'

const StableGraphicLegend = () => {
  return (
    <LayoutComponent $size="sm">
      <div className="mt-4 grid md:grid-cols-2 gap-2 md:gap-10">
        {/* <img src={vikeLogo} alt="" className="h-auto w-5" /> */}
        <div className="flex gap-2 items-center">
          <BoxBlue $size="big" className="w-8! h-6! flex-none! m-0!" />
          <p className="flex-1 font-bold text-grey text-xs md:text-sm">Vike internal components</p>
        </div>
        <div className="flex gap-2 items-center">
          <BoxOrange $size="big" $type="lib" className="w-8! h-6! flex-none! m-0!">
            <div className="bg-linear-to-bl to-accent/7 absolute inset-0 pointer-events-none select-none" />
            <span className="w-10 h-4 block"></span>
          </BoxOrange>
          <p className="flex-1 font-bold text-grey text-xs md:text-sm">JavaScript ecoystem</p>
        </div>
      </div>
    </LayoutComponent>
  )
}

export default StableGraphicLegend
