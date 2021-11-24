import { createStore } from 'redux'

export { getStore }

function getStore(PRELOADED_STATE) {
  const store = createStore(counterReducer, PRELOADED_STATE)
  return store
}

function counterReducer(state = { value: 0 }, action) {
  switch (action.type) {
    case 'counter/incremented':
      return { value: state.value + 1 }
    case 'counter/decremented':
      return { value: state.value - 1 }
    default:
      return state
  }
}
