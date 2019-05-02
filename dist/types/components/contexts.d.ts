import React from 'react';
import { RoutePath, RouteParams } from '..';
export interface RouteContextValues {
    path: RoutePath;
}
export declare const RouteContext: React.Context<RouteContextValues>;
export interface RouterProviderContextValues {
    buildUrl: (to: RoutePath, params: RouteParams) => string;
}
export declare const RouterProviderContext: React.Context<RouterProviderContextValues>;
