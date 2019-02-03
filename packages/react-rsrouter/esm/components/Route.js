import * as React from 'react';
import { RouteContext } from './contexts';
class RouteComponent extends React.PureComponent {
    render() {
        const { id, path, render, children } = this.props;
        if (path.length > 0 && id === path[0]) {
            return (React.createElement(RouteContext.Provider, { value: {
                    path: path.slice(1),
                } }, render ? render() : children));
        }
        return null;
    }
}
export default (props) => (React.createElement(RouteContext.Consumer, null, ({ path }) => React.createElement(RouteComponent, Object.assign({}, props, { path: path }))));
//# sourceMappingURL=Route.js.map