import type { Config } from 'vike/types'
import Layout from '../layouts/LayoutDefault.vue'
import vikeVue from 'vike-vue/config'
import vikeVuePinia from 'vike-vue-pinia/config'

export default {
  Layout,
  extends: [vikeVue, vikeVuePinia],
} satisfies Config
