import { RouterLocation } from '..';
export * from './routes';
export * from './matcher';
export declare const isDiffLocations: (loc1: RouterLocation, loc2: RouterLocation) => boolean;
export declare const locationToUrl: (location: RouterLocation) => string;
export declare const urlToRouterLocation: (url: string) => RouterLocation;
