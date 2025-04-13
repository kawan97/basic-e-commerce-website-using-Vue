<!-- ProductCard.vue -->
<template>
  <div class="product-card">
    <div class="product-image">
      <img
        :src="product.images[0]"
        :alt="product.title"
        class="product-img"
      />
    </div>
    <div class="product-info">
      <router-link :to="`/products/${product.id}`" class="product-name">{{ product.title }}</router-link >
      <p class="product-price">${{ product.price.toFixed(2) }}</p>
      <p class="product-description">{{ product.description }}</p>
      <button 
        class="favorite-btn"
        :class="{ 'remove': isFavorite }"
        @click="toggleFavorite(product)"
      >
        <span v-if="isFavorite">❤️ Remove from Favorites</span>
        <span v-else>🤍 Add to Favorites</span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "ProductCard",
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters(['isFavorite']),
    isFavorite() {
      return this.$store.getters.isFavorite(this.product.id);
    }
  },
  methods: {
    ...mapActions(['toggleFavorite'])
  }
};
</script>

<style scoped>
.product-card {
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  height: 200px;
  overflow: hidden;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-img {
  transform: scale(1.05);
}

.product-info {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.product-description {
  font-size: 0.875rem;
  margin-bottom: 1rem;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.favorite-btn {
  border: none;
  border-radius: 6px;
  padding: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

@media (max-width: 480px) {
  .product-image {
    height: 180px;
  }
}

/* Light Theme */
.light .product-card {
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.light .product-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.light .product-name {
  color: #212529;
}

.light .product-price {
  color: #2e7d32;
}

.light .product-description {
  color: #6c757d;
}

.light .favorite-btn {
  background-color: #2e7d32;
  color: white;
}

.light .favorite-btn:hover {
  background-color: #1b5e20;
}

.light .favorite-btn.remove {
  background-color: #e53935;
}

.light .favorite-btn.remove:hover {
  background-color: #c62828;
}

/* Dark Theme */
.dark .product-card {
  background-color: #2d2d2d;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.dark .product-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.dark .product-name {
  color: #f5f5f5;
}

.dark .product-price {
  color: #81c784;
}

.dark .product-description {
  color: #bdbdbd;
}

.dark .favorite-btn {
  background-color: #81c784;
  color: #121212;
}

.dark .favorite-btn:hover {
  background-color: #a5d6a7;
}

.dark .favorite-btn.remove {
  background-color: #ef5350;
}

.dark .favorite-btn.remove:hover {
  background-color: #e57373;
}
</style>