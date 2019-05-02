export const getServerResponse = (state) => state.router.serverResponse;
export const getMatch = (state) => state.router.match;
export const getMatchPath = (state) => state.router.match.path;
export const getLocation = (state) => state.router.location;
export const getParams = (state, paramName) => {
    const params = state.router.match.params;
    if (paramName) {
        return params[paramName];
    }
    return params;
};
//# sourceMappingURL=selectors.js.map