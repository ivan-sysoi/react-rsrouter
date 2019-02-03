import { action, createStandardAction, createAction } from 'typesafe-actions'

import { Match, ServerResponse } from '../'

export const goTo = createStandardAction<string>('@rs_router/GO_TO').map((payload: Match) => ({ payload }))

export const setMatch = createStandardAction<string>('@rs_router/SET_MATCH').map((payload: Match) => ({
  payload,
}))

export const notFound = createAction('@rs_router/NOT_FOUND')

type redicrectPayload = { location: string; replace: boolean }
export const redirect = createStandardAction<string>('@rs_router/REDIRECT').map((payload: redicrectPayload) => ({
  payload,
}))

export const setServerResponse = createStandardAction<string>('@rs_router/SERVER_RESPONSE').map(
  (payload: ServerResponse) => ({
    payload,
  }),
)
