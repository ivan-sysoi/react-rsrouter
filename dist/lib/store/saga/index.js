import { call, take, takeLatest, select, race, put } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';
import history from '../../history';
import { goTo, notFound, setServerResponse, setLocation, goBack } from '../actions';
import { getMatch, getLocation } from '../selectors';
import { isNotTheSameLocations, urlToRouterLocation, locationToUrl } from '../../utils';
import createApplyMatch from './createApplyMatch';
const getUrlFromGoToAction = ({ routes, getState }, action) => {
    return 'url' in action.payload
        ? action.payload.url
        : routes.buildUrl(action.payload.path, action.payload.params, getState);
};
function* setFallbackMatch({ routes, applyMatch }) {
    const match = yield select(getMatch);
    const fallbackMatch = routes.getFallbackMatch(match.path);
    yield call(applyMatch, { match: fallbackMatch });
}
function* handleNotFound({ routes, applyMatch }, action) {
    yield call(setFallbackMatch, { routes, applyMatch });
}
function handleGoBack() {
    if (history !== null) {
        history.back();
    }
}
function* handleGoTo({ routes, applyMatch, getState }, action) {
    const nextLocation = urlToRouterLocation(getUrlFromGoToAction({ routes, getState }, action));
    let match;
    if ('url' in action.payload) {
        match = routes.getMatch(nextLocation, getState);
    }
    else {
        match = { path: action.payload.path, params: action.payload.params };
    }
    yield put(setLocation(nextLocation));
    if (history !== null) {
        if (isNotTheSameLocations(history.location, nextLocation)) {
            if (action.payload.replace) {
                history.replace(locationToUrl(nextLocation));
            }
            else {
                history.push(locationToUrl(nextLocation));
            }
        }
    }
    yield call(applyMatch, { match });
}
export default function createRouterSaga({ routes, serverLocation, store }) {
    const ssr = Boolean(serverLocation);
    const applyMatch = createApplyMatch({ routes, ssr });
    if (history) {
        history.listen(location => {
            const currentLocation = getLocation(store.getState());
            if (!currentLocation || isNotTheSameLocations(location, currentLocation)) {
                const match = routes.getMatch(location, store.getState);
                store.dispatch(goTo(match));
            }
        });
    }
    return function* routerSaga() {
        let startLocation = serverLocation;
        if (!startLocation) {
            if (typeof window === 'object' && window.location) {
                startLocation = {
                    pathname: window.location.pathname,
                    search: window.location.search,
                };
            }
            else {
                throw new Error('You must provide serverLocation');
            }
        }
        if (ssr) {
            yield put(setLocation(startLocation));
            const match = routes.getMatch(startLocation, store.getState);
            const { notFoundAction, goToAction } = yield race({
                _: call(applyMatch, { match }),
                notFoundAction: take(getType(notFound)),
                goToAction: take(getType(goTo)),
            });
            if (notFoundAction) {
                yield put(setServerResponse({ status: 404 }));
                yield call(setFallbackMatch, { routes, applyMatch });
            }
            else if (goToAction) {
                const location = getUrlFromGoToAction({ routes, getState: store.getState }, goToAction);
                yield put(setServerResponse({
                    location,
                    status: goToAction.payload.replace ? 301 : 302,
                }));
            }
            else if (routes.isFallbackPath(match.path)) {
                yield put(setServerResponse({ status: 404 }));
            }
            else {
                yield put(setServerResponse({ status: 200 }));
            }
            return;
        }
        const params = { routes, applyMatch, getState: store.getState };
        yield takeLatest(getType(notFound), handleNotFound, params);
        yield takeLatest(getType(goTo), handleGoTo, params);
        yield takeLatest(getType(goBack), handleGoBack);
        const currentMatch = yield select(getMatch);
        if (currentMatch.path.length === 0) {
            const match = routes.getMatch(startLocation, store.getState);
            yield put(goTo({ path: match.path, params: match.params }));
        }
        else {
            yield call(applyMatch, { match: currentMatch });
        }
    };
}
//# sourceMappingURL=index.js.map