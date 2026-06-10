import request from './request'

export function likePost(postId, userId) {
  return request.post(`/interactions/posts/${postId}/like`, null, { params: { userId } })
}

export function favoritePost(postId, userId) {
  return request.post(`/interactions/posts/${postId}/favorite`, null, { params: { userId } })
}

export function followUser(targetUserId, userId) {
  return request.post(`/interactions/users/${targetUserId}/follow`, null, { params: { userId } })
}

export function getFollowers(targetUserId) {
  return request.get(`/interactions/users/${targetUserId}/followers`)
}

export function getMyFollowers() {
  return request.get('/interactions/me/followers')
}
