<template>
  <div class="container" style="padding-top: 24px;">
    <h1 class="page-title">版块列表</h1>
    <div class="loading" v-if="loading">加载中...</div>
    <div class="empty-state" v-else-if="!sections.length">暂无版块</div>
    <div class="section-grid" v-else>
      <router-link
        v-for="s in sections"
        :key="s.id"
        :to="`/sections/${s.id}`"
        class="card section-card"
      >
        <h3 class="section-title">{{ s.name || s.title }}</h3>
        <p class="section-desc">{{ s.description || '暂无描述' }}</p>
        <div class="section-meta meta"></div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { listSections } from '../api/section.js'

const sections = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await listSections()
    sections.value = res.data || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.section-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.section-card {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: transform 0.15s, box-shadow 0.15s;
}

.section-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  text-decoration: none;
}

.section-title {
  font-size: 17px;
  margin-bottom: 6px;
  color: #1a73e8;
}

.section-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.section-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
