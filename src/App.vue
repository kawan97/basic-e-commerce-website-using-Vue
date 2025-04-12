<template>
  <div :class="['app-container', currentTheme]">
    <header class="header">
      <div class="container">
        <nav class="navbar">
          <div class="navbar-brand">
            <router-link to="/" class="logo">
              <span class="logo-icon">🛒</span>
              <span class="logo-text">MyShop</span>
            </router-link>
            <button 
              class="menu-toggle" 
              @click="menuOpen = !menuOpen"
              :aria-expanded="menuOpen"
              aria-label="Toggle navigation menu"
            >
              <span class="bar"></span>
              <span class="bar"></span>
              <span class="bar"></span>
            </button>
          </div>
          
          <div class="navbar-menu" :class="{ 'is-active': menuOpen }">
            <div class="navbar-links">
              <router-link @click="closeMenu" to="/" class="nav-link">Home</router-link>
              <router-link @click="closeMenu" to="/categories" class="nav-link">Categories</router-link>
              <router-link @click="closeMenu" to="/product-listing" class="nav-link">Products</router-link>
              <router-link @click="closeMenu" to="/favorite" class="nav-link">
                <span class="icon">❤️</span>
                <span>Favorites</span>
              </router-link>
             
            </div>
            
            <button @click="toggleTheme" class="theme-toggle" :aria-label="`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`">
              <span class="theme-icon">{{ currentTheme === "light" ? "🌙" : "☀️" }}</span>
            </button>
          </div>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <router-view />
    </main>
    
    <footer class="footer">
      <div class="container">
        <p>© {{ new Date().getFullYear() }} MyShop. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      menuOpen: false
    };
  },
  computed: {
    ...mapGetters(["currentTheme"])
  },
  methods: {
    ...mapActions(["toggleTheme"]),
    closeMenu() {
      this.menuOpen = false;
    }
  },
  watch: {
    $route() {
      // Close menu when route changes
      this.menuOpen = false;
    }
  }
};
</script>

<style>
/* Base Styles & Theme Variables */
:root {
  --transition-speed: 0.3s;
}

.light {
  --body-bg: #f8f9fa;
  --body-color: #212529;
  --header-bg: #ffffff;
  --header-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  --nav-text: #495057;
  --link-color: #2e7d32;
  --link-hover-color: #1b5e20;
  --link-active-color: #1b5e20;
  --link-hover-bg: rgba(46, 125, 50, 0.1);
  --toggle-bg: #e9ecef;
  --toggle-hover: #dee2e6;
  --footer-bg: #f1f3f5;
  --footer-color: #6c757d;
  --border-color: #e9ecef;
  --menu-toggle-color: #495057;
}

.dark {
  --body-bg: #121212;
  --body-color: #e9ecef;
  --header-bg: #1e1e1e;
  --header-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  --nav-text: #adb5bd;
  --link-color: #81c784;
  --link-hover-color: #a5d6a7;
  --link-active-color: #a5d6a7;
  --link-hover-bg: rgba(129, 199, 132, 0.15);
  --toggle-bg: #2d2d2d;
  --toggle-hover: #3d3d3d;
  --footer-bg: #1e1e1e;
  --footer-color: #adb5bd;
  --border-color: #333333;
  --menu-toggle-color: #adb5bd;
}

/* Global Styles */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 16px;
  line-height: 1.5;
}

body {
  background-color: var(--body-bg);
  color: var(--body-color);
  transition: background-color var(--transition-speed) ease, 
              color var(--transition-speed) ease;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}



/* Header & Navigation */
.header {
  background-color: var(--header-bg);
  box-shadow: var(--header-shadow);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: background-color var(--transition-speed) ease,
              box-shadow var(--transition-speed) ease;
  width: 100%;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  background-color: var(--header-bg);
  transition: background-color var(--transition-speed) ease;
}

.navbar-brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: var(--header-bg);
  transition: background-color var(--transition-speed) ease;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--link-color);
  font-weight: 700;
  font-size: 1.25rem;
  transition: color var(--transition-speed) ease;
}

.logo-icon {
  margin-right: 0.5rem;
}

.menu-toggle {
margin-right:25px;
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 20;
}

.menu-toggle .bar {
  display: block;
  width: 25px;
  height: 3px;
  margin: 5px auto;
  background-color: var(--menu-toggle-color);
  transition: all 0.3s ease-in-out;
  border-radius: 3px;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar-links {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  color: var(--nav-text);
  text-decoration: none;
  border-radius: 4px;
  transition: color var(--transition-speed) ease,
              background-color var(--transition-speed) ease;
  font-weight: 500;
}

.nav-link:hover {
  color: var(--link-hover-color);
  background-color: var(--link-hover-bg);
}

.nav-link.router-link-exact-active {
  color: var(--link-active-color);
  font-weight: 600;
}

.nav-link .icon {
  margin-right: 0.25rem;
}

/* Theme Toggle */
.theme-toggle {
  background-color: var(--toggle-bg);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color var(--transition-speed) ease;
  margin-left: 0.5rem;
}

.theme-toggle:hover {
  background-color: var(--toggle-hover);
}

.theme-icon {
  font-size: 1.25rem;
}

/* Main Content */
.main-content {
  background-color: var(--body-bg);

  flex: 1;
  padding: 2rem 0;
}

/* Footer */
.footer {
  background-color: var(--footer-bg);
  color: var(--footer-color);
  padding: 1.5rem 0;
  text-align: center;
  margin-top: auto;
  transition: background-color var(--transition-speed) ease,
              color var(--transition-speed) ease;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }
  
  .menu-toggle.is-active .bar:nth-child(2) {
    opacity: 0;
  }
  
  .menu-toggle.is-active .bar:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }
  
  .menu-toggle.is-active .bar:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }

  .navbar-menu {
    position: fixed;
    top: 0;
    right: -100%;
    width: 80%;
    max-width: 300px;
    height: 100vh;
    background-color: var(--header-bg);
    flex-direction: column;
    justify-content: flex-start;
    padding: 5rem 1.5rem 2rem;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    transition: right 0.3s ease;
    z-index: 10;
    overflow-y: auto;
  }
  
  .navbar-menu.is-active {
    right: 0;
  }
  
  .navbar-links {
    flex-direction: column;
    width: 100%;
    gap: 0.75rem;
  }
  
  .nav-link {
    width: 100%;
    padding: 0.75rem;
  }
  
  .theme-toggle {
    margin-top: 1.5rem;
    margin-left: 0;
  }
}
</style>