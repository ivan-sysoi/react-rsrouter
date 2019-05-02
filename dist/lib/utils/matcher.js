export function matchLocation(route, location, context) {
    switch (route.type) {
        case 'static': {
            const routeExpectsExactMatch = route.path.endsWith('$');
            const routePath = routeExpectsExactMatch ? route.path.slice(0, -1) : route.path;
            if (routeExpectsExactMatch && routePath === location.pathname) {
                return {
                    nextLocation: null,
                };
            }
            if (location.pathname.startsWith(routePath)) {
                const hasNested = Array.isArray(route.routes) && route.routes.length > 0;
                const case1 = routeExpectsExactMatch && hasNested && location.pathname[routePath.length] === '/';
                const case2 = !routeExpectsExactMatch && hasNested;
                if (case1 || case2) {
                    return {
                        nextLocation: Object.assign({}, location, { pathname: location.pathname.slice(routePath.length) }),
                    };
                }
            }
            return null;
        }
        case 'dynamic': {
            return route.pathMatcher(location, context);
        }
        case 'fallback': {
            return {
                nextLocation: null,
            };
        }
        default: {
            throw new Error(`Unknown route schema:\n${JSON.stringify(route, null, 4)}`);
        }
    }
}
//# sourceMappingURL=matcher.js.map