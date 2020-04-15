import { all } from 'redux-saga/effects'

import account from './account'
import role from './role'
import project from './project'
import employee from './employee'
import report from './report'

export default function* sagas() {
  yield all([
    account(),
    role(),
    project(),
    employee(),
    report()
  ])
}
