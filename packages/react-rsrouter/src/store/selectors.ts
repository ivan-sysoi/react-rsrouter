import { RootState } from './reducer'
import { Match, RouterLocation, ServerResponse } from '../.'

export const selectServerResponse = (state: RootState): ServerResponse => state.router.serverResponse
export const selectMatch = (state: RootState): Match => state.router.match
// export const selectLocation = (state: RootState): RouterLocation => state.router.location
export const selectParams = (state: RootState, paramName?: string): any => {
  const params = state.router.match.params
  if (paramName) {
    return params[paramName]
  }
  return params
}
