import request from './request'

export function createPost(data) {
  return request.post('/posts', data)
}

export function getPost(id) {
  return request.get(`/posts/${id}`)
}

export function updatePost(id, data) {
  return request.put(`/posts/${id}`, data)
}

export function deletePost(id) {
  return request.delete(`/posts/${id}`)
}

export function pinPost(id, value) {
  return request.post(`/posts/${id}/pin`, null, { params: { value } })
}

export function featurePost(id, value) {
  return request.post(`/posts/${id}/feature`, null, { params: { value } })
}

export function existsPost(id) {
  return request.get(`/posts/${id}/exists`)
}

export function metaPost(id) {
  return request.get(`/posts/${id}/meta`)
}

export function listPostsBySection(sectionId) {
  return request.get(`/posts/section/${sectionId}`)
}

export function internalSearch(q) {
  return request.get('/posts/internal/search', { params: { q } })
}

export function internalSuggest(q) {
  return request.get('/posts/internal/suggest', { params: { q } })
}
