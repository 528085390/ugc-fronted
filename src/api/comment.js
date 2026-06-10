import request from './request'

export function createComment(postId, data) {
  return request.post(`/posts/${postId}/comments`, data)
}

export function listComments(postId) {
  return request.get(`/posts/${postId}/comments`)
}

export function deleteComment(id) {
  return request.delete(`/comments/${id}`)
}
