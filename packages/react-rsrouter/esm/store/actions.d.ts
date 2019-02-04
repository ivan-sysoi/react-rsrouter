import { Match, ServerResponse } from '../';
export declare const goTo: (payload: Match) => {
    type: string;
} & {
    payload: Match;
};
export declare const setMatch: (payload: Match) => {
    type: string;
} & {
    payload: Match;
};
export declare const notFound: () => {
    type: "@rs_router/NOT_FOUND";
};
declare type redirectPayload = {
    location: string;
    replace: boolean;
};
export declare const redirect: (payload: redirectPayload) => {
    type: string;
} & {
    payload: redirectPayload;
};
export declare const setServerResponse: (payload: ServerResponse) => {
    type: string;
} & {
    payload: ServerResponse;
};
export {};
