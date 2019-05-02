export * from './components'
export * from './store'
export * from './utils'

export type RoutePath = string[]
export interface RouteParams {
  [paramName: string]: any
}
export interface Match {
  path: RoutePath
  params: RouteParams
}

export type ServerResponse = { status: number; location?: string }

export interface RouterLocation {
  pathname: string
  search: string
}
