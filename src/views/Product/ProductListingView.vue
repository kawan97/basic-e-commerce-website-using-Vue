<!-- ProductsList.vue -->
<template>
  <div class="products-list">
    <div class="container">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
      
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="fetchProducts" class="retry-btn">Try Again</button>
      </div>
      
      <div v-else-if="products.length" class="products-grid">
        <product-card 
          v-for="product in products" 
          :key="product.id" 
          :product="product"
        />
      </div>
      
      <div v-else class="empty-state">
        <p>No products found.</p>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from '../../components/ProductComponents/ProductCard.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'ProductsList',
  components: {
    ProductCard
  },
  data() {
    return {
      products: [],
      loading: true,
      error: null
    };
  },
  computed: {
    ...mapGetters(['currentTheme'])
  },
  methods: {
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch('https://api.escuelajs.co/api/v1/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        this.products = data;
      } catch (error) {
        this.error = error.message || 'An error occurred';
      } finally {
        this.loading = false;
      }
    }
  },
  created() {
    this.fetchProducts();
  }
};
</script>

<style scoped>
.products-list {
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #2e7d32;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.retry-btn {
  padding: 0.75rem 1.5rem;
  margin-top: 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

/* Light Theme */
:global(.light) .loading-spinner {
  border-top-color: #2e7d32;
}

:global(.light) .retry-btn {
  background-color: #2e7d32;
  color: white;
}

:global(.light) .retry-btn:hover {
  background-color: #1b5e20;
}

/* Dark Theme */
:global(.dark) .loading-spinner {
  border-top-color: #4caf50;
}

:global(.dark) .retry-btn {
  background-color: #2e7d32;
  color: #ffffff;
}

:global(.dark) .retry-btn:hover {
  background-color: #388e3c;
}
</style>