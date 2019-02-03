import { StateType, ActionType, getType, isOfType } from 'typesafe-actions'
import { Store } from 'redux'

import * as actions from './actions'
import { Match, ServerResponse } from '../.'

export type RootAction = ActionType<typeof actions>
export type RootState = { router: StateType<typeof routerReducer> }
export type RootStore = Store<RootState>
export type stateGetter = () => RootState

const initialState = {
  match: { path: [], params: {} },
  serverResponse: { status: 200 },
}

export default function routerReducer(state = initialState, action: RootAction) {
  switch (action.type) {
    case getType(actions.setMatch):
      return {
        ...state,
        match: {
          ...(action as ActionType<typeof actions.setMatch>).payload,
        },
      }
    case getType(actions.setServerResponse):
      return {
        ...state,
        serverResponse: {
          ...(action as ActionType<typeof actions.setServerResponse>).payload,
        },
      }
    default:
      return state
  }
}
