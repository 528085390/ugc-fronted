<template>
  <div class="container" style="padding-top: 24px;">
    <h1 class="page-title">搜索: "{{ keyword }}"</h1>
    <div class="loading" v-if="loading">搜索中...</div>
    <div class="empty-state" v-else-if="!results.length && !suggestions.length">未找到相关结果</div>
    <div class="suggest-box" v-if="suggestions.length && !results.length">
      <h3 style="font-size:14px;margin-bottom:8px;">搜索建议</h3>
      <div class="suggest-list">
        <span v-for="s in suggestions" :key="s" class="suggest-item" @click="goSearch(s)">{{ s }}</span>
      </div>
    </div>
    <div v-for="r in results" :key="r.id" class="card result-item">
      <router-link :to="`/posts/${r.id}`" class="result-title">{{ r.title }}</router-link>
      <p class="result-excerpt">{{ r.content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { search, suggest } from '../api/search.js'

const route = useRoute()
const router = useRouter()
const results = ref([])
const suggestions = ref([])
const loading = ref(false)

const keyword = computed(() => route.query.q || '')

watch(keyword, (val) => {
  if (val) {
    doSearch()
    fetchSuggestions()
  } else {
    results.value = []
    suggestions.value = []
  }
}, { immediate: true })

async function doSearch() {
  if (!keyword.value) return
  loading.value = true
  try {
    const userId = localStorage.getItem('userId')
    const res = await search(keyword.value, userId || undefined)
    results.value = res.data || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function fetchSuggestions() {
  if (!keyword.value) return
  try {
    const res = await suggest(keyword.value)
    suggestions.value = res.data || []
  } catch (e) {
    suggestions.value = []
  }
}

function goSearch(q) {
  router.push({ path: '/search', query: { q } })
}
</script>

<style scoped>
.suggest-box {
  margin-bottom: 16px;
}

.suggest-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggest-item {
  background: #e8f0fe;
  color: #1a73e8;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
}

.result-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
}

.result-excerpt {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}
</style>
