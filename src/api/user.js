import request from './request'

export function getProfile(id) {
  return request.get(`/users/${id}`)
}

export function getCurrentUser() {
  return request.get('/users/me')
}

export function updateProfile(id, data) {
  return request.put(`/users/${id}`, data)
}
