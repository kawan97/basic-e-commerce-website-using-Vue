<!-- ProductList.vue -->
<template>
  <div class="products-container">
    <div class="products-header">
      <h2 class="products-title">{{ categoryName }} Products</h2>
      <div v-if="loading" class="products-loading">
        <div class="loader small"></div>
      </div>
    </div>

    <div v-if="!loading && error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="$emit('retry')" class="retry-button">
        Try Again
      </button>
    </div>

    <div v-else-if="!loading" class="products-grid">
      <product-card
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>

    <div
      v-if="!loading && !error && products.length === 0"
      class="no-products"
    >
      <p>No products found in this category.</p>
    </div>

    <!-- Pagination -->
    <pagination
      v-if="totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      @change-page="$emit('change-page', $event)"
    />
  </div>
</template>

<script>
import ProductCard from './ProductCard.vue';
import Pagination from './Pagination.vue';

export default {
  name: "ProductList",
  components: {
    ProductCard,
    Pagination
  },
  props: {
    products: {
      type: Array,
      required: true
    },
    categoryName: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: null
    },
    currentPage: {
      type: Number,
      default: 1
    },
    totalPages: {
      type: Number,
      default: 1
    }
  }
};
</script>

<style scoped>
/* Products section */
.products-container {
  padding: 1.5rem;
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.products-title {
  font-size: 1.5rem;
  font-weight: 600;
}

.products-loading {
  display: flex;
  align-items: center;
}

.loader.small {
  width: 24px;
  height: 24px;
  border-width: 3px;
  margin-bottom: 0;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 3px solid #2e7d32;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.no-products {
  text-align: center;
  padding: 3rem;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.error-message {
  color: #e53935;
  margin-bottom: 1rem;
}

.retry-button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

/* Responsive styles */
@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}

/* Light Theme */
.light .products-title {
  color: #2e7d32;
}

.light .no-products {
  color: #6c757d;
}

.light .retry-button {
  background-color: #2e7d32;
  color: white;
}

.light .retry-button:hover {
  background-color: #1b5e20;
}

.light .loader {
  border-top-color: #2e7d32;
}

/* Dark Theme */
.dark .products-title {
  color: #81c784;
}

.dark .no-products {
  color: #adb5bd;
}

.dark .error-message {
  color: #ef9a9a;
}

.dark .retry-button {
  background-color: #81c784;
  color: #121212;
}

.dark .retry-button:hover {
  background-color: #a5d6a7;
}

.dark .loader {
  border-top-color: #81c784;
}
</style>