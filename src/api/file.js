import request from './request'

export function uploadAvatar(file, ownerId) {
  const form = new FormData()
  form.append('file', file)
  return request.post('/files/avatar', form, {
    params: { ownerId },
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function uploadPostImage(postId, file, ownerId) {
  const form = new FormData()
  form.append('file', file)
  return request.post(`/files/posts/${postId}/image`, form, {
    params: { ownerId },
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function getFile(id) {
  return request.get(`/files/${id}`)
}

export function deleteFile(id) {
  return request.delete(`/files/${id}`)
}
