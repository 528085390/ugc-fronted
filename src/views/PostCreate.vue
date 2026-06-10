<template>
  <div class="container" style="padding-top: 24px; max-width: 700px;">
    <div class="card">
      <h1 class="page-title">发帖</h1>
      <div class="error-msg" v-if="error">{{ error }}</div>
      <div class="error-msg" v-if="loadError">{{ loadError }}</div>
      <form @submit.prevent="handleCreate">
        <div class="form-group">
          <label>板块</label>
          <select v-model="form.sectionId" class="form-input" required>
             <option value="" disabled>{{ sectionsLoading ? '加载中...' : '请选择板块' }}</option>
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
          {{ submitting ? '发布中...' : '发布' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { createPost } from '../api/post.js'
import { listSections } from '../api/section.js'
import { getCurrentUser } from '../api/user.js'

const router = useRouter()
const route = useRoute()
const sections = ref([])
const form = ref({ sectionId: '', title: '', content: '' })
const error = ref('')
const loadError = ref('')
const sectionsLoading = ref(true)
const submitting = ref(false)

onMounted(async () => {
  try {
    const res = await listSections()
    sections.value = res.data || []
    if (route.query.sectionId) {
      form.value.sectionId = Number(route.query.sectionId)
    }
  } catch (e) {
    loadError.value = '板块加载失败: ' + (e.message || '未知错误')
  } finally {
    sectionsLoading.value = false
  }
})

async function handleCreate() {
  error.value = ''
  submitting.value = true
  try {
    const me = await getCurrentUser()
    const payload = { ...form.value, authorId: me.data.id }
    const res = await createPost(payload)
    router.push(`/posts/${res.data.id}`)
  } catch (e) {
    error.value = e.message || '发布失败'
  } finally {
    submitting.value = false
  }
}
</script>
