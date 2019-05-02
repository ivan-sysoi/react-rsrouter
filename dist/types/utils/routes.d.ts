import * as React from 'react';
import { Saga } from 'redux-saga';
import { stateGetter } from '../store';
import { RouterLocation, RoutePath, RouteParams, Match } from '..';
import { MatcherResult, MatcherContext } from './matcher';
export interface BuildUrlContext {
    getState: stateGetter;
}
export interface OptionalNestedRoutes {
    routes?: RouteSchema[];
}
export interface NestedRoutes {
    routes: RouteSchema[];
}
export interface BaseRouteSchema {
    id: string;
    component?: React.ElementType;
    onEnter?: Saga;
}
export interface StaticRouteSchema extends BaseRouteSchema, OptionalNestedRoutes {
    type: 'static';
    path: string;
}
export interface DynamicRouteSchema extends BaseRouteSchema, OptionalNestedRoutes {
    type: 'dynamic';
    pathMatcher: (location: RouterLocation, context: MatcherContext) => MatcherResult;
    buildUrl: (params: RouteParams, context: BuildUrlContext) => string;
}
export interface FallbackRouteSchema {
    id: string;
    type: 'fallback';
    component?: React.ElementType;
}
export declare type RouteSchema = StaticRouteSchema | DynamicRouteSchema | FallbackRouteSchema;
export declare type RouteSchemaSchemaWithNested = RouteSchema & NestedRoutes;
export interface IRoutesCollection {
    getRouteSchemas(path: RoutePath): IterableIterator<RouteSchema>;
    getMatch(location: RouterLocation, getState: stateGetter): Match;
    getFallbackMatch(path?: RoutePath): Match;
    isFallbackPath(path: RoutePath): boolean;
    buildUrl(path: RoutePath, params: RouteParams, getState: stateGetter): string;
    getRouteSchemaById(routeId: string): RouteSchema;
    hasRoute(routeId: string): boolean;
    getRouteNestedCollection(routeId: string): RoutesCollection;
    routeSchemaHasNested(routeId: string): boolean;
}
export declare class RoutesCollection implements IRoutesCollection {
    protected readonly routesMap: Map<string, RouteSchema>;
    protected readonly nestedMap: Map<string, RoutesCollection>;
    protected readonly parentCollection: RoutesCollection | void;
    protected readonly parentRouteSchema: RouteSchema | void;
    protected readonly fallbackId: string | null;
    constructor(routeSchemas: RouteSchema[], parentCollection?: RoutesCollection, parentRouteSchema?: RouteSchema);
    hasRoute(routeId: string): boolean;
    getRouteSchemaById(routeId: string): RouteSchema;
    routeSchemaHasNested(routeId: string): boolean;
    getRouteNestedCollection(routeId: string): RoutesCollection;
    private traverse;
    getMatch(location: RouterLocation, getState: stateGetter): Match;
    getRouteSchemas(path: RoutePath): IterableIterator<RouteSchema>;
    private getRouteFullPath;
    getFallbackMatch(path?: RoutePath): Match;
    isFallbackPath(path: RoutePath): boolean;
    buildUrl(path: RoutePath, params: RouteParams, getState: stateGetter): string;
}
