import { run } from '../../libframe/test/setup'
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from './renderer/stores/counter'

export { testRun }

function testRun(cmd: 'npm run dev' | 'npm run prod') {
  run(cmd)

  describe('Counter store', () => {
    beforeEach(() => {
      setActivePinia(createPinia())
    })

    it('increments counter value', () => {
      const counterStore = useCounterStore()
      expect(counterStore.count).toBe(0)
      counterStore.increment()
      expect(counterStore.count).toBe(1)
    })

    it('decrements counter value', () => {
      const counterStore = useCounterStore()
      expect(counterStore.count).toBe(0)
      counterStore.decrement()
      expect(counterStore.count).toBe(-1)
    })
  })
}
