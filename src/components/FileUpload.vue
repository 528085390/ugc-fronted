<template>
  <div class="file-upload">
    <div class="upload-area" @click="triggerInput" @dragover.prevent @drop.prevent="handleDrop">
      <p v-if="!preview">点击或拖拽文件到此处上传</p>
      <img v-else :src="preview" class="preview-img" />
    </div>
    <input ref="fileInput" type="file" hidden @change="handleFile" />
    <div class="upload-info" v-if="file">
      <span>{{ file.name }} ({{ (file.size / 1024).toFixed(1) }} KB)</span>
      <button class="btn btn-primary btn-sm" @click="$emit('upload', file)" :disabled="uploading">
        {{ uploading ? '上传中...' : '上传' }}
      </button>
    </div>
    <div class="error-msg" v-if="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['upload'])
const file = ref(null)
const preview = ref('')
const error = ref('')
const uploading = ref(false)
const fileInput = ref(null)

function triggerInput() {
  fileInput.value?.click()
}

function handleDrop(e) {
  const f = e.dataTransfer.files[0]
  if (f) setFile(f)
}

function handleFile(e) {
  const f = e.target.files[0]
  if (f) setFile(f)
}

function setFile(f) {
  error.value = ''
  if (f.size > 5 * 1024 * 1024) {
    error.value = '文件不能超过 5MB'
    return
  }
  file.value = f
  if (f.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => { preview.value = e.target.result }
    reader.readAsDataURL(f)
  } else {
    preview.value = ''
  }
}

</script>

<style scoped>
.upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  color: #999;
  transition: border-color 0.2s;
}

.upload-area:hover {
  border-color: #1a73e8;
}

.preview-img {
  max-height: 200px;
  max-width: 100%;
  border-radius: 4px;
}

.upload-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 13px;
  color: #666;
}
</style>
