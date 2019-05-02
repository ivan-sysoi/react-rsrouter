import React from 'react';
import { RouteContext } from './contexts';
const Routes = ({ routes, path }) => {
    if (routes && path.length > 0 && routes.hasRoute(path[0])) {
        const routeSchema = routes.getRouteSchemaById(path[0]);
        const nestRoutes = routes.routeSchemaHasNested(path[0]) ? routes.getRouteNestedCollection(path[0]) : null;
        const Component = routeSchema.component;
        if (Component) {
            return (React.createElement(RouteContext.Provider, { value: { path: path.slice(1) } },
                React.createElement(Component, { routes: nestRoutes })));
        }
        if (nestRoutes) {
            return (React.createElement(RouteContext.Provider, { value: { path: path.slice(1) } },
                React.createElement(Routes, { routes: nestRoutes, path: path.slice(1) })));
        }
    }
    return null;
};
export default (props) => (React.createElement(RouteContext.Consumer, null, ({ path }) => React.createElement(Routes, Object.assign({}, props, { path: path }))));
//# sourceMappingURL=Routes.js.map