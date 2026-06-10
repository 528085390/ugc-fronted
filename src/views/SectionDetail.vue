<template>
  <div class="container" style="padding-top: 24px;">
    <div class="loading" v-if="loading">加载中...</div>
    <template v-else-if="section">
      <div class="card">
        <h1 class="page-title" style="margin-bottom:6px;">{{ section.name || section.title }}</h1>
        <p class="section-desc">{{ section.description || '暂无描述' }}</p>
        <div class="section-meta meta">
          <router-link :to="`/posts/create?sectionId=${section.id}`" class="btn btn-primary btn-sm" v-if="isLoggedIn">发帖</router-link>
        </div>
      </div>
      <div class="empty-state" v-if="!posts.length">暂无帖子</div>
      <PostCard v-for="p in posts" :key="p.id" :post="p" />
    </template>
    <div class="error-msg" v-else-if="loadError">{{ loadError }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getSection } from '../api/section.js'
import { listPostsBySection } from '../api/post.js'
import PostCard from '../components/PostCard.vue'

const route = useRoute()
const section = ref(null)
const posts = ref([])
const loading = ref(true)
const loadError = ref('')

const isLoggedIn = computed(() => !!localStorage.getItem('token'))

onMounted(async () => {
  try {
    const res = await getSection(route.params.id)
    section.value = res.data
    const postRes = await listPostsBySection(route.params.id)
    posts.value = postRes.data || []
  } catch (e) {
    loadError.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.section-desc {
  color: #666;
  margin-bottom: 8px;
}

.section-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
