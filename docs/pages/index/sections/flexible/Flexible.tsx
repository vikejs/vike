import React from 'react'
import { TextBox } from '../../components/TextBox'
import { Grid } from '../../components/Grid'
import { SectionTextCollection } from '../../components/SectionTextCollection'
import { ParagraphTextCollection } from '../../components/ParagraphTextCollection'
import './Flexible.css'
import { Button } from '../../components/button/Button'
import { Link } from '@brillout/docpress'
import { Icon, iconSizeDefault } from '../../components/Icon'
import OrigamiIcon from './origami.svg?react'
import CraneIcon from './crane.svg?react'
import SignIcon from './sign.svg?react'
import { IllustrationNote } from '../../components/IllustrationNote'
import slotMachine from './slot-machine/slotMachine.svg'

const data = {
  caption: 'Flexible',
  title: 'Your Stack, Your Choice',
  description: [
    <>
      Enjoy <b>architectural freedom</b> and choose any tool (React/Vue/...), any data connection (RPC/REST/GraphQL),
      any rendering (SPA/SSR/SSG), and any deployment (static/server/edge).
    </>,
    <>
      Use <b>Vike extensions</b> for automatic integration and later, if the need arises, <b>eject for full control</b>{' '}
      over integration.
    </>,
  ],
}

const iconColor = '#333'

const benefits = [
  {
    icon: <Icon icon={<OrigamiIcon />} size={iconSizeDefault + 13} color={iconColor}></Icon>,
    title: 'Flexible by design',
    href: '/why#flexible-by-design',
    description: 'From high-level design to the smallest details, Vike is built with flexibility in mind.',
  },
  {
    icon: <Icon icon={<SignIcon />} size={iconSizeDefault + 12} color={iconColor}></Icon>,
    title: 'Cutting edge, at your own pace',
    href: '/why#conservative-or-cutting-edge-your-choice',
    description:
      'Choose between stable and cutting-edge extensions; go with a conservative stack or live on the edge in unprecedented ways.',
  },
  {
    icon: <Icon icon={<CraneIcon />} size={iconSizeDefault + 10} color="#444"></Icon>,
    title: 'Build Your Own Framework',
    href: '/why#build-your-own-framework',
    description:
      'Create a company internal framework that empowers your Software Architects to own the architecture and your Product Developers to quickly iterate.',
  },
]

export const Flexible = () => {
  return (
    <div className={`landingpage-flexible-container`}>
      <Grid>
        <div className={`landingpage-flexible-flexbox`}>
          <div
            style={{
              flex: 1,
            }}
          >
            <TextBox className={`landingpage-flexible-customTextBox`}>
              <SectionTextCollection
                style={{
                  maxWidth: '400px',
                }}
                caption={data.caption}
                title={data.title}
                descriptions={data.description}
              />
              <div style={{ paddingTop: 22, marginBottom: 23 }}>
                <Link href={'/why#architecture'}>
                  <Button type="secondary" readingRecommendation>
                    Architecture
                  </Button>
                </Link>
              </div>
            </TextBox>
          </div>
          <div
            style={{
              flex: 1,
            }}
          >
            <div
              className={`landingpage-flexible-slotMachine`}
              style={{
                justifyContent: 'center',
              }}
            >
              <div className={`landingpage-flexible-slotMachineImageContainer`}>
                <img src={slotMachine} />
                <IllustrationNote>Plug & Play &mdash; powered by Vike extensions</IllustrationNote>
              </div>
              {/*
              <div className={`landingpage-flexible-slotMachineSeparator`} />
              <div className={`landingpage-flexible-buttonWrapper`}>
                <Button type="secondary" fullWidth>
                  Spin
                </Button>
              </div>
              */}
            </div>
          </div>
        </div>
      </Grid>

      <div className={`landingpage-flexible-benefitWrapper`}>
        <Grid>
          <div className={`landingpage-flexible-benefitFlexbox`}>
            {benefits.map((benefit, i) => (
              <a key={i} className={`landingpage-flexible-benefit`} href={benefit.href}>
                <TextBox>
                  <ParagraphTextCollection
                    icon={benefit.icon}
                    title={benefit.title}
                    description={benefit.description}
                    buttonLable="Learn More"
                  />
                </TextBox>
              </a>
            ))}
          </div>
        </Grid>
      </div>
    </div>
  )
}
