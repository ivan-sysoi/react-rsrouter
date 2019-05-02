import { RootState } from './reducer'
import { Match, RoutePath, RouterLocation, ServerResponse } from '../.'

export const getServerResponse = (state: RootState): ServerResponse => state.router.serverResponse
export const getMatch = (state: RootState): Match => state.router.match
export const getMatchPath = (state: RootState): RoutePath => state.router.match.path
export const getLocation = (state: RootState): RouterLocation | null => state.router.location

export const getParams = (state: RootState, paramName?: string): any => {
  const params = state.router.match.params
  if (paramName) {
    return params[paramName]
  }
  return params
}
