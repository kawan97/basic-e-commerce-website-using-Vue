import { createStore } from "vuex";
import favorites from "./modules/favorites";
import theme from "./modules/theme";
export default createStore({

  modules: {
    theme,
    favorites,
  },
});
