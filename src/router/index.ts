import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CategoriesView from "../views/CategoriesView.vue";
import ProductDetailView from "../views/Product/ProductDetailView.vue";
import ProductListingView from "../views/Product/ProductListingView.vue";
import FavoriteView from "../views/FavoriteView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/categories",
    name: "categories",
    component: CategoriesView,
  },
  {
    path: "/product/:id",
    name: "product-detail",
    component: ProductDetailView,
  },
  {
    path: "/product-listing",
    name: "product-listing",
    component: ProductListingView,
  },
  {
    path: "/favorite",
    name: "favorite",
    component: FavoriteView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
