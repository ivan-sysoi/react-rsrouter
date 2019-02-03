import { StateType } from 'typesafe-actions'
import { applyMiddleware, compose, createStore, combineReducers, Store } from 'redux'
import * as reduxSaga from 'redux-saga'
import { reducer as routerReducer, RootState as RouterState } from 'react-rsrouter'

import createSaga from './saga'
import { reducer as rubricsReducer } from './rubrics'
import { reducer as articleReducer } from './articles'

export interface FetchState<T> {
  loading?: boolean
  error?: boolean
  data: T,
}

const reducer = combineReducers({
  router: routerReducer,
  ...rubricsReducer,
  ...articleReducer,
})

export type RootState = StateType<typeof reducer> & RouterState
export type RootStore = Store<RootState>


export async function configureStore(initialState?: RootState, serverLocation?: Location): Promise<RootStore> {
  const sagaMiddleware = reduxSaga.default()

  const enhancers = [applyMiddleware(sagaMiddleware)]
  if (process.env.NODE_ENV === 'development' && typeof window === 'object') {
    let devtools: any = (window as any)['__REDUX_DEVTOOLS_EXTENSION__']
    if (devtools) {
      enhancers.push(devtools())
    }
  }
  const store = createStore(reducer, initialState, compose(...enhancers))

  const rootTask = sagaMiddleware.run(createSaga(store, serverLocation))
  if (serverLocation) {
    await rootTask.toPromise()
  }

  return store
}
