// store/modules/recentlyViewed.js

// Get recently viewed products from localStorage
const getRecentlyViewedFromStorage = () => {
  const recentlyViewed = localStorage.getItem('recentlyViewed');
  return recentlyViewed ? JSON.parse(recentlyViewed) : [];
};

// Save recently viewed products to localStorage
const saveRecentlyViewedToStorage = (recentlyViewed: any) => {
  localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
};

// Maximum number of recently viewed products to store
const MAX_RECENTLY_VIEWED = 10;

export default {
  state: {
    recentlyViewed: getRecentlyViewedFromStorage()
  },
  
  getters: {
    allRecentlyViewed: (state: any) => state.recentlyViewed,
    
    isRecentlyViewed: (state: any) => (productId: any) => {
      return state.recentlyViewed.some((item: any) => item.id === productId);
    }
  },
  
  mutations: {
    ADD_TO_RECENTLY_VIEWED(state: any, product: any) {
      // Extract only the data we want to store
      const { id, title, price, description, images } = product;
      const recentlyViewedItem = {
        id,
        title,
        price,
        description,
        image: images[0], // Store just the first image
        viewedAt: new Date().toISOString() // Add timestamp for sorting
      };
      
      // Remove the product if it's already in the list (to avoid duplicates)
      state.recentlyViewed = state.recentlyViewed.filter((item: any) => item.id !== id);
      
      // Add the product to the beginning of the array
      state.recentlyViewed.unshift(recentlyViewedItem);
      
      // Limit the number of items in the list
      if (state.recentlyViewed.length > MAX_RECENTLY_VIEWED) {
        state.recentlyViewed = state.recentlyViewed.slice(0, MAX_RECENTLY_VIEWED);
      }
      
      // Save to localStorage
      saveRecentlyViewedToStorage(state.recentlyViewed);
    },
    
    CLEAR_RECENTLY_VIEWED(state: any) {
      state.recentlyViewed = [];
      saveRecentlyViewedToStorage(state.recentlyViewed);
    }
  },
  
  actions: {
    viewProduct({ commit, getters }: any, product: any) {
      commit('ADD_TO_RECENTLY_VIEWED', product);
    },
    
    clearRecentlyViewed({ commit }: any) {
      commit('CLEAR_RECENTLY_VIEWED');
    }
  }
};