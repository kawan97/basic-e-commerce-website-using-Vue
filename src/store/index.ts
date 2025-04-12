import { createStore } from 'vuex'

export default createStore({
  state: {
    theme: 'light',

  },
  getters: {
      currentTheme: (state) => state.theme,
  },
  mutations: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme(state, theme) {
      state.theme = theme;
    },
  },
  actions: {
    toggleTheme({ commit }) {
      commit('toggleTheme');
    },
  },
  modules: {
  }
})
