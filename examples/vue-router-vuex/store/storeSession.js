export const moduleSession = {
    state: {
        ss: "session"
    },
    mutations: {
        setSS(state, val) {
            state.ss = val;
        }
    },
    getters: {
        getSS(state) {
            return state.ss;
        }
    },
    actions: {
        setSS(state, val) {
            state.commit('setSS', val);
        }
    }
};