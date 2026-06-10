<template>
  <div class="container" style="padding-top: 60px; max-width: 400px;">
    <div class="card">
      <h1 class="page-title" style="text-align:center;">注册</h1>
      <div class="error-msg" v-if="error">{{ error }}</div>
      <div class="success-msg" v-if="success">{{ success }}</div>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>用户名</label>
          <input v-model="form.username" class="form-input" required />
        </div>
        <div class="form-group">
          <label>邮箱</label>
          <input v-model="form.email" type="email" class="form-input" required />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input v-model="form.password" type="password" class="form-input" required />
        </div>
        <button class="btn btn-primary" style="width:100%;justify-content:center;" :disabled="submitting">
          {{ submitting ? '注册中...' : '注册' }}
        </button>
      </form>
      <p style="margin-top:12px;text-align:center;font-size:14px;color:#999;">
        已有账号？<router-link to="/login">去登录</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { register } from '../api/auth.js'

const form = ref({ username: '', email: '', password: '' })
const error = ref('')
const success = ref('')
const submitting = ref(false)

async function handleRegister() {
  error.value = ''
  success.value = ''
  submitting.value = true
  try {
    await register(form.value)
    success.value = '注册成功，请登录'
    form.value = { username: '', email: '', password: '' }
  } catch (e) {
    error.value = e.message || '注册失败'
  } finally {
    submitting.value = false
  }
}
</script>
