# basic-e-commerce

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

## Overview


This implementation enhances the e-commerce with several key features:

1. **Category-Based Navigation**: The homepage now automatically selects the first category when loaded, removing the "All Products" option to create a more focused shopping experience.

2. **Product Sorting**: Added sorting functionality that allows users to sort products by price (low to high or high to low), implemented through a dropdown menu.

3. **Limited Products Per Category**: Each category now displays a maximum of 9 products, creating a cleaner interface and faster loading times.

4. **Frontend Pagination**: It's important to note that the pagination is handled entirely on the frontend side, not through backend API calls. The application fetches all products initially and then filters/limits them in the browser.

5. **Custom CSS Instead of Tailwind**: The implementation uses custom CSS rather than Tailwind CSS because Tailwind wasn't included in the assignment requirements. If Tailwind had been used, it would have resulted in more efficient styling with less code and potentially better responsive design.

## Features

- Responsive design for mobile and desktop
- Light and dark theme support
- Product filtering by category
- Product search functionality
- Recently viewed products section
- Favorites management
- Price-based sorting options

## Note:
 AI is used in certain parts of this project to handle specific tasks .
