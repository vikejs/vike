export { Features }

import React, { useEffect, useRef } from 'react'
import './Features.css'
import { HorizontalLine } from '@brillout/docpress'

function Features() {
  return (
    <div id="feature-list">
      <Flexible />
      <HorizontalLine />
      <Reliable />
      <HorizontalLine />
      <Fast />
      <HorizontalLine />
      <ClutterFree />
      <HorizontalLine />
      <CommunityDriven />
    </div>
  )
}

function Flexible() {
  return (
    <>
      <H2 color="blue">Flexible</H2>
      <FlexParent>
        <FlexChild>
          <h3>Any tool</h3>
          <p>Use any:</p>
          <ul>
            <li>UI framework (React/Vue/Solid/...)</li>
            <li>Rendering strategy (SPA, SSR, SSG, ...)</li>
            <li>Data fetching (RPC, REST, GraphQL, ...)</li>
            <li>Server (Express.js/Hono/Fastify/...) </li>
            <li>Deployment (VPS, Serverless, Static, ...)</li>
          </ul>
        </FlexChild>
        <FlexChild>
          <h3>Ejectable extensions</h3>
          <p>
            Vike extensions integrate tools on your behalf. Later, if the need arsies, eject extensions for full control
            over tool integration.
          </p>
        </FlexChild>
        <FlexChild>
          <h3>Less blockers</h3>
          <p>Blockers are treated with high priority, freeing you from building what you want and need.</p>
        </FlexChild>
      </FlexParent>
    </>
  )
}

function Reliable() {
  return (
    <>
      <H2 color="#f900ff">Reliable</H2>
      <FlexParent>
        <FlexChild style={{ maxWidth: 390 }}>
          <h3>Less bugs</h3>
          <p>We quickly fix bugs (usually under 24 hours).</p>
        </FlexChild>
        <FlexChild style={{ maxWidth: 390 }}>
          <h3>Responsive</h3>
          <p>We're responsive, and we provide a clear guideline on how to reach out and get reliable help from us.</p>
        </FlexChild>
        <FlexChild style={{ maxWidth: 390 }}>
          <h3>Community-driven</h3>
          <p>
            The ultimate decision maker is you, our users. Vike's revenue directly coming from users means that the
            business interesets of Vike and our users align.
          </p>
        </FlexChild>
      </FlexParent>
    </>
  )
}

function Fast() {
  return (
    <>
      <H2 color="#ffed2e">Fast</H2>
      <FlexParent>
        <FlexChild style={{ maxWidth: 390 }}>
          <h3>Prefetch & cache</h3>
          <p>
            Vike's existing and upcoming prefetch and opt-in cache utilities enable you to develop blazing fast user
            experiences.
          </p>
        </FlexChild>
        <FlexChild style={{ maxWidth: 390 }}>
          <h3>Next-gen scaffolder</h3>
          <p>Use our next-generation scafollder to jump start with a fully-functional and up-to-date app.</p>
        </FlexChild>
        <FlexChild style={{ maxWidth: 390 }}>
          <h3>Vite</h3>
          <p>Vike is powered by Vite, for a lightning fast developer experience.</p>
        </FlexChild>
      </FlexParent>
    </>
  )
}

function ClutterFree() {
  return (
    <>
      <H2 color="#c3c3c3">Clutter-free</H2>
      <Center>
        <div style={{ maxWidth: 800, marginTop: -30 }}>
          <p>Vike follows the do-one-thing-do-it-well philosophy.</p>
          <p>
            Vike's core is a highly flexible and robust foundation while you can cherry-pick Vike extensions to get
            powerful features.
          </p>
          <p>
            Vike's architecture can accommodate any kind of websites, from simple marketing pages to enterprise
            applications with complex requirements.
          </p>
        </div>
      </Center>
    </>
  )
}

function CommunityDriven() {
  return (
    <>
      <H2 color="#1bd91b">Community-driven</H2>
      <FlexParent>
        <FlexChild style={{ maxWidth: 390 }}>
          <h3>Our users, our priority</h3>
          <p>We carefully listen to our users and prioritize accordingly.</p>
        </FlexChild>
        <FlexChild style={{ maxWidth: 390 }}>
          <h3>Community-driven innovation</h3>
          <p>
            Vike's modular architecture fosters community-driven innovation. We believe community's driving force will
            always outperform a single given organization.
          </p>
        </FlexChild>
      </FlexParent>
    </>
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

type DivProps = React.HTMLAttributes<HTMLDivElement>
function FlexParent(props: DivProps) {
  return (
    <div
      {...props}
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 20, rowGap: 20, ...props.style }}
    />
  )
}
function FlexChild(props: DivProps) {
  return <div {...props} style={{ flexGrow: 1, minWidth: 300, maxWidth: 500, ...props.style }} />
}
function Center(props: DivProps) {
  return <div {...props} style={{ display: 'flex', justifyContent: 'center', ...props.style }} />
}
