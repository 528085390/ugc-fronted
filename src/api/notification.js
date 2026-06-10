import request from './request'

export function listNotifications(userId) {
  return request.get('/notifications', { params: { userId } })
}

export function systemNotify(data) {
  return request.post('/notifications/system', data)
}
