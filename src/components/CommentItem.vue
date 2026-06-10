<template>
  <div class="comment" :style="{ marginLeft: depth * 24 + 'px' }">
    <div class="comment-body">
      <div class="comment-meta meta">
        <span>作者: <router-link :to="`/users/${comment.authorId}`">#{{ comment.authorId }}</router-link></span>
        <span>{{ formatTime(comment.createdAt) }}</span>
        <span v-if="comment.deleted" class="badge badge-red">已删除</span>
      </div>
      <p class="comment-content" v-if="!comment.deleted">{{ comment.content }}</p>
      <p class="comment-content deleted" v-else>[该评论已被删除]</p>
      <div class="comment-actions" v-if="showActions && !comment.deleted">
        <button class="btn btn-outline btn-sm" @click="$emit('reply', comment)">回复</button>
        <button class="btn btn-danger btn-sm" @click="$emit('delete', comment.id)" v-if="canDelete">删除</button>
      </div>
    </div>
    <div v-if="children && children.length" class="comment-children">
      <CommentItem
        v-for="child in children"
        :key="child.id"
        :comment="child"
        :depth="depth + 1"
        :children="child.children"
        :showActions="showActions"
        :canDelete="canDelete"
        @reply="(c) => $emit('reply', c)"
        @delete="(id) => $emit('delete', id)"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  comment: { type: Object, required: true },
  depth: { type: Number, default: 0 },
  children: { type: Array, default: () => [] },
  showActions: { type: Boolean, default: true },
  canDelete: { type: Boolean, default: false },
})

defineEmits(['reply', 'delete'])

function formatTime(t) {
  if (!t) return ''
  if (typeof t === 'string') return t.substring(0, 19).replace('T', ' ')
  return ''
}
</script>

<style scoped>
.comment {
  border-left: 2px solid #e8e8e8;
  padding-left: 12px;
  margin-bottom: 12px;
}

.comment-body {
  background: #fafafa;
  border-radius: 6px;
  padding: 10px 14px;
}

.comment-meta {
  margin-bottom: 6px;
}

.comment-content {
  font-size: 14px;
  line-height: 1.6;
  word-break: break-all;
}

.comment-content.deleted {
  color: #ccc;
  font-style: italic;
}

.comment-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.comment-children {
  margin-top: 8px;
}
</style>
