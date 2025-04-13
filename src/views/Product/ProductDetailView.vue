<!-- Product.vue -->
<template>
  <div :class="['product', currentTheme]">
    <div class="container">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading product...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
        <button @click="fetchProduct" class="retry-btn">Try Again</button>
      </div>

      <div v-else-if="product" class="product-container">
        <div class="product-header">
          <h1 class="product-title">{{ product.title }}</h1>
          <div class="product-category">
            <span class="category-label">Category:</span>
            <span class="category-value">{{ categoryName }}</span>
          </div>
        </div>

        <div class="product-content">
          <div class="product-gallery">
            <div class="main-image">
              <img
                :src="currentImageUrl"
                :alt="product.title"
                class="product-main-img"
                @error="handleImageError"
              />
            </div>
            <div class="image-thumbnails" v-if="productImages.length > 1">
              <div
                v-for="(image, index) in productImages"
                :key="index"
                class="thumbnail"
                :class="{ active: index === currentImage }"
                @click="currentImage = index"
              >
                <img
                  :src="image"
                  :alt="`Thumbnail ${index + 1}`"
                  class="thumbnail-img"
                  @error="handleImageError"
                />
              </div>
            </div>
          </div>

          <div class="product-details">
            <div class="price-rating">
              <div class="product-price">${{ product.price.toFixed(2) }}</div>
            </div>

            <div class="product-description">
              <h3>Description</h3>
              <p>{{ product.description }}</p>
            </div>

            <div class="product-actions">
              
              <router-link to="/" class="back-btn">
                Back to Products
              </router-link>
            </div>
          </div>
        </div>
        
       
      </div>

      <div v-else class="not-found">
        <p>Product not found</p>
        <router-link to="/" class="back-btn">Back to Home</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ProductDetail",
  props: {
    id: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      product: null,
      loading: true,
      error: null,
      currentImage: 0,
      imageError: false,
    };
  },
  computed: {
    ...mapGetters([
      "currentTheme", 
      "isFavorite",
      "allRecentlyViewed" // Add the recently viewed getter
    ]),
    productImages() {
      if (!this.product) {
        return [];
      }

      if (
        Array.isArray(this.product.images) &&
        this.product.images.length > 0
      ) {
        return this.product.images;
      } else if (this.product.image) {
        return [this.product.image];
      } else {
        return ["https://via.placeholder.com/500x500?text=No+Image"];
      }
    },
    currentImageUrl() {
      if (this.imageError || this.productImages.length === 0) {
        return "https://via.placeholder.com/500x500?text=No+Image";
      }

      return (
        this.productImages[this.currentImage] ||
        "https://via.placeholder.com/500x500?text=No+Image"
      );
    },
    categoryName() {
      if (!this.product) {
        return "Uncategorized";
      }

      if (this.product.category && typeof this.product.category === "object") {
        return this.product.category.name;
      } else if (typeof this.product.category === "string") {
        return this.product.category;
      } else {
        return "Uncategorized";
      }
    },
    recentlyViewedProducts() {
      return this.allRecentlyViewed || [];
    },
    // Filter out the current product from recently viewed list
    filteredRecentProducts() {
      if (!this.product) return [];
      return this.recentlyViewedProducts
        .filter(item => item.id !== this.product.id)
        .slice(0, 4); // Only show up to 4 recent products
    }
  },
  methods: {
    ...mapActions([
      "toggleFavorite",
      "viewProduct" // Add the viewProduct action
    ]),
    async fetchProduct() {
      this.loading = true;
      this.error = null;
      //get product id from url
      const productId = this.$route.params.id;

      try {
        const response = await fetch(
          `https://api.escuelajs.co/api/v1/products/${productId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        this.product = await response.json();
        
        // Add product to recently viewed
        if (this.product) {
          this.addToRecentlyViewed();
        }
      } catch (error) {
        this.error = error.message || "An error occurred";
      } finally {
        this.loading = false;
      }
    },
    handleImageError() {
      this.imageError = true;
    },
    addToRecentlyViewed() {
      // Make sure product has all needed properties before adding to recently viewed
      if (this.product && this.product.id) {
        this.viewProduct(this.product);
      }
    }
  },
  created() {
    this.fetchProduct();
  },
  watch: {
    id() {
      this.currentImage = 0;
      this.imageError = false;
      this.fetchProduct();
    },
  },
};
</script>

<style scoped>
.product {
  padding: 2rem 0;
  min-height: calc(100vh - 70px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.loading-container,
.error-container,
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
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

.retry-btn,
.back-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  margin-top: 1rem;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s ease;
  cursor: pointer;
  border: none;
}

.product-container {
  border-radius: 12px;
  overflow: hidden;
}

.product-header {
  padding: 1.5rem;
  border-bottom: 1px solid;
}

.product-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.product-category {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-label {
  font-weight: 600;
}

.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 1.5rem;
}

.product-gallery {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image {
  border-radius: 8px;
  overflow: hidden;
  height: 400px;
}

.product-main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-thumbnails {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem 0;
}

.thumbnail {
  width: 70px;
  height: 70px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.thumbnail:hover {
  transform: translateY(-3px);
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.price-rating {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 2rem;
  font-weight: 700;
}

/* Light Theme */
.light {
  background-color: #f8f9fa;
  color: #212529;
}

.light .loading-spinner {
  border-top-color: #28a745;
}

.light .retry-btn,
.light .back-btn {
  background-color: #28a745;
  color: white;
}

.light .retry-btn:hover,
.light .back-btn:hover {
  background-color: #218838;
}

.light .product-container {
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.light .product-header {
  border-bottom-color: #e9ecef;
}

.light .category-value {
  color: #28a745;
}

.light .thumbnail {
  border: 2px solid #e9ecef;
}

.light .thumbnail.active {
  border-color: #28a745;
}

.light .product-price {
  color: #28a745;
}


/* Dark Theme */
.dark {
  background-color: #121212;
  color: #e9ecef;
}

.dark .loading-spinner {
  border-top-color: #51cf66;
}

.dark .retry-btn,
.dark .back-btn {
  background-color: #51cf66;
  color: #121212;
}

.dark .retry-btn:hover,
.dark .back-btn:hover {
  background-color: #69db7c;
}

.dark .product-container {
  background-color: #1e1e1e;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.dark .product-header {
  border-bottom-color: #2d2d2d;
}

.dark .category-value {
  color: #51cf66;
}

.dark .thumbnail {
  border: 2px solid #2d2d2d;
}

.dark .thumbnail.active {
  border-color: #51cf66;
}

.dark .product-price {
  color: #51cf66;
}

.dark .favorite-btn {
  background-color: #51cf66;
  color: #121212;
}

.dark .favorite-btn:hover {
  background-color: #69db7c;
}

.dark .favorite-btn.remove {
  background-color: #f06674;
}

.dark .favorite-btn.remove:hover {
  background-color: #f38695;
}

@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;
  }

  .main-image {
    height: 300px;
  }
}
</style>
