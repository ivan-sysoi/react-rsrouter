import * as React from 'react'
import { connect } from 'react-redux'
import * as invariant from 'invariant'

import { RouterProviderContext, RouteContext } from './contexts'
import { stateGetter, RootState, selectMatch } from '../store'
import { IRoutesCollection } from '../utils/routes'
import { RouteParams, RoutePath, Match } from '../.'

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
    if (this.props.match) {
      return (
        <RouterProviderContext.Provider value={{ buildUrl: this.buildUrl }}>
          <RouteContext.Provider value={{ path: this.props.match.path }}>{this.props.children}</RouteContext.Provider>
        </RouterProviderContext.Provider>
      )
    }
    return null
  }
}

const stateToProps = (state: RootState) => {
  invariant(state.router, 'Router state is not found. You must attach it under "router" key.')
  return {
    match: selectMatch(state),
    getState: () => state,
  }
}
export const ConnectedRouterProvider = connect(stateToProps)(RouterProvider)

export default ConnectedRouterProvider
