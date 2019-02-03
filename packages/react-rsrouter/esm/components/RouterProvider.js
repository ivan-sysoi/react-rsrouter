import * as React from 'react';
import { connect } from 'react-redux';
import * as invariant from 'invariant';
import { RouterProviderContext, RouteContext } from './contexts';
import { selectMatch } from '../store';
export class RouterProvider extends React.Component {
    constructor() {
        super(...arguments);
        this.buildUrl = (to, params) => {
            return this.props.routes.buildUrl(to, params, this.props.getState);
        };
    }
    render() {
        if (this.props.match) {
            return (React.createElement(RouterProviderContext.Provider, { value: { buildUrl: this.buildUrl } },
                React.createElement(RouteContext.Provider, { value: { path: this.props.match.path } }, this.props.children)));
        }
        return null;
    }
}
const stateToProps = (state) => {
    invariant(state.router, 'Router state is not found. You must attach it under "router" key.');
    return {
        match: selectMatch(state),
        getState: () => state,
    };
};
export const ConnectedRouterProvider = connect(stateToProps)(RouterProvider);
export default ConnectedRouterProvider;
//# sourceMappingURL=RouterProvider.js.map