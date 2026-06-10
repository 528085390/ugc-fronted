<template>
  <div class="container" style="padding-top: 24px; max-width: 500px;">
    <div class="card">
      <h1 class="page-title">编辑资料</h1>
      <div class="error-msg" v-if="error">{{ error }}</div>
      <div class="success-msg" v-if="success">{{ success }}</div>
      <form @submit.prevent="handleUpdate">
        <div class="form-group">
          <label>昵称</label>
          <input v-model="form.displayName" class="form-input" />
        </div>
        <div class="form-group">
          <label>头像 URL</label>
          <input v-model="form.avatar" class="form-input" placeholder="https://..." />
        </div>
        <div class="form-group">
          <label>简介</label>
          <textarea v-model="form.bio" class="form-input" rows="3"></textarea>
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
import { getProfile, updateProfile } from '../api/user.js'

const route = useRoute()
const router = useRouter()
const form = ref({ displayName: '', avatar: '', bio: '' })
const error = ref('')
const success = ref('')
const submitting = ref(false)

onMounted(async () => {
  try {
    const res = await getProfile(route.params.id)
    const p = res.data || {}
    form.value = { displayName: p.displayName || '', avatar: p.avatar || '', bio: p.bio || '' }
  } catch (e) {
    console.error(e)
  }
})

async function handleUpdate() {
  error.value = ''
  success.value = ''
  submitting.value = true
  try {
    const body = {}
    if (form.value.displayName) body.displayName = form.value.displayName
    if (form.value.avatar) body.avatar = form.value.avatar
    if (form.value.bio) body.bio = form.value.bio
    await updateProfile(route.params.id, body)
    success.value = '保存成功！即将跳转...'
    setTimeout(() => router.push(`/users/${route.params.id}`), 1000)
  } catch (e) {
    error.value = e.message || '保存失败'
  } finally {
    submitting.value = false
  }
}
</script>
