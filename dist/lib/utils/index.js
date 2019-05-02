export * from './routes';
export * from './matcher';
export const urlToRouterLocation = (url) => {
    if (url) {
        const [pathname, ...rest] = url.split('?');
        const search = rest.length > 0 ? `?${rest.join('?')}` : '';
        return { pathname, search };
    }
    return { pathname: '', search: '' };
};
export const locationToUrl = (location) => `${location.pathname}${location.search}`;
export const isNotTheSameLocations = ({ pathname: pathname1 = '', search: search1 = '' } = { pathname: '', search: '' }, { pathname: pathname2 = '', search: search2 = '' } = { pathname: '', search: '' }) => pathname1 !== pathname2 || search1 !== search2;
//# sourceMappingURL=index.js.map