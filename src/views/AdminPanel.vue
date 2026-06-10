<template>
  <div class="container" style="padding-top: 24px;">
    <h1 class="page-title">管理面板</h1>
    <div class="admin-grid">
      <div class="card">
        <h3>权限管理</h3>
        <div class="form-group">
          <label>角色列表</label>
          <div class="meta" v-if="rolesLoading">加载中...</div>
          <div v-else-if="roles.length">
            <span v-for="r in roles" :key="r" class="badge badge-blue" style="margin:2px;">{{ r }}</span>
          </div>
          <div v-else class="meta">暂无角色</div>
        </div>
        <div class="form-group">
          <label>检查权限</label>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <input v-model="permRole" class="form-input" placeholder="角色 (如 ROLE_USER)" style="flex:1;" />
            <input v-model="permAction" class="form-input" placeholder="操作 (如 write)" style="flex:1;" />
            <button class="btn btn-primary btn-sm" @click="handleCheck">检查</button>
          </div>
          <div v-if="permResult !== null" class="meta" style="margin-top:4px;">
            结果: <strong>{{ permResult }}</strong>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>健康检查</h3>
        <button class="btn btn-outline btn-sm" @click="handleHealth">检查服务状态</button>
        <div v-if="healthResult !== null" class="meta" style="margin-top:8px;">
          服务状态: <strong>{{ healthResult }}</strong>
        </div>
      </div>

      <div class="card">
        <h3>文件管理</h3>
        <div class="form-group">
          <label>文件ID</label>
          <div style="display:flex;gap:8px;">
            <input v-model.number="fileId" type="number" class="form-input" placeholder="输入文件ID" />
            <button class="btn btn-outline btn-sm" @click="handleGetFile">查询</button>
            <button class="btn btn-danger btn-sm" @click="handleDeleteFile">删除</button>
          </div>
        </div>
        <div v-if="fileMeta" class="file-meta">
          <pre>{{ JSON.stringify(fileMeta, null, 2) }}</pre>
        </div>
      </div>

      <div class="card">
        <h3>发系统通知</h3>
        <div class="form-group">
          <label>用户ID</label>
          <input v-model.number="notiForm.userId" type="number" class="form-input" />
        </div>
        <div class="form-group">
          <label>类型</label>
          <input v-model="notiForm.type" class="form-input" placeholder="如: SYSTEM" />
        </div>
        <div class="form-group">
          <label>内容</label>
          <textarea v-model="notiForm.payload" class="form-input" rows="3"></textarea>
        </div>
        <button class="btn btn-primary btn-sm" @click="handleNotify">发送通知</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getRoles, checkPermission } from '../api/permission.js'
import { health } from '../api/auth.js'
import { getFile, deleteFile } from '../api/file.js'
import { systemNotify } from '../api/notification.js'

const roles = ref([])
const rolesLoading = ref(false)
const permRole = ref('')
const permAction = ref('')
const permResult = ref(null)
const healthResult = ref(null)
const fileId = ref('')
const fileMeta = ref(null)
const notiForm = ref({ userId: '', type: 'SYSTEM', payload: '' })

async function init() {
  rolesLoading.value = true
  try {
    const res = await getRoles()
    roles.value = res.data || []
  } catch (e) {
    console.error(e)
  } finally {
    rolesLoading.value = false
  }
}

init()

async function handleCheck() {
  if (!permRole.value || !permAction.value) return
  try {
    const res = await checkPermission(permRole.value, permAction.value)
    permResult.value = res.data
  } catch (e) {
    permResult.value = 'error: ' + e.message
  }
}

async function handleHealth() {
  try {
    const res = await health()
    healthResult.value = res.data
  } catch (e) {
    healthResult.value = 'unreachable'
  }
}

async function handleGetFile() {
  if (!fileId.value) return
  try {
    const res = await getFile(fileId.value)
    fileMeta.value = res.data
  } catch (e) {
    fileMeta.value = { error: e.message }
  }
}

async function handleDeleteFile() {
  if (!fileId.value || !confirm('确认删除文件？')) return
  try {
    await deleteFile(fileId.value)
    fileMeta.value = null
    alert('删除成功')
  } catch (e) {
    alert(e.message)
  }
}

async function handleNotify() {
  try {
    await systemNotify(notiForm.value)
    alert('通知已发送')
    notiForm.value = { userId: '', type: 'SYSTEM', payload: '' }
  } catch (e) {
    alert(e.message)
  }
}
</script>

<style scoped>
.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 16px;
}

.file-meta pre {
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
  margin-top: 8px;
}
</style>
