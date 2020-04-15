import { TYPES } from '@/store/actions'

const INIT_STATE = {
  report: { items: [], total: 0 },
  reports: []

}

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case TYPES.FETCH_REPORTS_REQUEST:
      return {
        ...state,
        submitting: action.type
      }

    case TYPES.FETCH_REPORTS_SUCCESS:
      return {
        ...state,
        submitting: null,
        report: { items: action.data.content, total: action.data.total }
      }

    case TYPES.FETCH_REPORTS_FAILURE:
      return {
        ...state,
        submitting: null,
        error: action.error
      }

    // Search report
    case TYPES.SEARCH_REPORTS_REQUEST:
      return {
        ...state,
        submitting: action.type
      }
    case TYPES.SEARCH_REPORTS_SUCCESS:
      return {
        ...state,
        submitting: null,
        report: { items: action.data.content, total: action.data.total }
      }
    case TYPES.SEARCH_REPORTS_FAILURE:
      return {
        ...state,
        submitting: null,
        error: action.error
      }

    default:
      return { ...state }
  }
}
