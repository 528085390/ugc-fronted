<template>
  <header class="header">
    <div class="container header-inner">
      <router-link to="/" class="logo">技术论坛</router-link>
      <nav class="nav">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/sections/create" class="nav-link" v-if="isLoggedIn">创建版块</router-link>
        <router-link to="/posts" class="nav-link">帖子</router-link>
        <router-link to="/posts/create" class="nav-link" v-if="isLoggedIn">发帖</router-link>
        <router-link to="/admin" class="nav-link" v-if="isLoggedIn">管理</router-link>
        <div class="search-box">
          <input v-model="keyword" placeholder="搜索..." @keyup.enter="doSearch" class="search-input" />
        </div>
        <template v-if="isLoggedIn">
          <router-link to="/users/me" class="nav-link">个人中心</router-link>
          <router-link to="/notifications" class="nav-link">通知</router-link>
          <a href="#" @click.prevent="handleLogout" class="nav-link">退出</a>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link">登录</router-link>
          <router-link to="/register" class="nav-link">注册</router-link>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const keyword = ref('')

const isLoggedIn = computed(() => !!localStorage.getItem('token'))

function doSearch() {
  if (keyword.value.trim()) {
    router.push({ path: '/search', query: { q: keyword.value.trim() } })
    keyword.value = ''
  }
}

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  router.push('/login')
}
</script>

<style scoped>
.header {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  display: flex;
  align-items: center;
  height: 56px;
  gap: 24px;
}

.logo {
  font-size: 18px;
  font-weight: 700;
  color: #1a73e8;
  text-decoration: none;
}

.logo:hover {
  text-decoration: none;
}

.nav {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.nav-link {
  font-size: 14px;
  color: #555;
  text-decoration: none;
  white-space: nowrap;
}

.nav-link:hover {
  color: #1a73e8;
  text-decoration: none;
}

.search-box {
  margin-left: auto;
}

.search-input {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  width: 180px;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #1a73e8;
}
</style>
