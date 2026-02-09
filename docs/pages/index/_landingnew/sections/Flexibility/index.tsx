import React from 'react'

import LayoutComponent from '../../components/LayoutComponent'
import HeadlineGroup from '../../components/HeadlineGroup'
import GradientText from '../../components/GradientText'
import SectionHeader from '../../components/SectionHeader'
import NavigationTabs from './NavigationTabs'
import ReadOnlyEditor from './Editor'
import { Link } from '@brillout/docpress'
import FlexGraphic from './FlexGraphic'
import { ChevronRight, ChevronsRight } from 'lucide-react'
import GlassContainer from '../../components/GlassContainer'

const FlexibilitySection = () => {
  return (
    <>
      <LayoutComponent className="mt-20 ">
        <SectionHeader
          icon={'🕊️'}
          badgeText="Flexibility"
          main={
            <>
              Your stack, your <GradientText color="green">choice</GradientText>
            </>
          }
          sub="Any tools. Any API. Any backend. Any rendering. Any deployment."
          color="green"
        />
        <NavigationTabs />
        <ReadOnlyEditor />
      </LayoutComponent>
      <LayoutComponent className="mt-20 mb-90">
        <GlassContainer>
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-0 justify-center min-h-90">
              <HeadlineGroup
                headingStyle="h1"
                outerClassName='mb-8'
                centered={false}
                main={
                  <>
                    <GradientText color="green">Limitless</GradientText> design
                  </>
                }
                sub="Build anything you want"
              />
              <p className='mb-8'>
                That’s it. We focus on that, so you as the user and also vike developers share access to the same vast
                hook-driven ecosystem. Vike behaves the same, only the perspective changes.
              </p>
              <p>
                <a href="/docs/hooks/introduction" className="btn btn-soft btn-primary">
                  Learn more about hooks <ChevronsRight className="w-4 h-4" />
                </a>
              </p>
            </div>
            <div className="relative">
              <FlexGraphic />
            </div>
          </div>
        </GlassContainer>
      </LayoutComponent>
    </>
  )
}

export default FlexibilitySection
