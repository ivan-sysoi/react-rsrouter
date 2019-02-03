export * from './routes';
export * from './matcher';
export const isDiffLocations = (loc1, loc2) => loc1.pathname !== loc2.pathname || loc1.search !== loc2.search;
export const locationToUrl = (location) => `${location.pathname}${location.search ? `?${location.search}` : ''}`;
export const urlToRouterLocation = (url) => {
    const [pathname, search] = url.split('?');
    return { pathname, search };
};
//# sourceMappingURL=index.js.map