import { RoutesCollection } from './routes';
import { urlToRouterLocation } from '.';
describe('RoutesCollection', () => {
    const dummyGetState = () => ({
        router: {
            match: { path: [], params: {} },
            serverResponse: { status: 200 },
            location: null,
        },
    });
    const routesSchema = [
        {
            id: 'index',
            type: 'static',
            path: '/$',
        },
        {
            id: 'a',
            type: 'static',
            path: '/a$',
            routes: [
                {
                    id: 'b',
                    type: 'static',
                    path: '/b',
                    routes: [
                        {
                            id: 'c',
                            type: 'static',
                            path: '/c$',
                        },
                        {
                            id: 'c404',
                            type: 'fallback',
                        },
                    ],
                },
                {
                    id: 'b404',
                    type: 'fallback',
                },
            ],
        },
        {
            id: 'articles',
            type: 'static',
            path: '/articles',
            routes: [
                {
                    id: 'list',
                    type: 'dynamic',
                    buildUrl(params, context) {
                        return params.rubricSlug ? `/${params.rubricSlug}` : '';
                    },
                    pathMatcher(location, context) {
                        if (location.pathname === '') {
                            return {
                                nextLocation: null,
                                params: {
                                    rubricSlug: null,
                                },
                            };
                        }
                        const pathMatch = location.pathname.match(/^\/(sport|news)/);
                        if (pathMatch) {
                            if (pathMatch[0].length === location.pathname.length) {
                                return {
                                    nextLocation: null,
                                    params: {
                                        rubricSlug: pathMatch[1],
                                    },
                                };
                            }
                            return {
                                nextLocation: Object.assign({}, location, { pathname: location.pathname.replace(pathMatch[0], '') }),
                                params: {
                                    rubricSlug: pathMatch[1],
                                },
                            };
                        }
                        return null;
                    },
                    routes: [
                        {
                            id: 'detail',
                            type: 'dynamic',
                            buildUrl(params, context) {
                                return `/${params.articleSlug}`;
                            },
                            pathMatcher(location, context) {
                                const pathMatch = location.pathname.match(/^\/([\w-]+)$/);
                                if (pathMatch) {
                                    return {
                                        nextLocation: null,
                                        params: {
                                            articleSlug: pathMatch[1],
                                        },
                                    };
                                }
                                return null;
                            },
                        },
                        {
                            id: 'article404',
                            type: 'fallback',
                        },
                    ],
                },
                {
                    id: 'rubric404',
                    type: 'fallback',
                },
            ],
        },
        {
            id: '404',
            type: 'fallback',
        },
    ];
    const routes = new RoutesCollection(routesSchema);
    const assertGetMatch = (assertions) => {
        for (const [loc, expMatch] of assertions) {
            const match = routes.getMatch(loc, dummyGetState);
            try {
                expect(match).toEqual(expMatch);
            }
            catch (e) {
                console.log('Location: %s\nValid Match: %s', JSON.stringify(loc, null, 4), JSON.stringify(expMatch, null, 4));
                throw e;
            }
        }
    };
    const assertBuildUrl = (assertions) => {
        for (const [{ path, params }, expUrl] of assertions) {
            const url = routes.buildUrl(path, params, dummyGetState);
            try {
                expect(url).toEqual(expUrl);
            }
            catch (e) {
                console.log('Path: %s\nParams: %s', JSON.stringify(path, null, 4), JSON.stringify(params, null, 4));
                throw e;
            }
        }
    };
    it('should match correctly static routes', () => {
        const assertions = [
            [
                { pathname: '/a/b/c', search: '' },
                {
                    path: ['a', 'b', 'c'],
                    params: {},
                },
            ],
            [
                { pathname: '/a/b', search: '' },
                {
                    path: ['a', 'b', 'c404'],
                    params: {},
                },
            ],
            [
                { pathname: '/a/ab', search: '' },
                {
                    path: ['a', 'b404'],
                    params: {},
                },
            ],
            [
                { pathname: '/a', search: '' },
                {
                    path: ['a'],
                    params: {},
                },
            ],
            [
                { pathname: '/invalid', search: '' },
                {
                    path: ['404'],
                    params: {},
                },
            ],
        ];
        assertGetMatch(assertions);
    });
    it('should match correctly dynamic routes', () => {
        const assertions = [
            [
                { pathname: '/articles', search: '' },
                {
                    path: ['articles', 'list'],
                    params: {
                        rubricSlug: null,
                    },
                },
            ],
            [
                { pathname: '/articles/sport', search: '' },
                {
                    path: ['articles', 'list'],
                    params: { rubricSlug: 'sport' },
                },
            ],
            [
                { pathname: '/articles/sport/detail-page', search: '' },
                {
                    path: ['articles', 'list', 'detail'],
                    params: { rubricSlug: 'sport', articleSlug: 'detail-page' },
                },
            ],
            [
                { pathname: '/articles/invalid-rubric', search: '' },
                {
                    path: ['articles', 'rubric404'],
                    params: {},
                },
            ],
            [
                { pathname: '/articles/news/!invalid-article-slug', search: '' },
                {
                    path: ['articles', 'list', 'article404'],
                    params: { rubricSlug: 'news' },
                },
            ],
            [
                { pathname: '/articles/', search: '' },
                {
                    path: ['articles', 'rubric404'],
                    params: {},
                },
            ],
        ];
        assertGetMatch(assertions);
    });
    it('should build url correctly for static routes', () => {
        const assertions = [
            [
                {
                    path: ['a', 'b', 'c'],
                    params: {},
                },
                '/a/b/c',
            ],
            [
                {
                    path: ['a', 'b'],
                    params: {},
                },
                '/a/b',
            ],
            [
                {
                    path: ['a'],
                    params: {},
                },
                '/a',
            ],
            [
                {
                    path: ['index'],
                    params: {},
                },
                '/',
            ],
        ];
        assertBuildUrl(assertions);
    });
    it('should build url correctly for dynamic routes', () => {
        const assertions = [
            [
                {
                    path: ['articles', 'list'],
                    params: {},
                },
                '/articles',
            ],
            [
                {
                    path: ['articles', 'list'],
                    params: { rubricSlug: 'sport' },
                },
                '/articles/sport',
            ],
            [
                {
                    path: ['articles', 'list', 'detail'],
                    params: { rubricSlug: 'sport', articleSlug: 'news' },
                },
                '/articles/sport/news',
            ],
        ];
        assertBuildUrl(assertions);
    });
    it('should raise exception on invalid route id', () => {
        expect(() => {
            routes.buildUrl(['invalid'], {}, dummyGetState);
        }).toThrow();
    });
    it('should return nearest fallback match by route path', () => {
        expect(routes.getFallbackMatch()).toEqual({ path: ['404'], params: {} });
        expect(routes.getFallbackMatch(['a', 'b'])).toEqual({ path: ['a', 'b404'], params: {} });
        expect(routes.getFallbackMatch(['a', 'b', 'c'])).toEqual({ path: ['a', 'b', 'c404'], params: {} });
        expect(routes.getFallbackMatch(['articles', 'list'])).toEqual({ path: ['articles', 'rubric404'], params: {} });
        expect(routes.getFallbackMatch(['articles', 'list', 'detail'])).toEqual({
            path: ['articles', 'list', 'article404'],
            params: {},
        });
    });
    it('should return routes schemas array', () => {
        const iterator = routes.getRouteSchemas(['articles', 'list', 'detail']);
        expect(iterator.next().value.id).toEqual('articles');
        expect(iterator.next().value.id).toEqual('list');
        expect(iterator.next().value.id).toEqual('detail');
    });
    it('should return true if route path is fallback', () => {
        expect(routes.isFallbackPath(['404'])).toBeTruthy();
        expect(routes.isFallbackPath(['a', 'b404'])).toBeTruthy();
        expect(routes.isFallbackPath(['a', 'b', 'c404'])).toBeTruthy();
        expect(routes.isFallbackPath(['articles', 'list', 'article404'])).toBeTruthy();
        expect(routes.isFallbackPath(['index'])).toBeFalsy();
        expect(routes.isFallbackPath(['a', 'b'])).toBeFalsy();
        expect(routes.isFallbackPath(['a', 'b', 'c'])).toBeFalsy();
        expect(routes.isFallbackPath(['articles', 'list', 'detail'])).toBeFalsy();
    });
    it('should throw exception on invalid routes schema', () => {
        expect(() => {
            new RoutesCollection();
        }).toThrow();
    });
});
test('urlToRouterLocation', () => {
    expect(urlToRouterLocation('/some/url')).toEqual({
        pathname: '/some/url',
        search: '',
    });
    expect(urlToRouterLocation('/some/url?query=1?123')).toEqual({
        pathname: '/some/url',
        search: '?query=1?123',
    });
    expect(urlToRouterLocation(null)).toEqual({
        pathname: '',
        search: '',
    });
});
//# sourceMappingURL=utils.test.js.map