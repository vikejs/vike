export { createStore }
export type AppStore = ReturnType<typeof createStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

import type { PageContext } from 'vike/types'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { countReducer } from './slices/count'
import { todosReducer } from './slices/todos'
const reducer = combineReducers({ count: countReducer, todos: todosReducer })

function createStore(pageContext: PageContext) {
  const preloadedState = pageContext.isClientSide ? pageContext.redux?.ssrState : undefined
  return configureStore({ reducer, preloadedState })
}
