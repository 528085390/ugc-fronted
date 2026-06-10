<template>
  <div class="container" style="padding-top: 24px;">
    <h1 class="page-title">帖子列表</h1>
    <div class="loading" v-if="loading">加载中...</div>
    <div class="empty-state" v-else-if="!posts.length">暂无帖子</div>
    <PostCard v-for="p in posts" :key="p.id" :post="p" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { internalSearch } from '../api/post.js'
import PostCard from '../components/PostCard.vue'

const posts = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await internalSearch('')
    posts.value = res.data || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>
