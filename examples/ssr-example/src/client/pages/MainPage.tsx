import * as React from 'react'
import { Route, StaticRouteSchema } from 'react-rsrouter'

const route: StaticRouteSchema = {
  id: 'main',
  path:'/$',
  type: 'static',
}

class MainPage extends React.Component {

  static route = route

  render() {
    return (
      <Route
        {...route}
      >
        <h2>Main page</h2>
      </Route>
    )
  }
}

export default MainPage
