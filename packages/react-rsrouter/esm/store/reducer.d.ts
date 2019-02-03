import { StateType, ActionType } from 'typesafe-actions';
import { Store } from 'redux';
import * as actions from './actions';
export declare type RootAction = ActionType<typeof actions>;
export declare type RootState = {
    router: StateType<typeof routerReducer>;
};
export declare type RootStore = Store<RootState>;
export declare type stateGetter = () => RootState;
export default function routerReducer(state: {
    match: {
        path: never[];
        params: {};
    };
    serverResponse: {
        status: number;
    };
} | undefined, action: RootAction): {
    match: {
        path: string[];
        params: import("..").RouteParams;
    };
    serverResponse: {
        status: number;
    };
};
