import React from 'react'
import { Emoji } from 'libframe-docs/utils/Emoji'
import { FeatureList } from 'libframe-docs/landing-page/features/FeatureList'
import Control from './Control.mdx'
import FullFleged from './FullFledged.mdx'
import DeployAnywhere from './DeployAnywhere.mdx'
import { TweetsAboutScability } from './TweetsAboutScability'

export { Features }

function Features() {
  return (
    <FeatureList
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
                other Vite plugins, ...).
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
                Works with <b>any server environement</b> (Vercel, EC2 instance, AWS lambda, Firebase, Cloudflare
                Workers, Express.js, Fastify, Hapi, ...).
              </p>
              <p>
                <b>Pre-render</b> your app and deploy it to <b>any static host</b> (Netlify, GitHub Pages, Cloudflare
                Pages, ...).
              </p>
              <p>
                <b>Fits well Cloudflare Workers</b>'s lean-serverless-functions model, and <code>vite-plugin-ssr</code>{' '}
                has first-class support for it.
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
                <b>DX that scales</b> to hundreds of kLOCs &mdash; HMR & dev start stays fast.
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
                Thanks to lazy-transpiling, you can scale to (very) large source code while keeping fast HMR & dev
                start.
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
