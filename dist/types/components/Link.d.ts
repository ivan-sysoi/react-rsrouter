import React from 'react';
import { RouteParams, RoutePath } from '../';
declare type propsTo = RoutePath | string;
interface LinkProps {
    to: propsTo;
    params?: RouteParams;
    target?: string;
    replace?: boolean;
    className?: string;
    style?: {};
}
declare const LinkWithBuildUrl: React.FunctionComponent<LinkProps>;
export default LinkWithBuildUrl;
