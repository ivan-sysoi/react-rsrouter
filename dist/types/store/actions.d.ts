import { Match, RouterLocation, RouteParams, RoutePath, ServerResponse } from '../';
declare type goToUrlPayloadArg = {
    url: string;
    replace?: boolean;
};
declare type goToToRoutePayloadArg = {
    path: RoutePath;
    params?: RouteParams;
    replace?: boolean;
};
declare type goToPayloadArg = goToUrlPayloadArg | goToToRoutePayloadArg;
declare type goToUrlPayload = {
    payload: {
        url: string;
        replace: boolean;
    };
};
declare type goToToRoutePayload = {
    payload: {
        path: RoutePath;
        params: RouteParams;
        replace: boolean;
    };
};
export declare const goTo: (payload: goToPayloadArg) => ({
    type: string;
} & goToUrlPayload) | ({
    type: string;
} & goToToRoutePayload);
export declare const setMatch: (payload: Match) => {
    type: string;
} & {
    payload: Match;
};
export declare const setLocation: (payload: RouterLocation) => {
    type: string;
} & {
    payload: RouterLocation;
};
export declare const notFound: () => {
    type: "@rs_router/NOT_FOUND";
};
export declare const goBack: () => {
    type: "@rs_router/GO_BACK";
};
export declare const setServerResponse: (payload: ServerResponse) => {
    type: string;
} & {
    payload: ServerResponse;
};
export {};
