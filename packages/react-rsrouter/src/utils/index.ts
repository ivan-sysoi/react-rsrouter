import { RouterLocation } from '..'

export * from './routes'
export * from './matcher'

export const isDiffLocations = (loc1: RouterLocation, loc2: RouterLocation): boolean =>
  loc1.pathname !== loc2.pathname || loc1.search !== loc2.search

export const locationToUrl = (location: RouterLocation): string =>
  `${location.pathname}${location.search ? `?${location.search}` : ''}`

export const urlToRouterLocation = (url: string): RouterLocation => {
  const [pathname, search] = url.split('?')
  return { pathname, search }
}
