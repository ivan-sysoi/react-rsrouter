import { call, take, takeLatest, select, race, put } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';
import history from '../../history';
import { goTo, notFound, redirect, setServerResponse } from '../actions';
import { selectMatch } from '../selectors';
import { urlToRouterLocation } from '../../utils';
import { createApplyMatch } from './routes';
function* setFallbackMatch({ routes, applyMatch }) {
    const match = yield select(selectMatch);
    const fallbackMatch = routes.getFallbackMatch(match.path);
    yield call(applyMatch, { match: fallbackMatch });
}
function* handleNotFound({ routes, applyMatch }, action) {
    yield call(setFallbackMatch, { routes, applyMatch });
}
function* handleGoTo({ applyMatch }, action) {
    yield call(applyMatch, { match: action.payload });
}
function* handleRedirect({ routes, applyMatch, getState }, action) {
    const match = routes.getMatch(urlToRouterLocation(action.payload.location), getState);
    yield call(applyMatch, { match });
}
export function createRouterSaga({ routes, serverLocation, store, }) {
    const ssr = Boolean(serverLocation);
    const applyMatch = createApplyMatch({ routes });
    if (history) {
        history.listen(location => {
            const match = routes.getMatch(location, store.getState);
            store.dispatch(goTo(match));
        });
    }
    return function* routerSaga() {
        let startLocation = serverLocation;
        if (!startLocation) {
            if (typeof window === 'object' && window.location) {
                startLocation = window.location;
            }
            else {
                throw new Error('You must provide serverLocation');
            }
        }
        if (ssr) {
            const match = routes.getMatch(startLocation, store.getState);
            const { notFoundAction, redirectAction } = yield race({
                _: call(applyMatch, { match }),
                notFoundAction: take(getType(notFound)),
                redirectAction: take(getType(redirect)),
            });
            if (notFoundAction) {
                yield put(setServerResponse({ status: 404 }));
                yield call(setFallbackMatch, { routes, applyMatch });
            }
            else if (redirectAction) {
                yield put(setServerResponse(redirectAction.payload));
            }
            else {
                yield put(setServerResponse({ status: 200 }));
            }
            return;
        }
        yield takeLatest(getType(notFound), handleNotFound, { routes, applyMatch });
        yield takeLatest(getType(goTo), handleGoTo, { applyMatch });
        yield takeLatest(getType(redirect), handleRedirect, { routes, applyMatch, getState: store.getState });
        const currentMatch = yield select(selectMatch);
        if (currentMatch.path.length === 0) {
            const match = routes.getMatch(startLocation, store.getState);
            store.dispatch(goTo(match));
        }
    };
}
//# sourceMappingURL=index.js.map