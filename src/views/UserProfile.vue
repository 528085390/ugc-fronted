<template>
  <div class="container" style="padding-top: 24px; max-width: 600px;">
    <div class="loading" v-if="loading">加载中...</div>
    <template v-else-if="profile">
      <div class="card">
        <div class="profile-header">
          <img v-if="profile.avatar" :src="profile.avatar" class="avatar" />
          <div class="avatar-placeholder" v-else>{{ profile.displayName?.[0] || '?' }}</div>
          <div>
            <h1 class="page-title" style="margin-bottom:4px;">{{ profile.displayName || '用户' + profile.id }}</h1>
            <p class="meta">ID: {{ profile.id }}</p>
          </div>
        </div>
        <p class="profile-bio" v-if="profile.bio">{{ profile.bio }}</p>
        <p class="meta" v-else style="margin-bottom:12px;">暂无简介</p>
        <div class="profile-actions" v-if="isOwner">
          <router-link :to="`/users/${profile.id}/edit`" class="btn btn-primary">编辑资料</router-link>
        </div>
        <button class="btn btn-outline" @click="handleFollow" :disabled="actionLoading" v-if="!isOwner">关注</button>
      </div>
      <div class="card">
        <h3 style="margin-bottom:8px;">粉丝</h3>
        <div class="empty-state" v-if="!followers.length">暂无粉丝</div>
        <div class="follower-list" v-else>
          <span v-for="uid in followers" :key="uid" class="follower-item">
            <router-link :to="`/users/${uid}`">#{{ uid }}</router-link>
          </span>
        </div>
      </div>
    </template>
    <div class="error-msg" v-else-if="loadError">{{ loadError }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProfile, getCurrentUser } from '../api/user.js'
import { getFollowers, getMyFollowers, followUser } from '../api/interaction.js'

const route = useRoute()
const router = useRouter()
const profile = ref(null)
const followers = ref([])
const loading = ref(true)
const loadError = ref('')
const actionLoading = ref(false)

const isOwner = computed(() => {
  const myId = localStorage.getItem('userId')
  return myId && (route.params.id === 'me' || myId === route.params.id)
})

onMounted(async () => {
  if (!route.params.id || route.params.id === 'null') {
    loadError.value = '无效的用户ID'
    loading.value = false
    return
  }
  try {
    const uid = route.params.id === 'me' ? null : route.params.id
    const [profileRes, followerRes] = await Promise.all([
      uid ? getProfile(uid) : getCurrentUser(),
      uid ? getFollowers(uid) : getMyFollowers(),
    ])
    profile.value = profileRes.data
    if (!uid && profile.value?.id) {
      localStorage.setItem('userId', String(profile.value.id))
    }
    followers.value = followerRes.data || []
  } catch (e) {
    loadError.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
})

async function handleFollow() {
  actionLoading.value = true
  try {
    await followUser(route.params.id, localStorage.getItem('userId'))
    alert('关注成功')
  } catch (e) {
    alert(e.message)
  } finally {
    actionLoading.value = false
  }
}
</script>

<style scoped>
.profile-header {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 12px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #1a73e8;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
}

.profile-bio {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.profile-actions {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}

.follower-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.follower-item {
  background: #f0f2f5;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
}
</style>
