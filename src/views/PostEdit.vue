<template>
  <div class="container" style="padding-top: 24px; max-width: 700px;">
    <div class="card">
      <h1 class="page-title">编辑帖子</h1>
      <div class="loading" v-if="loading">加载中...</div>
      <div class="error-msg" v-else-if="error">{{ error }}</div>
      <form v-else @submit.prevent="handleUpdate">
        <div class="form-group">
          <label>板块</label>
          <select v-model.number="form.sectionId" class="form-input" required>
            <option value="" disabled>请选择板块</option>
            <option v-for="s in sections" :key="s.id" :value="s.id">{{ s.name || s.title }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>标题</label>
          <input v-model="form.title" class="form-input" required />
        </div>
        <div class="form-group">
          <label>内容</label>
          <textarea v-model="form.content" class="form-input" rows="10" required></textarea>
        </div>
        <button class="btn btn-primary" :disabled="submitting">
          {{ submitting ? '保存中...' : '保存' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPost, updatePost } from '../api/post.js'
import { listSections } from '../api/section.js'

const route = useRoute()
const router = useRouter()
const sections = ref([])
const form = ref({ sectionId: 0, authorId: 0, title: '', content: '' })
const loading = ref(true)
const error = ref('')
const submitting = ref(false)

onMounted(async () => {
  try {
    const [postRes, secRes] = await Promise.all([
      getPost(route.params.id),
      listSections(),
    ])
    const p = postRes.data
    form.value = { sectionId: p.sectionId, authorId: p.authorId, title: p.title, content: p.content }
    sections.value = secRes.data || []
  } catch (e) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
})

async function handleUpdate() {
  error.value = ''
  submitting.value = true
  try {
    await updatePost(route.params.id, form.value)
    router.push(`/posts/${route.params.id}`)
  } catch (e) {
    error.value = e.message || '保存失败'
  } finally {
    submitting.value = false
  }
}
</script>
