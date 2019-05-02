import { getType } from 'typesafe-actions';
import * as actions from './actions';
const initialState = {
    match: { path: [], params: {} },
    serverResponse: { status: 200 },
    location: null,
};
export default function routerReducer(state = initialState, action) {
    switch (action.type) {
        case getType(actions.setMatch):
            return Object.assign({}, state, { match: Object.assign({}, action.payload) });
        case getType(actions.setServerResponse):
            return Object.assign({}, state, { serverResponse: Object.assign({}, action.payload) });
        case getType(actions.setLocation):
            return Object.assign({}, state, { location: action.payload });
        default:
            return state;
    }
}
//# sourceMappingURL=reducer.js.map