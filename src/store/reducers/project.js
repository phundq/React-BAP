import { TYPES } from '@/store/actions'

const INIT_STATE = {
  project: { items: [], total: 0 },
  projects: [],
  roles: []
}

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case TYPES.FETCH_PROJECTS_REQUEST:
      return {
        ...state,
        submitting: action.type
      }
    case TYPES.FETCH_PROJECTS_SUCCESS:
      return {
        ...state,
        submitting: null,
        project: { items: action.data.content, total: action.data.total }
      }
    case TYPES.FETCH_PROJECTS_FAILURE:
      return {
        ...state,
        submitting: null,
        error: action.error
      }

    case TYPES.CREATE_PROJECT_REQUEST:
      return {
        ...state,
        submitting: action.type
      }
    case TYPES.CREATE_PROJECT_SUCCESS:
      return {
        ...state,
        submitting: null,
        project: { ...state.project, total: state.project.total + 1 }
      }
    case TYPES.CREATE_PROJECT_FAILURE:
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

    case TYPES.DELETE_PROJECT_REQUEST:
      return {
        ...state,
        submitting: action.type
      }
    case TYPES.DELETE_PROJECT_SUCCESS:
      return {
        ...state,
        submitting: null,
        project: { ...state.project, items: state.project.items.filter((project) => project.id !== action.payload.projectId) }
      }
    case TYPES.DELETE_PROJECT_FAILURE:
      return {
        ...state,
        submitting: null,
        error: action.error
      }

    case TYPES.CHANGE_STATUS_PROJECT_REQUEST:
      return {
        ...state,
        submitting: action.type
      }
    case TYPES.CHANGE_STATUS_PROJECT_SUCCESS:
      return {
        ...state,
        submitting: null,
        project: { ...state.project, items: state.project.items.filter((project) => project.id === action.payload.projectId) }
      }
    case TYPES.CHANGE_STATUS_PROJECT_FAILURE:
      return {
        ...state,
        submitting: null,
        error: action.error
      }

    case TYPES.SEARCH_PROJECTS_REQUEST:
      return {
        ...state,
        submitting: action.type
      }
    case TYPES.SEARCH_PROJECTS_SUCCESS:
      return {
        ...state,
        submitting: null,
        project: { items: action.data.content, total: action.data.total }
      }
    case TYPES.SEARCH_PROJECTS_FAILURE:
      return {
        ...state,
        submitting: null,
        error: action.error
      }


    case TYPES.FETCH_PROJECTS_DETAIL_REQUEST:
      return {
        ...state,
        submitting: action.type
      }
    case TYPES.FETCH_PROJECTS_DETAIL_SUCCESS:
      console.log(action.data)
      return {
        ...state,
        submitting: null,   
        projects: action.data.members    
      }
    case TYPES.FETCH_PROJECTS_DETAIL_FAILURE:
      return {
        ...state,
        submitting: null,
        error: action.error
      }


    case TYPES.UPDATE_PROJECT_REQUEST:
      return {
        ...state,
        submitting: action.type
      }
    case TYPES.UPDATE_PROJECT_SUCCESS:
      const { id, ...data } = action.payload
      return {
        ...state,
        submitting: null,
        projects: state.projects.map((project) => (id === project.id)? { ...project, ...data} : project)
      }
    case TYPES.UPDATE_PROJECT_FAILURE:
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
        projects: state.projects.filter((project) => project.id !== action.payload.employeeId)
      }
    case TYPES.DELETE_EMPLOYEE_FROM_PROJECT_FAILURE:
      return {
        ...state,
        submitting: null,
        error: action.error
      }


    default:
      return state
  }
}
