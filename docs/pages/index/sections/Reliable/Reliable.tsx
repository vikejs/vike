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

const stylePrefix = 'landingpage-reliable'

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
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M10 16v-1H3.01L3 19c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-4h-7v1zm10-9h-4.01V5l-2-2h-4l-2 2v2H4c-1.1 0-2 .9-2 2v3c0 1.11.89 2 2 2h6v-2h4v2h6c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2m-6 0h-4V5h4z"
        />
      </svg>
    ),
    title: 'Transparent business model.',
    href: '/why#next-generation-business-model',
    description:
      "Vike's pricing keeps code 100% open source (MIT licence) and 100% gratis for software engineers while asking companies to pay a small amount. For a transparent and sustainable relationship.",
    image: <OpenSourceSVG />
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="M7 5.998a5 5 0 0 1 10 0z" />
        <path
          fill="currentColor"
          d="M6.414 8L5 6.586V4H3v3.414l3 3V12H3v2h3v1.586l-3 3V22h2v-2.586l1.36-1.36c.729 2 2.49 3.503 4.64 3.863V8zM13 8v13.917a6.01 6.01 0 0 0 4.64-3.863l1.36 1.36V22h2v-3.414l-3-3V14h3v-2h-3v-1.586l3-3V4h-2v2.586L17.586 8z"
        />
      </svg>
    ),
    title: 'Reliable by care',
    href: '/why#flexible-and-reliable-by-prioritization',
    description: (
      <>
        We are responsive with a clear guideline on how to receive guaranteed assistance. Bugs are quickly fixed
        (usually under 24 hours).
      </>
    ),
    image: <BugFixSVG />
  }
]

function Reliable() {
  return (
    <div className={`${stylePrefix}-container`}>
      <Grid>
        <div className={`${stylePrefix}-flexbox`}>
          <div
            style={{
              flex: 1
            }}
          >
            <TextBox className={`${stylePrefix}-customTextBox`}>
              <SectionTextCollection
                style={{ maxWidth: '400px' }}
                caption={data.caption}
                title={data.title}
                descriptions={data.description}
              />
              <div style={{ paddingTop: 8, marginBottom: -18 }}>
                <Link href={'/why#grow-progressively'}>
                  <Button type="secondary">Read Grow Progressively</Button>
                </Link>
              </div>
            </TextBox>
          </div>
          <div className={`${stylePrefix}-imageWrapper`}>
            <TrendingPackageSVG />
          </div>
        </div>
      </Grid>

      <div
        className={`${stylePrefix}-benefitList`}
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
                className={`${stylePrefix}-benefitWrapper`}
                style={{
                  flexDirection: i % 2 ? 'row' : 'row-reverse'
                }}
              >
                <a href={benefit.href} className={`${stylePrefix}-benefit`}>
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
                  className={`${stylePrefix}-benefitImageWrapper`}
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
