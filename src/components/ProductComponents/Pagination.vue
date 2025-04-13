<!-- Pagination.vue -->
<template>
  <div class="pagination-controls">
    <button
      class="pagination-btn prev-next-btn"
      :disabled="currentPage === 1"
      @click="$emit('change-page', currentPage - 1)"
    >
      ← Previous
    </button>

    <div class="page-numbers">
      <!-- First page button -->
      <button
        v-if="showFirstButton"
        class="pagination-btn"
        :class="{ active: currentPage === 1 }"
        @click="$emit('change-page', 1)"
      >
        1
      </button>

      <!-- Ellipsis for skipped pages at start -->
      <span v-if="showFirstEllipsis" class="ellipsis">...</span>

      <!-- Page number buttons -->
      <button
        v-for="page in visiblePageNumbers"
        :key="page"
        class="pagination-btn"
        :class="{ active: currentPage === page }"
        @click="$emit('change-page', page)"
      >
        {{ page }}
      </button>

      <!-- Ellipsis for skipped pages at end -->
      <span v-if="showLastEllipsis" class="ellipsis">...</span>

      <!-- Last page button -->
      <button
        v-if="showLastButton && totalPages > 1"
        class="pagination-btn"
        :class="{ active: currentPage === totalPages }"
        @click="$emit('change-page', totalPages)"
      >
        {{ totalPages }}
      </button>
    </div>

    <button
      class="pagination-btn prev-next-btn"
      :disabled="currentPage === totalPages || totalPages === 0"
      @click="$emit('change-page', currentPage + 1)"
    >
      Next →
    </button>
  </div>
</template>

<script>
export default {
  name: "ProductListPagination",
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    maxVisibleButtons: {
      type: Number,
      default: 5
    }
  },
  computed: {
    // Calculate start and end of visible page range
    startPage() {
      const halfVisibleButtons = Math.floor(this.maxVisibleButtons / 2);
      let startPage = this.currentPage - halfVisibleButtons;
      
      if (startPage < 1) {
        startPage = 1;
      }
      
      if (startPage + this.maxVisibleButtons > this.totalPages) {
        startPage = Math.max(1, this.totalPages - this.maxVisibleButtons + 1);
      }
      
      return startPage;
    },
    
    endPage() {
      return Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages);
    },
    
    // Generates array of visible page numbers
    visiblePageNumbers() {
      const pages = [];
      for (let i = this.startPage; i <= this.endPage; i++) {
        pages.push(i);
      }
      return pages;
    },
    
    // Logic for showing ellipsis and first/last buttons
    showFirstButton() {
      return this.startPage > 1;
    },
    
    showLastButton() {
      return this.endPage < this.totalPages;
    },
    
    showFirstEllipsis() {
      return this.startPage > 2;
    },
    
    showLastEllipsis() {
      return this.endPage < this.totalPages - 1;
    }
  }
};
</script>

<style scoped>
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.pagination-btn {
  min-width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9375rem;
}

.prev-next-btn {
  padding: 0 1rem;
  min-width: 6rem;
}

.ellipsis {
  padding: 0 0.5rem;
  font-weight: 600;
}

.pagination-btn:active:not(:disabled) {
  transform: scale(0.97);
}

/* Light Theme */
:root[data-theme="light"] .pagination-btn {
  background-color: #f0f0f0;
  color: #333;
}

:root[data-theme="light"] .pagination-btn:hover:not(:disabled) {
  background-color: #e0e0e0;
}

:root[data-theme="light"] .pagination-btn.active {
  background-color: #2e7d32;
  color: white;
}

:root[data-theme="light"] .pagination-btn:disabled {
  background-color: #e0e0e0;
  color: #a0a0a0;
  cursor: not-allowed;
}

:root[data-theme="light"] .ellipsis {
  color: #666;
}

/* Dark Theme */
:root[data-theme="dark"] .pagination-btn {
  background-color: #333333;
  color: #e0e0e0;
}

:root[data-theme="dark"] .pagination-btn:hover:not(:disabled) {
  background-color: #444444;
}

:root[data-theme="dark"] .pagination-btn.active {
  background-color: #4caf50;
  color: #121212;
}

:root[data-theme="dark"] .pagination-btn:disabled {
  background-color: #2a2a2a;
  color: #666666;
  cursor: not-allowed;
}

:root[data-theme="dark"] .ellipsis {
  color: #b0b0b0;
}

@media (max-width: 480px) {
  .pagination-controls {
    gap: 0.5rem;
  }
  
  .pagination-btn {
    min-width: 2.25rem;
    height: 2.25rem;
    font-size: 0.875rem;
  }
  
  .prev-next-btn {
    padding: 0 0.75rem;
    min-width: 5rem;
  }
  
  .ellipsis {
    padding: 0 0.25rem;
  }
  
  .page-numbers {
    gap: 0.25rem;
  }
}
</style>