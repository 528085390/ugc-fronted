import request from './request'

export function getRoles() {
  return request.get('/permissions/roles')
}

export function checkPermission(role, action) {
  return request.post('/permissions/check', { role, action })
}
