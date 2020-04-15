import { all, takeLatest } from 'redux-saga/effects'
import sagaHelper from '@/utils/saga-helper'
import { TYPES } from '@/store/actions'
import { fetchProjects, searchProjects, createProject, fetchRoles, deleteProject, changeStatusProject,
  fetchProjectsDetail, updateProject, deleteEmployeeFromProject } from '@/api/project'

export default function* watcher() {
  yield all([
    takeLatest(TYPES.FETCH_PROJECTS, sagaHelper({
      api: fetchProjects
    })),
    takeLatest(TYPES.CREATE_PROJECT, sagaHelper({
      api: createProject
    })),
    takeLatest(TYPES.FETCH_ROLES, sagaHelper({
      api: fetchRoles
    })),
    takeLatest(TYPES.SEARCH_PROJECTS, sagaHelper({
      api: searchProjects
    })),
    takeLatest(TYPES.UPDATE_PROJECT, sagaHelper({
      api: updateProject
    })),
    takeLatest(TYPES.DELETE_PROJECT, sagaHelper({
      api: deleteProject
    })),
    takeLatest(TYPES.CHANGE_STATUS_PROJECT, sagaHelper({
      api: changeStatusProject
    })),
    takeLatest(TYPES.FETCH_PROJECTS_DETAIL, sagaHelper({
      api: fetchProjectsDetail
    })),
    takeLatest(TYPES.DELETE_EMPLOYEE_FROM_PROJECT, sagaHelper({
      api: deleteEmployeeFromProject
    }))
  ])
}
