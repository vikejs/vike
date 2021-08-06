import React from 'react'
import './Features.css'
import iconChevron from '../../../frame/icons/chevron.svg'
import { assert } from '../../../utils'
import { Emoji } from '../../../utils/Emoji'
import Control from './Control.mdx'
import FullFleged from './FullFledged.mdx'
import DeployAnywhere from './DeployAnywhere.mdx'
import { TweetsAboutScability } from './TweetsAboutScability'
// import { updateSidePanelScroll } from '../SidePanel'

export { Features }

function Features() {
  return (
    <div id="features">
      <div className="features-secondary-row">
        <Feature name="control" isExpandable={true}>
          <h2>
            <Emoji name="wrench" /> Control
          </h2>
          <p>
            Control how your pages are rendered and use <b>any view framework</b> (React, Vue, Svelte, ...) and{' '}
            <b>any tool</b> you want (Vuex/Redux, PullState, RPC, GraphQL, Service Workers, ...).
          </p>
          <p>
            Integrating tools is <b>simple</b> and <b>natural</b>.
          </p>
        </Feature>
        <LearnMore name="control">
          <Control />
        </LearnMore>
        <Feature name="full-fledged" isExpandable={true}>
          <h2>
            <Emoji name="mechanical-arm" /> Full-fledged
          </h2>
          <p>
            <b>Filesystem Routing</b>, <b>Data fetching</b>, <b>Pre-rendering</b> (<b>SSG</b>), <b>HMR</b>.
          </p>
          <p>
            <b>Client-side Routing</b> (faster page transitions) or <b>Server-side Routing</b> (simpler architecture).
          </p>
          <p>
            Pages can be rendered with <b>SSR</b>, as <b>SPA</b>, or to <b>HTML-only</b>.
          </p>
        </Feature>
        <LearnMore name="full-fledged" rightSide={true}>
          <FullFleged />
        </LearnMore>
      </div>
      <div className="features-secondary-row">
        <Feature name="simpler" isExpandable={true}>
          <h2>
            <Emoji name="dizzy" /> Simple
          </h2>
          <p>
            With <code>vite-plugin-ssr</code> you integrate tools manually instead of using a plugin system.
          </p>
          <p>While it means more work, it gives you a simple & sturdy foundation to build upon.</p>
        </Feature>
        <LearnMore name="simpler">
          <h3>Less easy, but simpler</h3>
          <p>
            With <code>vite-plugin-ssr</code> you integrate tools yourself. This usually means more work and it's less
            easy than just adding a Next.js/Nuxt plugin; getting started is often slower.
          </p>
          <p>
            But plugin systems are complex, limiting, and quickly become counterproductive. You end up spending time
            fighting the plugin system and circumventing Next.js/Nuxt's limiting black-box nature and the net result is
            a considerable loss in dev time.
          </p>
          <p>
            In contrast, <code>vite-plugin-ssr</code> gets out of your way and integrating a tool is simply a matter of
            following the tool's official installation guide.
          </p>
          <p>
            In a nutshell: <code>vite-plugin-ssr</code> is less easy but simpler.
          </p>
          <h3>More fun</h3>
          <p>
            Last but not least, integration is more fun (and more insightful!) than fighting some arbitrary and
            idiosyncratic framework.
          </p>
        </LearnMore>
        <Feature>
          <h2>
            <Emoji name="gem-stone" /> Rock-solid
          </h2>
          <p>
            The source code of <code>vite-plugin-ssr</code> has <b>no known bug</b>.
          </p>
          <p>
            Every release is assailed against a heavy suite of <b>automated tests</b>.
          </p>
          <p>
            <b>Used in production</b> by many comp&shy;anies.
          </p>
          <p></p>
        </Feature>
      </div>
      <div className="features-secondary-row">
        <Feature name="deploy-anywhere" isExpandable={true} className="secondary-feature">
          <h2>
            <Emoji name="earth" /> Deploy anywhere
          </h2>
          <p>
            Works with <b>any server environement</b> (Cloudflare Workers, Vercel, EC2 instance, AWS lambda, Firebase,
            Express.js, Fastify, Hapi, ...).
          </p>
          <p>
            <b>Pre-render</b> your app and deploy it to <b>any static host</b> (Netlify, GitHub Pages, Cloudflare Pages,
            ...).
          </p>
        </Feature>
        <LearnMore name="deploy-anywhere">
          <DeployAnywhere />
        </LearnMore>
        <Feature className="secondary-feature">
          <h2>
            <Emoji name="high-voltage" /> Fast
          </h2>
          <p>
            <b>Browser-side code splitting</b>: each page loads only the code it needs. Lighthouse score of 100%.
          </p>
          <p>
            <b>Fast Node.js cold start</b>: pages are lazy-loaded so that adding pages doesn't increase the cold start
            of serverless functions.
          </p>
        </Feature>
      </div>
      <div className="features-secondary-row">
        <Feature name="scalable" isExpandable={true} className="secondary-feature">
          <h2>
            <Emoji name="rocket" /> Scalable
          </h2>
          <p>
            Scales to hundreds of kLOCs while <b>HMR stays fast</b>.
          </p>
          <p>
            <b>Design that scales</b> from small hobby projects to large-scale enterprise projects.
          </p>
        </Feature>
        <LearnMore name="scalable">
          <h3>Lazy-transpiling</h3>
          <p>
            One of Vite's foundational novelty is lazy-transpiling: only executed code is transpiled. If you define ten
            pages but load only page in the browser, then only the code for that page is transpiled.
          </p>
          <p>
            Thanks to lazy-transpiling, you can scale to (very) large source code while keeping fast dev speed / HMR.
          </p>
          <h3>No black box, no plugin system</h3>
          <p>At scale, Next.js/Nuxt's black-box nature and its plugin system become painfully limiting.</p>
          <p>
            In contrast, <code>vite-plugin-ssr</code> is transparent: you keep control over both the server- and
            browser-side.
          </p>
          <p>
            As you scale, you usually need increasingly custom SSR integrations; <code>vite-plugin-ssr</code>'s
            flexibility accommodates such needs.
          </p>
          <h3>
            Vite + SSR + Scale = <Emoji name="red-heart" />
          </h3>
          <p>
            At (very) large scale, you can progressively replace <code>vite-plugin-ssr</code> with Vite's native SSR API
            which is low-level and powerful (i.e. flexible and rock-solid). If you're Netflix and perfecting UX leads to
            a substantial revenue increase, then <code>vite-plugin-ssr</code> and Vite's native SSR API are what you are
            looking for.
          </p>
          <TweetsAboutScability />
        </LearnMore>
        <Feature className="secondary-feature">
          <h2>
            <Emoji name="red-heart" /> Craftmanship
          </h2>
          <p>
            Crafted with <b>attention to details</b> and <b>care for simplicity</b>.
          </p>
          <p>
            <b>Upsteam contributions</b> to Vite and others.
          </p>
          <p>
            GitHub and Discord <b>conversations are welcome</b>.
          </p>
        </Feature>
      </div>
    </div>
  )
}

function Feature({
  children,
  name,
  isExpandable,
  className = ''
}: {
  className?: string
  name?: string
  isExpandable?: true
  children: any
}) {
  assert(!!name === !!isExpandable)
  return (
    <summary
      className={className + ' feature colorize-on-hover' + (name ? ' has-learn-more' : '')}
      id={name && `feature-${name}`}
      style={{ cursor: isExpandable && 'pointer' }}
    >
      {children}
      {isExpandable && (
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <button
            type="button"
            style={{
              textAlign: 'center',
              padding: '0 7px',
              paddingTop: 3,
              paddingBottom: 1,
              display: 'inline-block',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 600
            }}
          >
            <span className="decolorize-5">Learn more</span>
            <br />
            <img className="decolorize-4 chevron" src={iconChevron} height="7" style={{ marginTop: 2 }} />
          </button>
        </div>
      )}
    </summary>
  )
}
function LearnMore({ children, name, rightSide }: { name: string; children: any; rightSide?: true }) {
  return (
    <aside className={'learn-more ' + (rightSide ? 'right-side' : '')} id={`learn-more-${name}`}>
      {children}
    </aside>
  )
}
