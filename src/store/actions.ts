import { createStandardAction, createAction } from 'typesafe-actions'

import { Match, RouterLocation, RouteParams, RoutePath, ServerResponse } from '../'

type goToUrlPayloadArg = { url: string; replace?: boolean }
type goToToRoutePayloadArg = { path: RoutePath; params?: RouteParams, replace?: boolean }
type goToPayloadArg = goToUrlPayloadArg | goToToRoutePayloadArg

type goToUrlPayload = { payload: { url: string; replace: boolean } }
type goToToRoutePayload = { payload: { path: RoutePath; params: RouteParams, replace: boolean } }
type goToPayload = goToUrlPayload | goToToRoutePayload

export const goTo = createStandardAction<string>('@rs_router/GO_TO')
  .map(({ replace = false, ...payload }: goToPayloadArg): goToPayload => {
    if ('url' in payload) {
      return { payload: { ...payload, replace } }
    }
    const { path, params } = payload
    return { payload: { path, replace, params: params || {}  } }
  })

export const setMatch = createStandardAction<string>('@rs_router/MATCH_SET')
  .map((payload: Match) => ({ payload }))

export const setLocation = createStandardAction<string>('@rs_router/LOCATION_SET')
  .map((payload: RouterLocation) => ({ payload }))

export const notFound = createAction('@rs_router/NOT_FOUND')

export const goBack = createAction('@rs_router/GO_BACK')

export const setServerResponse = createStandardAction<string>('@rs_router/SERVER_RESPONSE_SET')
  .map((payload: ServerResponse) => ({ payload }))
