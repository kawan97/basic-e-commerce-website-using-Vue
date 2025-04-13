// store/modules/theme.js
export default {
    state: {
      theme: localStorage.getItem('theme') || 'dark'
    },
    
    getters: {
      currentTheme: (state: any) => state.theme
    },
    
    mutations: {
      SET_THEME(state: any, theme: any) {
        state.theme = theme;
        localStorage.setItem('theme', theme);
      }
    },
    
    actions: {
      toggleTheme({ commit, state }: any) {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        commit('SET_THEME', newTheme);
      },
      
      setTheme({ commit }: any, theme: any) {
        commit('SET_THEME', theme);
      }
    }
  };