import * as React from 'react'
import { Route, StaticRouteSchema } from 'react-rsrouter'

const route: StaticRouteSchema = {
  id: 'about',
  path: '/about$',
  type: 'static',
}

class AboutPage extends React.Component {

  static route = route

  render() {
    return (
      <Route
        {...route}
      >
        <h2>About page</h2>
      </Route>
    )
  }
}

export default AboutPage
