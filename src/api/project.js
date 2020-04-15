import { MainApi } from './endpoint'

export async function fetchProjects(payload) {
  const { page, size } = payload
  return MainApi.get(`/projects?page=${page}&size=${size}`)
}
export function searchProjects(payload) {
  return MainApi.post('/projects/search', payload)
}
export function fetchProjectsDetail(id) {
  // console.log(id);
  return MainApi.get(`/projects/${id}`)
}
export function createProject(payload) {
  return MainApi.post('/projects', payload)
}
export function updateProject(payload) {
  const { id, ...data } = payload
  return MainApi.put(`/projects/${id}`, data)
}
export function deleteEmployeeFromProject(payload) {
  // console.log(payload);
  return MainApi.put('/projects/deleteMember', payload)
}
export function deleteProject(id) {
  return MainApi.delete(`/projects/${id}`)
}
export function changeStatusProject(id) {
  return MainApi.put(`/projects/changeStatus/${id}`)
}
export function fetchRoles() {
  return MainApi.get('/admin/roles/')
}

