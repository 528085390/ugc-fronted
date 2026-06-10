<template>
  <div class="container" style="padding-top: 24px; max-width: 800px;">
    <div class="loading" v-if="loading">加载中...</div>
    <template v-else-if="post">
      <div class="card">
        <div class="post-header">
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-badges">
            <span class="badge badge-blue" v-if="post.pinned">置顶</span>
            <span class="badge badge-green" v-if="post.featured">精华</span>
          </div>
        </div>
        <div class="post-meta meta">
          <span>作者: <router-link :to="`/users/${post.authorId}`">#{{ post.authorId }}</router-link></span>
          <span>板块ID: {{ post.sectionId }}</span>
          <span>浏览: {{ post.viewCount }}</span>
          <span v-if="post.createdAt">{{ formatTime(post.createdAt) }}</span>
        </div>
        <div class="post-content">{{ post.content }}</div>
        <div class="post-actions" v-if="isLoggedIn">
          <button class="btn btn-outline btn-sm" @click="handleLike" :disabled="actionLoading">点赞</button>
          <button class="btn btn-outline btn-sm" @click="handleFavorite" :disabled="actionLoading">收藏</button>
          <router-link :to="`/posts/${post.id}/edit`" class="btn btn-outline btn-sm">编辑</router-link>
          <button class="btn btn-danger btn-sm" @click="handleDelete">删除</button>
        </div>
      </div>

      <div class="card">
        <h3 style="margin-bottom:12px;">评论 ({{ comments.length }})</h3>
        <div class="empty-state" v-if="!comments.length">暂无评论</div>
        <div v-else class="comment-list">
          <CommentItem
            v-for="c in commentTree"
            :key="c.id"
            :comment="c"
            :children="c.children || []"
            :showActions="isLoggedIn"
            :canDelete="true"
            @reply="startReply"
            @delete="handleDeleteComment"
          />
        </div>
        <div class="reply-box" v-if="isLoggedIn">
          <textarea v-model="replyContent" class="form-input" rows="3" :placeholder="replyTo ? '回复 #' + replyTo.id : '写下评论...'"></textarea>
          <div class="reply-actions">
            <button class="btn btn-primary btn-sm" @click="handleComment" :disabled="!replyContent.trim() || commentSubmitting">
              {{ commentSubmitting ? '提交中...' : '提交评论' }}
            </button>
            <button class="btn btn-outline btn-sm" v-if="replyTo" @click="cancelReply">取消回复</button>
          </div>
        </div>
      </div>
    </template>
    <div class="error-msg" v-else-if="loadError">{{ loadError }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPost, deletePost } from '../api/post.js'
import { likePost, favoritePost } from '../api/interaction.js'
import { createComment, listComments, deleteComment } from '../api/comment.js'
import CommentItem from '../components/CommentItem.vue'

const route = useRoute()
const router = useRouter()
const post = ref(null)
const comments = ref([])
const loading = ref(true)
const loadError = ref('')
const actionLoading = ref(false)
const replyContent = ref('')
const replyTo = ref(null)
const commentSubmitting = ref(false)

const isLoggedIn = computed(() => !!localStorage.getItem('token'))
const userId = computed(() => localStorage.getItem('userId'))

const commentTree = computed(() => buildTree(comments.value))

function buildTree(list) {
  const map = {}
  const roots = []
  list.forEach(c => { map[c.id] = { ...c, children: [] } })
  list.forEach(c => {
    if (c.parentId && map[c.parentId]) {
      map[c.parentId].children.push(map[c.id])
    } else {
      roots.push(map[c.id])
    }
  })
  return roots
}

onMounted(async () => {
  try {
    const [postRes, commentRes] = await Promise.all([
      getPost(route.params.id),
      listComments(route.params.id),
    ])
    post.value = postRes.data
    comments.value = commentRes.data || []
  } catch (e) {
    loadError.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
})

function formatTime(t) {
  if (!t) return ''
  if (typeof t === 'string') return t.substring(0, 19).replace('T', ' ')
  return ''
}

async function handleLike() {
  actionLoading.value = true
  try {
    await likePost(post.value.id, userId.value)
    alert('点赞成功')
  } catch (e) {
    alert(e.message)
  } finally {
    actionLoading.value = false
  }
}

async function handleFavorite() {
  actionLoading.value = true
  try {
    await favoritePost(post.value.id, userId.value)
    alert('收藏成功')
  } catch (e) {
    alert(e.message)
  } finally {
    actionLoading.value = false
  }
}

async function handleDelete() {
  if (!confirm('确认删除？')) return
  try {
    await deletePost(route.params.id)
    router.push('/')
  } catch (e) {
    alert(e.message)
  }
}

function startReply(c) {
  replyTo.value = c
  replyContent.value = ''
}

function cancelReply() {
  replyTo.value = null
  replyContent.value = ''
}

async function handleComment() {
  if (!replyContent.value.trim()) return
  commentSubmitting.value = true
  try {
    const res = await createComment(route.params.id, {
      authorId: Number(userId.value),
      parentId: replyTo.value ? replyTo.value.id : null,
      content: replyContent.value.trim(),
    })
    comments.value.push(res.data)
    replyContent.value = ''
    replyTo.value = null
  } catch (e) {
    alert(e.message)
  } finally {
    commentSubmitting.value = false
  }
}

async function handleDeleteComment(id) {
  if (!confirm('删除该评论？')) return
  try {
    await deleteComment(id)
    comments.value = comments.value.filter(c => c.id !== id)
  } catch (e) {
    alert(e.message)
  }
}
</script>

<style scoped>
.post-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.post-title {
  font-size: 22px;
}

.post-meta {
  margin-bottom: 16px;
}

.post-content {
  font-size: 15px;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-all;
  margin-bottom: 16px;
}

.post-actions {
  display: flex;
  gap: 8px;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}

.comment-list {
  margin-bottom: 20px;
}

.reply-box {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}

.reply-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
</style>
