import { Match, RouteParams, RouterLocation } from '..';
import { RouteSchema } from './routes';
export interface MatcherContext {
    getState: () => object;
    match: Match;
}
export declare type LocationFullMatch = {
    params?: RouteParams;
    nextLocation: null;
};
export declare type LocationPartResult = {
    params?: RouteParams;
    nextLocation: RouterLocation;
};
export declare type LocationNoMatch = null;
export declare type MatcherResult = LocationFullMatch | LocationPartResult | LocationNoMatch;
export declare function matchLocation(route: RouteSchema, location: RouterLocation, context: MatcherContext): MatcherResult;
