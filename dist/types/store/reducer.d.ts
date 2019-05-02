import { StateType, ActionType } from 'typesafe-actions';
import { Store } from 'redux';
import * as actions from './actions';
import { RouteParams } from '../index';
export declare type RootAction = ActionType<typeof actions>;
export declare type RootState = {
    router: StateType<typeof routerReducer>;
};
export declare type RootStore = Store<RootState>;
export declare type stateGetter = () => RootState;
export default function routerReducer(state: {
    match: {
        path: never[];
        params: RouteParams;
    };
    serverResponse: {
        status: number;
    };
    location: null;
} | undefined, action: RootAction): {
    match: {
        path: string[];
        params: RouteParams;
    };
    serverResponse: {
        status: number;
    };
    location: null;
} | {
    location: import("..").RouterLocation;
    match: {
        path: never[];
        params: RouteParams;
    };
    serverResponse: {
        status: number;
    };
};
