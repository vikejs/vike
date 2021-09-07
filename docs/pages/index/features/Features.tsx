import React from 'react'
import './Features.css'
import iconChevron from '../../../icons/chevron.svg'
import { assert } from 'libframe-docs/utils'
import { Emoji } from 'libframe-docs/utils/Emoji'
import Control from './Control.mdx'
import FullFleged from './FullFledged.mdx'
import DeployAnywhere from './DeployAnywhere.mdx'
import { TweetsAboutScability } from './TweetsAboutScability'
// import { updateSidePanelScroll } from '../SidePanel'

export { FetureTODOs as Features }

function FetureTODOs() {
  return (
    <Features
      features={[
        {
          title: (
            <>
              <Emoji name="wrench" /> Control
            </>
          ),
          desc: (
            <>
              <p>
                Control how your pages are rendered and use <b>any view framework</b> (React, Vue, Svelte, ...) and{' '}
                <b>any tool</b> you want (Vuex/Redux/PullState, RPC or GraphQL, React/Vue Query, PWA, Service Workers,
                ...).
              </p>
              <p>
                Integrating tools is <b>simple</b> and <b>natural</b>.
              </p>
            </>
          ),
          learnMore: <Control />
        },
        {
          title: (
            <>
              <Emoji name="mechanical-arm" /> Full-fledged
            </>
          ),
          desc: (
            <>
              <p>
                <b>Filesystem Routing</b>, <b>Data fetching</b>, <b>Pre-rendering</b> (<b>SSG</b>), <b>HMR</b>,{' '}
                <b>i18n</b>.
              </p>
              <p>
                <b>Client Routing</b> (faster page transitions) or <b>Server Routing</b> (simpler app architecture).
              </p>
              <p>
                Pages can be rendered with <b>SSR</b>, as <b>SPA</b>, or to <b>HTML-only</b>.
              </p>
            </>
          ),
          learnMore: <FullFleged />
        },
        {
          title: (
            <>
              <Emoji name="dizzy" /> Simple
            </>
          ),
          desc: (
            <>
              <p>
                With <code>vite-plugin-ssr</code> you integrate tools manually instead of using a plugin system.
              </p>
              <p>While it means more work, it gives you a simple & sturdy foundation to build upon.</p>
            </>
          ),
          learnMore: (
            <>
              <h3>Less easy, but simpler</h3>
              <p>
                With <code>vite-plugin-ssr</code> you integrate tools yourself. This usually means more work and it's
                less easy than just adding a Next.js/Nuxt plugin; getting started is often slower.
              </p>
              <p>
                But plugin systems are complex, limiting, and quickly become counterproductive. You end up spending time
                fighting the plugin system and circumventing Next.js/Nuxt's limiting black-box nature and the net result
                is a considerable loss in dev time.
              </p>
              <p>
                In contrast, <code>vite-plugin-ssr</code> gets out of your way and integrating a tool is simply a matter
                of following the tool's official installation guide.
              </p>
              <p>
                In a nutshell: <code>vite-plugin-ssr</code> is less easy but simpler.
              </p>
              <h3>More fun</h3>
              <p>
                Last but not least, manual integration is more fun (and more insightful) than fighting some arbitrary
                and idiosyncratic framework.
              </p>
            </>
          )
        },
        {
          title: (
            <>
              <Emoji name="gem-stone" /> Rock-solid
            </>
          ),
          desc: (
            <>
              <p>
                The source code of <code>vite-plugin-ssr</code> has <b>no known bug</b>.
              </p>
              <p>
                Every release is assailed against a heavy suite of <b>automated tests</b>.
              </p>
              <p>
                <b>Used in production</b> by many comp&shy;anies.
              </p>
            </>
          )
        },
        {
          title: (
            <>
              <Emoji name="earth" /> Deploy anywhere
            </>
          ),
          desc: (
            <>
              <p>
                Works with <b>any server environement</b> (Cloudflare Workers, Vercel, EC2 instance, AWS lambda,
                Firebase, Express.js, Fastify, Hapi, ...).
              </p>
              <p>
                <b>Pre-render</b> your app and deploy it to <b>any static host</b> (Netlify, GitHub Pages, Cloudflare
                Pages, ...).
              </p>
            </>
          ),
          learnMore: <DeployAnywhere />,
          isSecondaryFeature: true
        },
        {
          title: (
            <>
              <Emoji name="high-voltage" /> High-performance
            </>
          ),
          desc: (
            <>
              <p>
                <b>Browser-side code splitting</b>: each page loads only the code it needs. Lighthouse score of 100%.
              </p>
              <p>
                <b>Fast Node.js cold start</b>: pages are lazy-loaded so that adding pages doesn't increase the cold
                start of your serverless functions.
              </p>
            </>
          ),
          isSecondaryFeature: true
        },
        {
          title: (
            <>
              <Emoji name="rocket" /> Scalable
            </>
          ),
          desc: (
            <>
              <p>
                <b>Dev speed that scales</b> to hundreds of kLOCs &mdash; HMR stays fast.
              </p>
              <p>
                <b>Architectural flexibility that scales</b> from small hobby projects to large-scale enterprise
                projects.
              </p>
            </>
          ),
          learnMore: (
            <>
              <h3>Lazy-transpiling</h3>
              <p>
                One of Vite's foundational novelty is lazy-transpiling: only executed code is transpiled. If you define
                ten pages but load only one page in the browser, then only the code for that page is transpiled.
              </p>
              <p>
                Thanks to lazy-transpiling, you can scale to (very) large source code while keeping fast dev speed /
                HMR.
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
                At (very) large scale, you can progressively replace <code>vite-plugin-ssr</code> with Vite's native SSR
                API which is low-level and highly flexible. If you're Netflix and perfecting UX leads to a substantial
                revenue increase, then <code>vite-plugin-ssr</code> and Vite's native SSR API are what you are looking
                for.
              </p>
              <TweetsAboutScability />
            </>
          ),
          isSecondaryFeature: true
        },
        {
          title: (
            <>
              <Emoji name="red-heart" /> Craftmanship
            </>
          ),
          desc: (
            <>
              <p>
                Crafted with <b>attention to details</b> and <b>care for simplicity</b>.
              </p>
              <p>
                <b>Upsteam contributions</b> to Vite and others.
              </p>
              <p>
                GitHub and Discord <b>conversations are welcome</b>.
              </p>
            </>
          ),
          isSecondaryFeature: true
        }
      ]}
    />
  )
}

