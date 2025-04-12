<template>
  <div :class="['categories-page', currentTheme]">
    <div class="container">
      <header class="page-header">
        <h1 class="page-title">Shop by Category</h1>
      </header>

      <div v-if="loading" class="loading-container">
        <div class="loader"></div>
        <p>Loading categories and products...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <p class="error-message">{{ error }}</p>
        <button @click="fetchCategories" class="retry-button">Try Again</button>
      </div>

      <div v-else class="content-layout">
        <!-- Categories List -->
        <div class="categories-sidebar">
          <h2 class="sidebar-title">Categories</h2>
          <ul class="categories-list">
            <li
              class="category-item"
              :class="{ active: selectedCategory === 0 }"
              @click="selectCategory(0)"
            >
              <span class="category-icon">🛒</span>
              <span class="category-name">All Products</span>
            </li>
            <li
              v-for="category in categories"
              :key="category.id"
              class="category-item"
              :class="{ active: selectedCategory === category.id }"
              @click="selectCategory(category.id)"
            >
              <div class="category-image-container">
                <img
                  :src="category.image"
                  :alt="category.name"
                  class="category-image"
                />
              </div>
              <span class="category-name">{{ category.name }}</span>
            </li>
          </ul>
        </div>

        <!-- Products List -->
        <div class="products-container">
          <div class="products-header">
            <h2 class="products-title">{{ selectedCategoryName }} Products</h2>
            <div v-if="productsLoading" class="products-loading">
              <div class="loader small"></div>
            </div>
          </div>

          <div v-if="!productsLoading && productsError" class="error-container">
            <p class="error-message">{{ productsError }}</p>
            <button @click="fetchProductsByCategory" class="retry-button">
              Try Again
            </button>
          </div>

          <div v-else-if="!productsLoading" class="products-grid">
            <div
              v-for="product in paginatedProducts"
              :key="product.id"
              class="product-card"
            >
              <div class="product-image">
                <img
                  :src="product.images[0]"
                  :alt="product.title"
                  class="product-img"
                />
              </div>
              <div class="product-info">
                <h3 class="product-name">{{ product.title }}</h3>
                <p class="product-price">${{ product.price.toFixed(2) }}</p>
                <p class="product-description">{{ product.description }}</p>
                <button class="add-to-cart-btn">Add to Cart</button>
              </div>
            </div>
          </div>

          <div
            v-if="!productsLoading && !productsError && products.length === 0"
            class="no-products"
          >
            <p>No products found in this category.</p>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="pagination-controls">
            <button
              class="pagination-btn"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              Previous
            </button>

            <button
              v-for="page in totalPages"
              :key="page"
              class="pagination-btn"
              :class="{ active: currentPage === page }"
              @click="changePage(page)"
            >
              {{ page }}
            </button>

            <button
              class="pagination-btn"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "CategoriesPage",
  data() {
    return {
      categories: [],
      products: [],
      selectedCategory: 0,
      loading: true,
      error: null,
      productsLoading: false,
      productsError: null,
      currentPage: 1,
      itemsPerPage: 6,
    };
  },
  computed: {
    ...mapGetters(["currentTheme"]),
    selectedCategoryName() {
      if (this.selectedCategory === 0) {
        return "All";
      }
      const category = this.categories.find(
        (cat) => cat.id === this.selectedCategory
      );
      return category ? category.name : "";
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.products.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.products.length / this.itemsPerPage);
    },
  },
  methods: {
    async fetchCategories() {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch(
          "https://api.escuelajs.co/api/v1/categories"
        );
        if (!response.ok)
          throw new Error(`Failed to fetch categories: ${response.statusText}`);
        this.categories = await response.json();
        await this.fetchAllProducts();
      } catch (err) {
        this.error = `Failed to load categories: ${err.message}`;
      } finally {
        this.loading = false;
      }
    },
    async fetchAllProducts() {
      this.productsLoading = true;
      this.productsError = null;
      this.currentPage = 1;

      try {
        const response = await fetch(
          "https://api.escuelajs.co/api/v1/products?limit=100"
        );
        if (!response.ok)
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        this.products = await response.json();
      } catch (err) {
        this.productsError = `Failed to load products: ${err.message}`;
      } finally {
        this.productsLoading = false;
      }
    },
    async fetchProductsByCategory() {
      this.productsLoading = true;
      this.productsError = null;
      this.currentPage = 1;

      try {
        if (this.selectedCategory === 0) {
          await this.fetchAllProducts();
          return;
        }

        const response = await fetch(
          `https://api.escuelajs.co/api/v1/products/?categoryId=${this.selectedCategory}`
        );
        if (!response.ok)
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        this.products = await response.json();
        window.scrollTo({ top: 0, behavior: "smooth" }); // Scrolls to the top
      } catch (err) {
        this.productsError = `Failed to load products: ${err.message}`;
      } finally {
        this.productsLoading = false;
      }
    },
    selectCategory(categoryId) {
      this.selectedCategory = categoryId;
      this.fetchProductsByCategory();
    },
    changePage(page) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scrolls to the top
    },
  },
  created() {
    this.fetchCategories();
  },
};
</script>

