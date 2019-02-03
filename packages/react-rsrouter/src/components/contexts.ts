import * as React from 'react'
import { RoutePath, RouteParams } from '..';

export interface RouteContextValues {
  path: RoutePath
}

export const RouteContext = React.createContext<RouteContextValues>({
  path: [],
})

export interface RouterProviderContextValues {
  buildUrl: (to: RoutePath, params: RouteParams) => string
}

export const RouterProviderContext = React.createContext<RouterProviderContextValues>({
  buildUrl: (() => {
    throw new Error('RouterProviderContext is not initialized')
  }),
})
