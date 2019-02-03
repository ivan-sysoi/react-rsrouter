export const selectServerResponse = (state) => state.router.serverResponse;
export const selectMatch = (state) => state.router.match;
// export const selectLocation = (state: RootState): RouterLocation => state.router.location
export const selectParams = (state, paramName) => {
    const params = state.router.match.params;
    if (paramName) {
        return params[paramName];
    }
    return params;
};
//# sourceMappingURL=selectors.js.map