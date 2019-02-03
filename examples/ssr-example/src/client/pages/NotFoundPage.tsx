import * as React from 'react'
import { Route, FallbackRouteSchema } from 'react-rsrouter'

const route: FallbackRouteSchema = {
  id: 'not-found',
  type: 'fallback',
}

class NotFoundPage extends React.Component {

  static route = route

  render() {
    return (
      <Route
        {...route}
      >
        <h2>Page is not found</h2>
      </Route>
    )
  }
}

export default NotFoundPage
