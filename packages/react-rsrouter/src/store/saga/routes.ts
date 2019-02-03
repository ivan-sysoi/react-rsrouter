import { Saga, Task, SagaIterator } from 'redux-saga'
import { fork, cancel, put } from 'redux-saga/effects'

import { IRoutesCollection } from '../../utils'
import { setMatch } from '../actions'
import { Match } from '../../.'

export type applyMatchSaga = ({ match }: { match: Match }) => SagaIterator

export const createApplyMatch = ({ routes }: { routes: IRoutesCollection }): applyMatchSaga => {
  const runTasks: Task[] = []
  return function* applyMatch({ match }: { match: Match }) {
    while (runTasks.length > 0) {
      yield cancel(runTasks.pop() as Task)
    }
    yield put(setMatch(match))
    for (const route of routes.getRoutes(match.path)) {
      if ('onEnter' in route) {
        const onEnter = route.onEnter as Saga
        runTasks.push(yield fork(onEnter, { ssr: false }))
      }
    }
  }
}
