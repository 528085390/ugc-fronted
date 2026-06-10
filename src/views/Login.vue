<template>
  <div class="container" style="padding-top: 60px; max-width: 400px;">
    <div class="card">
      <h1 class="page-title" style="text-align:center;">登录</h1>
      <div class="error-msg" v-if="error">{{ error }}</div>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>用户名</label>
          <input v-model="form.username" class="form-input" required />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input v-model="form.password" type="password" class="form-input" required />
        </div>
        <button class="btn btn-primary" style="width:100%;justify-content:center;" :disabled="submitting">
          {{ submitting ? '登录中...' : '登录' }}
        </button>
      </form>
      <p style="margin-top:12px;text-align:center;font-size:14px;color:#999;">
        还没有账号？<router-link to="/register">立即注册</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../api/auth.js'

const router = useRouter()
const form = ref({ username: '', password: '' })
const error = ref('')
const submitting = ref(false)

async function handleLogin() {
  error.value = ''
  submitting.value = true
  try {
    const res = await login(form.value)
    localStorage.setItem('token', res.data.token)
    router.push('/')
  } catch (e) {
    error.value = e.message || '登录失败'
  } finally {
    submitting.value = false
  }
}
</script>
