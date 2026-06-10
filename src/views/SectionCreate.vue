<template>
  <div class="container" style="padding-top: 24px; max-width: 600px;">
    <div class="card">
      <h1 class="page-title">创建版块</h1>
      <div class="error-msg" v-if="error">{{ error }}</div>
      <div class="success-msg" v-if="success">{{ success }}</div>
      <form @submit.prevent="handleCreate">
        <div class="form-group">
          <label>名称</label>
          <input v-model="form.name" class="form-input" required />
        </div>
        <div class="form-group">
          <label>描述</label>
          <textarea v-model="form.description" class="form-input" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label>排序</label>
          <input v-model.number="form.sortOrder" type="number" class="form-input" />
        </div>
        <button class="btn btn-primary" :disabled="submitting">
          {{ submitting ? '创建中...' : '创建' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createSection } from '../api/section.js'

const router = useRouter()
const form = ref({ name: '', description: '', sortOrder: 0 })
const error = ref('')
const success = ref('')
const submitting = ref(false)

async function handleCreate() {
  error.value = ''
  success.value = ''
  submitting.value = true
  try {
    const payload = { ...form.value, title: form.value.name, orderIndex: form.value.sortOrder }
    const res = await createSection(payload)
    success.value = '创建成功！即将跳转...'
    setTimeout(() => router.push(`/sections/${res.data.id}`), 1000)
  } catch (e) {
    error.value = e.message || '创建失败'
  } finally {
    submitting.value = false
  }
}
</script>
