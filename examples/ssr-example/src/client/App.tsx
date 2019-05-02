import * as React from 'react'
import { Provider } from 'react-redux'
import { hot } from 'react-hot-loader/root'
import { RouterProvider, Routes } from 'react-rsrouter'

import { RootStore } from 'store'
import Nav from './layout/Nav'
import routes from './routes'

function App() {
  return (
    <>
      <header>
        <h1>React-rs-router ssr example</h1>
        <Nav />
      </header>
      <div className="page">
        <Routes routes={routes} />
      </div>
      <footer>
        <Nav />
        <div>react-rsrouter, ssr-example</div>
      </footer>
    </>
  )
}

const AppRoot = ({ store }: { store: RootStore }) => (
  <Provider store={store}>
    <RouterProvider routes={routes}>
      <App/>
    </RouterProvider>
  </Provider>
)

export default hot(AppRoot)
