import * as React from 'react'
import { Provider } from 'react-redux'
import { hot } from 'react-hot-loader/root'
import { Link, RouterProvider, RoutesCollection } from 'react-rsrouter'

import { RootStore } from 'store'
import { MainPage, AboutPage, ArticlesPage, NotFoundPage } from './pages'

export const routes = new RoutesCollection([
  MainPage.route,
  AboutPage.route,
  ArticlesPage.route,
  NotFoundPage.route
])

const Nav = () => {
  return (
    <nav>
      <Link to={MainPage.route.id}>Main</Link>
      <Link to={ArticlesPage.route.id}>Articles</Link>
      <Link to={AboutPage.route.id}>About</Link>
    </nav>
  )
}

class App extends React.Component {
  render() {
    return (
      <>
        <header>
          <h1>React-rs-router ssr example</h1>
          <Nav />
        </header>
        <div className="page">
          <MainPage />
          <AboutPage />
          <ArticlesPage/>
          <NotFoundPage />
        </div>
        <footer>
          <Nav />
          <div>react-rsrouter, ssr-example</div>
        </footer>
      </>
    )
  }
}

const AppRoot = ({ store, ...props }: { store: RootStore }) => (
  <Provider store={store}>
    <RouterProvider routes={routes}>
      <App {...props} />
    </RouterProvider>
  </Provider>
)

export default hot(AppRoot)