type FeatureProps = {
  title: React.ReactNode
  desc: React.ReactNode
  learnMore?: React.ReactNode
  isSecondaryFeature?: true
}

function Features({ features }: { features: FeatureProps[] }) {
  const numberOfFeatures = features.length
  assert(numberOfFeatures % 2 === 0, { numberOfFeatures })
  const numberOfRows = numberOfFeatures / 2
  assert(Math.ceil(numberOfRows) === numberOfRows)
  return (
    <div id="features">
      {Array.from({ length: numberOfRows }, (_, i) => {
        const feature1Id = 2 * i + 0
        const feature2Id = 2 * i + 1
        return (
        <div className="features-row" key={i}>
          <Feature {...{ ...features[feature1Id], featureId: feature1Id }} />
          <Feature {...{ ...features[feature2Id], featureId: feature2Id }} />
        </div>
        )
      })}
    </div>
  )
}

function Feature({ title, desc, learnMore, isSecondaryFeature, featureId }: FeatureProps & { featureId: number }) {
  const name = `feature-${featureId}`
  const rightSide = featureId % 2 === 1
  return (
    <>
      <FeatureHead name={name} hasLearnMore={!!learnMore} isSecondaryFeature={isSecondaryFeature}>
        {' '}
        <h2>{title}</h2>
        {desc}
      </FeatureHead>
      {!!learnMore && (
        <LearnMore name={name} rightSide={rightSide}>
          {learnMore}
        </LearnMore>
      )}
    </>
  )
}

function FeatureHead({
  children,
  name,
  hasLearnMore,
  isSecondaryFeature,
  className = ''
}: {
  className?: string
  name?: string
  hasLearnMore?: boolean
  isSecondaryFeature?: true
  children: any
}) {
  return (
    <summary
      className={[
        className,
        'feature',
        'colorize-on-hover',
        hasLearnMore && 'has-learn-more',
        isSecondaryFeature && 'secondary-feature'
      ]
        .filter(Boolean)
        .join(' ')}
      id={name && `feature-${name}`}
      style={{ cursor: (hasLearnMore && 'pointer') || undefined }}
    >
      {children}
      {hasLearnMore && (
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
function LearnMore({ children, name, rightSide }: { name: string; children: any; rightSide: boolean }) {
  return (
    <aside className={'learn-more ' + (rightSide ? 'right-side' : '')} id={`learn-more-${name}`}>
      {children}
    </aside>
  )
}
