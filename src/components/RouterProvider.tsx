import React from 'react'
import { connect } from 'react-redux'
import invariant from 'invariant'

import { RouterProviderContext, RouteContext } from './contexts'
import { stateGetter, RootState, getMatch } from '../store'
import { IRoutesCollection } from '../utils'
import { RouteParams, RoutePath, Match } from '../.'
import Routes from './Routes'

export interface RouterProviderProps {
  routes: IRoutesCollection
  match: Match
  getState: stateGetter
}

export class RouterProvider extends React.Component<RouterProviderProps> {
  buildUrl = (to: RoutePath, params: RouteParams): string => {
    return this.props.routes.buildUrl(to, params, this.props.getState)
  }

  render() {
    const { match, routes, children } = this.props
    if (match && match.path.length > 0) {
      return (
        <RouterProviderContext.Provider value={{ buildUrl: this.buildUrl }}>
          <RouteContext.Provider value={{ path: match.path }}>
            {children ? children : <Routes routes={routes} />}
          </RouteContext.Provider>
        </RouterProviderContext.Provider>
      )
    }
    return null
  }
}

const stateToProps = (state: RootState) => {
  invariant(state.router, 'Router state is not found. You must attach it under "router" key.')
  return {
    match: getMatch(state),
    getState: () => state,
  }
}
export const ConnectedRouterProvider = connect(stateToProps)(RouterProvider)

export default ConnectedRouterProvider
