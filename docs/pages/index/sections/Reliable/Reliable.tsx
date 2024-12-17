export { Reliable }

import React from 'react'
import { TextBox } from '../../components/TextBox'
import { Grid } from '../../Grid'
import { SectionTextCollection } from '../../components/SectionTextCollection'
import { ParagraphTextCollection } from '../../components/ParagraphTextCollection'
import OpenSourceSVG from '../../components/OpenSourceSVG'
import BugFixSVG from '../../components/BugFixSVG'
import TrendingPackageSVG from './../../components/TrendingPackageSVG'
import './reliable.css'
import { Link } from '@brillout/docpress'
import { Button } from '../../components/Button/Button'
import { IllustrationNote } from '../../components/IllustrationNote'

const data = {
  caption: 'Dependable',
  title: 'Adopt the Future',
  description: [
    <>
      Vike is a flexible and unopinionated core that is <b>open to JavaScript's rapidly evolving ecosystem</b>. Place
      your bets on a framework that embraces the future.
    </>,
    <>
      <b>Progressively migrate</b> one stack component and one page at a time, instead of big never-ending migrations.
    </>
  ]
}

const benefits = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" width="24" height="24" viewBox="0 0 47.99 47.99">
        <path
          opacity="0.5"
          stroke="#000"
          strokeWidth="0.1"
          d="M9.048 25.117 25.117 9.049l1.046 1.046-16.068 16.068zM15.774 26.058l11.402-11.402 1.046 1.046L16.82 27.105z"
        ></path>
        <rect
          width="44.99"
          height="44.99"
          x="1.5"
          y="1.5"
          fill="none"
          stroke="#000"
          strokeWidth="3"
          rx="5"
          ry="5"
        ></rect>
      </svg>
    ),
    title: 'Transparent business model',
    href: '/pricing',
    description:
      "Vike's pricing keeps code 100% open source (MIT licence) and 100% gratis for software engineers while asking companies to pay a small amount, for a transparent and sustainable relationship.",
    image: <OpenSourceSVG />
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-5 -10 79.88 79.88">
        <path d="M74.021 15.936 61.15-1.189a4.14 4.14 0 0 0-3.379-1.684H12.103c-1.36 0-2.559.598-3.379 1.684L-4.143 15.932a4.185 4.185 0 0 0 .227 5.348l35.699 40.059.008.007a4.2 4.2 0 0 0 3.152 1.407c1.219 0 2.332-.5 3.152-1.414l35.707-40.062a4.19 4.19 0 0 0 .219-5.348zM58.064 1.135l11.672 15.531H51.353L46.794.994h10.977c.141 0 .211.035.29.14zM18.607 20.53l11.902 33.578L.583 20.53zm28.562 0-12.23 34.512-12.23-34.512zm-24.621-3.863L27.107.995H42.77l4.558 15.672zm28.723 3.863h18.027L39.376 54.1zM11.81 1.135c.082-.11.152-.145.293-.145H23.08l-4.559 15.672-18.379.004L11.814 1.14z"></path>
      </svg>
    ),
    title: 'Reliable',
    href: '/why#flexible-and-reliable-by-prioritization',
    description: (
      <>
        We are responsive and provide clear guidelines on how to receive reliable assistance. Bugs are quickly fixed
        (usually within 24 hours).
      </>
    ),
    image: <BugFixSVG />
  }
]

function Reliable() {
  return (
    <div className={`landingpage-reliable-container`}>
      <Grid>
        <div className={`landingpage-reliable-flexbox`}>
          <div
            style={{
              flex: 1
            }}
          >
            <TextBox className={`landingpage-reliable-customTextBox`}>
              <SectionTextCollection
                style={{ maxWidth: '400px' }}
                caption={data.caption}
                title={data.title}
                descriptions={data.description}
              />
              <div style={{ paddingTop: 8 }}>
                <Link href={'/why#grow-progressively'}>
                  <Button type="secondary">Read Grow Progressively</Button>
                </Link>
              </div>
            </TextBox>
          </div>
          <div className={`landingpage-reliable-imageWrapper`}>
            <TrendingPackageSVG />
            <IllustrationNote style={{ maxWidth: 300, margin: 'auto' }}>
              Vike extensions are a thin layer of glue code that can easily be forked
            </IllustrationNote>
          </div>
        </div>
      </Grid>

      <div
        className={`landingpage-reliable-benefitList`}
        style={{
          width: '100%',
          borderTop: `3px solid #FFFFFF`,
          borderBottom: `3px solid #FFFFFF`
        }}
      >
        {benefits.map((benefit, i) => (
          <div
            key={i}
            style={{
              width: '100%',
              borderTop: i === 0 ? undefined : `3px solid #FFF`
            }}
          >
            <Grid>
              <div
                className={`landingpage-reliable-benefitWrapper`}
                style={{
                  flexDirection: i % 2 ? 'row' : 'row-reverse'
                }}
              >
                <a href={benefit.href} className={`landingpage-reliable-benefit`}>
                  <TextBox>
                    <ParagraphTextCollection
                      icon={benefit.icon}
                      title={benefit.title}
                      description={benefit.description}
                      buttonLable="Learn More"
                    />
                  </TextBox>
                </a>
                <div
                  className={`landingpage-reliable-benefitImageWrapper`}
                  style={{
                    borderRight: i % 2 ? '0px' : '3px solid #FFF',
                    borderLeft: i % 2 ? '3px solid #FFF' : '0px'
                  }}
                >
                  {benefit.image}
                </div>
              </div>
            </Grid>
          </div>
        ))}
      </div>
    </div>
  )
}