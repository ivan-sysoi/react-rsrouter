import { RouterLocation } from '..';
export * from './routes';
export * from './matcher';
export declare const urlToRouterLocation: (url: string) => RouterLocation;
export declare const locationToUrl: (location: RouterLocation) => string;
export declare const isNotTheSameLocations: ({ pathname: pathname1, search: search1 }?: RouterLocation, { pathname: pathname2, search: search2 }?: RouterLocation) => boolean;
