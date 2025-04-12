import { createStore } from 'vuex';

export default createStore({
  state: {
    theme: localStorage.getItem('theme') || 'light', // Load theme from localStorage
  },
  getters: {
    currentTheme: (state) => state.theme,
  },
  mutations: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme); // Save to localStorage
    },
    setTheme(state, theme) {
      state.theme = theme;
      localStorage.setItem('theme', theme); // Save to localStorage
    },
  },
  actions: {
    toggleTheme({ commit }) {
      commit('toggleTheme');
    },
    loadTheme({ commit }) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        commit('setTheme', savedTheme);
      }
    },
  },
});
