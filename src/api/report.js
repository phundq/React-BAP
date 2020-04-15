import { MainApi } from './endpoint'

export function fetchReports(payload) {
  const { page, size } = payload
  return MainApi.get(`/reports?page=${page}&size=${size}`)
}
export function searchReports(payload) {
  return MainApi.get(`/reports/search/${payload}`)
}