import React from 'react';
import invariant from 'invariant';
import { RouterProviderContext } from './contexts';
import history from '../history';
const isModifiedEvent = (event) => Boolean(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
class Link extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {};
        this.onClick = (event) => {
            if (!event.defaultPrevented &&
                event.button === 0 &&
                !this.props.target &&
                !isModifiedEvent(event)) {
                event.preventDefault();
                if (history) {
                    if (Boolean(this.props.replace)) {
                        history.replace(this.state.href);
                    }
                    else {
                        history.push(this.state.href);
                    }
                }
            }
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        invariant(nextProps.to, 'You must specify the "to" property');
        if (prevState.propsTo !== nextProps.to || prevState.propsParams !== nextProps.params) {
            const to = Array.isArray(nextProps.to) ? nextProps.to : nextProps.to.split('.');
            const params = nextProps.params || {};
            return {
                to,
                params,
                propsTo: nextProps.to,
                propsParams: nextProps.params,
                href: nextProps.buildUrl(to, params),
            };
        }
        return null;
    }
    render() {
        const { className, children, style } = this.props;
        const { href } = this.state;
        return (React.createElement("a", { href: href, onClick: this.onClick, className: className, style: style }, children));
    }
}
Link.defaultProps = {
    replace: false,
};
const LinkWithBuildUrl = props => {
    return (React.createElement(RouterProviderContext.Consumer, null, ({ buildUrl }) => {
        return React.createElement(Link, Object.assign({}, props, { buildUrl: buildUrl }));
    }));
};
export default LinkWithBuildUrl;
//# sourceMappingURL=Link.js.map