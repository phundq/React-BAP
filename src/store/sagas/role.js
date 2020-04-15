import { all, takeLatest } from 'redux-saga/effects'

import sagaHelper from '@/utils/saga-helper'
import { TYPES } from '@/store/actions'
import { fetchRoles, fetchStatusRoleCurrent, updateRole } from '@/api/role'

export default function* watcher() {
  yield all([
    takeLatest(TYPES.FETCH_ROLES, sagaHelper({
      api: fetchRoles
    })),
    takeLatest(TYPES.FETCH_STATUS_ROLE_CURRENT, sagaHelper({
      api: fetchStatusRoleCurrent
    })),
    takeLatest(TYPES.UPDATE_ROLE, sagaHelper({
      api: updateRole
    }))
  ])
}
