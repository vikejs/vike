<p></p>

<a href="/../../#readme">
  <img src="/docs/logo.svg" align="left" height="154"  width="154" alt="vite-plugin-ssr"/>
</a>

# `vite-plugin-ssr`

Vite SSR plugin. Simple, full-fledged, do-one-thing-do-it-well.

<a href="https://discord.gg/qTq92FQzKb">
  <img src="/docs/discord.svg" height="32" width="117.078" alt="Discord vite-plugin-ssr"/>
</a>
&nbsp;&nbsp;&nbsp;
<a href="https://twitter.com/brillout/status/1371806177424777216">
  <img src="/docs/twitter_retweet.svg" height="32" width="179" alt="Retweet vite-plugin-ssr"/>
</a>
&nbsp;&nbsp;&nbsp;
<a href="https://twitter.com/brillout">
  <img src="/docs/twitter_follow.svg" height="32" width="133" alt="Follow @brillout"/>
</a>
&nbsp;&nbsp;&nbsp;
<a href="/CHANGELOG.md">
  <img src="/docs/changelog.svg" height="32" width="116" alt="Changelog"/>
</a>

<br/>

<br/> **Overview**
<br/> &nbsp;&nbsp; [Introduction](#introduction)
<br/> &nbsp;&nbsp; [Vue Tour](#vue-tour)
<br/> &nbsp;&nbsp; [React Tour](#react-tour)
<br/>
<br/> **Get Started**
<br/> &nbsp;&nbsp; [Boilerplates](#boilerplates)
<br/> &nbsp;&nbsp; [Manual Installation](#manual-installation)
<br/>
<br/> **Guides**
<br/><sub>&nbsp;&nbsp;&nbsp; Basics</sub>
<br/> &nbsp;&nbsp; [Data Fetching](#data-fetching)
<br/> &nbsp;&nbsp; [Routing](#routing)
<br/> &nbsp;&nbsp; [Pre-rendering](#pre-rendering) (SSG)
<br/><sub>&nbsp;&nbsp;&nbsp; More</sub>
<br/> &nbsp;&nbsp; [SPA vs SSR vs HTML](#spa-vs-ssr-vs-html)
<br/> &nbsp;&nbsp; [HTML `<head>`](#html-head)
<br/> &nbsp;&nbsp; [Page Redirection](#page-redirection)
<br/> &nbsp;&nbsp; [Base URL](#base-url)
<br/> &nbsp;&nbsp; [Import Paths Alias Mapping](#import-paths-alias-mapping)
<br/> &nbsp;&nbsp; [`.env` Files](#env-files)
<br/><sub>&nbsp;&nbsp;&nbsp; Integrations</sub>
<br/> &nbsp;&nbsp; [Authentication](#authentication) (Auth0, Passport.js, Grant, ...)
<br/> &nbsp;&nbsp; [Markdown](#markdown)
<br/> &nbsp;&nbsp; [Store](#store) (Vuex, Redux, ...)
<br/> &nbsp;&nbsp; [GraphQL & RPC](#graphql--rpc) (Apollo, Relay, Wildcard API, ...)
<br/> &nbsp;&nbsp; [Tailwind CSS](#tailwind-css)
<br/> &nbsp;&nbsp; [Other Tools](#other-tools) (CSS Frameworks, Google Analytics, jQuery, Service Workers, Sentry, ...)
<br/><sub>&nbsp;&nbsp;&nbsp; Deploy</sub>
<br/> &nbsp;&nbsp; [Static Hosts](#static-hosts) (Netlify, GitHub Pages, Cloudflare Pages, ...)
<br/> &nbsp;&nbsp; [Cloudflare Workers](#cloudflare-workers)
<br/> &nbsp;&nbsp; [AWS Lambda](#aws-lambda)
<br/> &nbsp;&nbsp; [Firebase](#firebase)
<br/>
<br/> **API**
<br/><sub>&nbsp;&nbsp;&nbsp; Node.js & Browser</sub>
<br/> &nbsp;&nbsp; [`*.page.js`](#pagejs)
<br/> &nbsp;&nbsp; [`pageContext`](#pagecontext)
<br/><sub>&nbsp;&nbsp;&nbsp; Node.js</sub>
<br/> &nbsp;&nbsp; [`*.page.server.js`](#pageserverjs)
<br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`export { addPageContext }`](#export--addpagecontext-)
<br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`export { passToClient }`](#export--passtoclient-)
<br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`export { render }`](#export--render-)
<br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`export { prerender }`](#export--prerender-)
<br/> &nbsp;&nbsp; [`import { html } from 'vite-plugin-ssr'`](#import--html--from-vite-plugin-ssr)
<br/><sub>&nbsp;&nbsp;&nbsp; Browser</sub>
<br/> &nbsp;&nbsp; [`*.page.client.js`](#pageclientjs)
<br/> &nbsp;&nbsp; [`import { getPage } from 'vite-plugin-ssr/client'`](#import--getpage--from-vite-plugin-ssrclient)
<br/> &nbsp;&nbsp; [`import { useClientRouter } from 'vite-plugin-ssr/client/router'`](#import--useClientRouter--from-vite-plugin-ssrclientrouter)
<br/> &nbsp;&nbsp; [`import { navigate } from 'vite-plugin-ssr/client/router'`](#import--navigate--from-vite-plugin-ssrclientrouter)
<br/><sub>&nbsp;&nbsp;&nbsp; Routing</sub>
<br/> &nbsp;&nbsp; [`*.page.route.js`](#pageroutejs)
<br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Route String](#route-string)
<br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Route Function](#route-function)
<br/> &nbsp;&nbsp; [Filesystem Routing](#filesystem-routing)
<br/><sub>&nbsp;&nbsp;&nbsp; Special Pages</sub>
<br/> &nbsp;&nbsp; [`_default.page.*`](#_defaultpage)
<br/> &nbsp;&nbsp; [`_error.page.*`](#_errorpage)
<br/><sub>&nbsp;&nbsp;&nbsp; Integration</sub>
<br/> &nbsp;&nbsp; [`import { createPageRender } from 'vite-plugin-ssr'`](#import--createpagerender--from-vite-plugin-ssr) (Server Integration Point)
<br/> &nbsp;&nbsp; [`import ssr from 'vite-plugin-ssr/plugin'`](#import-ssr-from-vite-plugin-ssrplugin) (Vite Plugin)
<br/><sub>&nbsp;&nbsp;&nbsp; CLI</sub>
<br/> &nbsp;&nbsp; [Command `prerender`](#command-prerender)

<br/>


## Overview

### Introduction

`vite-plugin-ssr` provides a similar experience than Nuxt/Next.js, but with Vite's wonderful DX, and as a do-one-thing-do-it-well tool.

- **Do-One-Thing-Do-It-Well**. Only takes care of SSR and works with: other Vite plugins, any view framework (Vue, React, ...), and any server environment (Express, Fastify, Cloudflare Workers, Firebase, ...).
- **Render Control**. You control how your pages are rendered enabling you to easily and naturally integrate any tool you want (Vuex, Redux, Apollo GraphQL, Service Workers, ...).
- **SPA & SSR & HTML**. Render some pages as SPA, some with SSR, and some to HTML-only (zero/minimal browser-side JavaScript).
- **Pre-render / SSG / Static Websites**. Deploy your app to a static host (Netlify, GitHub Pages, Cloudflare Pages, ...) by pre-rendering your pages.
- **Routing**. You can choose between Server-side Routing (for a simple architecture) and Client-side Routing (for faster/animated page transitions). You can also use Vue Router and React Router.
- **HMR**. Browser as well as server code is automatically refreshed/reloaded.
- **Fast Cold Start**. [Node.js] Your pages are lazy-loaded; adding pages doesn't increase the cold start of your serverless functions.
- **Code Splitting**. [Browser] Each page loads only the code it needs. Lighthouse score of 100%.
- **Simple Design**. Simple overall design resulting in a tool that is small, robust, and easy to use.
- **Scalable**. Your source code can scale to thousands of files with no hit on dev speed (thanks to Vite's lazy transpiling), and `vite-plugin-ssr` provides you with an SSR architecture that scales from small hobby projects with simple needs to large-scale enterprise projects with highly custom SSR needs.
- **No Known Bug**. The source code of `vite-plugin-ssr` has no known bug; if you encounter a bug then it will be quickly fixed.
- **Responsive**. Made with :heart:. GitHub issues are welcome and answered. Conversations are welcome at [Discord - `vite-plugin-ssr`](https://discord.gg/qTq92FQzKb).

Get an idea of what it's like to use `vite-plugin-ssr` with the [Vue Tour](#vue-tour) or [React Tour](#react-tour).

Scaffold a new app with `npm init vite-plugin-ssr@latest` (or `yarn create vite-plugin-ssr`), or [manually add](#manual-installation) `vite-plugin-ssr` to your existing Vite app. (Although we recommend to first read the Vue/React tour before getting started.)

<br/><br/>
