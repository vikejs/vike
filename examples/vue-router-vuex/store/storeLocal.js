export const moduleLocal = {
    state: {
        ls: "local"
    },
    mutations: {
        setLS(state, val) {
            state.ls = val;
        }
    },
    getters: {
        getLS(state) {
            return state.ss;
        }
    },
    actions: {
        setLS(state, val) {
            state.commit('setLS', val);
        }
    }
};