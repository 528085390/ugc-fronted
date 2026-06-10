import request from './request'

export function listSections() {
  return request.get('/sections')
}

export function getSection(id) {
  return request.get(`/sections/${id}`)
}

export function createSection(data) {
  return request.post('/sections', data)
}

export function updateSection(id, data) {
  return request.put(`/sections/${id}`, data)
}

export function deleteSection(id) {
  return request.delete(`/sections/${id}`)
}
