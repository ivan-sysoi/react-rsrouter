import invariant from 'invariant';
import { matchLocation } from './matcher';
function extendMatch(match, routeId, params) {
    return {
        path: [...match.path, routeId],
        params: Object.assign({}, match.params, (params ? params : {})),
    };
}
function extendMatcherContext(context, routeId, params) {
    return Object.assign({}, context, { match: extendMatch(context.match, routeId, params) });
}
const routeHasNested = (routeSchema) => {
    return 'routes' in routeSchema && Array.isArray(routeSchema.routes) && routeSchema.routes.length > 0;
};
export class RoutesCollection {
    constructor(routeSchemas, parentCollection, parentRouteSchema) {
        this.parentCollection = parentCollection;
        this.parentRouteSchema = parentRouteSchema;
        this.fallbackId = null;
        this.routesMap = new Map();
        for (const route of routeSchemas) {
            if (route.type === 'fallback') {
                if (process.env.NODE_ENV !== 'production') {
                    invariant(this.fallbackId === null, 'You can specify only one fallback route');
                }
                this.fallbackId = route.id;
            }
            this.routesMap.set(route.id, Object.freeze(route));
        }
        this.nestedMap = new Map();
        if (this.parentCollection == null) {
            invariant(this.fallbackId, 'You must specify root fallback route');
        }
    }
    hasRoute(routeId) {
        return this.routesMap.has(routeId);
    }
    getRouteSchemaById(routeId) {
        const routeSchema = this.routesMap.get(routeId);
        if (!routeSchema) {
            throw new Error(`Route ${routeId} is not found, `
                + `available routes: ${Array.from(this.routesMap.keys()).join(', ')}`);
        }
        return routeSchema;
    }
    routeSchemaHasNested(routeId) {
        const routeSchema = this.getRouteSchemaById(routeId);
        return routeHasNested(routeSchema);
    }
    getRouteNestedCollection(routeId) {
        if (this.nestedMap.has(routeId)) {
            return this.nestedMap.get(routeId);
        }
        const routeSchema = this.getRouteSchemaById(routeId);
        if (!routeHasNested(routeSchema)) {
            throw new Error(`Route ${routeId} hasn't nested`);
        }
        const nestedRoutesSchemas = routeSchema.routes;
        const collection = new RoutesCollection(nestedRoutesSchemas, this, routeSchema);
        this.nestedMap.set(routeId, collection);
        return collection;
    }
    traverse(location, context) {
        for (const route of this.routesMap.values()) {
            const matcherResult = matchLocation(route, location, context);
            if (matcherResult !== null) {
                if (matcherResult.nextLocation && routeHasNested(route)) {
                    const nestedRoutesCollection = this.getRouteNestedCollection(route.id);
                    const res = nestedRoutesCollection.traverse(matcherResult.nextLocation, extendMatcherContext(context, route.id, matcherResult.params));
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
    getRouteSchemas(path) {
        let collection = this;
        let ind = 0;
        return {
            next() {
                if (ind < path.length) {
                    if (!collection) {
                        throw new Error(`Route ${path[ind]} is not found`);
                    }
                    const route = collection.getRouteSchemaById(path[ind]);
                    const res = { done: false, value: route };
                    if (routeHasNested(route)) {
                        collection = collection.getRouteNestedCollection(path[ind]);
                    }
                    else {
                        collection = null;
                    }
                    ind += 1;
                    return res;
                }
                return { done: true, value: null };
            },
            [Symbol.iterator]() {
                return this;
            },
        };
    }
    getRouteFullPath(routeId) {
        let parentCollection = this.parentCollection;
        let parentRouteSchema = this.parentRouteSchema;
        const path = [routeId];
        while (parentCollection && parentRouteSchema) {
            path.push(parentRouteSchema.id);
            parentRouteSchema = parentCollection.parentRouteSchema;
            parentCollection = parentCollection.parentCollection;
        }
        path.reverse();
        return path;
    }
    getFallbackMatch(path) {
        if (Array.isArray(path) && path.length > 1) {
            let nestedCollection = this;
            for (let ind = 0; ind < path.length - 1; ind += 1) {
                if (!nestedCollection.routeSchemaHasNested(path[ind])) {
                    break;
                }
                nestedCollection = nestedCollection.getRouteNestedCollection(path[ind]);
            }
            while (nestedCollection) {
                if (nestedCollection.fallbackId !== null) {
                    return {
                        path: nestedCollection.getRouteFullPath(nestedCollection.fallbackId),
                        params: {},
                    };
                }
                nestedCollection = nestedCollection.parentCollection;
            }
        }
        if (this.fallbackId === null) {
            throw new Error('You must specify at least one fallback route');
        }
        return { path: [this.fallbackId], params: {} };
    }
    isFallbackPath(path) {
        const routes = Array.from(this.getRouteSchemas(path));
        return routes[routes.length - 1].type === 'fallback';
    }
    buildUrl(path, params, getState) {
        let url = '';
        const routeId = path[0];
        const route = this.getRouteSchemaById(routeId);
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
            const nestedCollection = this.getRouteNestedCollection(routeId);
            url = `${url}${nestedCollection.buildUrl(path.slice(1), params, getState)}`;
        }
        if (url.startsWith('//')) {
            url = url.slice(1);
        }
        return url;
    }
}
//# sourceMappingURL=routes.js.map