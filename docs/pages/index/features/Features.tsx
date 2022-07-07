import React from 'react'
import { Emoji } from 'vikepress'
import { FeatureList } from 'vikepress'
import Control from './Control.mdx'
import FullFleged from './FullFledged.mdx'
import DeployAnywhere from './DeployAnywhere.mdx'
import { TweetsAboutScability } from './TweetsAboutScability'
import { ViteLogo } from './ViteLogo'
import { RollupLogo } from './RollupLogo'

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
                Use <b>any UI framework</b> (React, Vue, Svelte, Solid, ...) and <b>any tool</b> you want (any frontend
                library, web technology, deploy environment, Vite plugin, ...).
              </p>
              <p>
                With <code>vite-plugin-ssr</code>, you integrate tools manually and keep <b>architectural control</b>.
              </p>
            </>
          ),
          learnMore: <Control />,
        },
        {
          title: (
            <>
              <Emoji name="package" /> Zero-config
            </>
          ),
          desc: (
            <>
              <p>
                <code>vite-plugin-ssr</code> gives you <b>control only where it matters</b>.
              </p>
              <p>
                Everything else <b>just works</b> without the need to configure anything.
              </p>
            </>
          ),
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
                With <code>vite-plugin-ssr</code> you integrate tools manually; while it means more work, it gives you a{' '}
                <b>fundamentally simpler & more stable foundation</b> to build upon.
              </p>
              <p>
                The clean cut between <code>vite-plugin-ssr</code> and your UI framework (React/Vue/...) makes reasoning
                about your app easier.
              </p>
            </>
          ),
          learnMore: (
            <>
              <h3>Less easy, but simpler</h3>
              <p>
                With <code>vite-plugin-ssr</code> you integrate tools yourself. This usually means more work and it's
                less easy; getting started is often slower.
              </p>
              <p>
                But the black box nature of frameworks like Next.js/Nuxt is limiting and, at best, requires brittle
                workarounds. In the end, you waste time fighting the framework.
              </p>
              <p>
                In contrast, <code>vite-plugin-ssr</code> is transparent: it gets out of your way and integrating tools
                is simply a matter of following the tool's official installation guide.
              </p>
              <p>
                In a nutshell: <code>vite-plugin-ssr</code> is less easy, but simpler.
              </p>
              <h3>Stable foundation</h3>
              <p>
                Frameworks need to constantly keep up with the ecosystem, whereas do-one-thing-do-it-well tools can
                quickly stabilize.
              </p>
              <p>
                Actually, <code>vite-plugin-ssr</code> is already stable: the <code>v1</code> release will most likley
                have no breaking change with the current <code>v0.4.x</code> releases.
              </p>
              <p>
                The goal is then to stay on <code>v1</code> for the foreseeable future, while continuously improving
                performance and occasionally adding features.
              </p>
              <h3>Clean cut</h3>
              <p>
                There is no conflation between <code>vite-plugin-ssr</code> and your UI framework (React/Vue/...). This
                makes reasoning about your app a lot easier.
              </p>
              <h3>Fun</h3>
              <p>Last but not least, manual integration is fun & insightful whereas fighting a framework is pesky.</p>
            </>
          ),
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
                <b>Filesystem Routing</b>, <b>Data fetching</b>, <b>Pre-rendering</b>, <b>Layouts</b>, <b>HMR</b>,{' '}
                <b>i18n</b>, <b>Link Prefetching</b>, <b>HTML Streaming</b>.
              </p>
              <p>
                <b>Client Routing</b> (fast page navigation) or <b>Server Routing</b> (simple architecture).
              </p>
              <p>
                All render modes: <b>SSR</b>, <b>SPA</b>, <b>SSG</b>, <b>HTML-only</b>. Each page can use a different
                mode.
              </p>
            </>
          ),
          learnMore: <FullFleged />,
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
                <b>Deploy anywhere</b> (Vercel Serverless/Edge/ISR, Cloudflare Workers, AWS EC2/Lambda, Firebase, Google
                Cloud, ...).
              </p>
              <p>
                Pre-render your app and deploy it to <b>any static host</b> (Netlify, GitHub Pages, Cloudflare Pages,
                ...).
              </p>
              <p>
                Fits <b>Cloudflare Workers</b>'s small worker size requirement like a glove.
              </p>
            </>
          ),
          learnMore: <DeployAnywhere />,
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
                The source code of <code>vite-plugin-ssr</code> has <b>no known bug</b>, every release is assailed
                against a heavy suite of <b>automated tests</b>, it's <b>used in production</b> by many comp&shy;anies
                and is <b>stable</b>: the <code>v1</code> release will most likely have no breaking change with the
                current <code>v0.4.x</code> releases.
              </p>
            </>
          ),
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
                <b>DX that scales</b> to hundreds of kLOCs: HMR & dev start that stays fast, powered by Vite{' '}
                <ViteLogo />.
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
                One of Vite's foundational novelty is lazy-transpiled development: instead of transpiling your entire
                codebase before starting developing, Vite transpiles only loaded code.
              </p>
              <p>
                For example, if you define 100 pages and then open a page in the browser, then only the code for that
                one page is transpiled while the code for all other 99 pages is left untouched.
              </p>
              <p>
                Thanks to lazy-transpiling, you can scale to a (very) large codebase while keeping fast HMR &
                development start.
              </p>
              <h3>No black box</h3>
              <p>At scale, Next.js/Nuxt's black-box nature become painfully limiting.</p>
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
          isSecondaryFeature: true,
        },
        {
          title: (
            <>
              <Emoji name="high-voltage" /> Fast
            </>
          ),
          desc: (
            <>
              <p>
                State-of-the-art performance with <b>Code Splitting</b>, <b>Client Routing</b>, <b>Link Prefetching</b>,
                and <b>fast cold starts</b>.
              </p>
              <p>Lighthouse Score: 100%.</p>
            </>
          ),
          isSecondaryFeature: true,
          learnMore: (
            <>
              <h3>Code Splitting</h3>
              <p>
                The browser-side of each page loads only the code it needs, while sharing common chunks between pages
                for optimal cacheability. Powered by Rollup <RollupLogo />.
              </p>
              <h3>Client Routing</h3>
              <p>
                Upon page navigation, instead of loading and rendering the next page on both the server-side and
                browser-side, the next page is loaded & rendered only on the browser-side.
              </p>
              <h3>Link Prefetching</h3>
              <p>You can preload links for instantaneous page navigation.</p>
              <h3>Fast cold starts</h3>
              <p>
                On the server-side, pages are as well lazy-loaded: adding pages doesn't increase the cold start of your
                (serverless) deployment.
              </p>
            </>
          ),
        },
        {
          title: (
            <>
              <Emoji name="sparkling-heart" /> Fun
            </>
          ),
          desc: (
            <>
              <p>
                <code>vite-plugin-ssr</code> is simple, clear, and robust: no magic, no unexpected behavior, no
                conflation, no bugs (known in <code>vite-plugin-ssr</code>'s source code), no breaking changes (as far
                as we can see).
              </p>
              <p>
                With <code>vite-plugin-ssr</code>, <b>you are under control; it's addictively fun</b>.
              </p>
            </>
          ),
          isSecondaryFeature: true,
        },
        {
          title: (
            <>
              <Emoji name="engine" /> Framework Engine
            </>
          ),
          desc: (
            <>
              <p>
                Use <code>vite-plugin-ssr</code> to <b>build frameworks</b>.
              </p>
              <p>
                You want to build an <b>internal framework</b> for your company? Or you want to build a{' '}
                <b>Next.js alternative</b>? Use <code>vite-plugin-ssr</code> to jump-start with a rock-solid foundation.
              </p>
            </>
          ),
          isSecondaryFeature: true,
        },
        {
          title: (
            <>
              <Emoji name="red-heart" /> Craftsmanship
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
          isSecondaryFeature: true,
        },
        {
          title: (
            <>
              <Emoji name="lab" /> Cutting Edge
            </>
          ),
          desc: (
            <>
              <p>
                We regularly participate in RFCs and we are usually <b>among the first to support the latest</b>{' '}
                techniques.
              </p>
            </>
          ),
          isSecondaryFeature: true,
        },
      ]}
    />
  )
}
