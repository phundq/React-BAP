import objectToFormData from 'object-to-formdata'
import { MainApi } from './endpoint'

export function fetchEmployees(payload) {
  const { page, size } = payload

  return MainApi.get(`/employees?page=${page}&size=${size}`)
}

export function searchEmployees(payload) {
  return MainApi.post('/employees/search', payload)
}

export function fetchProjectsByEmployeeId(id) {
  return MainApi.get(`/projects/employees/${id}`)
}

export function updateEmployee(payload) {
  const { id, ...data } = payload

  return MainApi.put(`/employees/${id}`, data)
}

export function deleteEmployeeFromProject(payload) {
  return MainApi.put('/projects/deleteMember', payload)
}

export function fetchRoles() {
  return MainApi.get('/admin/roles/')
}

export function importEmployees(file) {
  return MainApi.post('/users/import-user', objectToFormData({ file }))
}

export function createEmployee(payload) {
  return MainApi.post('/employees', payload)
}
