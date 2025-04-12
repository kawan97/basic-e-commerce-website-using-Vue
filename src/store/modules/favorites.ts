// store/modules/favorites.js
const getFavoritesFromStorage = () => {
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
};

const saveFavoritesToStorage = (favorites : any) => {
  localStorage.setItem('favorites', JSON.stringify(favorites));
};

export default {
  state: {
    favorites: getFavoritesFromStorage()
  },
  
  getters: {
    allFavorites: (state: any) => state.favorites,
    isFavorite: (state: any) => (productId: any) => {
      return state.favorites.some((item: any) => item.id === productId);
    }
  },
  
  mutations: {
    ADD_TO_FAVORITES(state: any, product: any) {
      const { id, title, price, description, images } = product;
      const favoriteItem = {
        id,
        title,
        price,
        description,
        image: images[0]  // Store just the first image
      };
      
      state.favorites.push(favoriteItem);
      saveFavoritesToStorage(state.favorites);
    },
    
    REMOVE_FROM_FAVORITES(state: any, productId: any) {
      state.favorites = state.favorites.filter((item: any) => item.id !== productId);
      saveFavoritesToStorage(state.favorites);
    }
  },
  
  actions: {
    toggleFavorite({ commit, getters }: any, product: any) {
      if (getters.isFavorite(product.id)) {
        commit('REMOVE_FROM_FAVORITES', product.id);
      } else {
        commit('ADD_TO_FAVORITES', product);
      }
    }
  }
};