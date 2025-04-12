<!-- FavoritesPage.vue -->
<template>
  <div :class="['favorites-page', currentTheme]">
    <div class="container">
      <header class="page-header">
        <h1 class="page-title">My Favorites</h1>
      </header>

      <div class="content-layout">
        <div class="favorites-container">
          <div v-if="favorites.length === 0" class="no-favorites">
            <p>You haven't added any products to your favorites yet.</p>
            <router-link to="/" class="browse-button"
              >Browse Products</router-link
            >
          </div>

          <div v-else class="favorites-grid">
            <div
              v-for="product in favorites"
              :key="product.id"
              class="favorite-card"
            >
              <div class="favorite-image">
                <img
                  :src="product.image"
                  :alt="product.title"
                  class="favorite-img"
                />
              </div>
              <div class="favorite-info">
                <h3 class="favorite-name">{{ product.title }}</h3>
                <p class="favorite-price">${{ product.price.toFixed(2) }}</p>
                <p class="favorite-description">{{ product.description }}</p>
                <button
                  class="remove-btn"
                  @click="removeFromFavorites(product.id)"
                >
                  Remove from Favorites
                </button>
                <router-link :to="`/product/${product.id}`" class="view-product-btn">
                  View Product
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "FavoritesPage",
  computed: {
    ...mapGetters(["currentTheme", "allFavorites"]),
    favorites() {
      return this.allFavorites;
    },
  },
  methods: {
    removeFromFavorites(productId) {
      this.$store.commit("REMOVE_FROM_FAVORITES", productId);
    },
  },
};
</script>

<style scoped>
/* Base styles */
.favorites-page {
  padding: 2rem 0;
  min-height: calc(100vh - 70px); /* Adjust based on your header height */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
}

.content-layout {
  border-radius: 12px;
  overflow: hidden;
}

.favorites-container {
  padding: 1.5rem;
}

.no-favorites {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.browse-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  margin-top: 1rem;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.favorite-card {
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.favorite-card:hover {
  transform: translateY(-5px);
}

.favorite-image {
  height: 200px;
  overflow: hidden;
}

.favorite-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.favorite-card:hover .favorite-img {
  transform: scale(1.05);
}

.favorite-info {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.favorite-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.favorite-price {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.favorite-description {
  font-size: 0.875rem;
  margin-bottom: 1rem;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.remove-btn {
  border: none;
  border-radius: 6px;
  padding: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

@media (max-width: 480px) {
  .favorites-grid {
    grid-template-columns: 1fr;
  }

  .favorite-image {
    height: 180px;
  }
}

/* Light Theme */
.light {
  background-color: #f8f9fa;
  color: #212529;
}

.light .page-title {
  color: #2e7d32;
}

.light .content-layout {
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.light .no-favorites {
  color: #6c757d;
}

.light .browse-button {
  background-color: #2e7d32;
  color: white;
}

.light .browse-button:hover {
  background-color: #1b5e20;
}

.light .favorite-card {
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.light .favorite-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.light .favorite-name {
  color: #212529;
}

.light .favorite-price {
  color: #2e7d32;
}

.light .favorite-description {
  color: #6c757d;
}

.light .remove-btn {
  background-color: #e53935;
  color: white;
}

.light .remove-btn:hover {
  background-color: #c62828;
}

/* Dark Theme */
.dark {
  background-color: #121212;
  color: #e9ecef;
}

.dark .page-title {
  color: #81c784;
}

.dark .content-layout {
  background-color: #1e1e1e;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.dark .no-favorites {
  color: #adb5bd;
}

.dark .browse-button {
  background-color: #81c784;
  color: #121212;
}

.dark .browse-button:hover {
  background-color: #a5d6a7;
}

.dark .favorite-card {
  background-color: #2d2d2d;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.dark .favorite-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.dark .favorite-name {
  color: #f5f5f5;
}

.dark .favorite-price {
  color: #81c784;
}

.dark .favorite-description {
  color: #bdbdbd;
}

.dark .remove-btn {
  background-color: #ef5350;
  color: #f5f5f5;
}

.dark .remove-btn:hover {
  background-color: #e57373;
}
.view-product-btn{
  background-color: #81c784;
  color: #f5f5f5;
  text-decoration: none;
  text-align: center;
  border: none;
  border-radius: 6px;
  padding: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 1rem;
}
</style>
