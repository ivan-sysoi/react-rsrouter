import * as React from 'react';
import * as invariant from 'invariant';
import { RouterProviderContext } from './contexts';
import history from '../history';
const isModifiedEvent = (event) => Boolean(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
class Link extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {};
        this.onClick = (event) => {
            if (!event.defaultPrevented && // onClick prevented default
                event.button === 0 && // ignore everything but left clicks
                !this.props.target && // let browser handle "target=_blank" etc.
                !isModifiedEvent(event) // ignore clicks with modifier keys
            ) {
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
        return (React.createElement("a", { href: this.state.href, onClick: this.onClick }, this.props.children));
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