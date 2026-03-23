<template>
  <div class="app" :class="{ dark: isDark }">
    <div class="header">
      <router-link to="/" class="logo">Dev Tool Box</router-link>
      <nav class="nav-links">
        <router-link to="/" exact-active-class="active">Tools</router-link>
        <router-link to="/about" active-class="active">About</router-link>
        <router-link to="/privacy" active-class="active">Privacy</router-link>
        <button class="theme-btn" @click="toggleTheme">
          {{ isDark ? 'Light Mode' : 'Dark Mode' }}
        </button>
      </nav>
    </div>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isDark = ref(false)
const toggleTheme = () => {
  isDark.value = !isDark.value
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 15px;
  font-family: 'Arial', sans-serif;
  background: #ffffff;
  color: #2c3e50;
  transition: background 0.3s, color 0.3s;
}

.app.dark {
  background: #1a1a1a;
  color: #f8f8f8;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  height: 60px;
  padding: 0 15px;
  flex-shrink: 0;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}
.app.dark .logo {
  color: #f8f8f8;
}
.logo:hover {
  opacity: 0.9;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-links a {
  color: #2c3e50;
  text-decoration: none;
  font-size: 0.95rem;
}
.app.dark .nav-links a {
  color: #f8f8f8;
}
.nav-links a:hover {
  text-decoration: underline;
}
.nav-links a.active {
  font-weight: bold;
  color: #3498db;
}

.theme-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #ecf0f1;
  cursor: pointer;
  font-size: 0.9rem;
  color: #2c3e50;
}
.app.dark .theme-btn {
  background: #333;
  color: #f8f8f8;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: auto;
}
</style>
