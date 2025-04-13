<!-- ProductsList.vue -->
<template>
  <div class="products-list">
    <div class="container">
      <div class="">
        <header class="page-header">
        <h1 class="page-title">Shop by Category</h1>
      </header>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
      
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="fetchProducts" class="retry-btn">Try Again</button>
      </div>
      
      <template v-else>
        <div v-if="products.length" class="products-grid">
          <product-card 
            v-for="product in paginatedProducts" 
            :key="product.id" 
            :product="product"
          />
        </div>
        
        <div v-else class="empty-state">
          <p>No products found.</p>
        </div>
        
        <pagination 
          v-if="products.length > itemsPerPage"
          :current-page="currentPage" 
          :total-pages="totalPages"
          @change-page="handlePageChange"
        />
      </template>
    </div>
  </div>
</template>

<script>
import ProductCard from '../../components/ProductComponents/ProductCard.vue';
import Pagination from '../../components/ProductComponents/Pagination.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'ProductsList',
  components: {
    ProductCard,
    Pagination
  },
  data() {
    return {
      products: [],
      loading: true,
      error: null,
      currentPage: 1,
      itemsPerPage: 9, // Number of products per page
      totalProducts: 0
    };
  },
  computed: {
    ...mapGetters(['currentTheme']),
    
    // Calculate total pages for pagination
    totalPages() {
      return Math.ceil(this.products.length / this.itemsPerPage);
    },
    
    // Get products for current page
    paginatedProducts() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.products.slice(startIndex, endIndex);
    }
  },
  methods: {
    ...mapActions(['toggleTheme']),
    
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      
      try {
        // Fetch more products for pagination
        const response = await fetch('https://api.escuelajs.co/api/v1/products?limit=50');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        
        // Add some demo properties for the badges
        this.products = data.map((product, index) => ({
          ...product,
          isNew: index % 7 === 0, // Mark some products as new
          discount: index % 5 === 0 ? Math.floor(Math.random() * 30) + 10 : 0 // Add random discounts to some products
        }));
        
        this.totalProducts = this.products.length;
      } catch (error) {
        this.error = error.message || 'An error occurred';
      } finally {
        this.loading = false;
      }
    },
    
    handlePageChange(pageNumber) {
      // Update current page and scroll to top
      this.currentPage = pageNumber;
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  },
  created() {
    this.fetchProducts();
    // Set theme attribute on root element
    document.documentElement.setAttribute('data-theme', this.currentTheme);
  },
  watch: {
    currentTheme(newTheme) {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  }
};
</script>

<style scoped>
.products-list {
  padding: 2rem 0;
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.page-title{
  color:#4caf50;

}
.title {
  font-size: 2rem;
  font-weight: 700;
}

.theme-toggle {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
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
  border-radius: 12px;
  padding: 2rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #2e7d32;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.retry-btn {
  padding: 0.875rem 1.75rem;
  margin-top: 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-size: 1rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  
  .header {
    margin-bottom: 1.5rem;
  }
  
  .title {
    font-size: 1.75rem;
  }
}

/* Light Theme */
:root[data-theme="light"] .products-list {
  background-color: #f8f9fa;
  color: #333;
}

:root[data-theme="light"] .title {
  color: #212529;
}

:root[data-theme="light"] .theme-toggle {
  background-color: #e9ecef;
}

:root[data-theme="light"] .theme-toggle:hover {
  background-color: #dee2e6;
}

:root[data-theme="light"] .loading-state,
:root[data-theme="light"] .error-state,
:root[data-theme="light"] .empty-state {
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

:root[data-theme="light"] .loading-spinner {
  border-top-color: #2e7d32;
}

:root[data-theme="light"] .retry-btn {
  background-color: #2e7d32;
  color: white;
}

:root[data-theme="light"] .retry-btn:hover {
  background-color: #1b5e20;
}

/* Dark Theme */
:root[data-theme="dark"] .products-list {
  background-color: #121212;
  color: #e0e0e0;
}

:root[data-theme="dark"] .title {
  color: #f5f5f5;
}

:root[data-theme="dark"] .theme-toggle {
  background-color: #333333;
}

:root[data-theme="dark"] .theme-toggle:hover {
  background-color: #444444;
}

:root[data-theme="dark"] .loading-state,
:root[data-theme="dark"] .error-state,
:root[data-theme="dark"] .empty-state {
  background-color: #2a2a2a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

:root[data-theme="dark"] .loading-spinner {
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: #4caf50;
}

:root[data-theme="dark"] .retry-btn {
  background-color: #2e7d32;
  color: #ffffff;
}

:root[data-theme="dark"] .retry-btn:hover {
  background-color: #388e3c;
}
</style>