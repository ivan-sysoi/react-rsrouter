import { Saga, Task, SagaIterator } from 'redux-saga'
import { fork, call, cancel, put, select } from 'redux-saga/effects'

import { IRoutesCollection } from '../../utils'
import { setMatch } from '../actions'
import { getMatch } from '../selectors'
import { Match } from '../../.'

export type ApplyMatchSaga = ({ match }: { match: Match }) => SagaIterator

export default ({ routes, ssr }: { ssr: boolean; routes: IRoutesCollection }): ApplyMatchSaga => {
  const runTasks: Task[] = []
  return function* applyMatch({ match }) {
    const prevMatch = yield select(getMatch)
    yield cancel(runTasks)
    runTasks.splice(0)
    yield put(setMatch(match))
    for (const routeSchema of routes.getRouteSchemas(match.path)) {
      if ('onEnter' in routeSchema) {
        const onEnter = routeSchema.onEnter as Saga
        if (ssr) {
          yield call(onEnter, { ssr, prevMatch })
        } else {
          runTasks.push(yield fork(onEnter, { ssr, prevMatch }))
        }
      }
    }
  }
}
