import * as React from 'react'
import { Route, FallbackRouteSchema, RouteSchema } from 'react-rsrouter'

const route: FallbackRouteSchema = {
  id: 'not-found',
  type: 'fallback',
}

class ArticleListPage extends React.Component {

  public static route: RouteSchema = route

  render() {  
    return (
      <Route {...route}>
        Article doesn't exist.     
      </Route>
    )
  }
}

export default ArticleListPage
