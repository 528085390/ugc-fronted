<template>
  <div class="container" style="padding-top: 24px; max-width: 600px;">
    <h1 class="page-title">通知</h1>
    <div class="loading" v-if="loading">加载中...</div>
    <div class="empty-state" v-else-if="!notifications.length">暂无通知</div>
    <div class="notification-list" v-else>
      <div v-for="n in notifications" :key="n.id" class="card notification-item" :class="{ unread: !n.read }">
        <div class="noti-header">
          <span class="badge" :class="n.read ? 'badge-blue' : 'badge-red'">{{ n.read ? '已读' : '未读' }}</span>
          <span class="meta">{{ n.type }}</span>
        </div>
        <p class="noti-content">{{ n.payload }}</p>
        <div class="noti-meta meta">
          <span v-if="n.createdAt">{{ formatTime(n.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { listNotifications } from '../api/notification.js'

const notifications = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const userId = localStorage.getItem('userId')
    const res = await listNotifications(userId || undefined)
    notifications.value = res.data || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

function formatTime(t) {
  if (!t) return ''
  if (typeof t === 'string') return t.substring(0, 19).replace('T', ' ')
  return ''
}
</script>

<style scoped>
.notification-item.unread {
  border-left: 3px solid #1a73e8;
}

.noti-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.noti-content {
  font-size: 14px;
  margin-bottom: 4px;
  word-break: break-all;
}

.noti-meta {
  font-size: 12px;
}
</style>
