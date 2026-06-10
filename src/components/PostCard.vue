<template>
  <div class="card post-card">
    <div class="post-header">
      <router-link :to="`/posts/${post.id}`" class="post-title">{{ post.title }}</router-link>
      <div class="post-badges">
        <span class="badge badge-blue" v-if="post.pinned">置顶</span>
        <span class="badge badge-green" v-if="post.featured">精华</span>
      </div>
    </div>
    <div class="post-meta meta">
      <span>作者: <router-link :to="`/users/${post.authorId}`">#{{ post.authorId }}</router-link></span>
      <span>浏览: {{ post.viewCount }}</span>
      <span v-if="post.createdAt">创建: {{ formatTime(post.createdAt) }}</span>
    </div>
    <p class="post-excerpt">{{ post.content?.substring(0, 200) }}</p>
  </div>
</template>

<script setup>
defineProps({ post: { type: Object, required: true } })

function formatTime(t) {
  if (!t) return ''
  if (typeof t === 'string') return t.substring(0, 19).replace('T', ' ')
  return ''
}
</script>

<style scoped>
.post-card {
  cursor: default;
}

.post-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.post-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a73e8;
}

.post-title:hover {
  text-decoration: underline;
}

.post-badges {
  display: flex;
  gap: 4px;
}

.post-meta {
  margin-bottom: 8px;
}

.post-excerpt {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}
</style>
