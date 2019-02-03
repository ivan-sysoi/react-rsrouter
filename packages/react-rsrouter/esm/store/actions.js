import { createStandardAction, createAction } from 'typesafe-actions';
export const goTo = createStandardAction('@rs_router/GO_TO').map((payload) => ({ payload }));
export const setMatch = createStandardAction('@rs_router/SET_MATCH').map((payload) => ({
    payload,
}));
export const notFound = createAction('@rs_router/NOT_FOUND');
export const redirect = createStandardAction('@rs_router/REDIRECT').map((payload) => ({
    payload,
}));
export const setServerResponse = createStandardAction('@rs_router/SERVER_RESPONSE').map((payload) => ({
    payload,
}));
//# sourceMappingURL=actions.js.map