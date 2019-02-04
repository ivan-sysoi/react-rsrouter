import { Saga } from 'redux-saga';
import { stateGetter } from '../store';
import { RouterLocation, RoutePath, RouteParams, Match } from '..';
import { MatcherResult, MatcherContext } from './matcher';
export interface BuildUrlContext {
    getState: stateGetter;
}
export interface BaseRouteSchema {
    id: string;
    nested?: RouteSchema[];
    onEnter?: Saga;
}
export interface StaticRouteSchema extends BaseRouteSchema {
    type: 'static';
    path: string;
}
export interface DynamicRouteSchema extends BaseRouteSchema {
    type: 'dynamic';
    pathMatcher: (location: RouterLocation, context: MatcherContext) => MatcherResult;
    buildUrl: (params: RouteParams, context: BuildUrlContext) => string;
}
export interface FallbackRouteSchema {
    id: string;
    type: 'fallback';
}
export declare type RouteSchema = StaticRouteSchema | DynamicRouteSchema | FallbackRouteSchema;
export interface IRoutesCollection {
    getRoutes(path: RoutePath): IterableIterator<RouteSchema>;
    traverse(location: RouterLocation, context: MatcherContext): Match | null;
    getMatch(location: RouterLocation, getState: stateGetter): Match;
    getFallbackMatch(path?: RoutePath): Match;
    isFallbackPath(path: RoutePath): boolean;
    buildUrl(path: RoutePath, params: RouteParams, getState: stateGetter): string;
}
export declare type ParentRoutesCollection = {
    parentRouteId: string;
    collection: RoutesCollection;
};
export declare class RoutesCollection implements IRoutesCollection {
    protected readonly routes: Map<string, RouteSchema>;
    protected readonly nested: Map<string, RoutesCollection>;
    protected readonly parent: ParentRoutesCollection | null;
    protected readonly fallbackId: string | null;
    constructor(routes: RouteSchema[], parent?: ParentRoutesCollection);
    traverse(location: RouterLocation, context: MatcherContext): Match | null;
    getMatch(location: RouterLocation, getState: stateGetter): Match;
    getRoutes(path: RoutePath): IterableIterator<RouteSchema>;
    private getRouteFullPath;
    getFallbackMatch(path?: RoutePath): Match;
    isFallbackPath(path: RoutePath): boolean;
    buildUrl(path: RoutePath, params: RouteParams, getState: stateGetter): string;
}
