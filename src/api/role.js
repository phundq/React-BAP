import { MainApi } from './endpoint'

export function fetchRoles() {
  return MainApi.get('/admin/roles/')
}

export function fetchStatusRoleCurrent(payload) {
  return MainApi.get(`/admin/roles/${payload}`)
}

export function updateRole(payload) {
  return MainApi.put('/admin/rolepermissions/', payload)
}
