export * from './routes';
export * from './matcher';
export const urlToRouterLocation = (url) => {
    if (url) {
        const [pathname, ...rest] = url.split('?');
        return { pathname, search: rest.join('?') };
    }
    return { pathname: '', search: '' };
};
//# sourceMappingURL=index.js.map