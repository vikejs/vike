export { Features }

import React, { useEffect, useRef } from 'react'
import './Features.css'

function Features() {
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
      <H2 color="blue">Flexible</H2>
      <GridParent style={{ maxWidth: 1200 }}>
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
            <h3>Less blockers</h3>
            <p>Blockers are treated with high priority, empowering you to build what you want and need.</p>
            <p>If you create a feature request and explain how it's blocking you then we bump its priority.</p>
        </GridChild>
        <GridChild>
            <h3>Ejectable extensions</h3>
            <p>
              Vike extensions integrate tools on your behalf. Later, if the need arises, eject extensions for full
              control over how tools integrate.
            </p>
        </GridChild>
      </GridParent>
    </FeatureUnit>
  )
}

function Reliable() {
  return (
    <FeatureUnit>
      <H2 color="#f900ff">Reliable</H2>
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
            Vike's revenue comes from companies that use Vike, which means that the business interests of Vike and its
            users are aligned.
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
      <H2 color="#ffed2e">Fast</H2>
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
      <H2 color="#c3c3c3">Clutter-free</H2>
      <Center>
        <div className="feature-unit_no-heading" style={{ maxWidth: 800 }}>
          <p>
            Vike follows the do-one-thing-do-it-well philosophy: Vike is a flexible and robust foundation, while users
            cherry-pick Vike extensions to get powerful tailored features.
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
      <H2 color="#1bd91b">Community-driven</H2>
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

function H2({ children, color }: { children: string; color: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  /*
  useEffect(() => {
    const listener =
      () => {
        console.log(children)
        const elH2 = ref.current!
        var viewportOffset = elH2.getBoundingClientRect();
        console.log(window.innerHeight);
        var top = viewportOffset.top;
        console.log(top)
        isHighlight(elH2)
      }
    document.addEventListener('scroll', listener, {passive: true})
    document.removeEventListener('scroll', listener)
  })
  */
  const textDecoration: React.CSSProperties = {
    textDecoration: 'underline',
    textUnderlineOffset: '0.1em',
    textDecorationThickness: '0.1em',
    textDecorationColor: color
    //color: 'transparent'
  }
  return (
    <h2 ref={ref} style={{ position: 'relative', ...textDecoration }}>
      {/* 
    <span style={{position: 'absolute', ...textDecoration}}>{children}</span>
    */}
      {children}
    </h2>
  )
}
function isHighlight(elH2: HTMLElement) {
  if (!(document.documentElement.scrollTop > 0)) return false
}

function FeatureUnit({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="feature-unit"
      style={{
        backgroundColor: 'var(--bg-color)',
        paddingLeft: 'var(--main-view-padding)',
        paddingRight: 'var(--main-view-padding)'
      }}
    >
      <div style={{ maxWidth: 1200, margin: 'auto' }}>{children}</div>
    </div>
  )
}

type DivProps = React.HTMLAttributes<HTMLDivElement>
function FlexParent(props: DivProps) {
  return (
    <Center>
      <div
        {...props}
        className='flex-parent'
        style={{
          display: 'flex',
          ...props.style
        }}
      />
    </Center>
  )
}
function FlexChild(props: DivProps) {
  return (
    <div
      {...props}
      style={{
        /*
        justifySelf: 'center',
        alignSelf: 'center',
        */
        minWidth: 350,
        ...props.style
      }}
    />
  )
}
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
