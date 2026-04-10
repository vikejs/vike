import { testRunClassic } from '../../test/utils'
testRunClassic('pnpm run dev', { isVue: true, testHmr: './pages/index/index.page.vue' })
