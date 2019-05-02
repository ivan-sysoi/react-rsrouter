var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import { createStandardAction, createAction } from 'typesafe-actions';
export const goTo = createStandardAction('@rs_router/GO_TO')
    .map((_a) => {
    var { replace = false } = _a, payload = __rest(_a, ["replace"]);
    if ('url' in payload) {
        return { payload: Object.assign({}, payload, { replace }) };
    }
    const { path, params } = payload;
    return { payload: { path, replace, params: params || {} } };
});
export const setMatch = createStandardAction('@rs_router/MATCH_SET')
    .map((payload) => ({ payload }));
export const setLocation = createStandardAction('@rs_router/LOCATION_SET')
    .map((payload) => ({ payload }));
export const notFound = createAction('@rs_router/NOT_FOUND');
export const goBack = createAction('@rs_router/GO_BACK');
export const setServerResponse = createStandardAction('@rs_router/SERVER_RESPONSE_SET')
    .map((payload) => ({ payload }));
//# sourceMappingURL=actions.js.map