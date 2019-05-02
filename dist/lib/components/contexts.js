import React from 'react';
export const RouteContext = React.createContext({
    path: [],
});
export const RouterProviderContext = React.createContext({
    buildUrl: (() => {
        throw new Error('RouterProviderContext is not initialized');
    }),
});
//# sourceMappingURL=contexts.js.map