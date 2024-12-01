import React from 'react'
import { TextBox } from '../../components/TextBox'
import { Grid, primaryColor } from '../../+Page'
import { SectionTextCollection } from '../../components/SectionTextCollection'
import { ParagraphTextCollection } from '../../components/ParagraphTextCollection'
import SlotMachineSVG from '../../components/SlotMachineSVG'
import { Button } from '../../components/Button/Button'
import './flexible.css'

const data = {
  caption: 'Flexible',
  title: 'Your Stack, Your Choice',
  description: [
    'Enjoy architectural freedom, use any tool, and choose any rendering and deployment strategy.',
    'Use Vike extensions to quickly integrate tools and later, if the need arises, eject for full control over tool integration.'
  ]
}

const stylePrefix = 'landingpage-flexible'

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
    title: 'Cutting edge, at your own pace',
    href: '/',
    description:
      'Choose between production-grade extensions or cutting-edge extensions — go with a conservative stack, or live on the edge in unprecedented ways.'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6.37584 21.867H12.4009M9.38839 21.867V3.79169M9.38839 3.79169L3.36328 9.8168H21.4386M9.38839 3.79169L19.4302 9.8168"
          stroke="currentColor"
          strokeWidth="2.00837"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.4224 9.8168V13.8335C17.8197 13.8335 18.2079 13.9513 18.5382 14.172C18.8685 14.3927 19.1259 14.7064 19.2779 15.0733C19.4299 15.4403 19.4697 15.8441 19.3922 16.2337C19.3147 16.6233 19.1234 16.9812 18.8426 17.262C18.5617 17.5429 18.2038 17.7342 17.8142 17.8117C17.4247 17.8892 17.0208 17.8494 16.6539 17.6974C16.2869 17.5454 15.9732 17.288 15.7525 16.9577C15.5319 16.6274 15.4141 16.2391 15.4141 15.8419"
          stroke="currentColor"
          strokeWidth="2.00837"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Build Your Own Framework',
    href: '/',
    description:
      'Create an internal company framework that empowers your senior developers to fully own the architecture, ensuring a cohesive stack across your company.'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12.9074 12.8293V12.8394M20.008 5.72874C18.4395 4.16021 13.9829 6.06715 10.0666 9.9895C6.14526 13.9108 4.23831 18.3614 5.80685 19.9309C7.37539 21.4985 11.832 19.5915 15.7483 15.6692C19.6696 11.7478 21.5766 7.29828 20.008 5.72874Z"
          stroke="currentColor"
          strokeWidth="2.00837"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.80684 5.72876C4.2383 7.29729 6.14525 11.7539 10.0676 15.6702C13.9889 19.5915 18.4395 21.4985 20.009 19.9299C21.5766 18.3614 19.6696 13.9048 15.7473 9.98851C11.8259 6.06717 7.37638 4.16022 5.80684 5.72876Z"
          stroke="currentColor"
          strokeWidth="2.00837"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Flexible, by design and priority',
    href: '/',
    description: 'From high-level design to the smallest details, Vike is built with flexibility in mind.'
  }
]

export const Flexible = () => {
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
                style={{
                  maxWidth: '400px'
                }}
                caption={data.caption}
                title={data.title}
                descriptions={data.description}
              />
            </TextBox>
          </div>
          <div
            style={{
              flex: 1
            }}
          >
            <div className={`${stylePrefix}-slotMachine`}>
              <div className={`${stylePrefix}-slotMachineImageContainer`}>
                <SlotMachineSVG />
              </div>

              <div className={`${stylePrefix}-slotMachineSeparator`} />
              <div className={`${stylePrefix}-buttonWrapper`}>
                <Button type="secondary" fullWidth>
                  Spin
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Grid>

      <div className={`${stylePrefix}-benefitWrapper`}>
        <Grid>
          <div className={`${stylePrefix}-benefitFlexbox`}>
            {benefits.map((benefit, i) => (
              <a key={i} className={`${stylePrefix}-benefit`} href={benefit.href}>
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
