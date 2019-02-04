import * as jestValidate from 'jest-validate';
import { matchLocation } from './matcher';
function extendMatch(match, routeId, params) {
    return {
        path: [...match.path, routeId],
        params: {
            ...match.params,
            ...(params ? params : {}),
        },
    };
}
function extendMatcherContext(context, routeId, params) {
    return {
        ...context,
        match: extendMatch(context.match, routeId, params),
    };
}
function validateRouteSchema(route) {
    let routeType;
    if (route && 'type' in route) {
        routeType = route.type;
    }
    switch (routeType) {
        case 'dynamic': {
            jestValidate.validate(route, {
                exampleConfig: {
                    id: 'dynamic-route',
                    type: 'dynamic',
                    pathMatcher(location, context) {
                        return { nextLocation: {}, params: {} };
                    },
                    buildUrl(path, params, context) {
                        return '/some/url';
                    },
                    nested: [],
                    *onEnter() {
                        yield;
                    },
                },
            });
            break;
        }
        case 'static': {
            jestValidate.validate(route, {
                exampleConfig: {
                    id: 'static-route',
                    type: 'static',
                    path: '/some/path$',
                    nested: [],
                    *onEnter() {
                        yield;
                    },
                },
            });
            break;
        }
        case 'fallback':
        default: {
            jestValidate.validate(route, {
                exampleConfig: {
                    id: 'fallback-route',
                    type: 'fallback',
                    *onEnter() {
                        yield;
                    },
                },
            });
            break;
        }
    }
}
export class RoutesCollection {
    constructor(routes, parent) {
        this.fallbackId = null;
        this.parent = parent || null;
        this.routes = new Map();
        this.nested = new Map();
        for (const route of routes) {
            if (route.type === 'fallback') {
                this.fallbackId = route.id;
            }
            else if (Array.isArray(route.nested) && route.nested.length > 0) {
                this.nested.set(route.id, new RoutesCollection(route.nested, { parentRouteId: route.id, collection: this }));
            }
            if (process.env.NODE_ENV !== 'production') {
                validateRouteSchema(route);
            }
            this.routes.set(route.id, Object.freeze(route));
        }
    }
    traverse(location, context) {
        for (const route of this.routes.values()) {
            const matcherResult = matchLocation(route, location, context);
            if (matcherResult !== null) {
                // is not exact match and has nested
                if (matcherResult.nextLocation !== null && this.nested.has(route.id)) {
                    const nestedRoutes = this.nested.get(route.id);
                    const res = nestedRoutes.traverse(matcherResult.nextLocation, extendMatcherContext(context, route.id, matcherResult.params));
                    if (res !== null) {
                        return res;
                    }
                }
                else {
                    return extendMatch(context.match, route.id, matcherResult.params);
                }
            }
        }
        if (this.fallbackId !== null) {
            return extendMatch(context.match, this.fallbackId);
        }
        return null;
    }
    getMatch(location, getState) {
        const res = this.traverse(location, { getState, match: { path: [], params: {} } });
        if (res === null) {
            throw new Error('Route is not found. Did you forget to specify fallback route?');
        }
        return res;
    }
    getRoutes(path) {
        let collection = this;
        let ind = 0;
        return {
            next() {
                if (ind < path.length) {
                    if (!collection) {
                        throw new Error(`Route ${path[ind]} is not found`);
                    }
                    const route = collection.routes.get(path[ind]);
                    if (!route) {
                        throw new Error(`Route ${path[ind]} is not found`);
                    }
                    const res = { done: false, value: route };
                    collection = collection.nested.get(path[ind]);
                    ind += 1;
                    return res;
                }
                // @ts-ignore
                return { done: true, value: null };
            },
            [Symbol.iterator]() {
                return this;
            },
        };
    }
    getRouteFullPath(routeId) {
        let parent = this.parent;
        const path = [routeId];
        while (parent) {
            path.push(parent.parentRouteId);
            parent = parent.collection.parent;
        }
        path.reverse();
        return path;
    }
    getFallbackMatch(path) {
        if (Array.isArray(path) && path.length > 1 && this.nested.has(path[0])) {
            // go into deep to find the most nest collection
            let nestedCollection = this.nested.get(path[0]);
            for (let ind = 1; ind < path.length - 1; ind += 1) {
                if (!nestedCollection.nested.has(path[ind])) {
                    break;
                }
                nestedCollection = nestedCollection.nested.get(path[ind]);
            }
            // go upper, return the first fallback route
            while (nestedCollection) {
                if (nestedCollection.fallbackId !== null) {
                    return {
                        path: nestedCollection.getRouteFullPath(nestedCollection.fallbackId),
                        params: {},
                    };
                }
                if (nestedCollection.parent) {
                    nestedCollection = nestedCollection.parent.collection;
                }
                else {
                    break;
                }
            }
        }
        if (this.fallbackId === null) {
            throw new Error('You must specify at least one fallback route');
        }
        return { path: [this.fallbackId], params: {} };
    }
    isFallbackPath(path) {
        const routes = Array.from(this.getRoutes(path));
        return routes[routes.length - 1].type === 'fallback';
    }
    buildUrl(path, params, getState) {
        let url = '';
        const routeId = path[0];
        const route = this.routes.get(routeId);
        if (route === undefined) {
            throw new Error(`Route ${routeId} is not found`);
        }
        switch (route.type) {
            case 'static': {
                url = route.path.endsWith('$') ? route.path.slice(0, -1) : route.path;
                break;
            }
            case 'dynamic': {
                url = route.buildUrl(params, { getState });
                break;
            }
        }
        if (path.length > 1) {
            if (!this.nested.has(routeId)) {
                throw new Error(`Route ${routeId} hasn't nested routes`);
            }
            const nested = this.nested.get(routeId);
            return `${url}${nested.buildUrl(path.slice(1), params, getState)}`;
        }
        return url;
    }
}
//# sourceMappingURL=routes.js.map