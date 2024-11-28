import React from 'react'
import { TextBox } from '../components/TextBox'
import { Grid, primaryColor } from '../+Page'
import { SectionTextCollection } from '../components/SectionTextCollection'
import { ParagraphTextCollection } from '../components/ParagraphTextCollection'

const data = {
  caption: 'Reliable',
  title: 'Future-proof',
  description: [
    "Vike's flexible core is unopinionated and open to JavaScript's rapidly evolving ecosystem. Place your bets on a framework that embraces the future.",
    'Progressively migrate one stack component and one page at a time, instead of big never-ending migrations.'
  ]
}

const benefits = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M22.6212 14.6541L20.6212 12.1541C20.5275 12.0371 20.4086 11.9426 20.2734 11.8777C20.1382 11.8128 19.9902 11.7791 19.8402 11.7791H13.8402V9.77914H19.8402C20.9432 9.77914 21.8402 8.88214 21.8402 7.77914V4.77914C21.8402 3.67614 20.9432 2.77914 19.8402 2.77914H5.84022C5.69025 2.77909 5.54219 2.81276 5.407 2.87768C5.27181 2.94259 5.15295 3.03708 5.05922 3.15414L3.05922 5.65414C2.91722 5.83151 2.83984 6.05194 2.83984 6.27914C2.83984 6.50635 2.91722 6.72678 3.05922 6.90414L5.05922 9.40414C5.15295 9.52121 5.27181 9.6157 5.407 9.68061C5.54219 9.74553 5.69025 9.7792 5.84022 9.77914H11.8402V11.7791H5.84022C4.73722 11.7791 3.84022 12.6761 3.84022 13.7791V16.7791C3.84022 17.8821 4.73722 18.7791 5.84022 18.7791H11.8402V22.7791H13.8402V18.7791H19.8402C19.9902 18.7792 20.1382 18.7455 20.2734 18.6806C20.4086 18.6157 20.5275 18.5212 20.6212 18.4041L22.6212 15.9041C22.7632 15.7268 22.8406 15.5063 22.8406 15.2791C22.8406 15.0519 22.7632 14.8315 22.6212 14.6541ZM5.12122 6.27914L6.32022 4.77914H19.8402L19.8422 7.77914H6.32022L5.12122 6.27914ZM19.3602 16.7791H5.84022V13.7791H19.3602L20.5602 15.2791L19.3602 16.7791Z"
          fill="currentColor"
        />
      </svg>
    ),
    title: 'Transparent business model.',
    description:
      "Vike's Open Source Pricing keeps code 100% open source (MIT license) and 100% gratis for software engineers while asking companies to pay a small amount, for a transparent and sustainable relationship."
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M22.6212 14.6541L20.6212 12.1541C20.5275 12.0371 20.4086 11.9426 20.2734 11.8777C20.1382 11.8128 19.9902 11.7791 19.8402 11.7791H13.8402V9.77914H19.8402C20.9432 9.77914 21.8402 8.88214 21.8402 7.77914V4.77914C21.8402 3.67614 20.9432 2.77914 19.8402 2.77914H5.84022C5.69025 2.77909 5.54219 2.81276 5.407 2.87768C5.27181 2.94259 5.15295 3.03708 5.05922 3.15414L3.05922 5.65414C2.91722 5.83151 2.83984 6.05194 2.83984 6.27914C2.83984 6.50635 2.91722 6.72678 3.05922 6.90414L5.05922 9.40414C5.15295 9.52121 5.27181 9.6157 5.407 9.68061C5.54219 9.74553 5.69025 9.7792 5.84022 9.77914H11.8402V11.7791H5.84022C4.73722 11.7791 3.84022 12.6761 3.84022 13.7791V16.7791C3.84022 17.8821 4.73722 18.7791 5.84022 18.7791H11.8402V22.7791H13.8402V18.7791H19.8402C19.9902 18.7792 20.1382 18.7455 20.2734 18.6806C20.4086 18.6157 20.5275 18.5212 20.6212 18.4041L22.6212 15.9041C22.7632 15.7268 22.8406 15.5063 22.8406 15.2791C22.8406 15.0519 22.7632 14.8315 22.6212 14.6541ZM5.12122 6.27914L6.32022 4.77914H19.8402L19.8422 7.77914H6.32022L5.12122 6.27914ZM19.3602 16.7791H5.84022V13.7791H19.3602L20.5602 15.2791L19.3602 16.7791Z"
          fill="currentColor"
        />
      </svg>
    ),
    title: 'Reliable, by care',
    description:
      'We are responsive with a clear guideline on how to receive guaranteed assistance. Bugs are quickly fixed (usually under 24 hours).'
  }
]

export const Reliable = () => {
  return (
    <div
      style={{
        marginTop: '80px',
        marginBottom: '-3px',
        width: '100%'
      }}
    >
      <Grid>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap'
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: '400px'
            }}
          >
            <TextBox>
              <SectionTextCollection
                style={{ maxWidth: '400px' }}
                caption={data.caption}
                title={data.title}
                descriptions={data.description}
              />
            </TextBox>
          </div>
          <div
            style={{
              flex: 1,
              minWidth: '400px',
              backgroundColor: '#EBEBEF'
            }}
          />
        </div>
      </Grid>

      <div
        style={{
          width: '100%',
          borderTop: `3px solid #FFFFFF`,
          borderBottom: `3px solid #FFFFFF`,
          marginTop: '64px'
        }}
      >
        {benefits.map((benefit, i) => (
          <div
            key={i}
            style={{
              width: '100%',
              borderTop: i === 0 ? '' : `3px solid #FFF`
            }}
          >
            <Grid>
              <div
                style={{
                  borderRight: '3px solid #FFF',
                  borderLeft: '3px solid #FFF',
                  display: 'flex',
                  flexDirection: i % 2 ? 'row' : 'row-reverse'
                }}
              >
                <div
                  style={{
                    width: '41.6%', // 5/12
                    padding: '32px 0',
                    paddingRight: '48px',
                    minHeight: '240px'
                  }}
                >
                  <TextBox>
                    <ParagraphTextCollection
                      icon={benefit.icon}
                      title={benefit.title}
                      description={benefit.description}
                    />
                  </TextBox>
                </div>
                <div
                  style={{
                    width: '58.4%', // 7/12
                    backgroundColor: '#EBEBEF'
                  }}
                />
              </div>
            </Grid>
          </div>
        ))}
      </div>
    </div>
  )
}
