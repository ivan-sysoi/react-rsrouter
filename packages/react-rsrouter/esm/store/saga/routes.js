import { fork, cancel, put } from 'redux-saga/effects';
import { setMatch } from '../actions';
export const createApplyMatch = ({ routes }) => {
    const runTasks = [];
    return function* applyMatch({ match }) {
        while (runTasks.length > 0) {
            yield cancel(runTasks.pop());
        }
        yield put(setMatch(match));
        for (const route of routes.getRoutes(match.path)) {
            if ('onEnter' in route) {
                const onEnter = route.onEnter;
                runTasks.push(yield fork(onEnter, { ssr: false }));
            }
        }
    };
};
//# sourceMappingURL=routes.js.map