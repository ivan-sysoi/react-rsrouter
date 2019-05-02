import * as React from 'react'
import { Saga } from 'redux-saga'
import invariant from 'invariant'

import { stateGetter } from '../store'
import { RouterLocation, RoutePath, RouteParams, Match } from '..'
import { MatcherResult, MatcherContext, matchLocation } from './matcher'

export interface BuildUrlContext {
  getState: stateGetter
}

export interface OptionalNestedRoutes {
  routes?: RouteSchema[]
}

export interface NestedRoutes {
  routes: RouteSchema[]
}

export interface BaseRouteSchema {
  id: string
  component?: React.ElementType,
  onEnter?: Saga
}

export interface StaticRouteSchema extends BaseRouteSchema, OptionalNestedRoutes {
  type: 'static'
  path: string
}

export interface DynamicRouteSchema extends BaseRouteSchema, OptionalNestedRoutes {
  type: 'dynamic'
  pathMatcher: (location: RouterLocation, context: MatcherContext) => MatcherResult
  buildUrl: (params: RouteParams, context: BuildUrlContext) => string
}

export interface FallbackRouteSchema {
  id: string
  type: 'fallback'
  component?: React.ElementType,
}

export type RouteSchema = StaticRouteSchema | DynamicRouteSchema | FallbackRouteSchema

export type RouteSchemaSchemaWithNested = RouteSchema & NestedRoutes

export interface IRoutesCollection {
  getRouteSchemas(path: RoutePath): IterableIterator<RouteSchema>

  getMatch(location: RouterLocation, getState: stateGetter): Match

  getFallbackMatch(path?: RoutePath): Match

  isFallbackPath(path: RoutePath): boolean

  buildUrl(path: RoutePath, params: RouteParams, getState: stateGetter): string

  getRouteSchemaById(routeId: string): RouteSchema

  hasRoute(routeId: string): boolean

  getRouteNestedCollection(routeId: string): RoutesCollection

  routeSchemaHasNested(routeId: string): boolean
}

function extendMatch(match: Match, routeId: string, params?: RouteParams): Match {
  return {
    path: [...match.path, routeId],
    params: {
      ...match.params,
      ...(params ? params : {}),
    },
  }
}

function extendMatcherContext(context: MatcherContext, routeId: string, params?: RouteParams): MatcherContext {
  return {
    ...context,
    match: extendMatch(context.match, routeId, params),
  }
}

const routeHasNested = (routeSchema: RouteSchema): boolean => {
  return 'routes' in routeSchema && Array.isArray(routeSchema.routes) && routeSchema.routes.length > 0
}

export class RoutesCollection implements IRoutesCollection {
  protected readonly routesMap: Map<string, RouteSchema>
  protected readonly nestedMap: Map<string, RoutesCollection>
  protected readonly parentCollection: RoutesCollection | void
  protected readonly parentRouteSchema: RouteSchema | void
  protected readonly fallbackId: string | null

  constructor(routeSchemas: RouteSchema[], parentCollection?: RoutesCollection, parentRouteSchema?: RouteSchema) {
    this.parentCollection = parentCollection
    this.parentRouteSchema = parentRouteSchema

    this.fallbackId = null

    this.routesMap = new Map()
    for (const route of routeSchemas) {
      if (route.type === 'fallback') {
        if (process.env.NODE_ENV !== 'production') {
          invariant(this.fallbackId === null, 'You can specify only one fallback route')
        }
        this.fallbackId = route.id
      }
      this.routesMap.set(route.id, Object.freeze(route))
    }

    this.nestedMap = new Map()
    if (this.parentCollection == null) {
      invariant(this.fallbackId, 'You must specify root fallback route')
    }
  }

  hasRoute(routeId: string): boolean {
    return this.routesMap.has(routeId)
  }

  getRouteSchemaById(routeId: string): RouteSchema {
    const routeSchema = this.routesMap.get(routeId)
    if (!routeSchema) {
      throw new Error(`Route ${routeId} is not found, `
                        + `available routes: ${Array.from(this.routesMap.keys()).join(', ')}`)
    }
    return routeSchema as RouteSchema
  }

  routeSchemaHasNested(routeId: string): boolean {
    const routeSchema = this.getRouteSchemaById(routeId)
    return routeHasNested(routeSchema)
  }

