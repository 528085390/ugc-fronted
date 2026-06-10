import request from './request'

export function search(q, userId) {
  return request.get('/search', { params: { q, userId } })
}

export function suggest(q) {
  return request.get('/search/suggest', { params: { q } })
}
