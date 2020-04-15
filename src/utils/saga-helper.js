import { push } from 'connected-react-router'
import { put, select } from 'redux-saga/effects'

import Storage from '@/utils/storage'
import Misc from '@/utils/misc'
import Notification from '@/components/notification'
import { actions } from '@/store/actions'

export default function sagaHelper({ api, successMessage, errorMessage, errorHandler }) {
  return function* ({ type, data, callback }) {
    const requestType = `${type}_REQUEST`
    const successType = `${type}_SUCCESS`
    const failureType = `${type}_FAILURE`

    try {
      yield put({ type: requestType, payload: data })

      const { data: result } = yield api(data)

      yield put({ type: successType, data: result, payload: data })

      if (successMessage) Notification.success(successMessage)

      if (callback) callback(true, result)
    } catch (e) {
      const error = yield Misc.getErrorJsonBody(e)
      yield put({ type: failureType, error })

      const localize = yield select((state) => state.localize)
      const languageIndex = localize.languages[0].active ? 0 : 1
      const getLocalizeErrorMessages = (name) => (localize.translations[`error-messages.${name}`] || [])[languageIndex]

      if (['TOKEN_EXPIRED'].includes(error.message)) {
        Storage.clear()
        yield put(push('/login'))
        yield put(actions.clearStore())
      }
      if (error.code === 401) {
        Storage.clear()
        yield put(push('/login'))
        yield put(actions.clearStore())
      }

      if(errorMessage) {
        Notification.error(errorMessage)
      }
      else if (errorHandler) {
        errorHandler(error, getLocalizeErrorMessages)
      } else {
        Notification.error(getLocalizeErrorMessages(error.message) || error.message)
      }

      if (callback) callback(false, error)
    }
  }
}
