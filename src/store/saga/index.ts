import { SagaIterator } from 'redux-saga'
import { call, take, takeLatest, select, race, put } from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'

import history, { RouterHistory } from '../../history'
import { goTo, notFound, setServerResponse, setLocation, goBack } from '../actions'
import { getMatch, getLocation, getParams } from '../selectors'
import { RootStore, stateGetter } from '../reducer'
import { RouterLocation, Match } from '../../.'
import { isNotTheSameLocations, urlToRouterLocation, locationToUrl, IRoutesCollection } from '../../utils'

import createApplyMatch, { ApplyMatchSaga } from './createApplyMatch'

type RoutesParam = { routes: IRoutesCollection }
type ApplyMatchParam = { applyMatch: ApplyMatchSaga }
type GetStateParam = { getState: stateGetter }

const getUrlFromGoToAction = (
  { routes, getState }: RoutesParam & GetStateParam,
  action: ActionType<typeof goTo>,
): string => {
  return 'url' in action.payload
    ? action.payload.url
    : routes.buildUrl(action.payload.path, action.payload.params, getState)
}

function* setFallbackMatch({ routes, applyMatch }: RoutesParam & ApplyMatchParam) {
  const match = yield select(getMatch)
  const fallbackMatch = routes.getFallbackMatch(match.path)
  yield call(applyMatch, { match: fallbackMatch })
}

function* handleNotFound(
  { routes, applyMatch }: RoutesParam & ApplyMatchParam,
  action: ActionType<typeof notFound>,
) {
  yield call(setFallbackMatch, { routes, applyMatch })
}

function handleGoBack() {
  if (history !== null) {
    (history as RouterHistory).back()
  }
}

function* handleGoTo(
  { routes, applyMatch, getState }: RoutesParam & ApplyMatchParam & GetStateParam,
  action: ActionType<typeof goTo>,
) {
  const nextLocation = urlToRouterLocation(getUrlFromGoToAction({ routes, getState }, action))

  let match
  if ('url' in action.payload) {
    match = routes.getMatch(nextLocation, getState)
  } else {
    match = { path: action.payload.path, params: action.payload.params }
  }

  yield put(setLocation(nextLocation))

  if (history !== null) {
    if (isNotTheSameLocations((history as RouterHistory).location, nextLocation)) {
      if (action.payload.replace) {
        (history as RouterHistory).replace(locationToUrl(nextLocation))
      } else {
        (history as RouterHistory).push(locationToUrl(nextLocation))
      }
    }
  }

  yield call(applyMatch, { match })
}

export default function createRouterSaga(
  { routes, serverLocation, store }: RoutesParam & { serverLocation?: RouterLocation, store: RootStore}) {
  const ssr = Boolean(serverLocation)
  const applyMatch = createApplyMatch({ routes, ssr })

  if (history) {
    history.listen(location => {
      const currentLocation = getLocation(store.getState())
      if (!currentLocation || isNotTheSameLocations(location, currentLocation)) {
        const match = routes.getMatch(location, store.getState)
        store.dispatch(goTo(match))
      }
    })
  }

  return function* routerSaga(): SagaIterator {
    let startLocation = serverLocation
    if (!startLocation) {
      if (typeof window === 'object' && window.location) {
        startLocation = {
          pathname: window.location.pathname,
          search: window.location.search,
        }
      } else {
        throw new Error('You must provide serverLocation')
      }
    }

    if (ssr) {
      yield put(setLocation(startLocation))
      const match = routes.getMatch(startLocation, store.getState)
      const { notFoundAction, goToAction } = yield race({
        _: call(applyMatch, { match }),
        notFoundAction: take(getType(notFound)),
        goToAction: take(getType(goTo)),
      })

      if (notFoundAction) {
        yield put(setServerResponse({ status: 404 }))
        yield call(setFallbackMatch, { routes, applyMatch })
      } else if (goToAction) {
        const location = getUrlFromGoToAction(
          { routes, getState: store.getState },
          goToAction as ActionType<typeof goTo>,
        )
        yield put(setServerResponse({
          location,
          status: goToAction.payload.replace ? 301 : 302,
        }))
      } else if (routes.isFallbackPath(match.path)) {
        yield put(setServerResponse({ status: 404 }))
      } else {
        yield put(setServerResponse({ status: 200 }))
      }
      return
    }

    const params = { routes, applyMatch, getState: store.getState }

    yield takeLatest(getType(notFound), handleNotFound, params)
    yield takeLatest(getType(goTo), handleGoTo, params)
    yield takeLatest(getType(goBack), handleGoBack)

    const currentMatch = yield select(getMatch)
    if (currentMatch.path.length === 0) {
      const match = routes.getMatch(startLocation, store.getState)
      yield put(goTo({ path: match.path, params: match.params }))
    } else {
      yield call(applyMatch, { match: currentMatch })
    }
  }
}
