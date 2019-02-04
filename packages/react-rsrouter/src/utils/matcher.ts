import { Match, RouteParams, RouterLocation } from '..'
import { RouteSchema } from './routes'

export interface MatcherContext {
  getState: () => object
  match: Match
}

export type LocationFullMatch = { params?: RouteParams; nextLocation: null }
export type LocationPartResult = { params?: RouteParams; nextLocation: RouterLocation }
export type LocationNoMatch = null
export type MatcherResult = LocationFullMatch | LocationPartResult | LocationNoMatch

export function matchLocation(route: RouteSchema, location: RouterLocation, context: MatcherContext): MatcherResult {
  switch (route.type) {
    case 'static': {
      const routeExpectsExactMatch = route.path.endsWith('$')
      const routePath = routeExpectsExactMatch ? route.path.slice(0, -1) : route.path

      // [routePath=/path$] === "/path"
      if (routeExpectsExactMatch && routePath === location.pathname) {
        return {
          nextLocation: null,
        }
      }
      if (location.pathname.startsWith(routePath)) {
        const hasNested = Array.isArray(route.nested) && route.nested.length > 0

        // case 1: [routePath=/path$]/nested-path
        const case1 = routeExpectsExactMatch && hasNested && location.pathname[routePath.length] === '/'

        // case 2: [routePath=/path]-some/other-path
        const case2 = !routeExpectsExactMatch && hasNested

        if (case1 || case2) {
          return {
            nextLocation: {
              ...location,
              pathname: location.pathname.slice(routePath.length),
            },
          }
        }
      }
      return null
    }
    case 'dynamic': {
      return route.pathMatcher(location, context)
    }
    case 'fallback': {
      return {
        nextLocation: null,
      }
    }
    default: {
      throw new Error(`Unknown route schema:\n${JSON.stringify(route, null, 4)}`)
    }
  }
}
