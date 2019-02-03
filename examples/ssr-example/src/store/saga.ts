import * as reduxSaga from 'redux-saga'
import { fork, put, call } from 'redux-saga/effects'
import { createRouterSaga } from 'react-rsrouter'

import { RootStore } from 'store'
import { routes } from 'client/App'

export default (store: RootStore, serverLocation?: Location) =>
  function* saga() {
    if (serverLocation) {
      yield call(createRouterSaga({ routes, serverLocation, store }))
      yield put(reduxSaga.END)
    } else {
      yield fork(createRouterSaga({ routes, store }))
    }
  }
