import { all, takeLatest } from 'redux-saga/effects'

import sagaHelper from '@/utils/saga-helper'
import { TYPES } from '@/store/actions'
import { fetchEmployees, searchEmployees, fetchProjectsByEmployeeId,
  deleteEmployeeFromProject, updateEmployee, fetchRoles, importEmployees, createEmployee } from '@/api/employee'

export default function* watcher() {
  yield all([
    takeLatest(TYPES.FETCH_EMPLOYEES, sagaHelper({
      api: fetchEmployees
    })),
    takeLatest(TYPES.SEARCH_EMPLOYEES, sagaHelper({
      api: searchEmployees
    })),
    takeLatest(TYPES.FETCH_PROJECTS_BY_EMPLOYEE_ID, sagaHelper({
      api: fetchProjectsByEmployeeId, 
    })),
    takeLatest(TYPES.DELETE_EMPLOYEE_FROM_PROJECT, sagaHelper({
      api: deleteEmployeeFromProject, errorMessage: 'Delete employee from project failed!'
    })),
    takeLatest(TYPES.UPDATE_EMPLOYEE, sagaHelper({
      api: updateEmployee, errorMessage: 'Update employee failed!'
    })),
    takeLatest(TYPES.FETCH_ROLES, sagaHelper({
      api: fetchRoles
    })),
    takeLatest(TYPES.IMPORT_EMPLOYEES, sagaHelper({
      api: importEmployees,  errorMessage: 'Import employees failed!'
    })),
    takeLatest(TYPES.CREATE_EMPLOYEE, sagaHelper({
      api: createEmployee,  errorMessage: 'Create employee failed!'
    }))
  ])
}
