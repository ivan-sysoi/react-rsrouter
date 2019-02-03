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
                const hasNested = Array.isArray(route.nested) && route.nested.length > 0;
                if (!routeExpectsExactMatch || hasNested) {
                    return {
                        nextLocation: {
                            ...location,
                            pathname: location.pathname.slice(routePath.length),
                        },
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