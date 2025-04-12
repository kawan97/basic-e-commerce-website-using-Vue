<!-- Pagination.vue -->
<template>
  <div class="pagination-controls">
    <button
      class="pagination-btn"
      :disabled="currentPage === 1"
      @click="$emit('change-page', currentPage - 1)"
    >
      Previous
    </button>

    <button
      v-for="page in totalPages"
      :key="page"
      class="pagination-btn"
      :class="{ active: currentPage === page }"
      @click="$emit('change-page', page)"
    >
      {{ page }}
    </button>

    <button
      class="pagination-btn"
      :disabled="currentPage === totalPages"
      @click="$emit('change-page', currentPage + 1)"
    >
      Next
    </button>
  </div>
</template>

<script>
export default {
  name: "CategoryPagination",
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  }
};
</script>

<style scoped>
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

/* Dark Theme */
.dark .pagination-btn {
  background-color: #424242;
  color: #e0e0e0;
}

.dark .pagination-btn:hover {
  background-color: rgba(129, 199, 132, 0.2);
}

.dark .pagination-btn.active {
  background-color: #81c784;
  color: #121212;
}

.dark .pagination-btn:disabled {
  background-color: #333;
  color: #757575;
}
</style>