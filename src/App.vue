<template>
  <div id="app-root">
    <AppHeader />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
</script>

<style>
@import './styles/global.css';
</style>
