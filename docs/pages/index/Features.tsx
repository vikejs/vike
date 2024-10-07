export { Features }

import React, { useEffect } from 'react'
import './FeaturesLayout.css'
import './FeaturesColors.css'
import './HeadingUnderlineAnimation.css'

function Features() {
  useHeadingUnderlineAnimation()
  return (
    <div id="feature-list">
      <Flexible />
      <Reliable />
      <Fast />
      <ClutterFree />
      <CommunityDriven />
    </div>
  )
}

function Flexible() {
  return (
    <FeatureUnit>
      <H2>Flexible</H2>
      <GridParent>
        <GridChild>
          <h3>Any tool</h3>
          <p>You can use any:</p>
          <ul style={{ paddingLeft: 30, marginTop: -12 }}>
            <li>UI framework (React/Vue/Solid/...)</li>
            <li>Rendering strategy (SPA/SSR/SSG/...)</li>
            <li>Data fetching (RPC/REST/GraphQL/...)</li>
            <li>Server (Express.js/Hono/Fastify/...) </li>
            <li>Deployment (VPS/serverless/static/...)</li>
          </ul>
        </GridChild>
        <GridChild>
          <h3>Modular architecture</h3>
          <p>
            Vike focuses on being a high-quality frontend framework without interfering with the rest of your stack.
          </p>
          <p>
            With Vike, your application's architecture is composed of independent core constituents with a clear
            separation of concerns.
          </p>
        </GridChild>
        <GridChild>
          <h3>Ejectable extensions</h3>
          <p>
            Vike extensions integrate tools on your behalf. Later, if the need arises, eject extensions for full control
            over how tools integrate.
          </p>
        </GridChild>
        <GridChild>
          <h3>Less blockers</h3>
          <p>Blockers are treated with high priority, empowering you to build what you want and need.</p>
          <p>If you create a feature request and explain how it's blocking you then we bump its priority.</p>
        </GridChild>
      </GridParent>
    </FeatureUnit>
  )
}

function Reliable() {
  return (
    <FeatureUnit>
      <H2>Reliable</H2>
      <GridParent>
        <GridChild>
          <h3>Batteries included</h3>
          <p>
            Includes all features you'd expect from a modern framework: filesystem routing, pre-rendering, data
            fetching, layouts, i18n, prefetching & preloading, HTML streaming, URL redirects & rewrites, route guards,
            ...
          </p>
        </GridChild>
        <GridChild>
          <h3>Less bugs</h3>
          <p>We quickly fix bugs (usually under 24 hours).</p>
        </GridChild>
        <GridChild>
          <h3>Aligned interests</h3>
          <p>
            Since Vike's revenue comes from companies using it, the business interests of Vike and its users are
            aligned.
          </p>
        </GridChild>
        <GridChild>
          <h3>Responsive</h3>
          <p>We are responsive, and we provide a clear guideline on how to reach out and get reliable help from us.</p>
        </GridChild>
      </GridParent>
    </FeatureUnit>
  )
}

function Fast() {
  return (
    <FeatureUnit>
      <H2>Fast</H2>
      <GridParent>
        <GridChild>
          <h3>Prefetch & cache</h3>
          <p>
            Vike's existing and upcoming prefetch and cache utilities enable you to develop blazing fast user
            experiences.
          </p>
        </GridChild>
        <GridChild>
          <h3>Next-gen scaffolder</h3>
          <p>Use our next-generation scaffolder to jump start with a fully functional app.</p>
        </GridChild>
        <GridChild>
          <h3>Vite</h3>
          <p>Powered by Vite, for a lightning fast developer experience.</p>
        </GridChild>
      </GridParent>
    </FeatureUnit>
  )
}

function ClutterFree() {
  return (
    <FeatureUnit>
      <H2>Clutter-free</H2>
      <Center>
        <div className="no-subheading-padding" style={{ maxWidth: 800 }}>
          <p>
            Vike follows the do-one-thing-do-it-well philosophy: Vike is the common foundation while users cherry-pick
            Vike extensions to get powerful tailored features.
          </p>
          <p>
            Vike's architecture can accommodate any kind of websites, from simple marketing pages to enterprise
            applications with complex requirements.
          </p>
        </div>
      </Center>
    </FeatureUnit>
  )
}

function CommunityDriven() {
  return (
    <FeatureUnit>
      <H2>Community-driven</H2>
      <GridParent>
        <GridChild>
          <h3>Prioritization</h3>
          <p>We listen to users, engage in conversations, and prioritize accordingly.</p>
        </GridChild>
        <GridChild>
          <h3>Innovation</h3>
          <p>
            Vike's modular architecture enables community-driven innovation, fostering an ecosystem more innovative than
            any single organization can be.
          </p>
        </GridChild>
      </GridParent>
    </FeatureUnit>
  )
}

function H2({ children }: { children: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <h2
        style={{
          display: 'inline-block',
          marginTop: 0,
          position: 'relative',
          textDecorationColor: `var(--color-${children.toLowerCase()}`
        }}
        data-text={children}
      >
        {children}
      </h2>
    </div>
  )
}

function FeatureUnit({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="feature-unit"
      style={{
        backgroundColor: 'var(--bg-color)',
        paddingLeft: 'var(--main-view-padding)',
        paddingRight: 'var(--main-view-padding)',
        marginTop: 'var(--block-margin)'
      }}
    >
      <div
        style={{
          //*
          maxWidth: 1200,
          margin: 'auto'
          //*/
        }}
      >
        {children}
      </div>
    </div>
  )
}

type DivProps = React.HTMLAttributes<HTMLDivElement>
function GridParent(props: DivProps) {
  return (
    <Center>
      <div
        {...props}
        className="flex-parent"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, auto))',
          flexWrap: 'wrap',
          ...props.style
        }}
      />
    </Center>
  )
}
function GridChild(props: DivProps) {
  return (
    <div
      {...props}
      style={{
        /*
        justifySelf: 'center',
        alignSelf: 'center',
        */
        ...props.style
      }}
    />
  )
}
function Center(props: DivProps) {
  return <div {...props} style={{ display: 'flex', justifyContent: 'center', ...props.style }} />
}

function useHeadingUnderlineAnimation() {
  useEffect(() => {
    const headings = Array.from(document.getElementById('feature-list')!.querySelectorAll('h2'))
    const onScroll = () => {
      const isTop = document.documentElement.scrollTop === 0
      headings.map((h) => {
        const { top } = h.getBoundingClientRect()
        const isHighlighted = !isTop && top < window.innerHeight / 2
        const widthStr = getComputedStyle(h).width
        h.style.setProperty('--heading-width', widthStr)
        const width = parseInt(widthStr, 10)
        const width_reference = 205.516
        const duration_agnostic = 0.7
        const duration_adjusted = (0.7 * width) / width_reference
        const compromise = width_reference > width ? 0.7 : 0.3
        const duration_compromise = compromise * duration_adjusted + (1 - compromise) * duration_agnostic
        h.style.setProperty('--animation-duration', `${duration_compromise}s`)
        h.classList[isHighlighted ? 'add' : 'remove']('highlight')
        return h
      })
    }
    onScroll()
    const events = ['scroll', 'resize']
    events.forEach((eventName) => {
      window.addEventListener(eventName, onScroll, { passive: true })
    })
    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, onScroll)
      })
    }
  })
}
