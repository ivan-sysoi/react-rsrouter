import React from 'react';
import { connect } from 'react-redux';
import invariant from 'invariant';
import { RouterProviderContext, RouteContext } from './contexts';
import { getMatch } from '../store';
import Routes from './Routes';
export class RouterProvider extends React.Component {
    constructor() {
        super(...arguments);
        this.buildUrl = (to, params) => {
            return this.props.routes.buildUrl(to, params, this.props.getState);
        };
    }
    render() {
        const { match, routes, children } = this.props;
        if (match && match.path.length > 0) {
            return (React.createElement(RouterProviderContext.Provider, { value: { buildUrl: this.buildUrl } },
                React.createElement(RouteContext.Provider, { value: { path: match.path } }, children ? children : React.createElement(Routes, { routes: routes }))));
        }
        return null;
    }
}
const stateToProps = (state) => {
    invariant(state.router, 'Router state is not found. You must attach it under "router" key.');
    return {
        match: getMatch(state),
        getState: () => state,
    };
};
export const ConnectedRouterProvider = connect(stateToProps)(RouterProvider);
export default ConnectedRouterProvider;
//# sourceMappingURL=RouterProvider.js.map