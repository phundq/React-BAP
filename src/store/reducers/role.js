import { TYPES } from '@/store/actions'

const INIT_STATE = {
  roles: [],
  statusRoleCurrent: []
}

export default (state = INIT_STATE, action) => {
  switch (action.type) {
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

    case TYPES.FETCH_STATUS_ROLE_CURRENT_REQUEST:
      return {
        ...state,
        submitting: action.type
      }

    case TYPES.FETCH_STATUS_ROLE_CURRENT_SUCCESS:
      return {
        ...state,
        submitting: null,
        statusRoleCurrent: action.data
      }

    case TYPES.FETCH_STATUS_ROLE_CURRENT_FAILURE:
      return {
        ...state,
        submitting: null,
        error: action.error
      }

    case TYPES.CHANGE_DATA_ROLE:
      if (action.data.reloadData === true) {
        return {
          ...state,
          submitting: null,
          statusRoleCurrent: []
        }
      }

      let { name, checked, checkName } = action.data
      let newStatusRole = [...state.statusRoleCurrent]
      newStatusRole = newStatusRole.map((item) => {
        if (item.resourceName === name) {
          if (checkName === 'EDIT') {
            if (checked === true) return { ...item, status: 'CAN_EDIT' }
            return { ...item, status: 'NON' }
          }
          if (checkName === 'VIEW') {
            if (checked === true) {
              return { ...item, status: 'CAN_VIEW' }
            }
            return { ...item, status: 'NON' }
          }
        }
        return item
      })
      return {
        ...state,
        submitting: null,
        statusRoleCurrent: newStatusRole
      }

    default:
      return { ...state }
  }
}
