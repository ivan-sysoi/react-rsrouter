import * as React from 'react';
import { RouteParams, RoutePath } from '../';
declare type propsTo = RoutePath | string;
interface LinkProps {
    to: propsTo;
    params?: RouteParams;
    target?: string;
    replace?: boolean;
}
declare const LinkWithBuildUrl: React.SFC<LinkProps>;
export default LinkWithBuildUrl;
