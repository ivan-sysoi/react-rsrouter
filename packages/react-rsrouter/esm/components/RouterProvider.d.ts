import * as React from 'react';
import { stateGetter } from '../store';
import { IRoutesCollection } from '../utils/routes';
import { RouteParams, Match } from '../.';
export interface RouterProviderProps {
    routes: IRoutesCollection;
    match: Match;
    getState: stateGetter;
}
export declare class RouterProvider extends React.Component<RouterProviderProps> {
    buildUrl: (to: string[], params: RouteParams) => string;
    render(): JSX.Element | null;
}
export declare const ConnectedRouterProvider: import("react-redux").ConnectedComponentClass<typeof RouterProvider, Pick<RouterProviderProps, "routes">>;
export default ConnectedRouterProvider;
