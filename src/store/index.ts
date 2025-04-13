import { createStore } from "vuex";
import favorites from "./modules/favorites";
import theme from "./modules/theme";
import recentlyViewed from './modules/recentlyViewed';
export default createStore({
  modules: {
    theme,
    favorites,
    recentlyViewed,
  },
});
