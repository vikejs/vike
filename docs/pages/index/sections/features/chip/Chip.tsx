import React from 'react'
import './Chip.css'
import viteLogo from './vite.svg'
import { coreData } from './coreData'
import { ioData, ioGroups } from './ioData'
import { IllustrationNote } from '../../../components/IllustrationNote'

export const Chip = () => {
  return (
    <div
      style={{
        width: '100%'
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          marginTop: '32px',
          position: 'relative'
        }}
      >
        <div
          className="landingpage-chip-right"
          style={{
            position: 'relative',
            top: 55
          }}
        >
          {ioGroups.map((group, parentIndex) => (
            <div
              key={group.name}
              style={{
                color: `${group.color}`,
                margin: '24px 0'
              }}
            >
              {ioData
                .filter((x) => x.side === 'left' && x.group === group.name)
                .map((item, index) => (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'end',
                      position: 'relative',
                      zIndex: 5,
                      marginRight: '-32px',
                      padding: '1px 0'
                    }}
                    key={index}
                  >
                    <div
                      style={{
                        width: 'fit-content',
                        textTransform: 'uppercase',
                        color: 'rgba(0,0,0,0.5)',
                        textAlign: 'end'
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        width: '20px',
                        marginLeft: '24px',
                        textTransform: 'uppercase',
                        fontVariantNumeric: 'tabular-nums'
                      }}
                    >
                      {`${parentIndex + 1}${index + 1}`}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
        <div className="landingpage-chip">
          <ChipSvg />
          <div
            style={{
              position: 'absolute',
              top: '-3px',
              left: '0',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                width: '60%',
                aspectRatio: '1 / 1',
                display: 'grid',
                gridTemplateColumns: 'repeat(9, 1fr)',
                gridTemplateRows: 'repeat(9, 1fr)',
                gap: '4px'
              }}
            >
              {coreData.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  style={{
                    gridColumn: item.posColLg,
                    gridRow: item.posRowLg,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px'
                  }}
                >
                  <div className="landingpage-chip-feature">
                    <div
                      style={{
                        width: 'fit-content',
                        height: 'fit-content',
                        textAlign: 'center'
                      }}
                    >
                      {item.title}
                    </div>
                  </div>
                </a>
              ))}
              <div
                style={{
                  gridColumn: '1 / span 9',
                  gridRow: '4 / span 3',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '3px',
                  position: 'relative'
                }}
              >
                <a
                  href="https://vite.dev"
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#222',
                    borderRadius: '28px'
                  }}
                >
                  <img src={viteLogo} style={{ width: 'min(48px, 8vw)' }} />
                </a>
                <div
                  style={{
                    height: '5px',
                    width: '5px',
                    position: 'absolute',
                    top: '5px',
                    left: '5px',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%'
                  }}
                />
                <div
                  style={{
                    height: '5px',
                    width: '5px',
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%'
                  }}
                />
                <div
                  style={{
                    height: '5px',
                    width: '5px',
                    position: 'absolute',
                    bottom: '5px',
                    left: '5px',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%'
                  }}
                />
                <div
                  style={{
                    height: '5px',
                    width: '5px',
                    position: 'absolute',
                    bottom: '5px',
                    right: '5px',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className="landingpage-chip-left"
          style={{
            position: 'relative',
            top: 6
          }}
        >
          {ioGroups.map((group, parentIndex) => (
            <div
              key={group.name}
              style={{
                color: `${group.color}`,
                margin: '24px 0'
              }}
            >
              {ioData
                .filter((x) => x.side === 'right' && x.group === group.name)
                .map((item, index) => (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'start',
                      position: 'relative',
                      zIndex: 5,
                      marginLeft: '-32px',
                      padding: '1px 0'
                    }}
                    key={index}
                  >
                    <div
                      style={{
                        width: '20px',
                        marginRight: '24px',
                        textTransform: 'uppercase',
                        textAlign: 'end'
                      }}
                    >
                      {`${parentIndex + 1}${index + 1}`}
                    </div>
                    <div
                      style={{
                        width: 'fit-content',
                        textTransform: 'uppercase',
                        color: 'rgba(0,0,0,0.5)',
                        textAlign: 'start'
                      }}
                    >
                      {item.title}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
      <IllustrationNote
        className="landingpage-chip-info"
        click
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8
        }}
      >
        Click on a component to learn more
      </IllustrationNote>
    </div>
  )
}

const ChipSvg = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" fill="none" viewBox="0 0 542 514">
      <g clipPath="url(#clip0_334_3763)">
        <path
          fill="#DFDFE6"
          d="M81.339 0H0v513.138h81.339l22.092-19.116h325.356l22.092 19.116h90.377V0h-90.377l-22.092 22.066H103.431z"
        ></path>
        <g filter="url(#filter0_d_334_3763)">
          <rect
            width="405.795"
            height="402.327"
            x="68.801"
            y="55.605"
            fill="url(#paint0_linear_334_3763)"
            rx="41.62"
          ></rect>
          <rect width="404.795" height="401.327" x="69.301" y="56.105" stroke="#AAA" rx="41.12"></rect>
          <g filter="url(#filter1_i_334_3763)">
            <g clipPath="url(#clip1_334_3763)">
              <path fill="#7A8090" d="M98.285 83.351H445.12v346.834H98.285z"></path>
              <g stroke="#fff" strokeOpacity="0.1" strokeWidth="1.734" clipPath="url(#clip2_334_3763)">
                <path d="M82.516 55.014C196.95 25.487 259.18 122.442 281.622 206.196s114.98 213.494 288.32 167.048"></path>
                <path d="M64.332 74.25c118.522-30.581 182.982 69.867 206.232 156.636 23.249 86.769 119.104 221.184 298.634 173.079"></path>
                <path d="M46.145 93.484c122.607-31.64 189.184 71.877 213.152 161.327 23.968 89.449 122.984 227.962 308.705 178.198"></path>
                <path d="M27.965 112.72c126.185-32.557 194.842 74.494 219.618 166.958s126.866 235.716 318.005 184.501"></path>
                <path d="M9.781 131.955c132.82-34.294 204.463 76.047 230.046 171.527 25.584 95.479 132.194 243.084 333.392 189.173"></path>
              </g>
            </g>
            <rect
              width="357.239"
              height="357.239"
              x="93.083"
              y="78.149"
              stroke="#000"
              strokeWidth="10.405"
              rx="22.544"
            ></rect>
          </g>
        </g>
      </g>
      <defs>
        <clipPath id="clip0_334_3763">
          <path fill="#fff" d="M0 0h541.256v513.138H0z"></path>
        </clipPath>
        <clipPath id="clip1_334_3763">
          <rect width="346.834" height="346.834" x="98.285" y="83.351" fill="#fff" rx="17.342"></rect>
        </clipPath>
        <clipPath id="clip2_334_3763">
          <path fill="#fff" d="M98.285 83.351H445.12v346.834H98.285z"></path>
        </clipPath>
        <filter
          id="filter0_d_334_3763"
          width="473.797"
          height="470.327"
          x="34.801"
          y="23.605"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          ></feColorMatrix>
          <feOffset dy="2"></feOffset>
          <feGaussianBlur stdDeviation="17"></feGaussianBlur>
          <feComposite in2="hardAlpha" operator="out"></feComposite>
          <feColorMatrix values="0 0 0 0 0.265072 0 0 0 0 0.265072 0 0 0 0 0.265072 0 0 0 0.23 0"></feColorMatrix>
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_334_3763"></feBlend>
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_334_3763" result="shape"></feBlend>
        </filter>
        <filter
          id="filter1_i_334_3763"
          width="367.645"
          height="374.58"
          x="87.879"
          y="72.946"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          ></feColorMatrix>
          <feOffset dy="6.937"></feOffset>
          <feGaussianBlur stdDeviation="31.215"></feGaussianBlur>
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"></feComposite>
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"></feColorMatrix>
          <feBlend in2="shape" result="effect1_innerShadow_334_3763"></feBlend>
        </filter>
        <linearGradient
          id="paint0_linear_334_3763"
          x1="271.698"
          x2="271.698"
          y1="55.605"
          y2="457.931"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FDFDFF"></stop>
          <stop offset="1" stopColor="#CCD2DA"></stop>
        </linearGradient>
      </defs>
    </svg>
  )
}
