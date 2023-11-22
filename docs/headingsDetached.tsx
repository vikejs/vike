export { headingsDetached }

import React from 'react'
import type { HeadingDetachedDefinition } from '@brillout/docpress'

const headingsDetached = [
  {
    title: <code>useClientRouter()</code>,
    url: '/useClientRouter'
  },
  {
    title: (
      <>
        Migration <code>0.4</code>
      </>
    ),
    url: '/migration-0.4'
  },
  {
    title: 'HTML Streaming',
    url: '/html-streaming'
  },
  {
    title: 'SPA vs SSR vs HTML',
    url: '/SPA-vs-SSR-vs-HTML'
  },
  {
    title: 'NextAuth.js',
    url: '/nextauth'
  },
  {
    title: 'NextAuth.js',
    url: '/NextAuth.js'
  },
  {
    title: 'HTML `<head>`',
    url: '/html-head'
  },
  {
    title: 'Server Routing VS Client Routing',
    url: '/SR-vs-CR'
  },
  {
    title: 'Render-as-you-Fetch',
    url: '/render-as-you-fetch'
  },
  {
    title: 'V1 Design',
    url: '/v1-design'
  },
  {
    title: (
      <>
        <code>+config.h.js</code> code splitting
      </>
    ),
    url: '/config-code-splitting'
  },
  {
    title: 'Error Tracking',
    url: '/error-tracking'
  },
  {
    title: 'Dynamic `import()`',
    url: '/dynamic-import'
  },
  {
    title: '`.env` Files',
    url: '/.env-files'
  },
  {
    title: (
      <>
        Migration <code>0.4.23</code>
      </>
    ),
    url: '/migration/0.4.23'
  },
  {
    title: (
      <>
        Migration <code>0.4</code>
      </>
    ),
    url: '/migration/0.4'
  },
  {
    title: (
      <>
        Migration from <code>0.4.x</code> to <code>1.0.0</code>
      </>
    ),
    url: '/migration/v1'
  },
  {
    title: 'V1 Design Migration',
    url: '/migration/v1-design',
    sectionTitles: ['Custom hooks/exports']
  },
  {
    title: 'Why the V1 design?',
    url: '/why-the-v1-design'
  },
  {
    title: 'Migrations',
    url: '/migration'
  },
  {
    title: 'Client Routing',
    url: '/client-routing'
  },
  {
    title: 'Server Routing',
    url: '/server-routing'
  },
  { title: 'What is Hydration?', url: '/hydration' },
  { title: <code>dist/server/importBuild.js</code>, url: '/importBuild.js' },
  { title: <code>importBuild.cjs</code>, url: '/importBuild.cjs' },
  { title: <code>injectAssets()</code>, url: '/injectAssets' },
  {
    title: (
      <>
        Multiple <code>onBeforeRender()</code> hooks
      </>
    ),
    url: '/onBeforeRender-multiple'
  },
  {
    title: (
      <>
        Manipulating <code>pageContext</code>
      </>
    ),
    url: '/pageContext-manipulation'
  },
  { title: 'Server-Side Rendering (SSR)', url: '/ssr' },
  { title: 'TypeScript', url: '/typescript' },
  {
    title: (
      <>
        Multiple <code>renderer/</code>
      </>
    ),
    url: '/multiple-renderer'
  },
  {
    title: '`createPageRenderer()`',
    url: '/createPageRenderer'
  },
  {
    title: 'Command `prerender`',
    url: '/command-prerender'
  },
  {
    title: 'Vite Plugin',
    url: '/vite-plugin'
  },
  {
    title: 'Content- VS interactive-centric',
    url: '/content-vs-interactive'
  },
  {
    title: 'SPA vs SSR (and more)',
    url: '/SPA-vs-SSR'
  },
  {
    title: 'Hydration Mismatch',
    url: '/hydration-mismatch'
  },
  {
    title: 'Broken npm package',
    url: '/broken-npm-package'
  },
  {
    title: 'Deployment synchronization',
    url: '/deploy-sync'
  },
  {
    title: 'Languages',
    url: '/languages'
  },
  {
    title: 'Common Problems',
    url: '/common-problems'
  },
  {
    title: (
      <>
        <code>prerender()</code> hook
      </>
    ),
    url: '/prerender'
  },
  {
    title: <code>doNotPrerender</code>,
    url: '/doNotPrerender'
  },
  {
    title: (
      <>
        <code>render()</code> hook (server-side)
      </>
    ),
    url: '/render-hook'
  },
  {
    title: (
      <>
        <code>render()</code> hook (client-side)
      </>
    ),
    url: '/render-client'
  },
  {
    title: <code>.page.js</code>,
    url: '/.page.js'
  },
  {
    title: <code>.page.server.js</code>,
    url: '/.page.server.js'
  },
  {
    title: <code>.page.client.js</code>,
    url: '/.page.client.js'
  },
  {
    title: (
      <>
        <code>Page</code> (server-side)
      </>
    ),
    url: '/Page-server'
  },
  {
    title: (
      <>
        <code>Page</code> (client-side)
      </>
    ),
    url: '/Page-client'
  },
  {
    title: <code>.page.route.js</code>,
    url: '/.page.route.js'
  },
  {
    title: <code>_default.page.route.js</code>,
    url: '/_default.page.route.js'
  },
  {
    title: 'Vue Router & React Router',
    url: '/vue-router-and-react-router'
  },
  {
    title: 'Vue Router',
    url: '/vue-router'
  },
  {
    title: 'React Router',
    url: '/react-router'
  },
  {
    title: <code>throw RenderErrorPage()</code>,
    url: '/RenderErrorPage'
  },
  {
    title: <code>process.env.NODE_ENV</code>,
    url: '/NODE_ENV'
  },
  {
    title: (
      <>
        Header file (<code>.h.js</code>), import from same file
      </>
    ),
    url: '/header-file/import-from-same-file'
  },
  {
    title: 'Client runtimes conflict',
    url: '/client-runtimes-conflict'
  },
  {
    title: '`includeAssetsImportedByServer`',
    url: '/includeAssetsImportedByServer'
  },
  {
    title: (
      <>
        Migration <code>0.4.134</code>
      </>
    ),
    url: '/migration/0.4.134'
  },
  {
    title: 'Page Redirection',
    url: '/page-redirection'
  },
  {
    title: (
      <>
        Migration <code>0.5</code>
      </>
    ),
    url: '/migration/0.5'
  },
  {
    title: "Vite's Lazy Transpiling",
    url: '/lazy-transpiling'
  },
  {
    title: 'CJS',
    url: '/CJS'
  },
  {
    title: 'URL Normalization',
    url: '/url-normalization'
  },
  {
    title: 'Vike',
    url: '/vike'
  },
  {
    title: 'Press Kit',
    url: '/press'
  },
  {
    title: 'Vike Packages',
    url: '/vike-packages'
  },
  {
    title: 'Abort',
    url: '/abort',
    sectionTitles: ['`throw redirect()` VS `throw render()`']
  },
  {
    title: '`.server.js` & `.client.js`',
    url: '/file-env'
  },
  {
    title: 'Custom Exports/Hooks',
    url: '/exports'
  },
  {
    title: '`onRenderHtml()` hook',
    url: '/onRenderHtml'
  },
  {
    title: '`onRenderClient()` hook',
    url: '/onRenderClient'
  },
  {
    title: '`onBeforeRoute()` hook',
    // titleInNav: '`onBeforeRoute`',
    url: '/onBeforeRoute'
  },
  {
    title: '`disableAutoFullBuild`',
    url: '/disableAutoFullBuild'
  },
  {
    title: '`hydrationCanBeAborted`',
    url: '/hydrationCanBeAborted'
  },
] satisfies HeadingDetachedDefinition[]
