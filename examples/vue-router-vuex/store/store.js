import {createStore} from 'vuex'
// import VuexPersistence from 'vuex-persist'
// import {moduleLocal} from './storeLocal'
// import {moduleSession} from './storeSession'

export default createStore({
  state: {
      data: "data"
  },
  mutations: {
      setData(state, val) {
          state.data = val;
      }
  },
  getters: {
      getData(state) {
          return state.data;
      }
  },
  actions: {
      setData(state, val) {
          state.commit('setData', val);
      }
  }


  // todo: for client side only
  // modules: {
  //     obls: moduleLocal,
  //     obss: moduleSession
  // },
  // plugins: [
  //     new VuexPersistence({key: "obls", storage: window.localStorage, modules: ["obls"]}).plugin,
  //     new VuexPersistence({key: "obss", storage: window.sessionStorage, modules: ["obss"]}).plugin
  // ]
})
