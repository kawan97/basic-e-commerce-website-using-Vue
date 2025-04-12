<!-- CategoryList.vue -->
<template>
  <div class="categories-sidebar">
    <h2 class="sidebar-title">Categories</h2>
    <ul class="categories-list">
      <li
        class="category-item"
        :class="{ active: selectedCategory === 0 }"
        @click="$emit('select-category', 0)"
      >
        <span class="category-icon">🛒</span>
        <span class="category-name">All Products</span>
      </li>
      <li
        v-for="category in categories"
        :key="category.id"
        class="category-item"
        :class="{ active: selectedCategory === category.id }"
        @click="$emit('select-category', category.id)"
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
</template>

<script>
export default {
  name: "CategoryList",
  props: {
    categories: {
      type: Array,
      required: true
    },
    selectedCategory: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style scoped>
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

/* Light Theme */
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

/* Dark Theme */
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

/* Responsive styles */
@media (min-width: 768px) {
  .categories-sidebar {
    width: 250px;
    flex-shrink: 0;
    border-radius: 0;
    height: auto;
  }
}
</style>