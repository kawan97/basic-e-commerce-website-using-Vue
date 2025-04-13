<!-- HomePage.vue -->
<template>
  <div :class="['home-page', currentTheme]">
    <div class="container">
      <header class="page-header">
        <h1 class="page-title">Welcome to Our Store</h1>
        
        <!-- Search Bar -->
        <div class="search-container">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search products..."
            class="search-input"
            @input="debounceSearch"
          />
          <button class="search-button" @click="searchProducts">
            Search
          </button>
        </div>
      </header>

      <!-- Categories Section -->
      <section class="categories-section">
        <h2 class="section-title">Categories</h2>
        <div v-if="loadingCategories" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading categories...</p>
        </div>
        <div v-else-if="categoryError" class="error-container">
          <p>{{ categoryError }}</p>
          <button @click="fetchCategories" class="retry-btn">Try Again</button>
        </div>
        <div v-else class="categories-list">
          <div 
            v-for="category in categories" 
            :key="category" 
            class="category-card"
            @click="selectCategory(category)"
            :class="{ 'active': selectedCategory === category }"
          >
            <h3 class="category-title">{{ formatCategoryName(category) }}</h3>
          </div>
        </div>
      </section>

      <!-- Sort Options -->
      <section class="sort-section">
        <div class="sort-container">
          <label for="sort-select">Sort by:</label>
          <select id="sort-select" v-model="sortOption" class="sort-select">
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </section>

      <!-- Products Section -->
      <section class="products-section">
        <h2 class="section-title">
          {{ selectedCategory ? formatCategoryName(selectedCategory) : 'All Products' }}
          {{ searchQuery ? `- Search: "${searchQuery}"` : '' }}
        </h2>
        
        <div v-if="loadingProducts" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
        
        <div v-else-if="productError" class="error-container">
          <p>{{ productError }}</p>
          <button @click="fetchProducts" class="retry-btn">Try Again</button>
        </div>
        
        <div v-else-if="filteredProducts.length === 0" class="no-products">
          <p>No products found.</p>
        </div>
        
        <div v-else class="products-grid">
          <div 
            v-for="product in filteredProducts" 
            :key="product.id" 
            class="product-card"
          >
            <div class="product-image">
              <img 
                :src="getProductImage(product)" 
                :alt="product.title" 
                class="product-img"
              />
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.title }}</h3>
              <p class="product-price">${{ product.price.toFixed(2) }}</p>
              <div class="product-actions">
                <router-link :to="`/products/${product.id}`" class="view-btn">
                  View Details
                </router-link>
                <button 
                  @click="toggleFavorite(product)" 
                  class="favorite-btn"
                  :class="{ 'favorited': isFavorite(product.id) }"
                >
                  {{ isFavorite(product.id) ? '♥' : '♡' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Recently Viewed Products Section -->
      <section v-if="recentlyViewedProducts.length > 0" class="recent-section">
        <h2 class="section-title">Recently Viewed Products</h2>
        <div class="recent-products-list">
          <div 
            v-for="product in recentlyViewedProducts.slice(0, 5)" 
            :key="`viewed-${product.id}`"
            class="recent-product-card"
          >
            <router-link :to="`/products/${product.id}`" class="recent-product-link">
              <div class="recent-product-image">
                <img 
                  :src="product.image || 'https://via.placeholder.com/150x150?text=No+Image'" 
                  :alt="product.title" 
                  class="recent-img"
                  @error="e => e.target.src = 'https://via.placeholder.com/150x150?text=No+Image'"
                />
              </div>
              <div class="recent-product-info">
                <h4 class="recent-product-name">{{ product.title }}</h4>
                <p class="recent-product-price">${{ product.price.toFixed(2) }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </section>

      <!-- Favorite Products Section -->
      <section v-if="favoriteProducts.length > 0" class="favorites-section">
        <h2 class="section-title">Your Favorite Products</h2>
        <div class="favorite-products-list">
          <div 
            v-for="product in favoriteProducts.slice(0, 5)" 
            :key="`fav-${product.id}`"
            class="favorite-product-card"
          >
            <router-link :to="`/products/${product.id}`" class="favorite-product-link">
              <div class="favorite-product-image">
                <img 
                  :src="product.image || 'https://via.placeholder.com/150x150?text=No+Image'" 
                  :alt="product.title" 
                  class="favorite-img"
                  @error="e => e.target.src = 'https://via.placeholder.com/150x150?text=No+Image'"
                />
              </div>
              <div class="favorite-product-info">
                <h4 class="favorite-product-name">{{ product.title }}</h4>
                <p class="favorite-product-price">${{ product.price.toFixed(2) }}</p>
              </div>
            </router-link>
           
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "HomePage",
  data() {
    return {
      categories: [],
      products: [],
      loadingCategories: true,
      loadingProducts: true,
      categoryError: null,
      productError: null,
      selectedCategory: null,
      searchQuery: "",
      searchTimeout: null,
      sortOption: "default" // New sort option
    };
  },
  computed: {
    ...mapGetters([
      "currentTheme", 
      "allFavorites", 
      "isFavorite", 
      "allRecentlyViewed"
    ]),
    
    favoriteProducts() {
      return this.allFavorites || [];
    },
    
    recentlyViewedProducts() {
      return this.allRecentlyViewed || [];
    },
    
    filteredProducts() {
      if (!this.products) return [];
      
      let filtered = [...this.products];
      
      // Filter by category if selected
      if (this.selectedCategory) {
        filtered = filtered.filter(product => {
          if (product.category && typeof product.category === 'object') {
            return product.category.name === this.selectedCategory;
          }
          return product.category === this.selectedCategory;
        });
        
        // Limit to 9 products per category
        filtered = filtered.slice(0, 9);
      }
      
      // Filter by search query if provided
      if (this.searchQuery.trim() !== "") {
        const query = this.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(product => 
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        );
      }
      
      // Sort products based on selected option
      if (this.sortOption === "price-low") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (this.sortOption === "price-high") {
        filtered.sort((a, b) => b.price - a.price);
      }
      
      return filtered;
    }
  },
  methods: {
    ...mapActions(["toggleFavorite"]),
    
    async fetchCategories() {
      this.loadingCategories = true;
      this.categoryError = null;
      
      try {
        const response = await fetch("https://api.escuelajs.co/api/v1/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        
        const data = await response.json();
        this.categories = data.map(category => category.name);
        return this.categories;
      } catch (error) {
        console.error("Error fetching categories:", error);
        this.categoryError = error.message || "An error occurred while fetching categories";
        return [];
      } finally {
        this.loadingCategories = false;
      }
    },
    
    async fetchProducts() {
      this.loadingProducts = true;
      this.productError = null;
      
      try {
        const response = await fetch("https://api.escuelajs.co/api/v1/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        
        this.products = await response.json();
      } catch (error) {
        console.error("Error fetching products:", error);
        this.productError = error.message || "An error occurred while fetching products";
      } finally {
        this.loadingProducts = false;
      }
    },
    
    selectCategory(category) {
      this.selectedCategory = category;
    },
    
    formatCategoryName(category) {
      if (!category) return "";
      return category
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
    
    getProductImage(product) {
      if (Array.isArray(product.images) && product.images.length > 0) {
        return product.images[0];
      } else if (product.image) {
        return product.image;
      } else {
        return "https://via.placeholder.com/300x300?text=No+Image";
      }
    },
    
    debounceSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      
      this.searchTimeout = setTimeout(() => {
        this.searchProducts();
      }, 300);
    },
    
    searchProducts() {
      // The actual filtering happens in the computed property filteredProducts
      // This method exists to handle the search button click
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
    }
  },
  created() {
    this.fetchCategories().then(() => {
      // Select first category by default if categories exist
      if (this.categories && this.categories.length > 0) {
        this.selectCategory(this.categories[0]);
      }
    });
    this.fetchProducts();
  }
};
</script>

<style scoped>
/* Base Styles */
.home-page {
  padding: 2rem 0;
  min-height: calc(100vh - 70px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header {
  margin-bottom: 2rem;
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.search-container {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 6px 0 0 6px;
  border: 2px solid;
  font-size: 1rem;
  outline: none;
}

.search-button {
  padding: 0.75rem 1.5rem;
  border-radius: 0 6px 6px 0;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid;
}

/* Sort Section */
.sort-section {
  margin-bottom: 2rem;
}

.sort-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
}

.sort-select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 2px solid;
  font-size: 0.9rem;
  cursor: pointer;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #28a745;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.retry-btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  border-radius: 6px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.no-products {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
}

/* Categories Section */
.categories-section {
  margin-bottom: 3rem;
}

.categories-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.category-card {
  padding: 1rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.category-card:hover {
  transform: translateY(-3px);
}

.category-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  text-align: center;
}

/* Products Section */
.products-section {
  margin-bottom: 3rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
}

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
  height: 2.8em;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.product-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.view-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.favorite-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.favorite-btn:hover {
  transform: scale(1.1);
}

/* Recently Viewed and Favorites Sections */
.recent-section,
.favorites-section {
  margin-bottom: 3rem;
}

.recent-products-list,
.favorite-products-list {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0.2rem;
  scroll-behavior: smooth;
}

.recent-product-card,
.favorite-product-card {
  min-width: 200px;
  width: 200px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}

.recent-product-card:hover,
.favorite-product-card:hover {
  transform: translateY(-3px);
}

.recent-product-link,
.favorite-product-link {
  text-decoration: none;
  display: block;
}

.recent-product-image,
.favorite-product-image {
  height: 150px;
  overflow: hidden;
}

.recent-img,
.favorite-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recent-product-info,
.favorite-product-info {
  padding: 0.75rem;
}

.recent-product-name,
.favorite-product-name {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.6em;
}

.recent-product-price,
.favorite-product-price {
  font-size: 1rem;
  font-weight: 700;
}

.remove-favorite-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease, background-color 0.2s ease;
}

.favorite-product-card:hover .remove-favorite-btn {
  opacity: 1;
}

/* Light Theme */
.light {
  background-color: #f8f9fa;
  color: #212529;
}

.light .page-title {
  color: #28a745;
}

.light .search-input {
  border-color: #dee2e6;
  background-color: white;
  color: #212529;
}

.light .search-button {
  background-color: #28a745;
  color: white;
}

.light .search-button:hover {
  background-color: #218838;
}

.light .section-title {
  border-bottom-color: #e9ecef;
  color: #28a745;
}

.light .sort-select {
  border-color: #dee2e6;
  background-color: white;
  color: #212529;
}

.light .loading-spinner {
  border-top-color: #28a745;
}

.light .retry-btn {
  background-color: #28a745;
  color: white;
}

.light .retry-btn:hover {
  background-color: #218838;
}

.light .category-card {
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.light .category-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.light .category-card.active {
  background-color: #28a745;
  color: white;
}

.light .product-card {
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.light .product-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.light .product-price {
  color: #28a745;
}

.light .view-btn {
  background-color: #28a745;
  color: white;
}

.light .view-btn:hover {
  background-color: #218838;
}

.light .favorite-btn {
  background-color: #f8f9fa;
  color: #dc3545;
  border: 1px solid #dee2e6;
}

.light .favorite-btn.favorited {
  background-color: #dc3545;
  color: white;
}

.light .recent-product-card,
.light .favorite-product-card {
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.light .recent-product-card:hover,
.light .favorite-product-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.light .recent-product-name,
.light .favorite-product-name {
  color: #212529;
}

.light .recent-product-price,
.light .favorite-product-price {
  color: #28a745;
}

.light .remove-favorite-btn {
  background-color: #dc3545;
  color: white;
}

.light .remove-favorite-btn:hover {
  background-color: #c82333;
}

/* Dark Theme */
.dark {
  background-color: #121212;
  color: #e9ecef;
}

.dark .page-title {
  color: #51cf66;
}

.dark .search-input {
  border-color: #2d2d2d;
  background-color: #1e1e1e;
  color: #e9ecef;
}

.dark .search-button {
  background-color: #51cf66;
  color: #121212;
}

.dark .search-button:hover {
  background-color: #69db7c;
}

.dark .section-title {
  border-bottom-color: #2d2d2d;
  color: #51cf66;
}

.dark .sort-select {
  border-color: #2d2d2d;
  background-color: #1e1e1e;
  color: #e9ecef;
}

.dark .loading-spinner {
  border-top-color: #51cf66;
}

.dark .retry-btn {
  background-color: #51cf66;
  color: #121212;
}

.dark .retry-btn:hover {
  background-color: #69db7c;
}

.dark .category-card {
  background-color: #1e1e1e;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.dark .category-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.dark .category-card.active {
  background-color: #51cf66;
  color: #121212;
}

.dark .product-card {
  background-color: #1e1e1e;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.dark .product-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.dark .product-price {
  color: #51cf66;
}

.dark .view-btn {
  background-color: #51cf66;
  color: #121212;
}

.dark .view-btn:hover {
  background-color: #69db7c;
}

.dark .favorite-btn {
  background-color: #2d2d2d;
  color: #ff6b6b;
  border: 1px solid #2d2d2d;
}

.dark .favorite-btn.favorited {
  background-color: #ff6b6b;
  color: #121212;
}

.dark .recent-product-card,
.dark .favorite-product-card {
  background-color: #1e1e1e;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.dark .recent-product-card:hover,
.dark .favorite-product-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.dark .recent-product-name,
.dark .favorite-product-name {
  color: #e9ecef;
}

.dark .recent-product-price,
.dark .favorite-product-price {
  color: #51cf66;
}

.dark .remove-favorite-btn {
  background-color: #ff6b6b;
  color: #121212;
}

.dark .remove-favorite-btn:hover {
  background-color: #ff8787;
}

/* Media Queries */
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  .sort-container {
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .categories-list {
    justify-content: center;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .search-container {
    flex-direction: column;
  }
  
  .search-input {
    border-radius: 6px;
    margin-bottom: 0.5rem;
  }
  
  .search-button {
    border-radius: 6px;
  }
}
</style>