import { getType } from 'typesafe-actions';
import * as actions from './actions';
const initialState = {
    match: { path: [], params: {} },
    serverResponse: { status: 200 },
};
export default function routerReducer(state = initialState, action) {
    switch (action.type) {
        case getType(actions.setMatch):
            return {
                ...state,
                match: {
                    ...action.payload,
                },
            };
        case getType(actions.setServerResponse):
            return {
                ...state,
                serverResponse: {
                    ...action.payload,
                },
            };
        default:
            return state;
    }
}
//# sourceMappingURL=reducer.js.map