  getRouteNestedCollection(routeId: string): RoutesCollection {
    if (this.nestedMap.has(routeId)) {
      return this.nestedMap.get(routeId) as RoutesCollection
    }
    const routeSchema = this.getRouteSchemaById(routeId)
    if (!routeHasNested(routeSchema)) {
      throw new Error(`Route ${routeId} hasn't nested`)
    }
    const nestedRoutesSchemas = (routeSchema as RouteSchemaSchemaWithNested).routes
    const collection = new RoutesCollection(nestedRoutesSchemas, this, routeSchema)
    this.nestedMap.set(routeId, collection)
    return collection
  }

  private traverse(location: RouterLocation, context: MatcherContext): Match | null {
    for (const route of this.routesMap.values()) {
      const matcherResult = matchLocation(route, location, context)

      if (matcherResult !== null) {
        // is not exact match and has nested
        if (matcherResult.nextLocation && routeHasNested(route)) {
          const nestedRoutesCollection = this.getRouteNestedCollection(route.id)
          const res = nestedRoutesCollection.traverse(
            matcherResult.nextLocation as RouterLocation,
            extendMatcherContext(context, route.id, matcherResult.params),
          )
          if (res !== null) {
            return res
          }
        } else {
          return extendMatch(context.match, route.id, matcherResult.params)
        }
      }
    }
    if (this.fallbackId !== null) {
      return extendMatch(context.match, this.fallbackId)
    }
    return null
  }

  getMatch(location: RouterLocation, getState: stateGetter): Match {
    const res = this.traverse(location, { getState, match: { path: [], params: {} } })
    if (res === null) {
      throw new Error('Route is not found. Did you forget to specify fallback route?')
    }
    return res
  }

  getRouteSchemas(path: RoutePath): IterableIterator<RouteSchema> {
    let collection = this as RoutesCollection
    let ind = 0
    return {
      next() {
        if (ind < path.length) {
          if (!collection) {
            throw new Error(`Route ${path[ind]} is not found`)
          }
          const route = collection.getRouteSchemaById(path[ind])
          const res = { done: false, value: route }
          if (routeHasNested(route)) {
            collection = collection.getRouteNestedCollection(path[ind])
          } else {
            // @ts-ignore
            collection = null as RoutesCollection
          }
          ind += 1
          return res
        }
        // @ts-ignore
        return { done: true, value: null as RouteSchema }
      },
      [Symbol.iterator]() {
        return this
      },
    }
  }

  private getRouteFullPath(routeId: string): RoutePath {
    let parentCollection = this.parentCollection
    let parentRouteSchema = this.parentRouteSchema
    const path = [routeId]
    while (parentCollection && parentRouteSchema) {
      path.push(parentRouteSchema.id)
      parentRouteSchema = (parentCollection as RoutesCollection).parentRouteSchema
      parentCollection = (parentCollection as RoutesCollection).parentCollection
    }
    path.reverse()
    return path
  }

  getFallbackMatch(path?: RoutePath): Match {
    if (Array.isArray(path) && path.length > 1) {
      // go into deep to find the most nest collection
      let nestedCollection = this as RoutesCollection
      for (let ind = 0; ind < path.length - 1; ind += 1) {

        if (!nestedCollection.routeSchemaHasNested(path[ind])) {
          break
        }
        nestedCollection = nestedCollection.getRouteNestedCollection(path[ind])
      }

      // go upper, return the first fallback route
      while (nestedCollection) {
        if (nestedCollection.fallbackId !== null) {
          return {
            path: nestedCollection.getRouteFullPath(nestedCollection.fallbackId),
            params: {},
          }
        }
        nestedCollection = nestedCollection.parentCollection as RoutesCollection
      }
    }
    if (this.fallbackId === null) {
      throw new Error('You must specify at least one fallback route')
    }
    return { path: [this.fallbackId], params: {} }
  }

  isFallbackPath(path: RoutePath): boolean {
    const routes = Array.from(this.getRouteSchemas(path))
    return routes[routes.length - 1].type === 'fallback'
  }

  buildUrl(path: RoutePath, params: RouteParams, getState: stateGetter): string {
    let url = ''
    const routeId = path[0]
    const route = this.getRouteSchemaById(routeId)

    switch (route.type) {
      case 'static': {
        url = route.path.endsWith('$') ? route.path.slice(0, -1) : route.path
        break
      }
      case 'dynamic': {
        url = route.buildUrl(params, { getState })
        break
      }
    }

    if (path.length > 1) {
      const nestedCollection = this.getRouteNestedCollection(routeId)
      url = `${url}${nestedCollection.buildUrl(path.slice(1), params, getState)}`
    }

    if (url.startsWith('//')) {
      url = url.slice(1)
    }

    return url
  }
}
