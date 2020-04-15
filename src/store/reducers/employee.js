import { TYPES } from '@/store/actions'

const INIT_STATE = {
  employee: { items: [], total: 0 },
  projects: [],
  roles: [],
  failedEmployees: []
}

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case TYPES.FETCH_EMPLOYEES_REQUEST:
      return {
        ...state,
        submitting: action.type
      }
    case TYPES.FETCH_EMPLOYEES_SUCCESS:

      return {
        ...state,
        submitting: null,
        employee: { items: action.data.content, total: action.data.total }
      }
    case TYPES.FETCH_EMPLOYEES_FAILURE:
      return {
        ...state,
        submitting: null,
        error: action.error
      }
    case TYPES.SEARCH_EMPLOYEES_REQUEST:
      return {
        ...state,
        submitting: action.type
      }
    case TYPES.SEARCH_EMPLOYEES_SUCCESS:
      return {
        ...state,
        submitting: null,
        employee: { items: action.data.content, total: action.data.total }
      }
    case TYPES.SEARCH_EMPLOYEES_FAILURE:
      return {
        ...state,
        submitting: null,
        error: action.error
      }
    case TYPES.FETCH_PROJECTS_BY_EMPLOYEE_ID_REQUEST:
      return {
        ...state,
        submitting: action.type
      }
    case TYPES.FETCH_PROJECTS_BY_EMPLOYEE_ID_SUCCESS:
      return {
        ...state,
        submitting: null,
        projects: action.data.content
      }
    case TYPES.FETCH_PROJECTS_BY_EMPLOYEE_ID_FAILURE:
      return {
        ...state,
        submitting: null,
        error: action.error
      }
    case TYPES.DELETE_EMPLOYEE_FROM_PROJECT_REQUEST:
      return {
        ...state,
        submitting: action.type
      }
    case TYPES.DELETE_EMPLOYEE_FROM_PROJECT_SUCCESS:
      return {
        ...state,
        submitting: null,
        projects: state.projects.filter((project) => project.id !== action.payload.projectId)
      }
    case TYPES.DELETE_EMPLOYEE_FROM_PROJECT_FAILURE:
      return {
        ...state,
        submitting: null,
        error: action.error
      }
    case TYPES.UPDATE_EMPLOYEE_REQUEST:
      return {
        ...state,
        submitting: action.type
      }
    case TYPES.UPDATE_EMPLOYEE_SUCCESS:
      const { id, ...data } = action.payload
      return {
        ...state,
        submitting: null,
        employee: { ...state.employee,
          items: state.employee.items.map((employee) => (id === employee.id ? { ...employee, ...data } : employee)) }
      }
    case TYPES.UPDATE_EMPLOYEE_FAILURE:
      return {
        ...state,
        submitting: null,
        error: action.error
      }
    case TYPES.FETCH_ROLES_REQUEST:
      return {
        ...state,
        submitting: action.type
      }
    case TYPES.FETCH_ROLES_SUCCESS:
      return {
        ...state,
        submitting: null,
        roles: action.data
      }
    case TYPES.FETCH_ROLES_FAILURE:
      return {
        ...state,
        submitting: null,
        error: action.error
      }
    case TYPES.IMPORT_EMPLOYEES_REQUEST:
      return {
        ...state,
        submitting: action.type
      }
    case TYPES.IMPORT_EMPLOYEES_SUCCESS:
      return {
        ...state,
        submitting: null,
        employee: { ...state.employee, total: state.employee.total + action.data.success.length },
        failedEmployees: action.data.fails
      }
    case TYPES.IMPORT_EMPLOYEES_FAILURE:
      return {
        ...state,
        submitting: null,
        error: action.error
      }
    case TYPES.CREATE_EMPLOYEE_REQUEST:
      return {
        ...state,
        submitting: action.type
      }
    case TYPES.CREATE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        submitting: null,
        employee: { ...state.employee, total: state.employee.total + 1 }
      }
    case TYPES.CREATE_EMPLOYEE_FAILURE:
      return {
        ...state,
        submitting: null,
        error: action.error
      }
    default:
      return state
  }
}
