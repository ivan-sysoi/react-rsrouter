import * as reduxSaga from 'redux-saga'
import { fork, put, call } from 'redux-saga/effects'
import { createRouterSaga, RouterLocation } from 'react-rsrouter'

import { RootStore } from 'store'
import routes from 'client/routes'

export default (store: RootStore, serverLocation?: RouterLocation) =>
  function* saga() {
    if (serverLocation) {
      yield call(createRouterSaga({ routes, serverLocation, store }))
      yield put(reduxSaga.END)
    } else {
      yield fork(createRouterSaga({ routes, store }))
    }
  }
