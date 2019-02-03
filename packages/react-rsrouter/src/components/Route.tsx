import * as React from 'react'

import { RouteContext, RouteContextValues } from './contexts'

interface RouteProps {
  id: string
  render?: () => React.ReactNode
}

interface RouteContextProps {
  path: string[]
}

class RouteComponent extends React.PureComponent<RouteProps & RouteContextProps> {
  render() {
    const { id, path, render, children } = this.props

    if (path.length > 0 && id === path[0]) {
      return (
        <RouteContext.Provider
          value={{
            path: path.slice(1),
          }}
        >
          {render ? render() : children}
        </RouteContext.Provider>
      )
    }
    return null
  }
}

export default (props: RouteProps) => (
  <RouteContext.Consumer>
    {({ path }: RouteContextValues) => <RouteComponent {...props} path={path} />}
  </RouteContext.Consumer>
)
