import { testRunClassic } from '../../test/utils'
testRunClassic('npm run dev', { isVue: true, testHmr: './pages/index/index.page.vue' })
