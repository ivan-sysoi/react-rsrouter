import { fork, call, cancel, put, select } from 'redux-saga/effects';
import { setMatch } from '../actions';
import { getMatch } from '../selectors';
export default ({ routes, ssr }) => {
    const runTasks = [];
    return function* applyMatch({ match }) {
        const prevMatch = yield select(getMatch);
        yield cancel(runTasks);
        runTasks.splice(0);
        yield put(setMatch(match));
        for (const routeSchema of routes.getRouteSchemas(match.path)) {
            if ('onEnter' in routeSchema) {
                const onEnter = routeSchema.onEnter;
                if (ssr) {
                    yield call(onEnter, { ssr, prevMatch });
                }
                else {
                    runTasks.push(yield fork(onEnter, { ssr, prevMatch }));
                }
            }
        }
    };
};
//# sourceMappingURL=createApplyMatch.js.map