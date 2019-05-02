import React from 'react'

import { RouteContext, RouteContextValues } from './contexts'
import { IRoutesCollection, RouteSchema } from '../utils'

interface RoutesProps {
  routes: IRoutesCollection
}

interface RouteContextProps {
  path: string[]
}

const Routes = ({ routes, path }: RoutesProps & RouteContextProps) => {
  if (routes && path.length > 0 && routes.hasRoute(path[0])) {
    const routeSchema = routes.getRouteSchemaById(path[0])
    const nestRoutes = routes.routeSchemaHasNested(path[0]) ? routes.getRouteNestedCollection(path[0]) : null
    const Component = routeSchema.component as React.ElementType
    if (Component) {
      return (
        <RouteContext.Provider value={{ path: path.slice(1) }}>
          <Component routes={nestRoutes}/>
        </RouteContext.Provider>
      )
    }
    if (nestRoutes) {
      return (
        <RouteContext.Provider value={{ path: path.slice(1) }}>
          <Routes routes={nestRoutes} path={path.slice(1)}/>
        </RouteContext.Provider>
      )
    }

  }
  return null
}

export default (props: RoutesProps) => (
  <RouteContext.Consumer>
    {({ path }: RouteContextValues) => <Routes {...props} path={path}/>}
  </RouteContext.Consumer>
)
