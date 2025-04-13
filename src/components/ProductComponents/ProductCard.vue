<!-- ProductCard.vue -->
<template>
  <div class="product-card">
    <div class="product-image">
      <img
        :src="productImage"
        :alt="product.title"
        class="product-img"
        @error="handleImageError"
      />
      <div class="product-badges" v-if="product.isNew || product.discount">
        <span v-if="product.isNew" class="badge new-badge">NEW</span>
        <span v-if="product.discount" class="badge discount-badge">-{{ product.discount }}%</span>
      </div>
    </div>
    <div class="product-info">
      <h3 class="product-name">{{ product.title }}</h3>
      <p class="product-price">${{ product.price.toFixed(2) }}</p>
      <p class="product-description">{{ product.description }}</p>
      <div class="product-actions">
        <router-link :to="`/products/${product.id}`" class="view-details-btn">
          View Details
        </router-link>
        <button 
          class="favorite-btn"
          :class="{ 'remove': isFavorite }"
          @click="toggleFavorite(product)"
        >
          <span v-if="isFavorite">❤️</span>
          <span v-else>🤍</span>
        </button>
      </div>
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
  data() {
    return {
      imageError: false
    };
  },
  computed: {
    ...mapGetters(['currentTheme']),
    isFavorite() {
      return this.$store.getters.isFavorite(this.product.id);
    },
    productImage() {
      if (this.imageError) {
        return 'https://via.placeholder.com/300x300?text=No+Image';
      }
      
      // Handle different image structures
      if (Array.isArray(this.product.images) && this.product.images.length > 0) {
        return this.product.images[0];
      } else if (this.product.image) {
        return this.product.image;
      } else {
        return 'https://via.placeholder.com/300x300?text=No+Image';
      }
    }
  },
  methods: {
    ...mapActions(['toggleFavorite']),
    handleImageError() {
      this.imageError = true;
    }
  }
};
</script>

<style scoped>
.product-card {
  border-radius: 12px;
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
  height: 220px;
  overflow: hidden;
  position: relative;
}

.product-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 70%, rgba(0,0,0,0.1) 100%);
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-img {
  transform: scale(1.05);
}

.product-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.75rem;
}

.new-badge {
  background-color: #3f51b5;
  color: white;
}

.discount-badge {
  background-color: #f44336;
  color: white;
}

.product-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.product-price {
  font-size: 1.375rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.product-description {
  font-size: 0.9375rem;
  margin-bottom: 1.25rem;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.product-actions {
  display: flex;
  gap: 10px;
}

.view-details-btn {
  flex: 1;
  border: none;
  border-radius: 8px;
  padding: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9375rem;
  text-decoration: none;
  text-align: center;
}

.favorite-btn {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.25rem;
}

.favorite-btn:active, .view-details-btn:active {
  transform: scale(0.98);
}

@media (max-width: 480px) {
  .product-image {
    height: 180px;
  }
  
  .product-info {
    padding: 1.25rem;
  }
}

/* Light Theme */
:root[data-theme="light"] .product-card {
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

:root[data-theme="light"] .product-card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

:root[data-theme="light"] .product-name {
  color: #212529;
}

:root[data-theme="light"] .product-price {
  color: #2e7d32;
}

:root[data-theme="light"] .product-description {
  color: #4a4a4a;
}

:root[data-theme="light"] .view-details-btn {
  background-color: #2e7d32;
  color: white;
}

:root[data-theme="light"] .view-details-btn:hover {
  background-color: #1b5e20;
}

:root[data-theme="light"] .favorite-btn {
  background-color: #f5f5f5;
  color: #333;
}

:root[data-theme="light"] .favorite-btn:hover {
  background-color: #e0e0e0;
}

:root[data-theme="light"] .favorite-btn.remove {
  background-color: #ffebee;
}

:root[data-theme="light"] .favorite-btn.remove:hover {
  background-color: #ffcdd2;
}

/* Dark Theme */
:root[data-theme="dark"] .product-card {
  background-color: #2a2a2a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

:root[data-theme="dark"] .product-card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
}

:root[data-theme="dark"] .product-name {
  color: #f5f5f5;
}

:root[data-theme="dark"] .product-price {
  color: #81c784;
}

:root[data-theme="dark"] .product-description {
  color: #e0e0e0;
}

:root[data-theme="dark"] .view-details-btn {
  background-color: #2e7d32;
  color: white;
}

:root[data-theme="dark"] .view-details-btn:hover {
  background-color: #388e3c;
}

:root[data-theme="dark"] .favorite-btn {
  background-color: #333333;
  color: #f5f5f5;
}

:root[data-theme="dark"] .favorite-btn:hover {
  background-color: #424242;
}

:root[data-theme="dark"] .favorite-btn.remove {
  background-color: rgba(244, 67, 54, 0.15);
}

:root[data-theme="dark"] .favorite-btn.remove:hover {
  background-color: rgba(244, 67, 54, 0.25);
}
</style>