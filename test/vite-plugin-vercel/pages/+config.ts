import vikeReact from 'vike-react/config'
import type { Config } from 'vike/types'
import Layout from '../layouts/LayoutDefault.js'

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/Layout
  Layout,

  // https://vike.dev/head-tags
  title: 'My Vike App',
  description: 'Demo showcasing Vike',

  // FIXME /isr 404, and edge
  ssr: true,

  // FIXME Navigating to a +isr route should always call the server?
  // FIXME Navigating between Edge and Node should also be done server side?
  clientRouting: false,

  extends: vikeReact,
} satisfies Config