<style scoped>
/* Base styles */
.categories-page {
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

/* Loading and Error States */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.loader {
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 5px solid #2e7d32;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loader.small {
  width: 24px;
  height: 24px;
  border-width: 3px;
  margin-bottom: 0;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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

/* Layout for categories and products */
.content-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  border-radius: 12px;
  overflow: hidden;
}

/* Categories sidebar */
.categories-sidebar {
  padding: 1.5rem;
  border-radius: 8px;
}

.sidebar-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
}

.categories-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.category-image-container {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-icon {
  margin-right: 0.75rem;
  font-size: 1.25rem;
}

.category-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

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

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

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

.add-to-cart-btn {
  border: none;
  border-radius: 6px;
  padding: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.no-products {
  text-align: center;
  padding: 3rem;
}

/* Responsive styles */
@media (min-width: 768px) {
  .content-layout {
    flex-direction: row;
  }

  .categories-sidebar {
    width: 250px;
    flex-shrink: 0;
    border-radius: 0;
    height: auto;
  }

  .products-container {
    flex-grow: 1;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }

  .product-image {
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

.light .categories-sidebar {
  background-color: #f1f8e9;
  border-right: 1px solid #e8f5e9;
}

.light .sidebar-title {
  color: #2e7d32;
  border-bottom: 1px solid #c8e6c9;
}

.light .category-item {
  color: #495057;
}

.light .category-item:hover {
  background-color: #e8f5e9;
  color: #1b5e20;
}

.light .category-item.active {
  background-color: #c8e6c9;
  color: #1b5e20;
}

.light .products-title {
  color: #2e7d32;
}

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

.light .add-to-cart-btn {
  background-color: #2e7d32;
  color: white;
}

.light .add-to-cart-btn:hover {
  background-color: #1b5e20;
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

.dark .categories-sidebar {
  background-color: #212121;
  border-right: 1px solid #2d2d2d;
}

.dark .sidebar-title {
  color: #81c784;
  border-bottom: 1px solid #333333;
}

.dark .category-item {
  color: #e0e0e0;
}

.dark .category-item:hover {
  background-color: rgba(129, 199, 132, 0.1);
  color: #a5d6a7;
}

.dark .category-item.active {
  background-color: rgba(129, 199, 132, 0.2);
  color: #81c784;
}

.dark .products-title {
  color: #81c784;
}

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

.dark .add-to-cart-btn {
  background-color: #81c784;
  color: #121212;
}

.dark .add-to-cart-btn:hover {
  background-color: #a5d6a7;
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
.pagination-controls {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  background-color: #e0e0e0;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.pagination-btn:hover {
  background-color: #c8e6c9;
}

.pagination-btn.active {
  background-color: #2e7d32;
  color: white;
}

.pagination-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
