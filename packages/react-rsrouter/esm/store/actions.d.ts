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
declare type redicrectPayload = {
    location: string;
    replace: boolean;
};
export declare const redirect: (payload: redicrectPayload) => {
    type: string;
} & {
    payload: redicrectPayload;
};
export declare const setServerResponse: (payload: ServerResponse) => {
    type: string;
} & {
    payload: ServerResponse;
};
export {};
