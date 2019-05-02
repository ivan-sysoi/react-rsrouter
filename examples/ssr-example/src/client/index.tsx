import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { configureStore } from 'store'
import App from './App'

const initialState = (window as any)['__STATE__']

declare var isBrowser: boolean

configureStore(initialState)
  .then((store) => {
    ReactDOM.hydrate(<App store={store}/>, document.getElementById('root'))
  })
