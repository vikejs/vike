import Vuex from 'vuex'

export { createStore }

function createStore() {
  const store = Vuex.createStore({
    state() {
      return {
        todoList: [],
      }
    },

    actions: {
      fetchTodoList({ commit }) {
        const todoList = [
          {
            id: 0,
            text: 'Buy milk',
          },
          {
            id: 1,
            text: 'Buy chocolate',
          },
        ]
        return commit('setTodoList', todoList)
      },
    },

    mutations: {
      setTodoList(state, todoList) {
        state.todoList = todoList
      },
    },
  })

  return store
}
