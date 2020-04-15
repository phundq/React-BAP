import { all, takeLatest } from 'redux-saga/effects'

import sagaHelper from '@/utils/saga-helper'
import { TYPES } from '@/store/actions'
import { fetchReports, searchReports } from '@/api/report'

export default function* watcher() {
  yield all([
    takeLatest(TYPES.FETCH_REPORTS, sagaHelper({
      api: fetchReports
    })),
    takeLatest(TYPES.SEARCH_REPORTS, sagaHelper({
      api: searchReports
    }))
  ])
}