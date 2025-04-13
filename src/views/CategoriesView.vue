<!-- CategoriesPage.vue -->
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
        <!-- Categories List Component -->
        <category-list
          :categories="categories"
          :selected-category="selectedCategory"
          @select-category="selectCategory"
        />

        <!-- Products List Component -->
        <product-list
          :products="paginatedProducts"
          :category-name="selectedCategoryName"
          :loading="productsLoading"
          :error="productsError"
          :current-page="currentPage"
          :total-pages="totalPages"
          @retry="fetchProductsByCategory"
          @change-page="changePage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CategoryList from '../components/CategoryComponents/CategoryList.vue';
import ProductList from '../components/CategoryComponents/ProductList.vue';

export default {
  name: "CategoriesPage",
  components: {
    CategoryList,
    ProductList
  },
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

<style >
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

/* Responsive styles */
@media (min-width: 768px) {
  .content-layout {
    flex-direction: row;
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